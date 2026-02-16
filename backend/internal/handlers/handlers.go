package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv" // Added

	"github.com/go-chi/chi/v5"
	"github.com/yiaga/abuja-watch/backend/internal/auth" // Added
	"github.com/yiaga/abuja-watch/backend/internal/db"
	"github.com/yiaga/abuja-watch/backend/internal/middleware" // Added
	"github.com/yiaga/abuja-watch/backend/internal/models"
)

// GetAreaCouncils returns the aggregated summary for all Area Councils
func GetAreaCouncils(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, name, state FROM area_councils")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var summaries []models.LGASummary
	for rows.Next() {
		var ac models.AreaCouncil
		if err := rows.Scan(&ac.ID, &ac.Name, &ac.State); err != nil {
			continue
		}

		summary := models.LGASummary{
			ID:                ac.ID,
			Name:              ac.Name,
			State:             ac.State,
			PartyResults:      make(map[string]int),
			IncidentBreakdown: make(map[string]int),
			RiskLevel:         "low",
			LostVoters:        0,
		}

		// Fetch Wards to aggregate data
		wRows, err := db.DB.Query("SELECT id, registered_voters, total_polling_units FROM wards WHERE area_council_id = $1", ac.ID)
		if err == nil {
			var totalCompliance int
			var securityCount int

			for wRows.Next() {
				var wID string
				var regVoters, pus int
				wRows.Scan(&wID, &regVoters, &pus)

				summary.Wards++
				summary.RegisteredVoters += regVoters
				summary.PollingUnits += pus

				// Fetch Ward Result
				var res models.WardResult
				err := db.DB.QueryRow(`
					SELECT 
						accredited_voters, valid_votes, rejected_votes, votes_cast, 
						arrival_time, collation_start_time, security_present,
						ec8b_submitted, ec8c_collated, csrvs_done
					FROM ward_results WHERE ward_id = $1`, wID).Scan(
					&res.AccreditedVoters, &res.ValidVotes, &res.RejectedVotes, &res.VotesCast,
					&res.ArrivalTime, &res.CollationStartTime, &res.SecurityPresent,
					&res.EC8BSubmitted, &res.EC8CCollated, &res.CSRVSDone,
				)

				if err == nil {
					summary.WardsReported++
					summary.AccreditedVoters += res.AccreditedVoters
					summary.VotesCast += res.VotesCast
					summary.ValidVotes += res.ValidVotes
					summary.RejectedVotes += res.RejectedVotes

					if res.SecurityPresent {
						securityCount++
					}

					// Compliance Calculation (Mock logic based on boolean flags)
					wardCompliance := 0
					if res.EC8BSubmitted {
						wardCompliance += 30
					}
					if res.EC8CCollated {
						wardCompliance += 30
					}
					if res.CSRVSDone {
						wardCompliance += 40
					}
					totalCompliance += wardCompliance

					// Late Start / Arrival
					if res.ArrivalTime == "after_6pm" {
						// summary.LateArrivals++ // Field not in struct yet, skipping
					}
					if res.CollationStartTime == "not_started" || res.CollationStartTime == "9_12am" {
						summary.LateStartCount++
					}
				}

				// Fetch Incident Count and Breakdown for Ward
				iRows, err := db.DB.Query("SELECT type, COUNT(*) FROM incidents WHERE ward_id = $1 GROUP BY type", wID)
				if err == nil {
					for iRows.Next() {
						var iType string
						var count int
						iRows.Scan(&iType, &count)
						summary.IncidentCount += count
						summary.IncidentBreakdown[iType] += count
					}
					iRows.Close()
				}

				// Fetch Party Results for Ward
				pRows, err := db.DB.Query("SELECT party_name, score FROM party_results WHERE ward_id = $1", wID)
				if err == nil {
					for pRows.Next() {
						var pName string
						var score int
						pRows.Scan(&pName, &score)
						summary.PartyResults[pName] += score
					}
					pRows.Close()
				}
			}
			wRows.Close()

			if summary.Wards > 0 {
				summary.SecurityPresent = int(float64(securityCount) / float64(summary.Wards) * 100)
				// Average compliance of reported wards
				if summary.WardsReported > 0 {
					summary.ComplianceScore = totalCompliance / summary.WardsReported
				}
			}
		}

		if summary.RegisteredVoters > 0 {
			summary.TurnoutPercent = float64(summary.VotesCast) / float64(summary.RegisteredVoters) * 100
		}

		// Risk Level Logic
		if summary.IncidentCount > 10 {
			summary.RiskLevel = "high"
		} else if summary.IncidentCount > 5 {
			summary.RiskLevel = "medium"
		}

		summaries = append(summaries, summary)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(summaries)
}

// ==========================================
// Auth Handlers
// ==========================================

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string      `json:"token"`
	User  models.User `json:"user"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var user models.User
	err := db.DB.QueryRow("SELECT id, username, password_hash, role FROM users WHERE username = $1", req.Username).Scan(&user.ID, &user.Username, &user.Password, &user.Role)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	if !auth.CheckPasswordHash(req.Password, user.Password) {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := auth.GenerateJWT(fmt.Sprintf("%d", user.ID), user.Role)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Audit Login
	logAudit(user.ID, "LOGIN", "User logged in", r)

	user.Password = "" // Don't send hash back
	json.NewEncoder(w).Encode(LoginResponse{Token: token, User: user})
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Enforce RBAC: Only admin can create users
	// This should be double-checked here even if middleware handles it, as extra safety
	// But middleware.RequireRole("admin") will handle it.

	hash, err := auth.HashPassword(user.Password)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	_, err = db.DB.Exec("INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)", user.Username, hash, user.Role)
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	// Audit
	userID, _ := strconv.Atoi(r.Context().Value(middleware.UserKey).(string))
	logAudit(userID, "CREATE_USER", fmt.Sprintf("Created user %s", user.Username), r)

	w.WriteHeader(http.StatusCreated)
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, username, role, created_at FROM users ORDER BY created_at DESC")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.Username, &u.Role, &u.CreatedAt); err != nil {
			continue
		}
		users = append(users, u)
	}

	json.NewEncoder(w).Encode(users)
}

func GetAuditLogs(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(`
		SELECT a.id, a.user_id, u.username, a.action, a.details, a.ip_address, a.timestamp 
		FROM audit_logs a 
		JOIN users u ON a.user_id = u.id 
		ORDER BY a.timestamp DESC LIMIT 100`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var logs []models.AuditLog
	for rows.Next() {
		var l models.AuditLog
		if err := rows.Scan(&l.ID, &l.UserID, &l.Username, &l.Action, &l.Details, &l.IPAddress, &l.Timestamp); err != nil {
			continue
		}
		logs = append(logs, l)
	}

	json.NewEncoder(w).Encode(logs)
}

// Helper for audit logging
func logAudit(userID int, action, details string, r *http.Request) {
	ip := r.RemoteAddr
	db.DB.Exec("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)", userID, action, details, ip)
}

// GetWards returns the list of wards for a given Area Council with full details
func GetWards(w http.ResponseWriter, r *http.Request) {
	lgaID := chi.URLParam(r, "lgaID")

	// 1. Fetch Wards
	rows, err := db.DB.Query("SELECT id, area_council_id, name, total_polling_units, registered_voters FROM wards WHERE area_council_id = $1", lgaID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var wards []models.WardDetail
	for rows.Next() {
		var ward models.Ward
		if err := rows.Scan(&ward.ID, &ward.AreaCouncilID, &ward.Name, &ward.TotalPollingUnits, &ward.RegisteredVoters); err != nil {
			continue // Skip error rows
		}

		// 2. For each ward, fetch details (N+1 but acceptable for small N=10)
		// Fetch Result
		var result models.WardResult
		result.WardID = ward.ID
		err = db.DB.QueryRow(`
			SELECT 
				arrival_time, collation_start_time, inec_staff, security_present, party_agents,
				ec8b_submitted, ec8c_collated, csrvs_done, votes_announced, agents_countersigned, ec60e_displayed,
				accredited_voters, valid_votes, rejected_votes, votes_cast
			FROM ward_results WHERE ward_id = $1`, ward.ID).Scan(
			&result.ArrivalTime, &result.CollationStartTime, &result.INECStaff, &result.SecurityPresent, &result.PartyAgents,
			&result.EC8BSubmitted, &result.EC8CCollated, &result.CSRVSDone, &result.VotesAnnounced, &result.AgentsCountersigned, &result.EC60EDisplayed,
			&result.AccreditedVoters, &result.ValidVotes, &result.RejectedVotes, &result.VotesCast,
		)
		if err != nil {
		} // Ignore, keep defaults

		// Fetch Party Results
		partyScores := make(map[string]int)
		pRows, err := db.DB.Query("SELECT party_name, score FROM party_results WHERE ward_id = $1", ward.ID)
		if err == nil {
			for pRows.Next() {
				var pName string
				var score int
				pRows.Scan(&pName, &score)
				partyScores[pName] = score
			}
			pRows.Close()
		}

		// Incident Count
		var incidentCount int
		db.DB.QueryRow("SELECT COUNT(*) FROM incidents WHERE ward_id = $1", ward.ID).Scan(&incidentCount)

		// Construct Detail
		detail := models.WardDetail{
			ID:               ward.ID,
			LgaID:            ward.AreaCouncilID,
			Name:             ward.Name,
			PollingUnits:     ward.TotalPollingUnits,
			RegisteredVoters: ward.RegisteredVoters,
			AccreditedVoters: result.AccreditedVoters,
			VotesCast:        result.VotesCast,
			ValidVotes:       result.ValidVotes,
			RejectedVotes:    result.RejectedVotes,
			TurnoutPercent:   0,
			ComplianceScore:  75,
			IncidentCount:    incidentCount,
			DeniedAccess:     false,
			LateStart:        result.CollationStartTime == "not_started" || result.CollationStartTime == "9_12am",
			CancelledPUs:     0,
			SecurityPresent:  result.SecurityPresent,
			ObserverPresent:  true,
			RiskLevel:        "low",
			ArrivalCategory:  result.ArrivalTime,
			StartCategory:    result.CollationStartTime,
			PartyResults:     partyScores,
			Integrity: models.WardIntegrity{
				EC8BSubmitted:       result.EC8BSubmitted,
				EC8CCollated:        result.EC8CCollated,
				CSRVSDone:           result.CSRVSDone,
				VotesAnnounced:      result.VotesAnnounced,
				AgentsCountersigned: result.AgentsCountersigned,
				EC60EDisplayed:      result.EC60EDisplayed,
			},
		}
		if ward.RegisteredVoters > 0 {
			detail.TurnoutPercent = float64(result.VotesCast) / float64(ward.RegisteredVoters) * 100
		}
		wards = append(wards, detail)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(wards)
}

// GetWardDetails returns specific details for a ward including results
func GetWardDetails(w http.ResponseWriter, r *http.Request) {
	wardID := chi.URLParam(r, "wardID")

	// 1. Fetch Ward Basic Info
	var ward models.Ward
	err := db.DB.QueryRow("SELECT id, area_council_id, name, total_polling_units, registered_voters FROM wards WHERE id = $1", wardID).Scan(
		&ward.ID, &ward.AreaCouncilID, &ward.Name, &ward.TotalPollingUnits, &ward.RegisteredVoters,
	)
	if err != nil {
		http.Error(w, "Ward not found", http.StatusNotFound)
		return
	}

	// 2. Fetch Submitted Results (if any)
	var result models.WardResult
	// Initialize with defaults in case no result exists yet
	result.WardID = wardID

	err = db.DB.QueryRow(`
		SELECT 
			arrival_time, collation_start_time, inec_staff, security_present, party_agents,
			ec8b_submitted, ec8c_collated, csrvs_done, votes_announced, agents_countersigned, ec60e_displayed,
			accredited_voters, valid_votes, rejected_votes, votes_cast
		FROM ward_results WHERE ward_id = $1`, wardID).Scan(
		&result.ArrivalTime, &result.CollationStartTime, &result.INECStaff, &result.SecurityPresent, &result.PartyAgents,
		&result.EC8BSubmitted, &result.EC8CCollated, &result.CSRVSDone, &result.VotesAnnounced, &result.AgentsCountersigned, &result.EC60EDisplayed,
		&result.AccreditedVoters, &result.ValidVotes, &result.RejectedVotes, &result.VotesCast,
	)
	if err != nil && err != http.ErrNoCookie { // Ignore no rows error, just use defaults
		// actually sql.ErrNoRows.
	}

	// 3. Fetch Party Results
	partyScores := make(map[string]int)
	rows, err := db.DB.Query("SELECT party_name, score FROM party_results WHERE ward_id = $1", wardID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var pName string
			var score int
			rows.Scan(&pName, &score)
			partyScores[pName] = score
		}
	}

	// 4. Incident Count
	var incidentCount int
	db.DB.QueryRow("SELECT COUNT(*) FROM incidents WHERE ward_id = $1", wardID).Scan(&incidentCount)

	// Construct Response
	response := models.WardDetail{
		ID:               ward.ID,
		LgaID:            ward.AreaCouncilID,
		Name:             ward.Name,
		PollingUnits:     ward.TotalPollingUnits,
		RegisteredVoters: ward.RegisteredVoters,
		AccreditedVoters: result.AccreditedVoters,
		VotesCast:        result.VotesCast,
		ValidVotes:       result.ValidVotes,
		RejectedVotes:    result.RejectedVotes,
		TurnoutPercent:   0,  // Calculate below
		ComplianceScore:  75, // Mock calculation
		IncidentCount:    incidentCount,
		DeniedAccess:     false, // Need field in DB?
		LateStart:        result.CollationStartTime == "not_started" || result.CollationStartTime == "9_12am",
		CancelledPUs:     0,
		SecurityPresent:  result.SecurityPresent,
		ObserverPresent:  true,  // Mock
		RiskLevel:        "low", // Mock calc
		ArrivalCategory:  result.ArrivalTime,
		StartCategory:    result.CollationStartTime,
		PartyResults:     partyScores,
		Integrity: models.WardIntegrity{
			EC8BSubmitted:       result.EC8BSubmitted,
			EC8CCollated:        result.EC8CCollated,
			CSRVSDone:           result.CSRVSDone,
			VotesAnnounced:      result.VotesAnnounced,
			AgentsCountersigned: result.AgentsCountersigned,
			EC60EDisplayed:      result.EC60EDisplayed,
		},
	}

	if ward.RegisteredVoters > 0 {
		response.TurnoutPercent = float64(result.VotesCast) / float64(ward.RegisteredVoters) * 100
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// SubmitLogistics handles the submission of logistics data
func SubmitLogistics(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		WardID             string `json:"ward_id"`
		ArrivalTime        string `json:"arrival_time"`
		CollationStartTime string `json:"collation_start_time"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO ward_results (ward_id, arrival_time, collation_start_time, updated_at)
		VALUES ($1, $2, $3, NOW())
		ON CONFLICT (ward_id) DO UPDATE SET
			arrival_time = EXCLUDED.arrival_time,
			collation_start_time = EXCLUDED.collation_start_time,
			updated_at = NOW()
	`
	_, err := db.DB.Exec(query, payload.WardID, payload.ArrivalTime, payload.CollationStartTime)
	if err != nil {
		http.Error(w, "Failed to save logistics: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// SubmitStaffing handles the submission of staffing and security data
func SubmitStaffing(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		WardID          string `json:"ward_id"`
		INECStaff       int    `json:"inec_staff"`
		SecurityPresent bool   `json:"security_present"`
		PartyAgents     int    `json:"party_agents"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO ward_results (ward_id, inec_staff, security_present, party_agents, updated_at)
		VALUES ($1, $2, $3, $4, NOW())
		ON CONFLICT (ward_id) DO UPDATE SET
			inec_staff = EXCLUDED.inec_staff,
			security_present = EXCLUDED.security_present,
			party_agents = EXCLUDED.party_agents,
			updated_at = NOW()
	`
	_, err := db.DB.Exec(query, payload.WardID, payload.INECStaff, payload.SecurityPresent, payload.PartyAgents)
	if err != nil {
		http.Error(w, "Failed to save staffing: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// SubmitIntegrity handles the submission of integrity checks
func SubmitIntegrity(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		WardID              string `json:"ward_id"`
		EC8BSubmitted       bool   `json:"ec8b_submitted"`
		EC8CCollated        bool   `json:"ec8c_collated"`
		CSRVSDone           bool   `json:"csrvs_done"`
		VotesAnnounced      bool   `json:"votes_announced"`
		AgentsCountersigned bool   `json:"agents_countersigned"`
		EC60EDisplayed      bool   `json:"ec60e_displayed"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO ward_results (
			ward_id, ec8b_submitted, ec8c_collated, csrvs_done, votes_announced, agents_countersigned, ec60e_displayed, updated_at
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
		ON CONFLICT (ward_id) DO UPDATE SET
			ec8b_submitted = EXCLUDED.ec8b_submitted,
			ec8c_collated = EXCLUDED.ec8c_collated,
			csrvs_done = EXCLUDED.csrvs_done,
			votes_announced = EXCLUDED.votes_announced,
			agents_countersigned = EXCLUDED.agents_countersigned,
			ec60e_displayed = EXCLUDED.ec60e_displayed,
			updated_at = NOW()
	`
	_, err := db.DB.Exec(query, payload.WardID, payload.EC8BSubmitted, payload.EC8CCollated, payload.CSRVSDone, payload.VotesAnnounced, payload.AgentsCountersigned, payload.EC60EDisplayed)
	if err != nil {
		http.Error(w, "Failed to save integrity checks: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// SubmitResults handles the submission of vote counts
func SubmitResults(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		WardID           string `json:"ward_id"`
		AccreditedVoters int    `json:"accredited_voters"`
		ValidVotes       int    `json:"valid_votes"`
		RejectedVotes    int    `json:"rejected_votes"`
		VotesCast        int    `json:"votes_cast"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO ward_results (
			ward_id, accredited_voters, valid_votes, rejected_votes, votes_cast, updated_at
		)
		VALUES ($1, $2, $3, $4, $5, NOW())
		ON CONFLICT (ward_id) DO UPDATE SET
			accredited_voters = EXCLUDED.accredited_voters,
			valid_votes = EXCLUDED.valid_votes,
			rejected_votes = EXCLUDED.rejected_votes,
			votes_cast = EXCLUDED.votes_cast,
			updated_at = NOW()
	`
	_, err := db.DB.Exec(query, payload.WardID, payload.AccreditedVoters, payload.ValidVotes, payload.RejectedVotes, payload.VotesCast)
	if err != nil {
		http.Error(w, "Failed to save results: "+err.Error(), http.StatusInternalServerError)
		return
	}
	// TODO: Handle Party Results (separate table)
	w.WriteHeader(http.StatusOK)
}

// GetDashboardStats returns aggregated statistics for the dashboard
func GetDashboardStats(w http.ResponseWriter, r *http.Request) {
	stats := struct {
		TotalLGAs         int     `json:"totalLGAs"`
		TotalWards        int     `json:"totalWards"`
		WardsReported     int     `json:"wardsReported"`
		LGAsReported      int     `json:"lgasReported"`
		CompliancePercent float64 `json:"compliancePercent"`
		TotalPollingUnits int     `json:"totalPollingUnits"`
		OpenPollingUnits  int     `json:"openPollingUnits"`
		Breakdown         struct {
			Operational int `json:"operational"`
			MinorIssues int `json:"minorIssues"`
			Offline     int `json:"offline"`
			NotOpened   int `json:"notOpened"`
		} `json:"pollingUnitBreakdown"`
	}{}

	// 1. Total Counts
	db.DB.QueryRow("SELECT COUNT(*) FROM area_councils").Scan(&stats.TotalLGAs)
	db.DB.QueryRow("SELECT COUNT(*) FROM wards").Scan(&stats.TotalWards)
	db.DB.QueryRow("SELECT COUNT(*) FROM ward_results").Scan(&stats.WardsReported)

	// Calculate Total Polling Units
	db.DB.QueryRow("SELECT COALESCE(SUM(total_polling_units), 0) FROM wards").Scan(&stats.TotalPollingUnits)

	// Calculate Open Polling Units (PUs in wards that have reported)
	db.DB.QueryRow(`
		SELECT COALESCE(SUM(w.total_polling_units), 0) 
		FROM wards w 
		JOIN ward_results wr ON w.id = wr.ward_id
	`).Scan(&stats.OpenPollingUnits)

	// Calculate Minor Issues (PUs in wards with active incidents)
	var unitsWithIssues int
	db.DB.QueryRow(`
		SELECT COALESCE(SUM(w.total_polling_units), 0)
		FROM wards w
		JOIN incidents i ON w.id = i.ward_id
		JOIN ward_results wr ON w.id = wr.ward_id
	`).Scan(&unitsWithIssues)

	stats.Breakdown.MinorIssues = unitsWithIssues
	stats.Breakdown.Operational = stats.OpenPollingUnits - unitsWithIssues
	if stats.Breakdown.Operational < 0 {
		stats.Breakdown.Operational = 0
	}
	stats.Breakdown.Offline = stats.TotalPollingUnits - stats.OpenPollingUnits
	stats.Breakdown.NotOpened = 0 // Placeholder until we track cancelled PUs

	// 2. LGAs with at least one report
	db.DB.QueryRow(`
		SELECT COUNT(DISTINCT w.area_council_id) 
		FROM ward_results wr
		JOIN wards w ON wr.ward_id = w.id
	`).Scan(&stats.LGAsReported)

	// 3. Compliance Percent (Simple average of "checks passed" for now)
	var compliantReports int
	db.DB.QueryRow("SELECT COUNT(*) FROM ward_results WHERE ec8b_submitted = true AND ec8c_collated = true").Scan(&compliantReports)

	if stats.WardsReported > 0 {
		stats.CompliancePercent = float64(compliantReports) / float64(stats.WardsReported) * 100
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// GetAreaCouncilParties returns the configured parties for a specific Area Council
func GetAreaCouncilParties(w http.ResponseWriter, r *http.Request) {
	lgaID := chi.URLParam(r, "lgaID")

	var partiesJSON []byte
	err := db.DB.QueryRow("SELECT parties FROM area_council_parties WHERE area_council_id = $1", lgaID).Scan(&partiesJSON)
	if err != nil {
		// If not found, return default list or error
		// Ideally migration seeded everything, so error means invalid ID or DB issue
		http.Error(w, "Configuration not found: "+err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(partiesJSON)
}

// UpdateAreaCouncilParties updates the list of parties for an Area Council
func UpdateAreaCouncilParties(w http.ResponseWriter, r *http.Request) {
	lgaID := chi.URLParam(r, "lgaID")
	var parties []string

	if err := json.NewDecoder(r.Body).Decode(&parties); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	partiesJSON, err := json.Marshal(parties)
	if err != nil {
		http.Error(w, "Invalid party list", http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO area_council_parties (area_council_id, parties, updated_at)
		VALUES ($1, $2, NOW())
		ON CONFLICT (area_council_id) DO UPDATE SET
			parties = EXCLUDED.parties,
			updated_at = NOW()
	`
	_, err = db.DB.Exec(query, lgaID, partiesJSON)
	if err != nil {
		http.Error(w, "Failed to update configuration: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
