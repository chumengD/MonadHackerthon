import React from 'react';
import './guessPuzzle.css';
import { useContent } from '../hooks/context';

// join函数

//import {useWriteContract} from "wagmi"
//import {contractX} from "../hooks/contracts"
//const {writeContract} =useWriteContract
/*onClick={()=>{writeContract({
      address:contractX.address, 
      abi:contractX.abi,
      args:[userAddress,reciveAddress,"0.1"]
})}}
*/

/* 缺失一个函数，返回content，tip  */

export function GuessPuzzle({content="xxxxxxxxxxxxxx",description="xxxxxxxxxx"}){
    const {isGuess,setIsGuess,guessInputValue,setGuessInputValue,userAddress,} = useContent()
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
        <div >
          <p className="display-box">{content}</p>
        </div>

        {/* 3. Middle Section: Buttons & Tips */}
        <div className="middle-section">
          {/* Left Side: Buttons and Fees */}
          <div className="left-controls">
            <button className="action-btn" onClick={()=>{
            }}>join in</button>
            
            <div className="fee-info">
              <div>joinFee:0.5mon</div>
              <div className='descri'>description:{description}</div>
            </div>
          </div>

          {/* Right Side: Tips Box */}
          <div className="right-tips">
            
            <div className="tips-box">
              <span className="tips-label">tips:</span>
              
            </div>
          </div>
        </div>

        {/* 4. Bottom Section: Input and Confirm */}
        <div className="bottom-section">
          <input 
            type="text" 
            className="answer-input" 
            placeholder="your answer"
            value={guessInputValue}
            onChange={(e)=>setGuessInputValue(e.target.value)} 
          />
          <button className="confirm-btn" onClick={()=>{
            Hash(guessInputValue+userAddress)
            log?console.log(log):console.log(lodding)
          }}>comfirm</button>
        </div>

      </div>
    </div>
    :<></>
  );
}