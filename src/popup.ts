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
    proxyDbpia: "",
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
        let loadConfig = await browser.storage.sync.get(null);
        if (Object.keys(loadConfig).length === 0 && loadConfig.constructor === Object) {
            bgconsole.log(config);
            (loadConfig as Object) = config;
        }

        config = loadConfig as unknown as ConfigInterface;

        document.getElementById('status').innerHTML = "로드완료. " + escapeHtml(JSON.stringify(config));
        setHook();
        setTimeout(
            () => {
                document.getElementById('status').innerHTML = "";
            },
            750
        )
    } catch (e) {
        alert(e);
        document.getElementById('status').innerHTML = "로드실패. " + escapeHtml(JSON.stringify(config));
        setTimeout(
            () => {
                document.getElementById('status').innerHTML = "";
            },
            1500
        );
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
        document.getElementById('status').innerHTML = "저장완료. " + escapeHtml(JSON.stringify(config));
        setTimeout(
            () => {
                document.getElementById('status').innerHTML = "";
            },
            750
        )
    } catch (e) {
        document.getElementById('status').innerHTML = "저장실패. " + escapeHtml(JSON.stringify(config));
        setTimeout(
            () => {
                document.getElementById('status').innerHTML = "";
            },
            1500
        )
    }
}

function setHook() {
    for (const chk of chkbox) {
        console.log(chk);
        const datasetVal = chk.dataset.val as keyof ConfigInterface;
        if (chk.type === "checkbox") {
            chk.checked = config[datasetVal] as boolean;
        } else if (chk.type === "text" || chk.type === "url") {
            chk.value = config[datasetVal] as string;
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
