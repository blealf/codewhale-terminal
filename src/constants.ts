export const extensionId = 'codewhaleLauncher';

export const commands = {
  open: 'codewhaleLauncher.open',
  restart: 'codewhaleLauncher.restart',
  stop: 'codewhaleLauncher.stop'
};

export const viewId = 'codewhaleLauncherView';
export const terminalName = 'CodeWhale';
export const configurationCommandKey = 'codewhale.command';
export const installationGuideUrl = 'https://github.com/Hmbown/CodeWhale';
export const defaultCommand = 'codewhale';

export const messages = {
  executableNotFound: 'CodeWhale executable not found. Install CodeWhale or configure codewhale.command.',
  launchFailed: 'Unable to launch CodeWhale terminal.',
  terminalCreateFailed: 'Unable to create the CodeWhale terminal.',
  workspaceNotFound: 'Unable to determine a launch workspace. Using your home directory.',
  stopped: 'CodeWhale terminal stopped.',
  restarted: 'CodeWhale terminal restarted.'
};
