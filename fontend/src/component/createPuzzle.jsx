import './createPuzzle.css';
import { useContent } from '../hooks/context';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { message } from "antd"
//上传图片的api还没有写    create按钮的上传函数没写

export function CreateGuess(){

    const {isCreate,setIsCreate,prizeInputValue,setPrizeInputvalue,CreateInputValue,setCreateInputValue,enterFeeInputValue,setEnterFeeInputValue,nameInputValue,setHardInputValue,setNameInputValue,answerInputValue,setAnswerInputValue,tipInputValue,setTipInputValue,setDscri,descri} = useContent()
    function onUpload(){
      message.success("上传成功！")
    }
    async function handleClick(){
      const data ={
        title:nameInputValue,
        content:CreateInputValue,
        answer:answerInputValue,
        tip:tipInputValue,
        description:descri,
        prize:prizeInputValue,
        enterFee:enterFeeInputValue
      }
      message.success(`上传中`)
 try{
          const response = await fetch('https:/create_rid',{
              method:'post',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify(data)
            })
          const responseData = await response.json()
          message.success(`上传状态：`,responseData)
            }catch(error){message.error(`error:`,error)}      
    }
  return (
    isCreate?
    <div className='modal-overlay'>
    <div className="modal-container">
      {/* Header */}
      <div className="modal-header">
        <span className="modal-title">create</span>
        <button className="close-btn" onClick={()=>{setIsCreate(0)}}>X</button>
      </div>

      {/* Main Content */}
      <div className="modal-content">
        
        <div className='input'>
          
          <p className='puzzle'>puzzle</p>
         <input type="text" Value={CreateInputValue}  onchange={(e)=>{setCreateInputValue(e.target.value)}} className="placeholder-box1"/>
         <p className='answer'>answer</p>
         <input type="text" Value={answerInputValue}  onchange={(e)=>{setAnswerInputValue(e.target.value)}} className="placeholder-box2"/>
         <p className='tip'>tip</p>
         <input type="text" Value={tipInputValue}  onchange={(e)=>{setTipInputValue(e.target.value)}} className="placeholder-box3"/>
         <p className='des'>description</p>
         <input type="text" Value={descri}  onchange={(e)=>{setDscri(e.target.value)}} className="placeholder-box4"/>
         <p className='puzzleName'>Puzzle-name</p>
         <input type="text" Value={nameInputValue}  onchange={(e)=>{setNameInputValue(e.target.value)}} className="placeholder-box1"/>
         
         
        </div>
        {/* Controls Row */}
        <div className="controls-row">
          {/* Left: Prize Input */}
          <div className="prize-group">
            <div>
              <label>prize:<input type="text" Value={prizeInputValue}  onChange={(e)=>{setPrizeInputvalue(e.target.value)}} className="prize-input" /> mon</label>
            </div>
            <div>
              <label>enter-fee:<input type="text" Value={enterFeeInputValue} onChange={(e)=>{setEnterFeeInputValue(e.target.value)}} className="prize-input" /> mon</label>
            </div>
           
        </div>
          {/* Right: Upload Button & Text */}
          <div className="upload-group">
            <span className="upload-btn">
              
             <FileUpload onUpload={onUpload} name="picture" url={'https:/create_rid'} multiple accept="image/*" maxFileSize={10000000} emptyTemplate={<p className="m-0">Drag and drop files to here.</p>} /></span>
          
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="footer">
        <button className="create-btn" onClick={handleClick}>create</button>
      </div>
    </div>
    </div>
    :<></>
  );
};

