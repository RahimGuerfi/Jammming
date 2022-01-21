import "./BlockUI.css";
import loader from "./loader.png";

const BlockUI = ({ blocking }) => {
  if (!blocking) {
    return "";
  } else {
    return (
      <div className="overlay">
        <div className="overlay_inner">
          <div className="overlay_content">
            <img src={loader} className="loader" alt="loader" />
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
