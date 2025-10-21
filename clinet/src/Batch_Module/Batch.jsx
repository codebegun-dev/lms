// // src/components/Batch.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// /**
//  * Batch Manager Component
//  *
//  * - Uses Bootstrap for structure and Tailwind for additional styles.
//  * - CRUD with Axios placeholders:
//  *   GET    /api/batches
//  *   POST   /api/batches
//  *   PUT    /api/batches/:id
//  *   DELETE /api/batches/:id
//  *
//  * Note: Adjust axios.defaults.baseURL if needed (e.g. axios.defaults.baseURL = "http://localhost:4000")
//  */

// // Example course -> subjects mapping
// const COURSE_SUBJECTS = {
//   "Java Fullstack": [
//     "Core Java",
//     "OOPs",
//     "Collections",
//     "Spring Boot",
//     "Hibernate",
//     "MySQL",
//     "REST API",
//     "React",
//   ],
//   "Python Fullstack": [
//     "Python Basics",
//     "Flask/Django",
//     "Pandas",
//     "NumPy",
//     "MySQL/Postgres",
//     "React",
//     "REST API",
//   ],
//   "Data Science": ["Python", "Statistics", "Pandas", "Sklearn", "ML Models", "SQL"],
//   "Data Analytics": ["Excel", "SQL", "PowerBI", "Python", "Statistics"],
//   "Frontend (HTML/CSS/JS)": ["HTML", "CSS", "JavaScript", "React"],
// };

// const DEFAULT_BATCH_SIZE = 23;
// const SINGLE_INSTALLMENT_AMOUNT = 45000; // ₹45,000 (adjust if you meant 45k or 45)
// const TWO_INSTALLMENTS_AMOUNT = 50000; // ₹50,000
// const CTC_PERCENT = 13; // automatically shown/applied as text clause

// const emptyForm = {
//   name: "",
//   startDate: "",
//   startTime: "",
//   endTime: "",
//   course: "Java Fullstack",
//   subjects: [],
//   feeType: "single", // 'single' or 'two'
//   batchSize: DEFAULT_BATCH_SIZE,
// };

// const Batch = () => {
//   const [form, setForm] = useState({ ...emptyForm });
//   const [batches, setBatches] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   // ensure axios baseURL can be set by developer if needed
//   // axios.defaults.baseURL = "http://localhost:4000";

//   useEffect(() => {
//     fetchBatches();
//     // Preselect subjects for default course if you want pre-filled suggestions
//     setForm((f) => ({ ...f, subjects: COURSE_SUBJECTS[f.course].slice(0, 3) }));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Fetch all batches
//   const fetchBatches = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get("/api/batches");
//       // expecting res.data to be array of batch objects
//       setBatches(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Could not load batches. Check API endpoint /api/batches");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Validate basic fields
//   const validate = () => {
//     if (!form.name.trim()) return "Batch name is required.";
//     if (!form.startDate) return "Start date is required.";
//     if (!form.startTime || !form.endTime) return "Both start and end times are required.";
//     if (new Date(`1970-01-01T${form.startTime}`) >= new Date(`1970-01-01T${form.endTime}`))
//       return "End time must be after start time.";
//     if (!form.course) return "Course selection is required.";
//     if (!form.subjects || form.subjects.length === 0) return "Select at least one subject.";
//     if (!form.batchSize || form.batchSize <= 0) return "Batch size must be a positive number.";
//     return null;
//   };

//   // Create or Update
//   const handleSave = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMsg("");
//     const validation = validate();
//     if (validation) {
//       setError(validation);
//       return;
//     }

//     const payload = {
//       name: form.name.trim(),
//       startDate: form.startDate,
//       timings: `${form.startTime} - ${form.endTime}`,
//       course: form.course,
//       subjects: form.subjects,
//       fee: form.feeType === "single" ? SINGLE_INSTALLMENT_AMOUNT : TWO_INSTALLMENTS_AMOUNT,
//       feeType: form.feeType,
//       ctcPercent: CTC_PERCENT,
//       batchSize: Number(form.batchSize),
//       updatedAt: new Date().toISOString(),
//     };

