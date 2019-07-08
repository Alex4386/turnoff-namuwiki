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
function escapeRegExp(string) {
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

browser.tabs.onUpdated.addListener( (tabId, info, tab) => {
    const url = info.url || tab.url
    browser.storage.sync.get({
        namuwikiBlock: true,
        namuMirrorBlock: true,
        openRiss: true,
        openDbpia: true,
        proxyDbpia: "",
    }).then( (loadConfig) => {
        let blockRules = namuWikiBlockRule;
        if (loadConfig.namuMirrorBlock) {
            blockRules = blockRules.concat(mirrorLists);
        }
        for (const rule of blockRules) {
            const baseBlockRegex = new RegExp(urlRegex+rule.baseURL,"ig");
            if (baseBlockRegex.test(url)) {
                console.log("NAMU WIKI DETECTED!!");
                console.log("config", loadConfig);
                console.log("tab", tab);
                console.log("rule", rule);

                const parser = new RegExp(urlRegex+rule.baseURL+"("+escapeRegExp(rule.articleView)+"|"+escapeRegExp(rule.searchView)+")"+"(.+)$", "ig");
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

                    const isThisSearch = (parsed[2].toLowerCase() === rule.searchView);
                    const searchQuery = decodeURIComponent(parsed[3]);

                    console.log("searchQuery:", searchQuery);
                    if (!namuwikiInternalPageRule.test(searchQuery)) {
                        if (loadConfig.openRiss) {
                            /* RISS Validation Check */
                            if (!/^[A-z]+$/.test(searchQuery)) {
                                browser.tabs.create({
                                    url: "http://www.riss.kr/search/Search.do?detailSearch=false&searchGubun=true&oldQuery=&query="+searchQuery
                                });
                            }
                        }
                        if (loadConfig.openDbpia) {
                            if (loadConfig.proxyDbpia !== "") {
                                browser.tabs.create({
                                    url: loadConfig.proxyDbpia+"/search/topSearch?startCount=0&collection=ALL&startDate=&endDate=&filter=&prefix=&range=A&searchField=ALL&sort=RANK&reQuery=&realQuery=&exquery=&query="+searchQuery+"&collectionQuery=&srchOption=*"
                                });
                            } else {
                                browser.tabs.create({
                                    url: "http://www.dbpia.co.kr/search/topSearch?startCount=0&collection=ALL&startDate=&endDate=&filter=&prefix=&range=A&searchField=ALL&sort=RANK&reQuery=&realQuery=&exquery=&query="+searchQuery+"&collectionQuery=&srchOption=*"
                                });
                            }
                        }
                    }
                    
                    if (loadConfig.namuwikiBlock) {
                        browser.tabs.update(tabId, {
                            url: browser.extension.getURL("interface/banned/index.html")
                        });
                        browser.tabs.get(tabId).then( function(tab) {
                            browser.tabs.highlight({'tabs': tab.index}).then(
                                () => {

                                }, () => {

                                }
                            );
                        });
                    }

                }
                console.log("End of Session\n");

            }
        }
    }, function() {

    });
})