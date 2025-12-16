// // src/Admin_Dashboard/UserManagement/ConfirmModal.jsx
// import React from "react";

// /**
//  * Generic confirm modal
//  * Props:
//  * - open: boolean
//  * - title: string
//  * - message: string
//  * - onConfirm: fn
//  * - onCancel: fn
//  */
// const ConfirmModal = ({ open, title = "Confirm", message = "", onConfirm, onCancel }) => {
//   if (!open) return null;

//   return (
//     <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1070 }}>
//       <div className="bg-white rounded-4 p-4 shadow-lg" style={{ maxWidth: "520px", width: "95%" }}>
//         <div className="text-center mb-3">
//           <h5 className="fw-bold mb-2">{title}</h5>
//           <p className="text-secondary mb-0">{message}</p>
//         </div>

//         <div className="d-flex justify-content-center gap-2 mt-4">
//           <button className="btn btn-secondary" onClick={onCancel} style={{ borderRadius: '20px', padding: '8px 24px' }}>Cancel</button>
//           <button className="btn btn-danger" onClick={onConfirm} style={{ borderRadius: '20px', padding: '8px 24px' }}>Confirm</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmModal;




// src/Admin_Dashboard/UserManagement/ConfirmModal.jsx
import React from "react";

/**
 * Generic confirm modal
 * Props:
 * - open: boolean
 * - title: string
 * - message: string
 * - onConfirm: fn
 * - onCancel: fn
 */
const ConfirmModal = ({ open, title = "Confirm", message = "", onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1070 }}>
      <div className="bg-white rounded-4 p-4 shadow-lg" style={{ maxWidth: "520px", width: "95%" }}>
        <div className="text-center mb-3">
          <h5 className="fw-bold mb-2">{title}</h5>
          <p className="text-secondary mb-0">{message}</p>
        </div>

        <div className="d-flex justify-content-center gap-2 mt-4">
          <button className="btn btn-secondary" onClick={onCancel} style={{ borderRadius: '20px', padding: '8px 24px' }}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} style={{ borderRadius: '20px', padding: '8px 24px' }}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;