import {contract} from "./contracts"
import { useWriteContract } from "wagmi"

export function Hash(answer="11.29"){
    const {writeContract} = useWriteContract()
    const {data} = writeContract({
        address:contract.address,
        abi:contract.abi,
        functionName:"generateAnswerHash",
        args:[answer],
    })
    console.log(data)
}

