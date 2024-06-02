import { SerializedBlockedSite } from "../common/rules/interface";

type TargetRoutine = (rules: SerializedBlockedSite[]) => any;
type TargetElement = HTMLElement;

export function runSearchFilterRoutine(rules: SerializedBlockedSite[] = []) {
  class SearchEngineFilter {
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

  const filters = [
    new SearchEngineFilter(
      "Daum",
      /^http(s|):\/\/(www.|search.|)daum.net\/search\?/ig,
      async (rules) => {
          const searchResultClasses = [ 'wrap_cont' ];
          searchResultClasses.forEach(async (currentClass) => {
              const searchResults = document.getElementsByClassName(currentClass) as unknown
              const killList: TargetElement[] = [];
  
              for (const searchResult of searchResults as unknown as TargetElement[]) {
                  const searchResultAnchors = searchResult.getElementsByTagName('a') as unknown as HTMLAnchorElement[];
                  for (const searchResultAnchor of searchResultAnchors) {
                    try {
                      const url = new URL(searchResultAnchor.href);
                      if (rules.find(n => n.baseURL === url.hostname)) {
                        killList.push(searchResult);
                      }
                    } catch(e) {}
                  }
              }
  
              for (const kill of killList) {
                  try {
                      kill.remove();
                  } catch {
                  }
              }
          }); 
      }
    ),
    new SearchEngineFilter(
      "DuckDuckGo",
      /^http(s|):\/\/(www.|search.|)duckduckgo.com\/\?/ig,
      async (rules) => {
          const searchResultClasses = [ 'nrn-react-div', 'tile' ];
          searchResultClasses.forEach(async (currentClass) => {
              const searchResults = document.getElementsByClassName(currentClass) as unknown
              const killList: TargetElement[] = [];
  
              for (const searchResult of searchResults as unknown as TargetElement[]) {
                  const searchResultAnchors = searchResult.getElementsByTagName('a') as unknown as HTMLAnchorElement[];
                  for (const searchResultAnchor of searchResultAnchors) {
                    try {
                      const url = new URL(searchResultAnchor.href);
                      if (rules.find(n => n.baseURL === url.hostname)) {
                        killList.push(searchResult);
                      }
                    } catch(e) {}
                  }
              }
  
              for (const kill of killList) {
                  try {
                      kill.remove();
                  } catch {
                  }
              }
          }); 
      }
  ),
  new SearchEngineFilter(
    "Ecosia",
    /^https:\/\/www\.ecosia\.org\/(search|images)\?/ig,
    async (rules) => {
        const searchResultClasses = [ 'result', 'image-result' ];
        searchResultClasses.forEach(async (currentClass) => {
            const searchResults = document.getElementsByClassName(currentClass) as unknown
            const killList: TargetElement[] = [];

            for (const searchResult of searchResults as unknown as TargetElement[]) {
                const searchResultAnchors = searchResult.getElementsByTagName('a') as unknown as HTMLAnchorElement[];
                for (const searchResultAnchor of searchResultAnchors) {
                  try {
                    const url = new URL(searchResultAnchor.href);
                    if (rules.find(n => n.baseURL === url.hostname)) {
                      killList.push(searchResult);
                    }
                  } catch(e) {}
                }
            }

            for (const kill of killList) {
                try {
                    kill.remove();
                } catch {
                }
            }
        }); 
    }
),
new SearchEngineFilter(
  "Google",
  /^http(s|):\/\/(www.|cse.|)google.com\/search\?/ig,
  async (rules) => {
      const searchResultClasses = [ 'xpd', 'ez02md', 'g', 'ifM9O', 'ivg-i' ];
      searchResultClasses.forEach(async (currentClass) => {
          const searchResults = document.getElementsByClassName(currentClass) as unknown
          const killList: TargetElement[] = [];

          for (const searchResult of searchResults as unknown as TargetElement[]) {
              const searchResultAnchors = searchResult.getElementsByTagName('a') as unknown as HTMLAnchorElement[];
              for (const searchResultAnchor of searchResultAnchors) {
                try {
                  const url = new URL(searchResultAnchor.href);
                  if (rules.find(n => n.baseURL === url.hostname)) {
                    killList.push(searchResult);
                  }
                } catch(e) {}
              }
          }

          for (const kill of killList) {
              try {
                  kill.remove();
              } catch {
              }
          }
      }); 
  }
),
new SearchEngineFilter(
  "Naver",
  /^http(s|):\/\/(www.|search.|)naver.com\//ig,
  async (rules) => {
      const searchResultClasses = [ 'sh_web_top', 'bx' ];
      searchResultClasses.forEach(async (currentClass) => {
          const searchResults = document.getElementsByClassName(currentClass) as unknown
          const killList: TargetElement[] = [];

          for (const searchResult of searchResults as unknown as TargetElement[]) {
              const searchResultAnchors = searchResult.getElementsByTagName('a') as unknown as HTMLAnchorElement[];
              for (const searchResultAnchor of searchResultAnchors) {
                try {
                  const url = new URL(searchResultAnchor.href);
                  if (rules.find(n => n.baseURL === url.hostname)) {
                    killList.push(searchResult);
                  }
                } catch(e) {}
              }
          }

          for (const kill of killList) {
              try {
                  kill.remove();
              } catch {
              }
          }
      }); 
  }
),


  ]
  const url = window.location.href;
  for (const filter of filters) {
    filter.runRoutineOnMatch(url, rules);
  }
}
