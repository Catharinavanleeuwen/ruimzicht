# Ruimzicht

Een gedeeld weekrooster: wie is er wanneer thuis? Iedere huisgenoot vult per
dagdeel (ochtend, middag, avond, nacht) in of hij/zij **thuis**, **weg** of
**misschien** thuis is. Bovenaan zie je wie er nú thuis is.

## Opbouw

- `*.go` — kleine Go-server: JSON-API onder `/api` en de gebouwde frontend.
  Het rooster staat als één JSON-bestand in de privé-bucket van de omgeving
  (`ruimzicht/schedule.json`); zonder `S3_BUCKET` blijft het in het geheugen.
- `web/` — React + Vite + Tailwind CSS v4 + shadcn/ui.
- `k8s/` — Deployment, Service en HTTPRoute.
- `.basable/` — omgevingsgrootte (`config.yaml`) en het build-script (`verify.sh`).

## API

| Methode | Pad | Body |
| --- | --- | --- |
| GET | `/api/schedule` | — |
| POST | `/api/people` | `{ "name", "color" }` |
| DELETE | `/api/people/{id}` | — |
| PUT | `/api/slots` | `{ "personId", "day" (0=ma), "part" (0–3), "status" }` |

`status` is `thuis`, `weg`, `misschien` of `""` (wissen).

## Lokaal draaien

```sh
go run .                 # API op :8080 (opslag in geheugen)
cd web && npm install && npm run dev
```
