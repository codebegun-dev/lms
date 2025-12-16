// // src/Admin_Dashboard/UserManagement/UserTable.jsx
// import React from "react";
// import UserRow from "./UserRow";

// const UserTable = ({ users, loading, onEditFullProfile, onViewBasicInfo, onDelete, onToggleStatus, canPerformAction }) => {
//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-3 text-muted fw-semibold">Loading users...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
//       <div className="card-body p-0">
//         <div className="table-responsive">
//           <table className="table table-hover mb-0">
//             <thead style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
//               <tr>
//                 <th className="border-0 py-3 ps-4">User ID</th>
//                 <th className="border-0 py-3">Name</th>
//                 <th className="border-0 py-3">Email</th>
//                 <th className="border-0 py-3">Phone</th>
//                 <th className="border-0 py-3">Role</th>
//                 <th className="border-0 py-3">Status</th>
//                 <th className="border-0 py-3 text-center pe-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length > 0 ? (
//                 users.map((u) => (
//                   <UserRow
//                     key={u.id}
//                     user={u}
//                     onEditFullProfile={() => onEditFullProfile(u)}
//                     onViewBasicInfo={() => onViewBasicInfo(u)}
//                     onDelete={() => onDelete(u)}
//                     onToggleStatus={() => onToggleStatus(u)}
//                     canPerformAction={() => canPerformAction(u)}
//                   />
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center py-5">
//                     <div style={{ fontSize: "4rem", opacity: 0.3 }}>📭</div>
//                     <p className="text-muted mb-0 mt-2 fw-semibold">No users found</p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserTable;




// src/Admin_Dashboard/UserManagement/UserTable.jsx
import React from "react";
import UserRow from "./UserRow";

const UserTable = ({ users, loading, onEditFullProfile, onViewBasicInfo, onDelete, onToggleStatus, canPerformAction }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fw-semibold">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
              <tr>
                <th className="border-0 py-3 ps-4">User ID</th>
                <th className="border-0 py-3">Name</th>
                <th className="border-0 py-3">Email</th>
                <th className="border-0 py-3">Phone</th>
                <th className="border-0 py-3">Role</th>
                <th className="border-0 py-3">Status</th>
                <th className="border-0 py-3 text-center pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    onEditFullProfile={() => onEditFullProfile(u)}
                    onViewBasicInfo={() => onViewBasicInfo(u)}
                    onDelete={() => onDelete(u)}
                    onToggleStatus={() => onToggleStatus(u)}
                    canPerformAction={() => canPerformAction(u)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div style={{ fontSize: "4rem", opacity: 0.3 }}>📭</div>
                    <p className="text-muted mb-0 mt-2 fw-semibold">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;