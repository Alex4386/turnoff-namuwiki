import browser, { Tabs } from 'webextension-polyfill';
import {getConfig, loadConfig} from './common/config';
import {loadAll} from './common/initializer';
import {getAdBlockers, reregisterDynamicRules, unregisterDynamicRules} from './common/adblocks/namuwiki';
import {checkIfIntelliBanPass} from './common/intelliBan';
import {isNamuNewsBlocked, isNamuWikiAdblock, isNamuWikiRealLicense} from './common/utils';
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

const blockAction = async (tabId: number, info: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
    console.log('blockAction Triggered!!');

    const config = getConfig() ?? await loadConfig();
    let rules = getActiveRulesFromConfig(config);
    if (!rules) {
        console.log('No rules found, loading from block rules');
        await loadBlockRules();
        rules = getActiveRulesFromConfig(config) ?? [];
    }

    const url = info.url || tab.url;
    console.log('config', config);

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
                console.log('try blocking namunews');
                await browser.scripting.executeScript({
                    target: {tabId: tabId},
                    func: () => {
                        const args = 'rXnQXN9u IVXSD7Cq';

                        // TODO: Add dynamic classname update logic
                        const namuNews = document.getElementsByClassName(args)[1];
                        if (namuNews) {
                            namuNews.remove();
                        }
                    },
                })
            }

            if (isNamuWikiAdblock(config)) {
                console.log('try blocking namuwiki ad');
                await browser.scripting.executeScript({
                    target: {tabId: tabId},
                    func: () => {
                        try {
                            // kill powerlink
                            const powerLinkTitle = Array.from(document.getElementsByTagName('img'))
                                .find(n => n.src.includes("//i.namu.wiki/i/RPxl6WtDzEA4uNPvRkEjMCSx1K_0vqTWKMEuziAPm5A.png"))

                            let powerLink = powerLinkTitle as HTMLElement;
                            if (powerLink) {
                                for (let i = 0; i < 4; i++) {
                                    if (!powerLink) break;
                                    powerLink = powerLink?.parentElement as HTMLElement;
                                }
                                if (powerLink) {
                                    powerLink.remove();
                                }
                            }
                        } finally {}
                    }
                })
            }

            console.log('tlqkf')
            if (isNamuWikiRealLicense(config)) {
                await browser.scripting.executeScript({
                    target: {tabId: tabId},
                    func: () => {
                        try {
                            // update the license as "REAL" License
                            const license = Array.from(document.getElementsByTagName('img')).find(n => n.src.endsWith('/img/cc-by-nc-sa-2.0-88x31.png'))?.parentElement
                            if (license) {
                                license.innerHTML = `<p data-v-c73e55e2="">
                                    <img alt="크리에이티브 커먼즈 라이선스" style="border-width: 0;" src="/img/cc-by-nc-sa-2.0-88x31.png" width="88" height="31"><br>
                                    이 저작물은 <a rel="license" href="//creativecommons.org/licenses/by-nc-sa/2.0/kr/" target="_blank">CC BY-NC-SA 2.0 KR</a>외에도 umanle S.R.L. 에 제공된 독점적 권리에 따라 인공지능 학습,<br> 2차 데이터 가공/재생산 (예. 사전허가 없는 영문 번역 등)에 따라 임의로 사용할 수 있습니다. (단, 라이선스가 명시된 일부 문서 및 삽화 제외)<br>
                                    기여하신 부분의 저작권은 각 기여자에게 있으나, umanle S.R.L. 또한 문서에 대한 저작권을 가지며,<br>
                                    임의로 재라이센싱 할 수 있는 독점 권리를 가집니다.<br><br>
                                    나무위키는 백과사전이 아니며 검증되지 않았거나, 편향적이거나, 잘못된 서술이 있을 수 있습니다.<br>
                                    나무위키는 위키위키입니다. 여러분이 직접 문서를 고칠 수 있으며, 다른 사람의 의견을 원할 경우 직접 토론을 발제할 수 있습니다.</p>`
                            }
                        } finally {}

                        try {
                            // get the form
                            const form = document.getElementsByTagName('form')[1];
                            if (form) {
                                const licenseCheck = form.getElementsByTagName('label')[0];
                                if (licenseCheck) {
                                    const span = licenseCheck.getElementsByTagName('span')[0];
                                    if (span.innerText.includes('CC-BY-NC-SA')) {
                                        span.innerText = `문서 편집을 <strong>저장</strong>하면 당신은 기여한 내용을 <strong>CC-BY-NC-SA 2.0</strong>으로 배포하며, 동시에 <strong>umanle S.R.L.에 수정사항에 대한 독점적 권리 및 승인없는 2차 창작 및 임의 수익창출을 허용</strong>하는 것에 동의함을 의미합니다. <strong>이 동의는 철회할 수 없습니다.</strong>`;
                                    }
                                }
                            }
                        } finally {}
                    }
                });
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
        console.log(matchingRule);

        if (matchingRule) {
            console.log('rule matched:', matchingRule);
            const query = matchingRule.getQuery(url);
            console.log('query:', query);

            if (!info.url) {
                console.log('info', info);
                // if (info.status !== 'complete') {
                //     console.log('Prevent Triggered Twice');
                //     return;
                // }
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
}

/* = NamuWiki Block Logic = */
browser.tabs.onUpdated.addListener(blockAction);
browser.tabs.onCreated.addListener(async (tab) => {
    blockAction(tab.id!, {status: 'complete'}, tab);
});
