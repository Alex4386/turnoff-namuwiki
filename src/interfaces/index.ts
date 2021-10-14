import StorageObject = browser.storage.StorageObject;

interface RegexInterface extends StorageObject {
    regex: string;
    flag: string;
};

interface PageBlockRule {
    id: string;
    name?: string;
    group?: string[];
    baseURL: string;
    articleView?: RegExp | string;
    searchView?: RegExp | string;
    redirect?: boolean;
};

interface JSONBlockedSites extends StorageObject {
    id: string;
    group: string[];
    name?: string;
    baseURL: string;
    articleView?: RegexInterface;
    searchView?: RegexInterface;
    redirect?: boolean;
};

interface JSONRedirectedSites {
    id: string;
    group: string[];
    name: string;
    redirectLocation: string;
    queryProcessing?: {
        replace: {
            from: string;
            to: string;
        }[];
    }
};

interface ConfigInterface extends StorageObject{
    blocked: {   
        group: {
            [siteId: string]: boolean;
        },
        site: {
            [siteId: string]: boolean;
        },
        url: string;
        onlineRules: JSONBlockedSites[];
    };
    redirected: {
        [siteId: string]: boolean;
    };
    adblock: {
        namuwiki: boolean;
    };
    proxy: {
        dbpia: string;
    };
    searchFilter: boolean;
    intelliBan: {
        enabled: boolean;
        url: string;
        rules: RegexInterface[];
    };
    bannedPage: {
        message: string;
        retry: boolean;
    };
}

interface SearchEngineFilterRules {
    name: string;
    regex: RegExp;
    scriptLocation: string;
}
