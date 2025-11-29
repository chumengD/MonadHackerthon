import React from 'react';
import './App.css';
import { ConnectButton } from "@rainbow-me/rainbowkit"
import {Card} from "./component/card" 
import { GuessPuzzle } from './component/guessPuzzle';
import { CreateGuess } from './component/createPuzzle';
import { useContent } from './hooks/context';




export function Page() {
    const {setIsGuess,setIsCreate} = useContent()
  return (<div className='Frame-Border'>
    <div className='Border'></div>
    <GuessPuzzle/>
    <CreateGuess/>
    <button className='createPuzzle' onClick={()=>{setIsCreate(1)}}> createPuzzle</button>
    <span className='ConnectButton'><ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false}/></span>
    <span className='Card'>
      <button onClick={()=>{setIsGuess(1)}}><Card/></button>
      <button onClick={()=>{setIsGuess(1)}}><Card/></button>
      <button onClick={()=>{setIsGuess(1)}}><Card/></button>
      <button onClick={()=>{setIsGuess(1)}}><Card/></button>
      <button onClick={()=>{setIsGuess(1)}}><Card/></button>
      <button onClick={()=>{setIsGuess(1)}}><Card/></button>
      <button onClick={()=>{setIsGuess(1)}}><Card/></button>
    </span>
<span className='home'>home</span>
  </div>)
}


