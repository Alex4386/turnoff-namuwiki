"use strict";
var config = {
    namuwikiBlock: true,
    namuMirrorBlock: true,
    openRiss: true,
    openDbpia: true,
    proxyDbpia: "",
};
const bgconsole = browser.extension.getBackgroundPage().console;
browser.storage.sync.get(null).then((loadConfig) => {
    bgconsole.log(config);
    config = loadConfig;
    document.getElementById('status').innerHTML = "로드완료. " + JSON.stringify(config);
    setHook();
    setTimeout(() => { document.getElementById('status').innerHTML = ""; }, 750);
}, () => {
    document.getElementById('status').innerHTML = "로드실패. " + JSON.stringify(config);
    setTimeout(() => { document.getElementById('status').innerHTML = ""; }, 1500);
});
const chkbox = [
    document.getElementById('block_namuwiki'),
    document.getElementById('block_namumirror'),
    document.getElementById('riss_auto'),
    document.getElementById('dbpia_auto'),
    document.getElementById('dbpia_proxy'),
];
function saveData(thisConfig) {
    browser.storage.sync.set(thisConfig).then(() => {
        document.getElementById('status').innerHTML = "저장완료. " + JSON.stringify(config);
        setTimeout(() => { document.getElementById('status').innerHTML = ""; }, 750);
    }, () => {
        document.getElementById('status').innerHTML = "저장실패. " + JSON.stringify(config);
        setTimeout(() => { document.getElementById('status').innerHTML = ""; }, 1500);
    });
}
function setHook() {
    for (const chk of chkbox) {
        console.log(chk);
        const datasetVal = chk.dataset.val;
        if (chk.type === "checkbox") {
            chk.checked = config[datasetVal];
        }
        else if (chk.type === "text" || chk.type === "url") {
            chk.value = config[datasetVal];
        }
        chk.addEventListener("change", () => {
            if (chk.type === "checkbox") {
                config[datasetVal] = chk.checked;
            }
            else if (chk.type === "text" || chk.type === "url") {
                config[datasetVal] = chk.value;
            }
            saveData(config);
        });
    }
}
var manifestData = browser.runtime.getManifest();
document.getElementById('extension_version').innerHTML = "ver." + manifestData.version;
