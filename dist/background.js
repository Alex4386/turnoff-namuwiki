/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background.ts":
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_config_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/config/index */ "./src/common/config/index.ts");
/* harmony import */ var _common_initializer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/initializer */ "./src/common/initializer.ts");
/* harmony import */ var _common_adblocks_namuwiki__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/adblocks/namuwiki */ "./src/common/adblocks/namuwiki.ts");
/* harmony import */ var _common_intelliBan_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/intelliBan/index */ "./src/common/intelliBan/index.ts");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/utils */ "./src/common/utils.ts");
/* harmony import */ var _common_rules_redirect__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./common/rules/redirect */ "./src/common/rules/redirect.ts");
/* harmony import */ var _common_rules_enabled__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./common/rules/enabled */ "./src/common/rules/enabled.ts");
/* harmony import */ var _searchFilters_runner__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./searchFilters/runner */ "./src/searchFilters/runner.ts");
/* harmony import */ var _common_rules_block__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./common/rules/block */ "./src/common/rules/block.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};










/* = Tab Context Save = */
const previousTabUrls = [];
const syncData = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0,_common_initializer__WEBPACK_IMPORTED_MODULE_2__.loadAll)();
    const config = (0,_common_config_index__WEBPACK_IMPORTED_MODULE_1__.getConfig)();
    yield updateDynamicRules(config);
});
const updateDynamicRules = (config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_5__.isNamuLiveBlocked)(config)) {
        yield (0,_common_adblocks_namuwiki__WEBPACK_IMPORTED_MODULE_3__.reregisterDynamicRules)(_common_adblocks_namuwiki__WEBPACK_IMPORTED_MODULE_3__.namuLiveBlockers);
    }
    else {
        yield (0,_common_adblocks_namuwiki__WEBPACK_IMPORTED_MODULE_3__.unregisterDynamicRules)(_common_adblocks_namuwiki__WEBPACK_IMPORTED_MODULE_3__.namuLiveBlockers);
    }
    if ((_a = config === null || config === void 0 ? void 0 : config.adblock) === null || _a === void 0 ? void 0 : _a.namuwiki) {
        yield (0,_common_adblocks_namuwiki__WEBPACK_IMPORTED_MODULE_3__.reregisterDynamicRules)(_common_adblocks_namuwiki__WEBPACK_IMPORTED_MODULE_3__.adBlockers);
    }
    else {
        yield (0,_common_adblocks_namuwiki__WEBPACK_IMPORTED_MODULE_3__.unregisterDynamicRules)(_common_adblocks_namuwiki__WEBPACK_IMPORTED_MODULE_3__.adBlockers);
    }
});
/* = On Install = */
webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.onInstalled.addListener(syncData);
/* = config update listener = */
webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.onChanged.addListener(syncData);
/* = NamuWiki Block Logic = */
webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.onUpdated.addListener((tabId, info, tab) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const config = (_b = (0,_common_config_index__WEBPACK_IMPORTED_MODULE_1__.getConfig)()) !== null && _b !== void 0 ? _b : yield (0,_common_config_index__WEBPACK_IMPORTED_MODULE_1__.loadConfig)();
    let rules = (0,_common_rules_enabled__WEBPACK_IMPORTED_MODULE_7__.getActiveRulesFromConfig)(config);
    if (!rules) {
        yield (0,_common_rules_block__WEBPACK_IMPORTED_MODULE_9__.loadBlockRules)();
        rules = (_c = (0,_common_rules_enabled__WEBPACK_IMPORTED_MODULE_7__.getActiveRulesFromConfig)(config)) !== null && _c !== void 0 ? _c : [];
    }
    const url = info.url || tab.url;
    // Save previous URL
    const previousTabUrl = previousTabUrls[tabId];
    if (url && info.status === 'complete')
        previousTabUrls[tabId] = url;
    if (url) {
        // run search filter
        if (config.searchFilter) {
            try {
                if (tab.id) {
                    yield webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().scripting.executeScript({
                        target: { tabId: tab.id },
                        func: _searchFilters_runner__WEBPACK_IMPORTED_MODULE_8__.runSearchFilterRoutine,
                        args: [rules],
                    });
                }
            }
            catch (e) {
                console.error('Oops. The Big Famous Constant E: ', e);
            }
        }
        const matchingRule = rules.find(rule => rule.isInSite(url));
        if (matchingRule) {
            console.log('rule matched:', matchingRule);
            const query = matchingRule.getQuery(url);
            console.log('query:', query);
            if (!info.url) {
                console.log('info', info);
                if (info.status !== 'complete') {
                    console.log('Prevent Triggered Twice');
                    return;
                }
            }
            if (query) {
                // debounce: if the previous url is same,
                // do not trigger the ban.
                if (previousTabUrl) {
                    const prevQuery = matchingRule.getQuery(previousTabUrl);
                    if (prevQuery === query) {
                        console.log('Debounced');
                        return;
                    }
                }
                // Skip ban if query is intelliBan
                if ((0,_common_intelliBan_index__WEBPACK_IMPORTED_MODULE_4__.checkIfIntelliBanPass)(query)) {
                    return;
                }
                yield webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.update(tabId, {
                    url: webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getURL(`ui/banned/index.html?banned_url=${url}&site_name=${matchingRule.name}`),
                });
                if (matchingRule.isArticleView(url)) {
                    const targetUrls = (0,_common_rules_redirect__WEBPACK_IMPORTED_MODULE_6__.handleRedirects)(url);
                    if (targetUrls.length > 0) {
                        const targetUrl = targetUrls[0];
                        yield webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.create({
                            url: targetUrl,
                        });
                    }
                }
            }
        }
        previousTabUrls[tabId] = url;
    }
}));


/***/ }),

/***/ "./src/common/adblocks/namuwiki.ts":
/*!*****************************************!*\
  !*** ./src/common/adblocks/namuwiki.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adBlockers: () => (/* binding */ adBlockers),
/* harmony export */   namuLiveBlockers: () => (/* binding */ namuLiveBlockers),
/* harmony export */   reregisterDynamicRules: () => (/* binding */ reregisterDynamicRules),
/* harmony export */   unregisterDynamicRules: () => (/* binding */ unregisterDynamicRules)
/* harmony export */ });
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/**
 * Why AdBlock NamuWiki?
 *
 * Contents of namuwiki is distributed under Creative Commons-BY-NC-SA License.
 * which DOESN'T allow webpage to create their ad-revenue or sell the content
 * with their content, BUT, Current owner of namuwiki is literally *selling*
 * content by violating namuwiki's license before acquisition (even they are
 * still using CC-BY-NC-SA License).
 *
 * That's totally giving content creators a fuck. But many people are not using
 * ad-block to support the creators, and actually, Namuwiki is still in the
 * Acceptable-Ads lists.
 *
 * which is un-acceptable for me entirely because they are earning their
 * ad-revenue by copyright infringement.
 *
 * From Version 0.6.0, I am boycotting namuwiki's ad-revenue system by
 * blocking them entirely.
 *
 * FUCK YOU, umanle corporation.
 */
const adBlockers = [
    {
        id: 10001,
        priority: 1,
        action: {
            type: "block"
        },
        condition: {
            /*
              {
                  urls: [
                      "https://*.googlesyndication.com/*",
                      "https://*.doubleclick.net/*",
                      "https://adservice.google.com/*",
                      "https://arca.live/api/ads*",
                      "https://searchad-phinf.pstatic.net/*",
                      "https://ssl.pstatic.net/adimg3.search/*",
                      "https://www.google.com/adsense/search/*",
                      "https://www.google.com/afs/ads*"
                  ]
              },
            */
            regexFilter: "^https:\/\/(\*\.googlesyndication\.com\/|\*\.doubleclick\.net\/|adservice\.google\.com\/|arca\.live\/api\/ads|searchad-phinf\.pstatic\.net\/|\*\.ssl\.pstatic\.net\/adimg3\.search\/|www\.google\.com\/adsense\/search\/|www\.google\.com\/afs\/ads).*",
            initiatorDomains: ["*://*.namu.wiki/*", "*://*.namu.mirror.wiki/*", "*://*.namu.news/*"],
        },
    }
];
const namuLiveBlockers = [
    {
        id: 20001,
        priority: 1,
        action: {
            type: "block"
        },
        condition: {
            /*
              {
                  urls: [
                      "https://search.namu.wiki/api/ranking",
                      "https://arca.live/*",
                      "https://namu.news/*",
                      "https://namu.news/api/articles/cached",
                  ]
              },
            */
            regexFilter: "^https:\/\/(search\.namu\.wiki\/api\/ranking|arca\.live\/.*|namu\.news\/.*|namu\.news\/api\/articles\/cached).*",
        },
    }
];
function unregisterDynamicRules(rules) {
    return __awaiter(this, void 0, void 0, function* () {
        yield webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [...(rules !== null && rules !== void 0 ? rules : []).map(n => n.id)],
        });
    });
}
function reregisterDynamicRules(rules) {
    return __awaiter(this, void 0, void 0, function* () {
        yield unregisterDynamicRules(rules);
        yield webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().declarativeNetRequest.updateDynamicRules({
            addRules: rules,
        });
    });
}


/***/ }),

/***/ "./src/common/config/index.ts":
/*!************************************!*\
  !*** ./src/common/config/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getConfig: () => (/* binding */ getConfig),
/* harmony export */   loadConfig: () => (/* binding */ loadConfig),
/* harmony export */   updateConfig: () => (/* binding */ updateConfig)
/* harmony export */ });
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

let configCache;
/* = config update listener = */
webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.onChanged.addListener(() => __awaiter(void 0, void 0, void 0, function* () {
    yield loadConfig();
}));
function getConfig() {
    return configCache;
}
function loadConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        let thisConfig;
        do {
            thisConfig = (yield webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.sync.get(null));
            if (Object.keys(thisConfig).length === 0) {
                yield webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.sync.set({
                    blocked: { site: {}, group: {} },
                    redirected: {},
                    adblock: { namuwiki: false },
                    proxy: { dbpia: "" },
                    searchFilter: false,
                    intelliBan: { enabled: false, url: "", rules: [] },
                    bannedPage: { message: "", retry: false }
                });
            }
            configCache = thisConfig;
        } while (Object.keys(thisConfig).length === 0);
        return thisConfig;
    });
}
function updateConfig(thisConfig) {
    return webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.sync.set(thisConfig);
}


/***/ }),

/***/ "./src/common/global.ts":
/*!******************************!*\
  !*** ./src/common/global.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchRepo: () => (/* binding */ fetchRepo)
/* harmony export */ });
const basePath = 'https://raw.githubusercontent.com/Alex4386/turnoff-namuwiki/main/';
function getRepoURL(path) {
    return basePath + path;
}
function fetchRepo(input, init) {
    const isRepo = (init === null || init === void 0 ? void 0 : init.repo) || false;
    let url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (isRepo) {
        url = getRepoURL(url);
    }
    let newInput;
    // if it is a Request object, we need to copy the Request object
    if (input instanceof Request) {
        newInput = new Request(input, {
            body: input.body,
            headers: input.headers,
            method: input.method,
            mode: input.mode,
            credentials: input.credentials,
            cache: input.cache,
            redirect: input.redirect,
            referrer: input.referrer,
            referrerPolicy: input.referrerPolicy,
            integrity: input.integrity,
            keepalive: input.keepalive,
            signal: input.signal,
        });
    }
    else {
        if (typeof input === 'string') {
            newInput = url;
        }
        else {
            newInput = new URL(url);
        }
    }
    return fetch(newInput, init);
}


/***/ }),

/***/ "./src/common/initializer.ts":
/*!***********************************!*\
  !*** ./src/common/initializer.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadAll: () => (/* binding */ loadAll)
/* harmony export */ });
/* harmony import */ var _config_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config/index */ "./src/common/config/index.ts");
/* harmony import */ var _rules_ads__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rules/ads */ "./src/common/rules/ads.ts");
/* harmony import */ var _rules_block__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rules/block */ "./src/common/rules/block.ts");
/* harmony import */ var _rules_redirect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rules/redirect */ "./src/common/rules/redirect.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




function loadAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Promise.all([
                _config_index__WEBPACK_IMPORTED_MODULE_0__.loadConfig,
                _rules_ads__WEBPACK_IMPORTED_MODULE_1__.loadAdRules,
                _rules_redirect__WEBPACK_IMPORTED_MODULE_3__.loadRedirectionRules,
                _rules_block__WEBPACK_IMPORTED_MODULE_2__.loadBlockRules,
            ]);
        }
        catch (e) {
            console.error("Failed to loadAll:", e);
        }
    });
}


/***/ }),

/***/ "./src/common/intelliBan/index.ts":
/*!****************************************!*\
  !*** ./src/common/intelliBan/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkIfIntelliBanPass: () => (/* binding */ checkIfIntelliBanPass)
/* harmony export */ });
/* harmony import */ var _config_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/index */ "./src/common/config/index.ts");
/* harmony import */ var _regex_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../regex/index */ "./src/common/regex/index.ts");


function checkIfIntelliBanPass(query) {
    var _a;
    const config = (0,_config_index__WEBPACK_IMPORTED_MODULE_0__.getConfig)();
    if ((_a = config.intelliBan) === null || _a === void 0 ? void 0 : _a.enabled) {
        const rules = config.intelliBan.rules.filter(rule => rule).map(_regex_index__WEBPACK_IMPORTED_MODULE_1__.deserializeRegex);
        return rules.find(rule => rule.test(query));
    }
    return false;
}


/***/ }),

/***/ "./src/common/regex/index.ts":
/*!***********************************!*\
  !*** ./src/common/regex/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deserializeRegex: () => (/* binding */ deserializeRegex),
/* harmony export */   serializeRegex: () => (/* binding */ serializeRegex)
/* harmony export */ });
function serializeRegex(value) {
    return {
        regex: value.source,
        flag: value.flags
    };
}
function deserializeRegex(value) {
    if (typeof value === 'string') {
        return new RegExp(value);
    }
    return new RegExp(value.regex, value.flag);
}


/***/ }),

/***/ "./src/common/rules/ads.ts":
/*!*********************************!*\
  !*** ./src/common/rules/ads.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchOfflineAdTargets: () => (/* binding */ fetchOfflineAdTargets),
/* harmony export */   fetchOnlineAdTargets: () => (/* binding */ fetchOnlineAdTargets),
/* harmony export */   getAdTargets: () => (/* binding */ getAdTargets),
/* harmony export */   loadAdRules: () => (/* binding */ loadAdRules)
/* harmony export */ });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../global */ "./src/common/global.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

let adTargets;
function getAdTargets() {
    return adTargets;
}
function fetchOfflineAdTargets() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield (0,_global__WEBPACK_IMPORTED_MODULE_0__.fetchRepo)('/filter/namuAds.json');
        const res = yield data.json();
        if (Array.isArray(res)) {
            return res;
        }
        return [];
    });
}
function fetchOnlineAdTargets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0,_global__WEBPACK_IMPORTED_MODULE_0__.fetchRepo)('/filter/namuAds.json', { repo: true });
            const res = yield data.json();
            if (Array.isArray(res)) {
                return res;
            }
            return [];
        }
        catch (e) {
            return [];
        }
    });
}
function loadAdRules() {
    return __awaiter(this, void 0, void 0, function* () {
        if (adTargets === undefined) {
            let rules = yield fetchOfflineAdTargets();
            try {
                const onlineRules = yield fetchOnlineAdTargets();
                // merge offline and online rules
                // if there are any conflicts, online rules will take precedence
                const onlineRemoved = rules.filter(rule => !onlineRules.includes(rule));
                rules = [...onlineRemoved, ...onlineRules];
            }
            catch (e) {
                console.error("Failed to fetch online ad rules", e);
            }
            adTargets = rules;
        }
        return adTargets;
    });
}


/***/ }),

/***/ "./src/common/rules/block.ts":
/*!***********************************!*\
  !*** ./src/common/rules/block.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBlockRules: () => (/* binding */ getBlockRules),
/* harmony export */   getOnlineBlockRules: () => (/* binding */ getOnlineBlockRules),
/* harmony export */   loadBlockRules: () => (/* binding */ loadBlockRules),
/* harmony export */   serializeBlockRule: () => (/* binding */ serializeBlockRule)
/* harmony export */ });
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/index */ "./src/common/config/index.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../global */ "./src/common/global.ts");
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./model */ "./src/common/rules/model.ts");
/* harmony import */ var _regex_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../regex/index */ "./src/common/regex/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





let blockRulesCache;
/**
 * Fetches Rules from `/filter/blockedSites.json`
 * @returns {Promise<BlockedSite[]>} Rules
 */
function fetchLocalBlockRules() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield (0,_global__WEBPACK_IMPORTED_MODULE_2__.fetchRepo)("/filter/blockedSites.json", { repo: false });
        const res = yield data.json();
        if (Array.isArray(res)) {
            return res.map(_model__WEBPACK_IMPORTED_MODULE_3__.BlockedSite.fromSerialized);
        }
        return [];
    });
}
/**
 * Fetches Latest Rule data from GitHub Repository
 * @returns {Promise<BlockedSite[]>} Rules
 */
function fetchOnlineBlockRules() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const data = yield (0,_global__WEBPACK_IMPORTED_MODULE_2__.fetchRepo)("/filter/blockedSites.json", { repo: true });
        const res = yield data.json();
        const config = (_a = (0,_config_index__WEBPACK_IMPORTED_MODULE_1__.getConfig)()) !== null && _a !== void 0 ? _a : yield (0,_config_index__WEBPACK_IMPORTED_MODULE_1__.loadConfig)();
        if (Array.isArray(res)) {
            config.blocked.onlineRules = res;
            yield webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.sync.set(config);
            return res.map(_model__WEBPACK_IMPORTED_MODULE_3__.BlockedSite.fromSerialized);
        }
        return [];
    });
}
/**
 * Use the cache if available,
 * Else fetch the latest rules from GitHub Repository
 * (Can be used for sync)
 */
