import { RegexInterface } from "../regex/interface";
import { SerializedBlockedSite } from "../rules/interface";

export interface ConfigInterface {
  blocked: {
      group: {
          [siteId: string]: boolean;
      },
      site: {
          [siteId: string]: boolean;
      },
      url: string;
      onlineRules: SerializedBlockedSite[];
      lastUpdated?: number;
  };
  redirected: {
      [siteId: string]: boolean;
  };
  adblock: {
      namuwiki: boolean;
      forceRealLicense: boolean;
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
