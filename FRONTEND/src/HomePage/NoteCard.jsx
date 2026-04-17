// import React from "react";
// import "./Dashboard.css";
// const NoteCard = ({  data ,onClick}) => {
//   function formatDate(isoDate) {
//     const date = new Date(isoDate);

//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();

//     return `${day}-${month}-${year}`;
//   }
//   return (
//     <div className="card" onClick={onClick}>
//       <img src="https://picsum.photos/300/200?1" alt="" />
//       {/* <span className="badge">Shared</span> */}
//       {/* <div className="pages">{data.downloadCount} Downloads</div> */}

//       <div className="card-body">
//         <h3>{data.title}</h3>
//         <div className="meta">
//           <span>{formatDate(data.createdAt)}</span>
//           <span>{data.fileSize / 1024} KB</span>
//         </div>

//         <div className="tags">
//           {data.tags &&
//             data.tags.length > 0 &&
//             data.tags.map((item, index) => <span key={index}>{item}</span>)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoteCard;
import React from "react";
import "./Dashboard.css";
import "./NoteCard.css"
const NoteCard = ({ data, onClick }) => {
  function formatDate(isoDate) {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return (
    <div className="card" onClick={onClick}>
      
      {/* Title */}
      <h3 className="card-title">{data.title}</h3>

      {/* Description (optional if exists) */}
      {data.content && (
        <p className="card-desc">
          {data.content.slice(0, 80)}...
        </p>
      )}

      {/* Meta info */}
      <div className="meta">
        <span>📅 {formatDate(data.createdAt)}</span>
        <span>📦 {(data.fileSize /( 1024*1024)).toFixed(3)} MB</span>
      </div>

      {/* Tags */}
      <div className="tags">
        {data.tags?.map((item, index) => (
          <span key={index}>#{item}</span>
        ))}
      </div>
    </div>
  );
};

export default NoteCard;
