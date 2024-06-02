import browser from "webextension-polyfill";
import { getActiveRules } from "../rules/enabled";

/**
 * Why AdBlock NamuWiki?
 *
 * Contents of namuwiki is distributed under Creative Commons-BY-NC-SA License.
 * which DOESN'T allow webpage to create their ad-revenue or sell the content
 * with their content, BUT, Current owner of namuwiki is literally *selling*
 * content by violating namuwiki's license before acquisition (even they are
 * still using CC-BY-NC-SA License).
 *
 * That's totally giving content creators a fuck. But many people are not using
 * ad-block to support the creators, and actually, Namuwiki is still in the
 * Acceptable-Ads lists.
 *
 * which is un-acceptable for me entirely because they are earning their
 * ad-revenue by copyright infringement.
 *
 * From Version 0.6.0, I am boycotting namuwiki's ad-revenue system by
 * blocking them entirely.
 *
 * FUCK YOU, umanle corporation.
 */

function getNamuwikiInitDomains() {
  const namuwikiInitDomains = getActiveRules([
    'namuwiki',
    'namuwikiMirror',
    'namulive',
    'namunews',
  ])?.map(n => 'https://'+n.baseURL).map(n => new URL(n).hostname);

  return namuwikiInitDomains;  
}

export function getAdBlockers(): Parameters<typeof browser.declarativeNetRequest.updateDynamicRules>[0]['addRules'] {
  return [
    "https://*.googlesyndication.com/*",
    "https://*.doubleclick.net/*",
    "https://adservice.google.com/*",
    "https://arca.live/api/ads*",
    "https://searchad-phinf.pstatic.net/*",
    "https://ssl.pstatic.net/adimg3.search/*",
    "https://www.google.com/adsense/search/*",
    "https://www.google.com/afs/ads*",
  ].map((n, i) => ({
    id: 10000+i,
    priority: 1,
    action: {
      type: 'block',
    },
    condition: {
      urlFilter: n,
      initiatorDomains: getNamuwikiInitDomains(),
    },
  }));
}

export function getArcaLiveBlockers(): Parameters<typeof browser.declarativeNetRequest.updateDynamicRules>[0]['addRules'] {
  // they actually decided to give a fuck.
  // /i/ for everything lol

  return [
    "https://arca.live/*",

    // Well, no real-time ranking for ya.
    "https://namu.wiki/i/*",
  ].map((n, i) => ({
    id: 11000+i,
    priority: 1,
    action: {
      type: "block"
    },
    condition: {
      urlFilter: n,
    },
  }));
}

export function getNamuNewsBlockers(): Parameters<typeof browser.declarativeNetRequest.updateDynamicRules>[0]['addRules'] {
  // they actually decided to give a fuck.
  // /i/ for everything lol

  return [    
    "https://namu.news/*",
    "https://namu.news/api/articles/cached",

    // Well, no real-time ranking for ya.
    "https://namu.wiki/i/*",
  ].map((n, i) => ({
    id: 12000+i,
    priority: 1,
    action: {
      type: "block"
    },
    condition: {
      urlFilter: n,
    },
  }));
}

export async function unregisterDynamicRules(rules: Parameters<typeof browser.declarativeNetRequest.updateDynamicRules>[0]['addRules']) {
  await browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [...(rules ?? []).map(n => n.id)],
  });
}

export async function reregisterDynamicRules(rules: Parameters<typeof unregisterDynamicRules>[0]) {
  await unregisterDynamicRules(rules);
  await browser.declarativeNetRequest.updateDynamicRules({
    addRules: rules,
  });
}

