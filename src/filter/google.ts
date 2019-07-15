(async () => {

    /* = This Section must be copy-pasted from bg.ts when it is updated = */
    const urlRegex = "^http(s?):\\/\\/";
    const blockRules = [ "namu.wiki", "namu.mirror.wiki", "namu.moe", "mir.pe" ];

    function checkURLBanned(url: string) {
        for (const rule of blockRules) {
            const baseBlockRegex = new RegExp(urlRegex + rule, "ig");
            if (baseBlockRegex.test(url)) {
                return true;
            }
        }
        return false;
    }

    const killList: HTMLDivElement[] = [];

    let searchResults = document.getElementsByClassName('g') as unknown as HTMLDivElement[];;
    
    if (searchResults.length == 0) {
        searchResults = [] as unknown as HTMLDivElement[];
        for (const a of document.getElementsByClassName("srg") as unknown as HTMLDivElement[]) {
            for (const b of a.getElementsByTagName("div") as unknown as HTMLDivElement[]) {
                searchResults.push(b);
            }
        }
    } else {

    }
    
    for (const searchResult of searchResults as unknown as HTMLDivElement[]) {
        const searchResultAnchors = searchResult.getElementsByTagName('a');
        for (const searchResultAnchor of searchResultAnchors as unknown as HTMLAnchorElement[]) {
            const banned = checkURLBanned(searchResultAnchor.href);
            if (banned) {
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
})();

