/* = Load Config Logic = */
async function loadConfig(): Promise<ConfigInterface> {
    return new Promise<ConfigInterface> (
        async (resolve, reject) => {
            let config: ConfigInterface;
            do {
                config = await browser.storage.sync.get<ConfigInterface>(null);
                if (Object.keys(config).length === 0) {
                    await browser.storage.sync.set({
                        namuwikiBlock: true,
                        namuLiveBlock: true,
                        namuMirrorBlock: true,
                        openRiss: true,
                        openDbpia: true,
                        openArxiv: false,
                        openGoogleScholar: false,
                        adBlockNamuWiki: true,
                        filterSearch: true,
                        proxyDbpia: undefined,
                        intelliBanUrl: "https://raw.githubusercontent.com/Alex4386/turnoff-namuwiki/master/intelliBan/rules.json",
                        intelliBanRules: [],
                    });
                }
            } while (Object.keys(config).length === 0);
            resolve(config);
        }
    );
}

/* = Tab Context Save = */
const previousTabUrls: string[] = [];


/* = Adblock Namuwiki = */
let adBlockNamuWiki = true;

/* = NamuWiki Block Logic = */
browser.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    const url = info.url || tab.url;
    const previousTabUrl = previousTabUrls[tabId];
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
            parser.lastIndex = 0;

            console.log("parsed", parsed);
            console.log("parsed-decodeURIComponent-searchQuery", decodeURIComponent(parsed[3]));
            if (parsed) {
                if (!info.url) {
                    console.log('info', info);
                    if (info.status !== 'complete') {
                        console.log('Prevent Triggered Twice');
                        return;
                    }
                }

                // const isThisSearch = (parsed[2].toLowerCase() === rule.searchView);

                // The Code is no longer functioning correctly: Abandon this.
                // const searchQuery = /((?!#\?)+)[#?]/.exec(decodeURIComponent(parsed[3]))[1];

                const uriAnchorParser = /[^?#]*/
                const searchParsed = uriAnchorParser.exec(decodeURIComponent(parsed[3]));                
                const searchQuery = searchParsed[0];
                const searchURIExtra = searchParsed[0];
                
                //const langCode = /^((\w){2})/.exec(navigator.language)[1];
                const langCode = /(가-힣)+/.test(searchQuery) ? "ko" : /^[A-z0-9 ]$/.test(searchQuery) ? "en" : /^((\w){2})/.exec(navigator.language)[1];

                uriAnchorParser.lastIndex = 0;

                if (previousTabUrl) {
                    const prevSearchURIParsed = parser.exec(previousTabUrl);
                    if (prevSearchURIParsed) {
                        const prevSearchParsed = uriAnchorParser.exec(decodeURIComponent(prevSearchURIParsed[3]));
                        const prevSearchQuery = prevSearchParsed[0];
                        const prevSearchURIExtra = prevSearchParsed[1];
                        if (searchQuery === prevSearchQuery) {
                            console.log("Moved to same page", searchQuery);
                            return;
                        }
                    }
                }

                // check for intelliBan
                if (config.intelliBanEnabled) {
                    for (const rule of config.intelliBanRules) {
                        if (new RegExp(rule.regex, rule.flag).test(searchQuery)) {
                            return;
                        }
                    }
                }

                if (searchQuery && !/^(나무위키|파일|분류|틀):.+/.test(searchQuery)) {
                    console.log('searchQuery:', searchQuery);
                    const redirectQuery = searchQuery.split('/')[0];

                    if (config.openRiss) {
                        await browser.tabs.create({
                            url: `http://www.riss.kr/search/Search.do?detailSearch=false&searchGubun=true&oldQuery=&query=${redirectQuery}`,
                        });
                    }
                    if (config.openDbpia) {
                        await browser.tabs.create({
                            url: `${config.proxyDbpia || 'http://www.dbpia.co.kr'}/search/topSearch?startCount=0&collection=ALL&startDate=&endDate=&filter=&prefix=&range=A&searchField=ALL&sort=RANK&reQuery=&realQuery=&exquery=&query=${redirectQuery}&collectionQuery=&srchOption=*`,
                        });
                    }
                    if (config.openArxiv) {
                        if (langCode === "en") {
                            await browser.tabs.create({
                                url: `https://arxiv.org/search/?query=${redirectQuery}&searchtype=all&source=header`,
                            });
                        }
                    }
                    if (config.openGoogleScholar && langCode) {
                        await browser.tabs.create({
                            url: `https://scholar.google.co.kr/scholar?hl=${langCode}&as_sdt=0%2C5&q=${redirectQuery}&btnG=`,
                        });
                    }

                    const escapedRedirectQuery = redirectQuery.replace(/ /g, "_");
                    if (config.openWikipedia && langCode) {
                        await browser.tabs.create({
                            url: `https://ko.wikipedia.org/wiki/${escapedRedirectQuery}`,
                        });
                    }
                }

                if (config.namuwikiBlock) {
                    await browser.tabs.update(tabId, {
                        url: browser.extension.getURL(`interface/banned/index.html?banned_url=${url}`),
                    });
                }
            }
            console.log('End of Session\n');
        }
    }

    previousTabUrls[tabId] = url;
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

const namuLiveBlockRule: PageBlockRule[] = [
    {
        baseURL: 'namu.live',
        articleView: /[A-z0-9]+/,
        searchView: /[A-z0-9]+/
    }
]

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
    {
        name: 'Naver',
        regex: /^http(s|):\/\/(www.|search.|)naver.com\//ig,
        scriptLocation: '/lib/filter/naver.js',
    },
    {
        name: 'Daum',
        regex: /^http(s|):\/\/(www.|search.|)daum.net\/search\?/ig,
        scriptLocation: '/lib/filter/daum.js',
    },
];

function triggerFilter(url: string) {
    for (const searchEngine of searchEngineRules) {
        if (searchEngine.regex.test(url)) {
            return searchEngine.scriptLocation;
        }
    }
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
            "https://adservice.google.com/*",
            "https://namu.live/static/ad/*",
            "https://searchad-phinf.pstatic.net/*",
            "https://ssl.pstatic.net/adimg3.search/*",
            "https://www.google.com/adsense/search/*",
            "https://www.google.com/afs/ads*"
        ]
    },
    [ "blocking" ]
)

/**
 * This is namulive detection: will affect at 0.7.0
 *
 * requested by Firefox user 15228336:
 * 나무라이브도 꺼주셨으면 좋을 것 같아요.
 */
browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (config.namuLiveBlock) {
            console.log("canceled!", "bwah bwah bwah!");
            return {
                cancel: true
            };
        }
    },
    {
        urls: [
            "https://search.namu.wiki/api/ranking",
            "https://namu.live/*"
        ]
    }
);

