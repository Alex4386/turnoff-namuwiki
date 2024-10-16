![splash](res/marketplace/marquee-tile.png)  

# turnoff-namuwiki
**자료조사, 조별과제의 지뢰, 나무위키를 꺼드립니다.**  
NOW POWERED BY **MANIFEST V3**    
![turnoff-namuwiki CI](https://github.com/Alex4386/turnoff-namuwiki/workflows/turnoff-namuwiki%20CI/badge.svg)  

> [!NOTE]  
> **확장 프로그램 심사** 상의 지연시간으로 인해 배포는 다음 순서대로 진행됩니다.  
> Firefox<sup>*</sup> -> Chrome -> Whale  
>   
> 해당 지원팀에서 심사가 늦는 건으로 인한 사항으로 지금 당장 즉시 적용을 원하는 경우 [`Release`](https://github.com/Alex4386/turnoff-namuwiki/releases) 에서 다운받아 Sideload 하세요.  
> <sub>* Firefox의 경우 현재 `background.Service_worker` 미 지원으로 인해 ManifestV3 지원을 위한 소스코드 추가 작업이 필요합니다. 작업 완료시일까지 Firefox 버전은 업데이트가 지연되오니 참고 바랍니다. [mozilla/web-ext#2532](https://github.com/mozilla/web-ext/issues/2532)</sub>

<h2 align="center">🎉 <b>경</b> 방송통신심의위원회, 나무위키 차단 의결 <b>축</b></h2>
turnoff-namuwiki는 문서 "배포/수정 라이선스 위반" 및 "사생활 초상 노출" 의 본거지인 나무위키의 사이트 전역차단을 기원합니다.

## Table Of Contents
* [한국어](#한국어)
  * [이런 분들께 추천드립니다!](#이런-분들께-추천드립니다)  
  * [이게 무엇인가요?](#이게-무엇인가요)
  * [설치 방법](#설치-방법)
    * [Mozilla Firefox](#mozilla-firefox)
    * [Google Chrome (or Chromium)](#google-chrome-or-chromium)
    * [New Microsoft Edge (= Chromium)](#new-microsoft-edge)
    * [Naver Whale (also, Chromium)](#naver-whale)
  * [기여자를 위한 개발 문서](#기여자를-위한-개발-문서)
  * [패키징 방법](#패키징-방법)
* [English](#English)
  * [This extension/add-on is for...](#This-extensionadd-on-is-for)
  * [What's this?](#whats-this)
  * [How to Install](#how-to-install)
    * [Mozilla Firefox](#mozilla-firefox-1)
    * [Google Chrome (or Chromium)](#google-chrome-or-chromium-1)
    * [New Microsoft Edge (= Chromium)](#new-microsoft-edge-1)
  * [How to Package](#how-to-package)
* [TODO](#TODO)
* [For Firefox Add-on Team](#for-firefox-add-on-team)
* [License](#License)

## 한국어
### 이런 분들께 추천드립니다!
* 꼭 조별과제 때 마다 출처: 나무위키 쓰시는 분
* 논문 검색해야 하는 데, 나도 모르게 나무위키 들어가시는 분
* 일반인이라 굳이 논문까지는 필요 없으신 분  
* 이제 조사해야 하는 데, 네이버와 구글에서 이제 나무위키 나오기 시작해서 빡치시는 분  
![저희는 갓반인이라 굳이 논문까지 보지 않아도 알 수 있습니다](https://user-images.githubusercontent.com/27724108/58348249-1d699480-7e9b-11e9-8c94-a351989ba076.gif)

### 이게 무엇인가요?
자료조사, 조별과제의 지뢰, 나무위키를 꺼드립니다.  

나무위키, 안 그래도 정확도 떨어지는 뇌피셜 범벅인데, 데이터가 사실로 잘 바뀌지도 않으며, 한 기업체의 라이선스 위반을 통한 수익 창출 플랫폼입니다.  

문제는 저 위키가 한국 내 트래픽 비중이 높아, 저런 뇌피셜들이 정말로 정확도를 추구해야 하는 내용들에도 침범하기 시작했습니다.  

이 브라우저 확장은 당신이 리포트에 출처: 나무위키 를 적는 불상사를 막기 위해 개발 되었습니다.  

또한, 실수로 나무위키에 접속하는 경우, 관련 논문 웹페이지나 정보페이지로 대신 접속됩니다.  

### 설치 방법

#### Mozilla Firefox
> [!WARNING]  
> **ManifestV3 대응 코드가 `background.Service_Worker` 를 사용하는 관계로 Firefox 대응을 위해 추가 리팩토링이 필요합니다.**  
> `v1.x` 의 Firefox 포팅의 경우 **추가 시간이 소요 되므로 양해 바랍니다.**  

파이어폭스 애드온 스토어에 올렸습니다! [파이어폭스 스토어](https://addons.mozilla.org/en-US/firefox/addon/turnoff-namuwiki/)  
**최대한 빠른 업데이트를 위해 Mozilla Firefox 버전을 권장합니다** 

신기능을 누구보다 빠르게 테스트 해보고 싶으시다고요? 아래 방법을 사용하세요!  
1. 이 레포지토리를 클론합니다.
2. 레포지토리의 의존성을 설정하기 위해, `npm install` 또는 `yarn install` 명령을 실행합니다.
3. 레포지토리의 터미널에서 `npm run build` 또는 `yarn build` 명령을 통해 TypeScript 코드를 빌드합니다.
4. 파이어폭스의 메뉴를 열고 확장기능 (Add-ons)을 선택합니다.
5. 우측 상단의 톱니바퀴를 누르고 확장기능 디버그 (Debug Add-ons) 를 선택합니다.
6. 확장기능 디버깅하기를 체크하고, 임시 확장기능 로드 버튼을 누릅니다.
7. 앞에서 클론한 폴더로 들어가 manifest.json을 선택합니다.
8. 확장프로그램 섹션의 아이콘을 클릭해 익스텐션의 상세 설정을 할 수 있습니다.
  
#### Google Chrome (or Chromium)
크롬 익스텐션 스토어에 올렸습니다! [Turnoff-NamuWiki](https://chrome.google.com/webstore/detail/turn-off-namuwiki/dgdifdnmamleoebgfbfeckefhhhplmdn/related?hl=en)  
Firefox 에 비해선 릴리즈가 늦습니다. Google 에서는 Firefox 처럼 소스코드 업로드를 할 수 있는 부분이 없어 검수가 오래 걸려 늦는 것 같습니다.

신기능을 누구보다 빠르게 테스트 해보고 싶으시다고요? 아래 방법을 사용하세요!  
1. 이 레포지토리를 클론합니다.
2. 레포지토리의 의존성을 설정하기 위해, `npm install` 또는 `yarn install` 명령을 실행합니다.
3. 레포지토리의 터미널에서 `npm run build` 또는 `yarn build` 명령을 통해 TypeScript 코드를 빌드합니다.
4. 크롬의 확장 프로그램 페이지(chrome://extensions)로 들어갑니다
5. 우측 상단의 개발자모드를 활성화 합니다.
6. [압축해제된 확장프로그램을 로드합니다.] 를 클릭합니다.
7. 앞에서 클론한 폴더를 선택합니다. (레포 전체, manifest.json 이 위치한 곳)
8. 확장프로그램 섹션의 아이콘을 클릭해 익스텐션의 상세 설정을 할 수 있습니다.

#### Microsoft Edge
Chromium 기반의 Microsoft Edge (EdgeHTML2) 의 경우,   
[Google Chrome (or Chromium)](#google-chrome-or-chromium) 문서를 따라 작업해 주시면 됩니다.  

설치 시, 상단 바에서 [다른 스토어 확장 허용] 을 눌러 주시면, 크롬 스토어에서 설치 할 수 있습니다.

#### Naver Whale
> [!WARNING]  
> 네이버 Whale 사용자의 편의를 위해 추가적으로 업로드한 확장으로,  
> Whale 스토어의 경우 검수가 늦으므로 특이사항이 없는 경우 Google Chrome Web Store 버전을 권장합니다.  
> 
> Chrome Web Store 버전을 설치하려면 
[Google Chrome (or Chromium)](#google-chrome-or-chromium) 문서를 따라 작업해 주시면 됩니다.  

[Whale Store](https://store.whale.naver.com/detail/podgdjmlohilnlnailadkpjegigpflaj)

### 기여자를 위한 개발 문서
[CONTRIBUTORS.md](CONTRIBUTORS.md) 문서를 참고해 주세요!

### 패키징 방법

현재 자동 패키징은 macOS, Linux System 에서만 가능합니다.  
의존성으로 시스템 패키지 `zip` 이 설치되어있는 지 확인해 주세요.  

1. 이 레포지토리를 클론합니다.
2. 레포지토리의 의존성을 설정하기 위해, `npm install` 또는 `yarn install` 명령을 실행합니다.
3. 레포지토리의 터미널에서 `npm run build-package` 또는 `yarn build-package` 명령을 통해 TypeScript 코드를 빌드, 그리고 압축합니다. (자동으로 진행됨)
4. 레포지토리 안에 있는 `turnoff-namuwiki.zip`, `turnoff-namuwiki@alex4386.us.xpi` 파일을 확인합니다.

## English

### This extension/add-on is for...
* Who writes `Citation: NamuWiki` on group projects
* who goes to namuwiki when you need to search some journals
* Who needs no journal at all because you are just a normal person  
* Who needs to do research but the search results are filled with uncredible namuwiki docs.  
![No Journals Required, Class dismissed](https://user-images.githubusercontent.com/27724108/58348249-1d699480-7e9b-11e9-8c94-a351989ba076.gif)  
(Translation: I know that without viewing journals/papers because I am just a regular person!)

### What's this?
It redirects you to journal webpages (ex. DBpia, RISS, arXiv, Google Scholar) by configuration.  

### How to Install

#### Mozilla Firefox
It's now available at Firefox Add-ons! [Turnoff-NamuWiki](https://addons.mozilla.org/en-US/firefox/addon/turnoff-namuwiki/)  
**This is the recommended browser for using this add-on/extension**  

Do you want to test some latest feature? follow this directions!  
1. Clone this repository.
2. In order to install its dependencies, Run `npm install` or `yarn install` command.
3. To build, Use command `npm run build` or `yarn build` to compile TypeScript code.
4. Open firefox menu and select Add-ons.
5. Select the gear icon and click Debug Add-ons.
6. Check Debug Add-ons, and click Load Temporary Add-ons.
7. Go to cloned repository and select manifest.json.
8. You can use the Turnoff-NamuWiki icon for configuration.

#### Google Chrome (or Chromium)
It is now available at Chrome Web Store! [Turnoff-NamuWiki](https://chrome.google.com/webstore/detail/turn-off-namuwiki/dgdifdnmamleoebgfbfeckefhhhplmdn/related?hl=en)  
Due to Google Chrome's slow extension examination, It might delayed up to 3 days for every updates.

Do you want to test some latest feature? follow this directions!  
1. Clone this repository.
2. In order to install its dependencies, Run `npm install` or `yarn install` command.
3. To build, Use command `npm run build` or `yarn build` to compile TypeScript code.
4. Go to Chrome/Chromium's extension page (chrome://extensions).
5. Enable Developer mode at top-right corner.
6. Click [Load Unpacked Extension...].
7. Select the entire repository (Where manifest.json is located)
8. You can use the Turnoff-NamuWiki icon for configuration.

#### New Microsoft Edge
Since New Microsoft Edge is based on Chromium,  
You can install extensions from chrome store!

When you install, Please click [Allow Extensions from Other Stores] to install extensions from Google Chrome Store.  

### How to Package

Currently Auto-Packaging is only supported on Linux and macOS systems.   
Please instanll dependency `zip` before you follow the instruction.  

1. Clone this repository
2. In order to install its dependencies, Run `npm install` or `yarn install` command.
3. To build a package, Use command `npm run build-package` or `yarn build-package` to compile TypeScript code and make a zip and xpi file.
4. Check the file `turnoff-namuwiki.zip`, `turnoff-namuwiki@alex4386.us.xpi` in the repository.

## TODO
* IntelliBan Engine (powered by Firebase)
* Create an Issue for more Feature Requests!

## For Firefox Add-on Team

Please refer to [firefox_addon_team_README.md](firefox_addon_team_README.md) for more details on how to build the reproducable build on your system.  

## License
Distributed under MIT License  
Copyright &copy; Alex4386 and TurnOff-NamuWiki Contributors
