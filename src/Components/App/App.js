import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/PLaylist";
import Spotify from "../../util/Spotify";
import Swal from "sweetalert2";
import BlockUI from "../BlockUI/BlockUI";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocking: true,
      searchResults: [],
      playlistName: "Playlist Name",
      playlistTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.toggleBlocking = this.toggleBlocking.bind(this);
  }

  popupMessage(title, message, icon) {
    Swal.fire(title, message, icon);
  }

  toggleBlocking() {
    this.setState({ blocking: !this.state.blocking });
  }

  addTrack(track) {
    if (
      this.state.playlistTracks.find((savedTrack) => savedTrack.id === track.id)
    ) {
      return;
    }
    //Track not found in PLaylist

    //Array copy
    let newPlaylistTrack = [...this.state.playlistTracks];
    newPlaylistTrack.push(track);
    this.setState({ playlistTracks: newPlaylistTrack });
  }

  removeTrack(track) {
    const newPlaylistTrack = this.state.playlistTracks.filter(
      (savedTrack) => savedTrack.id !== track.id
    );
    this.setState({ playlistTracks: newPlaylistTrack });
  }

  updatePlaylistName(newName) {
    this.setState({ playlistName: newName });
  }

  async savePlaylist() {
    const tracksUris = this.state.playlistTracks.map((track) => track.uri);
    const noTracks = tracksUris.length === 0;
    const noPlaylistName = this.state.playlistName.trim() === "";
    if (!noTracks && !noPlaylistName) {
      this.toggleBlocking();
      await Spotify.savePlaylist(this.state.playlistName, tracksUris);
      this.toggleBlocking();

      this.setState({ playlistName: "Playlist Name", playlistTracks: [] });
      this.popupMessage("Saved!", "Playlist saved to your account.", "success");
    } else {
      if (noPlaylistName)
        this.popupMessage(
          "Warning!",
          "Choose a name for your playlist.",
          "warning"
        );
      else if (noTracks)
        this.popupMessage("Warning!", "Add some tracks first.", "warning");
      else
        this.popupMessage("Warning!", "Create your playlist first.", "warning");
    }
  }

  async search(term) {
    if (term.trim() === "") {
      this.popupMessage("Warning!", "Enter a search term.", "warning");
    } else {
      this.toggleBlocking();
      const response = await Spotify.search(term);
      this.toggleBlocking();

      if (!response) return;
      else if (response.length === 0)
        this.popupMessage("Error!", `No results found for: ${term}.`, "error");
      else this.setState({ searchResults: response });
    }
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              onAdd={this.addTrack}
              searchResults={this.state.searchResults}
            />
            <Playlist
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              playlistTracks={this.state.playlistTracks}
              playlistName={this.state.playlistName}
            />
          </div>
        </div>
        <BlockUI blocking={this.state.blocking} />
      </div>
    );
  }
}

export default App;
