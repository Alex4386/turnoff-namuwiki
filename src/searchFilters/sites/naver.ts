import { SearchEngineFilter } from "../index";

type TargetElement = HTMLLIElement;

export default new SearchEngineFilter(
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
                    if (rules.find(n => n.isInSite(searchResultAnchor.href))) {
                        killList.push(searchResult);
                    }
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
);