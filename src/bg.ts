browser.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    const url = info.url || tab.url;
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
                filterSearch: true,
                proxyDbpia: undefined,
            });
        }
    } while (Object.keys(config).length === 0);

    let blockRules = namuWikiBlockRule;

    if (config.filterSearch) {
        let result = triggerFilter(url);
        console.log(result);
        if (result !== null) {
            browser.tabs.executeScript(
                tab.id,
                {
                    file: result
                }
            ).then(
                () => {
                    console.log("YEP");
                }, (e) => {
                    console.log("Oops. The Big Famous Constant E:", e);
                }
            )
        }
    }

    if (config.namuMirrorBlock) {
        blockRules = blockRules.concat(mirrorLists);
    }
    for (const rule of blockRules) {
        const baseBlockRegex = new RegExp(urlRegex + rule.baseURL, "ig");
        if (baseBlockRegex.test(url)) {
            console.log("NAMU WIKI DETECTED!!");
            console.log("config", config);
            console.log("tab", tab);
            console.log("rule", rule);

            const parser = new RegExp(urlRegex + rule.baseURL + "(" + rule.articleView + "|" + rule.searchView + ")" + "(.+)$", "ig");
            const parsed = parser.exec(url);
            if (parsed !== null) {
                if (info.url === undefined) {
                    console.log("info", info);
                    if (info.status !== "complete") {
                        console.log("Prevent Triggered Twice");
                        console.log("End of Session\n");
                        return;
                    }
                }

                // const isThisSearch = (parsed[2].toLowerCase() === rule.searchView);
                const searchQuery = /([^#?]+)[#?]/.exec(decodeURIComponent(parsed[3]))[1];
                const langCode = /(\w{2})-/.exec(navigator.language)[1];

                if (searchQuery !== null && !/^나무위키:.+/.test(searchQuery)) {
                    console.log("searchQuery:", searchQuery);
                    if (config.openRiss && !/^[a-z ]+$/.test(searchQuery)) {
                        await browser.tabs.create({
                            url: `http://www.riss.kr/search/Search.do?detailSearch=false&searchGubun=true&oldQuery=&query=${searchQuery}`,
                        });
                    }
                    if (config.openDbpia) {
                        await browser.tabs.create({
                            url: `${config.proxyDbpia || 'http://www.dbpia.co.kr'}/search/topSearch?startCount=0&collection=ALL&startDate=&endDate=&filter=&prefix=&range=A&searchField=ALL&sort=RANK&reQuery=&realQuery=&exquery=&query=${searchQuery}&collectionQuery=&srchOption=*`
                        });
                    }
                    if (config.openArxiv) {
                        if (/^[a-z]+$/i.test(searchQuery)) {
                            await browser.tabs.create({
                                url: `https://arxiv.org/search/?query=${searchQuery}&searchtype=all&source=header`
                            });
                        }
                    }
                    if (config.openGoogleScholar && langCode !== null) {
                        await browser.tabs.create({
                            url: `https://scholar.google.co.kr/scholar?hl=${langCode}&as_sdt=0%2C5&q=${searchQuery}&btnG=`
                        });
                    }
                }

                if (config.namuwikiBlock) {
                    await browser.tabs.update(tabId, {
                        url: browser.extension.getURL("interface/banned/index.html")
                    });
                }
            }
            console.log("End of Session\n");
        }
    }
});

/* = RULES = */

const namuWikiBlockRule: PageBlockRule[] = [{
    baseURL: "namu.wiki",
    articleView: "/w/",
    searchView: "/go/",
}];

const mirrorLists: PageBlockRule[] = [
    // namuwiki mirror rulesets
    {
        baseURL: "namu.mirror.wiki",
        articleView: /w/,
        searchView: /go/,
    },
    {
        baseURL: "namu.moe",
        articleView: /w/,
        searchView: /go/,
    },
    {
        baseURL: "mir.pe",
        articleView: /wiki/,
        searchView: /search/,
    }
];

const urlRegex = "^http(s?):\\/\\/";

/* = SearchEngine = */
const searchEngineRules: SearchEngineFilterRules[] = [
    {
        name: "Google",
        regex: /^http(s|):\/\/(www.|cse.|)google.com\/search\?/ig,
        scriptLocation: "/lib/filter/google.js"
    },
    {
        name: "DuckDuckGo",
        regex: /^http(s|):\/\/(www.|search.|)duckduckgo.com\/\?q/ig,
        scriptLocation: "/lib/filter/duckduckgo.js"
    }
];

function triggerFilter(url: string) {
    for (const searchEngine of searchEngineRules) {
        if (searchEngine.regex.test(url)) {
            return searchEngine.scriptLocation;
        }
    }
    return null;
}
