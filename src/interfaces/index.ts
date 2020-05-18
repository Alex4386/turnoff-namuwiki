interface ConfigInterface {
    namuwikiBlock: boolean;
    namuMirrorBlock: boolean;
    openRiss: boolean;
    openDbpia: boolean;
    openArxiv: boolean;
    openGoogleScholar: boolean;
    openWikipedia: boolean;
    openLibrewiki: boolean;
    adBlockNamuWiki: boolean;
    proxyDbpia: string;
    filterSearch: boolean;
    namuLiveBlock: boolean;
    intelliBanEnabled: boolean;
    intelliBanUrl: string;
    intelliBanRules: {
        regex: string,
        flag: string
    }[];
    bannedPageMessage: string;
    bannedPageRetry: boolean;
}

interface PageBlockRule {
    baseURL: string;
    articleView: RegExp | string;
    searchView: RegExp | string;
}

interface SearchEngineFilterRules {
    name: string;
    regex: RegExp;
    scriptLocation: string;
}