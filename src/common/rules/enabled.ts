import { ConfigInterface } from "../config/interface";
import { getBlockRules, loadBlockRules } from "./block";
import { BlockedSite } from "./model";

/**
 * Get enabled rules via the config
 * @param config config object
 * @returns blocked site rules
 */
export function getActiveRulesFromConfig(config: ConfigInterface): BlockedSite[] | undefined {
  return getActiveRules(Object.keys(config.blocked.group ?? {}), Object.keys(config.blocked.site ?? {}));
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
