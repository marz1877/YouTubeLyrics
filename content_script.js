// Define the function to get lyrics from Azlyrics
async function getLyricsFromAzlyrics(title, artist) {
  const azlyricsUrl = `https://www.azlyrics.com/lyrics/${artist}/${title}.html`;
  const response = await fetch(azlyricsUrl);
  const text = await response.text();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(text, 'text/html');
  let lyrics = htmlDoc.querySelector('.col-xs-12.col-lg-8.text-center div:not([class])');
  if (lyrics) {
    return lyrics.innerHTML.trim();
  } else {
    return null;
  }
}

// Define the function to get lyrics from Genius
async function getLyricsFromGenius(title, artist) {
  const geniusUrl = `https://api.genius.com/search?q=${title} ${artist}`;
  const response = await fetch(geniusUrl, {
    headers: {
      'Authorization': 'Bearer ' + GENIUS_ACCESS_TOKEN
    }
  });
  const data = await response.json();
  const songPath = data.response.hits[0].result.path;
  const songUrl = `https://api.genius.com${songPath}`;
  const songResponse = await fetch(songUrl, {
    headers: {
      'Authorization': 'Bearer ' + GENIUS_ACCESS_TOKEN
    }
  });
  const songData = await songResponse.json();
  return songData.response.song.description.plain;
}

// Define the function to display lyrics
function displayLyrics(lyrics) {
  const lyricsBox = document.createElement('div');
  lyricsBox.style.position = 'fixed';
  lyricsBox.style.zIndex = '999999';
  lyricsBox.style.top = '50%';
  lyricsBox.style.left = '50%';
  lyricsBox.style.transform = 'translate(-50%, -50%)';
  lyricsBox.style.maxWidth = '90%';
  lyricsBox.style.maxHeight = '80%';
  lyricsBox.style.overflowY = 'auto';
  lyricsBox.style.background = '#fff';
  lyricsBox.style.padding = '20px';
  lyricsBox.style.borderRadius = '10px';
  lyricsBox.innerHTML = lyrics;
  document.body.appendChild(lyricsBox);
}

// Get the title and artist from the YouTube video page
const titleElement = document.querySelector('.ytp-title-link');
const artistElement = document.querySelector('.ytp-subtitle-link');
if (titleElement && artistElement) {
  const title = titleElement.innerText;
  const artist = artistElement.innerText;

  // Get the lyrics from Azlyrics
  let lyrics = await getLyricsFromAzlyrics(title, artist);
  if (!lyrics) {
    // If lyrics are not found on Azlyrics, get the lyrics from Genius
    lyrics = await getLyricsFromGenius(title, artist);
  }

  // Display the lyrics in a box on the page
  if (lyrics) {
    displayLyrics(lyrics);
  } else {
    console.log('Lyrics not found');
  }
}
