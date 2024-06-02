import { RegexInterface } from "../regex/interface";

interface SiteBaseModel {
  id: string;
  group: string[];
  name?: string;
}

export interface BlockedSiteModel extends SiteBaseModel {
  baseURL: string;
  articleView?: RegExp;
  searchView?: RegExp;
  redirect?: boolean;
};

export interface SerializedBlockedSite extends Omit<BlockedSiteModel, "articleView" | "searchView"> {
  articleView?: RegexInterface;
  searchView?: RegexInterface;
}

export interface RedirectTargetSite extends SiteBaseModel {
  redirectLocation: string;
  queryProcessing?: {
      replace: {
          from: string;
          to: string;
      }[];
  }
};