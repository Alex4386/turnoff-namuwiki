import browser from 'webextension-polyfill';
import { getConfig, loadConfig } from '../config/index';
import { fetchRepo } from '../global';
import { BlockedSite } from './model';
import { SerializedBlockedSite } from './interface';
import { serializeRegex } from '../regex/index';

let blockRulesCache: BlockedSite[];

/**
 * Fetches Rules from `/filter/blockedSites.json`
 * @returns {Promise<BlockedSite[]>} Rules
 */
async function fetchLocalBlockRules(): Promise<BlockedSite[]> {
  const data = await fetchRepo("/filter/blockedSites.json", {repo: false});
  const res = await data.json();
  if (Array.isArray(res)) {
    return res.map(BlockedSite.fromSerialized);
  }

  return [];
}

/**
 * Fetches Latest Rule data from GitHub Repository
 * @returns {Promise<BlockedSite[]>} Rules
 */
async function fetchOnlineBlockRules(): Promise<BlockedSite[]> {
  const data = await fetchRepo("/filter/blockedSites.json", {repo: true});
  const res = await data.json();
  const config = getConfig() ?? await loadConfig();
  if (Array.isArray(res)) {
    config.blocked.onlineRules = res;
    await browser.storage.sync.set(config);

    return res.map(BlockedSite.fromSerialized);
  }

  return [];
}

/**
 * Use the cache if available,
 * Else fetch the latest rules from GitHub Repository
 * (Can be used for sync)
 */
export async function getOnlineBlockRules(): Promise<BlockedSite[]> {
  let config = await getConfig();
  if (config?.blocked?.onlineRules === undefined) {
    try {
      await fetchOnlineBlockRules();
      config = getConfig();
    } catch(e) {
      console.error("Failed to fetch online block rules", e);
    }

    return [];
  }

  return config.blocked.onlineRules.map(BlockedSite.fromSerialized);
}

/**
 * Use cache if available, 
 * otherwise fetches Rules from `/filter/redirectedSites.json`
 * @returns {Promise<RedirectTargetSite[]>} Rules
 */
export function getBlockRules(): BlockedSite[] | undefined {
  if (blockRulesCache === undefined) {
    // fetchBlockRules is required!!
    console.warn("Block Rules not fetched yet. Please call fetchBlockRules() first.")
    return undefined;
  }

  return blockRulesCache;
}

export async function loadBlockRules(): Promise<BlockedSite[]> {
  const localRules = await fetchLocalBlockRules();
  const onlineRules = await getOnlineBlockRules();
  
  // merge two rules. but if there is duplicate on online,
  // remove the local one.
  const deduppedLocalRules = localRules.filter((l) => !onlineRules.find(n => n.id === l.id));
  blockRulesCache = [...onlineRules, ...deduppedLocalRules];

  return blockRulesCache;
}

export function serializeBlockRule(rule: BlockedSite): SerializedBlockedSite {
  return {
    id: rule.id,
    group: rule.group,
    name: rule.name,
    baseURL: rule.baseURL,
    articleView: rule.articleView ? serializeRegex(rule.articleView) : undefined,
    searchView: rule.searchView ? serializeRegex(rule.searchView) : undefined,
    redirect: rule.redirect,
  }
}