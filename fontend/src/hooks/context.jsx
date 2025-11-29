import { useState,createContext,useContext, Children } from "react";
//这是一个hook


const Content = createContext()

export function ContentProvider({children}){
    const [isGuess,setIsGuess] =useState(0)
    const [isCreate,setIsCreate] =useState(0)
    const [guessInputValue,setGuessInputValue] =useState([])
    const [enterFee,setEnterFee] =useState([])
    const [guessValue,setGuessValue] =useState([])
    const [CreateInputValue,setCreateInputValue] =useState([])
    const [userAddress,setUserAdderss] = useState([])
    const [hardInputValue,setHardInputValue] =useState([])
    const [nameInputValue,setNameInputValue] =useState([])
    const [log,setLog]= useState(null)
    const [answerInputValue,setAnswerInputValue] =useState([])
    const [x402Response,setX402Response] =useState(null)
    const [tipInputValue,setTipInputValue] =useState([])    
    const [descri,setDscri] = useState([])
    const valueToShare ={
        isGuess:isGuess,
        setIsGuess:setIsGuess,
        isCreate:isCreate,
        setIsCreate:setIsCreate,
        guessInputValue:guessInputValue,
        setGuessInputValue:setGuessInputValue,
        CreateInputValue:CreateInputValue,
        setCreateInputValue:setCreateInputValue,
        enterFee:enterFee,
        setEnterFee:setEnterFee,
        guessValue:guessValue,
        setGuessValue:setGuessValue,
        userAddress:userAddress,
        setUserAdderss:setUserAdderss,
        hardInputValue:hardInputValue,
        setHardInputValue:setHardInputValue,
        nameInputValue:nameInputValue,
        setNameInputValue:setNameInputValue,
        answerInputValue:answerInputValue,
        setAnswerInputValue:setAnswerInputValue,
        log:log,
        setLog:setLog,
        x402Response:x402Response,
        setX402Response:setX402Response,
        tipInputValue:tipInputValue,
        setTipInputValue:setTipInputValue,
        descri:descri,
        setDscri:setDscri,

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