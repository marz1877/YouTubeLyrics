var lyricsContainer = document.createElement("div");
lyricsContainer.style.cssText = "display: none; position: absolute; width: 70%; top: 50px; left: 15%; z-index: 2147483647; background: white; padding: 10px; box-shadow: 0px 0px 50px 0px rgba(0,0,0,0.75); border-radius: 10px; font-size: 14px; line-height: 1.5;";
document.body.appendChild(lyricsContainer);

function showLyrics(lyrics) {
  lyricsContainer.style.display = "block";
  lyricsContainer.innerHTML = lyrics;
}

function searchGenius(title, artist) {
  var searchUrl = "https://api.genius.com/search?q=" + encodeURIComponent(title) + " " + encodeURIComponent(artist);
  var accessToken = "YOUR_ACCESS_TOKEN_HERE"; // Add your own Genius API access token here

  fetch(searchUrl, {
    headers: {
      "Authorization": "Bearer " + accessToken
    }
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    if (data.response.hits.length > 0) {
      var songId = data.response.hits[0].result.id;
      var songUrl = "https://api.genius.com/songs/" + songId;
      fetch(songUrl, {
        headers: {
          "Authorization": "Bearer " + accessToken
        }
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        var lyrics = data.response.song.lyrics;
        showLyrics(lyrics);
      });
    } else {
      alert("Lyrics not found");
    }
  });
}

function searchAzLyrics(title, artist) {
  var searchUrl = "https://search.azlyrics.com/search.php?q=" + encodeURIComponent(title + " " + artist);
  fetch(searchUrl).then(function(response) {
    return response.text();
  }).then(function(data) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(data, "text/html");
    var link = htmlDoc.querySelector("td a[href^='../lyrics/']");
    if (link) {
      var lyricsUrl = "https://www.azlyrics.com" + link.getAttribute("href").replace("..", "");
      fetch(lyricsUrl).then(function(response) {
        return response.text();
      }).then(function(data) {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(data, "text/html");
        var lyrics = htmlDoc.querySelector(".col-xs-12.col-lg-8.text-center div:not([class])").innerHTML;
        showLyrics(lyrics);
      });
    } else {
      alert("Lyrics not found");
    }
  });
}

function searchLyrics(title, artist) {
  searchGenius(title, artist);
  searchAzLyrics(title, artist);
}

function hideLyrics() {
  lyricsContainer.style.display = "none";
}

document.addEventListener("keydown", function(event) {
  if (event.code === "Escape") {
    hideLyrics();
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "searchLyrics") {
    var title = message.title;
    var artist = message.artist;
    searchLyrics(title, artist);
  }
});
