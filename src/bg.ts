let configCache: ConfigInterface;
let rulesCache: PageBlockRule[];
let redirectionRulesCache: JSONRedirectedSites[];

/* = Tab Context Save = */
const previousTabUrls: string[] = [];

/* = Adblock Namuwiki = */
let adBlockNamuWiki = true;

/* = URL Regex = */
const urlRegex = '^http(s?):\\/\\/';

/* = config update listener = */
browser.storage.onChanged.addListener(async () => {
    configCache = await loadConfig();
    rulesCache = await loadRules();
    redirectionRulesCache = await loadRedirectionRules();
});

/* = Load Config Logic = */
async function loadConfig(): Promise<ConfigInterface> {
    let thisConfig: ConfigInterface;
    do {
        thisConfig = await browser.storage.sync.get<ConfigInterface>(null);
        if (Object.keys(thisConfig).length === 0) {
            await browser.storage.sync.set({
                blocked: {
                    site: {},
                    group: {},
                },
                redirected: {},
                adblock: {
                    namuwiki: false,
                },
                proxy: {
                    dbpia: "",
                },
                searchFilter: false,
                intelliBan: {
                    enabled: false,
                    url: "",
                    rules: [],
                },
                bannedPage: {
                    message: "",
                    retry: false,
                },
            } as ConfigInterface);
        }
        configCache = thisConfig;
    } while (Object.keys(thisConfig).length === 0);

    return thisConfig;
}

/* = loading rules from file = */
async function loadRules() {
    if (rulesCache === undefined) {
        const rules: PageBlockRule[] = [];

        const tmpOnlineRules = (await loadConfig()).blocked.onlineRules;
        const onlineRules = tmpOnlineRules === undefined ? [] : tmpOnlineRules;

        const data = await fetch("/filter/blockedSites.json");
        const offlineRules: JSONBlockedSites[] = await data.json();
        for (const rule of offlineRules) {
            const baseURL = rule.baseURL;
            const id = rule.id;
            
            const duplicate = onlineRules.filter(a => a.id === id || a.baseURL === baseURL).length > 0;
            
            if (duplicate) {
                offlineRules.splice(offlineRules.indexOf(rule), 1);
            }
        }

        const tmpRules = onlineRules.concat(offlineRules);
    
        for (const dap of tmpRules) {
            rules.push({
                id: dap.id,
                group: dap.group,
                name: dap.name,
                baseURL: dap.baseURL,
                searchView: dap.searchView !== undefined ?
                    new RegExp(
                        dap.searchView.regex,
                        dap.searchView.flag
                    ) : undefined,
                articleView: dap.articleView !== undefined ?
                new RegExp(
                    dap.articleView.regex,
                    dap.articleView.flag
                ) : undefined,
                redirect: dap.redirect,
            });
        }

        rulesCache = rules;
    }

    return rulesCache;
}

async function loadRedirectionRules() {
    if (redirectionRulesCache === undefined) {
        const data = await fetch("/filter/redirectedSites.json");
        const rules: JSONRedirectedSites[] = await data.json();
    
        redirectionRulesCache = rules;
    }

    return redirectionRulesCache;
}

/* = Get Rules = */
function getRules(config: ConfigInterface) {
    const rules: PageBlockRule[] = [];

    if (config.blocked === undefined) { return []; } 

    if (config.blocked.group !== undefined) {
        for (const blockedId in config.blocked.group) {
            if (config.blocked.group[blockedId] !== undefined) {
                if (config.blocked.group[blockedId]) {
                    const daRules = rulesCache.filter(a => a.group.includes(blockedId));

                    for (const daRule of daRules) {
                        if (rules.filter(a => a.id === daRule.id).length === 0) {
                            if (daRule !== undefined) {
                                rules.push(daRule);
                            }
                        }
                    }
                }
            }
        }
    }

    if (config.blocked.site !== undefined) {
        for (const blockedId in config.blocked.site) {
            if (config.blocked.site[blockedId] !== undefined) {
                if (config.blocked.site[blockedId]) {
                    const rule = rulesCache.filter(a => a.group.includes(blockedId))[0];
    
                    if (rules.filter(a => a.id === rule.id).length === 0) {
                        if (rule !== undefined) {
                            rules.push(rule);
                        }
                    }
                }
            }
        }
    }

    return rules;
}

