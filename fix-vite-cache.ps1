# Fix Vite Cache - PowerShell Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Vite Cache Issue" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location client

Write-Host "Step 1: Checking for Vite cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Write-Host "Found cache folder. Removing..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✓ Cache removed successfully" -ForegroundColor Green
} else {
    Write-Host "ℹ No cache folder found (this is okay)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 2: Verifying Stripe packages..." -ForegroundColor Yellow

$stripeJs = npm list @stripe/stripe-js 2>&1 | Select-String "@stripe/stripe-js"
$stripeReact = npm list @stripe/react-stripe-js 2>&1 | Select-String "@stripe/react-stripe-js"

if ($stripeJs) {
    Write-Host "✓ @stripe/stripe-js is installed" -ForegroundColor Green
} else {
    Write-Host "✗ @stripe/stripe-js is NOT installed" -ForegroundColor Red
    Write-Host "Installing..." -ForegroundColor Yellow
    npm install @stripe/stripe-js
}

if ($stripeReact) {
    Write-Host "✓ @stripe/react-stripe-js is installed" -ForegroundColor Green
} else {
    Write-Host "✗ @stripe/react-stripe-js is NOT installed" -ForegroundColor Red
    Write-Host "Installing..." -ForegroundColor Yellow
    npm install @stripe/react-stripe-js
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cache cleared! Now restart the client:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Run this command:" -ForegroundColor Yellow
Write-Host "  npm run dev:clean" -ForegroundColor White
Write-Host ""
Write-Host "Or:" -ForegroundColor Yellow
Write-Host "  npm run dev -- --force" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
