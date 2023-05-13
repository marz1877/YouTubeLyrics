var videoTitle = document.querySelector('.ytp-title-link').title;
var searchUrl = 'https://api.genius.com/search?q=' + encodeURIComponent(videoTitle);
var accessToken = 'YOUR_ACCESS_TOKEN_HERE';

fetch(searchUrl, {
  headers: {
    'Authorization': 'Bearer ' + accessToken
  }
})
.then(response => response.json())
.then(data => {
  var songUrl = data.response.hits[0].result.url;

  fetch(songUrl)
  .then(response => response.text())
  .then(data => {
    var lyrics = data.split('LYRICS')[1].split('Submit Corrections')[0];
    var lyricsBox = document.getElementById('lyrics-box');
    lyricsBox.textContent = lyrics;
  });
});
