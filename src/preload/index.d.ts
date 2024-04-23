import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/consistent-type-definitions
  interface Window {
    electron: ElectronAPI;
    api: unknown;
  }
}
