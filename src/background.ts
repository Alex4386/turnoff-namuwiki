import browser from 'webextension-polyfill';
import {getConfig, loadConfig} from './common/config';
import {loadAll} from './common/initializer';
import {getAdBlockers, reregisterDynamicRules, unregisterDynamicRules} from './common/adblocks/namuwiki';
import {checkIfIntelliBanPass} from './common/intelliBan';
import {isNamuNewsBlocked, isNamuWikiAdblock} from './common/utils';
import {handleRedirects} from './common/rules/redirect';
import {getActiveRulesFromConfig} from './common/rules/enabled';
import {runSearchFilterRoutine} from './searchFilters/runner';
import {ConfigInterface} from './common/config/interface';
import {loadBlockRules} from './common/rules/block';

/* = Tab Context Save = */
const previousTabUrls: string[] = [];

const syncData = async () => {
    let config: ConfigInterface | undefined = undefined;
    console.log('Syncing Data');

    try {
        config = await loadConfig();
        await loadAll();
    } catch (e) {
        console.error('Failed to load config', e);
        return;
    }

    console.log('Synced config', config);

    try { await loadBlockRules(); } finally {}

    try {
        await updateDynamicRules(config!);
    } catch (e) {
        console.error('Failed to sync dynamic rules', e);
    }
}

const updateDynamicRules = async (config: ConfigInterface) => {
    const dynamicRules=await browser.declarativeNetRequest.getDynamicRules();
    console.log(dynamicRules);

    const adBlockers = getAdBlockers();
    if (config?.adblock?.namuwiki) {
        await reregisterDynamicRules(adBlockers);
    } else {
        console.log('unregistering dynamic rules for adblocking');
        await unregisterDynamicRules(adBlockers);
    }
};

/* = Initial Load = */
(async () => {
    // const config = await loadConfig();
    await loadConfig();
    await loadAll();
    // await updateDynamicRules(config);
})();

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
    if (info.status === 'complete') {
        if (url) previousTabUrls[tabId] = url;
        else delete previousTabUrls[tabId];
    }


    if (url) {
        if (!(url.startsWith('http://') || url.startsWith('https://'))) return;
        // run search filter
        if (url.startsWith('https://namu.wiki')) {
            if (isNamuNewsBlocked(config)) {
                await browser.scripting.executeScript({
                    target: {tabId: tabId},
                    func: () => {
                        const args = 'RD8N-1K+ TNz43EL3';

                        // TODO: Add dynamic classname update logic
                        const namuNews = document.getElementsByClassName(args)[1];
                        if (namuNews) {
                            namuNews.remove();
                        }
                    },
                })
            }

            if (isNamuWikiAdblock(config)) {
                await browser.scripting.executeScript({
                    target: {tabId: tabId},
                    func: () => {
                        try {
                            // kill powerlink
                            const powerLinkTitle = Array.from(document.getElementsByTagName('img'))
                                .find(n => n.src.includes("//i.namu.wiki/i/RPxl6WtDzEA4uNPvRkEjMCSx1K_0vqTWKMEuziAPm5A.png"))

                            let powerLink = powerLinkTitle;
                            if (powerLinkTitle) {
                                for (let i = 0; i < 4; i++) {
                                    powerLink = powerLink.parentElement;
                                }
                                if (powerLink) {
                                    powerLink.remove();
                                }
                            }
                        } finally {}
                    }
                })
            }
        } else if (config.searchFilter) {
            try {
                if (tab.id) {
                    await browser.scripting.executeScript({
                        target: {tabId: tab.id},
                        func: runSearchFilterRoutine,
                        args: [rules],
                    })
                }
            } catch (e) {
                console.error('Script chainloading failed: ', e);
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

            // Skip ban if query is intelliBan
            if (checkIfIntelliBanPass(query)) {
                return;
            }

            await browser.tabs.update(tabId, {
                url: browser.runtime.getURL(`ui/banned/index.html?banned_url=${url}&site_name=${matchingRule.name}`),
            });

            if (query) {
                if (matchingRule.isArticleView(url)) {
                    const targetUrls = await handleRedirects(query);
                    console.log('redirectionTargetUrls', targetUrls);

                    if (targetUrls.length > 0) {
                        const targetUrl = targetUrls[0];
                        await browser.tabs.create({
                            url: targetUrl,
                        });
                    }
                }
            }

        }
    }
});
