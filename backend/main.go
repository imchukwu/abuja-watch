package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	"github.com/yiaga/abuja-watch/backend/internal/db"
	"github.com/yiaga/abuja-watch/backend/internal/handlers"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found in current directory")
	}

	// Connect to database
	if err := db.Connect(); err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}

	// Initialize Router
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RealIP)

	// Routes
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Abuja Watch Backend API is running"))
	})

	r.Route("/api", func(r chi.Router) {
		r.Get("/area-councils", handlers.GetAreaCouncils)
		r.Get("/area-councils/{lgaID}/wards", handlers.GetWards)
		r.Get("/wards/{wardID}", handlers.GetWardDetails)
		r.Get("/dashboard/stats", handlers.GetDashboardStats)

		// Submission Routes
		r.Post("/submit/logistics", handlers.SubmitLogistics)
		r.Post("/submit/staffing", handlers.SubmitStaffing)
		r.Post("/submit/integrity", handlers.SubmitIntegrity)
		r.Post("/submit/results", handlers.SubmitResults)

		// Party Configuration Routes
		r.Get("/area-councils/{lgaID}/parties", handlers.GetAreaCouncilParties)
		r.Post("/area-councils/{lgaID}/parties", handlers.UpdateAreaCouncilParties)
	})

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
