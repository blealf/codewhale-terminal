import { commands as vscodeCommands, ExtensionContext, Uri, window, workspace } from 'vscode';
import { InstallDetector } from './installDetector';
import { TerminalManager } from './terminalManager';
import { configurationCommandKey, defaultCommand, installationGuideUrl, messages } from './constants';
import { getLaunchDirectory, normalizeCommand, quoteCommand } from './utils';

export function registerCommands(
  context: ExtensionContext,
  terminalManager: TerminalManager,
  installDetector: InstallDetector
) {
  const openDisposable = vscodeCommands.registerCommand('codewhaleLauncher.open', async () => {
    await openCommand(context, terminalManager, installDetector);
  });

  const restartDisposable = vscodeCommands.registerCommand('codewhaleLauncher.restart', async () => {
    await restartCommand(context, terminalManager, installDetector);
  });

  const stopDisposable = vscodeCommands.registerCommand('codewhaleLauncher.stop', () => {
    stopCommand(terminalManager);
  });

  context.subscriptions.push(openDisposable, restartDisposable, stopDisposable);
  return [openDisposable, restartDisposable, stopDisposable];
}

async function openCommand(
  context: ExtensionContext,
  terminalManager: TerminalManager,
  installDetector: InstallDetector
): Promise<void> {
  const configuredCommand = normalizeCommand(
    workspace.getConfiguration().get<string>(configurationCommandKey, defaultCommand)
  );

  if (!configuredCommand) {
    void window.showErrorMessage(messages.executableNotFound);
    return;
  }

  const detection = await installDetector.detect(configuredCommand);
  if (!detection.isInstalled) {
    await showInstallationError();
    return;
  }

  const launchCommand = quoteCommand(configuredCommand);
  const cwd = getLaunchDirectory(context);

  try {
    await terminalManager.open(launchCommand, cwd);
  } catch {
    void window.showErrorMessage(messages.launchFailed);
  }
}

async function restartCommand(
  context: ExtensionContext,
  terminalManager: TerminalManager,
  installDetector: InstallDetector
): Promise<void> {
  const configuredCommand = normalizeCommand(
    workspace.getConfiguration().get<string>(configurationCommandKey, defaultCommand)
  );

  if (!configuredCommand) {
    void window.showErrorMessage(messages.executableNotFound);
    return;
  }

  const detection = await installDetector.detect(configuredCommand);
  if (!detection.isInstalled) {
    await showInstallationError();
    return;
  }

  const launchCommand = quoteCommand(configuredCommand);
  const cwd = getLaunchDirectory(context);

  try {
    await terminalManager.restart(launchCommand, cwd);
    void window.showInformationMessage(messages.restarted);
  } catch {
    void window.showErrorMessage(messages.launchFailed);
  }
}

function stopCommand(terminalManager: TerminalManager): void {
  terminalManager.stop();
  void window.showInformationMessage(messages.stopped);
}

async function showInstallationError(): Promise<void> {
  const action = await window.showErrorMessage(messages.executableNotFound, 'Open Installation Guide');
  if (action) {
    await vscodeCommands.executeCommand('vscode.open', Uri.parse(installationGuideUrl));
  }
}
