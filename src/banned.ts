import { escapeHtml, parseUrl } from './util/util';
(async () => {
  const config = await browser.storage.sync.get() as unknown as ConfigInterface;
  try {
    console.log(`로드 완료. ${JSON.stringify(config)}`);

    const accessingTo = config.namuLiveBlock ? "나무위키 또는 나무라이브, 나무뉴스" : "나무위키";

    if (typeof config.bannedPageMessage !== "undefined") {

      if (config.bannedPageMessage !== "") {
        document.getElementById("message").innerHTML = escapeHtml(config.bannedPageMessage);
      } else {
        document.getElementById("message").innerHTML = `<p id="message">${accessingTo} 접속시도가 감지되어 <span class="important">강제 종료</span>합니다.</p>`;
      }
    } else {
      document.getElementById("message").innerHTML = `<p id="message">${accessingTo} 접속시도가 감지되어 <span class="important">강제 종료</span>합니다.</p>`;
    }

    if (typeof config.bannedPageRetry !== "undefined") {
      if (config.bannedPageRetry) {
        const blocked_queries = parseUrl(location.href);
        let blocked_url = "#";

        console.log(blocked_queries);

        for (const query of blocked_queries) {
          if (query.name === "banned_url") {
            blocked_url = (typeof query.value !== "undefined") ? query.value : "#";
          }
        }

        (document.getElementById('wanna_access') as HTMLAnchorElement).innerHTML = `
나무위키 접속을 원하는 경우 차단을 비활성화 한 이후 <a href="${blocked_url}">여기</a> 를 클릭하세요. 
          `;
      }
    }
  } catch (e) {
    console.error(`로드 실패. ${JSON.stringify(config)}`);
  }
})();
