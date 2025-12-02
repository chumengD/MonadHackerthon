import { useWatchContractEvent } from "wagmi"
import { useContent } from "./context" 
import { contractx } from "./contracts"

export function WatchEvent_and_read(){
    const {setLog} = useContent()
         useWatchContractEvent({
            address:contracx.address,
            abi:contractx.abi,
            onLogs(logs){
                setLog(logs)
                console.log(`人数+1!`)
            }
        })
    
}
