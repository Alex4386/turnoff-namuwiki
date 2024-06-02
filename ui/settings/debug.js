
const data = document.getElementById("dump");
async function dumpData() {
  data.innerHTML = JSON.stringify(await browser.storage.sync.get(), null, 2);
}

browser.storage.onChanged.addListener(async () => {
  await dumpData();
});

dumpData();