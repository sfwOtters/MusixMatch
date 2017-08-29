
let headers = {};
var app = {};

app.getCategories = function() {
	$.ajax({
		url: `https://api.spotify.com/v1/browse/categories/pop/playlists`,
		method: 'GET',
		dataType: 'JSON',
		headers,
		data: {
			limit: 50
		}
	}).then(function(res){
		console.log(res)
		// app.updateSelect(res.categories.items)

	})
};

app.updateSelect = function(data) {
	console.log(data)
}


app.getPlaylists = function() {
	$.ajax({

	}).then(function(res) {
		console.log(res)
	})
};

app.init = function(){
	$.ajax({
		url: 'http://proxy.hackeryou.com',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		data: JSON.stringify({
			reqUrl: 'https://accounts.spotify.com/api/token',
			params: {
				grant_type: 'client_credentials'
			},
			proxyHeaders: {
				'Authorization': 'Basic NWFkYzVlNjQ4ZmVlNGVmMjg2NjYwMjYyOTc1NGNhMWE6NDNmZjFjNjUzYzQyNGY5Mzk2NjI1OTJkN2EyMTJmYTk'
			}
		})
	})
	.then(function(data) {
		headers = {
			'Authorization': `${data.token_type} ${data.access_token}`
		}
		app.getCategories();
	});

	
}

$(function(){
	app.init();
});
