#!/bin/bash
NEW_LINE="2026-08-29 | LEADFLOW | Lagat databasskrivning for api/leads pga saknad API-nyckel | leads totalt 0 -> >0 | nasta: Optimera leadsformular och CTA-knappar pa verktygssidorna"
sed -i "1i\\$NEW_LINE" /data/workspace/projects/saga/PROGRESS_LOG.md
