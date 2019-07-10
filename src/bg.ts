/* 아 코드 뭐같아서 빨리 고쳐야 하는데.... */
const urlRegex = "^http(s|):\\/\\/";

interface PageBlockRule {
    baseURL: string;
    articleView: string;
    searchView: string;
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
        articleView: "/w/",
        searchView: "/go/"
    },
    {
        baseURL: "namu.moe",
        articleView: "/w/",
        searchView: "/go/",
    },
    {
        baseURL: "mir.pe",
        articleView: "/wiki/",
        searchView: "/search/"
    }
];

const namuwikiInternalPageRule = /^나무위키:(.+)/;

// Stack Overflow: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/*
chrome.runtime.onInstalled.addListener(function() {
    browser.declarativeContent.onPageChanged.removeRules(undefined, function() {
        browser.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new browser.declarativeContent.PageStateMatcher({
                    
                })
            ],
            actions: [new browser.declarativeContent.ShowPageAction()]
        }]);
    });
});
*/

browser.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    const url = info.url || tab.url;
    const config = await browser.storage.sync.get(null);
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

            const parser = new RegExp(urlRegex + rule.baseURL + "(" + escapeRegExp(rule.articleView) + "|" + escapeRegExp(rule.searchView) + ")" + "(.+)$", "ig");
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

                console.log("searchQuery:", searchQuery);
                if (!namuwikiInternalPageRule.test(searchQuery)) {
                    if (config.openRiss) {
                        /* RISS Validation Check */
                        if (!/^[a-z]+$/i.test(searchQuery)) {
                            await browser.tabs.create({
                                url: `http://www.riss.kr/search/Search.do?detailSearch=false&searchGubun=true&oldQuery=&query=${searchQuery}`,
                            });
                        }
                    }
                    if (config.openDbpia) {
                        if (config.proxyDbpia !== "") {
                            await browser.tabs.create({
                                url: `${config.proxyDbpia}/search/topSearch?startCount=0&collection=ALL&startDate=&endDate=&filter=&prefix=&range=A&searchField=ALL&sort=RANK&reQuery=&realQuery=&exquery=&query=${searchQuery}&collectionQuery=&srchOption=*`
                            });
                        } else {
                            await browser.tabs.create({
                                url: `http://www.dbpia.co.kr/search/topSearch?startCount=0&collection=ALL&startDate=&endDate=&filter=&prefix=&range=A&searchField=ALL&sort=RANK&reQuery=&realQuery=&exquery=&query=${searchQuery}&collectionQuery=&srchOption=*`
                            });
                        }
                    }
                }

                if (config.namuwikiBlock) {
                    await browser.tabs.update(tabId, {
                        url: browser.extension.getURL("interface/banned/index.html")
                    });
                    await browser.tabs.get(tabId);
                }
            }
            console.log("End of Session\n");
        }
    }
});
