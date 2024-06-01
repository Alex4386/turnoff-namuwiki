
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

try {
  showVersion();
} catch(e) {}
