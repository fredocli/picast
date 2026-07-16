function handlers() {

	$( "#bookmark" ).click(function() {
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			var url_encoded = encodeURIComponent(tabs[0].url);
			var title_encoded = encodeURIComponent(tabs[0].title);
			chrome.runtime.sendMessage({action: "mkrequest", url: "/bookmark/add?url=" + url_encoded + "&title=" + title_encoded, response: 1});
			window.close();
		});
	});

	$( "#musicdl" ).click(function() {
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			var url_encoded = encodeURIComponent(tabs[0].url);
			chrome.runtime.sendMessage({action: "mkrequest", url: "/music-dl?url=" + url_encoded, response: 1});
			window.close();
		});
	});

}

function show(message) {
	$("#whole").html(message);
}

$( document ).ready(function() {
    handlers();
});
