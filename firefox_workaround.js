/**
 * Firefox Workaround for turnoff-namuwiki
 */

const fs = require('fs');
const res = JSON.parse(fs.readFileSync('manifest.json'));
const serviceWorker = res.background?.service_worker;

res.background = {
  scripts: [serviceWorker],
}

fs.writeFileSync('manifest.json', JSON.stringify(res, null, 2));
