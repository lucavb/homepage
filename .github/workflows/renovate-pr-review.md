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
  add-labels:
    max: 3
    allowed: ["safe-to-merge", "needs-review", "breaking-change"]
  jobs:
    upsert-renovate-review-comment:
      description: "Create or update the persistent Renovate dependency review PR comment"
      runs-on: ubuntu-latest
      permissions:
        contents: read
        issues: write
        pull-requests: read
      output: "Renovate dependency review comment created or updated."
      inputs:
        body:
          description: "Markdown body for the dependency review comment"
          required: true
          type: string
      steps:
        - name: Upsert review comment
          uses: actions/github-script@v9
          with:
            github-token: ${{ secrets.GH_AW_GITHUB_TOKEN || secrets.GITHUB_TOKEN }}
            script: |
              const fs = require('fs');

              const marker = '<!-- renovate-pr-review:dependency-review -->';
              const outputFile = process.env.GH_AW_AGENT_OUTPUT;

              if (!outputFile || !fs.existsSync(outputFile)) {
                core.info('No agent output found; skipping comment upsert.');
                return;
              }

              const agentOutput = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
              const item = (agentOutput.items || []).find(
                (entry) => entry.type === 'upsert_renovate_review_comment'
              );

              if (!item || !item.body) {
                core.info('No upsert_renovate_review_comment output found; skipping comment upsert.');
                return;
              }

              const issue_number = context.payload.pull_request?.number || context.issue?.number;

              if (!issue_number) {
                core.setFailed('Unable to determine the pull request number for the review comment.');
                return;
              }

              const body = `${marker}\n${item.body}`;
              const comments = await github.paginate(github.rest.issues.listComments, {
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number,
                per_page: 100,
              });

              const existingComment = [...comments].reverse().find(
                (comment) =>
                  comment.user?.type === 'Bot' &&
                  (comment.body?.includes(marker) || comment.body?.includes('### Dependency Review:'))
              );

              if (existingComment) {
                await github.rest.issues.updateComment({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  comment_id: existingComment.id,
                  body,
                });
                core.info(`Updated existing Renovate review comment ${existingComment.id}.`);
                return;
              }

              const createdComment = await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number,
                body,
              });

              core.info(`Created Renovate review comment ${createdComment.data.id}.`);

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

Call `upsert_renovate_review_comment` exactly once with a `body` matching this structure:

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