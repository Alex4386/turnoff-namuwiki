interface ConfigInterface {
    namuwikiBlock: boolean;
    namuMirrorBlock: boolean;
    openRiss: boolean;
    openDbpia: boolean;
    proxyDbpia: string;
}

let config: ConfigInterface = {
    namuwikiBlock: true,
    namuMirrorBlock: true,
    openRiss: true,
    openDbpia: true,
    proxyDbpia: undefined,
};

const bgconsole = browser.extension.getBackgroundPage().console;

function escapeHtml(unsafe: string) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

(async () => {
    try {
        config = await browser.storage.sync.get() as unknown as ConfigInterface || config;
        bgconsole.log(`로드완료. ${JSON.stringify(config)}`);
        setHook();
    } catch (e) {
        alert(e);
        bgconsole.error(`로드완료. ${JSON.stringify(config)}`);
    }
})();

const chkbox = [
    document.getElementById('block_namuwiki'),
    document.getElementById('block_namumirror'),
    document.getElementById('riss_auto'),
    document.getElementById('dbpia_auto'),
    document.getElementById('dbpia_proxy'),
] as HTMLInputElement[];

async function saveData(thisConfig: ConfigInterface) {
    try {
        await browser.storage.sync.set(thisConfig as any);
        bgconsole.log(`저장완료. ${JSON.stringify(config)}`);
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
            chk.value = config[datasetVal] as string;
            chk.value = chk.value === 'undefined' ? '' : chk.value;
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
            }
        )
    }
}

const manifestData = browser.runtime.getManifest();
document.getElementById('extension_version').innerHTML = escapeHtml("ver." + manifestData.version);
