import { BlockedSite } from "../common/rules/model";
import { SearchEngineFilter } from "./index";
import daum from "./sites/daum";
import duckduckgo from "./sites/duckduckgo";
import ecosia from "./sites/ecosia";
import google from "./sites/google";
import naver from "./sites/naver";

export function runSearchFilterRoutine(rules: BlockedSite[] = []) {
  const url = window.location.href;
  for (const filter of [
    daum,
    naver,
    google,
    ecosia,
    duckduckgo,
  ]) {
    filter.runRoutineOnMatch(url, rules);
  }
}
