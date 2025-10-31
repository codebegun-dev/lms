// import React, { useState, useEffect } from "react";
// import { Edit, Trash2 } from "lucide-react";
// import { FiSearch } from "react-icons/fi";
// import axios from "axios";

// const QuestionBank = () => {
//   const [questions, setQuestions] = useState([]);
//   const [formData, setFormData] = useState({
//     id: null,
//     category: "Technical",
//     difficulty: "Medium",
//     title: "",
//     topic: "Java",
//   });
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const questionsPerPage = 6;
//   const [errors, setErrors] = useState({});

//   const categoryTopics = {
//     Technical: ["Java", "HTML", "CSS", "Bootstrap", "JavaScript", "React JS", "Springboot", "JDBC"],
//     Communication: ["Verbal", "Non-verbal", "Listening", "Presentation", "Negotiation"],
//     Behavioral: ["Adaptability", "Teamwork", "Problem Solving", "Time Management"],
//     HR: ["Recruitment", "Policies", "Payroll", "Performance", "Training"], 

//   };

//   const API_BASE = "http://localhost:8080/api/questions";

//   useEffect(() => {
//     fetchQuestions();
//   }, []);

//   const fetchQuestions = () => {
//     axios
//       .get(API_BASE)
//       .then((res) => setQuestions(res.data))
//       .catch((err) => console.error(err));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "category") {
//       setFormData({
//         ...formData,
//         category: value,
//         topic: categoryTopics[value][0],
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }

