import { useState,createContext,useContext, Children } from "react";
//这是一个hook


const Content = createContext()

export function ContentProvider({children}){
    const [isGuess,setIsGuess] =useState(0)
    const [isCreate,setIsCreate] =useState(0)
    const [inputValue,setInputValue] =useState([])
    const valueToShare ={
        isGuess:isGuess,
        setIsGuess:setIsGuess,
        isCreate:isCreate,
        setIsCreate:setIsCreate,
        inputValue:inputValue,
        setInputValue:setInputValue,
   
    }
    return (
        <Content.Provider value={valueToShare}>
            {children}
        </Content.Provider>
    )
}

export function useContent(){
    return useContext(Content)
}