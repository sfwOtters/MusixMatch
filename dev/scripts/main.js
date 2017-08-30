let notGenres = ['toplists', 'chill', 'mood', 'party', 'workout', 'focus', 'decades', 'dinner', 'sleep', 'popculture', 'romance', 'travel', 'gaming', 'comdey'];
let headers = {};
var app = {};

app.authorization = function() {
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
};

app.getCategories = function() {
	$.ajax({
		url: `https://api.spotify.com/v1/browse/categories/`,
		method: 'GET',
		dataType: 'JSON',
		headers,
		data: {
			limit: 50
		}
	}).then(function(res){
		console.log(res.categories['items'])
		app.updateSelect(res.categories['items'])

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
	app.authorization();
}

$(function(){
	app.init();
});
