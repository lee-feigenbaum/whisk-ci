chrome.runtime.onInstalled.addListener(function() {
	console.log("*** onInstalled");
	//chrome.storage.sync.set({color: '#3aa757'}, function() {
	//	console.log("The color is green, yo.");
	//});

	// Register declarative rules for the onPageChanged event that check
	// if the page is one of the ones we want this to be active on and use
	// ShowPageAction to enable the extension button if so
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: {hostSuffix: 'cooksillustrated.com', pathPrefix: '/recipes/'}
				}),
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: {hostSuffix: 'americastestkitchen.com', pathPrefix: '/recipes/'}
				}),
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: {hostSuffix: 'cookscountry.com', pathPrefix: '/recipes/'}
				})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}])
	});
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	console.log("*** BACKGROUND received %o from %o, frame", msg, sender.tab, sender.frameId);
	sendResponse("OK");
});

function runTest(element) {
  console.log("*** BACKGROUND finding active tab and sending message");
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log("*** BACKGROUND sending message to tab %o", tabs[0].id);
    chrome.tabs.sendMessage(
			tabs[0].id,
			{message: "TEST MESSAGE"},
			function(response) {
				console.log("*** BACKGROUND received response: %o", response);
			}
		);
  });
};
