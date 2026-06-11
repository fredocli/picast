function stopNote() {
	chrome.notifications.clear('notif', function(id) { });
}

function notif(title, msg) {
	var opt = {
		type: "basic",
		title: title,
		message: msg,
		iconUrl: "img/icon48.png",
		priority: 2
	};

	// Use a unique ID to ensure a fresh notification popup
	chrome.notifications.create('notif_' + Date.now(), opt, function(id) { /* No console.error here as per request */
		if (chrome.runtime.lastError) { /* Handle error silently or with a different mechanism if needed */ }
	});
}

function mkrequest(url, response) {
    chrome.storage.local.get(['raspip'], function(result) {
        var ip = result.raspip || "raspberrypi.local";
        var newURL = "http://" + ip + ":2020" + url;

        if (response == 1) {
            notif("RaspberryCast", "Sending to server: " + newURL);
        }

        fetch(newURL)
            .then(res => res.text())
            .then(text => {
                if (response == 1) {
                    if (text == "1") notif("RaspberryCast", "Video should now start playing.");
                    else if (text == "2") notif("RaspberryCast", "Video has been added to queue.");
                    else notif("Error", "Please make sure the link is compatible");
                }
            })
            .catch(err => notif("Error", "Connection failed: " + err.message));
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action === "mkrequest") {
		mkrequest(request.url, request.response);
	}
});


chrome.contextMenus.onClicked.addListener(function(info) {
	chrome.storage.local.get(['cmFunction'], function(result) {
		var cmFunction = result.cmFunction || "stream";
		var url_encoded_url = encodeURIComponent(info.linkUrl);
		if (cmFunction == "stream") mkrequest("/stream?url=" + url_encoded_url, 1);
		else if (cmFunction == "queue") mkrequest("/queue?url=" + url_encoded_url, 1);
		else if (cmFunction == "music-dl") mkrequest("/music-dl?url=" + url_encoded_url, 1);
	});
});

chrome.runtime.onInstalled.addListener(function() {
	chrome.tabs.create({url: "../options.html"});
	chrome.contextMenus.create({
		id: "Castnow",
		title: "Send to Rpi",
		contexts: ["link"]
	});
});

chrome.commands.onCommand.addListener(function(command) {
    if (command === "run-music-dl") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url) {
                var url_encoded = encodeURIComponent(tabs[0].url);
                mkrequest("/music-dl?url=" + url_encoded, 1);
            }
        });
    }
});
