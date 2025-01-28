## Table of Contents

* [English](#English)
  * [This extension/add-on is for...](#This-extensionadd-on-is-for)
  * [What's this?](#whats-this)
  * [How to Install](#how-to-install)
    * [Mozilla Firefox](#mozilla-firefox-1)
    * [Google Chrome (or Chromium)](#google-chrome-or-chromium-1)
    * [New Microsoft Edge (= Chromium)](#new-microsoft-edge-1)
  * [How to Package](#how-to-package)


## English
### What's this?
It redirects you to journal webpages (ex. DBpia, RISS, arXiv, Google Scholar) by configuration.  

### How to Install

#### Mozilla Firefox
It's now available at Firefox Add-ons! [Turnoff-NamuWiki](https://addons.mozilla.org/en-US/firefox/addon/turnoff-namuwiki/)  
**This is the recommended browser for using this add-on/extension**  

Do you want to test some latest feature? follow this directions!  
1. Clone this repository.
2. In order to install its dependencies, Run `yarn install` command.
3. To build, Use command `yarn build` to compile TypeScript code.
4. Run `node ./firefox_workaround.js`.
5. Open firefox menu and select Add-ons.
6. Select the gear icon and click Debug Add-ons.
7. Check Debug Add-ons, and click Load Temporary Add-ons.
8. Go to cloned repository and select manifest.json.
9. You can use the Turnoff-NamuWiki icon for configuration.

#### Google Chrome (or Chromium)
It is now available at Chrome Web Store! [Turnoff-NamuWiki](https://chrome.google.com/webstore/detail/turn-off-namuwiki/dgdifdnmamleoebgfbfeckefhhhplmdn/related?hl=en)  
Due to Google Chrome's slow extension examination, It might delayed up to 3 days for every updates.

Do you want to test some latest feature? follow this directions!  
1. Clone this repository.
2. In order to install its dependencies, Run `yarn install` command.
3. To build, Use command `yarn build` to compile TypeScript code.
4. Go to Chrome/Chromium's extension page (chrome://extensions).
5. Enable Developer mode at top-right corner.
6. Click [Load Unpacked Extension...].
7. Select the entire repository (Where manifest.json is located)
8. You can use the Turnoff-NamuWiki icon for configuration.

### How to Package

Currently Auto-Packaging is only supported on Linux and macOS systems.   
Please instanll dependency `zip` before you follow the instruction.  

1. Clone this repository
2. In order to install its dependencies, Run `npm install` or `yarn install` command.
3. To build a package, Use command `npm run build-package` or `yarn build-package` to compile TypeScript code and make a zip and xpi file.
4. Check the file `turnoff-namuwiki.zip`, `turnoff-namuwiki@alex4386.us.xpi` in the repository.

### Contribution Guide
See [CONTRIBUTORS.md](CONTRIBUTORS.md) for more information. (Korean)

