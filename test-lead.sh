#!/bin/bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "test-bot@fragasaga.se",
  "quoteCategory": "test",
  "quoteRegion": "test-region",
  "analysisVerdict": "TEST",
  "analysisSummary": {
    "company": "Test Company",
    "total": 1000,
    "verdict": "Beräknat pris (ca): 1000"
  }
}' https://fragasaga.se/api/leads
