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
		url: 'https://proxy.hackeryou.com',
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
		musicApp.getRandomPlaylist(res.playlists.items)
	})
};

musicApp.getRandomPlaylist = function(playlists) {
	let randomIndex = Math.floor(Math.random() * playlists.length);
	let chosenPlaylist = playlists[randomIndex].tracks.href;
	musicApp.URI = playlists[randomIndex].uri;
	musicApp.getTracks(chosenPlaylist);
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
	let tracks = res.items;
	tracks.forEach(function (track){
		if(track.track.explicit === true){
			musicApp.spiceCount += 1;
		}		
	})
	let spicyPercentage = Math.floor((musicApp.spiceCount / tracks.length) * 100);
	if(spicyPercentage <= musicApp.desiredSpice){
		musicApp.displayPlaylist();
	} else {
		musicApp.spiceCount = 0;
		musicApp.attempt++;
		if (musicApp.attempt < 50) {
			musicApp.getPlaylists(musicApp.genre);
		}else{
			musicApp.displayError();
		}
	}
};
musicApp.displayPlaylist = () => {
	$('.output').append(`<iframe src="https://open.spotify.com/embed?uri=${musicApp.URI}&view=list"
     frameborder="0" allowtransparency="true" ></iframe>`);
}
musicApp.displayError = () => {
	let genre = $('.genre:selected').text();
	$('.output').html(`<p class="playlistError">Sorry, there are no ${genre} playlists at a ${musicApp.desiredSpice} spice level.</p>`);
}

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

musicApp.events = function(){
	$('form').on('submit',function(event){
		$('.output').empty();
		event.preventDefault();
		musicApp.genre = $('#genres').val();	 
		musicApp.desiredSpice = $('#spiceLevel').val();
		musicApp.getPlaylists(musicApp.genre);
		musicApp.spiceCount = 0;
		musicApp.attempt = 0;
		if ($(window).width() >= 940) {
			$('.spiceBox').addClass('spiceBox_PlaylistLoad').removeClass('spiceBox-onLoad');
			$('.genreSelection').addClass('genreSelection_PlaylistLoad').removeClass('genreSelection-onLoad');
			$('.spiceSelect').addClass('spiceSelect_PlaylistLoad').removeClass('spiceSelect-onLoad')
		};
		if ($(window).resize() >= 940) {
			$('.spiceBox').addClass('spiceBox_PlaylistLoad').removeClass('spiceBox-onLoad');
			$('.genreSelection').addClass('genreSelection_PlaylistLoad').removeClass('genreSelection-onLoad');
			$('.spiceSelect').addClass('spiceSelect_PlaylistLoad').removeClass('spiceSelect-onLoad')
		};
	});
	$('#spiceLevel').on('input', function() {
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