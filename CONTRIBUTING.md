# GraftonHub Contributing Guide

## Research Workflow

**All grunt work (research, data gathering, verification) should be done by Grok agents.**

### Why?
- Grok tokens are cheaper than Anthropic
- Can run multiple research tasks in parallel
- Claude/Anthropic credits reserved for:
  - Brainstorming and architecture decisions
  - Writing and reviewing code
  - Synthesis and decision-making
  - User-facing communication

### Process
1. **Identify research needs** - What data do we need?
2. **Spawn Grok agents** - Use `sessions_spawn` with `model: grok`
3. **Compile results** - Claude synthesizes findings
4. **Validate with Neil** - Local knowledge is ground truth
5. **Update code** - Only after validation

### Lesson Learned (Feb 15, 2026)
Initial launch had wrong utility data (Dominion vs Columbia Gas) because:
- Quick web searches instead of thorough research
- Assumptions without verification
- Published before validation

**Fix:** Always use Grok agents for research, always validate with Neil before deploying changes to public-facing data.

## Data Sources Priority
1. **Official government/utility websites** - Most authoritative
2. **County resources** (loraincountyohio.gov, lcta.us)
3. **Utility company service area maps**
4. **Local knowledge** (Neil lives in Carlisle Township)

## Localities Covered
- Village of Grafton (44044)
- Carlisle Township (44044)
- Village of LaGrange (44050)
- City of Oberlin (44074)
- Eaton Township (44044)

All in Lorain County, Ohio.
