import { ExtensionContext, StatusBarAlignment, window } from 'vscode';
import { TerminalManager } from './terminalManager';
import { InstallDetector } from './installDetector';
import { registerCommands } from './commands';

export function activate(context: ExtensionContext): void {
  const terminalManager = new TerminalManager();
  const installDetector = new InstallDetector();

  context.subscriptions.push(...registerCommands(context, terminalManager, installDetector));
  context.subscriptions.push(terminalManager);

  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
  statusBarItem.text = '$(terminal) CodeWhale';
  statusBarItem.command = 'codewhaleLauncher.open';
  statusBarItem.tooltip = 'Open CodeWhale terminal';
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);
}

export function deactivate(): void {
  // no-op: disposable resources are cleaned up by VS Code via subscriptions
}
