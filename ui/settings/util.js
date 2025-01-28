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
  // Get rules from storage first
  const config = await browser.storage.sync.get();
  if (config?.blocked?.onlineRules) {
    return config.blocked.onlineRules;
  }
  
  // If not in storage, load from local
  return (await fetch("/filter/blockedSites.json")).json();
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

  try {
    const data = await fetch(url);
    if (data.status === 200) {
      config.blocked.onlineRules = await data.json();
      config.blocked.lastUpdated = Date.now();
      console.log("Got Blocked: ", config.blocked.onlineRules);
      await saveData(config);
      alert("새로운 차단 정보가 업데이트되었습니다. 페이지를 새로고침합니다.");
      window.location.reload();
    }
  } catch (e) {
    console.error("Failed to update from remote", e);
    alert("원격 서버에서 차단 정보를 가져오는데 실패했습니다.");
  }

  if (config.blocked.onlineRules === undefined) {
    config.blocked.onlineRules = [];
    await saveData(config);
  }
}

const intelliBanLocation = "https://raw.githubusercontent.com/Alex4386/turnoff-namuwiki/master/intelliBan/rules.json";
const blockedLocation = "https://raw.githubusercontent.com/Alex4386/turnoff-namuwiki/master/filter/blockedSites.json";

async function updateIntelliBan(config, url) {
  if (typeof url === "undefined") {
    if (config.intelliBan === undefined) {config.intelliBan = {};}
    if (!config.intelliBan.url) {
        config.intelliBan.url = intelliBanLocation;
        url = config.intelliBan.url;
    } else {
        url = config.intelliBan.url
    }
  } else {
    if (url === "") {
      config.intelliBan.url = intelliBanLocation;
      url = config.intelliBan.url;
    }
  }

  const data = await fetch(config.intelliBan.url);
  if (data.status === 200) {
    config.intelliBan.rules = await data.json();
    console.log("Got intelliBan: ", config.intelliBan.rules);
  }

  if (config.intelliBan.rules === undefined) {
    config.intelliBan.rules = [];
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