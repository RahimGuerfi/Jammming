import "./BlockUI.css";
const BlockUI = ({ blocking }) => {
  if (!blocking) {
    return "";
  } else {
    return (
      <div className="overlay">
        <div className="overlay_inner">
          <div className="overlay_content">
            <span className="spinner"></span>
            <h3>Loading...</h3>
          </div>
        </div>
      </div>
    );
  }
};

BlockUI.defaultProps = {
  blocking: false,
};

export default BlockUI;
