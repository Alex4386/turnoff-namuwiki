/* 아 코드 뭐같아서 빨리 고쳐야 하는데.... */
const currentlyRedirecting = [];

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
    const url = info.url;
    chrome.storage.sync.get({
        namuwikiBlock: true,
        openRiss: true,
        openDbpia: true
    }, function(loadConfig) {
        if (/^http(s|):\/\/namu.wiki/ig.test(url)) {
            chrome.extension.getBackgroundPage().console.log("NAMU WIKI DETECTED!!");
            chrome.extension.getBackgroundPage().console.log("config", loadConfig);
            chrome.extension.getBackgroundPage().console.log("tab", tab);
            const parsed = /^http(s|):\/\/namu.wiki\/(w|go)\/(.+)/ig.exec(url);
            if (parsed !== null) {
                const isThisSearch = (parsed[2].toLowerCase() === 'go');
                const searchQuery = (parsed[3]);
    
                if (loadConfig.openRiss) {
                    /* RISS Validation Check */
                    if (!/^[A-z]+$/.test(searchQuery)) {
                        chrome.tabs.create({
                            url: "http://www.riss.kr/search/Search.do?detailSearch=false&searchGubun=true&oldQuery=&query="+searchQuery
                        });
                    }
                }
                if (loadConfig.openDbpia) {
                    chrome.tabs.create({
                        url: "http://www.dbpia.co.kr/search/topSearch?startCount=0&collection=ALL&startDate=&endDate=&filter=&prefix=&range=A&searchField=ALL&sort=RANK&reQuery=&realQuery=&exquery=&query="+searchQuery+"&collectionQuery=&srchOption=*"
                    });
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
        }
    });
})