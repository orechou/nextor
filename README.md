# Nextor

<p align="center">
  <img src="assets/screenshot.png" alt="Nextor Screenshot" width="800">
</p>

<p align="center">
  <strong>A modern, feature-rich Markdown editor built with Tauri v2</strong>
</p>

<p align="center">
  Designed for writers and developers who need a clean yet powerful writing environment.
</p>

<p align="center">
  <a href="README.zh-CN.md">中文</a>
</p>

## Features

### WeChat Official Account Export (Highlight)

Nextor provides a dedicated export feature for WeChat Official Accounts with **7 built-in themes**:

- **Minimal** - Clean and simple design
- **Colorful** - Vibrant colors with eye-catching headings
- **Dark** - Easy on the eyes
- **Elegant** - Classic serif font style
- **Modern** - Card-style layout with gradients and shadows
- **Business** - Professional business style
- **Tech** - Developer-focused design

**Export Options:**
- Copy rich text directly to clipboard for pasting into WeChat editor
- Save as standalone HTML file with inline CSS
- WeChat preview mode to see how your content will look

### Core Editing

- **Syntax Highlighting** - Beautiful code blocks powered by highlight.js
- **Live Preview** - Real-time Markdown preview with split view and scroll sync
- **Find & Replace** - Powerful search with case-sensitive and regex support (`Cmd+F`)
- **Status Bar** - Word count, character count, and line statistics
- **Auto-save** - Never lose your work with automatic session persistence

### Markdown Support

- **GitHub Flavored Markdown** - Full GFM support including tables, task lists, and strikethrough
- **Mathematical Formulas** - LaTeX math rendering via KaTeX (inline `$...$` and block `$$...$$`)
- **Diagrams** - Support for Mermaid diagrams with theme-aware rendering
- **Code Highlighting** - Syntax highlighting for 100+ languages
- **Wiki Links** - Navigate between files with `[[wiki-style]]` links
- **Internal Links** - Smooth scrolling to footnotes and sections

### View Modes

- **Editor Only** - Focused writing mode (`Cmd+3`)
- **Preview Only** - Read mode with rendered Markdown
- **Split View** - Side-by-side editing and preview
- **Presentation Mode** - Display your Markdown as slides (`Cmd+4`)
- **Table of Contents** - Auto-generated TOC sidebar (`Cmd+5`)

### Export Formats

- **WeChat Official Account** - 7 themed templates with inline CSS
- **HTML** - Standalone HTML with embedded styles
- **PDF** - A4 format using html2canvas and jsPDF

### File Management

- **File Explorer** - Built-in folder tree navigation
- **Multi-Folder Support** - Open and manage multiple folders simultaneously
- **File Operations** - Create, delete, and search files
- **Session Persistence** - Automatically restore open files and folders

### Theme & Internationalization

- **Themes** - Light, Dark, and System theme support
- **Languages** - English and Chinese (Simplified)

## Installation

### Homebrew (macOS)

```bash
# Tap the repository
brew tap orechou/homebrew

# Install Nextor
brew install nextor

# Upgrade to the latest version
brew upgrade nextor
```

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **Rust** and Cargo (for Tauri)

### From Source

```bash
# Clone the repository
git clone https://github.com/orechou/nextor.git
cd nextor

# Install dependencies
pnpm install

# Run development server
pnpm tauri dev
```

### Build from Source

```bash
# Build for production
pnpm build
```

The built application will be in `src-tauri/target/release/bundle/`.

## Usage

### File Operations

| Action | Menu | Shortcut |
|--------|------|----------|
| New File | `File > New` | `Cmd+N` |
| Open File | `File > Open` | `Cmd+O` |
| Open Folder | `File > Open Folder` | `Cmd+Shift+O` |
| Save File | `File > Save` | `Cmd+S` |
| Save As | `File > Save As` | `Cmd+Shift+S` |

### View Modes

| Action | Shortcut |
|--------|----------|
| Toggle Folder Tree | `Cmd+1` |
| Toggle File List | `Cmd+2` |
| Cycle View Modes | `Cmd+3` (cycles: edit → preview → split) |
| Presentation Mode | `Cmd+4` |
| Toggle Table of Contents | `Cmd+5` |

### Export to WeChat

1. Click `File > Export > WeChat Official Account` or press `Cmd+E`
2. Select a theme from the 7 available options
3. Choose to include article title
4. Click "Copy to Clipboard" then paste into WeChat editor

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+N` | New file |
| `Cmd+O` | Open file |
| `Cmd+S` | Save file |
| `Cmd+Shift+S` | Save as |
| `Cmd+Shift+O` | Open folder |
| `Cmd+Shift+W` | Close folder |
| `Cmd+E` | Export (WeChat) |
| `Cmd+Shift+E` | Export HTML |
| `Cmd+Shift+P` | Export PDF |
| `Cmd+F` | Find |
| `Cmd+Shift+F` | Find and Replace |
| `Cmd+1` | Toggle file explorer |
| `Cmd+2` | Toggle file list |
| `Cmd+3` | Cycle view modes (edit → preview → split) |
| `Cmd+4` | Toggle presentation mode |
| `Cmd+5` | Toggle table of contents |
| `Cmd+,` | Open settings |
| `Cmd+Shift+T` | System theme |
| `Cmd+Shift+L` | Light theme |
| `Cmd+Shift+D` | Dark theme |
| `Cmd+Option+I` | Toggle developer tools |

## Tech Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **CodeMirror 6** - Code editor
- **react-markdown** - Markdown rendering
- **KaTeX** - Math rendering
- **Mermaid** - Diagram rendering

### Backend

- **Rust** - Systems programming
- **Tauri v2** - Desktop framework
- **Tokio** - Async runtime

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm tauri dev

# Type checking
pnpm tsc --noEmit

# Build for production
pnpm build
```

## License

[MIT](LICENSE) - Copyright (c) 2025 Nextor Contributors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Spell checking
- [ ] Vim key bindings
- [ ] More export formats (DOCX, EPUB)
- [ ] Cloud storage integration
- [ ] Collaboration features
- [ ] Plugin system

## Acknowledgments

Built with:
- [Tauri](https://tauri.app/) - Rust-based desktop framework
- [React](https://react.dev/) - UI library
- [CodeMirror](https://codemirror.net/) - Code editor
- [shadcn/ui](https://ui.shadcn.com/) - UI components
