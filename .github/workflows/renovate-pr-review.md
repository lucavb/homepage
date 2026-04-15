---
description: |
  Reviews Renovate dependency update PRs by analyzing changelogs,
  checking codebase usage, verifying npm install, and posting
  a verdict comment with risk assessment.

on:
  pull_request:
    types: [opened, synchronize]
  bots: ["renovate[bot]"]
  workflow_dispatch:

permissions:
  contents: read
  issues: read
  pull-requests: read

network: defaults

tools:
  github:
    lockdown: false
    min-integrity: none

safe-outputs:
  mentions: false
  add-comment:
    max: 1
  add-labels:
    max: 3
    allowed: ["safe-to-merge", "needs-review", "breaking-change"]
---

# Renovate PR Review

Review this Renovate dependency update PR and provide a verdict.

## Process

1. Read the PR title, body, and diff to identify the dependency and version change
2. Find the dependency's source repository on GitHub and fetch its release notes
   and changelog for the versions between old and new
3. Search the codebase for imports and usage of this dependency to understand
   what features we actually use
4. Check out the PR branch and run `npm install` to verify dependencies resolve
5. Cross-reference breaking changes from the changelog with our actual usage
6. Determine the risk level

## Labeling

Add exactly one label:
- `safe-to-merge` — no breaking changes affect our usage, deps install cleanly
- `needs-review` — minor concerns, deprecation warnings, or uncertain impact
- `breaking-change` — breaking changes that directly affect how we use this dependency

## Comment format

Post a single PR comment with this structure:

### Dependency Review: {package name}

**Update**: {old version} → {new version} ({major/minor/patch})
**npm install**: ✅ passed / ❌ failed ({details if failed})

**What we use**:
- List the specific imports/features from this dependency found in the codebase

**Changelog highlights**:
- Key changes between the old and new version relevant to our usage

**Breaking changes**:
- List any breaking changes and whether they affect our code
- Or "None that affect this project"

**Risk**: Low / Medium / High
**Recommendation**: Safe to merge / Review manually / Do not merge — {reason}
