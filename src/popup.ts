interface ConfigInterface {
    namuwikiBlock: boolean;
    namuMirrorBlock: boolean;
    openRiss: boolean;
    openDbpia: boolean;
    proxyDbpia: string;
}

var config:ConfigInterface = {
    namuwikiBlock: true,
    namuMirrorBlock: true,
    openRiss: true,
    openDbpia: true,
    proxyDbpia: "",
}

const bgconsole = browser.extension.getBackgroundPage().console;

browser.storage.sync.get(null).then(
    (loadConfig) => {
        if (loadConfig !== null) {
            bgconsole.log(config);
            config = loadConfig as unknown as ConfigInterface;
        }

        document.getElementById('status').innerHTML = "로드완료. "+JSON.stringify(config);
        setHook();
        setTimeout(
            () => { document.getElementById('status').innerHTML = ""; },
            750
        )
    }, (e) => {
        alert(e);
        document.getElementById('status').innerHTML = "로드실패. "+JSON.stringify(config);
        setTimeout(
            () => { document.getElementById('status').innerHTML = ""; },
            1500
        );
    }
)

const chkbox = [
    document.getElementById('block_namuwiki'),
    document.getElementById('block_namumirror'),
    document.getElementById('riss_auto'),
    document.getElementById('dbpia_auto'),
    document.getElementById('dbpia_proxy'),
] as HTMLInputElement[];

function saveData(thisConfig: ConfigInterface) {
    browser.storage.sync.set(thisConfig as any).then(
        () => {
            document.getElementById('status').innerHTML = "저장완료. "+JSON.stringify(config);
            setTimeout(
                () => { document.getElementById('status').innerHTML = ""; },
                750
            )
        }, () => {
            document.getElementById('status').innerHTML = "저장실패. "+JSON.stringify(config);
            setTimeout(
                () => { document.getElementById('status').innerHTML = ""; },
                1500
            )
        }
    )
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
            () => {
                if (chk.type === "checkbox") {
                    config[datasetVal] = chk.checked;
                } else if (chk.type === "text" || chk.type === "url") {
                    config[datasetVal] = chk.value;
                }
                saveData(config);
            }
        )
    }
}

var manifestData = browser.runtime.getManifest();
document.getElementById('extension_version').innerHTML = "ver."+manifestData.version;
