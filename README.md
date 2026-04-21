# xbridge-skill

Agent skill for interacting with Xcode projects.

The preferred integration is the **xbridge CLI** — a standalone tool that communicates with Xcode without triggering a permission dialog on every new session. The Xcode MCP bridge (`xcrun mcpbridge`) is supported as a manual fallback.

## Installation

### Option 1: CLI Install (Recommended)

```bash
# Install all skills
npx skills add 4rays/xbridge-skill

# Install specific skills
npx skills add 4rays/xbridge-skill --skill xbridge

# List available skills
npx skills add 4rays/xbridge-skill --list
```

This automatically installs to your `.agents/skills/` directory (and symlinks into `.claude/skills/` for Claude Code compatibility).

### Option 2: Claude Code Plugin

```bash
# Add the marketplace
/plugin marketplace add 4rays/xbridge-skill

# Install the plugin
/plugin install xbridge-skill
```

Or load directly from a local path:

```bash
claude --plugin-dir /path/to/xbridge-skill
```

> Claude Code specific. For other agents, use Option 1 or Option 3.

### Option 3: Clone and Copy

```bash
git clone https://github.com/4rays/xbridge-skill.git
cp -r xbridge-skill/skills/* .agents/skills/
```

### Option 4: Git Submodule

```bash
git submodule add https://github.com/4rays/xbridge-skill.git .agents/xbridge-skill
```

### Option 5: Fork and Customize

1. Fork this repository
2. Customize skills for your needs
3. Clone your fork into your projects

### Option 6: SkillKit (Multi-Agent)

```bash
npx skillkit install 4rays/xbridge-skill
```

## Quick Start

### 1. Install xbridge

```bash
brew tap 4rays/tap
brew install xbridge
```

### 2. Enable Xcode MCP

Open **Xcode > Settings** (⌘,) → **Intelligence** → Enable **Xcode Tools** under Model Context Protocol.

### 3. Open Your Project

```bash
open MyApp.xcodeproj
# or
open MyApp.xcworkspace
```

### 4. Start Your Agent

Your agent will automatically detect xbridge and use it for all Xcode tasks.

## Using xbridge

The skill uses the xbridge CLI via the Bash tool. The typical workflow:

```bash
# Get a tab ID first
xbridge list-windows

# Then use it in commands
xbridge build windowtab1
xbridge test windowtab1
xbridge build-log windowtab1
```

## Available Commands

| Category        | Commands                                                                           |
| --------------- | ---------------------------------------------------------------------------------- |
| **Status**      | `status`, `stop`, `restart`                                                        |
| **Discovery**   | `list-windows`, `tools`, `tool-schema`, `call`                                     |
| **Files**       | `read`, `write`, `update`, `ls`, `glob`, `grep`, `mkdir`, `rm`, `mv`               |
| **Build & Test**| `build`, `build-log`, `test`, `test-list`, `test-run`, `issues`, `refresh-issues`  |
| **Advanced**    | `exec`, `preview`, `docs`                                                          |

Full reference: [skills/xbridge/SKILL.md](skills/xbridge/SKILL.md)

## Xcode MCP Bridge (Alternative)

If you prefer the MCP bridge over xbridge, add it to your agent manually. For Claude Code:

```bash
claude mcp add --transport stdio xcode -- xcrun mcpbridge
```

Note: this requires approving a permission dialog in Xcode at the start of every new session.

## Troubleshooting

- **xbridge not found**: Install with `brew tap 4rays/tap && brew install xbridge`
- **No tab IDs**: Ensure Xcode is running with a project open
- **Xcode MCP not enabled**: Go to **Xcode > Settings > Intelligence > Model Context Protocol**
- **MCP permission denied**: Revoke the process in Xcode Settings and reconnect to retrigger the dialog

## Resources

- [Apple MCP Documentation](https://developer.apple.com/documentation/xcode/giving-external-agents-access-to-xcode)

## License

MIT
