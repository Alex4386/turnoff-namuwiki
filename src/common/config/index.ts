import browser from 'webextension-polyfill';
import { ConfigInterface } from './interface';

let configCache: ConfigInterface;

/* = config update listener = */
browser.storage.onChanged.addListener(async () => {
  await loadConfig();
});

export function getConfig(): ConfigInterface {
  return configCache;
}

export async function loadConfig(): Promise<ConfigInterface> {
  let thisConfig: ConfigInterface;
  do {
    thisConfig = await browser.storage.sync.get(null) as ConfigInterface;
    if (Object.keys(thisConfig).length === 0) {
      await browser.storage.sync.set({
        blocked: { site: {}, group: {} },
        redirected: {},
        adblock: { namuwiki: false },
        proxy: { dbpia: "" },
        searchFilter: false,
        intelliBan: { enabled: false, url: "", rules: [] },
        bannedPage: { message: "", retry: false }
      } as unknown as ConfigInterface);
    }
    configCache = thisConfig;
  } while (Object.keys(thisConfig).length === 0);

  return thisConfig;
}

export function updateConfig(thisConfig: ConfigInterface): Promise<void> {
  return browser.storage.sync.set(thisConfig);
}