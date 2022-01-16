const CLIENT_ID = process.env.REACT_APP_API_KEY;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL;

const localStorageKey = "accessToken";

let Spotify = {
  storeAccessToken(accessToken, ttl) {
    const now = new Date();

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: accessToken,
      expiry: now.getTime() + ttl * 1000,
    };
    localStorage.setItem(localStorageKey, JSON.stringify(item));
  },
  getStoredAccessToken() {
    const itemStr = localStorage.getItem(localStorageKey);

    // if the item doesn't exist, return false
    if (!itemStr) {
      return false;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return false
      localStorage.removeItem(localStorageKey);
      return false;
    }
    return item.value;
  },
  getAccessToken() {
    if (this.getStoredAccessToken()) {
      return this.getStoredAccessToken();
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      const expiresIn = Number(expiresInMatch[1]);
      this.storeAccessToken(accessTokenMatch[1], expiresIn);
      window.history.pushState("Access Token", null, "/");
      return this.getStoredAccessToken();
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
      window.location = accessUrl;
      return false;
    }
  },
  async search(term) {
    const accessToken = Spotify.getAccessToken();
    if (accessToken) {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const jsonResponse = await response.json();
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    }
    return false;
  },
  async savePlaylist(playlistName, trackUris) {
    if (playlistName && trackUris) {
      let response, jsonResponse;
      const accessToken = this.getAccessToken();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      //Get userID
      let userId;
      response = await fetch(`https://api.spotify.com/v1/me`, {
        headers: headers,
      });
      jsonResponse = await response.json();
      userId = jsonResponse.id;

      //Create Playlist and get its Id
      response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: playlistName }),
        }
      );
      jsonResponse = await response.json();
      const playlistId = jsonResponse.id;

      //Save tracks to the newly created playlist
      response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
        {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ uris: trackUris }),
        }
      );
      return await response.json();
    }
    return;
  },
};

export default Spotify;