//     setSaving(true);
//     try {
//       if (editingId) {
//         // Update
//         const res = await axios.put(`/api/batches/${editingId}`, payload);
//         // optimistically update UI
//         setBatches((prev) =>
//           prev.map((b) => (String(b.id || b._id) === String(editingId) ? { ...b, ...res.data } : b))
//         );
//         setSuccessMsg("Batch updated successfully.");
//       } else {
//         // Create
//         const res = await axios.post("/api/batches", payload);
//         // add returned batch to list (or fallback to payload + generated id)
//         const created = res.data && (res.data.id || res.data._id) ? res.data : { ...payload, id: res.data?.id || Date.now() };
//         setBatches((prev) => [created, ...prev]);
//         setSuccessMsg("Batch created successfully.");
//       }
//       resetForm();
//     } catch (err) {
//       console.error("Save error:", err);
//       setError("Could not save batch. Check API endpoint and payload.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Delete
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this batch? This action cannot be undone.")) return;
//     try {
//       await axios.delete(`/api/batches/${id}`);
//       setBatches((prev) => prev.filter((b) => String(b.id || b._id) !== String(id)));
//       setSuccessMsg("Batch deleted.");
//     } catch (err) {
//       console.error("Delete error:", err);
//       setError("Could not delete. Check API endpoint /api/batches/:id");
//     }
//   };

//   const handleEdit = (batch) => {
//     // batch might have timings as "HH:MM - HH:MM"
//     const [startTime = "", endTime = ""] = (batch.timings || "").split(" - ").map((s) => s.trim());
//     setForm({
//       name: batch.name || "",
//       startDate: batch.startDate || "",
//       startTime: startTime || "",
//       endTime: endTime || "",
//       course: batch.course || "Java Fullstack",
//       subjects: Array.isArray(batch.subjects) ? batch.subjects : [],
//       feeType: batch.feeType || (batch.fee === TWO_INSTALLMENTS_AMOUNT ? "two" : "single"),
//       batchSize: batch.batchSize || DEFAULT_BATCH_SIZE,
//     });
//     setEditingId(batch.id || batch._id);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const resetForm = () => {
//     setForm({ ...emptyForm, course: "Java Fullstack", subjects: COURSE_SUBJECTS["Java Fullstack"].slice(0, 3) });
//     setEditingId(null);
//     setError("");
//   };

//   // Course change updates available subjects (but keep already selected subjects that still exist)
//   const handleCourseChange = (course) => {
//     const all = COURSE_SUBJECTS[course] || [];
//     setForm((f) => ({
//       ...f,
//       course,
//       subjects: all.slice(0, Math.min(3, all.length)), // preselect first 2-3 for convenience
//     }));
//   };

//   // Toggle subject selection
//   const toggleSubject = (subject) => {
//     setForm((f) => {
//       const subs = new Set(f.subjects || []);
//       if (subs.has(subject)) subs.delete(subject);
//       else subs.add(subject);
//       return { ...f, subjects: Array.from(subs) };
//     });
//   };

//   // Render helpers
//   const formatCurrency = (val) =>
//     typeof val === "number" ? val.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }) : val;

//   return (
//     <div className="container my-6">
//       <div className="row">
//         <div className="col-12">
//           <div className="p-5 rounded-2xl shadow-lg bg-white dark:bg-slate-800">
//             <h2 className="text-2xl font-semibold mb-3">Batch Management</h2>

