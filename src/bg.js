/* 아 코드 뭐같아서 빨리 고쳐야 하는데.... */
const urlRegex = "^http(s|):\\/\\/";

const namuWikiBlockRule = [{
    baseURL: "namu.wiki",
    articleView: "/w/",
    searchView: "/go/",
}];

const mirrorLists = [
    // namuwiki mirror rulesets
    {
        baseURL: "namu.mirror.wiki",
        articleView: "/w/",
        serarchView: "/go/"
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

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    const url = info.url || tab.url
    chrome.storage.sync.get({
        namuwikiBlock: true,
        namuMirrorBlock: true,
        openRiss: true,
        openDbpia: true,
        proxyDbpia: "",
    }, function(loadConfig) {
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
                                chrome.tabs.create({
                                    url: "http://www.riss.kr/search/Search.do?detailSearch=false&searchGubun=true&oldQuery=&query="+searchQuery
                                });
                            }
                        }
                        if (loadConfig.openDbpia) {
                            if (loadConfig.proxyDbpia !== "") {
                                chrome.tabs.create({
                                    url: loadConfig.proxyDbpia+"/search/topSearch?startCount=0&collection=ALL&startDate=&endDate=&filter=&prefix=&range=A&searchField=ALL&sort=RANK&reQuery=&realQuery=&exquery=&query="+searchQuery+"&collectionQuery=&srchOption=*"
                                });
                            } else {
                                chrome.tabs.create({
                                    url: "http://www.dbpia.co.kr/search/topSearch?startCount=0&collection=ALL&startDate=&endDate=&filter=&prefix=&range=A&searchField=ALL&sort=RANK&reQuery=&realQuery=&exquery=&query="+searchQuery+"&collectionQuery=&srchOption=*"
                                });
                            }
                        }
                    }
                    
                    if (loadConfig.namuwikiBlock) {
                        chrome.tabs.update(tabId, {
                            url: chrome.extension.getURL("interface/banned/index.html")
                        });
                        chrome.tabs.get(tabId, function(tab) {
                            chrome.tabs.highlight({'tabs': tab.index}, function() {});
                        });
                    }

                }
                console.log("End of Session\n");

            }
        }
    });
})