# FOR CONTRIBUTORS
turnoff-namuwiki 기여에 관심 가져 주셔서 감사합니다.  
이 문서는 이 extension이 어떻게 작동하는 지에 대해 설명합니다.  

## Dev Stacks
* TypeScript
* WebExtensions

## Limitations
1. 브라우저 엔진의 한계로 인해 nodeJS 처럼 Import를 할 수는 없습니다. 모듈로 최대한 나누고 싶지만 bg.ts 에 모든 로직이 몰빵되어있는 것은 이것이 원인입니다.    
2. WebExtensions 에 명시되지 않은 Platform-Specific 기능은 사용하기 어렵습니다. 해당 내용에 대해서는 Mozilla Web Docs 를 참고해 주시면 감사하겠습니다.  
## "Wontadd" Features
다음과 같은 기능의 경우, 대체 방안을 제시 하지 않을 경우 추가가 어렵습니다.  
* Firefox, Chrome Extension Store 심사에 저촉 될 수 있는 내용
  turnoff-namuwiki의 크롬 익스텐션 사용자가 40명을 넘음에 따라, 추후 버전이 Extension Store에 업로드가 불가능 한 경우 제안하신 기능의 추가가 어려우실 수 있습니다. 해당 경우 이 레포지토리의 포크판을 만들어서 직접 코드를 작성하시면 감사하겠습니다.  
  해당 가이드라인에서 대표적으로 unescaped html injection 등을 제한하고 있는점 양해 부탁드립니다. [예제](https://github.com/Alex4386/turnoff-namuwiki/issues/26#issuecomment-604814122)  

## Code Structure
* src/ : 타입스크립트 코드의 위치입니다.
  * src/bg.ts : 핵심 차단 로직이 이곳에서 실행됩니다.  
  * src/popup.ts : turnoff-namuwiki의 아이콘을 눌렀을 때 뜨는 인터페이스의 코드입니다.
  * src/filter/ : 웹 사이트 별 필터 로직입니다. 구동 원리는 해당 웹페이지가 정규식으로 인식되는 경우, 해당 웹페이지를 표시하고 있는 tab에 해당 스크립트가 inject 됩니다.
  * src/interfaces : 코드 전역에서 사용하는 타입스크립트 인터페이스를 저장합니다.
* lib/ : 일반적인 경우에는 존재하지 않지만, 컴파일 하면 생성됩니다.  
* polyfill/ : WebExtensions 를 이용하여 Cross-Browser Extension을 제공하기 위해 저장된 polyfill 공간입니다.
