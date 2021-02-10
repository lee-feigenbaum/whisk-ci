'use strict';

const promisifySingleCallback = (fn, context = null) => {
	return (...args) => {
		return new Promise((resolve, reject) => {
			fn.call(context, ...args, (results) => {
				if (chrome.runtime && chrome.runtime.lastError) {
					return reject(chrome.runtime.lastError);
				}
				return resolve(results);
			});
		});
	};
};

const chromeLocalStorageSetAsync = chrome && chrome.storage && promisifySingleCallback(chrome.storage.local.set, chrome.storage.local);
const chromeLocalStorageGetAsync = chrome && chrome.storage && promisifySingleCallback(chrome.storage.local.get, chrome.storage.local);
const chromeTabsSendMessageAsync = chrome && chrome.tabs && promisifySingleCallback(chrome.tabs.sendMessage, chrome.tabs);
const chromeTabsQueryAsync = chrome && chrome.tabs && promisifySingleCallback(chrome.tabs.query, chrome.tabs);
const chromeTabsGetCurrentAsync = chrome && chrome.tabs && promisifySingleCallback(chrome.tabs.getCurrent, chrome.tabs);
const chromeRuntimeSendMessageAsync = chrome && chrome.runtime && promisifySingleCallback(chrome.runtime.sendMessage, chrome.runtime);

const setTimeoutAsync = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};
