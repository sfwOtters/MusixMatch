
let headers = {};
var musicApp = {};
musicApp.notGenres = ['toplists', 'chill', 'mood', 'party', 'workout', 'focus', 'decades', 'dinner', 'sleep', 'popculture', 'romance', 'travel', 'gaming', 'comedy'];

musicApp.authorization = function() {
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
		musicApp.getCategories();
	});
};

musicApp.getCategories = function() {
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
		musicApp.updateSelect(res.categories['items'])
	})
};

musicApp.updateSelect = function(data) {
	data.forEach(function (element){
		if(musicApp.notGenres.includes(element.id) === false){
			$('select').append(`<option value="${element.id}">${element.name}</option>`)
		}
	})
}
// go through every item and if it does not include the ID from not genre
// forEach ID in array check against musicApp.notGenres array 
// if strings match don't do anything
// if strings don't match grab name of genre (for the select option) and id of genre (for the value of the select), store in variables and template literal them

musicApp.getPlaylists = function(genre) {
	$.ajax({
		url: `https://api.spotify.com/v1/browse/categories/${genre}/playlists`,
		method: 'GET',
		dataType: 'json',
		headers,
		data: {
			limit: 50
		}
	}).then(function(res) {
		console.log(res)
	})
};

musicApp.events = function(){
	$('form').on('submit',function(event){
		event.preventDefault();
		let genre = $('#genres').val();
		musicApp.getPlaylists(genre);
	});
}

musicApp.init = function(){
	musicApp.authorization();
	musicApp.events();
}

$(function(){
	musicApp.init();
});
