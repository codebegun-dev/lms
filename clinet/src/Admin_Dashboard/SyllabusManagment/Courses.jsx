 import React, { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [tagCourseId, setTagCourseId] = useState(null);
  const [selectedTagForManagement, setSelectedTagForManagement] = useState("");
  const [isManageModal, setIsManageModal] = useState(false);

  const [courseTitle, setCourseTitle] = useState("");
  const [courseType, setCourseType] = useState("Recorded Course");

  const [batchCourses, setBatchCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [selectedCourseFromDropdown, setSelectedCourseFromDropdown] = useState("");

  const navigate = useNavigate();

  // Load courses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("createdCourses");
    if (saved) setCreatedCourses(JSON.parse(saved));
    fetchBatches();
  }, []);

  const saveCreatedCourses = (courses) => {
    localStorage.setItem("createdCourses", JSON.stringify(courses));
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/batches/all");
      const data = await res.json();
      setBatchCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCourse = () => {
    if (!courseTitle.trim()) return;
    const newCourse = {
      courseId: Date.now(),
      courseName: courseTitle,
      courseType,
      createdAt: new Date().toISOString(),
      tags: [],
    };
    const updated = [...createdCourses, newCourse];
    setCreatedCourses(updated);
    saveCreatedCourses(updated);
    setShowCreateModal(false);
    setCourseTitle("");
    setCourseType("Recorded Course");
    setSelectedCourseFromDropdown("");
  };

  const handleAddTag = (courseId) => {
    if (!tagInput.trim()) return;
    const updated = createdCourses.map((c) =>
      c.courseId === courseId
        ? { ...c, tags: c.tags ? [...c.tags, tagInput] : [tagInput] }
        : c
    );
    setCreatedCourses(updated);
    saveCreatedCourses(updated);
    setTagInput("");
    setShowTagModal(false);
    setIsManageModal(false);
  };

  const handleRemoveTag = () => {
    const updated = createdCourses.map((c) =>
      c.courseId === tagCourseId
        ? { ...c, tags: c.tags.filter((t) => t !== selectedTagForManagement) }
        : c
    );
    setCreatedCourses(updated);
    saveCreatedCourses(updated);
    setShowTagModal(false);
    setIsManageModal(false);
    setSelectedTagForManagement("");
  };

  const handleMakeTagPublic = () => {
    // Implement public tag functionality here
    alert(`Tag "${selectedTagForManagement}" is now public!`);
    setShowTagModal(false);
    setIsManageModal(false);
    setSelectedTagForManagement("");
  };

  const handleDeleteCourse = (courseId, courseName) => {
    if (window.confirm(`Are you sure you want to delete the course "${courseName}"?`)) {
      // Remove from createdCourses
      const updated = createdCourses.filter(course => course.courseId !== courseId);
      setCreatedCourses(updated);
      saveCreatedCourses(updated);
      
      // Also remove from localStorage syllabus data
      const syllabusKey = `syllabus_${courseName}`;
      localStorage.removeItem(syllabusKey);
      
      alert(`Course "${courseName}" has been deleted successfully.`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const displayCourses = createdCourses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTitle.toLowerCase()) &&
      (searchTag === "" || course.tags?.includes(searchTag))
  );

  return (
    <div className="container my-4">
      <h1 className="fw-bold mb-4">All Courses</h1>

      {/* Search */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by tag"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-3 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setSearchTitle("");
              setSearchTag("");
            }}
          >
            Clear results
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="row m-0 border-bottom">
            <div className="col-md-4 p-3">
              <strong>General information</strong>
            </div>
            <div className="col-md-2 p-3">
              <strong>Tags</strong>
            </div>
            <div className="col-md-2 p-3">
              <strong>Created at</strong>
            </div>
            <div className="col-md-4 p-3">
              <strong>Actions</strong>
            </div>
          </div>

          {/* Create Course Button */}
          <div className="row m-0 border-bottom">
            <div className="col-md-4 p-3">
              <div
                className="d-flex align-items-center text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setShowCreateModal(true)}
              >
                <CiCirclePlus size={20} className="me-2" />
                Create new course
              </div>
            </div>
          </div>

          {/* Course Rows */}
          {displayCourses.map((course) => (
            <div
              key={course.courseId}
              className="row m-0 border-bottom align-items-center"
            >
              <div className="col-md-4 p-3">
                <div className="fw-semibold">{course.courseName}</div>
                <div className="small text-muted">{course.courseType}</div>
              </div>

              <div className="col-md-2 p-3 d-flex flex-wrap gap-2 align-items-center">
                {course.tags?.map((tag) => (
                  <div
                    key={tag}
                    className="badge bg-light text-dark border position-relative d-flex align-items-center"
                    style={{ cursor: "pointer", padding: "4px 8px" }}
                    onMouseEnter={() => setActiveTag(course.courseId + tag)}
                    onMouseLeave={() => setActiveTag(null)}
                  >
                    {tag}
                    {activeTag === course.courseId + tag && (
                      <FiSettings
                        className="ms-1"
                        size={14}
                        onClick={() => {
                          setTagCourseId(course.courseId);
                          setSelectedTagForManagement(tag);
                          setIsManageModal(true);
                          setShowTagModal(true);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>
                ))}
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setTagCourseId(course.courseId);
                    setIsManageModal(false);
                    setShowTagModal(true);
                  }}
                >
                  Add tag
                </button>
              </div>

              <div className="col-md-2 p-3 text-muted">
                {formatDate(course.createdAt)}
              </div>

              <div className="col-md-4 p-3">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      navigate(`/admin-dashboard/syllabus/${encodeURIComponent(course.courseName)}`)
                    }
                  >
                    Open builder
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteCourse(course.courseId, course.courseName)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No Courses Message */}
      {displayCourses.length === 0 && createdCourses.length > 0 && (
        <div className="card mt-4">
          <div className="card-body text-center text-muted py-5">
            No courses match your search criteria.
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <div
          className="modal show d-block"
          style={{
            backdropFilter: "blur(4px)",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Create a new course</h5>
              </div>
              <div className="modal-body">
                <label className="form-label fw-semibold">Course title *</label>
                <select
                  className="form-select mb-3"
                  value={selectedCourseFromDropdown}
                  onChange={(e) => {
                    setSelectedCourseFromDropdown(e.target.value);
                    setCourseTitle(e.target.value);
                  }}
                >
                  <option value="">Choose existing Batches</option>
                  {batchCourses.map((b) => {
                    const title = `${b.name || "Batch"} - ${b.courseName || "Course"}`;
                    return (
                      <option key={b.id} value={title}>
                        {title}
                      </option>
                    );
                  })}
                </select>

                <label className="form-label fw-semibold">Course type *</label>
                <select
                  className="form-select mb-3"
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value)}
                >
                  <option value="Recorded Course">Recorded Course</option>
                  <option value="Cohort-Based Course (CBC)">
                    Cohort-Based Course (CBC)
                  </option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleCreateCourse}>
                  {selectedCourseFromDropdown ? "Select Course" : "Create Course"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div
          className="modal show d-block"
          style={{
            backdropFilter: "blur(4px)",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isManageModal ? `Tag: ${selectedTagForManagement}` : "Add Tag"}
                </h5>
              </div>
              <div className="modal-body">
                {isManageModal ? (
                  <>
                    <p className="text-muted mb-3">Choose what you'd like to do with this tag</p>
                    
                    {/* Remove Tag Button */}
                    <button
                      className="btn btn-outline-danger w-100 mb-3 text-start p-3 border"
                      onClick={handleRemoveTag}
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: '#dc3545',
                        color: '#dc3545'
                      }}
                    >
                      <strong>Remove tag from this product</strong>
                    </button>
                    
                    {/* Make Tag Public Section */}
                    <div className="border rounded p-3">
                      <div className="mb-2">
                        <strong>Make tag public</strong>
                      </div>
                      <div className="text-muted small mb-3">
                        <strong>Public tags:</strong> When a tag is made public, products will be segregated on the homepage based on their tag values, making it easier for users to discover content by category.
                      </div>
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleMakeTagPublic}
                      >
                        Make tag public
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-muted mb-3">Add a tag to this course</p>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Enter tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag(tagCourseId)}
                    />
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleAddTag(tagCourseId)}
                    >
                      Submit
                    </button>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowTagModal(false);
                    setActiveTag(null);
                    setTagInput("");
                    setSelectedTagForManagement("");
                    setIsManageModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;