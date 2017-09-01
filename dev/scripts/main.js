
let headers = {};
var musicApp = {};
musicApp.notGenres = ['toplists', 'chill', 'mood', 'party', 'workout', 'focus', 'decades', 'dinner', 'sleep', 'popculture', 'romance', 'travel', 'gaming', 'comedy'];
musicApp.spiceCount = 0;
musicApp.desiredSpice = 0;
musicApp.URI = '';
musicApp.genre = '';
musicApp.attempt = 0;
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
			$('select').append(`<option class="genre" value="${element.id}">${element.name}</option>`)
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
		musicApp.getRandomPlaylist(res.playlists.items)
	})
};

musicApp.getRandomPlaylist = function(playlists) {
	console.log(playlists.length)
	let randomIndex = Math.floor(Math.random() * playlists.length);
	let chosenPlaylist = playlists[randomIndex].tracks.href;
	musicApp.URI = playlists[randomIndex].uri;
	// console.log(musicApp.URI);
	musicApp.getTracks(chosenPlaylist);
	console.log(chosenPlaylist)
};

musicApp.getTracks = function(playlist) {
	$.ajax({
		url: `${playlist}`,
		method: 'GET',
		dataType: 'JSON',
		headers
	}).then(function(res){
		musicApp.checkTracks(res)
	})
};
musicApp.checkTracks = (res) => {
	console.log(res)
	let tracks = res.items;
	tracks.forEach(function (track){
		if(track.track.explicit === true){
			musicApp.spiceCount += 1;
		}		
	})
	console.log(musicApp.desiredSpice)
	let spicyPercentage = Math.floor((musicApp.spiceCount / tracks.length) * 100);
	if(spicyPercentage <= musicApp.desiredSpice){
		// console.log('working')
		musicApp.displayPlaylist();
	} else {
		musicApp.spiceCount = 0;
		musicApp.attempt++;
		console.log('attempt', musicApp.attempt);
		if (musicApp.attempt < 50) {
			musicApp.getPlaylists(musicApp.genre);
		}else{
			musicApp.displayError();
		}
	}
	console.log(spicyPercentage);
};
musicApp.displayPlaylist = () => {
	$('.output').append(`<iframe src="https://open.spotify.com/embed?uri=${musicApp.URI}&view=list"
        frameborder="0" allowtransparency="true" ></iframe>`);
}
musicApp.displayError = () => {
	let genre = $('.genre:selected').text();
	$('.output').html(`<p>There is no ${genre} playlist at a ${musicApp.desiredSpice} Spice level</p>`);
}

// if explicit is = to true add 1 to the spice count
// then compare that number to the # of songs in the playlist 
// caculate percantage of playlist that is spicy
// then compare that to the users allowed spicyness
// if equlivent or less display playslist
// if greater than user choice generate another playlist and repeat
// if nothing is bland enough display error message for user
musicApp.colorChilis = function(chiliValue) {
	$('svg').removeClass('redChili');
	if(chiliValue === '0'){
		$('#chili0').addClass('redChili');
	} else if(chiliValue === '1') {	
		$('#chili0, #chili1').addClass('redChili');
	} else if(chiliValue === '2') {
		$('#chili0, #chili1, #chili2').addClass('redChili');
	} else if(chiliValue === '3') {
		$('#chili0, #chili1, #chili2, #chili3').addClass('redChili');
	} else if(chiliValue === '4') {

		$('#chili0, #chili1, #chili2, #chili3, #chili4').addClass('redChili');
	} else if(chiliValue === '5') {
		$('#chili0, #chili1, #chili2, #chili3, #chili4, #chili5').addClass('redChili');
	};
};
// if chili value is equal to 0, color first chili
// if 1, color chili1 and chili2
// if 2, color chili1 chili2 chili3
musicApp.events = function(){
	$('form').on('submit',function(event){
		$('.output').empty();
		event.preventDefault();
		musicApp.genre = $('#genres').val();	 
		musicApp.desiredSpice = $('#spiceLevel').val();
		console.log(musicApp.desiredSpice);
		musicApp.getPlaylists(musicApp.genre);
		musicApp.spiceCount = 0;
		musicApp.attempt = 0;
	});
	$('#spiceLevel').on('change', function() {
		let chiliValue = $('#spiceLevel').val();
		musicApp.colorChilis(chiliValue);
	});
};

musicApp.init = function(){
	musicApp.authorization();
	musicApp.events();
};

$(function(){
	musicApp.init();
});
