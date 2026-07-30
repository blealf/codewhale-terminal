import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { isWindows } from './utils';
import { InstallDetectionResult } from './types';

interface ExecResult {
  stdout: string;
  stderr: string;
}

export class InstallDetector {
  async detect(command: string): Promise<InstallDetectionResult> {
    const normalized = command.trim();
    if (!normalized) {
      return {
        isInstalled: false,
        errorMessage: 'Configured CodeWhale command is empty.'
      };
    }

    const resolved = await this.findExecutable(normalized);
    if (!resolved) {
      return {
        isInstalled: false,
        errorMessage: 'CodeWhale executable not found.'
      };
    }

    return {
      isInstalled: true,
      executablePath: resolved
    };
  }

  private async findExecutable(command: string): Promise<string | undefined> {
    if (this.isPathLike(command)) {
      return this.checkFilePath(command);
    }

    const tool = isWindows() ? 'where' : 'which';
    try {
      const result = await this.execFileAsync(tool, [command]);
      const candidate = result.stdout.split(/\r?\n/).find((line) => line.trim().length > 0);
      return candidate?.trim();
    } catch {
      return undefined;
    }
  }

  private isPathLike(command: string): boolean {
    return command.includes(path.sep) || (isWindows() && command.includes('/'));
  }

  private async checkFilePath(command: string): Promise<string | undefined> {
    const resolved = path.isAbsolute(command) ? command : path.resolve(process.cwd(), command);
    try {
      await fs.promises.access(resolved, fs.constants.X_OK);
      return resolved;
    } catch {
      return undefined;
    }
  }

  private execFileAsync(command: string, args: string[]): Promise<ExecResult> {
    return new Promise<ExecResult>((resolve, reject) => {
      childProcess.execFile(command, args, { shell: false }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({ stdout: stdout ?? '', stderr: stderr ?? '' });
      });
    });
  }
}
