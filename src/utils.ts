import * as os from 'os';
import * as path from 'path';
import { ExtensionContext, window, workspace } from 'vscode';

export function isWindows(): boolean {
  return process.platform === 'win32';
}

export function getHomeDirectory(): string {
  return os.homedir();
}

export function normalizeCommand(command: string): string {
  return command.trim();
}

export function quoteCommand(command: string): string {
  const trimmed = command.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (/^[^\s"']+$/.test(trimmed)) {
    return trimmed;
  }
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed;
  }
  return `"${trimmed}"`;
}

export function getLaunchDirectory(context: ExtensionContext): string {
  const workspaceFolder = workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceFolder) {
    window.showWarningMessage('No workspace found. Launching CodeWhale from the home directory.');
    return getHomeDirectory();
  }

  const extensionPath = context.extensionPath;
  const normalizedWorkspace = path.resolve(workspaceFolder);
  const normalizedExtension = path.resolve(extensionPath);
  if (normalizedWorkspace === normalizedExtension || normalizedWorkspace.startsWith(normalizedExtension + path.sep)) {
    window.showWarningMessage('Workspace root is the extension directory. Launching CodeWhale from the home directory.');
    return getHomeDirectory();
  }

  return normalizedWorkspace;
}
