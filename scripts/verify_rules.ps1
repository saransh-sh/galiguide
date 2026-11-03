# ==============================================================================
# GaliGuide: Workspace Rules Verification Script
# File: scripts/verify_rules.ps1
# ==============================================================================

$Root = Split-Path $PSScriptRoot -Parent
$GeminiMd = Join-Path $Root "GEMINI.md"
$AgentsMd = Join-Path $Root "AGENTS.md"
$AgentsRulesDir = Join-Path $Root ".agents\rules"
$CursorRulesDir = Join-Path $Root ".cursor\rules"

$Passed = 0
$Failed = 0

Write-Host "Verifying Workspace Rules & Directives..." -ForegroundColor Cyan

# 1. Root rule files
if ((Test-Path $GeminiMd) -and ((Get-Item $GeminiMd).Length -gt 0)) {
    Write-Host "  [PASS] GEMINI.md exists and is populated ($((Get-Item $GeminiMd).Length) bytes)" -ForegroundColor Green
    $Passed++
} else {
    Write-Host "  [FAIL] GEMINI.md is missing or empty" -ForegroundColor Red
    $Failed++
}

if ((Test-Path $AgentsMd) -and ((Get-Item $AgentsMd).Length -gt 0)) {
    Write-Host "  [PASS] AGENTS.md exists and is populated ($((Get-Item $AgentsMd).Length) bytes)" -ForegroundColor Green
    $Passed++
} else {
    Write-Host "  [FAIL] AGENTS.md is missing or empty" -ForegroundColor Red
    $Failed++
}

# 2. Antigravity modular rules (.agents/rules/)
$ExpectedRules = @(
    "node-express-backend.md",
    "react-frontend.md",
    "mandatory-unit-tests.md",
    "solid-principles.md",
    "yagni-dry.md",
    "grill-me-mandatory.md",
    "zero-cost-maps.md",
    "privacy-guardrails.md"
)

foreach ($RuleName in $ExpectedRules) {
    $RulePath = Join-Path $AgentsRulesDir $RuleName
    if (Test-Path $RulePath) {
        $Len = (Get-Item $RulePath).Length
        if ($Len -lt 24000) {
            Write-Host "  [PASS] .agents/rules/$RuleName ($Len bytes, within 24KB limit)" -ForegroundColor Green
            $Passed++
        } else {
            Write-Host "  [FAIL] .agents/rules/$RuleName exceeds 24,000 bytes ($Len bytes)" -ForegroundColor Red
            $Failed++
        }
    } else {
        Write-Host "  [FAIL] Missing .agents/rules/$RuleName" -ForegroundColor Red
        $Failed++
    }
}

# 3. Cursor rules
$ExpectedCursorRules = @(
    "node-express-backend.mdc",
    "react-frontend.mdc",
    "mandatory-unit-tests.mdc",
    "solid-principles.mdc",
    "yagni-dry.mdc",
    "grill-me-mandatory.mdc"
)

foreach ($CRule in $ExpectedCursorRules) {
    $CRulePath = Join-Path $CursorRulesDir $CRule
    if (Test-Path $CRulePath) {
        Write-Host "  [PASS] .cursor/rules/$CRule exists" -ForegroundColor Green
        $Passed++
    } else {
        Write-Host "  [FAIL] Missing .cursor/rules/$CRule" -ForegroundColor Red
        $Failed++
    }
}

Write-Host "`nRules Verification Summary:" -ForegroundColor Cyan
Write-Host "  Passed: $Passed" -ForegroundColor Green
Write-Host "  Failed: $Failed" -ForegroundColor $(if ($Failed -eq 0) { "Green" } else { "Red" })

if ($Failed -gt 0) {
    exit 1
}

Write-Host "`nALL WORKSPACE RULES VERIFIED SUCCESSFULLY!" -ForegroundColor Green
exit 0
