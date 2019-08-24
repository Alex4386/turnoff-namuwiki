/* = Load Config Logic = */
async function loadConfig(): Promise<ConfigInterface> {
    return new Promise<ConfigInterface> (
        async (resolve, reject) => {
            let config: ConfigInterface;
            do {
                config = await browser.storage.sync.get(null) as unknown as ConfigInterface;
                if (Object.keys(config).length === 0) {
                    await browser.storage.sync.set({
                        namuwikiBlock: true,
                        namuMirrorBlock: true,
                        openRiss: true,
                        openDbpia: true,
                        openArxiv: false,
                        openGoogleScholar: false,
                        adBlockNamuWiki: true,
                        filterSearch: true,
                        proxyDbpia: undefined,
                    });
                }
            } while (Object.keys(config).length === 0);
            resolve(config);
        }
    );
}

let adBlockNamuWiki = true;

/* = NamuWiki Block Logic = */
browser.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    const url = info.url || tab.url;
    let config: ConfigInterface = await loadConfig();

    let blockRules = getRules(config.namuMirrorBlock);

    adBlockNamuWiki = config.adBlockNamuWiki;

    if (config.filterSearch) {
        let result = triggerFilter(url);
        console.log(result);
        if (result) {
            try {
                await browser.tabs.executeScript(tab.id, {
                    file: result,
                });
                console.log('Search Filter Loaded');
            } catch (e) {
                console.error('Oops. The Big Famous Constant E: ', e);
            }
        }
    }

    for (const rule of blockRules) {
        const baseBlockRegex = createPageRegexWithRule(rule);
        if (baseBlockRegex.test(url)) {
            console.log('NAMU WIKI DETECTED!!');
            console.log('config', config);
            console.log('tab', tab);
            console.log('rule', rule);

            const parser = createDocumentRegexWithRule(rule);
            const parsed = parser.exec(url);
            if (parsed) {
                if (!info.url) {
                    console.log('info', info);
                    if (info.status !== 'complete') {
                        console.log('Prevent Triggered Twice');
                        return;
                    }
                }

                // const isThisSearch = (parsed[2].toLowerCase() === rule.searchView);
                const searchQuery = /([^#?]+)[#?]/.exec(decodeURIComponent(parsed[3]))[1];
                const langCode = /(\w{2})-/.exec(navigator.language)[1];

                if (searchQuery && !/^나무위키:.+/.test(searchQuery)) {
                    console.log('searchQuery:', searchQuery);
                    if (config.openRiss && !/^[a-z ]+$/.test(searchQuery)) {
                        await browser.tabs.create({
                            url: `http://www.riss.kr/search/Search.do?detailSearch=false&searchGubun=true&oldQuery=&query=${searchQuery}`,
                        });
                    }
                    if (config.openDbpia) {
                        await browser.tabs.create({
                            url: `${config.proxyDbpia || 'http://www.dbpia.co.kr'}/search/topSearch?startCount=0&collection=ALL&startDate=&endDate=&filter=&prefix=&range=A&searchField=ALL&sort=RANK&reQuery=&realQuery=&exquery=&query=${searchQuery}&collectionQuery=&srchOption=*`,
                        });
                    }
                    if (config.openArxiv) {
                        if (/^[a-z]+$/i.test(searchQuery)) {
                            await browser.tabs.create({
                                url: `https://arxiv.org/search/?query=${searchQuery}&searchtype=all&source=header`,
                            });
                        }
                    }
                    if (config.openGoogleScholar && langCode) {
                        await browser.tabs.create({
                            url: `https://scholar.google.co.kr/scholar?hl=${langCode}&as_sdt=0%2C5&q=${searchQuery}&btnG=`,
                        });
                    }
                }

                if (config.namuwikiBlock) {
                    await browser.tabs.update(tabId, {
                        url: browser.extension.getURL('interface/banned/index.html'),
                    });
                }
            }
            console.log('End of Session\n');
        }
    }
});

/* = RULES = */
const namuWikiBlockRule: PageBlockRule[] = [{
    baseURL: 'namu.wiki',
    articleView: '/w/',
    searchView: '/go/',
}];

const mirrorLists: PageBlockRule[] = [
    // namuwiki mirror rulesets
    {
        baseURL: 'namu.mirror.wiki',
        articleView: /w/,
        searchView: /go/,
    },
    {
        baseURL: 'namu.moe',
        articleView: /w/,
        searchView: /go/,
    },
    {
        baseURL: 'mir.pe',
        articleView: /wiki/,
        searchView: /search/,
    },
];

const urlRegex = '^http(s?):\\/\\/';

function getRules(withMirror: boolean):PageBlockRule[] {
    let blockRules = namuWikiBlockRule;
    if (withMirror) {
        blockRules = blockRules.concat(mirrorLists);
    }
    return blockRules;
}

function createPageRegexWithRule(rule: PageBlockRule): RegExp {
    return new RegExp(urlRegex + rule.baseURL, "ig");
}

function createDocumentRegexWithRule(rule: PageBlockRule): RegExp {
    return new RegExp(urlRegex + rule.baseURL + '(' + rule.articleView + '|' + rule.searchView + ')' + '(.+)$', 'ig')
}

/* = SearchEngine = */
const searchEngineRules: SearchEngineFilterRules[] = [
    {
        name: 'Google',
        regex: /^http(s|):\/\/(www.|cse.|)google.com\/search\?/ig,
        scriptLocation: '/lib/filter/google.js',
    },
    {
        name: 'DuckDuckGo',
        regex: /^http(s|):\/\/(www.|search.|)duckduckgo.com\/\?q/ig,
        scriptLocation: '/lib/filter/duckduckgo.js',
    },
];

function triggerFilter(url: string) {
    for (const searchEngine of searchEngineRules) {
        if (searchEngine.regex.test(url)) {
            return searchEngine.scriptLocation;
        }
    }
    return null;
}

/* = Adblock = */

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

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (adBlockNamuWiki) {
            // I don't care the mirrors, they are copyright infringers, too.
            const rules = getRules(true);

            // Bug in polyfill :(
            let whereareyoufrom = (details as any).initiator || details.originUrl;

            if (details.tabId > 0) {
                browser.tabs.get(details.tabId).then((tab) => {
                    whereareyoufrom = tab.url;
                }).catch(() => {
                    console.error("failed!");
                })
            }

            for (const rule of rules) {
                if (createPageRegexWithRule(rule).test(whereareyoufrom)) {
                    console.log("canceled!", "bwahbwahbwah!");
                    return {
                        cancel: true
                    };
                }
            }
            console.log("from:", whereareyoufrom, details.url);
        }
        
        return {cancel: false};
    },
    {
        urls: [
            "https://*.googlesyndication.com/*",
            "https://*.doubleclick.net/*",
            "https://adservice.google.com/*"
        ]
    },
    [ "blocking" ]
)
