let config: ConfigInterface;

function showVersion() {
  const manifestData = browser.runtime.getManifest();
  const versionText = escapeHtml("ver." + manifestData.version);

  const showOriginalVersionText = () => {
    document.getElementById('extension_version').innerHTML = versionText;
  }

  document.getElementById('extension_version').innerHTML = versionText;
  document.getElementById('extension_version').addEventListener("click", (e) => {
    fetch(browser.extension.getURL('production_ver.txt')).then(
      (data) => {
        if (data.status === 200) {
          data.text().then((text) => {
            document.getElementById('extension_version').innerHTML = escapeHtml("Prod. "+text);

            setTimeout(showOriginalVersionText, 2000);
          });
        }
      }).catch(() => {
        fetch(browser.extension.getURL('ci_build_ver.txt')).then(
          (data) => {
            if (data.status === 200) {
              data.text().then((text) => {
                document.getElementById('extension_version').innerHTML = escapeHtml("CI. "+text);

                setTimeout(showOriginalVersionText, 2000);
              });
            }
          }
        ).catch(() => {
          document.getElementById('extension_version').innerHTML = escapeHtml("Dev ver.");

          setTimeout(showOriginalVersionText, 2000);
        })
      });
  });
}

function getData(config: any, text: string) {
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

function setData(config: any, text: string, value: any) {
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

async function loadBlocked(): Promise<JSONBlockedSites[]> {
  return (await fetch("/filter/blockedSites.json")).json() as unknown as JSONBlockedSites[];
}

async function loadBlockedGroups(): Promise<string[]> {
  const blocked = await loadBlocked();
  const groups: string[] = [];

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

async function loadRedirected(): Promise<JSONRedirectedSites[]> {
  return (await fetch("/filter/redirectedSites.json")).json() as unknown as JSONRedirectedSites[];
}

function setHook(chkbox: HTMLInputElement[], callback?: (config: ConfigInterface) => any) {
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
                if (typeof callback !== "undefined") callback(config as ConfigInterface);
                console.log("updated", config);
            }
        )  
    }
}

const intelliBanLocation = "https://raw.githubusercontent.com/Alex4386/turnoff-namuwiki/master/intelliBan/rules.json";
const blockedLocation = "https://raw.githubusercontent.com/Alex4386/turnoff-namuwiki/master/filter/blockedSites.json";

async function updateIntelliBan(config: ConfigInterface, url?: string) {
    if (typeof url === "undefined") {
      if (config.intelliBan === undefined) {config.intelliBan = {} as any;}
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

async function updateBlocked(config: ConfigInterface, url?: string) {
  if (typeof url === "undefined") {
    if (config.blocked === undefined) {config.blocked = {} as any;}
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

async function saveData(thisConfig: ConfigInterface) {
    try {
        await browser.storage.sync.set(thisConfig);
        console.log(`저장 완료. ${JSON.stringify(config)}`);
    } catch (e) {
        console.error(`저장 실패. ${JSON.stringify(config)}`);
    }
}

