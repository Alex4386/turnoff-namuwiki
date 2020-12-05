
const header = document.getElementsByTagName("header")[0];

const popup_settings = [
    document.getElementById('block_namuwiki'),
    document.getElementById('block_namumirror'),
    document.getElementById('adblock_namuwiki'),
    document.getElementById('filter_search'),
    //document.getElementById('arcalive_block'),
    document.getElementById('intelliBan_enabled'),
];

function popup_updateHeader(config: ConfigInterface) {
    const body = document.body;

    if (config.namuwikiBlock) {
        body.classList.remove("namuwiki");
        body.classList.add("blocked");
    } else {
        body.classList.add("namuwiki");
        body.classList.remove("blocked");
    }

    if (config.namuMirrorBlock) {
        body.classList.add("mirror-blocked");
    } else {
        body.classList.remove("mirror-blocked");
    }

    if (config.openArxiv || config.openDbpia || config.openGoogleScholar || config.openRiss) {
        body.classList.add("redirect");
    } else {
        body.classList.remove("redirect");
    }
}

showVersion();

(async () => {
    try {
        config = await browser.storage.sync.get() as unknown as ConfigInterface;
        bgconsole.log(`로드 완료. ${JSON.stringify(config)}`);
        setHook(popup_settings as HTMLInputElement[], (config) => {
            popup_updateHeader(config);
            updateIntelliBan(config);
        });
        popup_updateHeader(config);
    } catch (e) {
        alert(e);
        bgconsole.error(`로드 실패. ${JSON.stringify(config)}`);
    }
})();
