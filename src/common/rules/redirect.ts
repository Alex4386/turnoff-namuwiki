import { getConfig, loadConfig } from "../config/index";
import { fetchRepo } from "../global";
import { RedirectTargetSite } from "./interface";

let redirectTargets: RedirectTargetSite[];

export function getRedirectTargets(): RedirectTargetSite[] | undefined {
  if (redirectTargets === undefined) {
    return undefined;
  }

  return redirectTargets;
}

async function fetchOfflineRedirectTargets(): Promise<RedirectTargetSite[]> {
  const data = await fetchRepo("/filter/redirectedSites.json", {repo: false});
  const res = await data.json();
  if (Array.isArray(res)) {
    return res;
  }

  return [];
}

async function fetchOnlineRedirectTargets(): Promise<RedirectTargetSite[]> {
  try {
    const data = await fetchRepo("/filter/redirectedSites.json", {repo: true});
    const res = await data.json();
    if (Array.isArray(res)) {
      return res;
    }
    return [];
  } catch(e) {
    return [];
  }
}

export async function loadRedirectionRules(): Promise<RedirectTargetSite[]> {
  if (redirectTargets === undefined) {
    let rules = await fetchOfflineRedirectTargets();
    try {
      const onlineRules = await fetchOnlineRedirectTargets();
      
      // merge offline and online rules
      // if there are any conflicts, online rules will take precedence
      const onlineRemoved = rules.filter(rule => !onlineRules.find(r => r.id === rule.id));

      rules = [...onlineRemoved, ...onlineRules];
    } catch(e) {
      console.error("Failed to fetch online redirect rules", e);
    }

    redirectTargets = rules;
  }

  return redirectTargets;
}

export async function handleRedirects(query: string): Promise<string[]> {
  const config = getConfig() ?? await loadConfig();
  const rules = getRedirectTargets() ?? await loadRedirectionRules();

  const urls = [];
  console.log('rules', rules)

  const enabledIds = Object.keys(config?.redirected ?? {}).filter(id => config.redirected[id]);
  console.log('enabledIds', enabledIds);

  for (const id of enabledIds) {
    const rule = rules.find(n => n.id === id);
    if (!rule) continue;

    let tmpQuery = query;
    if (rule.queryProcessing) {
      for (const replaceReq of rule.queryProcessing.replace) {
        const fromRegex = new RegExp(replaceReq.from, "g");
        const to = replaceReq.to;
        tmpQuery = tmpQuery.replace(fromRegex, to);
      }
    }

    const queryReplaceRegex = new RegExp("{{query}}", "g");
    const langReplaceRegex = new RegExp("{{lang}}", "g");

    const langCode = /(가-힣)+/.test(query) ? "ko" : /^[A-z0-9 ]$/.test(tmpQuery) ? "en" : (/^((\w){2})/.exec(navigator.language) ?? ['ko', 'KR'])[1];
    const finalURL = rule.redirectLocation.replace(queryReplaceRegex, query).replace(langReplaceRegex, langCode);

    urls.push(finalURL);
  }

  return urls;
}