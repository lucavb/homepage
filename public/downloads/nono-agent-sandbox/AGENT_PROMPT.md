# Prompt: adapt the nono agent sandbox to my machine

Paste this into a coding agent running **outside** any sandbox (you need it to read your home
directory layout once), in a directory containing this starter kit. Review every change it proposes.

---

You are helping me set up a kernel-enforced sandbox for my AI coding agents using nono
(https://github.com/nolabs-ai/nono). The starter kit in the current directory contains example
profiles (`profiles/`), a launcher (`bin/agent`), a host-side AWS MCP bridge (`bin/aws-mcp-host`),
a verification script (`bin/verify-sandbox`), and agent configs (`config/`). Read all of them first,
plus README.md.

Goal: the agent can run any shell command without approval prompts, because nono, not the agent,
decides what it can read, write, and reach. Real credentials never enter the sandbox.

Rules you must follow:

1. Never print, copy, or write secret values. Refer to credentials by name only.
2. Default deny. Every grant must be justified by a concrete tool on this machine. Prefer exact
   paths over globs; never add broad `deny` globs under `$HOME` or `~/.cache` (they make nono walk
   the whole tree and can crash it).
3. Do not grant write access to `~/.config/nono`, the profiles directory, or any ancestor of it.
   The sandboxed agent must not be able to read or edit its own policy.
4. Credentials reach the agent only as phantom tokens through nono's credential proxy
   (`network.custom_credentials` + `credential_capture`), or via a host-side bridge on a loopback
   port. Never via `env_credentials` or by leaving real tokens in the inherited environment.
5. MCP servers that act with my identity stay read-only or have their write tools disabled in the
   sandboxed agent config, even though the shell is fully allowed.
6. Validate every profile with `nono profile validate <file>` after each change.

Steps:

1. Inventory this machine without reading secret contents: OS and nono version (`nono --version`),
   package managers and toolchains actually installed (node/npm/pnpm/yarn/bun, python/uv/pyenv,
   rust, go, java/maven/gradle, ruby, etc.), where their caches live, which coding agents I use,
   which MCP servers are configured, and which env vars in my shell look like credentials (names only).
2. Ask me: which agents to sandbox, which repos/dirs they normally work in, which network hosts
   they need beyond nono's `developer` network profile, which MCP servers to keep, and whether I use AWS.
3. Adapt `profiles/agent-base.json`: pick the matching built-in groups (`nono profile groups`),
   add only the extra paths my toolchains need, extend the secret deny list for my setup, and
   strip every credential-looking env var I listed via `environment.deny_vars`.
4. Adapt the per-agent profiles. For each credential the agent needs, add a proxy credential route
   with `cmd://` capture from a host CLI or keychain. Remove the AWS port and bridge if I don't use AWS.
5. Adapt `config/` for my agents: shell allowed inside nono, MCP write tools denied; a separate plain
   config that asks before shell, edits, and web fetches.
6. Install: copy profiles to `~/.config/nono/profiles/`, `bin/agent` and `bin/verify-sandbox` to a
   directory on my PATH. Show me the exact commands before running anything outside this directory.
7. Verify: tell me to start `agent opencode` in a real repo and run
   `verify-sandbox` inside it. Extend `verify-sandbox` with checks specific to my machine
   (e.g. my cloud CLI config dirs, password manager CLIs, any token files you found).
8. Then do a real task in the sandbox (install deps, run tests, build). For every failure, use
   `nono why --profile <p> --path <path>` / `--host <host>` to find the missing grant, add the
   narrowest fix, re-validate, and keep a short log of what you widened and why.

Finish with a summary: what is denied, what is granted and why, which credentials are proxied,
and the remaining known gaps (DNS, `/private/var/folders`, committed blobs via `git show`, shared kernel).
