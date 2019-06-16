var config = {
    namuwikiBlock: true,
    namuMirrorBlock: true,
    openRiss: true,
    openDbpia: true,
    proxyDbpia: "",
}

chrome.storage.sync.get(config, function(loadConfig) {
    config = loadConfig;
    document.getElementById('status').innerHTML = "로드완료. "+JSON.stringify(config);
    setHook();
    setTimeout(
        () => { document.getElementById('status').innerHTML = ""; },
        750
    )
});

const chkbox = [
    document.getElementById('block_namuwiki'),
    document.getElementById('block_namumirror'),
    document.getElementById('riss_auto'),
    document.getElementById('dbpia_auto'),
    document.getElementById('dbpia_proxy'),
];

function saveData(thisConfig) {
    chrome.storage.sync.set(thisConfig, function() {
        document.getElementById('status').innerHTML = "저장완료. "+JSON.stringify(config);
        setTimeout(
            () => { document.getElementById('status').innerHTML = ""; },
            750
        )
    })
}

function setHook() {
    for (const chk of chkbox) {
        console.log(chk);
        chk.checked = config[chk.dataset.val];
        chk.addEventListener(
            "change",
            () => {
                if (chk.type === "checkbox") {
                    config[chk.dataset.val] = chk.checked;
                } else if (chk.type === "text" || chk.type === "url") {
                    config[chk.dataset.val] = chk.value;
                }
                saveData(config);
            }
        )
    }
}

var manifestData = chrome.runtime.getManifest();
document.getElementById('extension_version').innerHTML = "ver."+manifestData.version;
