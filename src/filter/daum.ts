
(async () => {

    /* = This Section must be copy-pasted from bg.ts when it is updated = */
    const urlRegex = "^http(s?):\\/\\/";
    const blockRules = [ "namu.wiki", "namu.mirror.wiki", "namu.moe", "mir.pe" ];

    const searchResultClasses = [ 'wrap_cont' ];

    let searchResults: HTMLLIElement[] = [];

    function checkURLBanned(url: string) {
        for (const rule of blockRules) {
            const baseBlockRegex = new RegExp(urlRegex + rule, "ig");
            if (baseBlockRegex.test(url)) {
                return true;
            }
        }
        return false;
    }

    const killList: HTMLLIElement[] = [];

    console.log("NAMUWIKI SEARCH KILL ACTIVE!");
    console.time("namuKill");

    for (const currentClass of searchResultClasses) {
        console.log("Searching for class:", currentClass);
        searchResults = document.getElementsByClassName(currentClass) as unknown as HTMLLIElement[];
        console.log("Current searchResults: ", searchResults);

        for (const searchResult of searchResults as unknown as HTMLLIElement[]) {
            const searchResultAnchors = searchResult.getElementsByTagName('a');

            for (const searchResultAnchor of searchResultAnchors as unknown as HTMLAnchorElement[]) {
                const banned = checkURLBanned(searchResultAnchor.href);
                if (banned) {
                    killList.push(searchResult);
                }
            }
        }
    }

    for (const kill of killList) {
        try {
            kill.remove();
        } catch {

        }
    }
    console.timeEnd("namuKill");
})();

