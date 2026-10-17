package main

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"
)

func routes(store *Store, staticDir string) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		_, _ = w.Write([]byte("OK"))
	})
	mux.HandleFunc("GET /api/schedule", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusOK, store.Snapshot())
	})
	mux.HandleFunc("POST /api/people", func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			Name  string `json:"name"`
			Color string `json:"color"`
		}
		if err := decode(w, r, &body); err != nil {
			writeError(w, err)
			return
		}
		ctx, cancel := opCtx(r)
		defer cancel()
		respond(w, http.StatusCreated)(store.AddPerson(ctx, body.Name, body.Color))
	})
	mux.HandleFunc("DELETE /api/people/{id}", func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := opCtx(r)
		defer cancel()
		respond(w, http.StatusOK)(store.RemovePerson(ctx, r.PathValue("id")))
	})
	mux.HandleFunc("PUT /api/slots", func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			PersonID string `json:"personId"`
			Day      int    `json:"day"`
			Part     int    `json:"part"`
			Status   string `json:"status"`
		}
		if err := decode(w, r, &body); err != nil {
			writeError(w, err)
			return
		}
		ctx, cancel := opCtx(r)
		defer cancel()
		respond(w, http.StatusOK)(store.SetSlot(ctx, body.PersonID, body.Day, body.Part, body.Status))
	})
	mux.HandleFunc("/api/", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "Onbekend adres."})
	})
	mux.Handle("/", spaHandler(staticDir))
	return securityHeaders(mux)
}

func respond(w http.ResponseWriter, status int) func(Schedule, error) {
	return func(s Schedule, err error) {
		if err != nil {
			writeError(w, err)
			return
		}
		writeJSON(w, status, s)
	}
}

// opCtx lets a save finish even when the browser goes away mid-request.
func opCtx(r *http.Request) (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.WithoutCancel(r.Context()), 15*time.Second)
}

func decode(w http.ResponseWriter, r *http.Request, v any) error {
	r.Body = http.MaxBytesReader(w, r.Body, 4096)
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(v); err != nil {
		return invalid("Het verzoek kon niet gelezen worden.")
	}
	return nil
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, err error) {
	var ie *InputError
	switch {
	case errors.As(err, &ie):
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": ie.Msg})
	case errors.Is(err, ErrNotFound):
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "Deze huisgenoot bestaat niet (meer)."})
	default:
		log.Printf("request failed: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "Opslaan lukte niet. Probeer het zo opnieuw."})
	}
}
