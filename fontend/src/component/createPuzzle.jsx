import './createPuzzle.css';
import { useContent } from '../hooks/context';
import { FileUpload } from 'primereact/fileupload';
import { message } from "antd"
//上传图片的api还没有写    create按钮的上传函数没写

export function CreateGuess(){

    const {isCreate,setIsCreate,CreateInputValue,setCreateInputValue,enterFee,setEnterFee,nameInputValue,setHardInputValue,setNameInputValue,answerInputValue,setAnswerInputValue,tipInputValue,setTipInputValue,setDscri,descri} = useContent()
    function onUpload(){
      console.log("上传成功！")
    }
    function handleClick(){
      message.success(`你好，后面还没写呢`)
      upload(CreateInputValue)
      setCreateInputValue([])
      alert('上传成功!')
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

         
         
        </div>
        {/* Controls Row */}
        <div className="controls-row">
          {/* Left: Prize Input */}
          <div className="prize-group">
            <div>
              <label>prize:<input type="text" defaultValue="0.1" className="prize-input" /> mon</label>
            </div>
            <div>
              <label>enter-fee:<input type="text" Value={enterFee} onChange={(e)=>{setEnterFee(e.target.value)}} className="prize-input" /> mon</label>
            </div>
            <div>
              <label>puzzle-Name:<input type="text" Value={nameInputValue} onChange={(e)=>{setNameInputValue(e.target.value)}} className="prize-input" /></label>
            </div>
          
        </div>
        
        
          {/* Right: Upload Button & Text */}
          <div className="upload-group">
            <span className="upload-btn"><FileUpload  mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} auto chooseLabel="upload" /></span>
            <span className="helper-text">default created by AI</span>
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

