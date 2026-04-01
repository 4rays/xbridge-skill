# xcode-mcpbridge

Claude Code plugin for integrating with Xcode via Apple's official Model Context Protocol (MCP) server.

Enables AI agents to build, test, and manage Xcode projects using Apple's native `xcrun mcpbridge` command.

## Installation

```bash
claude --plugin-dir /path/to/xcode-mcpbridge
```

## Quick Start

### 1. Enable Xcode MCP Server

Open **Xcode > Settings** (⌘,) → **Intelligence** → Enable **Xcode Tools** under Model Context Protocol.

### 2. Connect Your AI Tool

**Claude Code:**
```bash
claude mcp add --transport stdio xcode -- xcrun mcpbridge
claude mcp list  # Verify
```

**Codex:**
```bash
codex mcp add xcode -- xcrun mcpbridge
codex mcp list  # Verify
```

### 3. Open Your Project

```bash
open MyApp.xcodeproj
# or
open MyApp.xcworkspace
```

### 4. Grant Permission

When the MCP client first connects, Xcode will display a permission dialog. Click **Allow**.

## Available MCP Tools

| Category | Tools |
|----------|-------|
| **File Operations** | `XcodeRead`, `XcodeWrite`, `XcodeUpdate`, `XcodeGlob`, `XcodeGrep`, `XcodeLS`, `XcodeMakeDir`, `XcodeRM`, `XcodeMV` |
| **Project Info** | `XcodeListWindows`, `XcodeListNavigatorIssues`, `XcodeRefreshCodeIssuesInFile` |
| **Build & Test** | `BuildProject`, `GetBuildLog`, `RunAllTests`, `RunSomeTests`, `GetTestList` |
| **Advanced** | `ExecuteSnippet`, `RenderPreview`, `DocumentationSearch` |

## Usage Examples

### Build Project

```
1. XcodeListWindows() → Returns tabIdentifier
2. BuildProject({ "tabIdentifier": "windowtab1" })
```

### Run Tests

```
1. XcodeListWindows()
2. RunAllTests({ "tabIdentifier": "windowtab1" })
```

### Edit Files

```
XcodeUpdate({
  "filePath": "Sources/MyView.swift",
  "oldString": "Text(\"Hello\")",
  "newString": "Text(\"Hello, World!\")"
})
```

## Project Context

Create an `AGENTS.md` or `CLAUDE.md` file in your project root:

```markdown
# Project Context

## Build System
- iOS 26 SwiftUI project
- Main scheme: MyApp
- Use BuildProject to compile

## Testing
- Run tests with RunAllTests
```

## Configuration

`.mcp.json`:
```json
{
  "mcpServers": {
    "xcode-mcpbridge": {
      "type": "stdio",
      "command": "xcrun",
      "args": ["mcpbridge"]
    }
  }
}
```

## Troubleshooting

- **Connection fails**: Ensure Xcode is running with a project open, and Xcode Tools MCP is enabled in Settings
- **"Tool XcodeListWindows has an output schema but did not return structured content"**: Bug in Xcode 26.3 RC 1. Upgrade to RC 2+
- **Multiple Xcode instances**: The bridge auto-detects; or set `MCP_XCODE_PID` env var

## Documentation

Full tool reference: `skills/xcode-mcp/SKILL.md`

## Resources

- [Apple Documentation](https://developer.apple.com/documentation/xcode/giving-external-agents-access-to-xcode)
- [Rudrank's Guide](https://rudrank.com/exploring-xcode-using-mcp-tools-cursor-external-clients)

## License

MIT

