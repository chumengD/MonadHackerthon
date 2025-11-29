import './createPuzzle.css';
import { useContent } from '../hooks/context';

export function CreateGuess(){
    const {isCreate,setIsCrrate} = useContent()
  return (
    isCreate?
    <div className="modal-container">
      {/* Header */}
      <div className="modal-header">
        <span className="modal-title">create</span>
        <button className="close-btn" onClick={()=>{setIsCrrate(0)}}>X</button>
      </div>

      {/* Main Content */}
      <div className="modal-content">
        
        {/* Large Placeholder Box */}
        <div className="placeholder-box">
          <span>xxxxxxxxxxxxxx</span>
          <span>xxxxxxxxxxxxxx</span>
        </div>

        {/* Controls Row */}
        <div className="controls-row">
          {/* Left: Prize Input */}
          <div className="prize-group">
            <label>prize:</label>
            <input type="text" defaultValue="xx" className="prize-input" />
          </div>

          {/* Right: Upload Button & Text */}
          <div className="upload-group">
            <button className="upload-btn">upload image</button>
            <span className="helper-text">default create by AI</span>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="footer">
        <button className="create-btn">create</button>
      </div>
    </div>:<></>
  );
};

