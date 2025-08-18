# Cursor Settings Sync with GitHub

This guide explains how to sync your Cursor settings across devices using GitHub, similar to VS Code's settings sync.

## Method 1: Built-in Settings Sync (Recommended)

### Step 1: Enable Settings Sync
1. Open Cursor
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Settings Sync" and select "Settings Sync: Turn On..."
4. Choose "Sign in with GitHub"
5. Authorize Cursor to access your GitHub account

### Step 2: Configure Sync Options
Choose what to sync:
- ✅ Settings
- ✅ Keybindings
- ✅ Extensions
- ✅ User snippets
- ✅ UI State

### Step 3: Verify Sync
- A private repository called `cursor-settings` will be created in your GitHub account
- Your settings will automatically sync across all devices where you sign in with the same GitHub account

## Method 2: Manual Repository Setup

### Step 1: Create a Settings Repository
1. Create a new GitHub repository (e.g., `my-cursor-settings`)
2. Clone it to your local machine
3. Copy your Cursor settings files to this repository

### Step 2: Export Your Settings
Your settings are stored in:
- **Windows**: `%APPDATA%\Cursor\User\settings.json`
- **macOS**: `~/Library/Application Support/Cursor/User/settings.json`
- **Linux**: `~/.config/Cursor/User/settings.json`

### Step 3: Sync Settings
1. Copy your settings files to the repository
2. Commit and push to GitHub
3. On other devices, clone the repository and copy settings to the appropriate location

## Project-Specific Settings

This project includes the following `.vscode` configuration files:

### `settings.json`
- Editor preferences (font, theme, formatting)
- File handling settings
- Language-specific configurations
- Git integration settings

### `extensions.json`
- Recommended extensions for the project
- Automatically prompts team members to install extensions

### `launch.json`
- Debug configurations for Chrome/Edge
- Source map configurations for development

### `tasks.json`
- NPM script tasks (dev, build, preview, lint)
- Quick access to common development commands

### `keybindings.json`
- Custom keyboard shortcuts for development
- Project-specific shortcuts for React/TypeScript workflow
- Git, terminal, and editor shortcuts

## Commands to Access Settings

### Open Settings
- `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac)
- Or: `Ctrl+Shift+P` → "Preferences: Open Settings (UI)"

### Open Settings JSON
- `Ctrl+Shift+P` → "Preferences: Open Settings (JSON)"

### Open Keybindings
- `Ctrl+Shift+P` → "Preferences: Open Keyboard Shortcuts"
- Or: `Ctrl+K Ctrl+S` (Windows/Linux) or `Cmd+K Cmd+S` (Mac)

### Open Extensions
- `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)

## Useful Settings for Development

### Editor Settings
```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
  "editor.lineHeight": 1.5,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": true,
  "editor.rulers": [80, 120],
  "editor.bracketPairColorization.enabled": true
}
```

### File Settings
```json
{
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true
}
```

### Git Settings
```json
{
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "git.autofetch": true
}
```

### Keyboard Shortcuts
```json
[
  {
    "key": "ctrl+shift+1",
    "command": "npm.run",
    "args": "dev"
  },
  {
    "key": "ctrl+shift+2",
    "command": "npm.run",
    "args": "build"
  },
  {
    "key": "ctrl+shift+3",
    "command": "npm.run",
    "args": "preview"
  },
  {
    "key": "ctrl+shift+4",
    "command": "npm.run",
    "args": "lint"
  }
]
```

## Troubleshooting

### Settings Not Syncing
1. Check your internet connection
2. Verify GitHub authorization
3. Restart Cursor
4. Check the Settings Sync status in the bottom-left corner

### Conflicts
1. Cursor will show a notification if there are conflicts
2. Choose which version to keep (local or remote)
3. Manually merge if needed

### Reset Settings
1. `Ctrl+Shift+P` → "Settings Sync: Reset"
2. Choose what to reset
3. Confirm the action

## Keyboard Shortcuts Management

### How to Add Custom Shortcuts

1. **Open Keybindings JSON:**
   - `Ctrl+Shift+P` → "Preferences: Open Keyboard Shortcuts (JSON)"
   - Or: `Ctrl+K Ctrl+S` → Click the "Open Keyboard Shortcuts (JSON)" icon

2. **Add Custom Shortcuts:**
   ```json
   [
     {
       "key": "ctrl+shift+1",
       "command": "npm.run",
       "args": "dev",
       "when": "workspaceFolderCount == 1"
     }
   ]
   ```

3. **Shortcut Structure:**
   - `key`: The keyboard combination (e.g., "ctrl+shift+1")
   - `command`: The action to execute
   - `args`: Additional arguments (optional)
   - `when`: Context when the shortcut is active (optional)

### Project-Specific Shortcuts

The included `keybindings.json` provides:

#### Development Workflow
- `Ctrl+Shift+1` - Run dev server
- `Ctrl+Shift+2` - Build project
- `Ctrl+Shift+3` - Preview build
- `Ctrl+Shift+4` - Run linter

#### Editor Operations
- `Ctrl+/` - Toggle line comment
- `Ctrl+Shift+/` - Toggle block comment
- `Ctrl+D` - Select next occurrence
- `Ctrl+Shift+L` - Select all occurrences
- `Ctrl+Shift+K` - Delete line
- `Alt+Shift+↑/↓` - Move line up/down

#### Git Operations
- `Ctrl+Shift+G S` - Open Source Control
- `Ctrl+Shift+G C` - Commit changes
- `Ctrl+Shift+G P` - Push changes
- `Ctrl+Shift+G L` - Pull changes

#### Terminal & Debug
- `Ctrl+Shift+R` - New terminal
- `Ctrl+Shift+T` - Toggle terminal
- `Ctrl+Shift+D` - Open debug panel

### Syncing Shortcuts

#### Method 1: Built-in Sync
- Enable Settings Sync with GitHub
- Check "Keybindings" in sync options
- Shortcuts sync automatically across devices

#### Method 2: Project Repository
- Include `keybindings.json` in your project's `.vscode` folder
- Team members get the same shortcuts when they open the project
- Overrides user keybindings for project-specific shortcuts

### Troubleshooting Shortcuts

#### Conflicts
- Check for duplicate key combinations
- Use `Ctrl+Shift+P` → "Preferences: Open Keyboard Shortcuts" to see conflicts
- Modify the conflicting shortcut or remove it

#### Not Working
- Verify the command exists
- Check the `when` condition
- Restart Cursor after changes
- Check if another extension is using the same key

## Additional Tips

1. **Backup Important Settings**: Always backup custom settings before major updates
2. **Use Workspace Settings**: Project-specific settings in `.vscode/settings.json` override user settings
3. **Extension Sync**: Enable extension sync to automatically install extensions on new devices
4. **Keybindings**: Custom keybindings sync automatically with settings sync enabled
5. **Project Shortcuts**: Use workspace keybindings for project-specific workflows
6. **Shortcut Conflicts**: Resolve conflicts by checking the keyboard shortcuts panel

## Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [VS Code Settings Reference](https://code.visualstudio.com/docs/getstarted/settings)
- [GitHub Integration](https://cursor.sh/docs/github-integration)
