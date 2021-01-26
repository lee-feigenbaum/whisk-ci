let testButton = document.getElementById('test');

//chrome.storage.sync.get('color', function(data) {
//  changeColor.style.backgroundColor = data.color;
//  changeColor.setAttribute('value', data.color);
//});

console.log("*** POPUP registering onClick handler");
testButton.onclick = chrome.extension.getBackgroundPage().runTest;