function getOnlineBlockRules() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let config = yield (0,_config_index__WEBPACK_IMPORTED_MODULE_1__.getConfig)();
        if (((_a = config === null || config === void 0 ? void 0 : config.blocked) === null || _a === void 0 ? void 0 : _a.onlineRules) === undefined) {
            try {
                yield fetchOnlineBlockRules();
                config = (0,_config_index__WEBPACK_IMPORTED_MODULE_1__.getConfig)();
            }
            catch (e) {
                console.error("Failed to fetch online block rules", e);
            }
            return [];
        }
        return config.blocked.onlineRules.map(_model__WEBPACK_IMPORTED_MODULE_3__.BlockedSite.fromSerialized);
    });
}
/**
 * Use cache if available,
 * otherwise fetches Rules from `/filter/redirectedSites.json`
 * @returns {Promise<RedirectTargetSite[]>} Rules
 */
function getBlockRules() {
    if (blockRulesCache === undefined) {
        // fetchBlockRules is required!!
        console.warn("Block Rules not fetched yet. Please call fetchBlockRules() first.");
        return undefined;
    }
    return blockRulesCache;
}
function loadBlockRules() {
    return __awaiter(this, void 0, void 0, function* () {
        const localRules = yield fetchLocalBlockRules();
        const onlineRules = yield getOnlineBlockRules();
        // merge two rules. but if there is duplicate on online,
        // remove the local one.
        const deduppedLocalRules = localRules.filter((l) => !onlineRules.find(n => n.id === l.id));
        blockRulesCache = [...onlineRules, ...deduppedLocalRules];
        return blockRulesCache;
    });
}
function serializeBlockRule(rule) {
    return {
        id: rule.id,
        group: rule.group,
        name: rule.name,
        baseURL: rule.baseURL,
        articleView: rule.articleView ? (0,_regex_index__WEBPACK_IMPORTED_MODULE_4__.serializeRegex)(rule.articleView) : undefined,
        searchView: rule.searchView ? (0,_regex_index__WEBPACK_IMPORTED_MODULE_4__.serializeRegex)(rule.searchView) : undefined,
        redirect: rule.redirect,
    };
}


/***/ }),

/***/ "./src/common/rules/enabled.ts":
/*!*************************************!*\
  !*** ./src/common/rules/enabled.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getActiveRules: () => (/* binding */ getActiveRules),
/* harmony export */   getActiveRulesFromConfig: () => (/* binding */ getActiveRulesFromConfig)
/* harmony export */ });
/* harmony import */ var _block__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./block */ "./src/common/rules/block.ts");

/**
 * Get enabled rules via the config
 * @param config config object
 * @returns blocked site rules
 */
function getActiveRulesFromConfig(config) {
    var _a, _b;
    return getActiveRules(Object.keys((_a = config.blocked.group) !== null && _a !== void 0 ? _a : {}), Object.keys((_b = config.blocked.site) !== null && _b !== void 0 ? _b : {}));
}
function getActiveRules(groups = [], sites = []) {
    const availableRules = (0,_block__WEBPACK_IMPORTED_MODULE_0__.getBlockRules)();
    if (!availableRules)
        return undefined;
    const rules = [];
    if (groups.length > 0) {
        rules.push(...availableRules.filter(rule => rule.group.find(a => groups.includes(a)) !== undefined));
    }
    if (sites.length > 0) {
        rules.push(...availableRules.filter(rule => sites.includes(rule.id)));
    }
    // Remove duplicates
    return rules.filter((rule, index, self) => self.findIndex(r => r.id === rule.id) === index);
}


/***/ }),

/***/ "./src/common/rules/model.ts":
/*!***********************************!*\
  !*** ./src/common/rules/model.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BlockedSite: () => (/* binding */ BlockedSite)
/* harmony export */ });
/* harmony import */ var _regex_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../regex/index */ "./src/common/regex/index.ts");

class BlockedSite {
    constructor(site) {
        this.id = site.id;
        this.group = site.group;
        this.name = site.name;
        this.baseURL = site.baseURL;
        this.articleView = site.articleView !== undefined ? (0,_regex_index__WEBPACK_IMPORTED_MODULE_0__.deserializeRegex)(site.articleView) : undefined;
        this.searchView = site.searchView !== undefined ? (0,_regex_index__WEBPACK_IMPORTED_MODULE_0__.deserializeRegex)(site.searchView) : undefined;
        this.redirect = site.redirect;
    }
    static fromSerialized(site) {
        return new BlockedSite(site);
    }
    getTargetURL(rawUrl) {
        const url = new URL(rawUrl);
        return url.pathname + (url.search || "");
    }
    isInSite(rawUrl) {
        const url = new URL(rawUrl);
        return url.hostname === this.baseURL;
    }
    isSearchView(rawUrl) {
        if (this.searchView === undefined) {
            return false;
        }
        this.searchView.lastIndex = 0;
        return this.searchView.test(this.getTargetURL(rawUrl));
    }
    isArticleView(rawUrl) {
        if (this.articleView === undefined) {
            return false;
        }
        this.articleView.lastIndex = 0;
        return this.articleView.test(this.getTargetURL(rawUrl));
    }
    getQuery(rawUrl) {
        var _a;
        return (_a = this.getSearchQuery(rawUrl)) !== null && _a !== void 0 ? _a : this.getArticleName(rawUrl);
    }
    getSearchQuery(rawUrl) {
        var _a;
        if (this.searchView === undefined) {
            return undefined;
        }
        this.searchView.lastIndex = 0;
        const match = this.searchView.exec(this.getTargetURL(rawUrl));
        if (match === null) {
            return undefined;
        }
        if (((_a = match.groups) === null || _a === void 0 ? void 0 : _a.query) !== undefined) {
            // check if it is url encoded
            try {
                return decodeURIComponent(match.groups.query);
            }
            catch (_b) {
                return match.groups.query;
            }
        }
        return undefined;
    }
    getArticleName(rawUrl) {
        var _a;
        if (this.articleView === undefined) {
            return undefined;
        }
        this.articleView.lastIndex = 0;
        const match = this.articleView.exec(this.getTargetURL(rawUrl));
        if (match === null) {
            return undefined;
        }
        if (((_a = match.groups) === null || _a === void 0 ? void 0 : _a.query) !== undefined) {
            // check if it is url encoded
            try {
                return decodeURIComponent(match.groups.query);
            }
            catch (_b) {
                return match.groups.query;
            }
        }
        return undefined;
    }
}


/***/ }),

/***/ "./src/common/rules/redirect.ts":
/*!**************************************!*\
  !*** ./src/common/rules/redirect.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRedirectTargets: () => (/* binding */ getRedirectTargets),
/* harmony export */   handleRedirects: () => (/* binding */ handleRedirects),
/* harmony export */   loadRedirectionRules: () => (/* binding */ loadRedirectionRules)
/* harmony export */ });
/* harmony import */ var _config_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/index */ "./src/common/config/index.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../global */ "./src/common/global.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


let redirectTargets;
function getRedirectTargets() {
    if (redirectTargets === undefined) {
        return [];
    }
    return redirectTargets;
}
function fetchOfflineRedirectTargets() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield (0,_global__WEBPACK_IMPORTED_MODULE_1__.fetchRepo)("/filter/redirectedSites.json", { repo: false });
        const res = yield data.json();
        if (Array.isArray(res)) {
            return res;
        }
        return [];
    });
}
function fetchOnlineRedirectTargets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0,_global__WEBPACK_IMPORTED_MODULE_1__.fetchRepo)("/filter/redirectedSites.json", { repo: true });
            const res = yield data.json();
            if (Array.isArray(res)) {
                return res;
            }
            return [];
        }
        catch (e) {
            return [];
        }
    });
}
function loadRedirectionRules() {
    return __awaiter(this, void 0, void 0, function* () {
        if (redirectTargets === undefined) {
            let rules = yield fetchOfflineRedirectTargets();
            try {
                const onlineRules = yield fetchOnlineRedirectTargets();
                // merge offline and online rules
                // if there are any conflicts, online rules will take precedence
                const onlineRemoved = rules.filter(rule => !onlineRules.find(r => r.id === rule.id));
                rules = [...onlineRemoved, ...onlineRules];
            }
            catch (e) {
                console.error("Failed to fetch online redirect rules", e);
            }
            redirectTargets = rules;
        }
        return redirectTargets;
    });
}
function handleRedirects(query) {
    var _a, _b;
    const config = (0,_config_index__WEBPACK_IMPORTED_MODULE_0__.getConfig)();
    const rules = getRedirectTargets();
    const urls = [];
    for (const id in Object.keys((_a = config === null || config === void 0 ? void 0 : config.redirected) !== null && _a !== void 0 ? _a : {})) {
        if (config.redirected[id]) {
            const rule = rules.find(n => n.id === id);
            if (!rule)
                continue;
            let tmpQuery = query;
            if (rule.queryProcessing) {
                for (const replaceReq of rule.queryProcessing.replace) {
                    const fromRegex = new RegExp(replaceReq.from, "g");
                    const to = replaceReq.to;
                    tmpQuery = tmpQuery.replace(fromRegex, to);
                }
            }
            const queryReplaceRegex = new RegExp("{{query}}", "g");
            const langReplaceRegex = new RegExp("{{lang}}", "g");
            const langCode = /(가-힣)+/.test(query) ? "ko" : /^[A-z0-9 ]$/.test(tmpQuery) ? "en" : ((_b = /^((\w){2})/.exec(navigator.language)) !== null && _b !== void 0 ? _b : ['ko', 'KR'])[1];
            const finalURL = rule.redirectLocation.replace(queryReplaceRegex, query).replace(langReplaceRegex, langCode);
            urls.push(finalURL);
        }
    }
    return urls;
}


/***/ }),

/***/ "./src/common/utils.ts":
/*!*****************************!*\
  !*** ./src/common/utils.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isNamuLiveBlocked: () => (/* binding */ isNamuLiveBlocked),
/* harmony export */   unescapeRegexString: () => (/* binding */ unescapeRegexString)
/* harmony export */ });
function unescapeRegexString(string) {
    return string.replace(/\\([\/\.\*\+\?\|\(\)\[\]\{\}\\\$\^\-])/g, '$1');
}
function isNamuLiveBlocked(config) {
    return config && config.blocked && (config.blocked.group["namulive"] || config.blocked.site["namulive"]);
}


/***/ }),

/***/ "./src/searchFilters/index.ts":
/*!************************************!*\
  !*** ./src/searchFilters/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SearchEngineFilter: () => (/* binding */ SearchEngineFilter)
/* harmony export */ });
class SearchEngineFilter {
    constructor(name, urlRegex, targetRoutine) {
        this.name = name;
        this.urlRegex = urlRegex;
        this.targetRoutine = targetRoutine;
    }
    isMatch(url) {
        return this.urlRegex.test(url);
    }
    runRoutineOnMatch(url, ...args) {
        if (this.isMatch(url)) {
            return this.targetRoutine(...args);
        }
    }
}


/***/ }),

/***/ "./src/searchFilters/runner.ts":
/*!*************************************!*\
  !*** ./src/searchFilters/runner.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runSearchFilterRoutine: () => (/* binding */ runSearchFilterRoutine)
/* harmony export */ });
/* harmony import */ var _sites_daum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sites/daum */ "./src/searchFilters/sites/daum.ts");
/* harmony import */ var _sites_duckduckgo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sites/duckduckgo */ "./src/searchFilters/sites/duckduckgo.ts");
/* harmony import */ var _sites_ecosia__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sites/ecosia */ "./src/searchFilters/sites/ecosia.ts");
/* harmony import */ var _sites_google__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sites/google */ "./src/searchFilters/sites/google.ts");
/* harmony import */ var _sites_naver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sites/naver */ "./src/searchFilters/sites/naver.ts");





function runSearchFilterRoutine(rules = []) {
    const url = window.location.href;
    for (const filter of [
        _sites_daum__WEBPACK_IMPORTED_MODULE_0__["default"],
        _sites_naver__WEBPACK_IMPORTED_MODULE_4__["default"],
        _sites_google__WEBPACK_IMPORTED_MODULE_3__["default"],
        _sites_ecosia__WEBPACK_IMPORTED_MODULE_2__["default"],
        _sites_duckduckgo__WEBPACK_IMPORTED_MODULE_1__["default"],
    ]) {
        filter.runRoutineOnMatch(url, rules);
    }
}


/***/ }),

/***/ "./src/searchFilters/sites/daum.ts":
/*!*****************************************!*\
  !*** ./src/searchFilters/sites/daum.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/searchFilters/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _index__WEBPACK_IMPORTED_MODULE_0__.SearchEngineFilter("Daum", /^http(s|):\/\/(www.|search.|)daum.net\/search\?/ig, (rules) => __awaiter(void 0, void 0, void 0, function* () {
    const searchResultClasses = ['wrap_cont'];
    searchResultClasses.forEach((currentClass) => __awaiter(void 0, void 0, void 0, function* () {
        const searchResults = document.getElementsByClassName(currentClass);
        const killList = [];
        for (const searchResult of searchResults) {
            const searchResultAnchors = searchResult.getElementsByTagName('a');
            for (const searchResultAnchor of searchResultAnchors) {
                if (rules.find(n => n.isInSite(searchResultAnchor.href))) {
                    killList.push(searchResult);
                }
            }
        }
        for (const kill of killList) {
            try {
                kill.remove();
            }
            catch (_a) {
            }
        }
    }));
})));


/***/ }),

/***/ "./src/searchFilters/sites/duckduckgo.ts":
/*!***********************************************!*\
  !*** ./src/searchFilters/sites/duckduckgo.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/searchFilters/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _index__WEBPACK_IMPORTED_MODULE_0__.SearchEngineFilter("DuckDuckGo", /^http(s|):\/\/(www.|search.|)duckduckgo.com\/\?/ig, (rules) => __awaiter(void 0, void 0, void 0, function* () {
    const searchResultClasses = ['nrn-react-div', 'tile'];
    searchResultClasses.forEach((currentClass) => __awaiter(void 0, void 0, void 0, function* () {
        const searchResults = document.getElementsByClassName(currentClass);
        const killList = [];
        for (const searchResult of searchResults) {
            const searchResultAnchors = searchResult.getElementsByTagName('a');
            for (const searchResultAnchor of searchResultAnchors) {
                if (rules.find(n => n.isInSite(searchResultAnchor.href))) {
                    killList.push(searchResult);
                }
            }
        }
        for (const kill of killList) {
            try {
                kill.remove();
            }
            catch (_a) {
            }
        }
    }));
})));


/***/ }),

/***/ "./src/searchFilters/sites/ecosia.ts":
/*!*******************************************!*\
  !*** ./src/searchFilters/sites/ecosia.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/searchFilters/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _index__WEBPACK_IMPORTED_MODULE_0__.SearchEngineFilter("Ecosia", /^https:\/\/www\.ecosia\.org\/(search|images)\?/ig, (rules) => __awaiter(void 0, void 0, void 0, function* () {
    const searchResultClasses = ['result', 'image-result'];
    searchResultClasses.forEach((currentClass) => __awaiter(void 0, void 0, void 0, function* () {
        const searchResults = document.getElementsByClassName(currentClass);
        const killList = [];
        for (const searchResult of searchResults) {
            const searchResultAnchors = searchResult.getElementsByTagName('a');
            for (const searchResultAnchor of searchResultAnchors) {
                if (rules.find(n => n.isInSite(searchResultAnchor.href))) {
                    killList.push(searchResult);
                }
            }
        }
        for (const kill of killList) {
            try {
                kill.remove();
            }
            catch (_a) {
            }
        }
    }));
})));


/***/ }),

/***/ "./src/searchFilters/sites/google.ts":
/*!*******************************************!*\
  !*** ./src/searchFilters/sites/google.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/searchFilters/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _index__WEBPACK_IMPORTED_MODULE_0__.SearchEngineFilter("Google", /^http(s|):\/\/(www.|cse.|)google.com\/search\?/ig, (rules) => __awaiter(void 0, void 0, void 0, function* () {
    const searchResultClasses = ['xpd', 'ez02md', 'g', 'ifM9O'];
    searchResultClasses.forEach((currentClass) => __awaiter(void 0, void 0, void 0, function* () {
        const searchResults = document.getElementsByClassName(currentClass);
        const killList = [];
        for (const searchResult of searchResults) {
            const searchResultAnchors = searchResult.getElementsByTagName('a');
            for (const searchResultAnchor of searchResultAnchors) {
                if (rules.find(n => n.isInSite(searchResultAnchor.href))) {
                    killList.push(searchResult);
                }
            }
        }
        for (const kill of killList) {
            try {
                kill.remove();
            }
            catch (_a) {
            }
        }
    }));
})));


/***/ }),

/***/ "./src/searchFilters/sites/naver.ts":
/*!******************************************!*\
  !*** ./src/searchFilters/sites/naver.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/searchFilters/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _index__WEBPACK_IMPORTED_MODULE_0__.SearchEngineFilter("Naver", /^http(s|):\/\/(www.|search.|)naver.com\//ig, (rules) => __awaiter(void 0, void 0, void 0, function* () {
    const searchResultClasses = ['sh_web_top', 'bx'];
    searchResultClasses.forEach((currentClass) => __awaiter(void 0, void 0, void 0, function* () {
        const searchResults = document.getElementsByClassName(currentClass);
        const killList = [];
        for (const searchResult of searchResults) {
            const searchResultAnchors = searchResult.getElementsByTagName('a');
            for (const searchResultAnchor of searchResultAnchors) {
                if (rules.find(n => n.isInSite(searchResultAnchor.href))) {
                    killList.push(searchResult);
                }
            }
        }
        for (const kill of killList) {
            try {
                kill.remove();
            }
            catch (_a) {
            }
        }
    }));
})));


/***/ }),

