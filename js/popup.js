function handlers() {

	$( "#musicdl" ).click(function() {
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			var url_encoded = encodeURIComponent(tabs[0].url);
			chrome.runtime.sendMessage({action: "mkrequest", url: "/music-dl?url=" + url_encoded, response: 1});
			window.close();
		});
	});

	$( "#castbtn" ).click(function() {
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			var url_encoded = encodeURIComponent(tabs[0].url);
			chrome.runtime.sendMessage({action: "mkrequest", url: "/stream?url=" + url_encoded, response: 1});
			window.close();
		});
	});

	$( "#addqueue" ).click(function() {
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			var url_encoded = encodeURIComponent(tabs[0].url);
			chrome.runtime.sendMessage({action: "mkrequest", url: "/queue?url=" + url_encoded, response: 1});
			window.close();	
		});
	});	

	$( "#pause" ).click(function() {
		chrome.runtime.sendMessage({action: "mkrequest", url: "/video?control=pause", response: 0});
	});	

	$( "#stop" ).click(function() {
		chrome.runtime.sendMessage({action: "mkrequest", url: "/video?control=stop", response: 0});
		window.close();
	});
	
	$( "#backward" ).click(function() {
		chrome.runtime.sendMessage({action: "mkrequest", url: "/video?control=left", response: 0});
	});
	
	$( "#forward" ).click(function() {
		chrome.runtime.sendMessage({action: "mkrequest", url: "/video?control=right", response: 0});
	});
	
	$( "#vol_down" ).click(function() {
		chrome.runtime.sendMessage({action: "mkrequest", url: "/sound?vol=less", response: 0});
	});
	
	$( "#vol_up" ).click(function() {
		chrome.runtime.sendMessage({action: "mkrequest", url: "/sound?vol=more", response: 0});
	});
}

function remote(toggle) {
	if (toggle == "show") {
		$("#remote").show();
		$("#whole").css("height","215px");
	} else {
		$("#remote").hide();
		$("#whole").css("height", "100px");
	}
	handlers();
}

function show(message) {
	$("#whole").html(message);
}

function test() {
    chrome.storage.local.get(['raspip'], function(result) {
        var ip = result.raspip || "raspberrypi.local";
        var newURL = "http://" + ip + ":2020/";
        show("Connecting to " + ip + "...");
        
        fetch(newURL)
            .then(res => res.text())
            .then(text => {
                $("#whole").replaceWith(clonewhole.clone());
                if (text == "1") remote("show");
                else remote("hide");
            })
            .catch(err => {
                // Even if test fails, we restore the buttons so the user can still try to cast
                $("#whole").replaceWith(clonewhole.clone());
                handlers();
                show("Warning: Server not reached. Check IP in options.");
            });
    });
}

$( document ).ready(function() {
    clonewhole = $("#whole").clone();
    handlers(); // Bind handlers immediately so buttons are active
    test();
});
