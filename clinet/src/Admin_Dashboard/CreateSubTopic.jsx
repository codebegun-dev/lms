import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const CreateSubTopic = () => {
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [newSubtopic, setNewSubtopic] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [editingSubtopic, setEditingSubtopic] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [alert, setAlert] = useState({ message: "", type: "" }); // ✅ Alert state

  const BASE_URL = "http://localhost:8080/api/subtopics";
  const TOPIC_URL = "http://localhost:8080/api/topics";

  // Show bootstrap alert
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 3000);
  };

  const fetchTopics = async () => {
    try {
      const res = await axios.get(TOPIC_URL);
      setTopics(res.data);
    } catch (err) {
      console.error("Error fetching topics:", err);
      showAlert("Failed to load topics", "danger");
    }
  };

  const fetchSubtopics = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setSubtopics(res.data);
    } catch (err) {
      console.error("Error fetching subtopics:", err);
      showAlert("Failed to load subtopics", "danger");
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchSubtopics();
  }, []);

  // ADD Subtopic
  const handleAdd = async () => {
    if (!newSubtopic.trim()) return showAlert("Please enter a subtopic name", "warning");
    if (!selectedTopic) return showAlert("Please select a topic", "warning");

    try {
      await axios.post(BASE_URL, {
        name: newSubtopic,
        topicId: selectedTopic,
      });

      setNewSubtopic("");
      setSelectedTopic("");
      fetchSubtopics();
      showAlert("Subtopic added successfully!", "success");
    } catch (err) {
      console.error("Error adding subtopic:", err);
      showAlert("Failed to add subtopic!", "danger");
    }
  };

  // DELETE Subtopic
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subtopic?")) return;

    try {
      await axios.delete(`${BASE_URL}/${id}`);
      fetchSubtopics();
      showAlert("Subtopic deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting subtopic:", err);
      showAlert("Delete failed!", "danger");
    }
  };

  // Enable Edit Mode
  const handleEdit = (subtopic) => {
    setEditingSubtopic(subtopic);
    setEditValue(subtopic.name);
    setSelectedTopic(subtopic.topicId);
  };

  // SAVE Updated Subtopic
  const handleSave = async () => {
    if (!editValue.trim()) return showAlert("Please enter a valid name", "warning");
    if (!selectedTopic) return showAlert("Please select a topic", "warning");

    try {
      await axios.put(`${BASE_URL}/${editingSubtopic.id}`, {
        name: editValue,
        topicId: selectedTopic,
      });

      setEditingSubtopic(null);
      setEditValue("");
      setSelectedTopic("");
      fetchSubtopics();
      showAlert("Subtopic updated successfully!", "success");
    } catch (err) {
      console.error("Error updating subtopic:", err);
      showAlert("Update failed!", "danger");
    }
  };

  const handleCancel = () => {
    setEditingSubtopic(null);
    setEditValue("");
    setSelectedTopic("");
  };

  return (
    <div className="container mt-5 p-4 border rounded shadow-sm bg-light">

      {/* ✅ Alert Component */}
      {alert.message && (
        <div className={`alert alert-${alert.type} text-center`} role="alert">
          {alert.message}
        </div>
      )}

      <h4 className="mb-3 text-primary text-center">Subtopic Management</h4>

      {/* Add Area */}
      <div className="d-flex gap-2 mb-4 justify-content-center">
        <select
          className="form-select w-auto"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">Select Topic</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="form-control w-50"
          placeholder="Enter subtopic name"
          value={newSubtopic}
          onChange={(e) => setNewSubtopic(e.target.value)}
        />

        <button className="btn btn-success" onClick={handleAdd}>
          Add
        </button>
      </div>

      {/* Subtopics List */}
      <ul className="list-group">
        {subtopics.length === 0 ? (
          <li className="list-group-item text-center">No subtopics found</li>
        ) : (
          subtopics.map((sub) => (
            <li
              key={sub.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {editingSubtopic && editingSubtopic.id === sub.id ? (
                <div className="d-flex gap-2 w-100 align-items-center">
                  <input
                    type="text"
                    className="form-control"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />

                  <select
                    className="form-select w-auto"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                  >
                    <option value="">Select Topic</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
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
                    <strong>{sub.name}</strong>{" "}
                    <small className="text-muted">({sub.topicName || "No Topic"})</small>
                  </span>

                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(sub)}
                    >
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sub.id)}>
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
  );
};

export default CreateSubTopic;
