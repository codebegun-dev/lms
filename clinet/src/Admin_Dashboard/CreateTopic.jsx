// import React, { useState } from "react";

// const CreateTopic = () => {
//   const [topics, setTopics] = useState([
    
//   ]);

//   const [newTopic, setNewTopic] = useState("");
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editValue, setEditValue] = useState("");


//   const handleAdd = () => {
//     if (newTopic.trim() === "") return alert("Please enter a topic name");
//     if (topics.includes(newTopic))
//       return alert("This topic already exists!");
//     setTopics([...topics, newTopic]);
//     setNewTopic("");
//   };


//   const handleDelete = (index) => {
//     const updatedTopics = topics.filter((_, i) => i !== index);
//     setTopics(updatedTopics);
//   };


//   const handleEdit = (index) => {
//     setEditingIndex(index);
//     setEditValue(topics[index]);
//   };


//   const handleSave = () => {
//     if (editValue.trim() === "") return alert("Please enter a valid topic");
//     const updatedTopics = [...topics];
//     updatedTopics[editingIndex] = editValue;
//     setTopics(updatedTopics);
//     setEditingIndex(null);
//     setEditValue("");
//   };


//   const handleCancel = () => {
//     setEditingIndex(null);
//     setEditValue("");
//   };

//   return (
//     <div className="container mt-5 p-4 border rounded shadow-sm bg-light">
//           <h4 className="mb-3 text-primary"> Topics</h4>
//       {/* Add Topic */}
//       <div className="d-flex gap-2 mb-3">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Enter new topic"
//           value={newTopic}
//           onChange={(e) => setNewTopic(e.target.value)}
//         />
//         <button className="btn btn-success" onClick={handleAdd}>
//           Add
//         </button>
//       </div>

//       {/* Topics List */}
//       <ul className="list-group">
//         {topics.map((topic, index) => (
//           <li
//             key={index}
//             className="list-group-item d-flex justify-content-between align-items-center"
//           >
//             {editingIndex === index ? (
//               <div className="d-flex gap-2 w-100">
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={editValue}
//                   onChange={(e) => setEditValue(e.target.value)}
//                 />
//                 <button className="btn btn-primary btn-sm" onClick={handleSave}>
//                   Save
//                 </button>
//                 <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
//                   Cancel
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <span>{topic}</span>
//                 <div>
//                   <button
//                     className="btn btn-warning btn-sm me-2"
//                     onClick={() => handleEdit(index)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(index)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CreateTopic;



import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateTopic = () => {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingTopic, setEditingTopic] = useState(null);
  const [editValue, setEditValue] = useState("");

  const BASE_URL = "http://localhost:8080/api/topics";
  const CATEGORY_URL = "http://localhost:8080/api/categories";

  // --- FETCH ALL TOPICS ---
  const fetchTopics = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setTopics(res.data);
    } catch (err) {
      console.error("Error fetching topics:", err);
      alert("Failed to load topics");
    }
  };

  // --- FETCH ALL CATEGORIES (for dropdown) ---
  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      alert("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchCategories();
  }, []);

  // --- ADD NEW TOPIC ---
  const handleAdd = async () => {
    if (!newTopic.trim()) return alert("Please enter a topic name");
    if (!selectedCategory) return alert("Please select a category");

    try {
      await axios.post(BASE_URL, {
        name: newTopic,
        categoryId: selectedCategory,
      });
      alert("Topic added successfully!");
      setNewTopic("");
      setSelectedCategory("");
      fetchTopics();
    } catch (err) {
      console.error("Error adding topic:", err);
      alert("Failed to add topic!");
    }
  };

  // --- DELETE TOPIC ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;

    try {
      await axios.delete(`${BASE_URL}/${id}`);
      alert("Topic deleted!");
      fetchTopics();
    } catch (err) {
      console.error("Error deleting topic:", err);
      alert("Delete failed!");
    }
  };

  // --- EDIT MODE ---
  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setEditValue(topic.name);
    setSelectedCategory(topic.categoryId);
  };

  // --- SAVE UPDATED TOPIC ---
  const handleSave = async () => {
    if (!editValue.trim()) return alert("Please enter a valid topic name");
    if (!selectedCategory) return alert("Please select a category");

    try {
      await axios.put(`${BASE_URL}/${editingTopic.id}`, {
        name: editValue,
        categoryId: selectedCategory,
      });
      alert("Topic updated successfully!");
      setEditingTopic(null);
      setEditValue("");
      setSelectedCategory("");
      fetchTopics();
    } catch (err) {
      console.error("Error updating topic:", err);
      alert("Update failed!");
    }
  };

  // --- CANCEL EDIT ---
  const handleCancel = () => {
    setEditingTopic(null);
    setEditValue("");
    setSelectedCategory("");
  };

  return (
    <div className="container mt-5 p-4 border rounded shadow-sm bg-light">
      <h4 className="mb-3 text-primary text-center">Topic Management</h4>

      {/* Add Topic Section */}
      <div className="d-flex gap-2 mb-4 justify-content-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Enter new topic"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
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
        <button className="btn btn-success" onClick={handleAdd}>
          Add
        </button>
      </div>

      {/* Topic List */}
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
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(topic)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(topic.id)}
                    >
                      Delete
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

export default CreateTopic;
