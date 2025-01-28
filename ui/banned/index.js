(async () => {
  try {
      const config = await browser.storage.sync.get();
      console.log(`로드 완료. ${JSON.stringify(config)}`);

      let blocked_url = "#";
      let accessingTo = "나무위키(?)";

      const blocked_queries = parseUrl(location.href);
      console.log(blocked_queries);

      for (const query of blocked_queries) {
        if (query.name === "banned_url") {
          blocked_url = (typeof query.value !== "undefined") ? query.value : "#";
        } else if (query.name === "site_name") {
          accessingTo = (typeof query.value !== "undefined") ? query.value : "나무위키(?)";
          // if it is urlencoded
          accessingTo = decodeURIComponent(accessingTo);
        }
      }

      document.title = accessingTo + " 접근 차단 안내 - turnoff-namuwiki";
      
      if (config.bannedPage !== undefined) {
        if (config.bannedPage.message !== "" && config.bannedPage.message !== undefined) {
          document.getElementById("message").innerHTML = escapeHtml(config.bannedPage.message);
        } else {
          document.getElementById("message").innerHTML = `<p id="message">${accessingTo} 접속시도가 감지되어 <span class="important">강제 종료</span>합니다.</p>`;
        }

        if (config.bannedPage.retry) {
          (document.getElementById('wanna_access')).innerHTML = `
            ${accessingTo} 접속을 원하는 경우 설정에서 차단을 비활성화 한 이후 <a href="${blocked_url}">여기</a> 를 클릭하세요. 
          `;
        } else {
          (document.getElementById('wanna_access')).innerHTML = `
            Tip: ${accessingTo} 에 접속이 필요한 경우, 상세 설정에서 "재시도 링크 추가" 를 사용하면 필요할 때 차단해제 후 재접속을 쉽게 할 수 있습니다.
          `;
        }
      } else {
        document.getElementById("message").innerHTML = `<p id="message">${accessingTo} 접속시도가 감지되어 <span class="important">강제 종료</span>합니다.</p>`;
      }
  } catch (e) {
      console.error(`로드 실패.`, e);
  }
})();
