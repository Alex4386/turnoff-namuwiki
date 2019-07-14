let config: ConfigInterface;

const bgconsole = browser.extension.getBackgroundPage().console;
const header = document.getElementsByTagName("header")[0];

function escapeHtml(unsafe: string) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const chkbox = [
    document.getElementById('block_namuwiki'),
    document.getElementById('block_namumirror'),
    document.getElementById('riss_auto'),
    document.getElementById('dbpia_auto'),
    document.getElementById('arxiv_auto'),
    document.getElementById('googlescholar_auto'),
    document.getElementById('dbpia_proxy'),
    document.getElementById('filter_search'),
] as HTMLInputElement[];

async function saveData(thisConfig: ConfigInterface) {
    try {
        await browser.storage.sync.set(thisConfig as any);
        bgconsole.log(`저장 완료. ${JSON.stringify(config)}`);
    } catch (e) {
        bgconsole.error(`저장 실패. ${JSON.stringify(config)}`);
    }
}

function setHook() {
    for (const chk of chkbox) {
        const datasetVal = chk.dataset.val as keyof ConfigInterface;
        if (chk.type === "checkbox") {
            chk.checked = config[datasetVal] as boolean;
        } else if (chk.type === "text" || chk.type === "url") {
            chk.value = ((typeof (config[datasetVal]) === "undefined") ? '' : config[datasetVal]) as string;
        }
        chk.addEventListener(
            "change",
            async () => {
                if (chk.type === "checkbox") {
                    (config[datasetVal] as boolean) = chk.checked;
                } else if (chk.type === "text" || chk.type === "url") {
                    (config[datasetVal] as string) = chk.value;
                }
                await saveData(config);
                updateHeader(config);
            }
        )
    }
}

function updateHeader(config: ConfigInterface) {
    if (config.namuwikiBlock) {
        header.classList.remove("namuwiki");
    } else {
        header.classList.add("namuwiki");
    }
    if (config.openArxiv || config.openDbpia || config.openGoogleScholar || config.openRiss) {
        header.classList.add("redirect");
    } else {
        header.classList.remove("redirect");
    }
}

const manifestData = browser.runtime.getManifest();
document.getElementById('extension_version').innerHTML = escapeHtml("ver." + manifestData.version);

(async () => {
    try {
        config = await browser.storage.sync.get() as unknown as ConfigInterface;
        bgconsole.log(`로드 완료. ${JSON.stringify(config)}`);
        setHook();
        updateHeader(config);
    } catch (e) {
        alert(e);
        bgconsole.error(`로드 실패. ${JSON.stringify(config)}`);
    }
})();
