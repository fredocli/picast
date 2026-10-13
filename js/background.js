function stopNote() {
	chrome.notifications.clear('notif', function(id) { });
}

function notif(title, msg) {
	var opt = {
		type: "basic",
		title: title,
		message: msg,
		iconUrl: "../img/icon48.png",
		priority: 2
	};

	// Use a unique ID to ensure a fresh notification popup
	chrome.notifications.create('notif_' + Date.now(), opt, function(id) { /* No console.error here as per request */
		if (chrome.runtime.lastError) { /* Handle error silently or with a different mechanism if needed */ }
	});
}

function mkrequest(url, response, options = {}) {
    chrome.storage.local.get(['raspip', 'port'], function(result) {
        var ip = result.raspip || "raspberrypi.local";
        var port = parseInt(result.port, 10) || 2020;
        var newURL = "http://" + ip + ":" + port + url;

        if (response == 1) notif("RaspberryCast", "Sending to server...");

        const fetchOptions = {
            method: options.method || 'GET',
            headers: options.headers || {},
        };

        if (options.body) {
            fetchOptions.body = options.body;
        }

        fetch(newURL, fetchOptions)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.text();
            })
            .then(text => {
                if (response == 1) {
                    if (text == "3") notif("RaspberryCast", "Video has been bookmarked.");
                    else if (url.startsWith('/run')) notif("RaspberryCast", "Request sent successfully.");
                    else notif("Error", "Please make sure the link is compatible. Response: " + text);
                }
            })
            .catch(err => notif("Error", "Connection failed: " + err.message));
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "mkrequest") {
        mkrequest(request.url, request.response, request.options);
    }
});


chrome.contextMenus.onClicked.addListener(function(info) {
	chrome.storage.local.get(['cmFunction'], function(result) {
		var cmFunction = result.cmFunction || "music-dl";
		var url_encoded_url = encodeURIComponent(info.linkUrl);
		var raw_url = info.linkUrl;
		if (cmFunction === "music-dl") {
			const options = {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                body: `music-dl\t${raw_url}`
            };
            mkrequest("/run", 1, options);
			// mkrequest("/music-dl?url=" + url_encoded_url, 1); // old piserver
		} else if (cmFunction === "music-search") {
			const options = {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                body: `music-search\t${raw_url}`
            };
            mkrequest("/run", 1, options);
			//mkrequest("/mp3search?url=" + url_encoded_url, 1); // old piserver
		} else if (cmFunction === "bookmark") { 
			const options = {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                body: `bookmark\t${raw_url}`
            };
            mkrequest("/run", 1, options);
			//mkrequest("/bookmark/add?url=" + url_encoded_url, 1); // old piserver
		}
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
            var raw_url = tabs[0].url;
            var title_encoded = encodeURIComponent(tabs[0].title);
			console.log(title_encoded)
            if (command === "run-music-dl") {
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: `music-dl\t${raw_url}`
                };
                mkrequest("/run", 1, options);
				//mkrequest("/music-dl?url=" + url_encoded, 1);		// old piserver
            } else if (command === "run-music-search") {
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: `music-search\t${raw_url}`
                };
                mkrequest("/run", 1, options);		
				//mkrequest("/mp3search?url=" + url_encoded, 1);		// old piserver
            } else if (command === "run-bookmark") {
				const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: `bookmark\t${raw_url}`
                };
                mkrequest("/run", 1, options);
                // mkrequest("/bookmark/add?url=" + url_encoded + "&title=" + title_encoded, 1); // old piserver
            }
        }
    });
});
