import { commands as vscodeCommands, Disposable, Terminal, ViewColumn, window } from 'vscode';
import {
  activeTerminalPollAttempts,
  activeTerminalPollIntervalMs,
  lockGroupCommand,
  messages,
  terminalName
} from './constants';
import { ActivationState } from './types';

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export class TerminalManager implements Disposable {
  private terminal?: Terminal;
  private readonly terminalCloseListener: Disposable;
  private state: ActivationState = 'stopped';

  constructor() {
    this.terminalCloseListener = window.onDidCloseTerminal(this.onTerminalClosed, this);
  }

  dispose(): void {
    this.terminalCloseListener.dispose();
    if (this.terminal) {
      this.terminal.dispose();
      this.terminal = undefined;
    }
  }

  getState(): ActivationState {
    return this.state;
  }

  async open(command: string, cwd: string): Promise<void> {
    const existingTerminal = this.findAvailableTerminal();
    if (existingTerminal) {
      existingTerminal.show(false);
      this.terminal = existingTerminal;
      this.state = 'running';
      await this.lockTerminalGroup(existingTerminal);
      return;
    }

    const terminal = this.createTerminal(cwd);
    terminal.show(false);
    terminal.sendText(command, true);
    this.state = 'running';
    await this.lockTerminalGroup(terminal);
  }

  async restart(command: string, cwd: string): Promise<void> {
    this.disposeTerminal();
    const terminal = this.createTerminal(cwd);
    terminal.show(false);
    terminal.sendText(command, true);
    this.state = 'running';
    await this.lockTerminalGroup(terminal);
  }

  stop(): void {
    if (this.terminal) {
      this.terminal.dispose();
      this.terminal = undefined;
    }
    this.state = 'stopped';
  }

  private createTerminal(cwd: string): Terminal {
    try {
      this.terminal = window.createTerminal({
        name: terminalName,
        cwd,
        location: {
          viewColumn: ViewColumn.Beside,
          preserveFocus: false
        }
      });
      this.state = 'launching';
      return this.terminal;
    } catch {
      this.state = 'stopped';
      throw new Error(messages.terminalCreateFailed);
    }
  }

  private async lockTerminalGroup(terminal: Terminal): Promise<void> {
    if (!(await this.waitForActiveTerminal(terminal))) {
      return;
    }

    try {
      await vscodeCommands.executeCommand(lockGroupCommand);
    } catch {
      // Locking is a convenience: leave the group unlocked if the command is unavailable.
    }
  }

  private async waitForActiveTerminal(terminal: Terminal): Promise<boolean> {
    for (let attempt = 0; attempt < activeTerminalPollAttempts; attempt += 1) {
      if (window.activeTerminal === terminal) {
        return true;
      }
      await delay(activeTerminalPollIntervalMs);
    }

    return window.activeTerminal === terminal;
  }

  private findAvailableTerminal(): Terminal | undefined {
    if (this.terminal && this.isTerminalAvailable(this.terminal)) {
      return this.terminal;
    }

    const existing = window.terminals.find((terminal) => terminal.name === terminalName && this.isTerminalAvailable(terminal));
    if (existing) {
      this.terminal = existing;
      return existing;
    }

    return undefined;
  }

  private disposeTerminal(): void {
    if (this.terminal) {
      this.terminal.dispose();
      this.terminal = undefined;
    }
  }

  private onTerminalClosed(closed: Terminal): void {
    if (this.terminal && closed === this.terminal) {
      this.terminal = undefined;
      this.state = 'stopped';
    }
  }

  private isTerminalAvailable(terminal: Terminal): boolean {
    if (!window.terminals.includes(terminal)) {
      return false;
    }

    const exitStatus = (terminal as any).exitStatus;
    return exitStatus == null;
  }
}
