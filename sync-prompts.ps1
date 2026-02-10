# Direct sync script for prompt-secret-vault
# Usage: ./sync-prompts.ps1 "Your commit message"

$commitMsg = $args[0]
if (-not $commitMsg) { $commitMsg = "sync: update prompts and knowledge" }

Write-Host "--- Syncing Embedded Prompts Repo ---" -ForegroundColor Cyan
cd prompts
git add .
git commit -m "$commitMsg"
git pull origin main --rebase
git push origin HEAD:main

Write-Host "--- Updating Main Repo Pointer ---" -ForegroundColor Cyan
cd ..
git add prompts/
git commit -m "sync: update prompts pointer"
git push origin main

Write-Host "Done. Context secured." -ForegroundColor Green
