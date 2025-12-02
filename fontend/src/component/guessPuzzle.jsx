import React from 'react';
import './guessPuzzle.css';
import { useContent } from '../hooks/context';
import {message} from "antd"
//import {Hash} from "../hooks/"
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

async function Hash(input){
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(input) 
    const hashBuffer = await crypto.subtle.digest('SHA-256',dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hashHex; 
  }




export function GuessPuzzle(){
    const {isGuess,setIsGuess,guessInputValue,setGuessInputValue,userAddress,description,status,tip,setTip,answer,setAnswer,content,setContent,enterFee,isRight,setIsRight} = useContent()
    async function getAnswer() {
      //获取单一卡片的答案，谜面，提示
      const response = await fetch("https:/无")
      const data = await response.json()
      setAnswer(data.answer)
      setContent(data,content)
      setTip(data.tip)
    }
    async function confirmbtn(){
      //确认按钮的执行
      try{
        message.info(`请稍等`)
      const userAnswer = await Hash(guessInputValue+userAddress)
            const response = await fetch('https:/answer',{
              method:'post',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify(userAnswer)
            })
            const data = await response.json()
            setIsRight(data)  
            if(isRight) {
              message.success(`答案正确！！！！！！`)}
              else message.error(`答案错误`)}catch(error){message.error(`error:${error}`,2)}
            
    }
    async function join(){
      //参加按钮的执行
            try{
              fetch('https:/join',{
              method:'post',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify(userAddress)
            })
            .then(response =>response.json())
            .then(data =>alert(`参加成功！${data},目前没人写合约，
              只能将用户地址上传到后端就当做参加了`,))
            }catch(error){message.error(`error:`,error)}
    }
  if (status==="已揭秘" && isGuess) {getAnswer()}
  return (
    isGuess?
    status==="已揭秘"?<div className="modal-overlay">
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
            <button className="action-btn">join in</button>
            
            <div className="fee-info">
              <div>joinFee:</div><div>{enterFee}sepolia</div>
              {console.log(`description:${description}`)}
              <div className='descri'>description: <br/> {description}</div>
            </div>
          </div>

          {/* Right Side: Tips Box */}
          <div className="right-tips">
            
            <div className="tips-box">
              <span className="tips-label">tip:{tip}</span>
              
            </div>
          </div>
        </div>

        {/* 4. Bottom Section: Input and Confirm */}
        <div className="bottom-section">
          answer:{answer?answer:"loading"}
         </div>

      </div>
    </div>:
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
            <button className="action-btn" onClick={join}>join in</button>
            
            <div className="fee-info">
              <div>joinFee:</div><div>{enterFee}sepolia</div>
              <div className='descri'>description: <br/> {description}</div>
            </div>
          </div>

          {/* Right Side: Tips Box */}
          <div className="right-tips">
            
            <div className="tips-box">
              <span className="tips-label">tip:{tip}</span>
              
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
          <button className="confirm-btn" onClick={confirmbtn}>comfirm</button>
        </div>

      </div>
    </div>
    :<></>
  );
}