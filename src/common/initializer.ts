import { loadConfig } from "./config/index";
import { loadAdRules } from "./rules/ads";
import { loadBlockRules } from "./rules/block";
import { loadRedirectionRules } from "./rules/redirect";

export async function loadAll() {
    try {
      await Promise.all([
        loadConfig,
        loadAdRules,
        loadRedirectionRules,
        loadBlockRules,
      ])
    } catch(e) {
      console.error("Failed to loadAll:", e);
    }
}