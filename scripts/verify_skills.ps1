# ==============================================================================
# GaliGuide: Agent Skills Verification Script
# File: scripts/verify_skills.ps1
# ==============================================================================

$SkillsDir = Join-Path $PSScriptRoot "..\.agents\skills"
if (-not (Test-Path $SkillsDir)) {
    Write-Error "Skills directory not found at $SkillsDir"
    exit 1
}

$SkillFolders = Get-ChildItem -Directory -Path $SkillsDir
$Total = $SkillFolders.Count
$Passed = 0
$Failed = 0

Write-Host "Verifying $Total Agent Skills in $SkillsDir..." -ForegroundColor Cyan

foreach ($Folder in $SkillFolders) {
    $SkillFile = Join-Path $Folder.FullName "SKILL.md"
    if (-not (Test-Path $SkillFile)) {
        Write-Host "  [FAIL] Missing SKILL.md in $($Folder.Name)" -ForegroundColor Red
        $Failed++
        continue
    }

    $Content = Get-Content $SkillFile -Raw
    $HasFrontmatter = $Content -match '^---\s*[\r\n]+([\s\S]*?)[\r\n]+---'
    if (-not $HasFrontmatter) {
        Write-Host "  [FAIL] Missing YAML frontmatter in $($Folder.Name)/SKILL.md" -ForegroundColor Red
        $Failed++
        continue
    }

    $YamlBlock = $Matches[1]
    $HasName = $YamlBlock -match 'name:\s*([^\r\n]+)'
    $HasDesc = $YamlBlock -match 'description:\s*([^\r\n]+)'

    if (-not $HasName -or -not $HasDesc) {
        Write-Host "  [FAIL] Incomplete frontmatter (requires name & description) in $($Folder.Name)/SKILL.md" -ForegroundColor Red
        $Failed++
        continue
    }

    $Passed++
}

Write-Host "`nSkills Verification Summary:" -ForegroundColor Cyan
Write-Host "  Total Skills Audited: $Total"
Write-Host "  Passed:               $Passed" -ForegroundColor Green
Write-Host "  Failed:               $Failed" -ForegroundColor $(if ($Failed -eq 0) { "Green" } else { "Red" })

if ($Failed -gt 0) {
    exit 1
}

Write-Host "`nALL AGENT SKILLS VERIFIED SUCCESSFULLY!" -ForegroundColor Green
exit 0
