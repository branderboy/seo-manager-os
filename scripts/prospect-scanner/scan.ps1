#!/usr/bin/env pwsh
# PowerShell wrapper for the prospect/job scanner.
#
# Examples:
#   .\scan.ps1 -Demo
#   .\scan.ps1 "SEO manager" "New York, NY" -Pages 2 -Pitch
#   .\scan.ps1 "SEO strategist" -Remote -Date week -MinFit 40 -Pitch
#
# If RAPIDAPI_KEY isn't set in the environment, the script will read it from a
# .env file in this folder (handled by scan.mjs).

param(
  [Parameter(Position = 0)][string]$Query = "SEO manager",
  [Parameter(Position = 1)][string]$Location = "",
  [switch]$Remote,
  [string]$Date = "month",
  [int]$Pages = 1,
  [string]$Source = "",
  [int]$MinFit = 0,
  [switch]$Pitch,
  [switch]$Demo
)

$ErrorActionPreference = "Stop"
$scriptPath = Join-Path $PSScriptRoot "scan.mjs"

$cliArgs = @("--q", $Query)
if ($Location) { $cliArgs += @("--location", $Location) }
if ($Remote)   { $cliArgs += "--remote" }
$cliArgs += @("--date", $Date, "--pages", "$Pages", "--min-fit", "$MinFit")
if ($Source)   { $cliArgs += @("--source", $Source) }
if ($Pitch)    { $cliArgs += "--pitch" }
if ($Demo)     { $cliArgs += "--demo" }

node $scriptPath @cliArgs
