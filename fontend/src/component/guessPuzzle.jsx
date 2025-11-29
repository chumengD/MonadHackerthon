import React from 'react';
import './guessPuzzle.css';
import { useContent } from '../hooks/context';
import { useWriteContract } from 'wagmi';


export function GuessPuzzle({content="xxxxxxxxxx",tips=["xxxxxxxxxxx","xxxxxxxx"]},moreTip,join,){
    const {isGuess,setIsGuess,inputValue,setInputValue,userAddress} = useContent()
    const {wirteContract} = useWriteContract()
  return (
    isGuess?
    <div className="modal-overlay">
      <div className="modal-container">
        
        {/* 1. Header with Title and Close Button */}
        <div className="modal-header">
          <h2 className="modal-title">guess</h2>
          <button className="close-btn" onClick={()=>{setIsGuess(0)}}>X</button>
        </div>

        {/* 2. Main Center Display Box */}
        <div className="display-box">
          <span className="placeholder-text">{content}</span>
        </div>

        {/* 3. Middle Section: Buttons & Tips */}
        <div className="middle-section">
          {/* Left Side: Buttons and Fees */}
          <div className="left-controls">
            <button className="action-btn" onClick={join}>join in</button>
            <button className="action-btn" onClick={moreTip}>more tip</button>
            
            <div className="fee-info">
              <div>join in fee:0.5mon</div>
              <div>tip fee:0.1mon</div>
            </div>
          </div>

          {/* Right Side: Tips Box */}
          <div className="right-tips">
            <span className="tips-label">tips:</span>
            <div className="tips-box">
              {tips.map((item,index)=>{
                return <p>{index+1}.{item}</p>
              })}
            </div>
          </div>
        </div>

        {/* 4. Bottom Section: Input and Confirm */}
        <div className="bottom-section">
          <input 
            type="text" 
            className="answer-input" 
            placeholder="your answer"
            value={inputValue}
            onChange={(e)=>setInputValue(e.target.value)} 
          />
          <button className="confirm-btn" onClick={()=>{
            Hash(inputValue+userAddress)
            log?console.log(log):console.log(lodding)
          }}>comfirm</button>
        </div>

      </div>
    </div>
    :<></>
  );
}