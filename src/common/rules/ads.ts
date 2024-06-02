import { fetchRepo } from "../global";

let adTargets: string[];

export function getAdTargets() {
  return adTargets;
}

export async function fetchOfflineAdTargets(): Promise<string[]> {
  const data = await fetchRepo('/filter/namuAds.json');
  const res = await data.json();
  if (Array.isArray(res)) {
    return res;
  }

  return [];
}

export async function fetchOnlineAdTargets(): Promise<string[]> {
  try {
    const data = await fetchRepo('/filter/namuAds.json', { repo: true });
    const res = await data.json();
    if (Array.isArray(res)) {
      return res;
    }
    return [];
  } catch (e) {
    return [];
  }
}

export async function loadAdRules(): Promise<string[]> {
  if (adTargets === undefined) {
    let rules = await fetchOfflineAdTargets();
    try {
      const onlineRules = await fetchOnlineAdTargets();
      
      // merge offline and online rules
      // if there are any conflicts, online rules will take precedence
      const onlineRemoved = rules.filter(rule => !onlineRules.includes(rule));
      rules = [...onlineRemoved, ...onlineRules];
    } catch(e) {
      console.error("Failed to fetch online ad rules", e);
    }

    adTargets = rules;
  }

  return adTargets;
}

