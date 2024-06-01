/* SET VERSION */

// === CONTINUE ===
function getData(config, text) {
  const loc = text.split(".");
  let data = config;

  for (let i = 0; i < loc.length; i++) {
    if (data[loc[i]] === undefined && i < loc.length - 1) {
      data[loc[i]] = {};
    }

    data = data[loc[i]];
  }

  return data;
}

function setData(config, text, value) {
  const loc = text.split(".");
  let data = config;

  for (let i = 0; i < loc.length - 1; i++) {
    if (typeof data[loc[i]] !== "object") {
      data[loc[i]] = {};
    }
    
    data = data[loc[i]];
  }
  data[loc[loc.length - 1]] = value;
}

async function loadBlocked() {
  return (await fetch("/filter/blockedSites.json")).json()
}

async function loadRedirected() {
  return (await fetch("/filter/redirectedSites.json")).json();
}

async function loadBlockedGroups() {
  const blocked = await loadBlocked();
  const groups = [];

  for (const blockedSite of blocked) {
    const siteGroup = blockedSite.group;
    
    for (const groupName of siteGroup) {
      if (!groups.includes(groupName)) {
        groups.push(groupName);
      }
    }
  }

  return groups;
}

async function saveData(thisConfig) {
    try {
        await browser.storage.sync.set(thisConfig);
        console.log(`저장 완료. ${JSON.stringify(config)}`);
    } catch (e) {
        console.error(`저장 실패. ${JSON.stringify(config)}`);
    }
}

async function updateBlocked(config, url) {
  if (typeof url === "undefined") {
    if (config.blocked === undefined) config.blocked = {};
    if (!config.blocked.url) {
        config.blocked.url = blockedLocation;
        url = config.blocked.url;
    } else {
        url = config.blocked.url
    }
  } else {
    if (url === "") {
      config.blocked.url = blockedLocation;
      url = config.blocked.url;
    }
  }

  const data = await fetch(config.blocked.url);
  if (data.status === 200) {
    config.blocked.onlineRules = await data.json();
    console.log("Got Blocked: ", config.blocked.onlineRules);

    alert("새로운 차단 정보가 입력되어 페이지 새로고침이 필요합니다.");
  }

  if (config.blocked.onlineRules === undefined) {
    config.blocked.onlineRules = [];
  }

  await saveData(config);
}


function setHook(chkbox, callback) {
  for (const chk of chkbox) {
      if (chk === null) { console.error(chkbox); }
      const datasetVal = chk.dataset.val;

      console.debug(datasetVal);

      if (chk.type === "checkbox") {
        chk.checked = getData(config, datasetVal);
      } else if (chk.type === "text" || chk.type === "url") {
        chk.value = getData(config, datasetVal) || '';
      }
      chk.addEventListener(
          "change",
          async () => {
              console.log("hook triggered at ", chk);
              if (chk.type === "checkbox") {
                setData(config, datasetVal, chk.checked);
              } else if (chk.type === "text" || chk.type === "url") {
                setData(config, datasetVal, chk.value);
              }
              await saveData(config);
              if (typeof callback !== "undefined") callback(config);
              console.log("updated", config);
          }
      )  
  }
}