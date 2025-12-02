import React from 'react';
import './App.css';
import { ConnectButton } from "@rainbow-me/rainbowkit"
import {Card} from "./component/card" 
import { GuessPuzzle } from './component/guessPuzzle';
import { CreateGuess } from './component/createPuzzle';
import { useContent } from './hooks/context';
import { Cards } from './component/displayCard';



export function Page() {
    const {setIsCreate} = useContent()
  return (<div className='Frame-Border'>
    <div className='Border'></div>
    <GuessPuzzle/>
    <CreateGuess/>
    <button className='createPuzzle' onClick={()=>{setIsCreate(1)}}> createPuzzle</button>
    <span className='ConnectButton'><ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false}/></span>
    <span className='Card'>
      <Cards />
    </span>
<span className='home'>home</span>


  </div>)
}


/*  title = "puzzle", 
  status = "status", 
  imageLabel = "picture", 
  people = "people"  */