//     setErrors({ ...errors, [name]: false });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.title.trim()) newErrors.title = true;
//     if (!formData.topic.trim()) newErrors.topic = true;
//     if (!formData.category.trim()) newErrors.category = true;
//     if (!formData.difficulty.trim()) newErrors.difficulty = true;
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleAddOrUpdate = () => {
//     if (!validateForm()) return;

//     if (formData.id) {
//       axios
//         .put(`${API_BASE}/${formData.id}`, formData)
//         .then(() => {
//           fetchQuestions();
//           alert("Question updated successfully!");
//           handleReset();
//         })
//         .catch((err) => console.error(err));
//     } else {
//       axios
//         .post(API_BASE, formData)
//         .then(() => {
//           fetchQuestions();
//           alert("Question added successfully!");
//           handleReset();
//         })
//         .catch((err) => console.error(err));
//     }
//   };

//   const handleEdit = (id) => {
//     const selected = questions.find((q) => q.id === id);
//     if (selected) {
//       setFormData({
//         id: selected.id,
//         category: selected.category,
//         difficulty: selected.difficulty,
//         title: selected.title,
//         topic: selected.topic,
//       });
//       setErrors({});
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this question?")) {
//       axios
//         .delete(`${API_BASE}/${id}`)
//         .then(() => fetchQuestions())
//         .catch((err) => console.error(err));
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       id: null,
//       category: "Technical",
//       difficulty: "Medium",
//       title: "",
//       topic: "Java",
//     });
//     setErrors({});
//   };

//   const filtered = questions.filter(
//     (q) =>
//       q.title.toLowerCase().includes(search.toLowerCase()) ||
//       q.topic.toLowerCase().includes(search.toLowerCase()) ||
//       q.category.toLowerCase().includes(search.toLowerCase()) ||
//       q.difficulty.toLowerCase().includes(search.toLowerCase())
//   );

//   const indexOfLast = currentPage * questionsPerPage;
//   const indexOfFirst = indexOfLast - questionsPerPage;
//   const current = filtered.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filtered.length / questionsPerPage);

//   const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
//   const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

//   // --- Statistics ---
//   const totalQuestions = questions.length;
//   const technicalCount = questions.filter((q) => q.category === "Technical").length;
//   const communicationCount = questions.filter((q) => q.category === "Communication").length;
//   const behavioralCount = questions.filter((q) => q.category === "Behavioral").length;

//   return (
//     <div className="container my-4">
//       {/* Four Cards Section */}
//       <div className="row text-center mb-4">
//         <div className="col-md-3">
//           <div className="card shadow-sm border-primary">
//             <div className="card-body">
//               <h6>Total Questions</h6>
//               <h3>{totalQuestions}</h3>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card shadow-sm border-success">
//             <div className="card-body">
//               <h6>Technical Questions</h6>
//               <h3>{technicalCount}</h3>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card shadow-sm border-info">
//             <div className="card-body">
//               <h6>Communication Questions</h6>
//               <h3>{communicationCount}</h3>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card shadow-sm">
//             <div className="card-body">
//               <h6>Behavioral & HR questions</h6>
//               <h3>{behavioralCount}</h3>
//             </div>
//           </div>
//         </div>
//       </div>

 
//       <h1 className="mb-4 text-center fw-bold">Question Bank</h1>

//       {/* --- Manage Questions Section --- */}
//       <div className="card mb-3 shadow-sm">
//         <div className="card-body">
//           <h5 className="card-title">Manage Questions</h5>
//           <p className="text-muted">Add new questions or filter existing ones.</p>

//           <div className="row mb-1">
//             <div className="col-md-6 mb-1">
//               <label className="form-label">
//                 Category <span style={{ color: "red" }}>*</span>
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="form-select"
//                 style={{ borderColor: errors.category ? "red" : "" }}
//               >
//                 {Object.keys(categoryTopics).map((cat) => (
//                   <option key={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-6 mb-1">
//               <label className="form-label">
//                 Difficulty Level <span style={{ color: "red" }}>*</span>
//               </label>
//               <div className="d-flex gap-3 align-items-center">
//                 {["Easy", "Medium", "Hard"].map((lvl) => (
//                   <div className="form-check" key={lvl}>
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="difficulty"
//                       value={lvl}
//                       checked={formData.difficulty === lvl}
//                       onChange={handleChange}
//                     />
//                     <label className="form-check-label">{lvl}</label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="mb-1">
//             <label className="form-label">
//               Topic <span style={{ color: "red" }}>*</span>
//             </label>
//             <select
//               name="topic"
//               value={formData.topic}
//               onChange={handleChange}
//               className="form-select"
//               style={{ borderColor: errors.topic ? "red" : "" }}
//             >
//               {categoryTopics[formData.category].map((topic) => (
//                 <option key={topic}>{topic}</option>
//               ))}
//             </select>
//           </div>

//           <div className="mb-1">
//             <label className="form-label">
//               Question Title <span style={{ color: "red" }}>*</span>
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter question title..."
//               style={{ borderColor: errors.title ? "red" : "" }}
//             />
//           </div>

//           <div className="mb-1">
//             <label className="form-label">Search Questions</label>
//             <div className="input-group">
//               <span className="input-group-text">
//                 <FiSearch />
//               </span>
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="form-control"
//                 placeholder="Search by title, topic, category..."
//               />
//             </div>
//           </div>

//           <div className="d-flex gap-2">
//             <button className="btn btn-primary" onClick={handleAddOrUpdate}>
//               {formData.id ? "Update Question" : "Add Question"}
//             </button>
//             <button className="btn btn-secondary" onClick={handleReset}>
//               Reset Form
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- Question List Section --- */}
//       <div className="card shadow-sm">
//         <div className="card-body">
//           <h5 className="card-title">Question List</h5>
//           <p className="text-muted">Browse and manage all questions.</p>

