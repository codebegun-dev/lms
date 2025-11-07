// import React, { useState } from "react";

// const CreateSubTopic = () => {
//   const [subtopics, setsubtopics] = useState([
    
//   ]);

//   const [newTopic, setNewTopic] = useState("");
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editValue, setEditValue] = useState("");


//   const handleAdd = () => {
//     if (newTopic.trim() === "") return alert("Please enter a topic name");
//     if (subtopics.includes(newTopic))
//       return alert("This topic already exists!");
//     setsubtopics([...subtopics, newTopic]);
//     setNewTopic("");
//   };


//   const handleDelete = (index) => {
//     const updatedsubtopics = subtopics.filter((_, i) => i !== index);
//     setsubtopics(updatedsubtopics);
//   };


//   const handleEdit = (index) => {
//     setEditingIndex(index);
//     setEditValue(subtopics[index]);
//   };


//   const handleSave = () => {
//     if (editValue.trim() === "") return alert("Please enter a valid topic");
//     const updatedsubtopics = [...subtopics];
//     updatedsubtopics[editingIndex] = editValue;
//     setsubtopics(updatedsubtopics);
//     setEditingIndex(null);
//     setEditValue("");
//   };


//   const handleCancel = () => {
//     setEditingIndex(null);
//     setEditValue("");
//   };

//   return (
//     <div className="container mt-5 p-4 border rounded shadow-sm bg-light">
//           <h4 className="mb-3 text-primary"> subtopics</h4>
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

//       {/* subtopics List */}
//       <ul className="list-group">
//         {subtopics.map((topic, index) => (
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

// export default CreateSubTopic;



import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateSubTopic = () => {
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [newSubtopic, setNewSubtopic] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [editingSubtopic, setEditingSubtopic] = useState(null);
  const [editValue, setEditValue] = useState("");

  const BASE_URL = "http://localhost:8080/api/subtopics";
  const TOPIC_URL = "http://localhost:8080/api/topics";

  // --- FETCH ALL TOPICS ---
  const fetchTopics = async () => {
    try {
      const res = await axios.get(TOPIC_URL);
      setTopics(res.data);
    } catch (err) {
      console.error("Error fetching topics:", err);
      alert("Failed to load topics");
    }
  };

  // --- FETCH ALL SUBTOPICS ---
  const fetchSubtopics = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setSubtopics(res.data);
    } catch (err) {
      console.error("Error fetching subtopics:", err);
      alert("Failed to load subtopics");
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchSubtopics();
  }, []);

  // --- ADD NEW SUBTOPIC ---
  const handleAdd = async () => {
    if (!newSubtopic.trim()) return alert("Please enter a subtopic name");
    if (!selectedTopic) return alert("Please select a topic");

    try {
      await axios.post(BASE_URL, {
        name: newSubtopic,
        topicId: selectedTopic,
      });
      alert("Subtopic added successfully!");
      setNewSubtopic("");
      setSelectedTopic("");
      fetchSubtopics();
    } catch (err) {
      console.error("Error adding subtopic:", err);
      alert("Failed to add subtopic!");
    }
  };

  // --- DELETE SUBTOPIC ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subtopic?")) return;

    try {
      await axios.delete(`${BASE_URL}/${id}`);
      alert("Subtopic deleted successfully!");
      fetchSubtopics();
    } catch (err) {
      console.error("Error deleting subtopic:", err);
      alert("Delete failed!");
    }
  };

  // --- EDIT MODE ---
  const handleEdit = (subtopic) => {
    setEditingSubtopic(subtopic);
    setEditValue(subtopic.name);
    setSelectedTopic(subtopic.topicId);
  };

  // --- SAVE UPDATED SUBTOPIC ---
  const handleSave = async () => {
    if (!editValue.trim()) return alert("Please enter a valid subtopic name");
    if (!selectedTopic) return alert("Please select a topic");

    try {
      await axios.put(`${BASE_URL}/${editingSubtopic.id}`, {
        name: editValue,
        topicId: selectedTopic,
      });
      alert("Subtopic updated successfully!");
      setEditingSubtopic(null);
      setEditValue("");
      setSelectedTopic("");
      fetchSubtopics();
    } catch (err) {
      console.error("Error updating subtopic:", err);
      alert("Update failed!");
    }
  };

  // --- CANCEL EDIT ---
  const handleCancel = () => {
    setEditingSubtopic(null);
    setEditValue("");
    setSelectedTopic("");
  };

  return (
    <div className="container mt-5 p-4 border rounded shadow-sm bg-light">
      <h4 className="mb-3 text-primary text-center">Subtopic Management</h4>

      {/* Add Subtopic Section */}
      <div className="d-flex gap-2 mb-4 justify-content-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Enter subtopic name"
          value={newSubtopic}
          onChange={(e) => setNewSubtopic(e.target.value)}
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
                    <small className="text-muted">
                      ({sub.topicName || "No Topic"})
                    </small>
                  </span>
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(sub)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(sub.id)}
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

export default CreateSubTopic;




