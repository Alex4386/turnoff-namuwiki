interface ConfigInterface {
    namuwikiBlock: boolean;
    namuMirrorBlock: boolean;
    openRiss: boolean;
    openDbpia: boolean;
    openArxiv: boolean;
    openGoogleScholar: boolean;
    proxyDbpia: string;
    filterSearch: boolean;
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