//           {filtered.length === 0 ? (
//             <p className="text-center py-3">No questions found.</p>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-bordered table-hover">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Question Title</th>
//                     <th>Category</th>
//                     <th>Difficulty</th>
//                     <th>Topic</th>
//                     <th>Created By</th>
//                     <th>Created Date</th>
//                     <th className="text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {current.map((q) => (
//                     <tr key={q.id}>
//                       <td>{q.title}</td>
//                       <td>{q.category}</td>
//                       <td>{q.difficulty}</td>
//                       <td>{q.topic}</td>
//                       <td>{q.createdBy}</td>
//                       <td>{q.createdDate}</td>
//                       <td className="text-center">
//                         <button
//                           className="btn btn-link text-primary p-0 me-2"
//                           onClick={() => handleEdit(q.id)}
//                         >
//                           <Edit size={18} />
//                         </button>
//                         <button
//                           className="btn btn-link text-danger p-0"
//                           onClick={() => handleDelete(q.id)}
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {filtered.length > questionsPerPage && (
//             <div className="d-flex justify-content-end gap-2 mt-3">
//               <button
//                 className="btn btn-outline-secondary btn-sm"
//                 onClick={prevPage}
//                 disabled={currentPage === 1}
//               >
//                 &lt; Previous
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   className={`btn btn-sm ${
//                     currentPage === i + 1 ? "btn-primary" : "btn-outline-secondary"
//                   }`}
//                   onClick={() => setCurrentPage(i + 1)}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 className="btn btn-outline-secondary btn-sm"
//                 onClick={nextPage}
//                 disabled={currentPage === totalPages}
//               >
//                 Next &gt;
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionBank;





import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({
    totalQuestions: 0,
    categoryWiseCount: {},
  });

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    difficulty: "Medium",
    categoryId: "",
    topicId: "",
    subTopicId: "",
  });

  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingSubtopics, setLoadingSubtopics] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const API_BASE = "http://localhost:8080/api/questions";
  const CATEGORY_API = "http://localhost:8080/api/categories";
  const TOPIC_API = "http://localhost:8080/api/topics";
  const SUBTOPIC_API = "http://localhost:8080/api/subtopics";
  const COUNT_API =
    "http://localhost:8080/api/questions/analytics/count-by-category";

  // --- LOAD DATA ---
  useEffect(() => {
    fetchQuestions();
    fetchCategories();
    fetchCounts();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(API_BASE);
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
      alert("Failed to load questions!");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchCounts = async () => {
    try {
      const res = await axios.get(COUNT_API);
      setQuestionCounts(res.data);
    } catch (err) {
      console.error("Error fetching question counts:", err);
    }
  };

  const fetchTopics = async (categoryId) => {
    if (!categoryId) return;
    setLoadingTopics(true);
    try {
      const res = await axios.get(`${TOPIC_API}/category/${categoryId}`);
      setTopics(res.data);
    } catch (err) {
      console.error("Error loading topics:", err);
      setTopics([]);
    } finally {
      setLoadingTopics(false);
    }
  };

  const fetchSubtopics = async (topicId) => {
    if (!topicId) return;
    setLoadingSubtopics(true);
    try {
      const res = await axios.get(`${SUBTOPIC_API}/topic/${topicId}`);
      setSubtopics(res.data);
    } catch (err) {
      console.error("Error loading subtopics:", err);
      setSubtopics([]);
    } finally {
      setLoadingSubtopics(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      setFormData({ ...formData, categoryId: value, topicId: "", subTopicId: "" });
      setTopics([]);
      setSubtopics([]);
      if (value) await fetchTopics(value);
    } else if (name === "topicId") {
      setFormData({ ...formData, topicId: value, subTopicId: "" });
      setSubtopics([]);
      if (value) await fetchSubtopics(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: false });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = true;
    if (!formData.id) {
      if (!formData.categoryId) newErrors.categoryId = true;
      if (!formData.topicId) newErrors.topicId = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- ADD / UPDATE ---
  const handleAddOrUpdate = async () => {
    if (!validateForm()) return;

    const payload = {
      title: formData.title,
      difficulty: formData.difficulty,
      categoryId: parseInt(formData.categoryId),
      topicId: parseInt(formData.topicId),
      subTopicId: formData.subTopicId ? parseInt(formData.subTopicId) : null,
      createdByUserId: user?.userId,
    };

    try {
      if (formData.id) {
        await axios.put(`${API_BASE}/${formData.id}`, payload);
        alert("✅ Question updated successfully!");
      } else {
        await axios.post(API_BASE, payload);
        alert("✅ Question added successfully!");
      }
      handleReset();
      fetchQuestions();
      fetchCounts();
    } catch (err) {
      console.error("Error saving question:", err);
      alert("Failed to save question!");
    }
  };

  const handleEdit = async (q) => {
    setFormData({
      id: q.id,
      title: q.title,
      difficulty: q.difficulty,
      categoryId: q.categoryId,
      topicId: q.topicId,
      subTopicId: q.subTopicId || "",
    });
    await Promise.all([fetchTopics(q.categoryId), fetchSubtopics(q.topicId)]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      alert("🗑 Question deleted!");
      fetchQuestions();
      fetchCounts();
    } catch {
      alert("Failed to delete question!");
    }
  };

  const handleReset = () => {
    setFormData({
      id: null,
      title: "",
      difficulty: "Medium",
      categoryId: "",
      topicId: "",
      subTopicId: "",
    });
    setTopics([]);
    setSubtopics([]);
    setErrors({});
  };

  const filtered = questions.filter((q) => {
    const searchText = search.toLowerCase();
    return (
      q.title?.toLowerCase().includes(searchText) ||
      q.categoryName?.toLowerCase().includes(searchText) ||
      q.topicName?.toLowerCase().includes(searchText) ||
      q.difficulty?.toLowerCase().includes(searchText) ||
      q.createdBy?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="container my-4">
      <h4 className="mb-4 text-primary fw-bold">Question Bank</h4>

      {/* --- Category Summary Cards --- */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary shadow-sm">
            <div className="card-body text-center">
              <h6>Total Questions</h6>
              <h3 className="fw-bold">{questionCounts.totalQuestions}</h3>
            </div>
          </div>
        </div>

        {Object.entries(questionCounts.categoryWiseCount || {}).map(
          ([category, count]) => (
            <div className="col-md-3 mb-3" key={category}>
              <div className="card bg-light shadow-sm border-0">
                <div className="card-body text-center">
                  <h6 className="text-secondary">{category}</h6>
                  <h4 className="fw-bold text-dark">{count}</h4>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* --- Form Section --- */}
      <div className="card p-3 shadow-sm mb-4">
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="form-select"
              disabled={!!formData.id}
              style={{ borderColor: errors.categoryId ? "red" : "" }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

           <div className="col-md-6">
            <label>Difficulty *</label>
            <div className="d-flex gap-3">
              {["Easy", "Medium", "Hard"].map((lvl) => (
                <div key={lvl} className="form-check">
                  <input
                    type="radio"
                    name="difficulty"
                    value={lvl}
                    checked={formData.difficulty === lvl}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">{lvl}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-12 my-3">
            <label>Topic *</label>
            <select
              name="topicId"
              value={formData.topicId}
              onChange={handleChange}
              className="form-select"
              disabled={!formData.categoryId || !!formData.id || loadingTopics}
              style={{ borderColor: errors.topicId ? "red" : "" }}
            >
              <option value="">
                {loadingTopics ? "Loading topics..." : "Select Topic"}
              </option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-12 ">
            <label>Subtopic (optional)</label>
            <select
              name="subTopicId"
              value={formData.subTopicId}
              onChange={handleChange}
              className="form-select"
              disabled={!formData.topicId || loadingSubtopics}
            >
              <option value="">
                {loadingSubtopics ? "Loading subtopics..." : "Select Subtopic"}
              </option>
              {subtopics.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

         <div className="row mb-3">          

          <div className="col-md-12">
            <label>Enter the Question *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              style={{ borderColor: errors.title ? "red" : "" }}
            />
          </div>
        </div>

        <div>
          <button className="btn btn-primary me-2" onClick={handleAddOrUpdate}>
            {formData.id ? "Update Question" : "Add Question"}
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* --- List Section --- */}
      <div className="card shadow-sm p-3">
        <div className="d-flex justify-content-between mb-3 align-items-center">
          <h5>Question List</h5>
          <div className="input-group w-50">
            <span className="input-group-text">
              <FiSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, topic, category, difficulty, or creator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted">No questions found.</p>
        ) : (
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Topic</th>
                <th>Difficulty</th>
                <th>Created By</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id}>
                  <td>{q.title}</td>
                  <td>{q.categoryName}</td>
                  <td>{q.topicName}</td>
                  <td>{q.difficulty}</td>
                  <td>{q.createdBy || "Unknown"}</td>
                  <td>{q.createdDate || "-"}</td>
                  <td>
                    <button
                      className="btn btn-link text-primary p-0 me-2"
                      onClick={() => handleEdit(q)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="btn btn-link text-danger p-0"
                      onClick={() => handleDelete(q.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;

