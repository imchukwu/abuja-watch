package models

import "time"

// AreaCouncil represents an Area Council entity
type AreaCouncil struct {
	ID    string `json:"id" db:"id"`
	Name  string `json:"name" db:"name"`
	State string `json:"state" db:"state"`
}

// LGASummary represents the aggregated data for an Area Council
type LGASummary struct {
	ID                string         `json:"id"`
	Name              string         `json:"name"`
	State             string         `json:"state"`
	Wards             int            `json:"wards"`
	PollingUnits      int            `json:"pollingUnits"`
	RegisteredVoters  int            `json:"registeredVoters"`
	AccreditedVoters  int            `json:"accreditedVoters"`
	VotesCast         int            `json:"votesCast"`
	ValidVotes        int            `json:"validVotes"`
	RejectedVotes     int            `json:"rejectedVotes"`
	TurnoutPercent    float64        `json:"turnoutPercent"`
	WardsReported     int            `json:"wardsReported"`
	ComplianceScore   int            `json:"complianceScore"`
	IncidentCount     int            `json:"incidentCount"`
	DeniedAccessCount int            `json:"deniedAccessCount"`
	LateStartCount    int            `json:"lateStartCount"`
	CancelledPUs      int            `json:"cancelledPUs"`
	LostVoters        int            `json:"lostVoters"`
	SecurityPresent   int            `json:"securityPresent"` // Average %
	ObserverCoverage  int            `json:"observerCoverage"`
	RiskLevel         string         `json:"riskLevel"`
	IncidentBreakdown map[string]int `json:"incidentBreakdown"`
	PartyResults      map[string]int `json:"partyResults"`
}

// Ward represents a Ward entity
type Ward struct {
	ID                string `json:"id" db:"id"`
	AreaCouncilID     string `json:"area_council_id" db:"area_council_id"`
	Name              string `json:"name" db:"name"`
	TotalPollingUnits int    `json:"total_polling_units" db:"total_polling_units"`
	RegisteredVoters  int    `json:"registered_voters" db:"registered_voters"`
}

// WardResult represents the submission data for a ward
type WardResult struct {
	WardID              string    `json:"ward_id" db:"ward_id"`
	ArrivalTime         string    `json:"arrival_time" db:"arrival_time"`
	CollationStartTime  string    `json:"collation_start_time" db:"collation_start_time"`
	INECStaff           int       `json:"inec_staff" db:"inec_staff"`
	SecurityPresent     bool      `json:"security_present" db:"security_present"`
	PartyAgents         int       `json:"party_agents" db:"party_agents"`
	EC8BSubmitted       bool      `json:"ec8b_submitted" db:"ec8b_submitted"`
	EC8CCollated        bool      `json:"ec8c_collated" db:"ec8c_collated"`
	CSRVSDone           bool      `json:"csrvs_done" db:"csrvs_done"`
	VotesAnnounced      bool      `json:"votes_announced" db:"votes_announced"`
	AgentsCountersigned bool      `json:"agents_countersigned" db:"agents_countersigned"`
	EC60EDisplayed      bool      `json:"ec60e_displayed" db:"ec60e_displayed"`
	AccreditedVoters    int       `json:"accredited_voters" db:"accredited_voters"`
	ValidVotes          int       `json:"valid_votes" db:"valid_votes"`
	RejectedVotes       int       `json:"rejected_votes" db:"rejected_votes"`
	VotesCast           int       `json:"votes_cast" db:"votes_cast"`
	UpdatedAt           time.Time `json:"updated_at" db:"updated_at"`
}

// PartyResult represents vote count for a party in a ward
type PartyResult struct {
	ID        int       `json:"id" db:"id"`
	WardID    string    `json:"ward_id" db:"ward_id"`
	PartyName string    `json:"party_name" db:"party_name"`
	Score     int       `json:"score" db:"score"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// Incident represents a security or process incident
type Incident struct {
	ID          int       `json:"id" db:"id"`
	WardID      string    `json:"ward_id" db:"ward_id"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Type        string    `json:"type" db:"type"`
	Severity    string    `json:"severity" db:"severity"`
	Status      string    `json:"status" db:"status"`
	Timestamp   time.Time `json:"timestamp" db:"timestamp"`
}

// WardDetail matches the frontend WardSummary interface structure
type WardDetail struct {
	ID               string         `json:"id"`
	LgaID            string         `json:"lgaId"`
	Name             string         `json:"name"`
	PollingUnits     int            `json:"pollingUnits"`
	RegisteredVoters int            `json:"registeredVoters"`
	AccreditedVoters int            `json:"accreditedVoters"`
	VotesCast        int            `json:"votesCast"`
	ValidVotes       int            `json:"validVotes"`
	RejectedVotes    int            `json:"rejectedVotes"`
	TurnoutPercent   float64        `json:"turnoutPercent"`
	ComplianceScore  int            `json:"complianceScore"` // Calculated
	IncidentCount    int            `json:"incidentCount"`
	DeniedAccess     bool           `json:"deniedAccess"` // Derived logic
	LateStart        bool           `json:"lateStart"`    // Derived logic
	CancelledPUs     int            `json:"cancelledPUs"` // Placeholder or derived
	SecurityPresent  bool           `json:"securityPresent"`
	ObserverPresent  bool           `json:"observerPresent"` // Placeholder
	RiskLevel        string         `json:"riskLevel"`       // Calculated
	ArrivalCategory  string         `json:"arrivalCategory"`
	StartCategory    string         `json:"startCategory"`
	PartyResults     map[string]int `json:"partyResults"`
	Integrity        WardIntegrity  `json:"integrity"`
}

type WardIntegrity struct {
	EC8BSubmitted       bool `json:"ec8bSubmitted"`
	EC8CCollated        bool `json:"ec8cCollated"`
	CSRVSDone           bool `json:"csrvsDone"`
	VotesAnnounced      bool `json:"votesAnnounced"`
	AgentsCountersigned bool `json:"agentsCountersigned"`
	EC60EDisplayed      bool `json:"ec60eDisplayed"`
}
