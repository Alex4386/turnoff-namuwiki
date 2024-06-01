import { deserializeRegex } from "../regex/index";
import { BlockedSiteModel, SerializedBlockedSite } from "./interface";

export class BlockedSite implements BlockedSiteModel {
  public id: string;
  public group: string[];
  public name?: string;
  public baseURL: string;
  public articleView?: RegExp;
  public searchView?: RegExp;
  public redirect?: boolean;

  constructor(site: SerializedBlockedSite) {
    this.id = site.id;
    this.group = site.group;
    this.name = site.name;
    this.baseURL = site.baseURL;
    this.articleView = site.articleView !== undefined ? deserializeRegex(site.articleView) : undefined;
    this.searchView = site.searchView !== undefined ? deserializeRegex(site.searchView) : undefined;
    this.redirect = site.redirect;
  }

  public static fromSerialized(site: SerializedBlockedSite): BlockedSite {
    return new BlockedSite(site);
  }

  private getTargetURL(rawUrl: string): string {
    const url = new URL(rawUrl);
    return url.pathname + (url.search || "");
  }

  public isInSite(rawUrl: string): boolean {
    const url = new URL(rawUrl);
    return url.hostname === this.baseURL;
  }

  public isSearchView(rawUrl: string): boolean {
    if (this.searchView === undefined) {
      return false;
    }

    this.searchView.lastIndex = 0;
    return this.searchView.test(this.getTargetURL(rawUrl));
  }

  public isArticleView(rawUrl: string): boolean {
    if (this.articleView === undefined) {
      return false;
    }

    this.articleView.lastIndex = 0;
    return this.articleView.test(this.getTargetURL(rawUrl));
  }

  public getQuery(rawUrl: string): string | undefined {
    return this.getSearchQuery(rawUrl) ?? this.getArticleName(rawUrl);
  }

  public getSearchQuery(rawUrl: string): string | undefined {
    if (this.searchView === undefined) {
      return undefined;
    }

    this.searchView.lastIndex = 0;
    const match = this.searchView.exec(this.getTargetURL(rawUrl));
    if (match === null) {
      return undefined;
    }

    if (match.groups?.query !== undefined) {
      // check if it is url encoded
      try {
        return decodeURIComponent(match.groups.query);
      } catch {
        return match.groups.query;
      }
    }

    return undefined;
  }

  public getArticleName(rawUrl: string): string | undefined {
    if (this.articleView === undefined) {
      return undefined;
    }

    this.articleView.lastIndex = 0;
    const match = this.articleView.exec(this.getTargetURL(rawUrl));
    if (match === null) {
      return undefined;
    }

    if (match.groups?.query !== undefined) {
      // check if it is url encoded
      try {
        return decodeURIComponent(match.groups.query);
      } catch {
        return match.groups.query;
      }
    }

    return undefined;
  }
}