//             {/* Success / Error */}
//             {error && (
//               <div className="alert alert-danger py-2" role="alert">
//                 {error}
//               </div>
//             )}
//             {successMsg && (
//               <div className="alert alert-success py-2" role="alert">
//                 {successMsg}
//                 <button
//                   type="button"
//                   className="btn-close float-end"
//                   aria-label="Close"
//                   onClick={() => setSuccessMsg("")}
//                 />
//               </div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSave} className="mb-4">
//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <label className="form-label">Batch Name</label>
//                   <input
//                     type="text"
//                     className="form-control rounded-md shadow-sm"
//                     placeholder="e.g. Jan 2026 - Java Fullstack Morning"
//                     value={form.name}
//                     onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <label className="form-label">Start Date</label>
//                   <input
//                     type="date"
//                     className="form-control rounded-md"
//                     value={form.startDate}
//                     onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <label className="form-label">Batch Size</label>
//                   <input
//                     type="number"
//                     min="1"
//                     className="form-control rounded-md"
//                     value={form.batchSize}
//                     onChange={(e) => setForm((f) => ({ ...f, batchSize: e.target.value }))}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <label className="form-label">Start Time</label>
//                   <input
//                     type="time"
//                     className="form-control rounded-md"
//                     value={form.startTime}
//                     onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <label className="form-label">End Time</label>
//                   <input
//                     type="time"
//                     className="form-control rounded-md"
//                     value={form.endTime}
//                     onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <label className="form-label">Course</label>
//                   <select
//                     className="form-select rounded-md"
//                     value={form.course}
//                     onChange={(e) => handleCourseChange(e.target.value)}
//                   >
//                     {Object.keys(COURSE_SUBJECTS).map((c) => (
//                       <option key={c} value={c}>
//                         {c}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="col-12">
//                   <label className="form-label">Subjects (select multiple)</label>
//                   <div className="flex flex-wrap gap-2">
//                     {(COURSE_SUBJECTS[form.course] || []).map((s) => {
//                       const selected = form.subjects.includes(s);
//                       return (
//                         <button
//                           type="button"
//                           key={s}
//                           onClick={() => toggleSubject(s)}
//                           className={`btn btn-sm ${selected ? "btn-primary" : "btn-outline-secondary"} rounded-pill shadow-sm`}
//                         >
//                           {s}
//                         </button>
//                       );
//                     })}
//                   </div>
//                   <small className="text-muted d-block mt-2">
//                     Selected: {form.subjects.length > 0 ? form.subjects.join(", ") : "— none —"}
//                   </small>
//                 </div>

//                 <div className="col-md-6">
//                   <label className="form-label d-block">Fee Structure</label>
//                   <div className="form-check form-check-inline me-3">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="feeType"
//                       id="feeSingle"
//                       value="single"
//                       checked={form.feeType === "single"}
//                       onChange={(e) => setForm((f) => ({ ...f, feeType: e.target.value }))}
//                     />
//                     <label className="form-check-label" htmlFor="feeSingle">
//                       Single installment ({formatCurrency(SINGLE_INSTALLMENT_AMOUNT)})
//                     </label>
//                   </div>

//                   <div className="form-check form-check-inline">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="feeType"
//                       id="feeTwo"
//                       value="two"
//                       checked={form.feeType === "two"}
//                       onChange={(e) => setForm((f) => ({ ...f, feeType: e.target.value }))}
//                     />
//                     <label className="form-check-label" htmlFor="feeTwo">
//                       Two installments ({formatCurrency(TWO_INSTALLMENTS_AMOUNT)})
//                     </label>
//                   </div>

//                   <div className="mt-2">
//                     <small className="text-muted">
//                       CTC Clause: <strong>{CTC_PERCENT}%</strong> of package after placement.
//                     </small>
//                   </div>
//                 </div>

//                 <div className="col-12 d-flex gap-2 mt-3">
//                   <button
//                     type="submit"
//                     className="btn btn-primary rounded-md px-4"
//                     disabled={saving}
//                   >
//                     {saving ? (editingId ? "Updating..." : "Saving...") : editingId ? "Update Batch" : "Create Batch"}
//                   </button>

//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary rounded-md"
//                     onClick={resetForm}
//                     disabled={saving}
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             </form>

//             {/* Batches table */}
//             <div className="mt-5">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h3 className="h5">All Batches</h3>
//                 <div>
//                   <button
//                     className="btn btn-sm btn-outline-primary me-2"
//                     onClick={fetchBatches}
//                     disabled={loading}
//                   >
//                     {loading ? "Refreshing..." : "Refresh"}
//                   </button>
//                 </div>
//               </div>

