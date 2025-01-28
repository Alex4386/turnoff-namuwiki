import browser from 'webextension-polyfill';
import { getConfig, loadConfig } from '../config';
import { fetchRepo } from '../global';
import { BlockedSite } from './model';
import { SerializedBlockedSite } from './interface';
import { serializeRegex } from '../regex';

let blockRulesCache: BlockedSite[];

/**
 * Fetches Rules from `/filter/blockedSites.json`
 * @returns {Promise<BlockedSite[]>} Rules
 */
async function fetchLocalBlockRules(): Promise<BlockedSite[]> {
  const data = await fetch("/filter/blockedSites.json");
  const res = await data.json();
  if (Array.isArray(res)) {
    return res.map(BlockedSite.fromSerialized);
  }

  return [];
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

const BLOCK_RULE_EXPIRATION = 1000 * 60 * 60 * 24; // 1 day

export async function loadBlockRules(): Promise<BlockedSite[]> {
  // use local cache if available
  try {
    console.log('Fetching block rules from remote');
    const config = getConfig() ?? await loadConfig();

    // check if remoteData cache is available
    if (config.blocked.lastUpdated && config.blocked.onlineRules && config.blocked.onlineRules.length > 0) {
      if (config.blocked.lastUpdated + BLOCK_RULE_EXPIRATION > Date.now()) {
        blockRulesCache = config.blocked.onlineRules.map(BlockedSite.fromSerialized);
        return blockRulesCache;
      }
    }

    const remoteData = await fetch(config.blocked.url);
    const remoteRules = await remoteData.json();
    
    if (Array.isArray(remoteRules)) {
      config.blocked.onlineRules = remoteRules;
      config.blocked.lastUpdated = Date.now();
      await browser.storage.sync.set(config);
      blockRulesCache = remoteRules.map(BlockedSite.fromSerialized);
      return blockRulesCache;
    }
  } catch (e) {
    console.error('Remote fetch failed, using local cached rules, first.', e);

    try {
      const config = getConfig() ?? await loadConfig();
      if (config.blocked && config.blocked.onlineRules && config.blocked.onlineRules.length > 0) {
        blockRulesCache = config.blocked.onlineRules.map(BlockedSite.fromSerialized);
        return blockRulesCache;
      }
    } finally {

    }
  }

  // Fallback to local if remote fails
  const localRules = await fetchLocalBlockRules();
  blockRulesCache = localRules;
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