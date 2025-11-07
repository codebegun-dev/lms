import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const CreateTopic = () => {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingTopic, setEditingTopic] = useState(null);
  const [editValue, setEditValue] = useState("");

  // ✅ For UI Alerts
  const [alert, setAlert] = useState({ type: "", message: "" });

  const BASE_URL = "http://localhost:8080/api/topics";
  const CATEGORY_URL = "http://localhost:8080/api/categories";

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  const fetchTopics = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setTopics(res.data);
    } catch (err) {
      console.error("Error fetching topics:", err);
      showAlert("danger", "Failed to load topics");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      showAlert("danger", "Failed to load categories");
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newTopic.trim()) return showAlert("warning", "Please enter a topic name");
    if (!selectedCategory) return showAlert("warning", "Please select a category");

    try {
      await axios.post(BASE_URL, {
        name: newTopic,
        categoryId: selectedCategory,
      });

      showAlert("success", "Topic added successfully!");
      setNewTopic("");
      setSelectedCategory("");
      fetchTopics();
    } catch (err) {
      console.error("Error adding topic:", err);
      showAlert("danger", "Failed to add topic!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;

    try {
      await axios.delete(`${BASE_URL}/${id}`);
      showAlert("danger", "🗑️ Topic deleted!");
      fetchTopics();
    } catch (err) {
      console.error("Error deleting topic:", err);
      showAlert("danger", "Delete failed!");
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setEditValue(topic.name);
    setSelectedCategory(topic.categoryId);
  };

  const handleSave = async () => {
    if (!editValue.trim()) return showAlert("warning", "Please enter a valid topic name");
    if (!selectedCategory) return showAlert("warning", "Please select a category");

    try {
      await axios.put(`${BASE_URL}/${editingTopic.id}`, {
        name: editValue,
        categoryId: selectedCategory,
      });

      showAlert("primary", "Topic updated successfully!");
      setEditingTopic(null);
      setEditValue("");
      setSelectedCategory("");
      fetchTopics();
    } catch (err) {
      console.error("Error updating topic:", err);
      showAlert("danger", "Update failed!");
    }
  };

  const handleCancel = () => {
    setEditingTopic(null);
    setEditValue("");
    setSelectedCategory("");
  };

  return (
    <div className="container mt-5 p-4">

       {alert.message && (
        <div className={`alert alert-${alert.type} text-center`} role="alert">
          {alert.message}
        </div>
      )}

      <div className="card shadow p-4">
        <h3 className="text-center text-primary mb-4">Topic Management</h3>

        <div className="d-flex gap-2 mb-4 justify-content-center">
          <select
            className="form-select w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="form-control w-50"
            placeholder="Enter new topic"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />

          <button className="btn btn-success" onClick={handleAdd}>
            Add
          </button>
        </div>

        {/* ✅ Topic List */}
        <ul className="list-group">
          {topics.length === 0 ? (
            <li className="list-group-item text-center">No topics found</li>
          ) : (
            topics.map((topic) => (
              <li
                key={topic.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {editingTopic && editingTopic.id === topic.id ? (
                  <div className="d-flex gap-2 w-100 align-items-center">
                    <input
                      type="text"
                      className="form-control"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />

                    <select
                      className="form-select w-auto"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    <button className="btn btn-primary btn-sm" onClick={handleSave}>
                      Save
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span>
                      <strong>{topic.name}</strong>{" "}
                      <small className="text-muted">
                        ({topic.categoryName || "No Category"})
                      </small>
                    </span>

                    <div>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(topic)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(topic.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CreateTopic;