//               <div className="table-responsive shadow-sm rounded">
//                 <table className="table table-striped table-hover mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>Name</th>
//                       <th>Start Date</th>
//                       <th>Timings</th>
//                       <th>Course</th>
//                       <th>Subjects</th>
//                       <th>Fee</th>
//                       <th>Batch Size</th>
//                       <th className="text-end">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {batches.length === 0 ? (
//                       <tr>
//                         <td colSpan="8" className="text-center text-muted py-4">
//                           {loading ? "Loading batches..." : "No batches found."}
//                         </td>
//                       </tr>
//                     ) : (
//                       batches.map((b) => {
//                         const id = b.id || b._id || b._Id || JSON.stringify(b).slice(0, 8);
//                         return (
//                           <tr key={id}>
//                             <td>{b.name}</td>
//                             <td>{b.startDate}</td>
//                             <td>{b.timings}</td>
//                             <td>{b.course}</td>
//                             <td>
//                               {(Array.isArray(b.subjects) ? b.subjects : []).slice(0, 4).join(", ")}
//                               {Array.isArray(b.subjects) && b.subjects.length > 4 ? "..." : ""}
//                             </td>
//                             <td>
//                               {formatCurrency(b.fee ?? (b.feeType === "two" ? TWO_INSTALLMENTS_AMOUNT : SINGLE_INSTALLMENT_AMOUNT))}
//                               <div className="text-muted small">({b.feeType === "two" ? "Two installments" : "Single"})</div>
//                             </td>
//                             <td>{b.batchSize}</td>
//                             <td className="text-end">
//                               <div className="d-flex justify-content-end gap-2">
//                                 <button
//                                   className="btn btn-sm btn-outline-secondary"
//                                   onClick={() => handleEdit(b)}
//                                 >
//                                   Edit
//                                 </button>
//                                 <button
//                                   className="btn btn-sm btn-danger"
//                                   onClick={() => handleDelete(id)}
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

             
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Batch;









// src/components/Batch.jsx
import React, { useEffect, useState } from "react";

/**
 * Batch.jsx
 * - LocalStorage-backed CRUD for batches (no backend)
 * - Uses Bootstrap for structure and Tailwind utility classes for extra polish
 * - IDs are UUID v4 (generated locally)
 *
 * Drop this file into src/components/Batch.jsx and import where needed.
 */

/* ----------------------------- Config / Constants ---------------------------- */
const STORAGE_KEY = "batches_v1";

const COURSE_SUBJECTS = {
  "Java Fullstack": [
    "Core Java",
    "OOPs",
    "Collections",
    "Spring Boot",
    "Hibernate",
    "MySQL",
    "REST API",
    "React",
  ],
  "Python Fullstack": [
    "Python Basics",
    "Flask/Django",
    "Pandas",
    "NumPy",
    "MySQL/Postgres",
    "React",
    "REST API",
  ],
  "Data Science": ["Python", "Statistics", "Pandas", "Sklearn", "ML Models", "SQL"],
  "Data Analytics": ["Excel", "SQL", "PowerBI", "Python", "Statistics"],
  "Frontend (HTML/CSS/JS)": ["HTML", "CSS", "JavaScript", "React"],
};

const DEFAULT_BATCH_SIZE = 23;
const SINGLE_INSTALLMENT_AMOUNT = 45000; // change if you meant 45 units instead of 45k
const TWO_INSTALLMENTS_AMOUNT = 50000;
const CTC_PERCENT = 13;

const emptyForm = {
  name: "",
  startDate: "",
  startTime: "",
  endTime: "",
  course: "Java Fullstack",
  subjects: [],
  feeType: "single",
  batchSize: DEFAULT_BATCH_SIZE,
};

/* ----------------------------- Utility Helpers ------------------------------ */
// Minimal UUIDv4 generator (no deps)
const uuidv4 = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const loadBatchesFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load batches from localStorage", e);
    return [];
  }
};

const saveBatchesToStorage = (arr) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.error("Failed to save batches to localStorage", e);
  }
};

const formatCurrency = (val) =>
  typeof val === "number" ? val.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }) : val;

