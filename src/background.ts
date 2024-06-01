import browser from 'webextension-polyfill';
import { getConfig, loadConfig } from './common/config/index';
import { loadAll } from './common/initializer';
import { adBlockers, namuLiveBlockers, reregisterDynamicRules, unregisterDynamicRules } from './common/adblocks/namuwiki';
import { checkIfIntelliBanPass } from './common/intelliBan/index';
import { isNamuLiveBlocked } from './common/utils';
import { getRedirectTargets, handleRedirects } from './common/rules/redirect';
import { getActiveRulesFromConfig } from './common/rules/enabled';
import { runSearchFilterRoutine } from './searchFilters/runner';
import { ConfigInterface } from './common/config/interface';
import { loadBlockRules } from './common/rules/block';

/* = Tab Context Save = */
const previousTabUrls: string[] = [];

const syncData = async () => {
    await loadAll();
    const config = getConfig();
    await updateDynamicRules(config);
}

const updateDynamicRules = async (config: ConfigInterface) => {
    if (isNamuLiveBlocked(config)) {
        await reregisterDynamicRules(namuLiveBlockers);
    } else {
        await unregisterDynamicRules(namuLiveBlockers);
    }

    if (config?.adblock?.namuwiki) {
        await reregisterDynamicRules(adBlockers);
    } else {
        await unregisterDynamicRules(adBlockers);
    }
};

/* = On Install = */
browser.runtime.onInstalled.addListener(syncData);

/* = config update listener = */
browser.storage.onChanged.addListener(syncData);

/* = NamuWiki Block Logic = */
browser.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    const config = getConfig() ?? await loadConfig();
    let rules = getActiveRulesFromConfig(config);
    if (!rules) {
        await loadBlockRules();
        rules = getActiveRulesFromConfig(config) ?? [];
    }

    const url = info.url || tab.url;

    // Save previous URL
    const previousTabUrl = previousTabUrls[tabId];
    if (url && info.status === 'complete') previousTabUrls[tabId] = url;


    if (url) {
        // run search filter
        if (config.searchFilter) {
            try {
                if (tab.id) {
                    await browser.scripting.executeScript({
                        target: {tabId: tab.id},
                        func: runSearchFilterRoutine,
                        args: [rules],
                    })    
                }
            } catch (e) {
                console.error('Oops. The Big Famous Constant E: ', e);
            }
        }

        const matchingRule = rules.find(
            rule => rule.isInSite(url)
        );

        if (matchingRule) {
            console.log('rule matched:', matchingRule);
            const query = matchingRule.getQuery(url);
            console.log('query:', query);

            if (!info.url) {
                console.log('info', info);
                if (info.status !== 'complete') {
                    console.log('Prevent Triggered Twice');
                    return;
                }
            }

            if (query) {
                // debounce: if the previous url is same,
                // do not trigger the ban.
                if (previousTabUrl) {
                    const prevQuery = matchingRule.getQuery(previousTabUrl);
                    if (prevQuery === query) {
                        console.log('Debounced');
                        return;
                    }
                }

                // Skip ban if query is intelliBan
                if (checkIfIntelliBanPass(query)) {
                    return;
                }

                await browser.tabs.update(tabId, {
                    url: browser.runtime.getURL(`ui/banned/index.html?banned_url=${url}&site_name=${matchingRule.name}`),
                });

                if (matchingRule.isArticleView(url)) {
                    const targetUrls = handleRedirects(url);
                    if (targetUrls.length > 0) {
                        const targetUrl = targetUrls[0];
                        await browser.tabs.create({
                            url: targetUrl,
                        });
                    }
                }
            } 

        }

        
        previousTabUrls[tabId] = url;
    }
});
