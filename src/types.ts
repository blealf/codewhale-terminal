export type ActivationState = 'notInstalled' | 'stopped' | 'running' | 'launching';

export interface InstallDetectionResult {
  isInstalled: boolean;
  executablePath?: string;
  errorMessage?: string;
}
