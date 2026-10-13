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
			const options = {
				method: 'POST',
				headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
				body: `music-dl\t${tabs[0].url}`
			};
			chrome.runtime.sendMessage({action: "mkrequest", url: "/run", response: 1, options: options});
			window.close();
		});
	});

	$( "#musicsearch" ).click(function() {
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			var url_encoded = encodeURIComponent(tabs[0].url);
			chrome.runtime.sendMessage({action: "mkrequest", url: "/mp3search?url=" + url_encoded, response: 1});
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
