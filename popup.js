'use strict';

let saveRecipeButton = document.getElementById('btnSaveRecipe');
chrome.runtime.getBackgroundPage((backgroundPage) => {
  saveRecipeButton.onclick = backgroundPage.saveRecipe;
});

function updatePopupInfo(msg) {
  console.log("*** Updating Popup Info");
  let div = document.createElement('div');
  div.innerHTML = msg;
  div.className = 'popup-info';
  document.getElementById('popupInfoContainer').appendChild(div);
}

chrome.runtime.onMessage.addListener(
  (msg, sender, sendResponse) => {
		console.log("*** BACKGROUND received %o from %o, frame", msg, sender.tab, sender.frameId);
		if (msg.message == 'PopupInfo') {
			updatePopupInfo(msg.info);
      sendResponse("OK");
		}
  }
);
