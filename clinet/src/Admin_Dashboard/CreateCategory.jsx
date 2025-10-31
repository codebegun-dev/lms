// import React, { useState } from "react";

// const Category = () => {
//   const [category, setCategory] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);

//   // --- CREATE / UPDATE ---
//   const handleAddOrUpdate = () => {
//     if (!category.trim()) return alert("Please enter a category name!");

//     if (editIndex !== null) {
//       // Update existing category
//       const updated = [...categories];
//       updated[editIndex] = category;
//       setCategories(updated);
//       setEditIndex(null);
//     } else {
//       // Add new category
//       setCategories([...categories, category]);
//     }

//     setCategory("");
//   };

//   // --- DELETE ---
//   const handleDelete = (index) => {
//     const updated = categories.filter((_, i) => i !== index);
//     setCategories(updated);
//   };

//   // --- EDIT ---
//   const handleEdit = (index) => {
//     setCategory(categories[index]); // set current category in input box
//     setEditIndex(index); // mark which index is being edited
//   };

//   return (
//     <div className="container mt-4">
//       <h3 className="text-center mb-4">Category Management (CRUD)</h3>

//       {/* Input Section */}
//       <div className="d-flex justify-content-center mb-3">
//         <input
//           type="text"
//           className="form-control w-50 me-2"
//           placeholder="Enter category name"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//         />
//         <button className="btn btn-primary" onClick={handleAddOrUpdate}>
//           {editIndex !== null ? "Update" : "Add"}
//         </button>
//       </div>

//       {/* Display Table */}
//       <table className="table table-bordered text-center">
//         <thead className="table-light">
//           <tr>
//              <th>Category Name</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {categories.length === 0 ? (
//             <tr>
//               <td colSpan="3">No categories added yet</td>
//             </tr>
//           ) : (
//             categories.map((cat, index) => (
//               <tr key={index}>

//                 <td>{cat}</td>
//                 <td>
//                   <button
//                     className="btn btn-sm btn-warning me-2"
//                     onClick={() => handleEdit(index)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => handleDelete(index)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Category;



import React, { useState, useEffect } from "react";
import axios from "axios";

const Category = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  const BASE_URL = "http://localhost:8080/api/categories";

  // --- FETCH ALL CATEGORIES (GET) ---
  const fetchCategories = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      alert("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- ADD or UPDATE CATEGORY ---
  const handleAddOrUpdate = async () => {
    if (!category.trim()) return alert("Please enter a category name!");

    try {
      if (editId) {
        // UPDATE API CALL
        await axios.put(`${BASE_URL}/${editId}`, { name: category });
        alert("Category updated successfully!");
      } else {
        // ADD API CALL
        await axios.post(BASE_URL, { name: category });
        alert("Category added successfully!");
      }

      setCategory("");
      setEditId(null);
      fetchCategories(); // Refresh list
    } catch (err) {
      console.error("Error adding/updating category:", err);
      alert("Operation failed!");
    }
  };

  // --- DELETE CATEGORY ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${BASE_URL}/${id}`);
      alert("Category deleted!");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Delete failed!");
    }
  };

  // --- EDIT MODE ---
  const handleEdit = (cat) => {
    setCategory(cat.name);
    setEditId(cat.id);
  };

  // --- CANCEL EDIT ---
  const handleCancelEdit = () => {
    setCategory("");
    setEditId(null);
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Category Management (API Integrated)</h3>

      {/* Input Section */}
      <div className="d-flex justify-content-center mb-3">
        <input
          type="text"
          className="form-control w-50 me-2"
          placeholder="Enter category name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddOrUpdate}>
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button
            className="btn btn-secondary ms-2"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Display Table */}
      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="3">No categories found</td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Category;

