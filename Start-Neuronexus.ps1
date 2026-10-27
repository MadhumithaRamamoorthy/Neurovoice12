<#
.SYNOPSIS
    NEURONEXUS Platform Launcher & Local Service Orchestrator
    Team: Infinite Loopers (Sathyabama Institute of Science and Technology)
#>

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "                     NEURONEXUS PLATFORM" -ForegroundColor White
Write-Host "         Understand Your Learning. Improve Your Potential." -ForegroundColor Gray
Write-Host "         Team: Infinite Loopers (Sathyabama Hackathon Edition)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$frontendPath = Join-Path $PSScriptRoot "frontend\index.html"

if (Test-Path $frontendPath) {
    Write-Host "[OK] Frontend application bundle verified." -ForegroundColor Green
    Write-Host "Launching in default web browser: $frontendPath" -ForegroundColor Yellow
    Start-Process $frontendPath
} else {
    Write-Host "[ERROR] Could not locate frontend\index.html" -ForegroundColor Red
}

Write-Host ""
Write-Host "NEURONEXUS is active in Demo Mode with persistent local storage." -ForegroundColor Cyan
Write-Host "Judge Walkthrough: Follow the 4-stage NeuroLearn Loop (Assess -> Discover -> Personalize -> Improve)." -ForegroundColor Gray
