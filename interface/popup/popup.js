var config = {
    namuwikiBlock: true,
    openRiss: true,
    openDbpia: true
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
    document.getElementById('riss_auto'),
    document.getElementById('dbpia_auto')
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
                config[chk.dataset.val] = chk.checked;
                saveData(config);
            }
        )
    }
}
