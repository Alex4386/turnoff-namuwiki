import browser from 'webextension-polyfill';
import { ConfigInterface } from './interface';

let configCache: ConfigInterface;
let lastConfigSync: number = 0;
const configExpiration = 500; // 1 second

/* = config update listener = */
browser.storage.onChanged.addListener(async () => {
  await loadConfig();
});

export function getConfig(dontCareExpired?: boolean): ConfigInterface | undefined {
  if (configCache === undefined) {
    console.warn("Config not fetched yet. Please call loadConfig() first.");
    return undefined;
  } else if (lastConfigSync + configExpiration < Date.now() && !dontCareExpired) {
    console.warn("Config expired. Please call loadConfig() first.");
    return undefined;
  }

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
    lastConfigSync = Date.now();
  } while (Object.keys(thisConfig).length === 0);

  return thisConfig;
}

export function updateConfig(thisConfig: ConfigInterface): Promise<void> {
  return browser.storage.sync.set(thisConfig);
}