---
description: "Use when working with Xcode projects via the official Xcode MCP server. Triggers include: 'build Xcode project', 'test iOS app', 'Xcode MCP', 'xcrun mcpbridge', or any Xcode development task that requires integration with the IDE."
---

# Xcode MCP Skill

This skill enables AI agents to interact with Xcode projects through Apple's official Model Context Protocol (MCP) server. It provides comprehensive documentation of all native Xcode MCP tools, setup instructions, and usage patterns.

## Prerequisites

### 1. Enable Xcode MCP Server

Open Xcode and enable the MCP server:

1. Open **Xcode > Settings** (⌘,)
2. Select **Intelligence** in the sidebar
3. Under **Model Context Protocol**, toggle **Xcode Tools** ON

### 2. Connect Your AI Tool

#### For Claude Code with this plugin:

If this repository is loaded as a Claude Code plugin, the bundled `.mcp.json` already launches `xcrun mcpbridge`. No extra `claude mcp add` step is required.

#### For Claude Code without the plugin:

```bash
claude mcp add --transport stdio xcode -- xcrun mcpbridge
```

Verify with:
```bash
claude mcp list
```

#### For Codex:

```bash
codex mcp add xcode -- xcrun mcpbridge
```

Verify with:
```bash
codex mcp list
```

### 3. Project Setup

**IMPORTANT**: Xcode must be running with a project open for MCP tools to work.

Open your project in Xcode first:

```bash
open MyApp.xcodeproj
# or
open MyApp.xcworkspace
```

### 4. Grant Permission

When the MCP client first connects, Xcode will display a permission dialog. Click **Allow** to grant access.

---

## Xcode MCP Tools Reference

### File Operations

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `XcodeRead` | Read files from the project | `filePath` |
| `XcodeWrite` | Write files to the project | `filePath`, `content` |
| `XcodeUpdate` | Edit files with str_replace-style patches | `filePath`, `oldString`, `newString` |
| `XcodeGlob` | Find files by pattern | `pattern` |
| `XcodeGrep` | Search file contents | `pattern`, `path` |
| `XcodeLS` | List directory contents | `path` |
| `XcodeMakeDir` | Create directories | `path` |
| `XcodeRM` | Remove files | `path` |
| `XcodeMV` | Move/rename files | `source`, `destination` |

### Project Information

| Tool | Description |
|------|-------------|
| `XcodeListWindows` | List open Xcode windows with tabIdentifiers |
| `XcodeListNavigatorIssues` | Get Xcode issues/errors |
| `XcodeRefreshCodeIssuesInFile` | Get live diagnostics for a file |

### Build & Test

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `BuildProject` | Build the Xcode project | `tabIdentifier` |
| `GetBuildLog` | Get build output | `tabIdentifier` |
| `RunAllTests` | Run all tests | `tabIdentifier` |
| `RunSomeTests` | Run specific tests | `tabIdentifier`, `testIdentifiers` |
| `GetTestList` | List available tests | `tabIdentifier` |

### Advanced Features

| Tool | Description |
|------|-------------|
| `ExecuteSnippet` | Run code in a REPL-like environment |
| `RenderPreview` | Render SwiftUI previews as images |
| `DocumentationSearch` | Search Apple docs and WWDC videos |

---

## Common Usage Patterns

### Pattern 1: Build Project

Most tools require a `tabIdentifier`. The workflow is:

1. List windows to get the tabIdentifier
2. Use that identifier in subsequent calls

```
1. XcodeListWindows()
   → Returns: windowtab1, workspacePath: /path/to/Project.xcodeproj

2. BuildProject({ "tabIdentifier": "windowtab1" })
   → Returns: buildResult, elapsedTime, errors
```

### Pattern 2: Run Tests

```
1. XcodeListWindows()
2. GetTestList({ "tabIdentifier": "windowtab1" })
3. RunAllTests({ "tabIdentifier": "windowtab1" })
   # or RunSomeTests with specific testIdentifiers
```

### Pattern 3: Edit Files

```
XcodeUpdate({
  "filePath": "Sources/MyView.swift",
  "oldString": "Text(\"Hello\")",
  "newString": "Text(\"Hello, World!\")"
})
```

---

## Project Context with AGENTS.md

Create an `AGENTS.md` or `CLAUDE.md` file in your project root to help the AI understand your project:

```markdown
# Project Context

## Build System
- iOS 26 SwiftUI project
- Main scheme: MyApp
- Use BuildProject to compile
- SwiftUI previews available via RenderPreview

## Testing
- Test scheme: MyAppTests
- Run tests with RunAllTests or RunSomeTests
- Test results in Xcode's test navigator

## Documentation
- Use DocumentationSearch to find Apple API docs
- WWDC session transcripts are searchable

## Project Structure
- Sources in: Sources/
- Tests in: Tests/
- Resources in: Resources/
```

---

## Environment Variables (Advanced)

For edge cases with multiple Xcode instances:

```json
{
  "xcode-tools": {
    "command": "xcrun",
    "args": ["mcpbridge"],
    "env": {
      "MCP_XCODE_PID": "12345"
    }
  }
}
```

Get PID with: `pgrep -x Xcode`

---

## Troubleshooting

### Issue: "Tool XcodeListWindows has an output schema but did not return structured content"

**Solution**: This was a bug in Xcode 26.3 RC 1. Upgrade to RC 2 or later.

### Issue: Connection fails / Permission denied

**Solution**: 
1. Ensure Xcode is running with a project open
2. Check that Xcode Tools MCP is enabled in Settings
3. Grant permission when the dialog appears

### Issue: Auto-detection not working

**Solution**: 
- The bridge auto-detects when exactly one Xcode process is running
- With multiple Xcode instances, it uses `xcode-select`
- Manually specify `MCP_XCODE_PID` if needed

---

## Quick Reference Commands

| Task | Command Pattern |
|------|-----------------|
| Build project | `BuildProject` with `tabIdentifier` |
| Run all tests | `RunAllTests` with `tabIdentifier` |
| Find files | `XcodeGlob` with pattern |
| Search code | `XcodeGrep` with pattern |
| Read file | `XcodeRead` with `filePath` |
| Edit file | `XcodeUpdate` with old/new strings |
| SwiftUI preview | `RenderPreview` |
| Search docs | `DocumentationSearch` |

---

## Resources

- [Apple Documentation](https://developer.apple.com/documentation/xcode/giving-external-agents-access-to-xcode)
- [Rudrank's Guide](https://rudrank.com/exploring-xcode-using-mcp-tools-cursor-external-clients)
- [BleepingSwift Guide](https://bleepingswift.com/blog/xcode-mcp-server-ai-workflow)
