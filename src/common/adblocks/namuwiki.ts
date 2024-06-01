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

export const adBlockers: Parameters<typeof browser.declarativeNetRequest.updateDynamicRules>[0]['addRules'] = [
  {
      id: 10001,
      priority: 1,
      action: {
          type: "block"
      },
      condition: {
          /*    
            {
                urls: [
                    "https://*.googlesyndication.com/*",
                    "https://*.doubleclick.net/*",
                    "https://adservice.google.com/*",
                    "https://arca.live/api/ads*",
                    "https://searchad-phinf.pstatic.net/*",
                    "https://ssl.pstatic.net/adimg3.search/*",
                    "https://www.google.com/adsense/search/*",
                    "https://www.google.com/afs/ads*"
                ]
            }, 
          */
          regexFilter: "^https:\/\/(\*\.googlesyndication\.com\/|\*\.doubleclick\.net\/|adservice\.google\.com\/|arca\.live\/api\/ads|searchad-phinf\.pstatic\.net\/|\*\.ssl\.pstatic\.net\/adimg3\.search\/|www\.google\.com\/adsense\/search\/|www\.google\.com\/afs\/ads).*",
          initiatorDomains: ["*://*.namu.wiki/*", "*://*.namu.mirror.wiki/*", "*://*.namu.news/*"],
      },
  }
];

export const namuLiveBlockers: Parameters<typeof browser.declarativeNetRequest.updateDynamicRules>[0]['addRules'] = [
  {
      id: 20001,
      priority: 1,
      action: {
          type: "block"
      },
      condition: {
          /*    
            {
                urls: [
                    "https://search.namu.wiki/api/ranking",
                    "https://arca.live/*",
                    "https://namu.news/*",
                    "https://namu.news/api/articles/cached",
                ]
            }, 
          */
          regexFilter: "^https:\/\/(search\.namu\.wiki\/api\/ranking|arca\.live\/.*|namu\.news\/.*|namu\.news\/api\/articles\/cached).*",
      },
  }
];

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

