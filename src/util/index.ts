import { escapeHtml } from './util'
export const bgconsole = browser.extension.getBackgroundPage().console;

export function showVersion() {
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
            document.getElementById('extension_version').innerHTML = escapeHtml("Prod. " + text);

            setTimeout(showOriginalVersionText, 2000);
          });
        }
      }).catch(() => {
        fetch(browser.extension.getURL('ci_build_ver.txt')).then(
          (data) => {
            if (data.status === 200) {
              data.text().then((text) => {
                document.getElementById('extension_version').innerHTML = escapeHtml("CI. " + text);

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


export async function setHook(chkbox: HTMLInputElement[], callback?: (config: ConfigInterface) => any) {
  let config = await browser.storage.sync.get() as unknown as ConfigInterface;
  for (const chk of chkbox) {
    const datasetVal = chk.dataset.val as keyof ConfigInterface;
    console.debug(datasetVal);
    if (typeof config[datasetVal] !== "undefined") {
      if (chk.type === "checkbox") {
        chk.checked = config[datasetVal] as boolean;
      } else if (chk.type === "text" || chk.type === "url") {
        chk.value = config[datasetVal].toString() || '';
      }
      chk.addEventListener(
        "change",
        async () => {
          console.log("hook triggered at ", chk);
          if (chk.type === "checkbox") {
            (config[datasetVal] as boolean) = chk.checked;
          } else if (chk.type === "text" || chk.type === "url") {
            (config[datasetVal] as string) = chk.value;
          }
          await saveData(config);
          if (typeof callback !== "undefined") callback(config as ConfigInterface);
        }
      )
    } else {
      chk.addEventListener(
        "change",
        async () => {
          console.log("hook triggered at ", chk);
          if (chk.type === "checkbox") {
            (config[datasetVal] as boolean) = chk.checked;
          } else if (chk.type === "text" || chk.type === "url") {
            (config[datasetVal] as string) = chk.value;
          }
          await saveData(config);
          if (typeof callback !== "undefined") callback(config as ConfigInterface);
        }
      );
    }

  }
}

export async function updateIntelliBan(config: ConfigInterface, url?: string) {
  if (typeof url === "undefined") {
    if (!config.intelliBanUrl) {
      config.intelliBanUrl = "https://raw.githubusercontent.com/Alex4386/turnoff-namuwiki/master/intelliBan/rules.json";
      url = config.intelliBanUrl;
    } else {
      url = config.intelliBanUrl
    }
  } else {
    if (url === "") {
      config.intelliBanUrl = "https://raw.githubusercontent.com/Alex4386/turnoff-namuwiki/master/intelliBan/rules.json";
      url = config.intelliBanUrl;
    }
  }

  const data = await fetch(config.intelliBanUrl);
  if (data.status === 200) {
    config.intelliBanRules = await data.json();
  }

  if (config.intelliBanRules === undefined) {
    config.intelliBanRules = [];
  }

  await saveData(config);
}

export async function saveData(thisConfig: ConfigInterface) {
  try {
    await browser.storage.sync.set(thisConfig);
    bgconsole.log(`저장 완료. ${JSON.stringify(thisConfig)}`);
  } catch (e) {
    bgconsole.error(`저장 실패. ${JSON.stringify(thisConfig)}`);
  }
}

