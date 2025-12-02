import { useState,createContext,useContext, Children } from "react";
//这是一个hook


const Content = createContext()

export function ContentProvider({children}){
    const [isGuess,setIsGuess] =useState(0)
    const [isCreate,setIsCreate] =useState(0)
    const [guessInputValue,setGuessInputValue] =useState([])
    const [enterFeeInputValue,setEnterFeeInputValue] =useState([])
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
    const [description ,setDescription] = useState('')
    const [status,setStatus] = useState(null)
    //content, tip, answer
    const [content,setContent] = useState("xxxxxxxx")
    //const [,] =useState()
    const [tip,setTip] =useState("xxxunlockedxxx")
    const [answer,setAnswer] =useState(null)
    const [enterFee,setEnterFee] =useState()
    const [isRight,setIsRight] =useState()
    const [prizeInputValue,setPrizeInputvalue] =useState(0.1)
    const valueToShare ={
        prizeInputValue:prizeInputValue,
        setPrizeInputvalue:setPrizeInputvalue,
        isRight:isRight,
        setIsRight:setIsRight,
        enterFee:enterFee,
        setEnterFee:setEnterFee,
        content:content,
        setContent:setContent,
        tip:tip,
        setTip:setTip,
        answer:answer,
        setAnswer:setAnswer,
        isGuess:isGuess,
        setIsGuess:setIsGuess,
        isCreate:isCreate,
        setIsCreate:setIsCreate,
        guessInputValue:guessInputValue,
        setGuessInputValue:setGuessInputValue,
        CreateInputValue:CreateInputValue,
        setCreateInputValue:setCreateInputValue,
        enterFeeInputValue:enterFeeInputValue,
        setEnterFeeInputValue:setEnterFeeInputValue,
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
        description:description,
        setDescription:setDescription,
        status:status,
        setStatus:setStatus,
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