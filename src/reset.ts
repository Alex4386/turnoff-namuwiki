
showVersion();

document.getElementById("reset-button").addEventListener("click", async () => {
  const reallyContinue = confirm("정말로 Turnoff-namuwiki의 전체 설정을 초기화 하시겠습니까?");
  if (reallyContinue) {
    await browser.storage.sync.clear();
    alert("초기화가 완료되었습니다.");
  }
})

