import { BlockedSite } from "../common/rules/model";

type TargetRoutine = (rules: BlockedSite[]) => any;

export class SearchEngineFilter {
  public name: string;
  public urlRegex: RegExp;
  public targetRoutine: TargetRoutine;

  constructor(name: string, urlRegex: RegExp, targetRoutine: TargetRoutine) {
    this.name = name;
    this.urlRegex = urlRegex;
    this.targetRoutine = targetRoutine;
  }

  public isMatch(url: string): boolean {
    return this.urlRegex.test(url);
  }

  public runRoutineOnMatch(url: string, ...args: Parameters<typeof this.targetRoutine>): any {
    if (this.isMatch(url)) {
      return this.targetRoutine(...args);
    }
  }
}