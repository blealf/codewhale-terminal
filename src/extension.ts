import { commands, ExtensionContext, window } from 'vscode';
import { TerminalManager } from './terminalManager';
import { InstallDetector } from './installDetector';
import { registerCommands } from './commands';
import { viewId } from './constants';
import { PlaceholderViewProvider } from './placeholderView';

export function activate(context: ExtensionContext): void {
  const terminalManager = new TerminalManager();
  const installDetector = new InstallDetector();

  context.subscriptions.push(...registerCommands(context, terminalManager, installDetector));
  context.subscriptions.push(terminalManager);

  const placeholderProvider = new PlaceholderViewProvider();
  const view = window.createTreeView(viewId, {
    treeDataProvider: placeholderProvider,
    showCollapseAll: false
  });

  context.subscriptions.push(view);
  context.subscriptions.push(
    view.onDidChangeVisibility(async (event) => {
      if (!event.visible) {
        return;
      }

      await commands.executeCommand('codewhaleLauncher.open');
    })
  );
}

export function deactivate(): void {
  // no-op: disposable resources are cleaned up by VS Code via subscriptions
}
