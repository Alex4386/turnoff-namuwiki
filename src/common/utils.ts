import { ConfigInterface } from "./config/interface";

export function unescapeRegexString(string: string) {
  return string.replace(/\\([\/\.\*\+\?\|\(\)\[\]\{\}\\\$\^\-])/g, '$1');
}

export function isArcaLiveBlocked(config: ConfigInterface) {
  return config && config.blocked && (config.blocked.group["namulive"] || config.blocked.site["namulive"] || config.blocked.site['arcalive']);
}

export function isNamuNewsBlocked(config: ConfigInterface) {
  return config && config.blocked && (config.blocked.group["namunews"] || config.blocked.site["namunews"]);
}

export function isNamuWikiAdblock(config: ConfigInterface) {
  return config && config.adblock && config.adblock.namuwiki;
}