/* = NamuWiki Block Logic = */
browser.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (configCache === undefined) configCache = await loadConfig();
    if (rulesCache === undefined) rulesCache = await loadRules();

    const url = info.url || tab.url;
    const previousTabUrl = previousTabUrls[tabId];
    const config = configCache;

    const blockRules = await getRules(config);

    if (config.searchFilter) {
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
        const baseURLRegex = createBaseURLRegexWithRule(rule);
        
        if (baseURLRegex.test(url)) {
            console.log('NAMU WIKI DETECTED!!');
            console.log('config', config);
            console.log('tab', tab);
            console.log('rule', rule);
            console.log('url', url);

            let parsed;

            const parser = createDocumentRegexWithRule(rule);
            parsed = parser.exec(url);

            parser.lastIndex = 0;

            if (!rule.articleView && !rule.searchView) {
                parsed = true;
            } else {
                console.log("parsed", parsed);
                if (parsed !== null) {
                    console.log("parsed-decodeURIComponent-searchQuery", decodeURIComponent(parsed[3]));
                }
            }
            
            let searchQuery;

            if (parsed) {
                if (!info.url) {
                    console.log('info', info);
                    if (info.status !== 'complete') {
                        console.log('Prevent Triggered Twice');
                        return;
                    }
                }

                let isArticle = false;

                // const isThisSearch = (parsed[2].toLowerCase() === rule.searchView);

                // The Code is no longer functioning correctly: Abandon this.
                // const searchQuery = /((?!#\?)+)[#?]/.exec(decodeURIComponent(parsed[3]))[1];

                if (rule.redirect && parsed !== true) {
                    isArticle = unescapeRegexString(getRegexString(rule.articleView)) === parsed[2];
                    console.log("isArticle", isArticle, unescapeRegexString(getRegexString(rule.articleView)), parsed[2]);

                    const uriAnchorParser = /[^?#]*/
                    const searchParsed = uriAnchorParser.exec(decodeURIComponent(parsed[3]));                
                    searchQuery = searchParsed[0];
                    const searchURIExtra = searchParsed[0];
                   
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
                    if (config.intelliBan !== undefined) {
                        if (config.intelliBan.enabled) {
                            if (config.intelliBan.rules !== undefined) {
                                for (const rule of config.intelliBan.rules) {
                                    if (new RegExp(rule.regex, rule.flag).test(searchQuery)) {
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    
                }

                console.log("BAN HAMMER HAS SPOKEN!");
                await browser.tabs.update(tabId, {
                    url: browser.extension.getURL(`interface/banned/index.html?banned_url=${url}`),
                });
                
                if (isArticle) {
                    await runRedirect(config, searchQuery);
                }
            }
            console.log('End of Session\n');
        }
    }

    previousTabUrls[tabId] = url;
});

function getRegexString(regex: RegExp|string) {
    let string = "";

    if (regex instanceof RegExp) {
        const tempString = regex.toString();
        const flagLength = regex.flags.length;

        string = tempString.slice(1, tempString.length - 1 - flagLength);
    } else if (typeof regex === "string") {
        string = regex;
    }

    return string;
}

function unescapeRegexString(string: string) {
    return string.replace(/\\([\/\.\*\+\?\|\(\)\[\]\{\}\\\$\^\-])/g, '$1');
}

function createBaseURLRegexWithRule(rule: PageBlockRule): RegExp {
    return new RegExp(urlRegex + rule.baseURL, 'ig')
}

function createDocumentRegexWithRule(rule: PageBlockRule): RegExp {
    const articleView = getRegexString(rule.articleView);
    const searchView = getRegexString(rule.searchView);

    const pattern = urlRegex + rule.baseURL + '(' + articleView + '|' + searchView + ')' + '(.+)$';
    console.log("Generated Pattern:", pattern);

    return new RegExp(pattern, 'ig')
}

async function runRedirect(config: ConfigInterface, searchQuery: string) {
    const redirectionConfig = config.redirected;
    const redirectionRules = await loadRedirectionRules();

    if (redirectionConfig !== undefined) {
        for (const id in redirectionConfig) {
            if (redirectionConfig[id]) {
                const result = redirectionRules.filter(a => a.id === id);
                if (result.length > 0) {
                    const target = result[0];
                    let query = searchQuery;
                    if (target.queryProcessing !== undefined) {
                        for (const replaceReq of target.queryProcessing.replace) {
                            const fromRegex = new RegExp(replaceReq.from, "g");
                            const to = replaceReq.to;
                            query.replace(fromRegex, to);
                        }
                    }
                    const queryReplaceRegex = new RegExp("{{query}}", "g");
                    const langReplaceRegex = new RegExp("{{lang}}", "g");

                    const langCode = /(가-힣)+/.test(searchQuery) ? "ko" : /^[A-z0-9 ]$/.test(searchQuery) ? "en" : /^((\w){2})/.exec(navigator.language)[1];
                    const finalURL = target.redirectLocation.replace(queryReplaceRegex, query).replace(langReplaceRegex, langCode);
    
                    await browser.tabs.create({
                        url: finalURL,
                    });
                }
            }
        }
    }
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
        regex: /^http(s|):\/\/(www.|search.|)duckduckgo.com\/\?/ig,
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
        if (configCache.adblock.namuwiki) {
            // I don't care the mirrors, they are copyright infringers, too.
            const rules = getRules({
                blocked: {
                    group: {
                        namuwiki: true,
                        namuwikiMirror: true,
                        namulive: true,
                        namunews: true,
                    },
                    site: {},
                    url: "https://raw.githubusercontent.com/Alex4386/turnoff-namuwiki/master/filter/blockedSites.json",
                    onlineRules: [],
                },
                redirected: {},
                adblock: {
                    namuwiki: false,
                },
                proxy: {
                    dbpia: "",
                },
                searchFilter: false,
                intelliBan: {
                    enabled: false,
                    url: "",
                    rules: [],
                },
                bannedPage: {
                    message: "",
                    retry: false,
                },
            });

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
                if (createBaseURLRegexWithRule(rule).test(whereareyoufrom)) {
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
            "https://arca.live/api/ads*",
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
 * 
 * + 나무뉴스 추가
 */
browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (configCache.blocked.group['namulive'] || configCache.blocked.site['namulive']) {
            console.log("canceled!", "bwah bwah bwah!", details.url);
            return {
                cancel: true
            };
        }
    },
    {
        urls: [
            "https://search.namu.wiki/api/ranking",
            "https://arca.live/*",
            "https://namu.news/*",
            "https://namu.news/api/articles/cached",
        ]
    },
    [ "blocking" ]
);

