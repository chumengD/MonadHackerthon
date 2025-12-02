import "./card.css"

export const Card = ({ 
  title = "puzzle title", 
  status = "status", 
  pictureUrl, 
  people = "people" ,
  number = "number"
}) => {
  return (
    <div className="puzzle-card">
      {/* 顶部信息 */}
      <div className="card-row">
        <span>{number}</span>
        <span>{title}</span>
        
        
      </div>

      {/* 图片区域 */}
      <div className="card-image-placeholder">
      <img src={pictureUrl} alt="picture of puzzle" />
      </div>

      <div className="card-row bottom">
        <span>参与人数：<span className="people">{people}</span></span>
        <span>{status}</span>
        
      </div>
    </div>
  );
};