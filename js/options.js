function saveSettings() {
	var raspip = document.getElementById("raspip").value;
	var port = parseInt(document.getElementById("port").value, 10) || 2020;
	var cmFunction = "music-dl";

	var radios = document.getElementsByName('cmFunction');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) { cmFunction = radios[i].value; break; }
	}

	chrome.storage.local.set({
		raspip: raspip,
		port: port,
		cmFunction: cmFunction
	}, function() {
		alert("Settings were successfully saved!");
	});
}

document.addEventListener("DOMContentLoaded", function() {
	chrome.storage.local.get(['raspip', 'port', 'cmFunction'], function(items) {
		document.getElementById("raspip").value = items.raspip || "raspberrypi.local";
		document.getElementById("port").value = items.port || "2020";
		
		if ((items.cmFunction || "music-dl") === "music-dl") document.getElementById("cmFmusic").checked = true;
		else if (items.cmFunction === "music-search") document.getElementById("cmFmusicsearch").checked = true;
		else if (items.cmFunction === "bookmark") { document.getElementById("cmFbookmark").checked = true; }
	});

	var el = document.getElementById("saveButton");
	el.addEventListener("click", saveSettings, false);
});
