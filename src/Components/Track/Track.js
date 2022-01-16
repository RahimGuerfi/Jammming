import React from "react";
import "boxicons";
import "./Track.css";

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }
  renderAction() {
    return (
      <button
        onClick={this.props.isRemoval ? this.removeTrack : this.addTrack}
        className="Track-action"
      >
        {this.props.isRemoval ? (
          <box-icon
            color="white"
            name="minus-circle"
            animation="flashing-hover"
          ></box-icon>
        ) : (
          <box-icon
            color="white"
            name="plus-circle"
            animation="flashing-hover"
          ></box-icon>
        )}
      </button>
    );
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3> {this.props.track.name} </h3>
          <p>
            {this.props.track.artist} | {this.props.track.album}
          </p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

Track.defaultProps = {
  onAdd: null,
  onRemove: null,
};

export default Track;
