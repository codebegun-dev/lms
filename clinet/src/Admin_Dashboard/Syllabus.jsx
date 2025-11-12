import React, { useEffect, useState, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaGripVertical, FaEllipsisV } from "react-icons/fa";

// Small helper to generate unique ids
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function Syllabus() {
  const [showForm, setShowForm] = useState(false);
  const [sections, setSections] = useState([]); // { id, name }
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const containerRef = useRef(null);
  const [parentForAdd, setParentForAdd] = useState(null); // parent id when adding syllabus (child)
  const [editingChildId, setEditingChildId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [draggingId, setDraggingId] = useState(null); // stores typed id like 'p:<id>' or 'c:<parentId>:<childId>'
  const [dragOverId, setDragOverId] = useState(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("syllabus_sections");
      if (raw) setSections(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem("syllabus_sections", JSON.stringify(sections));
  }, [sections]);

  const openAdd = () => {
    setEditingId(null);
    setInputValue("");
    setError("");
    setShowForm(true);
  };

  const openAddChild = (parentId) => {
    setParentForAdd(parentId);
    setEditingChildId(null);
    setInputValue("");
    setError("");
    setShowForm(true);
    setMenuOpenId(null);
  };

  const handleSave = () => {
    const name = inputValue.trim();
    if (!name) {
      setError("Name is required");
      return;
    }

    if (parentForAdd) {
      // adding or editing a child (syllabus)
      setSections((prev) => prev.map((p) => {
        if (p.id !== parentForAdd) return p;
        const children = Array.isArray(p.children) ? [...p.children] : [];
        if (editingChildId) {
          return { ...p, children: children.map(c => c.id === editingChildId ? { ...c, name } : c) };
        }
        const child = { id: uid(), name };
        return { ...p, children: [...children, child] };
      }));
    } else if (editingChildId) {
      // fallback (shouldn't normally happen)
      setSections((prev) => prev.map((p) => ({ ...p, children: (p.children || []).map(c => c.id === editingChildId ? { ...c, name } : c) })));
    } else if (editingId) {
      setSections((prev) => prev.map((s) => (s.id === editingId ? { ...s, name } : s)));
    } else {
      const newSection = { id: uid(), name, children: [] };
      setSections((prev) => [newSection, ...prev]);
    }

  // ensure parent expands to show newly added child
  if (parentForAdd) setExpandedIds(prev => new Set(prev).add(parentForAdd));

  setInputValue("");
    setEditingId(null);
    setShowForm(false);
    setParentForAdd(null);
    setEditingChildId(null);
  };

  const handleEdit = (id) => {
    const s = sections.find((x) => x.id === id);
    if (!s) return;
    setEditingId(id);
    setInputValue(s.name);
    setError("");
    setShowForm(true);
  };

  const handleEditChild = (parentId, childId) => {
    const p = sections.find((x) => x.id === parentId);
    if (!p) return;
    const c = (p.children || []).find((x) => x.id === childId);
    if (!c) return;
    setParentForAdd(parentId);
    setEditingChildId(childId);
    setInputValue(c.name);
    setError("");
    setShowForm(true);
    setMenuOpenId(null);
  };

  const handleDeleteChild = (parentId, childId) => {
    if (!window.confirm("Delete this syllabus item?")) return;
    setSections((prev) => {
      const next = prev.map((p) => p.id === parentId ? { ...p, children: (p.children || []).filter(c => c.id !== childId) } : p);
      const parent = next.find(p => p.id === parentId);
      if (!parent || !parent.children || parent.children.length === 0) {
        setExpandedIds((prevSet) => {
          const copy = new Set(prevSet);
          copy.delete(parentId);
          return copy;
        });
      }
      return next;
    });
    setMenuOpenId(null);
    console.debug(`Deleted child ${childId} from parent ${parentId}`);
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id); else copy.add(id);
      return copy;
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this section?")) return;
    setSections((prev) => {
      const next = prev.filter((s) => s.id !== id);
      return next;
    });
    setMenuOpenId(null);
    setExpandedIds((prevSet) => {
      const copy = new Set(prevSet);
      copy.delete(id);
      return copy;
    });
    if (editingId === id) {
      setEditingId(null);
      setShowForm(false);
      setInputValue("");
    }
    console.debug(`Deleted parent section ${id}`);
  };

  // Move clicked section to top (user said they will move to top of outside box)
  const moveToTop = (id) => {
    setSections((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx <= 0) return prev;
      const item = prev[idx];
      const copy = [...prev];
      copy.splice(idx, 1);
      copy.unshift(item);
      return copy;
    });
  };

  // Drag handlers for native drag-and-drop (typed ids)
  const handleDragStart = (e, typedId) => {
    setDraggingId(typedId);
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", typedId); } catch (err) { /* IE fallback */ }
  };

  const handleDragOver = (e, typedId) => {
    e.preventDefault();
    setDragOverId(typedId);
  };

  const handleDrop = (e, typedTargetId) => {
    e.preventDefault();
    const fromTyped = draggingId || e.dataTransfer.getData("text/plain");
    const toTyped = typedTargetId;
    if (!fromTyped) return;
    if (fromTyped === toTyped) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    // parse typed ids
    const parse = (t) => t.split(":");
    const fromParts = parse(fromTyped);
    const toParts = parse(toTyped);

    // Parent reordering: fromParts[0] === 'p'
    if (fromParts[0] === 'p' && toParts[0] === 'p') {
      const fromId = fromParts[1];
      const toId = toParts[1];
      setSections((prev) => {
        const copy = [...prev];
        const fromIndex = copy.findIndex((s) => s.id === fromId);
        const toIndex = copy.findIndex((s) => s.id === toId);
        if (fromIndex === -1 || toIndex === -1) return prev;
        const [moved] = copy.splice(fromIndex, 1);
        copy.splice(toIndex, 0, moved);
        return copy;
      });
    }

    // Child moved to child position
    if (fromParts[0] === 'c' && toParts[0] === 'c') {
      const fromParent = fromParts[1];
      const fromChild = fromParts[2];
      const toParent = toParts[1];
      const toChild = toParts[2];

      setSections((prev) => {
        const copy = prev.map(p => ({ ...p, children: p.children ? [...p.children] : [] }));
        const fp = copy.find(p => p.id === fromParent);
        const tp = copy.find(p => p.id === toParent);
        if (!fp || !tp) return prev;
        const fromIndex = fp.children.findIndex(c => c.id === fromChild);
        const toIndex = tp.children.findIndex(c => c.id === toChild);
        if (fromIndex === -1 || toIndex === -1) return prev;
        const [moved] = fp.children.splice(fromIndex, 1);
        // if same parent and removal shifted index, adjust
        if (fp.id === tp.id && fromIndex < toIndex) {
          tp.children.splice(toIndex, 0, moved);
        } else {
          tp.children.splice(toIndex, 0, moved);
        }
        return copy;
      });
    }

    // Child -> Parent (append child to target parent's children)
    if (fromParts[0] === 'c' && toParts[0] === 'p') {
      const fromParent = fromParts[1];
      const fromChild = fromParts[2];
      const toParent = toParts[1];
      setSections((prev) => {
        const copy = prev.map(p => ({ ...p, children: p.children ? [...p.children] : [] }));
        const fp = copy.find(p => p.id === fromParent);
        const tp = copy.find(p => p.id === toParent);
        if (!fp || !tp) return prev;
        const fromIndex = fp.children.findIndex(c => c.id === fromChild);
        if (fromIndex === -1) return prev;
        const [moved] = fp.children.splice(fromIndex, 1);
        tp.children.push(moved);
        return copy;
      });
    }

    // Parent -> Child: ignore (not supported)

    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  // Close menu on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">

      <div style={{ width: "420px" }} ref={containerRef}>
        <div className="mt-4 mb-5">
          <h6>All Sections</h6>
          {sections.length === 0 && <div className="text-muted">No sections yet. Click + to add one.</div>}
          <ul className="list-group mt-2">
            {sections.map((s) => (
              <React.Fragment key={s.id}>
              <li
                className={`list-group-item d-flex justify-content-between align-items-center mb-2 position-relative ${dragOverId === `p:${s.id}` ? 'bg-light' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, `p:${s.id}`)}
                onDragOver={(e) => handleDragOver(e, `p:${s.id}`)}
                onDrop={(e) => handleDrop(e, `p:${s.id}`)}
                onDragEnd={handleDragEnd}
              >
                <div className="d-flex align-items-center gap-3">
                  <FaGripVertical className="text-muted" />
                  <span>{s.name}</span>
                </div>

                {/* Ellipsis menu button */}
                <div>
                  <button
                    className="btn btn-sm btn-light border rounded-circle"
                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === `p:${s.id}` ? null : `p:${s.id}`); }}
                    aria-haspopup="true"
                    aria-expanded={menuOpenId === `p:${s.id}`}
                  >
                    <FaEllipsisV />
                  </button>

                  {menuOpenId === `p:${s.id}` && (
                    <div className="card position-absolute" style={{ right: 0, top: "120%", zIndex: 50, minWidth: 160 }}>
                      <div className="card-body p-2">
                        <button className="btn btn-sm btn-outline-info w-100 mb-2" onClick={() => { toggleExpand(s.id); setMenuOpenId(null); }}>{expandedIds.has(s.id) ? 'Hide Syllabus' : 'Syllabus'}</button>
                        <button className="btn btn-sm btn-outline-primary w-100 mb-2" onClick={() => { openAddChild(s.id); setMenuOpenId(null); }}>Add Syllabus</button>
                        <button className="btn btn-sm btn-outline-secondary w-100 mb-2" onClick={() => { handleEdit(s.id); setMenuOpenId(null); }}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger w-100" onClick={() => { handleDelete(s.id); setMenuOpenId(null); }}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
              {expandedIds.has(s.id) && (s.children || []).map(c => (
                <li
                  key={c.id}
                  className={`list-group-item ps-5 d-flex justify-content-between align-items-center mb-2 position-relative ${dragOverId === `c:${s.id}:${c.id}` ? 'bg-light' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, `c:${s.id}:${c.id}`)}
                  onDragOver={(e) => handleDragOver(e, `c:${s.id}:${c.id}`)}
                  onDrop={(e) => handleDrop(e, `c:${s.id}:${c.id}`)}
                  onDragEnd={handleDragEnd}
                >
                  <div>{c.name}</div>
                  <div>
                    <button
                      className="btn btn-sm btn-light border rounded-circle"
                      onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === `c:${s.id}:${c.id}` ? null : `c:${s.id}:${c.id}`); }}
                      aria-haspopup="true"
                      aria-expanded={menuOpenId === `c:${s.id}:${c.id}`}
                    >
                      <FaEllipsisV />
                    </button>

                    {menuOpenId === `c:${s.id}:${c.id}` && (
                      <div className="card position-absolute" style={{ right: 0, top: "110%", zIndex: 50, minWidth: 140 }}>
                        <div className="card-body p-2">
                          <button className="btn btn-sm btn-outline-secondary w-100 mb-2" onClick={() => { handleEditChild(s.id, c.id); setMenuOpenId(null); }}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger w-100" onClick={() => { handleDeleteChild(s.id, c.id); setMenuOpenId(null); }}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>

      {/* Outer box (empty inside) */}
      <div
        className="position-relative bg-white border rounded shadow-sm d-flex align-items-center justify-content-center"
        style={{ width: "420px", height: "280px" }}
      >
        {/* Plus box in the center */}
        <div
          onClick={openAdd}
          role="button"
          className="d-flex flex-column align-items-center justify-content-center border rounded-circle"
          style={{ width: "120px", height: "120px", fontSize: "36px", cursor: "pointer" }}
        >
          <FaPlus size={28} />
          <div className="small text-muted mt-2">Add</div>
        </div>
      </div>

      {/* Form shown below the box */}
      {showForm && (
        <div className="card p-3 mt-4 shadow" style={{ width: "420px" }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">
              {parentForAdd ? (editingChildId ? "Edit Syllabus Item" : "Add Syllabus Item") : (editingId ? "Edit Section" : "Add Section")}
            </h6>
            <div className="text-muted small">You can click a label to move it to top</div>
          </div>

          <label className="form-label mt-2">Name</label>
          <input
            type="text"
            className="form-control mb-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter section name"
          />
          {error && <div className="text-danger small mb-2">{error}</div>}

          <div className="d-flex gap-2">
            <button className="btn btn-primary flex-grow-1" onClick={handleSave}>
              {parentForAdd ? (editingChildId ? "Update" : "Create") : (editingId ? "Update" : "Create")}
            </button>
            <button className="btn btn-outline-secondary" onClick={() => { setShowForm(false); setEditingId(null); setInputValue(""); setError(""); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

       
    </div>
  );
}

export default Syllabus;
