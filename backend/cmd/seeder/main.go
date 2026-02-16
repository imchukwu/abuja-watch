package main

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/yiaga/abuja-watch/backend/internal/db"
	"github.com/yiaga/abuja-watch/backend/internal/models"
)

var (
	parties            = []string{"APC", "PDP", "LP", "NNPP", "ADC", "SDP", "ZLP"}
	incidentTypes      = []string{"Violence", "Logistics", "Fraud", "Technical", "Others"}
	incidentSeverities = []string{"Low", "Medium", "High"}
)

func main() {
	// Initialize random seed
	rand.Seed(time.Now().UnixNano())

	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found in current directory, trying root...")
		if err := godotenv.Load("../../.env"); err != nil {
			log.Println("No .env file found in root either")
		}
	}

	// Connect to database
	if err := db.Connect(); err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}
	defer db.DB.Close()

	log.Println("Database connection established. Starting seed process...")

	// Fetch all wards
	wards, err := fetchWards(db.DB)
	if err != nil {
		log.Fatalf("Failed to fetch wards: %v", err)
	}
	log.Printf("Found %d wards to seed.", len(wards))

	for _, ward := range wards {
		// Seed Ward Results
		if err := seedWardResult(db.DB, ward); err != nil {
			log.Printf("Error seeding ward result for ward %s: %v", ward.ID, err)
		}

		// Seed Party Results
		if err := seedPartyResults(db.DB, ward); err != nil {
			log.Printf("Error seeding party results for ward %s: %v", ward.ID, err)
		}

		// Seed Incidents (Randomly)
		if rand.Float32() < 0.3 { // 30% chance of incident
			if err := seedIncidents(db.DB, ward); err != nil {
				log.Printf("Error seeding incidents for ward %s: %v", ward.ID, err)
			}
		}
	}

	log.Println("Seeding completed successfully.")
}

func fetchWards(database *sql.DB) ([]models.Ward, error) {
	rows, err := database.Query("SELECT id, name, registered_voters, total_polling_units FROM wards")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var wards []models.Ward
	for rows.Next() {
		var w models.Ward
		if err := rows.Scan(&w.ID, &w.Name, &w.RegisteredVoters, &w.TotalPollingUnits); err != nil {
			return nil, err
		}
		wards = append(wards, w)
	}
	return wards, nil
}

func seedWardResult(database *sql.DB, ward models.Ward) error {
	// Generate realistic numbers
	accreditedVoters := int(float64(ward.RegisteredVoters) * (0.2 + rand.Float64()*0.4)) // 20-60% turnout
	validVotes := int(float64(accreditedVoters) * 0.95)                                  // 95% valid
	rejectedVotes := accreditedVoters - validVotes
	votesCast := accreditedVoters

	query := `
		INSERT INTO ward_results (
			ward_id, arrival_time, collation_start_time, inec_staff, security_present, party_agents,
			ec8b_submitted, ec8c_collated, csrvs_done, votes_announced, agents_countersigned, ec60e_displayed,
			accredited_voters, valid_votes, rejected_votes, votes_cast, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
		ON CONFLICT (ward_id) DO UPDATE SET
			accredited_voters = EXCLUDED.accredited_voters,
			valid_votes = EXCLUDED.valid_votes,
			rejected_votes = EXCLUDED.rejected_votes,
			votes_cast = EXCLUDED.votes_cast,
			updated_at = EXCLUDED.updated_at
	`

	_, err := database.Exec(query,
		ward.ID,
		randomTime("08:00", "10:00"), // Arrival Time
		randomTime("14:00", "18:00"), // Collation Start Time
		rand.Intn(5)+2,               // INEC Staff
		rand.Intn(2) == 1,            // Security Present
		rand.Intn(10)+5,              // Party Agents
		rand.Intn(10) > 1,            // EC8B Submitted (90% yes)
		rand.Intn(10) > 2,            // EC8C Collated (80% yes)
		rand.Intn(10) > 2,            // CSRVS Done
		rand.Intn(10) > 1,            // Votes Announced
		rand.Intn(10) > 2,            // Agents Countersigned
		rand.Intn(10) > 1,            // EC60E Displayed
		accreditedVoters,
		validVotes,
		rejectedVotes,
		votesCast,
		time.Now(),
	)
	return err
}

func seedPartyResults(database *sql.DB, ward models.Ward) error {
	// Distribute valid votes among parties
	// Need to fetch valid votes first or recalculate?
	// For simplicity, let's recalculate/approximate based on what we just pushed,
	// or better, pass it in. But to keep it simple, we'll just regenerate the base valid votes
	// (since we are mocking, perfect consistency with the previous function call isn't strictly required
	// unless we read back, but let's try to be consistent).

	// Actually, let's just re-calculate the same way.
	// Note: In a real app, we'd pass validVotes from seedWardResult or return it.
	// For this script, let's just do a quick fetch to be accurate.
	var validVotes int
	err := database.QueryRow("SELECT valid_votes FROM ward_results WHERE ward_id = $1", ward.ID).Scan(&validVotes)
	if err != nil {
		return err
	}

	remainingVotes := validVotes
	for i, party := range parties {
		var score int
		if i == len(parties)-1 {
			score = remainingVotes
		} else {
			// Random chunk of remaining
			max := remainingVotes - (len(parties) - 1 - i) // Ensure at least 1 vote for others
			if max < 0 {
				max = 0
			}
			if max > 0 {
				score = rand.Intn(max / 2) // Skew towards earlier parties or spread?
				// Let's make it a bit more random but ensuring we don't exhaust too early
				score = rand.Intn(remainingVotes/2 + 1)
			}
		}

		// Fix for "major" parties getting more votes
		if party == "APC" || party == "PDP" || party == "LP" {
			score = int(float64(validVotes) * (0.2 + rand.Float64()*0.1)) // 20-30% each
			if score > remainingVotes {
				score = remainingVotes
			}
		}

		remainingVotes -= score

		_, err := database.Exec(`
			INSERT INTO party_results (ward_id, party_name, score)
			VALUES ($1, $2, $3)
			ON CONFLICT (ward_id, party_name) DO UPDATE SET score = EXCLUDED.score
		`, ward.ID, party, score)
		if err != nil {
			return err
		}
	}
	return nil
}

func seedIncidents(database *sql.DB, ward models.Ward) error {
	numIncidents := rand.Intn(3) + 1
	for i := 0; i < numIncidents; i++ {
		_, err := database.Exec(`
			INSERT INTO incidents (ward_id, title, description, type, severity, status, timestamp)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
		`,
			ward.ID,
			fmt.Sprintf("Incident in %s", ward.Name),
			"Description of the incident goes here.",
			incidentTypes[rand.Intn(len(incidentTypes))],
			incidentSeverities[rand.Intn(len(incidentSeverities))],
			"reported",
			time.Now().Add(-time.Duration(rand.Intn(24))*time.Hour),
		)
		if err != nil {
			return err
		}
	}
	return nil
}

func randomTime(min, max string) string {
	// simplified placeholder
	return fmt.Sprintf("%s:00", min) // improve if needed
}
