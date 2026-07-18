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

        if (response == 1) notif("RaspberryCast", "Sending to server...");

        fetch(newURL)
            .then(res => res.text())
            .then(text => {
                if (response == 1) {
                    if (text == "3") notif("RaspberryCast", "Video has been bookmarked.");
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
		var cmFunction = result.cmFunction || "music-dl";
		var url_encoded_url = encodeURIComponent(info.linkUrl);
		if (cmFunction === "music-dl") {
			mkrequest("/music-dl?url=" + url_encoded_url, 1);
		} else if (cmFunction === "music-search") {
			mkrequest("/mp3search?url=" + url_encoded_url, 1);
		} else if (cmFunction === "bookmark") { mkrequest("/bookmark/add?url=" + url_encoded_url, 1); }
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
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].url) {
            var url_encoded = encodeURIComponent(tabs[0].url);
            var title_encoded = encodeURIComponent(tabs[0].title);
			console.log(title_encoded)
            if (command === "run-music-dl") {
                mkrequest("/music-dl?url=" + url_encoded, 1);
            } else if (command === "run-music-search") {
                mkrequest("/mp3search?url=" + url_encoded, 1);
            } else if (command === "run-bookmark") {
                mkrequest("/bookmark/add?url=" + url_encoded + "&title=" + title_encoded, 1);
            }
        }
    });
});