/* -------------------------------- Component --------------------------------- */
const Batch = () => {
  const [form, setForm] = useState({ ...emptyForm });
  const [batches, setBatches] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initial = loadBatchesFromStorage();
    setBatches(initial);
    // preselect subjects for default course
    setForm((f) => ({ ...f, subjects: COURSE_SUBJECTS[f.course].slice(0, 3) }));
    setLoading(false);
  }, []);

  /* ------------------------------- Validation -------------------------------- */
  const validate = () => {
    if (!form.name.trim()) return "Batch name is required.";
    if (!form.startDate) return "Start date is required.";
    if (!form.startTime || !form.endTime) return "Both start and end times are required.";
    if (new Date(`1970-01-01T${form.startTime}`) >= new Date(`1970-01-01T${form.endTime}`))
      return "End time must be after start time.";
    if (!form.course) return "Course selection is required.";
    if (!form.subjects || form.subjects.length === 0) return "Select at least one subject.";
    if (!form.batchSize || Number(form.batchSize) <= 0) return "Batch size must be a positive number.";
    return null;
  };

  /* --------------------------------- Handlers -------------------------------- */
  const resetForm = () => {
    setForm({ ...emptyForm, course: "Java Fullstack", subjects: COURSE_SUBJECTS["Java Fullstack"].slice(0, 3) });
    setEditingId(null);
    setError("");
    setSuccessMsg("");
  };

  const handleCourseChange = (course) => {
    const all = COURSE_SUBJECTS[course] || [];
    setForm((f) => ({
      ...f,
      course,
      subjects: all.slice(0, Math.min(3, all.length)),
    }));
  };

  const toggleSubject = (subject) => {
    setForm((f) => {
      const set = new Set(f.subjects || []);
      if (set.has(subject)) set.delete(subject);
      else set.add(subject);
      return { ...f, subjects: Array.from(set) };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: editingId || uuidv4(),
        name: form.name.trim(),
        startDate: form.startDate,
        timings: `${form.startTime} - ${form.endTime}`,
        course: form.course,
        subjects: form.subjects,
        fee: form.feeType === "single" ? SINGLE_INSTALLMENT_AMOUNT : TWO_INSTALLMENTS_AMOUNT,
        feeType: form.feeType,
        ctcPercent: CTC_PERCENT,
        batchSize: Number(form.batchSize),
        updatedAt: new Date().toISOString(),
        createdAt: editingId ? undefined : new Date().toISOString(),
      };

      let updated;
      if (editingId) {
        // update existing
        updated = batches.map((b) => (b.id === editingId ? { ...b, ...payload } : b));
        setBatches(updated);
        saveBatchesToStorage(updated);
        setSuccessMsg("Batch updated successfully.");
      } else {
        // create new (prepend)
        updated = [payload, ...batches];
        setBatches(updated);
        saveBatchesToStorage(updated);
        setSuccessMsg("Batch created successfully.");
      }

      resetForm();
    } catch (err) {
      console.error("Save failed:", err);
      setError("Could not save batch (localStorage error).");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (batch) => {
    const [startTime = "", endTime = ""] = (batch.timings || "").split(" - ").map((s) => s.trim());
    setForm({
      name: batch.name || "",
      startDate: batch.startDate || "",
      startTime,
      endTime,
      course: batch.course || "Java Fullstack",
      subjects: Array.isArray(batch.subjects) ? batch.subjects : [],
      feeType: batch.feeType || (batch.fee === TWO_INSTALLMENTS_AMOUNT ? "two" : "single"),
      batchSize: batch.batchSize || DEFAULT_BATCH_SIZE,
    });
    setEditingId(batch.id);
    setError("");
    setSuccessMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this batch? This action cannot be undone.")) return;
    try {
      const updated = batches.filter((b) => b.id !== id);
      setBatches(updated);
      saveBatchesToStorage(updated);
      setSuccessMsg("Batch deleted.");
      // if we were editing this batch, reset form
      if (editingId === id) resetForm();
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Could not delete batch (localStorage error).");
    }
  };

  /* --------------------------------- Render ---------------------------------- */
  return (
    <div className="container my-6">
      <div className="row">
        <div className="col-12">
          <div className="p-5 rounded-2xl shadow-lg bg-white dark:bg-slate-800">
            <h2 className="text-2xl font-semibold mb-3">Batch Management</h2>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
                <button type="button" className="btn-close float-end" aria-label="Close" onClick={() => setError("")} />
              </div>
            )}
            {successMsg && (
              <div className="alert alert-success py-2" role="alert">
                {successMsg}
                <button type="button" className="btn-close float-end" aria-label="Close" onClick={() => setSuccessMsg("")} />
              </div>
            )}

            <form onSubmit={handleSave} className="mb-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Batch Name</label>
                  <input
                    type="text"
                    className="form-control rounded-md shadow-sm"
                    placeholder="e.g. Jan 2026 - Java Fullstack Morning"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control rounded-md"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Batch Size</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control rounded-md"
                    value={form.batchSize}
                    onChange={(e) => setForm((f) => ({ ...f, batchSize: e.target.value }))}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-control rounded-md"
                    value={form.startTime}
                    onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    className="form-control rounded-md"
                    value={form.endTime}
                    onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Course</label>
                  <select
                    className="form-select rounded-md"
                    value={form.course}
                    onChange={(e) => handleCourseChange(e.target.value)}
                  >
                    {Object.keys(COURSE_SUBJECTS).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Subjects (select multiple)</label>
                  <div className="flex flex-wrap gap-2">
                    {(COURSE_SUBJECTS[form.course] || []).map((s) => {
                      const selected = form.subjects.includes(s);
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => toggleSubject(s)}
                          className={`btn btn-sm ${selected ? "btn-primary" : "btn-outline-secondary"} rounded-pill shadow-sm`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <small className="text-muted d-block mt-2">
                    Selected: {form.subjects.length > 0 ? form.subjects.join(", ") : "— none —"}
                  </small>
                </div>

                <div className="col-md-6">
                  <label className="form-label d-block">Fee Structure</label>
                  <div className="form-check form-check-inline me-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="feeType"
                      id="feeSingle"
                      value="single"
                      checked={form.feeType === "single"}
                      onChange={(e) => setForm((f) => ({ ...f, feeType: e.target.value }))}
                    />
                    <label className="form-check-label" htmlFor="feeSingle">
                      Single installment ({formatCurrency(SINGLE_INSTALLMENT_AMOUNT)})
                    </label>
                  </div>

                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="feeType"
                      id="feeTwo"
                      value="two"
                      checked={form.feeType === "two"}
                      onChange={(e) => setForm((f) => ({ ...f, feeType: e.target.value }))}
                    />
                    <label className="form-check-label" htmlFor="feeTwo">
                      Two installments ({formatCurrency(TWO_INSTALLMENTS_AMOUNT)})
                    </label>
                  </div>

                  <div className="mt-2">
                    <small className="text-muted">
                      CTC Clause: <strong>{CTC_PERCENT}%</strong> of package after placement.
                    </small>
                  </div>
                </div>

                <div className="col-12 d-flex gap-2 mt-3">
                  <button type="submit" className="btn btn-primary rounded-md px-4" disabled={saving}>
                    {saving ? (editingId ? "Updating..." : "Saving...") : editingId ? "Update Batch" : "Create Batch"}
                  </button>

                  <button type="button" className="btn btn-outline-secondary rounded-md" onClick={resetForm} disabled={saving}>
                    Reset
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5">All Batches</h3>
                <div>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => {
                      setLoading(true);
                      const reloaded = loadBatchesFromStorage();
                      setBatches(reloaded);
                      setLoading(false);
                    }}
                    disabled={loading}
                  >
                    {loading ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>

              <div className="table-responsive shadow-sm rounded">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>Timings</th>
                      <th>Course</th>
                      <th>Subjects</th>
                      <th>Fee</th>
                      <th>Batch Size</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-muted py-4">
                          {loading ? "Loading batches..." : "No batches found."}
                        </td>
                      </tr>
                    ) : (
                      batches.map((b) => (
                        <tr key={b.id}>
                          <td>{b.name}</td>
                          <td>{b.startDate}</td>
                          <td>{b.timings}</td>
                          <td>{b.course}</td>
                          <td>{(Array.isArray(b.subjects) ? b.subjects : []).slice(0, 4).join(", ")}{Array.isArray(b.subjects) && b.subjects.length > 4 ? "..." : ""}</td>
                          <td>
                            {formatCurrency(b.fee ?? (b.feeType === "two" ? TWO_INSTALLMENTS_AMOUNT : SINGLE_INSTALLMENT_AMOUNT))}
                            <div className="text-muted small">({b.feeType === "two" ? "Two installments" : "Single"})</div>
                          </td>
                          <td>{b.batchSize}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(b)}>
                                Edit
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

             
          </div>
        </div>
      </div>
    </div>
  );
};

export default Batch;
