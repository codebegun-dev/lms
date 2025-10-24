import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { FiSearch } from "react-icons/fi";

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    category: "Technical",
    difficulty: "Medium",
    title: "",
    topic: "Java",
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 6;

  // Category -> Topics mapping
  const categoryTopics = {
    Technical: ["Java", "HTML", "CSS", "Bootstrap", "JavaScript", "React JS", "Springboot", "JDBC"],
    Communication: ["Verbal", "Non-verbal", "Listening", "Presentation", "Negotiation"],
    Behavioral: ["Adaptability", "Teamwork", "Problem Solving", "Time Management"],
   };

  useEffect(() => {
    const saved = localStorage.getItem("questions");
    if (saved) setQuestions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setFormData({
        ...formData,
        category: value,
        topic: categoryTopics[value][0], // auto-select first topic
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddOrUpdate = () => {
    if (!formData.title.trim() || !formData.topic.trim()) {
      alert("Please fill in all required fields!");
      return;
    }

    if (formData.id) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === formData.id ? { ...formData } : q))
      );
      alert("Question updated successfully!");
    } else {
      const newQ = {
        ...formData,
        id: Date.now(),
        createdBy: "Admin",
        createdDate: new Date().toISOString().split("T")[0],
      };
      setQuestions([...questions, newQ]);
      alert("Question added successfully!");
    }
    handleReset();
  };

  const handleEdit = (id) => {
    const selected = questions.find((q) => q.id === id);
    setFormData(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleReset = () => {
    setFormData({
      id: null,
      category: "Technical",
      difficulty: "Medium",
      title: "",
      topic: "Java",
    });
  };

  const filtered = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase()) ||
      q.difficulty.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / questionsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="container my-4">
      <h1 className="mb-4">Question Bank</h1>

      {/* Manage Questions */}
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Manage Questions</h5>
          <p className="text-muted">Add new questions or filter existing ones.</p>

          {/* Category + Difficulty in one row */}
          <div className="row mb-1">
            <div className="col-md-6 mb-1">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                {Object.keys(categoryTopics).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-1">
              <label className="form-label">Difficulty Level</label>
              <div className="d-flex gap-3 align-items-center">
                {["Easy", "Medium", "Hard"].map((lvl) => (
                  <div className="form-check" key={lvl}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="difficulty"
                      value={lvl}
                      checked={formData.difficulty === lvl}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">{lvl}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Topic */}
          <div className="mb-1">
            <label className="form-label">Topic</label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="form-select"
            >
              {categoryTopics[formData.category].map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Question Title */}
          <div className="mb-1">
            <label className="form-label">Question Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter question title..."
            />
          </div>

          {/* Search with icon */}
          <div className="mb-1">
            <label className="form-label">Search Questions</label>
            <div className="input-group">
              <span className="input-group-text">
                <FiSearch />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-control"
                placeholder="Search by title, topic, category..."
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={handleAddOrUpdate}>
              {formData.id ? "Update Question" : "Add Question"}
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset Form
            </button>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Question List</h5>
          <p className="text-muted">Browse and manage all questions.</p>

          {filtered.length === 0 ? (
            <p className="text-center py-3">No questions found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Question Title</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Topic</th>
                    <th>Created By</th>
                    <th>Created Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {current.map((q) => (
                    <tr key={q.id}>
                      <td>{q.title}</td>
                      <td>{q.category}</td>
                      <td>{q.difficulty}</td>
                      <td>{q.topic}</td>
                      <td>{q.createdBy}</td>
                      <td>{q.createdDate}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-link text-primary p-0 me-2"
                          onClick={() => handleEdit(q.id)}
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
            </div>
          )}

          {/* Pagination */}
          {filtered.length > questionsPerPage && (
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                &lt; Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${
                    currentPage === i + 1 ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
