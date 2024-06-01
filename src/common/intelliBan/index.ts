import { getConfig } from "../config/index";
import { deserializeRegex } from "../regex/index";

export function checkIfIntelliBanPass(query: string) {
    const config = getConfig();
    if (config.intelliBan?.enabled) {
      const rules = config.intelliBan.rules.filter(rule => rule).map(deserializeRegex);
      return rules.find(rule => rule.test(query));
    }

    return false;
}