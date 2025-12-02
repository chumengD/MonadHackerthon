
//用一个方法获取卡片信息
//序号，谜题名称，谜题介绍，奖金，入场费，图片，谜题状态(default:未揭秘)，参与人数(default:0)
//const data = getCard()
import {Card} from "./card"
import { useContent } from "../hooks/context"
import { GuessPuzzle } from "./guessPuzzle"


const data= [
    {
        number:1,
        title:"青蛙",
        content:"这是关于青蛙谜题的谜面",
        description:"这是一个关于青蛙的谜题",
        prize:2,
        enterFee:0.1,
        pictureUrl:"https://",
        status:"未揭秘",
        people:0,
    },
    {
        number:2,
        title:"海猫",
        content:"这是关于海猫谜题的谜面",
        description:"海猫鸣泣之时，无人生还",
        prize:3,
        enterFee:0.15,
        pictureUrl:"https://",
        status:"已揭秘",
        people:333,
    }    
]

export function Cards(){
    /*let data
    async function getData(){
    const response =  await fetch(https:/)
    data = await response.json()
}*/
    const {setIsGuess,setDescription,setStatus,setEnterFee} = useContent()
    return (
        <div>
        {data.map((card)=>{
          return <button  onClick={()=>{
            setStatus(card.status)
            setDescription(card.description)
            setEnterFee(card.enterFee)
            setIsGuess(1)
          }}><Card  title={card.title} number={card.number} people={card.people} status={card.status} picture={data.pictureUrl}/></button>
        })}
        </div>
    )
}


