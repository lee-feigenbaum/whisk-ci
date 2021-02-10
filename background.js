'use strict';

// Basic infrastructure for extension background page, including
// installation bootstrapping & utility functions

chrome.runtime.onInstalled.addListener(function() {
	console.log("BACKGROUND onInstalled");

	// Uncomment and put an actual value in and run once to
	// seed local storage value - booooo companies unwilling to
	// grant an OAuth client ID to non-commercial developers
	//chromeLocalStorageSetAsync({"whisk_bearer_token": ""});

	console.log("stored bearer token value");

	// Register declarative rules for the onPageChanged event that check
	// if the page is one of the ones we want this to be active on and use
	// ShowPageAction to enable the extension button if so
	chrome.declarativeContent.onPageChanged.removeRules(undefined, async function() {
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
			actions: [
				new chrome.declarativeContent.SetIcon({
		         imageData: {
		           16: await loadImageData('images/Orion_balloon-whisk-16.png'),
							 32: await loadImageData('images/Orion_balloon-whisk-32.png'),
							 48: await loadImageData('images/Orion_balloon-whisk-48.png'),
		         },
		    }),
				new chrome.declarativeContent.ShowPageAction()
			]
		}])
	});
});

// Credit to https://stackoverflow.com/questions/64473519/how-to-disable-gray-out-page-action-for-chrome-extension
function loadImageData(url) {
  return new Promise(resolve => {
    const canvas = document.body.appendChild(document.createElement('canvas'));
    const context = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0);
      const data = context.getImageData(0, 0, img.width, img.height);
      canvas.remove();
      resolve(data);
    };
    img.src = url;
  });
}

async function handleLoadRecipe(msg) {
	if (msg.message == 'LoadRecipe' && msg.recipe_id) {
		const recipe_id = msg.recipe_id;
		console.log("*** BACKGROUND loading recipe %o from local storage", recipe_id);
		const factory = new LocalStorageRecipeFactory();
		const recipe = await factory.load(recipe_id);
		console.log("*** BACKGROUND responding to message with loaded recipe %o", recipe);
		return recipe;
	} else {
		throw("Invalid message passed to handleLoadRecipe");
	}
}

chrome.runtime.onMessage.addListener(
	(msg, sender, sendResponse) => {
		console.log("*** BACKGROUND received %o from %o, frame", msg, sender.tab, sender.frameId);
		if (msg.message == 'LoadRecipe') {
			handleLoadRecipe(msg).then(sendResponse);
			return true;
		} else if (msg.message == 'PopupInfo') {
			// don't do anything or send any response - this is for the popup JS if
			// it's listening
		}
	}
);
