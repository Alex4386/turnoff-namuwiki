const urlRegex = "^http(s?):\\/\\/";

interface ConfigInterface {
    namuwikiBlock: boolean;
    namuMirrorBlock: boolean;
    openRiss: boolean;
    openDbpia: boolean;
    proxyDbpia: string;
}

interface PageBlockRule {
    baseURL: string;
    articleView: RegExp | string;
    searchView: RegExp | string;
}

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
                openArxiv: true,
                openGoogleScholar: true,
                proxyDbpia: undefined,
            });
        }
    } while (Object.keys(config).length === 0);
    let blockRules = namuWikiBlockRule;
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
                const searchQuery = decodeURIComponent(parsed[3]).split("?")[0];
                const langCode = navigator.language.split("-")[0];

                console.log("searchQuery:", searchQuery);
                if (!/^나무위키:.+/.test(searchQuery)) {
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
                        await browser.tabs.create({
                            url: `https://arxiv.org/search/?query=${searchQuery}&searchtype=all&source=header`
                        })
                    }
                    if (config.openGoogleScholar) {
                        await browser.tabs.create({
                            url: `https://scholar.google.co.kr/scholar?hl=${langCode}&as_sdt=0%2C5&q=${searchQuery}&btnG=`
                        })
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
