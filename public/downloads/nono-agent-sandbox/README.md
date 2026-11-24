# nono agent sandbox starter kit

A minimal, working version of the setup described in
[Letting the Agent Run: My nono Sandbox for OpenCode](https://luca-becker.me/blog/letting-the-agent-run-nono-sandbox/).

This is a starting point, not my full config. Every real developer machine needs its own
grants; expect to add some.

## Contents

```text
profiles/
  agent-base.json        shared baseline: nono defaults + toolchains + secret denies + allowlisted network
  agent-opencode.json    OpenCode: GitHub MCP via phantom token, loopback AWS bridge port, aws CLI denied
bin/
  agent                  launcher: agent [--plain] [--grant PATH]... opencode
  aws-mcp-host           host-side AWS MCP bridge (credentials stay outside the sandbox)
  verify-sandbox         run inside a session; every line should say PASS
hooks/
  pre-commit             global git hook that runs pre-commit with an empty environment
config/
  opencode.sandbox.json  OpenCode inside nono: shell allowed, MCP writes off
  opencode.plain.json    OpenCode without nono: ask for everything
AGENT_PROMPT.md          prompt for an agent to adapt all of this to YOUR machine
```

## Quick start (macOS)

```bash
brew install nono
nono pull nolabs-ai/opencode

mkdir -p ~/.config/nono/profiles
cp profiles/*.json ~/.config/nono/profiles/
for p in ~/.config/nono/profiles/agent-*.json; do nono profile validate "$p"; done

cp bin/agent bin/verify-sandbox ~/.local/bin/
cd ~/some/repo && agent opencode
```

Inside the session, have the agent run `verify-sandbox`. Fix any `FAIL` before trusting it.

Optional pieces:

- **GitHub MCP:** needs `gh auth login` on the host. The sandbox only ever sees a phantom `GITHUB_MCP_PAT`.
- **AWS MCP:** run `AWS_MCP_PROFILE=<read-only-profile> bin/aws-mcp-host` in a separate host terminal.
  Use a read-only IAM role; the proxy's `--read-only` flag only affects the docs tools.
- **OpenCode config:** merge `config/opencode.sandbox.json` into the config your sandboxed launch uses.
  Keep `config/opencode.plain.json` for unsandboxed launches.
- **Git hook:** `git config --global core.hooksPath ~/.config/git/hooks` and copy `hooks/pre-commit` there.

## When something breaks

It will. Usually a tool fails three layers down because it cannot read a cache or config path.

```bash
nono why --profile agent-opencode --path ~/.yarnrc      # is this path allowed?
nono why --profile agent-opencode --host registry.yarnpkg.com
nono profile show agent-opencode                         # full effective policy
```

Then add the narrowest grant you can to a profile, re-validate, and relaunch. Prefer specific paths
over broad globs. Broad `deny` globs under `$HOME` or `~/.cache` make nono walk the whole tree at
startup (I measured 58 seconds once), and can crash it.

## Known gaps

- DNS is not covered by the TCP egress filter.
- `system_write_macos` still allows writes under `/private/var/folders`.
- Seatbelt is a policy layer on a shared kernel, not a VM.
- `git show HEAD:path` reads committed blobs from `.git/objects`, bypassing path denies.
- Seatbelt cannot nest, so Chromium/Playwright need their own sandbox disabled or must run on the host.

Tested with nono 0.82 on macOS. Apache-2.0 / do whatever you like, at your own risk.
