
const header = document.getElementsByTagName("header")[0];

const popup_settings = [
    document.getElementById('block_namuwiki'),
    document.getElementById('block_namumirror'),
    document.getElementById('adblock_namuwiki'),
    document.getElementById('filter_search'),
    //document.getElementById('arcalive_block'),
    document.getElementById('intelliBan_enabled'),
];

function popup_updateHeader(config) {
    const body = document.body;
    const groupBlock = config?.blocked?.group ?? {};

    const hasBlocked = groupBlock.namuwiki && groupBlock.namuwikiMirror;

    if (groupBlock.namuwiki) {
        body.classList.remove("namuwiki");
        body.classList.add("blocked");
    } else {
        body.classList.add("namuwiki");
        body.classList.remove("blocked");
    }

    if (groupBlock.namuwikiMirror) {
        body.classList.add("mirror-blocked");
    } else {
        body.classList.remove("mirror-blocked");
    }

    if (hasBlocked) {
        const hasRedirectTargets = Object.keys(config?.redirected || {}).find(n => (config?.redirected ?? {})[n]);
        if (hasRedirectTargets) {
            body.classList.add("redirect");
        } else {
            body.classList.remove("redirect");
        }
    }
}

showVersion();

(async () => {
    try {
        config = await browser.storage.sync.get();
        console.log(`로드 완료. ${JSON.stringify(config)}`);
        setHook(popup_settings, (config) => {
            popup_updateHeader(config);
            updateIntelliBan(config);
        });
        popup_updateHeader(config);
    } catch (e) {
        alert(e);
        console.error(`로드 실패. ${JSON.stringify(config)}`);
    }
})();
