import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Category = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  // ✅ For Alerts
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");  

  const BASE_URL = "http://localhost:8080/api/categories";

  // ✅ ALERT FUNCTION
  const showAlert = (msg, type) => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // --- FETCH ALL CATEGORIES (GET) ---
  const fetchCategories = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      showAlert("❌ Failed to load categories", "danger");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- ADD OR UPDATE CATEGORY ---
  const handleAddOrUpdate = async () => {
    if (!category.trim()) return showAlert("⚠ Please enter a category name!", "warning");

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/${editId}`, { name: category });
        showAlert("Category updated successfully!", "primary");
      } else {
        await axios.post(BASE_URL, { name: category });
        showAlert("Category added successfully!", "primary");
      }

      setCategory("");
      setEditId(null);
      fetchCategories(); // Refresh list
    } catch (err) {
      console.error("Error adding/updating category:", err);
      showAlert("❌ Operation failed!", "danger");
    }
  };

  // --- DELETE CATEGORY ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${BASE_URL}/${id}`);
      showAlert("Category deleted!", "danger");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      showAlert("❌ Delete failed!", "danger");
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
      <h3 className="text-center mb-4">Category Management</h3>

      {/* ✅ Alert Section */}
      {message && (
        <div className={`alert alert-${messageType} text-center`} role="alert">
          {message}
        </div>
      )}

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
          <button className="btn btn-secondary ms-2" onClick={handleCancelEdit}>
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
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(cat)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <FaTrash />
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
