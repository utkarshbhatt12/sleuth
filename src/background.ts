import { ExtensionRequests, Extension } from './types';

let extensionRequests: ExtensionRequests = {};
let totalRequests: number = 0;

function updateBadge() {
  chrome.action.setBadgeText({ text: totalRequests.toString() });
  chrome.action.setBadgeBackgroundColor({ color: '#4B0082' });
}

function shouldIgnoreRequest(url: string): boolean {
  const ignoredExtensions = ['.css', '.html'];
  const urlLower = url.toLowerCase();
  return (
    ignoredExtensions.some((ext) => urlLower.endsWith(ext)) ||
    urlLower.includes('/api/') ||
    urlLower.startsWith('chrome-extension://')
  );
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (
      details.initiator &&
      details.initiator.startsWith('chrome-extension://')
    ) {
      if (shouldIgnoreRequest(details.url)) {
        return; // Ignore this request
      }

      const extensionId = details.initiator.split('//')[1];
      if (!extensionRequests[extensionId]) {
        extensionRequests[extensionId] = {
          total: 0,
          urls: {},
          lastRequestTime: 0,
        };
      }
      extensionRequests[extensionId].total++;
      totalRequests++;

      const url = details.url;
      if (!extensionRequests[extensionId].urls[url]) {
        extensionRequests[extensionId].urls[url] = 0;
      }
      extensionRequests[extensionId].urls[url]++;
      extensionRequests[extensionId].lastRequestTime = Date.now();

      updateBadge();
    }
  },
  { urls: ['<all_urls>'] }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getExtensionRequests') {
    chrome.management.getAll((extensions) => {
      const extensionData = extensions.map(
        (ext): Extension => ({
          id: ext.id,
          name: ext.name,
          networkRequests: extensionRequests[ext.id]?.total || 0,
          urls: extensionRequests[ext.id]?.urls || {},
          lastRequestTime: extensionRequests[ext.id]?.lastRequestTime || 0,
        })
      );
      sendResponse({ extensions: extensionData, totalRequests });
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === 'resetCounter') {
    extensionRequests = {};
    totalRequests = 0;
    updateBadge();
    sendResponse({ success: true });
  }
});

// Initialize badge
updateBadge();
