import "./card.css"

export const Card = ({ 
  title = "puzzle", 
  status = "status", 
  imageLabel = "picture", 
  people = "people" 
}) => {
  return (
    <div className="puzzle-card">
      {/* 顶部信息 */}
      <div className="card-row">
        <span>{title}</span>
        <span>{status}</span>
      </div>

      {/* 图片区域 */}
      <div className="card-image-placeholder">
        {imageLabel}
      </div>

      <div className="card-row bottom">
        <span>{people}</span>
      </div>
    </div>
  );
};