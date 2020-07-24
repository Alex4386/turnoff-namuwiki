import { showVersion, setHook, updateIntelliBan } from './util'
const full_settings = [
  document.getElementById('riss_auto'),
  document.getElementById('dbpia_auto'),
  document.getElementById('arxiv_auto'),
  document.getElementById('googlescholar_auto'),
  document.getElementById('wikipedia_auto'),
  document.getElementById('dbpia_proxy'),
  document.getElementById('intelliBan_url'),
  document.getElementById('banned_page_message'),
  document.getElementById('banned_page_retry'),
];


showVersion();

(async () => {
  let config = await browser.storage.sync.get() as unknown as ConfigInterface;
  try {
    console.log(`로드 완료. ${JSON.stringify(config)}`);
    setHook(full_settings as HTMLInputElement[], (config) => {
      updateIntelliBan(config, (document.getElementById('intelliBan_url') as HTMLInputElement).value);
    });
  } catch (e) {
    alert(e);
    console.error(`로드 실패. ${JSON.stringify(config)}`);
  }
})();
