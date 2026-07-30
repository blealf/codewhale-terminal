# CodeWhale Launcher

CodeWhale Launcher is a lightweight VS Code extension that opens your locally installed `codewhale` CLI in a dedicated integrated terminal. It does not bundle or communicate with CodeWhale directly.

## Features

- Activity Bar launcher for CodeWhale
- Reuses a single dedicated `CodeWhale` terminal
- Detects whether the configured executable exists
- Supports Windows, macOS, and Linux
- Uses the user's workspace root or home directory for the terminal
- Does not bundle CodeWhale or add CLI dependencies

## Installation

1. Clone or download this repository.
2. Run `npm install`.
3. Open the folder in VS Code.
4. Press `F5` to launch the extension in the Extension Development Host.

## Requirements

- VS Code
- Local `codewhale` CLI installed and available on your PATH or configured via `codewhale.command`

## Configuration

The extension exposes one setting:

- `codewhale.command`
  - Default: `codewhale`
  - Example values: `codewhale-beta`, `cw`, `/usr/local/bin/codewhale`

## Commands

- `CodeWhale: Open` — Open or focus the dedicated CodeWhale terminal
- `CodeWhale: Restart` — Restart the CodeWhale terminal session
- `CodeWhale: Stop` — Stop and dispose the CodeWhale terminal

## Usage

1. Click the `CodeWhale` icon in the Activity Bar.
2. The extension automatically opens the terminal and launches the configured CodeWhale command.

## Screenshots

*Placeholder screenshots showing the CodeWhale Activity Bar icon and integrated terminal.*

## Development

- `npm install`
- `npm run compile`
- `npm run watch`

## Packaging

Use `vsce package` or the VS Code Extension Manager once the extension is ready.
# codewhale-terminal
