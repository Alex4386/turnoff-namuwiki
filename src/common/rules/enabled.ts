import { ConfigInterface } from "../config/interface";
import { getBlockRules, loadBlockRules } from "./block";
import { BlockedSite } from "./model";

/**
 * Get enabled rules via the config
 * @param config config object
 * @returns blocked site rules
 */
export function getActiveRulesFromConfig(config: ConfigInterface): BlockedSite[] | undefined {
  const groups = Object.keys(config.blocked.group ?? {}).filter(group => config.blocked.group[group]);
  const sites = Object.keys(config.blocked.site ?? {}).filter(site => config.blocked.site[site]);
  return getActiveRules(groups, sites);
}

export function getActiveRules(groups: string[] = [], sites: string[] = []): BlockedSite[] | undefined {
  const availableRules = getBlockRules();
  if (!availableRules) return undefined;

  const rules: BlockedSite[] = [];

  if (groups.length > 0) {
    rules.push(...availableRules.filter(rule => rule.group.find(a => groups.includes(a)) !== undefined));
  }

  if (sites.length > 0) {
    rules.push(...availableRules.filter(rule => sites.includes(rule.id)));
  }

  // Remove duplicates
  return rules.filter((rule, index, self) => self.findIndex(r => r.id === rule.id) === index);
}