/***/ "./node_modules/webextension-polyfill/dist/browser-polyfill.js":
/*!*********************************************************************!*\
  !*** ./node_modules/webextension-polyfill/dist/browser-polyfill.js ***!
  \*********************************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.12.0 - Tue May 14 2024 18:01:29 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
    throw new Error("This script should only be loaded in a browser extension.");
  }
  if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";

    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };
      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }
        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }
          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };
      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }
          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }
          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args);

                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };
      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },
          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }
            if (!(prop in target)) {
              return undefined;
            }
            let value = target[prop];
            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });
              return value;
            }
            cache[prop] = value;
            return value;
          },
          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },
          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },
          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },
        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },
        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });
      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */
        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {} /* wrappers */, {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }
          const isResultThenable = result !== true && isThenable(result);

          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }

          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }
              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };

          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }

          // Let Chrome know that the listener is replying.
          return true;
        };
      });
      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };
      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }
        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }
        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };
      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});
//# sourceMappingURL=browser-polyfill.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/background.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFD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Q1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLENBQUM7QUFDRDs7Ozs7OztVQ3hzQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3R1cm5vZmYtbmFtdXdpa2kvLi9zcmMvYmFja2dyb3VuZC50cyIsIndlYnBhY2s6Ly90dXJub2ZmLW5hbXV3aWtpLy4vc3JjL2NvbW1vbi9hZGJsb2Nrcy9uYW11d2lraS50cyIsIndlYnBhY2s6Ly90dXJub2ZmLW5hbXV3aWtpLy4vc3JjL2NvbW1vbi9jb25maWcvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS8uL3NyYy9jb21tb24vZ2xvYmFsLnRzIiwid2VicGFjazovL3R1cm5vZmYtbmFtdXdpa2kvLi9zcmMvY29tbW9uL2luaXRpYWxpemVyLnRzIiwid2VicGFjazovL3R1cm5vZmYtbmFtdXdpa2kvLi9zcmMvY29tbW9uL2ludGVsbGlCYW4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS8uL3NyYy9jb21tb24vcmVnZXgvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS8uL3NyYy9jb21tb24vcnVsZXMvYWRzLnRzIiwid2VicGFjazovL3R1cm5vZmYtbmFtdXdpa2kvLi9zcmMvY29tbW9uL3J1bGVzL2Jsb2NrLnRzIiwid2VicGFjazovL3R1cm5vZmYtbmFtdXdpa2kvLi9zcmMvY29tbW9uL3J1bGVzL2VuYWJsZWQudHMiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS8uL3NyYy9jb21tb24vcnVsZXMvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS8uL3NyYy9jb21tb24vcnVsZXMvcmVkaXJlY3QudHMiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS8uL3NyYy9jb21tb24vdXRpbHMudHMiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS8uL3NyYy9zZWFyY2hGaWx0ZXJzL2luZGV4LnRzIiwid2VicGFjazovL3R1cm5vZmYtbmFtdXdpa2kvLi9zcmMvc2VhcmNoRmlsdGVycy9ydW5uZXIudHMiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS8uL3NyYy9zZWFyY2hGaWx0ZXJzL3NpdGVzL2RhdW0udHMiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS8uL3NyYy9zZWFyY2hGaWx0ZXJzL3NpdGVzL2R1Y2tkdWNrZ28udHMiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS8uL3NyYy9zZWFyY2hGaWx0ZXJzL3NpdGVzL2Vjb3NpYS50cyIsIndlYnBhY2s6Ly90dXJub2ZmLW5hbXV3aWtpLy4vc3JjL3NlYXJjaEZpbHRlcnMvc2l0ZXMvZ29vZ2xlLnRzIiwid2VicGFjazovL3R1cm5vZmYtbmFtdXdpa2kvLi9zcmMvc2VhcmNoRmlsdGVycy9zaXRlcy9uYXZlci50cyIsIndlYnBhY2s6Ly90dXJub2ZmLW5hbXV3aWtpLy4vbm9kZV9tb2R1bGVzL3dlYmV4dGVuc2lvbi1wb2x5ZmlsbC9kaXN0L2Jyb3dzZXItcG9seWZpbGwuanMiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90dXJub2ZmLW5hbXV3aWtpL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3R1cm5vZmYtbmFtdXdpa2kvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3R1cm5vZmYtbmFtdXdpa2kvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90dXJub2ZmLW5hbXV3aWtpL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdHVybm9mZi1uYW11d2lraS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3R1cm5vZmYtbmFtdXdpa2kvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3R1cm5vZmYtbmFtdXdpa2kvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBicm93c2VyIGZyb20gJ3dlYmV4dGVuc2lvbi1wb2x5ZmlsbCc7XHJcbmltcG9ydCB7IGdldENvbmZpZywgbG9hZENvbmZpZyB9IGZyb20gJy4vY29tbW9uL2NvbmZpZy9pbmRleCc7XHJcbmltcG9ydCB7IGxvYWRBbGwgfSBmcm9tICcuL2NvbW1vbi9pbml0aWFsaXplcic7XHJcbmltcG9ydCB7IGFkQmxvY2tlcnMsIG5hbXVMaXZlQmxvY2tlcnMsIHJlcmVnaXN0ZXJEeW5hbWljUnVsZXMsIHVucmVnaXN0ZXJEeW5hbWljUnVsZXMgfSBmcm9tICcuL2NvbW1vbi9hZGJsb2Nrcy9uYW11d2lraSc7XHJcbmltcG9ydCB7IGNoZWNrSWZJbnRlbGxpQmFuUGFzcyB9IGZyb20gJy4vY29tbW9uL2ludGVsbGlCYW4vaW5kZXgnO1xyXG5pbXBvcnQgeyBpc05hbXVMaXZlQmxvY2tlZCB9IGZyb20gJy4vY29tbW9uL3V0aWxzJztcclxuaW1wb3J0IHsgZ2V0UmVkaXJlY3RUYXJnZXRzLCBoYW5kbGVSZWRpcmVjdHMgfSBmcm9tICcuL2NvbW1vbi9ydWxlcy9yZWRpcmVjdCc7XHJcbmltcG9ydCB7IGdldEFjdGl2ZVJ1bGVzRnJvbUNvbmZpZyB9IGZyb20gJy4vY29tbW9uL3J1bGVzL2VuYWJsZWQnO1xyXG5pbXBvcnQgeyBydW5TZWFyY2hGaWx0ZXJSb3V0aW5lIH0gZnJvbSAnLi9zZWFyY2hGaWx0ZXJzL3J1bm5lcic7XHJcbmltcG9ydCB7IENvbmZpZ0ludGVyZmFjZSB9IGZyb20gJy4vY29tbW9uL2NvbmZpZy9pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBsb2FkQmxvY2tSdWxlcyB9IGZyb20gJy4vY29tbW9uL3J1bGVzL2Jsb2NrJztcclxuXHJcbi8qID0gVGFiIENvbnRleHQgU2F2ZSA9ICovXHJcbmNvbnN0IHByZXZpb3VzVGFiVXJsczogc3RyaW5nW10gPSBbXTtcclxuXHJcbmNvbnN0IHN5bmNEYXRhID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgbG9hZEFsbCgpO1xyXG4gICAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKCk7XHJcbiAgICBhd2FpdCB1cGRhdGVEeW5hbWljUnVsZXMoY29uZmlnKTtcclxufVxyXG5cclxuY29uc3QgdXBkYXRlRHluYW1pY1J1bGVzID0gYXN5bmMgKGNvbmZpZzogQ29uZmlnSW50ZXJmYWNlKSA9PiB7XHJcbiAgICBpZiAoaXNOYW11TGl2ZUJsb2NrZWQoY29uZmlnKSkge1xyXG4gICAgICAgIGF3YWl0IHJlcmVnaXN0ZXJEeW5hbWljUnVsZXMobmFtdUxpdmVCbG9ja2Vycyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGF3YWl0IHVucmVnaXN0ZXJEeW5hbWljUnVsZXMobmFtdUxpdmVCbG9ja2Vycyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbmZpZz8uYWRibG9jaz8ubmFtdXdpa2kpIHtcclxuICAgICAgICBhd2FpdCByZXJlZ2lzdGVyRHluYW1pY1J1bGVzKGFkQmxvY2tlcnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhd2FpdCB1bnJlZ2lzdGVyRHluYW1pY1J1bGVzKGFkQmxvY2tlcnMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyogPSBPbiBJbnN0YWxsID0gKi9cclxuYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKHN5bmNEYXRhKTtcclxuXHJcbi8qID0gY29uZmlnIHVwZGF0ZSBsaXN0ZW5lciA9ICovXHJcbmJyb3dzZXIuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoc3luY0RhdGEpO1xyXG5cclxuLyogPSBOYW11V2lraSBCbG9jayBMb2dpYyA9ICovXHJcbmJyb3dzZXIudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoYXN5bmMgKHRhYklkLCBpbmZvLCB0YWIpID0+IHtcclxuICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZygpID8/IGF3YWl0IGxvYWRDb25maWcoKTtcclxuICAgIGxldCBydWxlcyA9IGdldEFjdGl2ZVJ1bGVzRnJvbUNvbmZpZyhjb25maWcpO1xyXG4gICAgaWYgKCFydWxlcykge1xyXG4gICAgICAgIGF3YWl0IGxvYWRCbG9ja1J1bGVzKCk7XHJcbiAgICAgICAgcnVsZXMgPSBnZXRBY3RpdmVSdWxlc0Zyb21Db25maWcoY29uZmlnKSA/PyBbXTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1cmwgPSBpbmZvLnVybCB8fCB0YWIudXJsO1xyXG5cclxuICAgIC8vIFNhdmUgcHJldmlvdXMgVVJMXHJcbiAgICBjb25zdCBwcmV2aW91c1RhYlVybCA9IHByZXZpb3VzVGFiVXJsc1t0YWJJZF07XHJcbiAgICBpZiAodXJsICYmIGluZm8uc3RhdHVzID09PSAnY29tcGxldGUnKSBwcmV2aW91c1RhYlVybHNbdGFiSWRdID0gdXJsO1xyXG5cclxuXHJcbiAgICBpZiAodXJsKSB7XHJcbiAgICAgICAgLy8gcnVuIHNlYXJjaCBmaWx0ZXJcclxuICAgICAgICBpZiAoY29uZmlnLnNlYXJjaEZpbHRlcikge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhYi5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGJyb3dzZXIuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHt0YWJJZDogdGFiLmlkfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuYzogcnVuU2VhcmNoRmlsdGVyUm91dGluZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogW3J1bGVzXSxcclxuICAgICAgICAgICAgICAgICAgICB9KSAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignT29wcy4gVGhlIEJpZyBGYW1vdXMgQ29uc3RhbnQgRTogJywgZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1hdGNoaW5nUnVsZSA9IHJ1bGVzLmZpbmQoXHJcbiAgICAgICAgICAgIHJ1bGUgPT4gcnVsZS5pc0luU2l0ZSh1cmwpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKG1hdGNoaW5nUnVsZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncnVsZSBtYXRjaGVkOicsIG1hdGNoaW5nUnVsZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0gbWF0Y2hpbmdSdWxlLmdldFF1ZXJ5KHVybCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdxdWVyeTonLCBxdWVyeSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWluZm8udXJsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5mbycsIGluZm8pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZm8uc3RhdHVzICE9PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1ByZXZlbnQgVHJpZ2dlcmVkIFR3aWNlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocXVlcnkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRlYm91bmNlOiBpZiB0aGUgcHJldmlvdXMgdXJsIGlzIHNhbWUsXHJcbiAgICAgICAgICAgICAgICAvLyBkbyBub3QgdHJpZ2dlciB0aGUgYmFuLlxyXG4gICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzVGFiVXJsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldlF1ZXJ5ID0gbWF0Y2hpbmdSdWxlLmdldFF1ZXJ5KHByZXZpb3VzVGFiVXJsKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJldlF1ZXJ5ID09PSBxdWVyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRGVib3VuY2VkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2tpcCBiYW4gaWYgcXVlcnkgaXMgaW50ZWxsaUJhblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrSWZJbnRlbGxpQmFuUGFzcyhxdWVyeSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYXdhaXQgYnJvd3Nlci50YWJzLnVwZGF0ZSh0YWJJZCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogYnJvd3Nlci5ydW50aW1lLmdldFVSTChgdWkvYmFubmVkL2luZGV4Lmh0bWw/YmFubmVkX3VybD0ke3VybH0mc2l0ZV9uYW1lPSR7bWF0Y2hpbmdSdWxlLm5hbWV9YCksXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hpbmdSdWxlLmlzQXJ0aWNsZVZpZXcodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFVybHMgPSBoYW5kbGVSZWRpcmVjdHModXJsKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0VXJscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFVybCA9IHRhcmdldFVybHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGJyb3dzZXIudGFicy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB0YXJnZXRVcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBwcmV2aW91c1RhYlVybHNbdGFiSWRdID0gdXJsO1xyXG4gICAgfVxyXG59KTtcclxuIiwiaW1wb3J0IGJyb3dzZXIgZnJvbSBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xyXG5pbXBvcnQgeyBnZXRBY3RpdmVSdWxlcyB9IGZyb20gXCIuLi9ydWxlcy9lbmFibGVkXCI7XHJcblxyXG4vKipcclxuICogV2h5IEFkQmxvY2sgTmFtdVdpa2k/XHJcbiAqXHJcbiAqIENvbnRlbnRzIG9mIG5hbXV3aWtpIGlzIGRpc3RyaWJ1dGVkIHVuZGVyIENyZWF0aXZlIENvbW1vbnMtQlktTkMtU0EgTGljZW5zZS5cclxuICogd2hpY2ggRE9FU04nVCBhbGxvdyB3ZWJwYWdlIHRvIGNyZWF0ZSB0aGVpciBhZC1yZXZlbnVlIG9yIHNlbGwgdGhlIGNvbnRlbnRcclxuICogd2l0aCB0aGVpciBjb250ZW50LCBCVVQsIEN1cnJlbnQgb3duZXIgb2YgbmFtdXdpa2kgaXMgbGl0ZXJhbGx5ICpzZWxsaW5nKlxyXG4gKiBjb250ZW50IGJ5IHZpb2xhdGluZyBuYW11d2lraSdzIGxpY2Vuc2UgYmVmb3JlIGFjcXVpc2l0aW9uIChldmVuIHRoZXkgYXJlXHJcbiAqIHN0aWxsIHVzaW5nIENDLUJZLU5DLVNBIExpY2Vuc2UpLlxyXG4gKlxyXG4gKiBUaGF0J3MgdG90YWxseSBnaXZpbmcgY29udGVudCBjcmVhdG9ycyBhIGZ1Y2suIEJ1dCBtYW55IHBlb3BsZSBhcmUgbm90IHVzaW5nXHJcbiAqIGFkLWJsb2NrIHRvIHN1cHBvcnQgdGhlIGNyZWF0b3JzLCBhbmQgYWN0dWFsbHksIE5hbXV3aWtpIGlzIHN0aWxsIGluIHRoZVxyXG4gKiBBY2NlcHRhYmxlLUFkcyBsaXN0cy5cclxuICpcclxuICogd2hpY2ggaXMgdW4tYWNjZXB0YWJsZSBmb3IgbWUgZW50aXJlbHkgYmVjYXVzZSB0aGV5IGFyZSBlYXJuaW5nIHRoZWlyXHJcbiAqIGFkLXJldmVudWUgYnkgY29weXJpZ2h0IGluZnJpbmdlbWVudC5cclxuICpcclxuICogRnJvbSBWZXJzaW9uIDAuNi4wLCBJIGFtIGJveWNvdHRpbmcgbmFtdXdpa2kncyBhZC1yZXZlbnVlIHN5c3RlbSBieVxyXG4gKiBibG9ja2luZyB0aGVtIGVudGlyZWx5LlxyXG4gKlxyXG4gKiBGVUNLIFlPVSwgdW1hbmxlIGNvcnBvcmF0aW9uLlxyXG4gKi9cclxuXHJcbmV4cG9ydCBjb25zdCBhZEJsb2NrZXJzOiBQYXJhbWV0ZXJzPHR5cGVvZiBicm93c2VyLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC51cGRhdGVEeW5hbWljUnVsZXM+WzBdWydhZGRSdWxlcyddID0gW1xyXG4gIHtcclxuICAgICAgaWQ6IDEwMDAxLFxyXG4gICAgICBwcmlvcml0eTogMSxcclxuICAgICAgYWN0aW9uOiB7XHJcbiAgICAgICAgICB0eXBlOiBcImJsb2NrXCJcclxuICAgICAgfSxcclxuICAgICAgY29uZGl0aW9uOiB7XHJcbiAgICAgICAgICAvKiAgICBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdXJsczogW1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly8qLmdvb2dsZXN5bmRpY2F0aW9uLmNvbS8qXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJodHRwczovLyouZG91YmxlY2xpY2submV0LypcIixcclxuICAgICAgICAgICAgICAgICAgICBcImh0dHBzOi8vYWRzZXJ2aWNlLmdvb2dsZS5jb20vKlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9hcmNhLmxpdmUvYXBpL2FkcypcIixcclxuICAgICAgICAgICAgICAgICAgICBcImh0dHBzOi8vc2VhcmNoYWQtcGhpbmYucHN0YXRpYy5uZXQvKlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9zc2wucHN0YXRpYy5uZXQvYWRpbWczLnNlYXJjaC8qXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJodHRwczovL3d3dy5nb29nbGUuY29tL2Fkc2Vuc2Uvc2VhcmNoLypcIixcclxuICAgICAgICAgICAgICAgICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vYWZzL2FkcypcIlxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LCBcclxuICAgICAgICAgICovXHJcbiAgICAgICAgICByZWdleEZpbHRlcjogXCJeaHR0cHM6XFwvXFwvKFxcKlxcLmdvb2dsZXN5bmRpY2F0aW9uXFwuY29tXFwvfFxcKlxcLmRvdWJsZWNsaWNrXFwubmV0XFwvfGFkc2VydmljZVxcLmdvb2dsZVxcLmNvbVxcL3xhcmNhXFwubGl2ZVxcL2FwaVxcL2Fkc3xzZWFyY2hhZC1waGluZlxcLnBzdGF0aWNcXC5uZXRcXC98XFwqXFwuc3NsXFwucHN0YXRpY1xcLm5ldFxcL2FkaW1nM1xcLnNlYXJjaFxcL3x3d3dcXC5nb29nbGVcXC5jb21cXC9hZHNlbnNlXFwvc2VhcmNoXFwvfHd3d1xcLmdvb2dsZVxcLmNvbVxcL2Fmc1xcL2FkcykuKlwiLFxyXG4gICAgICAgICAgaW5pdGlhdG9yRG9tYWluczogW1wiKjovLyoubmFtdS53aWtpLypcIiwgXCIqOi8vKi5uYW11Lm1pcnJvci53aWtpLypcIiwgXCIqOi8vKi5uYW11Lm5ld3MvKlwiXSxcclxuICAgICAgfSxcclxuICB9XHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgbmFtdUxpdmVCbG9ja2VyczogUGFyYW1ldGVyczx0eXBlb2YgYnJvd3Nlci5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QudXBkYXRlRHluYW1pY1J1bGVzPlswXVsnYWRkUnVsZXMnXSA9IFtcclxuICB7XHJcbiAgICAgIGlkOiAyMDAwMSxcclxuICAgICAgcHJpb3JpdHk6IDEsXHJcbiAgICAgIGFjdGlvbjoge1xyXG4gICAgICAgICAgdHlwZTogXCJibG9ja1wiXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbmRpdGlvbjoge1xyXG4gICAgICAgICAgLyogICAgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHVybHM6IFtcclxuICAgICAgICAgICAgICAgICAgICBcImh0dHBzOi8vc2VhcmNoLm5hbXUud2lraS9hcGkvcmFua2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9hcmNhLmxpdmUvKlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9uYW11Lm5ld3MvKlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9uYW11Lm5ld3MvYXBpL2FydGljbGVzL2NhY2hlZFwiLFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LCBcclxuICAgICAgICAgICovXHJcbiAgICAgICAgICByZWdleEZpbHRlcjogXCJeaHR0cHM6XFwvXFwvKHNlYXJjaFxcLm5hbXVcXC53aWtpXFwvYXBpXFwvcmFua2luZ3xhcmNhXFwubGl2ZVxcLy4qfG5hbXVcXC5uZXdzXFwvLip8bmFtdVxcLm5ld3NcXC9hcGlcXC9hcnRpY2xlc1xcL2NhY2hlZCkuKlwiLFxyXG4gICAgICB9LFxyXG4gIH1cclxuXTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1bnJlZ2lzdGVyRHluYW1pY1J1bGVzKHJ1bGVzOiBQYXJhbWV0ZXJzPHR5cGVvZiBicm93c2VyLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC51cGRhdGVEeW5hbWljUnVsZXM+WzBdWydhZGRSdWxlcyddKSB7XHJcbiAgYXdhaXQgYnJvd3Nlci5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QudXBkYXRlRHluYW1pY1J1bGVzKHtcclxuICAgIHJlbW92ZVJ1bGVJZHM6IFsuLi4ocnVsZXMgPz8gW10pLm1hcChuID0+IG4uaWQpXSxcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcmVnaXN0ZXJEeW5hbWljUnVsZXMocnVsZXM6IFBhcmFtZXRlcnM8dHlwZW9mIHVucmVnaXN0ZXJEeW5hbWljUnVsZXM+WzBdKSB7XHJcbiAgYXdhaXQgdW5yZWdpc3RlckR5bmFtaWNSdWxlcyhydWxlcyk7XHJcbiAgYXdhaXQgYnJvd3Nlci5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QudXBkYXRlRHluYW1pY1J1bGVzKHtcclxuICAgIGFkZFJ1bGVzOiBydWxlcyxcclxuICB9KTtcclxufVxyXG5cclxuIiwiaW1wb3J0IGJyb3dzZXIgZnJvbSAnd2ViZXh0ZW5zaW9uLXBvbHlmaWxsJztcclxuaW1wb3J0IHsgQ29uZmlnSW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2UnO1xyXG5cclxubGV0IGNvbmZpZ0NhY2hlOiBDb25maWdJbnRlcmZhY2U7XHJcblxyXG4vKiA9IGNvbmZpZyB1cGRhdGUgbGlzdGVuZXIgPSAqL1xyXG5icm93c2VyLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKGFzeW5jICgpID0+IHtcclxuICBhd2FpdCBsb2FkQ29uZmlnKCk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZygpOiBDb25maWdJbnRlcmZhY2Uge1xyXG4gIHJldHVybiBjb25maWdDYWNoZTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRDb25maWcoKTogUHJvbWlzZTxDb25maWdJbnRlcmZhY2U+IHtcclxuICBsZXQgdGhpc0NvbmZpZzogQ29uZmlnSW50ZXJmYWNlO1xyXG4gIGRvIHtcclxuICAgIHRoaXNDb25maWcgPSBhd2FpdCBicm93c2VyLnN0b3JhZ2Uuc3luYy5nZXQobnVsbCkgYXMgQ29uZmlnSW50ZXJmYWNlO1xyXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXNDb25maWcpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBhd2FpdCBicm93c2VyLnN0b3JhZ2Uuc3luYy5zZXQoe1xyXG4gICAgICAgIGJsb2NrZWQ6IHsgc2l0ZToge30sIGdyb3VwOiB7fSB9LFxyXG4gICAgICAgIHJlZGlyZWN0ZWQ6IHt9LFxyXG4gICAgICAgIGFkYmxvY2s6IHsgbmFtdXdpa2k6IGZhbHNlIH0sXHJcbiAgICAgICAgcHJveHk6IHsgZGJwaWE6IFwiXCIgfSxcclxuICAgICAgICBzZWFyY2hGaWx0ZXI6IGZhbHNlLFxyXG4gICAgICAgIGludGVsbGlCYW46IHsgZW5hYmxlZDogZmFsc2UsIHVybDogXCJcIiwgcnVsZXM6IFtdIH0sXHJcbiAgICAgICAgYmFubmVkUGFnZTogeyBtZXNzYWdlOiBcIlwiLCByZXRyeTogZmFsc2UgfVxyXG4gICAgICB9IGFzIHVua25vd24gYXMgQ29uZmlnSW50ZXJmYWNlKTtcclxuICAgIH1cclxuICAgIGNvbmZpZ0NhY2hlID0gdGhpc0NvbmZpZztcclxuICB9IHdoaWxlIChPYmplY3Qua2V5cyh0aGlzQ29uZmlnKS5sZW5ndGggPT09IDApO1xyXG5cclxuICByZXR1cm4gdGhpc0NvbmZpZztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUNvbmZpZyh0aGlzQ29uZmlnOiBDb25maWdJbnRlcmZhY2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICByZXR1cm4gYnJvd3Nlci5zdG9yYWdlLnN5bmMuc2V0KHRoaXNDb25maWcpO1xyXG59IiwiY29uc3QgYmFzZVBhdGggPSAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FsZXg0Mzg2L3R1cm5vZmYtbmFtdXdpa2kvbWFpbi8nO1xyXG5cclxudHlwZSBGZXRjaFBhcmFtcyA9IFBhcmFtZXRlcnM8dHlwZW9mIGZldGNoPjtcclxuXHJcbmZ1bmN0aW9uIGdldFJlcG9VUkwocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gYmFzZVBhdGggKyBwYXRoO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hSZXBvKGlucHV0OiBGZXRjaFBhcmFtc1swXSwgaW5pdD86IEZldGNoUGFyYW1zWzFdICYgeyByZXBvOiBib29sZWFuIH0pOiBSZXR1cm5UeXBlPHR5cGVvZiBmZXRjaD4ge1xyXG4gIGNvbnN0IGlzUmVwbyA9IGluaXQ/LnJlcG8gfHwgZmFsc2U7XHJcbiAgbGV0IHVybCA9IHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgPyBpbnB1dCA6IGlucHV0IGluc3RhbmNlb2YgVVJMID8gaW5wdXQuaHJlZiA6IGlucHV0LnVybDtcclxuICBpZiAoaXNSZXBvKSB7XHJcbiAgICB1cmwgPSBnZXRSZXBvVVJMKHVybCk7XHJcbiAgfVxyXG5cclxuICBsZXQgbmV3SW5wdXQ6IEZldGNoUGFyYW1zWzBdO1xyXG4gIC8vIGlmIGl0IGlzIGEgUmVxdWVzdCBvYmplY3QsIHdlIG5lZWQgdG8gY29weSB0aGUgUmVxdWVzdCBvYmplY3RcclxuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XHJcbiAgICBuZXdJbnB1dCA9IG5ldyBSZXF1ZXN0KGlucHV0LCB7XHJcbiAgICAgIGJvZHk6IGlucHV0LmJvZHksXHJcbiAgICAgIGhlYWRlcnM6IGlucHV0LmhlYWRlcnMsXHJcbiAgICAgIG1ldGhvZDogaW5wdXQubWV0aG9kLFxyXG4gICAgICBtb2RlOiBpbnB1dC5tb2RlLFxyXG4gICAgICBjcmVkZW50aWFsczogaW5wdXQuY3JlZGVudGlhbHMsXHJcbiAgICAgIGNhY2hlOiBpbnB1dC5jYWNoZSxcclxuICAgICAgcmVkaXJlY3Q6IGlucHV0LnJlZGlyZWN0LFxyXG4gICAgICByZWZlcnJlcjogaW5wdXQucmVmZXJyZXIsXHJcbiAgICAgIHJlZmVycmVyUG9saWN5OiBpbnB1dC5yZWZlcnJlclBvbGljeSxcclxuICAgICAgaW50ZWdyaXR5OiBpbnB1dC5pbnRlZ3JpdHksXHJcbiAgICAgIGtlZXBhbGl2ZTogaW5wdXQua2VlcGFsaXZlLFxyXG4gICAgICBzaWduYWw6IGlucHV0LnNpZ25hbCxcclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICBuZXdJbnB1dCA9IHVybDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld0lucHV0ID0gbmV3IFVSTCh1cmwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZldGNoKG5ld0lucHV0LCBpbml0KTtcclxufVxyXG4iLCJpbXBvcnQgeyBsb2FkQ29uZmlnIH0gZnJvbSBcIi4vY29uZmlnL2luZGV4XCI7XHJcbmltcG9ydCB7IGxvYWRBZFJ1bGVzIH0gZnJvbSBcIi4vcnVsZXMvYWRzXCI7XHJcbmltcG9ydCB7IGxvYWRCbG9ja1J1bGVzIH0gZnJvbSBcIi4vcnVsZXMvYmxvY2tcIjtcclxuaW1wb3J0IHsgbG9hZFJlZGlyZWN0aW9uUnVsZXMgfSBmcm9tIFwiLi9ydWxlcy9yZWRpcmVjdFwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRBbGwoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgbG9hZENvbmZpZyxcclxuICAgICAgICBsb2FkQWRSdWxlcyxcclxuICAgICAgICBsb2FkUmVkaXJlY3Rpb25SdWxlcyxcclxuICAgICAgICBsb2FkQmxvY2tSdWxlcyxcclxuICAgICAgXSlcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGxvYWRBbGw6XCIsIGUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9pbmRleFwiO1xyXG5pbXBvcnQgeyBkZXNlcmlhbGl6ZVJlZ2V4IH0gZnJvbSBcIi4uL3JlZ2V4L2luZGV4XCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tJZkludGVsbGlCYW5QYXNzKHF1ZXJ5OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZygpO1xyXG4gICAgaWYgKGNvbmZpZy5pbnRlbGxpQmFuPy5lbmFibGVkKSB7XHJcbiAgICAgIGNvbnN0IHJ1bGVzID0gY29uZmlnLmludGVsbGlCYW4ucnVsZXMuZmlsdGVyKHJ1bGUgPT4gcnVsZSkubWFwKGRlc2VyaWFsaXplUmVnZXgpO1xyXG4gICAgICByZXR1cm4gcnVsZXMuZmluZChydWxlID0+IHJ1bGUudGVzdChxdWVyeSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufSIsImltcG9ydCB7IFJlZ2V4SW50ZXJmYWNlIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplUmVnZXgodmFsdWU6IFJlZ0V4cCk6IFJlZ2V4SW50ZXJmYWNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVnZXg6IHZhbHVlLnNvdXJjZSxcclxuICAgICAgICBmbGFnOiB2YWx1ZS5mbGFnc1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlc2VyaWFsaXplUmVnZXgodmFsdWU6IFJlZ2V4SW50ZXJmYWNlIHwgc3RyaW5nKTogUmVnRXhwIHtcclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAodmFsdWUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCh2YWx1ZS5yZWdleCwgdmFsdWUuZmxhZyk7XHJcbn1cclxuIiwiaW1wb3J0IHsgZmV0Y2hSZXBvIH0gZnJvbSBcIi4uL2dsb2JhbFwiO1xyXG5cclxubGV0IGFkVGFyZ2V0czogc3RyaW5nW107XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWRUYXJnZXRzKCkge1xyXG4gIHJldHVybiBhZFRhcmdldHM7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaE9mZmxpbmVBZFRhcmdldHMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xyXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBmZXRjaFJlcG8oJy9maWx0ZXIvbmFtdUFkcy5qc29uJyk7XHJcbiAgY29uc3QgcmVzID0gYXdhaXQgZGF0YS5qc29uKCk7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkocmVzKSkge1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9XHJcblxyXG4gIHJldHVybiBbXTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoT25saW5lQWRUYXJnZXRzKCk6IFByb21pc2U8c3RyaW5nW10+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoUmVwbygnL2ZpbHRlci9uYW11QWRzLmpzb24nLCB7IHJlcG86IHRydWUgfSk7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBkYXRhLmpzb24oKTtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHJlcykpIHtcclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHJldHVybiBbXTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZEFkUnVsZXMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xyXG4gIGlmIChhZFRhcmdldHMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IHJ1bGVzID0gYXdhaXQgZmV0Y2hPZmZsaW5lQWRUYXJnZXRzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBvbmxpbmVSdWxlcyA9IGF3YWl0IGZldGNoT25saW5lQWRUYXJnZXRzKCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBtZXJnZSBvZmZsaW5lIGFuZCBvbmxpbmUgcnVsZXNcclxuICAgICAgLy8gaWYgdGhlcmUgYXJlIGFueSBjb25mbGljdHMsIG9ubGluZSBydWxlcyB3aWxsIHRha2UgcHJlY2VkZW5jZVxyXG4gICAgICBjb25zdCBvbmxpbmVSZW1vdmVkID0gcnVsZXMuZmlsdGVyKHJ1bGUgPT4gIW9ubGluZVJ1bGVzLmluY2x1ZGVzKHJ1bGUpKTtcclxuICAgICAgcnVsZXMgPSBbLi4ub25saW5lUmVtb3ZlZCwgLi4ub25saW5lUnVsZXNdO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gZmV0Y2ggb25saW5lIGFkIHJ1bGVzXCIsIGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkVGFyZ2V0cyA9IHJ1bGVzO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFkVGFyZ2V0cztcclxufVxyXG5cclxuIiwiaW1wb3J0IGJyb3dzZXIgZnJvbSAnd2ViZXh0ZW5zaW9uLXBvbHlmaWxsJztcclxuaW1wb3J0IHsgZ2V0Q29uZmlnLCBsb2FkQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2luZGV4JztcclxuaW1wb3J0IHsgZmV0Y2hSZXBvIH0gZnJvbSAnLi4vZ2xvYmFsJztcclxuaW1wb3J0IHsgQmxvY2tlZFNpdGUgfSBmcm9tICcuL21vZGVsJztcclxuaW1wb3J0IHsgU2VyaWFsaXplZEJsb2NrZWRTaXRlIH0gZnJvbSAnLi9pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBzZXJpYWxpemVSZWdleCB9IGZyb20gJy4uL3JlZ2V4L2luZGV4JztcclxuXHJcbmxldCBibG9ja1J1bGVzQ2FjaGU6IEJsb2NrZWRTaXRlW107XHJcblxyXG4vKipcclxuICogRmV0Y2hlcyBSdWxlcyBmcm9tIGAvZmlsdGVyL2Jsb2NrZWRTaXRlcy5qc29uYFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxCbG9ja2VkU2l0ZVtdPn0gUnVsZXNcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGZldGNoTG9jYWxCbG9ja1J1bGVzKCk6IFByb21pc2U8QmxvY2tlZFNpdGVbXT4ge1xyXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBmZXRjaFJlcG8oXCIvZmlsdGVyL2Jsb2NrZWRTaXRlcy5qc29uXCIsIHtyZXBvOiBmYWxzZX0pO1xyXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGRhdGEuanNvbigpO1xyXG4gIGlmIChBcnJheS5pc0FycmF5KHJlcykpIHtcclxuICAgIHJldHVybiByZXMubWFwKEJsb2NrZWRTaXRlLmZyb21TZXJpYWxpemVkKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZldGNoZXMgTGF0ZXN0IFJ1bGUgZGF0YSBmcm9tIEdpdEh1YiBSZXBvc2l0b3J5XHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPEJsb2NrZWRTaXRlW10+fSBSdWxlc1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmxpbmVCbG9ja1J1bGVzKCk6IFByb21pc2U8QmxvY2tlZFNpdGVbXT4ge1xyXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBmZXRjaFJlcG8oXCIvZmlsdGVyL2Jsb2NrZWRTaXRlcy5qc29uXCIsIHtyZXBvOiB0cnVlfSk7XHJcbiAgY29uc3QgcmVzID0gYXdhaXQgZGF0YS5qc29uKCk7XHJcbiAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKCkgPz8gYXdhaXQgbG9hZENvbmZpZygpO1xyXG4gIGlmIChBcnJheS5pc0FycmF5KHJlcykpIHtcclxuICAgIGNvbmZpZy5ibG9ja2VkLm9ubGluZVJ1bGVzID0gcmVzO1xyXG4gICAgYXdhaXQgYnJvd3Nlci5zdG9yYWdlLnN5bmMuc2V0KGNvbmZpZyk7XHJcblxyXG4gICAgcmV0dXJuIHJlcy5tYXAoQmxvY2tlZFNpdGUuZnJvbVNlcmlhbGl6ZWQpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtdO1xyXG59XHJcblxyXG4vKipcclxuICogVXNlIHRoZSBjYWNoZSBpZiBhdmFpbGFibGUsXHJcbiAqIEVsc2UgZmV0Y2ggdGhlIGxhdGVzdCBydWxlcyBmcm9tIEdpdEh1YiBSZXBvc2l0b3J5XHJcbiAqIChDYW4gYmUgdXNlZCBmb3Igc3luYylcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRPbmxpbmVCbG9ja1J1bGVzKCk6IFByb21pc2U8QmxvY2tlZFNpdGVbXT4ge1xyXG4gIGxldCBjb25maWcgPSBhd2FpdCBnZXRDb25maWcoKTtcclxuICBpZiAoY29uZmlnPy5ibG9ja2VkPy5vbmxpbmVSdWxlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBmZXRjaE9ubGluZUJsb2NrUnVsZXMoKTtcclxuICAgICAgY29uZmlnID0gZ2V0Q29uZmlnKCk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBmZXRjaCBvbmxpbmUgYmxvY2sgcnVsZXNcIiwgZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbmZpZy5ibG9ja2VkLm9ubGluZVJ1bGVzLm1hcChCbG9ja2VkU2l0ZS5mcm9tU2VyaWFsaXplZCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVc2UgY2FjaGUgaWYgYXZhaWxhYmxlLCBcclxuICogb3RoZXJ3aXNlIGZldGNoZXMgUnVsZXMgZnJvbSBgL2ZpbHRlci9yZWRpcmVjdGVkU2l0ZXMuanNvbmBcclxuICogQHJldHVybnMge1Byb21pc2U8UmVkaXJlY3RUYXJnZXRTaXRlW10+fSBSdWxlc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEJsb2NrUnVsZXMoKTogQmxvY2tlZFNpdGVbXSB8IHVuZGVmaW5lZCB7XHJcbiAgaWYgKGJsb2NrUnVsZXNDYWNoZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAvLyBmZXRjaEJsb2NrUnVsZXMgaXMgcmVxdWlyZWQhIVxyXG4gICAgY29uc29sZS53YXJuKFwiQmxvY2sgUnVsZXMgbm90IGZldGNoZWQgeWV0LiBQbGVhc2UgY2FsbCBmZXRjaEJsb2NrUnVsZXMoKSBmaXJzdC5cIilcclxuICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYmxvY2tSdWxlc0NhY2hlO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZEJsb2NrUnVsZXMoKTogUHJvbWlzZTxCbG9ja2VkU2l0ZVtdPiB7XHJcbiAgY29uc3QgbG9jYWxSdWxlcyA9IGF3YWl0IGZldGNoTG9jYWxCbG9ja1J1bGVzKCk7XHJcbiAgY29uc3Qgb25saW5lUnVsZXMgPSBhd2FpdCBnZXRPbmxpbmVCbG9ja1J1bGVzKCk7XHJcbiAgXHJcbiAgLy8gbWVyZ2UgdHdvIHJ1bGVzLiBidXQgaWYgdGhlcmUgaXMgZHVwbGljYXRlIG9uIG9ubGluZSxcclxuICAvLyByZW1vdmUgdGhlIGxvY2FsIG9uZS5cclxuICBjb25zdCBkZWR1cHBlZExvY2FsUnVsZXMgPSBsb2NhbFJ1bGVzLmZpbHRlcigobCkgPT4gIW9ubGluZVJ1bGVzLmZpbmQobiA9PiBuLmlkID09PSBsLmlkKSk7XHJcbiAgYmxvY2tSdWxlc0NhY2hlID0gWy4uLm9ubGluZVJ1bGVzLCAuLi5kZWR1cHBlZExvY2FsUnVsZXNdO1xyXG5cclxuICByZXR1cm4gYmxvY2tSdWxlc0NhY2hlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplQmxvY2tSdWxlKHJ1bGU6IEJsb2NrZWRTaXRlKTogU2VyaWFsaXplZEJsb2NrZWRTaXRlIHtcclxuICByZXR1cm4ge1xyXG4gICAgaWQ6IHJ1bGUuaWQsXHJcbiAgICBncm91cDogcnVsZS5ncm91cCxcclxuICAgIG5hbWU6IHJ1bGUubmFtZSxcclxuICAgIGJhc2VVUkw6IHJ1bGUuYmFzZVVSTCxcclxuICAgIGFydGljbGVWaWV3OiBydWxlLmFydGljbGVWaWV3ID8gc2VyaWFsaXplUmVnZXgocnVsZS5hcnRpY2xlVmlldykgOiB1bmRlZmluZWQsXHJcbiAgICBzZWFyY2hWaWV3OiBydWxlLnNlYXJjaFZpZXcgPyBzZXJpYWxpemVSZWdleChydWxlLnNlYXJjaFZpZXcpIDogdW5kZWZpbmVkLFxyXG4gICAgcmVkaXJlY3Q6IHJ1bGUucmVkaXJlY3QsXHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgQ29uZmlnSW50ZXJmYWNlIH0gZnJvbSBcIi4uL2NvbmZpZy9pbnRlcmZhY2VcIjtcclxuaW1wb3J0IHsgZ2V0QmxvY2tSdWxlcywgbG9hZEJsb2NrUnVsZXMgfSBmcm9tIFwiLi9ibG9ja1wiO1xyXG5pbXBvcnQgeyBCbG9ja2VkU2l0ZSB9IGZyb20gXCIuL21vZGVsXCI7XHJcblxyXG4vKipcclxuICogR2V0IGVuYWJsZWQgcnVsZXMgdmlhIHRoZSBjb25maWdcclxuICogQHBhcmFtIGNvbmZpZyBjb25maWcgb2JqZWN0XHJcbiAqIEByZXR1cm5zIGJsb2NrZWQgc2l0ZSBydWxlc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGl2ZVJ1bGVzRnJvbUNvbmZpZyhjb25maWc6IENvbmZpZ0ludGVyZmFjZSk6IEJsb2NrZWRTaXRlW10gfCB1bmRlZmluZWQge1xyXG4gIHJldHVybiBnZXRBY3RpdmVSdWxlcyhPYmplY3Qua2V5cyhjb25maWcuYmxvY2tlZC5ncm91cCA/PyB7fSksIE9iamVjdC5rZXlzKGNvbmZpZy5ibG9ja2VkLnNpdGUgPz8ge30pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGl2ZVJ1bGVzKGdyb3Vwczogc3RyaW5nW10gPSBbXSwgc2l0ZXM6IHN0cmluZ1tdID0gW10pOiBCbG9ja2VkU2l0ZVtdIHwgdW5kZWZpbmVkIHtcclxuICBjb25zdCBhdmFpbGFibGVSdWxlcyA9IGdldEJsb2NrUnVsZXMoKTtcclxuICBpZiAoIWF2YWlsYWJsZVJ1bGVzKSByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICBjb25zdCBydWxlczogQmxvY2tlZFNpdGVbXSA9IFtdO1xyXG5cclxuICBpZiAoZ3JvdXBzLmxlbmd0aCA+IDApIHtcclxuICAgIHJ1bGVzLnB1c2goLi4uYXZhaWxhYmxlUnVsZXMuZmlsdGVyKHJ1bGUgPT4gcnVsZS5ncm91cC5maW5kKGEgPT4gZ3JvdXBzLmluY2x1ZGVzKGEpKSAhPT0gdW5kZWZpbmVkKSk7XHJcbiAgfVxyXG5cclxuICBpZiAoc2l0ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgcnVsZXMucHVzaCguLi5hdmFpbGFibGVSdWxlcy5maWx0ZXIocnVsZSA9PiBzaXRlcy5pbmNsdWRlcyhydWxlLmlkKSkpO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXNcclxuICByZXR1cm4gcnVsZXMuZmlsdGVyKChydWxlLCBpbmRleCwgc2VsZikgPT4gc2VsZi5maW5kSW5kZXgociA9PiByLmlkID09PSBydWxlLmlkKSA9PT0gaW5kZXgpO1xyXG59XHJcbiIsImltcG9ydCB7IGRlc2VyaWFsaXplUmVnZXggfSBmcm9tIFwiLi4vcmVnZXgvaW5kZXhcIjtcclxuaW1wb3J0IHsgQmxvY2tlZFNpdGVNb2RlbCwgU2VyaWFsaXplZEJsb2NrZWRTaXRlIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmxvY2tlZFNpdGUgaW1wbGVtZW50cyBCbG9ja2VkU2l0ZU1vZGVsIHtcclxuICBwdWJsaWMgaWQ6IHN0cmluZztcclxuICBwdWJsaWMgZ3JvdXA6IHN0cmluZ1tdO1xyXG4gIHB1YmxpYyBuYW1lPzogc3RyaW5nO1xyXG4gIHB1YmxpYyBiYXNlVVJMOiBzdHJpbmc7XHJcbiAgcHVibGljIGFydGljbGVWaWV3PzogUmVnRXhwO1xyXG4gIHB1YmxpYyBzZWFyY2hWaWV3PzogUmVnRXhwO1xyXG4gIHB1YmxpYyByZWRpcmVjdD86IGJvb2xlYW47XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNpdGU6IFNlcmlhbGl6ZWRCbG9ja2VkU2l0ZSkge1xyXG4gICAgdGhpcy5pZCA9IHNpdGUuaWQ7XHJcbiAgICB0aGlzLmdyb3VwID0gc2l0ZS5ncm91cDtcclxuICAgIHRoaXMubmFtZSA9IHNpdGUubmFtZTtcclxuICAgIHRoaXMuYmFzZVVSTCA9IHNpdGUuYmFzZVVSTDtcclxuICAgIHRoaXMuYXJ0aWNsZVZpZXcgPSBzaXRlLmFydGljbGVWaWV3ICE9PSB1bmRlZmluZWQgPyBkZXNlcmlhbGl6ZVJlZ2V4KHNpdGUuYXJ0aWNsZVZpZXcpIDogdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5zZWFyY2hWaWV3ID0gc2l0ZS5zZWFyY2hWaWV3ICE9PSB1bmRlZmluZWQgPyBkZXNlcmlhbGl6ZVJlZ2V4KHNpdGUuc2VhcmNoVmlldykgOiB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLnJlZGlyZWN0ID0gc2l0ZS5yZWRpcmVjdDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNlcmlhbGl6ZWQoc2l0ZTogU2VyaWFsaXplZEJsb2NrZWRTaXRlKTogQmxvY2tlZFNpdGUge1xyXG4gICAgcmV0dXJuIG5ldyBCbG9ja2VkU2l0ZShzaXRlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0VGFyZ2V0VVJMKHJhd1VybDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmF3VXJsKTtcclxuICAgIHJldHVybiB1cmwucGF0aG5hbWUgKyAodXJsLnNlYXJjaCB8fCBcIlwiKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpc0luU2l0ZShyYXdVcmw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChyYXdVcmwpO1xyXG4gICAgcmV0dXJuIHVybC5ob3N0bmFtZSA9PT0gdGhpcy5iYXNlVVJMO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzU2VhcmNoVmlldyhyYXdVcmw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuc2VhcmNoVmlldyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNlYXJjaFZpZXcubGFzdEluZGV4ID0gMDtcclxuICAgIHJldHVybiB0aGlzLnNlYXJjaFZpZXcudGVzdCh0aGlzLmdldFRhcmdldFVSTChyYXdVcmwpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpc0FydGljbGVWaWV3KHJhd1VybDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5hcnRpY2xlVmlldyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFydGljbGVWaWV3Lmxhc3RJbmRleCA9IDA7XHJcbiAgICByZXR1cm4gdGhpcy5hcnRpY2xlVmlldy50ZXN0KHRoaXMuZ2V0VGFyZ2V0VVJMKHJhd1VybCkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldFF1ZXJ5KHJhd1VybDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgIHJldHVybiB0aGlzLmdldFNlYXJjaFF1ZXJ5KHJhd1VybCkgPz8gdGhpcy5nZXRBcnRpY2xlTmFtZShyYXdVcmwpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldFNlYXJjaFF1ZXJ5KHJhd1VybDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgIGlmICh0aGlzLnNlYXJjaFZpZXcgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2VhcmNoVmlldy5sYXN0SW5kZXggPSAwO1xyXG4gICAgY29uc3QgbWF0Y2ggPSB0aGlzLnNlYXJjaFZpZXcuZXhlYyh0aGlzLmdldFRhcmdldFVSTChyYXdVcmwpKTtcclxuICAgIGlmIChtYXRjaCA9PT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtYXRjaC5ncm91cHM/LnF1ZXJ5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgLy8gY2hlY2sgaWYgaXQgaXMgdXJsIGVuY29kZWRcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoLmdyb3Vwcy5xdWVyeSk7XHJcbiAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIHJldHVybiBtYXRjaC5ncm91cHMucXVlcnk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEFydGljbGVOYW1lKHJhd1VybDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgIGlmICh0aGlzLmFydGljbGVWaWV3ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFydGljbGVWaWV3Lmxhc3RJbmRleCA9IDA7XHJcbiAgICBjb25zdCBtYXRjaCA9IHRoaXMuYXJ0aWNsZVZpZXcuZXhlYyh0aGlzLmdldFRhcmdldFVSTChyYXdVcmwpKTtcclxuICAgIGlmIChtYXRjaCA9PT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtYXRjaC5ncm91cHM/LnF1ZXJ5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgLy8gY2hlY2sgaWYgaXQgaXMgdXJsIGVuY29kZWRcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoLmdyb3Vwcy5xdWVyeSk7XHJcbiAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIHJldHVybiBtYXRjaC5ncm91cHMucXVlcnk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBnZXRDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL2luZGV4XCI7XHJcbmltcG9ydCB7IGZldGNoUmVwbyB9IGZyb20gXCIuLi9nbG9iYWxcIjtcclxuaW1wb3J0IHsgUmVkaXJlY3RUYXJnZXRTaXRlIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XHJcblxyXG5sZXQgcmVkaXJlY3RUYXJnZXRzOiBSZWRpcmVjdFRhcmdldFNpdGVbXTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWRpcmVjdFRhcmdldHMoKTogUmVkaXJlY3RUYXJnZXRTaXRlW10ge1xyXG4gIGlmIChyZWRpcmVjdFRhcmdldHMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlZGlyZWN0VGFyZ2V0cztcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hPZmZsaW5lUmVkaXJlY3RUYXJnZXRzKCk6IFByb21pc2U8UmVkaXJlY3RUYXJnZXRTaXRlW10+IHtcclxuICBjb25zdCBkYXRhID0gYXdhaXQgZmV0Y2hSZXBvKFwiL2ZpbHRlci9yZWRpcmVjdGVkU2l0ZXMuanNvblwiLCB7cmVwbzogZmFsc2V9KTtcclxuICBjb25zdCByZXMgPSBhd2FpdCBkYXRhLmpzb24oKTtcclxuICBpZiAoQXJyYXkuaXNBcnJheShyZXMpKSB7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtdO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmZXRjaE9ubGluZVJlZGlyZWN0VGFyZ2V0cygpOiBQcm9taXNlPFJlZGlyZWN0VGFyZ2V0U2l0ZVtdPiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBmZXRjaFJlcG8oXCIvZmlsdGVyL3JlZGlyZWN0ZWRTaXRlcy5qc29uXCIsIHtyZXBvOiB0cnVlfSk7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBkYXRhLmpzb24oKTtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHJlcykpIHtcclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHJldHVybiBbXTtcclxuICB9IGNhdGNoKGUpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUmVkaXJlY3Rpb25SdWxlcygpOiBQcm9taXNlPFJlZGlyZWN0VGFyZ2V0U2l0ZVtdPiB7XHJcbiAgaWYgKHJlZGlyZWN0VGFyZ2V0cyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgcnVsZXMgPSBhd2FpdCBmZXRjaE9mZmxpbmVSZWRpcmVjdFRhcmdldHMoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IG9ubGluZVJ1bGVzID0gYXdhaXQgZmV0Y2hPbmxpbmVSZWRpcmVjdFRhcmdldHMoKTtcclxuICAgICAgXHJcbiAgICAgIC8vIG1lcmdlIG9mZmxpbmUgYW5kIG9ubGluZSBydWxlc1xyXG4gICAgICAvLyBpZiB0aGVyZSBhcmUgYW55IGNvbmZsaWN0cywgb25saW5lIHJ1bGVzIHdpbGwgdGFrZSBwcmVjZWRlbmNlXHJcbiAgICAgIGNvbnN0IG9ubGluZVJlbW92ZWQgPSBydWxlcy5maWx0ZXIocnVsZSA9PiAhb25saW5lUnVsZXMuZmluZChyID0+IHIuaWQgPT09IHJ1bGUuaWQpKTtcclxuICAgICAgcnVsZXMgPSBbLi4ub25saW5lUmVtb3ZlZCwgLi4ub25saW5lUnVsZXNdO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gZmV0Y2ggb25saW5lIHJlZGlyZWN0IHJ1bGVzXCIsIGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZGlyZWN0VGFyZ2V0cyA9IHJ1bGVzO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlZGlyZWN0VGFyZ2V0cztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVJlZGlyZWN0cyhxdWVyeTogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZygpO1xyXG4gIGNvbnN0IHJ1bGVzID0gZ2V0UmVkaXJlY3RUYXJnZXRzKCk7XHJcblxyXG4gIGNvbnN0IHVybHMgPSBbXTtcclxuXHJcbiAgZm9yIChjb25zdCBpZCBpbiBPYmplY3Qua2V5cyhjb25maWc/LnJlZGlyZWN0ZWQgPz8ge30pKSB7XHJcbiAgICBpZiAoY29uZmlnLnJlZGlyZWN0ZWRbaWRdKSB7XHJcbiAgICAgIGNvbnN0IHJ1bGUgPSBydWxlcy5maW5kKG4gPT4gbi5pZCA9PT0gaWQpO1xyXG4gICAgICBpZiAoIXJ1bGUpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgbGV0IHRtcFF1ZXJ5ID0gcXVlcnk7XHJcbiAgICAgIGlmIChydWxlLnF1ZXJ5UHJvY2Vzc2luZykge1xyXG4gICAgICAgIGZvciAoY29uc3QgcmVwbGFjZVJlcSBvZiBydWxlLnF1ZXJ5UHJvY2Vzc2luZy5yZXBsYWNlKSB7XHJcbiAgICAgICAgICBjb25zdCBmcm9tUmVnZXggPSBuZXcgUmVnRXhwKHJlcGxhY2VSZXEuZnJvbSwgXCJnXCIpO1xyXG4gICAgICAgICAgY29uc3QgdG8gPSByZXBsYWNlUmVxLnRvO1xyXG4gICAgICAgICAgdG1wUXVlcnkgPSB0bXBRdWVyeS5yZXBsYWNlKGZyb21SZWdleCwgdG8pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcXVlcnlSZXBsYWNlUmVnZXggPSBuZXcgUmVnRXhwKFwie3txdWVyeX19XCIsIFwiZ1wiKTtcclxuICAgICAgY29uc3QgbGFuZ1JlcGxhY2VSZWdleCA9IG5ldyBSZWdFeHAoXCJ7e2xhbmd9fVwiLCBcImdcIik7XHJcblxyXG4gICAgICBjb25zdCBsYW5nQ29kZSA9IC8o6rCALe2eoykrLy50ZXN0KHF1ZXJ5KSA/IFwia29cIiA6IC9eW0EtejAtOSBdJC8udGVzdCh0bXBRdWVyeSkgPyBcImVuXCIgOiAoL14oKFxcdyl7Mn0pLy5leGVjKG5hdmlnYXRvci5sYW5ndWFnZSkgPz8gWydrbycsICdLUiddKVsxXTtcclxuICAgICAgY29uc3QgZmluYWxVUkwgPSBydWxlLnJlZGlyZWN0TG9jYXRpb24ucmVwbGFjZShxdWVyeVJlcGxhY2VSZWdleCwgcXVlcnkpLnJlcGxhY2UobGFuZ1JlcGxhY2VSZWdleCwgbGFuZ0NvZGUpO1xyXG5cclxuICAgICAgdXJscy5wdXNoKGZpbmFsVVJMKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB1cmxzO1xyXG59IiwiaW1wb3J0IHsgQ29uZmlnSW50ZXJmYWNlIH0gZnJvbSBcIi4vY29uZmlnL2ludGVyZmFjZVwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVuZXNjYXBlUmVnZXhTdHJpbmcoc3RyaW5nOiBzdHJpbmcpIHtcclxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1xcXFwoW1xcL1xcLlxcKlxcK1xcP1xcfFxcKFxcKVxcW1xcXVxce1xcfVxcXFxcXCRcXF5cXC1dKS9nLCAnJDEnKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzTmFtdUxpdmVCbG9ja2VkKGNvbmZpZzogQ29uZmlnSW50ZXJmYWNlKSB7XHJcbiAgcmV0dXJuIGNvbmZpZyAmJiBjb25maWcuYmxvY2tlZCAmJiAoY29uZmlnLmJsb2NrZWQuZ3JvdXBbXCJuYW11bGl2ZVwiXSB8fCBjb25maWcuYmxvY2tlZC5zaXRlW1wibmFtdWxpdmVcIl0pO1xyXG59XHJcbiIsImltcG9ydCB7IEJsb2NrZWRTaXRlIH0gZnJvbSBcIi4uL2NvbW1vbi9ydWxlcy9tb2RlbFwiO1xyXG5cclxudHlwZSBUYXJnZXRSb3V0aW5lID0gKHJ1bGVzOiBCbG9ja2VkU2l0ZVtdKSA9PiBhbnk7XHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoRW5naW5lRmlsdGVyIHtcclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyB1cmxSZWdleDogUmVnRXhwO1xyXG4gIHB1YmxpYyB0YXJnZXRSb3V0aW5lOiBUYXJnZXRSb3V0aW5lO1xyXG5cclxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHVybFJlZ2V4OiBSZWdFeHAsIHRhcmdldFJvdXRpbmU6IFRhcmdldFJvdXRpbmUpIHtcclxuICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB0aGlzLnVybFJlZ2V4ID0gdXJsUmVnZXg7XHJcbiAgICB0aGlzLnRhcmdldFJvdXRpbmUgPSB0YXJnZXRSb3V0aW5lO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzTWF0Y2godXJsOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnVybFJlZ2V4LnRlc3QodXJsKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBydW5Sb3V0aW5lT25NYXRjaCh1cmw6IHN0cmluZywgLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgdGhpcy50YXJnZXRSb3V0aW5lPik6IGFueSB7XHJcbiAgICBpZiAodGhpcy5pc01hdGNoKHVybCkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0Um91dGluZSguLi5hcmdzKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJpbXBvcnQgeyBCbG9ja2VkU2l0ZSB9IGZyb20gXCIuLi9jb21tb24vcnVsZXMvbW9kZWxcIjtcclxuaW1wb3J0IHsgU2VhcmNoRW5naW5lRmlsdGVyIH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuaW1wb3J0IGRhdW0gZnJvbSBcIi4vc2l0ZXMvZGF1bVwiO1xyXG5pbXBvcnQgZHVja2R1Y2tnbyBmcm9tIFwiLi9zaXRlcy9kdWNrZHVja2dvXCI7XHJcbmltcG9ydCBlY29zaWEgZnJvbSBcIi4vc2l0ZXMvZWNvc2lhXCI7XHJcbmltcG9ydCBnb29nbGUgZnJvbSBcIi4vc2l0ZXMvZ29vZ2xlXCI7XHJcbmltcG9ydCBuYXZlciBmcm9tIFwiLi9zaXRlcy9uYXZlclwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJ1blNlYXJjaEZpbHRlclJvdXRpbmUocnVsZXM6IEJsb2NrZWRTaXRlW10gPSBbXSkge1xyXG4gIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gIGZvciAoY29uc3QgZmlsdGVyIG9mIFtcclxuICAgIGRhdW0sXHJcbiAgICBuYXZlcixcclxuICAgIGdvb2dsZSxcclxuICAgIGVjb3NpYSxcclxuICAgIGR1Y2tkdWNrZ28sXHJcbiAgXSkge1xyXG4gICAgZmlsdGVyLnJ1blJvdXRpbmVPbk1hdGNoKHVybCwgcnVsZXMpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBTZWFyY2hFbmdpbmVGaWx0ZXIgfSBmcm9tIFwiLi4vaW5kZXhcIjtcclxuXHJcbnR5cGUgVGFyZ2V0RWxlbWVudCA9IEhUTUxMSUVsZW1lbnQ7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU2VhcmNoRW5naW5lRmlsdGVyKFxyXG4gICAgXCJEYXVtXCIsXHJcbiAgICAvXmh0dHAoc3wpOlxcL1xcLyh3d3cufHNlYXJjaC58KWRhdW0ubmV0XFwvc2VhcmNoXFw/L2lnLFxyXG4gICAgYXN5bmMgKHJ1bGVzKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0Q2xhc3NlcyA9IFsgJ3dyYXBfY29udCcgXTtcclxuICAgICAgICBzZWFyY2hSZXN1bHRDbGFzc2VzLmZvckVhY2goYXN5bmMgKGN1cnJlbnRDbGFzcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hSZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjdXJyZW50Q2xhc3MpIGFzIHVua25vd25cclxuICAgICAgICAgICAgY29uc3Qga2lsbExpc3Q6IFRhcmdldEVsZW1lbnRbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBzZWFyY2hSZXN1bHQgb2Ygc2VhcmNoUmVzdWx0cyBhcyB1bmtub3duIGFzIFRhcmdldEVsZW1lbnRbXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0QW5jaG9ycyA9IHNlYXJjaFJlc3VsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpIGFzIHVua25vd24gYXMgSFRNTEFuY2hvckVsZW1lbnRbXTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc2VhcmNoUmVzdWx0QW5jaG9yIG9mIHNlYXJjaFJlc3VsdEFuY2hvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZXMuZmluZChuID0+IG4uaXNJblNpdGUoc2VhcmNoUmVzdWx0QW5jaG9yLmhyZWYpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBraWxsTGlzdC5wdXNoKHNlYXJjaFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtpbGwgb2Yga2lsbExpc3QpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAga2lsbC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IFxyXG4gICAgfVxyXG4pOyIsImltcG9ydCB7IFNlYXJjaEVuZ2luZUZpbHRlciB9IGZyb20gXCIuLi9pbmRleFwiO1xyXG5cclxudHlwZSBUYXJnZXRFbGVtZW50ID0gSFRNTERpdkVsZW1lbnQ7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU2VhcmNoRW5naW5lRmlsdGVyKFxyXG4gICAgXCJEdWNrRHVja0dvXCIsXHJcbiAgICAvXmh0dHAoc3wpOlxcL1xcLyh3d3cufHNlYXJjaC58KWR1Y2tkdWNrZ28uY29tXFwvXFw/L2lnLFxyXG4gICAgYXN5bmMgKHJ1bGVzKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0Q2xhc3NlcyA9IFsgJ25ybi1yZWFjdC1kaXYnLCAndGlsZScgXTtcclxuICAgICAgICBzZWFyY2hSZXN1bHRDbGFzc2VzLmZvckVhY2goYXN5bmMgKGN1cnJlbnRDbGFzcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hSZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjdXJyZW50Q2xhc3MpIGFzIHVua25vd25cclxuICAgICAgICAgICAgY29uc3Qga2lsbExpc3Q6IFRhcmdldEVsZW1lbnRbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBzZWFyY2hSZXN1bHQgb2Ygc2VhcmNoUmVzdWx0cyBhcyB1bmtub3duIGFzIFRhcmdldEVsZW1lbnRbXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0QW5jaG9ycyA9IHNlYXJjaFJlc3VsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpIGFzIHVua25vd24gYXMgSFRNTEFuY2hvckVsZW1lbnRbXTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc2VhcmNoUmVzdWx0QW5jaG9yIG9mIHNlYXJjaFJlc3VsdEFuY2hvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZXMuZmluZChuID0+IG4uaXNJblNpdGUoc2VhcmNoUmVzdWx0QW5jaG9yLmhyZWYpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBraWxsTGlzdC5wdXNoKHNlYXJjaFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtpbGwgb2Yga2lsbExpc3QpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAga2lsbC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IFxyXG4gICAgfVxyXG4pO1xyXG4iLCJpbXBvcnQgeyBTZWFyY2hFbmdpbmVGaWx0ZXIgfSBmcm9tIFwiLi4vaW5kZXhcIjtcclxuXHJcblxyXG50eXBlIFRhcmdldEVsZW1lbnQgPSBIVE1MRGl2RWxlbWVudDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBTZWFyY2hFbmdpbmVGaWx0ZXIoXHJcbiAgICBcIkVjb3NpYVwiLFxyXG4gICAgL15odHRwczpcXC9cXC93d3dcXC5lY29zaWFcXC5vcmdcXC8oc2VhcmNofGltYWdlcylcXD8vaWcsXHJcbiAgICBhc3luYyAocnVsZXMpID0+IHtcclxuICAgICAgICBjb25zdCBzZWFyY2hSZXN1bHRDbGFzc2VzID0gWyAncmVzdWx0JywgJ2ltYWdlLXJlc3VsdCcgXTtcclxuICAgICAgICBzZWFyY2hSZXN1bHRDbGFzc2VzLmZvckVhY2goYXN5bmMgKGN1cnJlbnRDbGFzcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hSZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjdXJyZW50Q2xhc3MpIGFzIHVua25vd25cclxuICAgICAgICAgICAgY29uc3Qga2lsbExpc3Q6IFRhcmdldEVsZW1lbnRbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBzZWFyY2hSZXN1bHQgb2Ygc2VhcmNoUmVzdWx0cyBhcyB1bmtub3duIGFzIFRhcmdldEVsZW1lbnRbXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0QW5jaG9ycyA9IHNlYXJjaFJlc3VsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpIGFzIHVua25vd24gYXMgSFRNTEFuY2hvckVsZW1lbnRbXTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc2VhcmNoUmVzdWx0QW5jaG9yIG9mIHNlYXJjaFJlc3VsdEFuY2hvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZXMuZmluZChuID0+IG4uaXNJblNpdGUoc2VhcmNoUmVzdWx0QW5jaG9yLmhyZWYpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBraWxsTGlzdC5wdXNoKHNlYXJjaFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtpbGwgb2Yga2lsbExpc3QpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAga2lsbC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IFxyXG4gICAgfVxyXG4pO1xyXG4iLCJpbXBvcnQgeyBTZWFyY2hFbmdpbmVGaWx0ZXIgfSBmcm9tIFwiLi4vaW5kZXhcIjtcclxuXHJcblxyXG50eXBlIFRhcmdldEVsZW1lbnQgPSBIVE1MRGl2RWxlbWVudDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBTZWFyY2hFbmdpbmVGaWx0ZXIoXHJcbiAgICBcIkdvb2dsZVwiLFxyXG4gICAgL15odHRwKHN8KTpcXC9cXC8od3d3Lnxjc2UufClnb29nbGUuY29tXFwvc2VhcmNoXFw/L2lnLFxyXG4gICAgYXN5bmMgKHJ1bGVzKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0Q2xhc3NlcyA9IFsgJ3hwZCcsICdlejAybWQnLCAnZycsICdpZk05TycgXTtcclxuICAgICAgICBzZWFyY2hSZXN1bHRDbGFzc2VzLmZvckVhY2goYXN5bmMgKGN1cnJlbnRDbGFzcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hSZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjdXJyZW50Q2xhc3MpIGFzIHVua25vd25cclxuICAgICAgICAgICAgY29uc3Qga2lsbExpc3Q6IFRhcmdldEVsZW1lbnRbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBzZWFyY2hSZXN1bHQgb2Ygc2VhcmNoUmVzdWx0cyBhcyB1bmtub3duIGFzIFRhcmdldEVsZW1lbnRbXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0QW5jaG9ycyA9IHNlYXJjaFJlc3VsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpIGFzIHVua25vd24gYXMgSFRNTEFuY2hvckVsZW1lbnRbXTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc2VhcmNoUmVzdWx0QW5jaG9yIG9mIHNlYXJjaFJlc3VsdEFuY2hvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZXMuZmluZChuID0+IG4uaXNJblNpdGUoc2VhcmNoUmVzdWx0QW5jaG9yLmhyZWYpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBraWxsTGlzdC5wdXNoKHNlYXJjaFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtpbGwgb2Yga2lsbExpc3QpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAga2lsbC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IFxyXG4gICAgfVxyXG4pO1xyXG4iLCJpbXBvcnQgeyBTZWFyY2hFbmdpbmVGaWx0ZXIgfSBmcm9tIFwiLi4vaW5kZXhcIjtcclxuXHJcbnR5cGUgVGFyZ2V0RWxlbWVudCA9IEhUTUxMSUVsZW1lbnQ7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU2VhcmNoRW5naW5lRmlsdGVyKFxyXG4gICAgXCJOYXZlclwiLFxyXG4gICAgL15odHRwKHN8KTpcXC9cXC8od3d3LnxzZWFyY2gufCluYXZlci5jb21cXC8vaWcsXHJcbiAgICBhc3luYyAocnVsZXMpID0+IHtcclxuICAgICAgICBjb25zdCBzZWFyY2hSZXN1bHRDbGFzc2VzID0gWyAnc2hfd2ViX3RvcCcsICdieCcgXTtcclxuICAgICAgICBzZWFyY2hSZXN1bHRDbGFzc2VzLmZvckVhY2goYXN5bmMgKGN1cnJlbnRDbGFzcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hSZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjdXJyZW50Q2xhc3MpIGFzIHVua25vd25cclxuICAgICAgICAgICAgY29uc3Qga2lsbExpc3Q6IFRhcmdldEVsZW1lbnRbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBzZWFyY2hSZXN1bHQgb2Ygc2VhcmNoUmVzdWx0cyBhcyB1bmtub3duIGFzIFRhcmdldEVsZW1lbnRbXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0QW5jaG9ycyA9IHNlYXJjaFJlc3VsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpIGFzIHVua25vd24gYXMgSFRNTEFuY2hvckVsZW1lbnRbXTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc2VhcmNoUmVzdWx0QW5jaG9yIG9mIHNlYXJjaFJlc3VsdEFuY2hvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZXMuZmluZChuID0+IG4uaXNJblNpdGUoc2VhcmNoUmVzdWx0QW5jaG9yLmhyZWYpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBraWxsTGlzdC5wdXNoKHNlYXJjaFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtpbGwgb2Yga2lsbExpc3QpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAga2lsbC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IFxyXG4gICAgfVxyXG4pOyIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiLCBbXCJtb2R1bGVcIl0sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZmFjdG9yeShtb2R1bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QpO1xuICAgIGdsb2JhbC5icm93c2VyID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsVGhpcyA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgLyogd2ViZXh0ZW5zaW9uLXBvbHlmaWxsIC0gdjAuMTIuMCAtIFR1ZSBNYXkgMTQgMjAyNCAxODowMToyOSAqL1xuICAvKiAtKi0gTW9kZTogaW5kZW50LXRhYnMtbW9kZTogbmlsOyBqcy1pbmRlbnQtbGV2ZWw6IDIgLSotICovXG4gIC8qIHZpbTogc2V0IHN0cz0yIHN3PTIgZXQgdHc9ODA6ICovXG4gIC8qIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAgICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICAgKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cDovL21vemlsbGEub3JnL01QTC8yLjAvLiAqL1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBpZiAoIShnbG9iYWxUaGlzLmNocm9tZSAmJiBnbG9iYWxUaGlzLmNocm9tZS5ydW50aW1lICYmIGdsb2JhbFRoaXMuY2hyb21lLnJ1bnRpbWUuaWQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBzY3JpcHQgc2hvdWxkIG9ubHkgYmUgbG9hZGVkIGluIGEgYnJvd3NlciBleHRlbnNpb24uXCIpO1xuICB9XG4gIGlmICghKGdsb2JhbFRoaXMuYnJvd3NlciAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZSAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZS5pZCkpIHtcbiAgICBjb25zdCBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UgPSBcIlRoZSBtZXNzYWdlIHBvcnQgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZC5cIjtcblxuICAgIC8vIFdyYXBwaW5nIHRoZSBidWxrIG9mIHRoaXMgcG9seWZpbGwgaW4gYSBvbmUtdGltZS11c2UgZnVuY3Rpb24gaXMgYSBtaW5vclxuICAgIC8vIG9wdGltaXphdGlvbiBmb3IgRmlyZWZveC4gU2luY2UgU3BpZGVybW9ua2V5IGRvZXMgbm90IGZ1bGx5IHBhcnNlIHRoZVxuICAgIC8vIGNvbnRlbnRzIG9mIGEgZnVuY3Rpb24gdW50aWwgdGhlIGZpcnN0IHRpbWUgaXQncyBjYWxsZWQsIGFuZCBzaW5jZSBpdCB3aWxsXG4gICAgLy8gbmV2ZXIgYWN0dWFsbHkgbmVlZCB0byBiZSBjYWxsZWQsIHRoaXMgYWxsb3dzIHRoZSBwb2x5ZmlsbCB0byBiZSBpbmNsdWRlZFxuICAgIC8vIGluIEZpcmVmb3ggbmVhcmx5IGZvciBmcmVlLlxuICAgIGNvbnN0IHdyYXBBUElzID0gZXh0ZW5zaW9uQVBJcyA9PiB7XG4gICAgICAvLyBOT1RFOiBhcGlNZXRhZGF0YSBpcyBhc3NvY2lhdGVkIHRvIHRoZSBjb250ZW50IG9mIHRoZSBhcGktbWV0YWRhdGEuanNvbiBmaWxlXG4gICAgICAvLyBhdCBidWlsZCB0aW1lIGJ5IHJlcGxhY2luZyB0aGUgZm9sbG93aW5nIFwiaW5jbHVkZVwiIHdpdGggdGhlIGNvbnRlbnQgb2YgdGhlXG4gICAgICAvLyBKU09OIGZpbGUuXG4gICAgICBjb25zdCBhcGlNZXRhZGF0YSA9IHtcbiAgICAgICAgXCJhbGFybXNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjbGVhckFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJvb2ttYXJrc1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDaGlsZHJlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFN1YlRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJicm93c2VyQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImRpc2FibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlbmFibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuUG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NpbmdEYXRhXCI6IHtcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNhY2hlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ29va2llc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZURvd25sb2Fkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZvcm1EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlSGlzdG9yeVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUxvY2FsU3RvcmFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBhc3N3b3Jkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBsdWdpbkRhdGFcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbW1hbmRzXCI6IHtcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbnRleHRNZW51c1wiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb29raWVzXCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbENvb2tpZVN0b3Jlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRldnRvb2xzXCI6IHtcbiAgICAgICAgICBcImluc3BlY3RlZFdpbmRvd1wiOiB7XG4gICAgICAgICAgICBcImV2YWxcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDIsXG4gICAgICAgICAgICAgIFwic2luZ2xlQ2FsbGJhY2tBcmdcIjogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicGFuZWxzXCI6IHtcbiAgICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDMsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVsZW1lbnRzXCI6IHtcbiAgICAgICAgICAgICAgXCJjcmVhdGVTaWRlYmFyUGFuZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkb3dubG9hZHNcIjoge1xuICAgICAgICAgIFwiY2FuY2VsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZG93bmxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlcmFzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZpbGVJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhdXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRmlsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlc3VtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNob3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJleHRlbnNpb25cIjoge1xuICAgICAgICAgIFwiaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImlzQWxsb3dlZEluY29nbml0b0FjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhpc3RvcnlcIjoge1xuICAgICAgICAgIFwiYWRkVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlUmFuZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVVcmxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRWaXNpdHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpMThuXCI6IHtcbiAgICAgICAgICBcImRldGVjdExhbmd1YWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWNjZXB0TGFuZ3VhZ2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRlbnRpdHlcIjoge1xuICAgICAgICAgIFwibGF1bmNoV2ViQXV0aEZsb3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpZGxlXCI6IHtcbiAgICAgICAgICBcInF1ZXJ5U3RhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYW5hZ2VtZW50XCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRFbmFibGVkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidW5pbnN0YWxsU2VsZlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm5vdGlmaWNhdGlvbnNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQZXJtaXNzaW9uTGV2ZWxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWdlQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0SWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGVybWlzc2lvbnNcIjoge1xuICAgICAgICAgIFwiY29udGFpbnNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicnVudGltZVwiOiB7XG4gICAgICAgICAgXCJnZXRCYWNrZ3JvdW5kUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBsYXRmb3JtSW5mb1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5PcHRpb25zUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlcXVlc3RVcGRhdGVDaGVja1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmRNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE5hdGl2ZU1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRVbmluc3RhbGxVUkxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXNzaW9uc1wiOiB7XG4gICAgICAgICAgXCJnZXREZXZpY2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UmVjZW50bHlDbG9zZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN0b3JlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic3RvcmFnZVwiOiB7XG4gICAgICAgICAgXCJsb2NhbFwiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1hbmFnZWRcIjoge1xuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic3luY1wiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInRhYnNcIjoge1xuICAgICAgICAgIFwiY2FwdHVyZVZpc2libGVUYWJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRpc2NhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkdXBsaWNhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJleGVjdXRlU2NyaXB0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0JhY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0ZvcndhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWdobGlnaHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpbnNlcnRDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicXVlcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZWxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0b3BTaXRlc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3ZWJOYXZpZ2F0aW9uXCI6IHtcbiAgICAgICAgICBcImdldEFsbEZyYW1lc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZyYW1lXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViUmVxdWVzdFwiOiB7XG4gICAgICAgICAgXCJoYW5kbGVyQmVoYXZpb3JDaGFuZ2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2luZG93c1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDdXJyZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0TGFzdEZvY3VzZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhhcGlNZXRhZGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwaS1tZXRhZGF0YS5qc29uIGhhcyBub3QgYmVlbiBpbmNsdWRlZCBpbiBicm93c2VyLXBvbHlmaWxsXCIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEEgV2Vha01hcCBzdWJjbGFzcyB3aGljaCBjcmVhdGVzIGFuZCBzdG9yZXMgYSB2YWx1ZSBmb3IgYW55IGtleSB3aGljaCBkb2VzXG4gICAgICAgKiBub3QgZXhpc3Qgd2hlbiBhY2Nlc3NlZCwgYnV0IGJlaGF2ZXMgZXhhY3RseSBhcyBhbiBvcmRpbmFyeSBXZWFrTWFwXG4gICAgICAgKiBvdGhlcndpc2UuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY3JlYXRlSXRlbVxuICAgICAgICogICAgICAgIEEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2YWx1ZSBmb3IgYW55XG4gICAgICAgKiAgICAgICAga2V5IHdoaWNoIGRvZXMgbm90IGV4aXN0LCB0aGUgZmlyc3QgdGltZSBpdCBpcyBhY2Nlc3NlZC4gVGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gcmVjZWl2ZXMsIGFzIGl0cyBvbmx5IGFyZ3VtZW50LCB0aGUga2V5IGJlaW5nIGNyZWF0ZWQuXG4gICAgICAgKi9cbiAgICAgIGNsYXNzIERlZmF1bHRXZWFrTWFwIGV4dGVuZHMgV2Vha01hcCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKGNyZWF0ZUl0ZW0sIGl0ZW1zID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc3VwZXIoaXRlbXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlSXRlbSA9IGNyZWF0ZUl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZ2V0KGtleSkge1xuICAgICAgICAgIGlmICghdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB0aGlzLmNyZWF0ZUl0ZW0oa2V5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzdXBlci5nZXQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCB3aXRoIGEgYHRoZW5gIG1ldGhvZCwgYW5kIGNhblxuICAgICAgICogdGhlcmVmb3JlIGJlIGFzc3VtZWQgdG8gYmVoYXZlIGFzIGEgUHJvbWlzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0LlxuICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZW5hYmxlLlxuICAgICAgICovXG4gICAgICBjb25zdCBpc1RoZW5hYmxlID0gdmFsdWUgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB3aGljaCwgd2hlbiBjYWxsZWQsIHdpbGwgcmVzb2x2ZSBvciByZWplY3RcbiAgICAgICAqIHRoZSBnaXZlbiBwcm9taXNlIGJhc2VkIG9uIGhvdyBpdCBpcyBjYWxsZWQ6XG4gICAgICAgKlxuICAgICAgICogLSBJZiwgd2hlbiBjYWxsZWQsIGBjaHJvbWUucnVudGltZS5sYXN0RXJyb3JgIGNvbnRhaW5zIGEgbm9uLW51bGwgb2JqZWN0LFxuICAgICAgICogICB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCB3aXRoIHRoYXQgdmFsdWUuXG4gICAgICAgKiAtIElmIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBleGFjdGx5IG9uZSBhcmd1bWVudCwgdGhlIHByb21pc2UgaXNcbiAgICAgICAqICAgcmVzb2x2ZWQgdG8gdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gT3RoZXJ3aXNlLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB0byBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGVcbiAgICAgICAqICAgZnVuY3Rpb24ncyBhcmd1bWVudHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHByb21pc2VcbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVzb2x1dGlvbiBhbmQgcmVqZWN0aW9uIGZ1bmN0aW9ucyBvZiBhXG4gICAgICAgKiAgICAgICAgcHJvbWlzZS5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVzb2x2ZVxuICAgICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVzb2x1dGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVqZWN0XG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZWplY3Rpb24gZnVuY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgd3JhcHBlZCBtZXRob2Qgd2hpY2ggaGFzIGNyZWF0ZWQgdGhlIGNhbGxiYWNrLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZ1xuICAgICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgICAqICAgICAgICBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2ssIGFsdGVybmF0aXZlbHkgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAgICAgICogICAgICAgIGNhbGxiYWNrIGFyZ3VtZW50cyBpcyByZXNvbHZlZC4gQnkgZGVmYXVsdCwgaWYgdGhlIGNhbGxiYWNrXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAgICogICAgICAgIHJlc29sdmVkIHRvIHRoZSBwcm9taXNlLCB3aGlsZSBhbGwgYXJndW1lbnRzIHdpbGwgYmUgcmVzb2x2ZWQgYXNcbiAgICAgICAqICAgICAgICBhbiBhcnJheSBpZiBtdWx0aXBsZSBhcmUgZ2l2ZW4uXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2Z1bmN0aW9ufVxuICAgICAgICogICAgICAgIFRoZSBnZW5lcmF0ZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IG1ha2VDYWxsYmFjayA9IChwcm9taXNlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gKC4uLmNhbGxiYWNrQXJncykgPT4ge1xuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fCBjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzWzBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHBsdXJhbGl6ZUFyZ3VtZW50cyA9IG51bUFyZ3MgPT4gbnVtQXJncyA9PSAxID8gXCJhcmd1bWVudFwiIDogXCJhcmd1bWVudHNcIjtcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBmb3IgYSBtZXRob2Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgbWV0YWRhdGEuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgICAqICAgICAgICBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHdoaWNoIGlzIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1pbkFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBmZXdlciB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAgICogICAgICAgIFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbWF5IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggbW9yZSB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAgICogICAgICAgVGhlIGdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwQXN5bmNGdW5jdGlvbiA9IChuYW1lLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYXN5bmNGdW5jdGlvbldyYXBwZXIodGFyZ2V0LCAuLi5hcmdzKSB7XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhLmZhbGxiYWNrVG9Ob0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgQVBJIG1ldGhvZCBoYXMgY3VycmVudGx5IG5vIGNhbGxiYWNrIG9uIENocm9tZSwgYnV0IGl0IHJldHVybiBhIHByb21pc2Ugb24gRmlyZWZveCxcbiAgICAgICAgICAgICAgLy8gYW5kIHNvIHRoZSBwb2x5ZmlsbCB3aWxsIHRyeSB0byBjYWxsIGl0IHdpdGggYSBjYWxsYmFjayBmaXJzdCwgYW5kIGl0IHdpbGwgZmFsbGJhY2tcbiAgICAgICAgICAgICAgLy8gdG8gbm90IHBhc3NpbmcgdGhlIGNhbGxiYWNrIGlmIHRoZSBmaXJzdCBjYWxsIGZhaWxzLlxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgICAgIH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGNiRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bmFtZX0gQVBJIG1ldGhvZCBkb2Vzbid0IHNlZW0gdG8gc3VwcG9ydCB0aGUgY2FsbGJhY2sgcGFyYW1ldGVyLCBgICsgXCJmYWxsaW5nIGJhY2sgdG8gY2FsbCBpdCB3aXRob3V0IGEgY2FsbGJhY2s6IFwiLCBjYkVycm9yKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEFQSSBtZXRob2QgbWV0YWRhdGEsIHNvIHRoYXQgdGhlIG5leHQgQVBJIGNhbGxzIHdpbGwgbm90IHRyeSB0b1xuICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgdW5zdXBwb3J0ZWQgY2FsbGJhY2sgYW55bW9yZS5cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLm5vQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gZXhpc3RpbmcgbWV0aG9kIG9mIHRoZSB0YXJnZXQgb2JqZWN0LCBzbyB0aGF0IGNhbGxzIHRvIGl0IGFyZVxuICAgICAgICogaW50ZXJjZXB0ZWQgYnkgdGhlIGdpdmVuIHdyYXBwZXIgZnVuY3Rpb24uIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHJlY2VpdmVzLFxuICAgICAgICogYXMgaXRzIGZpcnN0IGFyZ3VtZW50LCB0aGUgb3JpZ2luYWwgYHRhcmdldGAgb2JqZWN0LCBmb2xsb3dlZCBieSBlYWNoIG9mXG4gICAgICAgKiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgb3JpZ2luYWwgdGFyZ2V0IG9iamVjdCB0aGF0IHRoZSB3cmFwcGVkIG1ldGhvZCBiZWxvbmdzIHRvLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbWV0aG9kXG4gICAgICAgKiAgICAgICAgVGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLiBUaGlzIGlzIHVzZWQgYXMgdGhlIHRhcmdldCBvZiB0aGUgUHJveHlcbiAgICAgICAqICAgICAgICBvYmplY3Qgd2hpY2ggaXMgY3JlYXRlZCB0byB3cmFwIHRoZSBtZXRob2QuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgVGhlIHdyYXBwZXIgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIGluIHBsYWNlIG9mIGEgZGlyZWN0IGludm9jYXRpb25cbiAgICAgICAqICAgICAgICBvZiB0aGUgd3JhcHBlZCBtZXRob2QuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PGZ1bmN0aW9uPn1cbiAgICAgICAqICAgICAgICBBIFByb3h5IG9iamVjdCBmb3IgdGhlIGdpdmVuIG1ldGhvZCwgd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gd3JhcHBlclxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiBpdHMgcGxhY2UuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBNZXRob2QgPSAodGFyZ2V0LCBtZXRob2QsIHdyYXBwZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShtZXRob2QsIHtcbiAgICAgICAgICBhcHBseSh0YXJnZXRNZXRob2QsIHRoaXNPYmosIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmNhbGwodGhpc09iaiwgdGFyZ2V0LCAuLi5hcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGxldCBoYXNPd25Qcm9wZXJ0eSA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBvYmplY3QgaW4gYSBQcm94eSB3aGljaCBpbnRlcmNlcHRzIGFuZCB3cmFwcyBjZXJ0YWluIG1ldGhvZHNcbiAgICAgICAqIGJhc2VkIG9uIHRoZSBnaXZlbiBgd3JhcHBlcnNgIGFuZCBgbWV0YWRhdGFgIG9iamVjdHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICAgICAgICogICAgICAgIFRoZSB0YXJnZXQgb2JqZWN0IHRvIHdyYXAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IFt3cmFwcGVycyA9IHt9XVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgd3JhcHBlciBmdW5jdGlvbnMgZm9yIHNwZWNpYWwgY2FzZXMuIEFueVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHByZXNlbnQgaW4gdGhpcyBvYmplY3QgdHJlZSBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgdGhlXG4gICAgICAgKiAgICAgICAgbWV0aG9kIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZS4gVGhlc2VcbiAgICAgICAqICAgICAgICB3cmFwcGVyIG1ldGhvZHMgYXJlIGludm9rZWQgYXMgZGVzY3JpYmVkIGluIHtAc2VlIHdyYXBNZXRob2R9LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbbWV0YWRhdGEgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIG1ldGFkYXRhIHVzZWQgdG8gYXV0b21hdGljYWxseSBnZW5lcmF0ZVxuICAgICAgICogICAgICAgIFByb21pc2UtYmFzZWQgd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFzeW5jaHJvbm91cy4gQW55IGZ1bmN0aW9uIGluXG4gICAgICAgKiAgICAgICAgdGhlIGB0YXJnZXRgIG9iamVjdCB0cmVlIHdoaWNoIGhhcyBhIGNvcnJlc3BvbmRpbmcgbWV0YWRhdGEgb2JqZWN0XG4gICAgICAgKiAgICAgICAgaW4gdGhlIHNhbWUgbG9jYXRpb24gaW4gdGhlIGBtZXRhZGF0YWAgdHJlZSBpcyByZXBsYWNlZCB3aXRoIGFuXG4gICAgICAgKiAgICAgICAgYXV0b21hdGljYWxseS1nZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbiwgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgKiAgICAgICAge0BzZWUgd3JhcEFzeW5jRnVuY3Rpb259XG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PG9iamVjdD59XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBPYmplY3QgPSAodGFyZ2V0LCB3cmFwcGVycyA9IHt9LCBtZXRhZGF0YSA9IHt9KSA9PiB7XG4gICAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGxldCBoYW5kbGVycyA9IHtcbiAgICAgICAgICBoYXMocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0KHByb3h5VGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEocHJvcCBpbiB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBvYmplY3QuIENoZWNrIGlmIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgICAgLy8gYW55IHdyYXBwaW5nLlxuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBzcGVjaWFsLWNhc2Ugd3JhcHBlciBmb3IgdGhpcyBtZXRob2QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyc1twcm9wXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBhc3luYyBtZXRob2QgdGhhdCB3ZSBoYXZlIG1ldGFkYXRhIGZvci4gQ3JlYXRlIGFcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIHdyYXBwZXIgZm9yIGl0LlxuICAgICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAgIC8vIG9yaWdpbmFsIG1ldGhvZCwgYm91bmQgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAoaGFzT3duUHJvcGVydHkod3JhcHBlcnMsIHByb3ApIHx8IGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvYmplY3QgdGhhdCB3ZSBuZWVkIHRvIGRvIHNvbWUgd3JhcHBpbmcgZm9yIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgICAvLyBtZXRhZGF0YS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAgIC8vIFdyYXAgYWxsIHByb3BlcnRpZXMgaW4gKiBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW1wiKlwiXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGRvIGFueSB3cmFwcGluZyBmb3IgdGhpcyBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgLy8gc28ganVzdCBmb3J3YXJkIGFsbCBhY2Nlc3MgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0KHByb3h5VGFyZ2V0LCBwcm9wLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wIGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmaW5lUHJvcGVydHkocHJveHlUYXJnZXQsIHByb3AsIGRlc2MpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHByb3h5VGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShjYWNoZSwgcHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFBlciBjb250cmFjdCBvZiB0aGUgUHJveHkgQVBJLCB0aGUgXCJnZXRcIiBwcm94eSBoYW5kbGVyIG11c3QgcmV0dXJuIHRoZVxuICAgICAgICAvLyBvcmlnaW5hbCB2YWx1ZSBvZiB0aGUgdGFyZ2V0IGlmIHRoYXQgdmFsdWUgaXMgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZFxuICAgICAgICAvLyBub24tY29uZmlndXJhYmxlLiBGb3IgdGhpcyByZWFzb24sIHdlIGNyZWF0ZSBhbiBvYmplY3Qgd2l0aCB0aGVcbiAgICAgICAgLy8gcHJvdG90eXBlIHNldCB0byBgdGFyZ2V0YCBpbnN0ZWFkIG9mIHVzaW5nIGB0YXJnZXRgIGRpcmVjdGx5LlxuICAgICAgICAvLyBPdGhlcndpc2Ugd2UgY2Fubm90IHJldHVybiBhIGN1c3RvbSBvYmplY3QgZm9yIEFQSXMgdGhhdFxuICAgICAgICAvLyBhcmUgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZCBub24tY29uZmlndXJhYmxlLCBzdWNoIGFzIGBjaHJvbWUuZGV2dG9vbHNgLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGUgcHJveHkgaGFuZGxlcnMgdGhlbXNlbHZlcyB3aWxsIHN0aWxsIHVzZSB0aGUgb3JpZ2luYWwgYHRhcmdldGBcbiAgICAgICAgLy8gaW5zdGVhZCBvZiB0aGUgYHByb3h5VGFyZ2V0YCwgc28gdGhhdCB0aGUgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBhcmVcbiAgICAgICAgLy8gZGVyZWZlcmVuY2VkIHZpYSB0aGUgb3JpZ2luYWwgdGFyZ2V0cy5cbiAgICAgICAgbGV0IHByb3h5VGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHByb3h5VGFyZ2V0LCBoYW5kbGVycyk7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYSBzZXQgb2Ygd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IG9iamVjdCwgd2hpY2ggaGFuZGxlc1xuICAgICAgICogd3JhcHBpbmcgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRoYXQgdGhvc2UgbWVzc2FnZXMgYXJlIHBhc3NlZC5cbiAgICAgICAqXG4gICAgICAgKiBBIHNpbmdsZSB3cmFwcGVyIGlzIGNyZWF0ZWQgZm9yIGVhY2ggbGlzdGVuZXIgZnVuY3Rpb24sIGFuZCBzdG9yZWQgaW4gYVxuICAgICAgICogbWFwLiBTdWJzZXF1ZW50IGNhbGxzIHRvIGBhZGRMaXN0ZW5lcmAsIGBoYXNMaXN0ZW5lcmAsIG9yIGByZW1vdmVMaXN0ZW5lcmBcbiAgICAgICAqIHJldHJpZXZlIHRoZSBvcmlnaW5hbCB3cmFwcGVyLCBzbyB0aGF0ICBhdHRlbXB0cyB0byByZW1vdmUgYVxuICAgICAgICogcHJldmlvdXNseS1hZGRlZCBsaXN0ZW5lciB3b3JrIGFzIGV4cGVjdGVkLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RGVmYXVsdFdlYWtNYXA8ZnVuY3Rpb24sIGZ1bmN0aW9uPn0gd3JhcHBlck1hcFxuICAgICAgICogICAgICAgIEEgRGVmYXVsdFdlYWtNYXAgb2JqZWN0IHdoaWNoIHdpbGwgY3JlYXRlIHRoZSBhcHByb3ByaWF0ZSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgZm9yIGEgZ2l2ZW4gbGlzdGVuZXIgZnVuY3Rpb24gd2hlbiBvbmUgZG9lcyBub3QgZXhpc3QsIGFuZCByZXRyaWV2ZVxuICAgICAgICogICAgICAgIGFuIGV4aXN0aW5nIG9uZSB3aGVuIGl0IGRvZXMuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgICAqL1xuICAgICAgY29uc3Qgd3JhcEV2ZW50ID0gd3JhcHBlck1hcCA9PiAoe1xuICAgICAgICBhZGRMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyLCAuLi5hcmdzKSB7XG4gICAgICAgICAgdGFyZ2V0LmFkZExpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSwgLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhc0xpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Lmhhc0xpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXBzIGFuIG9uUmVxdWVzdEZpbmlzaGVkIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgd2lsbCByZXR1cm4gYVxuICAgICAgICAgKiBgZ2V0Q29udGVudCgpYCBwcm9wZXJ0eSB3aGljaCByZXR1cm5zIGEgYFByb21pc2VgIHJhdGhlciB0aGFuIHVzaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2sgQVBJLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxXG4gICAgICAgICAqICAgICAgICBUaGUgSEFSIGVudHJ5IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5ldHdvcmsgcmVxdWVzdC5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvblJlcXVlc3RGaW5pc2hlZChyZXEpIHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9IC8qIHdyYXBwZXJzICovLCB7XG4gICAgICAgICAgICBnZXRDb250ZW50OiB7XG4gICAgICAgICAgICAgIG1pbkFyZ3M6IDAsXG4gICAgICAgICAgICAgIG1heEFyZ3M6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0ZW5lcih3cmFwcGVkUmVxKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgb25NZXNzYWdlV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYSBtZXNzYWdlIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgbWF5IHNlbmQgcmVzcG9uc2VzIGJhc2VkIG9uXG4gICAgICAgICAqIGl0cyByZXR1cm4gdmFsdWUsIHJhdGhlciB0aGFuIGJ5IHJldHVybmluZyBhIHNlbnRpbmVsIHZhbHVlIGFuZCBjYWxsaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2suIElmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiByZXR1cm5zIGEgUHJvbWlzZSwgdGhlIHJlc3BvbnNlIGlzXG4gICAgICAgICAqIHNlbnQgd2hlbiB0aGUgcHJvbWlzZSBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICAgICAqICAgICAgICBUaGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBvdGhlciBlbmQgb2YgdGhlIGNoYW5uZWwuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZW5kZXJcbiAgICAgICAgICogICAgICAgIERldGFpbHMgYWJvdXQgdGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS5cbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbigqKX0gc2VuZFJlc3BvbnNlXG4gICAgICAgICAqICAgICAgICBBIGNhbGxiYWNrIHdoaWNoLCB3aGVuIGNhbGxlZCB3aXRoIGFuIGFyYml0cmFyeSBhcmd1bWVudCwgc2VuZHNcbiAgICAgICAgICogICAgICAgIHRoYXQgdmFsdWUgYXMgYSByZXNwb25zZS5cbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqICAgICAgICBUcnVlIGlmIHRoZSB3cmFwcGVkIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBsYXRlclxuICAgICAgICAgKiAgICAgICAgeWllbGQgYSByZXNwb25zZS4gRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICAgIGxldCBkaWRDYWxsU2VuZFJlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgICAgbGV0IHdyYXBwZWRTZW5kUmVzcG9uc2U7XG4gICAgICAgICAgbGV0IHNlbmRSZXNwb25zZVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHdyYXBwZWRTZW5kUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0ZW5lcihtZXNzYWdlLCBzZW5kZXIsIHdyYXBwZWRTZW5kUmVzcG9uc2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaXNSZXN1bHRUaGVuYWJsZSA9IHJlc3VsdCAhPT0gdHJ1ZSAmJiBpc1RoZW5hYmxlKHJlc3VsdCk7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgZGlkbid0IHJldHVybmVkIHRydWUgb3IgYSBQcm9taXNlLCBvciBjYWxsZWRcbiAgICAgICAgICAvLyB3cmFwcGVkU2VuZFJlc3BvbnNlIHN5bmNocm9ub3VzbHksIHdlIGNhbiBleGl0IGVhcmxpZXJcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoZXJlIHdpbGwgYmUgbm8gcmVzcG9uc2Ugc2VudCBmcm9tIHRoaXMgbGlzdGVuZXIuXG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiAhaXNSZXN1bHRUaGVuYWJsZSAmJiAhZGlkQ2FsbFNlbmRSZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEEgc21hbGwgaGVscGVyIHRvIHNlbmQgdGhlIG1lc3NhZ2UgaWYgdGhlIHByb21pc2UgcmVzb2x2ZXNcbiAgICAgICAgICAvLyBhbmQgYW4gZXJyb3IgaWYgdGhlIHByb21pc2UgcmVqZWN0cyAoYSB3cmFwcGVkIHNlbmRNZXNzYWdlIGhhc1xuICAgICAgICAgIC8vIHRvIHRyYW5zbGF0ZSB0aGUgbWVzc2FnZSBpbnRvIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhIHJlamVjdGVkXG4gICAgICAgICAgLy8gcHJvbWlzZSkuXG4gICAgICAgICAgY29uc3Qgc2VuZFByb21pc2VkUmVzdWx0ID0gcHJvbWlzZSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4obXNnID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VuZCB0aGUgbWVzc2FnZSB2YWx1ZS5cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKG1zZyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlbmQgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpZiB0aGUgcmVqZWN0ZWQgdmFsdWVcbiAgICAgICAgICAgICAgLy8gaXMgYW4gaW5zdGFuY2Ugb2YgZXJyb3IsIG9yIHRoZSBvYmplY3QgaXRzZWxmIG90aGVyd2lzZS5cbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2U7XG4gICAgICAgICAgICAgIGlmIChlcnJvciAmJiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciB8fCB0eXBlb2YgZXJyb3IubWVzc2FnZSA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICBfX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X186IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIC8vIFByaW50IGFuIGVycm9yIG9uIHRoZSBjb25zb2xlIGlmIHVuYWJsZSB0byBzZW5kIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBzZW5kIG9uTWVzc2FnZSByZWplY3RlZCByZXBseVwiLCBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHNlbmQgdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFcbiAgICAgICAgICAvLyByZXN1bHQsIG90aGVyd2lzZSB3YWl0IHRoZSBwcm9taXNlIHJlbGF0ZWQgdG8gdGhlIHdyYXBwZWRTZW5kUmVzcG9uc2VcbiAgICAgICAgICAvLyBjYWxsYmFjayB0byByZXNvbHZlIGFuZCBzZW5kIGl0IGFzIGEgcmVzcG9uc2UuXG4gICAgICAgICAgaWYgKGlzUmVzdWx0VGhlbmFibGUpIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlZFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQoc2VuZFJlc3BvbnNlUHJvbWlzZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTGV0IENocm9tZSBrbm93IHRoYXQgdGhlIGxpc3RlbmVyIGlzIHJlcGx5aW5nLlxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjayA9ICh7XG4gICAgICAgIHJlamVjdCxcbiAgICAgICAgcmVzb2x2ZVxuICAgICAgfSwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAvLyBEZXRlY3Qgd2hlbiBub25lIG9mIHRoZSBsaXN0ZW5lcnMgcmVwbGllZCB0byB0aGUgc2VuZE1lc3NhZ2UgY2FsbCBhbmQgcmVzb2x2ZVxuICAgICAgICAgIC8vIHRoZSBwcm9taXNlIHRvIHVuZGVmaW5lZCBhcyBpbiBGaXJlZm94LlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS93ZWJleHRlbnNpb24tcG9seWZpbGwvaXNzdWVzLzEzMFxuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPT09IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZXBseSAmJiByZXBseS5fX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18pIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IGJhY2sgdGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGludG9cbiAgICAgICAgICAvLyBhbiBFcnJvciBpbnN0YW5jZS5cbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKHJlcGx5Lm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHdyYXBwZWRTZW5kTWVzc2FnZSA9IChuYW1lLCBtZXRhZGF0YSwgYXBpTmFtZXNwYWNlT2JqLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7bWV0YWRhdGEubWluQXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWluQXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkQ2IgPSB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjay5iaW5kKG51bGwsIHtcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhcmdzLnB1c2god3JhcHBlZENiKTtcbiAgICAgICAgICBhcGlOYW1lc3BhY2VPYmouc2VuZE1lc3NhZ2UoLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YXRpY1dyYXBwZXJzID0ge1xuICAgICAgICBkZXZ0b29sczoge1xuICAgICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICAgIG9uUmVxdWVzdEZpbmlzaGVkOiB3cmFwRXZlbnQob25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycylcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJ1bnRpbWU6IHtcbiAgICAgICAgICBvbk1lc3NhZ2U6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgb25NZXNzYWdlRXh0ZXJuYWw6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB0YWJzOiB7XG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMixcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgc2V0dGluZ01ldGFkYXRhID0ge1xuICAgICAgICBjbGVhcjoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBhcGlNZXRhZGF0YS5wcml2YWN5ID0ge1xuICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICBzZXJ2aWNlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgd2Vic2l0ZXM6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gd3JhcE9iamVjdChleHRlbnNpb25BUElzLCBzdGF0aWNXcmFwcGVycywgYXBpTWV0YWRhdGEpO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYnVpbGQgcHJvY2VzcyBhZGRzIGEgVU1EIHdyYXBwZXIgYXJvdW5kIHRoaXMgZmlsZSwgd2hpY2ggbWFrZXMgdGhlXG4gICAgLy8gYG1vZHVsZWAgdmFyaWFibGUgYXZhaWxhYmxlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gd3JhcEFQSXMoY2hyb21lKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFRoaXMuYnJvd3NlcjtcbiAgfVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1icm93c2VyLXBvbHlmaWxsLmpzLm1hcFxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL25vZGVfbW9kdWxlcy93ZWJleHRlbnNpb24tcG9seWZpbGwvZGlzdC9icm93c2VyLXBvbHlmaWxsLmpzXCIpO1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYmFja2dyb3VuZC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==