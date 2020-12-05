(async () => {
  try {
      const config = await browser.storage.sync.get() as unknown as ConfigInterface;
      console.log(`로드 완료. ${JSON.stringify(config)}`);

      let blocked_url = "#";

      const blocked_queries = parseUrl(location.href);
      console.log(blocked_queries);

      for (const query of blocked_queries) {
        if (query.name === "banned_url") {
          blocked_url = (typeof query.value !== "undefined") ? query.value : "#";
        }
      }

      let blocked_base_url = blocked_url.split('?')[0].toLowerCase();

      const blockedSites = await (await fetch("/filter/blockedSites.json")).json() as JSONBlockedSites[];

      const accessingToSites = blockedSites.filter(a => blocked_base_url.includes(a.baseURL));
  
      let accessingTo = "나무위키(?)";
      let length = 0;
      for (const accessingToSite of accessingToSites) {
        if (accessingToSite.baseURL.length > length) {
          accessingTo = accessingToSite.name === undefined ? accessingToSite.baseURL : accessingToSite.name;
        }
      }
      
      if (config.bannedPage !== undefined) {
        if (config.bannedPage.message !== "" && config.bannedPage.message !== undefined) {
          document.getElementById("message").innerHTML = escapeHtml(config.bannedPage.message);
        } else {
          document.getElementById("message").innerHTML = `<p id="message">${accessingTo} 접속시도가 감지되어 <span class="important">강제 종료</span>합니다.</p>`;
        }

        if (config.bannedPage.retry) {
          (document.getElementById('wanna_access') as HTMLAnchorElement).innerHTML = `
            ${accessingTo} 접속을 원하는 경우 차단을 비활성화 한 이후 <a href="${blocked_url}">여기</a> 를 클릭하세요. 
          `;
        }
      } else {
        document.getElementById("message").innerHTML = `<p id="message">${accessingTo} 접속시도가 감지되어 <span class="important">강제 종료</span>합니다.</p>`;
      }
  } catch (e) {
      console.error(`로드 실패.`);
  }
})();
