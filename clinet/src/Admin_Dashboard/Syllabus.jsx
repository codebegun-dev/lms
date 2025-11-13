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
  const [parentForGrandChild, setParentForGrandChild] = useState(null); // { parentId, childId }
  const [editingGrandchildId, setEditingGrandchildId] = useState(null);
  const [parentForGreatChild, setParentForGreatChild] = useState(null); // { parentId, childId, grandId }
  const [editingGreatchildId, setEditingGreatchildId] = useState(null);
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

  const openAddGrandChild = (parentId, childId) => {
    setParentForGrandChild({ parentId, childId });
    setEditingGrandchildId(null);
    setParentForAdd(null);
    setEditingChildId(null);
    setInputValue("");
    setError("");
    setShowForm(true);
    setMenuOpenId(null);
  };

  const openEditGrandChild = (parentId, childId, grandchildId) => {
    const p = sections.find((x) => x.id === parentId);
    if (!p) return;
    const c = (p.children || []).find((x) => x.id === childId);
    if (!c) return;
    const g = (c.grandchildren || []).find((x) => x.id === grandchildId);
    if (!g) return;
    setParentForGrandChild({ parentId, childId });
    setEditingGrandchildId(grandchildId);
    setInputValue(g.name);
    setError("");
    setShowForm(true);
    setMenuOpenId(null);
  };

  const openAddGreatChild = (parentId, childId, grandchildId) => {
    setParentForGreatChild({ parentId, childId, grandchildId });
    setEditingGreatchildId(null);
    setParentForGrandChild(null);
    setEditingGrandchildId(null);
    setParentForAdd(null);
    setEditingChildId(null);
    setInputValue("");
    setError("");
    setShowForm(true);
    setMenuOpenId(null);
  };

  const openEditGreatChild = (parentId, childId, grandchildId, greatchildId) => {
    const p = sections.find((x) => x.id === parentId);
    if (!p) return;
    const c = (p.children || []).find((x) => x.id === childId);
    if (!c) return;
    const g = (c.grandchildren || []).find((x) => x.id === grandchildId);
    if (!g) return;
    const h = (g.greatchildren || []).find((x) => x.id === greatchildId);
    if (!h) return;
    setParentForGreatChild({ parentId, childId, grandchildId });
    setEditingGreatchildId(greatchildId);
    setInputValue(h.name);
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

    if (parentForGreatChild) {
      // adding or editing a great-grandchild (level 4)
      const { parentId, childId, grandchildId } = parentForGreatChild;
      setSections((prev) => prev.map((p) => {
        if (p.id !== parentId) return p;
        return {
          ...p,
          children: (p.children || []).map((c) => {
            if (c.id !== childId) return c;
            return {
              ...c,
              grandchildren: (c.grandchildren || []).map((g) => {
                if (g.id !== grandchildId) return g;
                const greatchildren = Array.isArray(g.greatchildren) ? [...g.greatchildren] : [];
                if (editingGreatchildId) {
                  return { ...g, greatchildren: greatchildren.map(h => h.id === editingGreatchildId ? { ...h, name } : h) };
                }
                const greatchild = { id: uid(), name };
                return { ...g, greatchildren: [...greatchildren, greatchild] };
              })
            };
          }),
        };
      }));
      // ensure grandchild is expanded to show newly added great-grandchild
      setExpandedIds(prev => new Set(prev).add(parentForGreatChild.grandchildId));
    } else if (parentForGrandChild) {
      // adding or editing a grandchild (level 3)
      const { parentId, childId } = parentForGrandChild;
      setSections((prev) => prev.map((p) => {
        if (p.id !== parentId) return p;
        return {
          ...p,
          children: (p.children || []).map((c) => {
            if (c.id !== childId) return c;
            const grandchildren = Array.isArray(c.grandchildren) ? [...c.grandchildren] : [];
            if (editingGrandchildId) {
              return { ...c, grandchildren: grandchildren.map(g => g.id === editingGrandchildId ? { ...g, name, greatchildren: g.greatchildren || [] } : g) };
            }
            const grandchild = { id: uid(), name, greatchildren: [] };
            return { ...c, grandchildren: [...grandchildren, grandchild] };
          }),
        };
      }));
      // ensure child is expanded to show newly added grandchild
      setExpandedIds(prev => new Set(prev).add(parentForGrandChild.childId));
    } else if (parentForAdd) {
      // adding or editing a child (syllabus)
      setSections((prev) => prev.map((p) => {
        if (p.id !== parentForAdd) return p;
        const children = Array.isArray(p.children) ? [...p.children] : [];
        if (editingChildId) {
          return { ...p, children: children.map(c => c.id === editingChildId ? { ...c, name } : c) };
        }
        const child = { id: uid(), name, grandchildren: [] };
        return { ...p, children: [...children, child] };
      }));
    } else if (editingId) {
      setSections((prev) => prev.map((s) => (s.id === editingId ? { ...s, name } : s)));
    } else {
      const newSection = { id: uid(), name, children: [] };
      setSections((prev) => [newSection, ...prev]);
    }

    setInputValue("");
    setEditingId(null);
    setShowForm(false);
    setParentForAdd(null);
    setEditingChildId(null);
    setParentForGrandChild(null);
    setEditingGrandchildId(null);
    setParentForGreatChild(null);
    setEditingGreatchildId(null);
  };

  // Form labels depending on current context (level)
  const getFormTitle = () => {
    if (parentForGreatChild) return editingGreatchildId ? 'Edit Concept' : 'Add Concept';
    if (parentForGrandChild) return editingGrandchildId ? 'Edit Subtopic' : 'Add Subtopic';
    if (parentForAdd) return editingChildId ? 'Edit Syllabus Item' : 'Add Syllabus Item';
    return editingId ? 'Edit Section' : 'Add Section';
  };

  const getActionText = () => {
    if (parentForGreatChild) return editingGreatchildId ? 'Update' : 'Create';
    if (parentForGrandChild) return editingGrandchildId ? 'Update' : 'Create';
    if (parentForAdd) return editingChildId ? 'Update' : 'Create';
    return editingId ? 'Update' : 'Create';
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

  const handleDeleteGrandChild = (parentId, childId, grandchildId) => {
    if (!window.confirm("Delete this item?")) return;
    setSections((prev) => {
      const next = prev.map((p) => {
        if (p.id !== parentId) return p;
        return {
          ...p,
          children: (p.children || []).map((c) => {
            if (c.id !== childId) return c;
            return { ...c, grandchildren: (c.grandchildren || []).filter(g => g.id !== grandchildId) };
          }),
        };
      });
      const parent = next.find(p => p.id === parentId);
      const child = parent && (parent.children || []).find(c => c.id === childId);
      if (!child || !child.grandchildren || child.grandchildren.length === 0) {
        setExpandedIds((prevSet) => {
          const copy = new Set(prevSet);
          copy.delete(childId);
          return copy;
        });
      }
      return next;
    });
    setMenuOpenId(null);
    console.debug(`Deleted grandchild ${grandchildId} from child ${childId} of parent ${parentId}`);
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

  // move-to-top helpers removed per UX change: 'Show/Hide' replaced Move-to-Top in menus

  const duplicateGreatChild = (parentId, childId, grandId, greatId) => {
    setSections(prev => prev.map(p => {
      if (p.id !== parentId) return p;
      return {
        ...p,
        children: (p.children || []).map(c => {
          if (c.id !== childId) return c;
          return {
            ...c,
            grandchildren: (c.grandchildren || []).map(g => {
              if (g.id !== grandId) return g;
              const greatchildren = [...(g.greatchildren || [])];
              const original = greatchildren.find(h => h.id === greatId);
              if (!original) return g;
              const copy = { id: uid(), name: original.name + ' (copy)' };
              return { ...g, greatchildren: [...greatchildren, copy] };
            })
          };
        })
      };
    }));
    setMenuOpenId(null);
  };

  const handleDeleteGreatChild = (parentId, childId, grandchildId, greatId) => {
    if (!window.confirm('Delete this item?')) return;
    setSections(prev => {
      const next = prev.map(p => {
        if (p.id !== parentId) return p;
        return {
          ...p,
          children: (p.children || []).map(c => {
            if (c.id !== childId) return c;
            return {
              ...c,
              grandchildren: (c.grandchildren || []).map(g => {
                if (g.id !== grandchildId) return g;
                return { ...g, greatchildren: (g.greatchildren || []).filter(h => h.id !== greatId) };
              })
            };
          })
        };
      });
      // collapse if none left
      const parent = next.find(p => p.id === parentId);
      const child = parent && (parent.children || []).find(c => c.id === childId);
      const grand = child && (child.grandchildren || []).find(g => g.id === grandchildId);
      if (!grand || !grand.greatchildren || grand.greatchildren.length === 0) {
        setExpandedIds(prevSet => {
          const copy = new Set(prevSet);
          copy.delete(grandchildId);
          return copy;
        });
      }
      return next;
    });
    setMenuOpenId(null);
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

    // Grandchild moved to grandchild position
    if (fromParts[0] === 'g' && toParts[0] === 'g') {
      const fromParent = fromParts[1];
      const fromChild = fromParts[2];
      const fromGrand = fromParts[3];
      const toParent = toParts[1];
      const toChild = toParts[2];
      const toGrand = toParts[3];

      setSections((prev) => {
        const copy = prev.map(p => ({
          ...p,
          children: (p.children || []).map(c => ({ ...c, grandchildren: c.grandchildren ? [...c.grandchildren] : [] }))
        }));
        const fp = copy.find(p => p.id === fromParent);
        const fc = fp && (fp.children || []).find(c => c.id === fromChild);
        const tp = copy.find(p => p.id === toParent);
        const tc = tp && (tp.children || []).find(c => c.id === toChild);
        if (!fp || !fc || !tp || !tc) return prev;
        const fromIndex = fc.grandchildren.findIndex(g => g.id === fromGrand);
        const toIndex = tc.grandchildren.findIndex(g => g.id === toGrand);
        if (fromIndex === -1 || toIndex === -1) return prev;
        const [moved] = fc.grandchildren.splice(fromIndex, 1);
        if (fc.id === tc.id && fromIndex < toIndex) {
          tc.grandchildren.splice(toIndex, 0, moved);
        } else {
          tc.grandchildren.splice(toIndex, 0, moved);
        }
        return copy;
      });
    }

    // Grandchild -> Child (move grandchild to another child's grandchildren list)
    if (fromParts[0] === 'g' && toParts[0] === 'c') {
      const fromParent = fromParts[1];
      const fromChild = fromParts[2];
      const fromGrand = fromParts[3];
      const toParent = toParts[1];
      const toChild = toParts[2];

      setSections((prev) => {
        const copy = prev.map(p => ({
          ...p,
          children: (p.children || []).map(c => ({ ...c, grandchildren: c.grandchildren ? [...c.grandchildren] : [] }))
        }));
        const fp = copy.find(p => p.id === fromParent);
        const fc = fp && (fp.children || []).find(c => c.id === fromChild);
        const tp = copy.find(p => p.id === toParent);
        const tc = tp && (tp.children || []).find(c => c.id === toChild);
        if (!fp || !fc || !tp || !tc) return prev;
        const fromIndex = fc.grandchildren.findIndex(g => g.id === fromGrand);
        if (fromIndex === -1) return prev;
        const [moved] = fc.grandchildren.splice(fromIndex, 1);
        tc.grandchildren.push(moved);
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
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">

      <div style={{ width: "520px" }} ref={containerRef}>
        <div className="mt-4 mb-3 card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-bold">All Sections</h6>
              <small className="text-muted">Manage syllabus structure</small>
            </div>
            {sections.length === 0 && <div className="text-muted mb-2 small">No sections yet. Click + to add one.</div>}
            <ul className="list-group list-group-flush mt-1">
              {sections.map((s) => (
                <React.Fragment key={s.id}>
                  <li
                    className={`list-group-item d-flex justify-content-between align-items-center ${dragOverId === `p:${s.id}` ? 'bg-light' : ''}`}
                    style={{ paddingLeft: '1rem' }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, `p:${s.id}`)}
                    onDragOver={(e) => handleDragOver(e, `p:${s.id}`)}
                    onDrop={(e) => handleDrop(e, `p:${s.id}`)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <FaGripVertical className="text-muted" />
                      <span
                        style={{ display: 'inline-block', cursor: 'pointer' }}
                        onClick={(e) => { e.stopPropagation(); toggleExpand(s.id); setMenuOpenId(null); }}
                        title={expandedIds.has(s.id) ? 'Hide syllabus' : 'Show syllabus'}
                      >
                        {s.name}
                      </span>
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
                        <div className="card position-absolute shadow-sm" style={{ right: 0, top: "120%", zIndex: 60, minWidth: 180 }}>
                          <div className="card-body p-2">
                            <button className="btn btn-sm btn-outline-info w-100 mb-2" onClick={() => { toggleExpand(s.id); setMenuOpenId(null); }}>{expandedIds.has(s.id) ? 'Hide Syllabus' : 'Show Syllabus'}</button>
                            <button className="btn btn-sm btn-outline-primary w-100 mb-2" onClick={() => { openAddChild(s.id); setMenuOpenId(null); }}>Add Syllabus</button>
                            <button className="btn btn-sm btn-outline-secondary w-100 mb-2" onClick={() => { handleEdit(s.id); setMenuOpenId(null); }}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger w-100" onClick={() => { handleDelete(s.id); setMenuOpenId(null); }}>Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                  {expandedIds.has(s.id) && (s.children || []).map(c => (
                    <React.Fragment key={c.id}>
                      <li
                        className={`list-group-item syllabus-item d-flex justify-content-between align-items-center mb-2 position-relative ${dragOverId === `c:${s.id}:${c.id}` ? 'bg-light' : ''}`}
                        style={{ paddingLeft: '2.5rem', borderLeft: '2px solid rgba(0,0,0,0.04)' }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, `c:${s.id}:${c.id}`)}
                        onDragOver={(e) => handleDragOver(e, `c:${s.id}:${c.id}`)}
                        onDrop={(e) => handleDrop(e, `c:${s.id}:${c.id}`)}
                        onDragEnd={handleDragEnd}
                      >
                        <div
                          className="d-flex align-items-center gap-3"
                          onClick={(e) => { e.stopPropagation(); toggleExpand(c.id); setMenuOpenId(null); }}
                          style={{ cursor: 'pointer' }}
                          title={expandedIds.has(c.id) ? 'Hide subtopics' : 'Show subtopics'}
                        >
                          <FaGripVertical className="text-muted" />
                          <span>{c.name}</span>
                        </div>
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
                            <div className="card position-absolute shadow-sm" style={{ right: 0, top: "110%", zIndex: 60, minWidth: 180 }}>
                              <div className="card-body p-2">
                                <button className="btn btn-sm btn-outline-info w-100 mb-2" onClick={() => { toggleExpand(c.id); setMenuOpenId(null); }}>{expandedIds.has(c.id) ? 'Hide Subtopics' : 'Show Subtopics'}</button>
                                <button className="btn btn-sm btn-outline-primary w-100 mb-2" onClick={() => { openAddGrandChild(s.id, c.id); setMenuOpenId(null); }}>Add Sub-Item</button>
                                <button className="btn btn-sm btn-outline-secondary w-100 mb-2" onClick={() => { handleEditChild(s.id, c.id); setMenuOpenId(null); }}>Edit</button>
                                <button className="btn btn-sm btn-outline-danger w-100" onClick={() => { handleDeleteChild(s.id, c.id); setMenuOpenId(null); }}>Delete</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>

                      {expandedIds.has(c.id) && (c.grandchildren || []).map(g => (
                        <React.Fragment key={g.id}>
                          <li
                            className={`list-group-item syllabus-item d-flex justify-content-between align-items-center mb-2 position-relative ${dragOverId === `g:${s.id}:${c.id}:${g.id}` ? 'bg-light' : ''}`}
                            style={{ paddingLeft: '4.5rem', borderLeft: '2px dashed rgba(0,0,0,0.03)' }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, `g:${s.id}:${c.id}:${g.id}`)}
                            onDragOver={(e) => handleDragOver(e, `g:${s.id}:${c.id}:${g.id}`)}
                            onDrop={(e) => handleDrop(e, `g:${s.id}:${c.id}:${g.id}`)}
                            onDragEnd={handleDragEnd}
                          >
                            <div
                              className="d-flex align-items-center gap-3"
                              onClick={(e) => { e.stopPropagation(); toggleExpand(g.id); setMenuOpenId(null); }}
                              style={{ cursor: 'pointer' }}
                              title={expandedIds.has(g.id) ? 'Hide concepts' : 'Show concepts'}
                            >
                              <FaGripVertical className="text-muted" />
                              <span>{g.name}</span>
                            </div>
                            <div>
                              <button
                                className="btn btn-sm btn-light border rounded-circle"
                                onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === `g:${s.id}:${c.id}:${g.id}` ? null : `g:${s.id}:${c.id}:${g.id}`); }}
                                aria-haspopup="true"
                                aria-expanded={menuOpenId === `g:${s.id}:${c.id}:${g.id}`}
                              >
                                <FaEllipsisV />
                              </button>

                              {menuOpenId === `g:${s.id}:${c.id}:${g.id}` && (
                                <div className="card position-absolute shadow-sm" style={{ right: 0, top: "110%", zIndex: 60, minWidth: 180 }}>
                                  <div className="card-body p-2">
                                    <button className="btn btn-sm btn-outline-info w-100 mb-2" onClick={() => { toggleExpand(g.id); setMenuOpenId(null); }}>{expandedIds.has(g.id) ? 'Hide Concepts' : 'Show Concepts'}</button>
                                    <button className="btn btn-sm btn-outline-primary w-100 mb-2" onClick={() => { openAddGreatChild(s.id, c.id, g.id); setMenuOpenId(null); }}>Add Sub-Item</button>
                                    <button className="btn btn-sm btn-outline-secondary w-100 mb-2" onClick={() => { openEditGrandChild(s.id, c.id, g.id); setMenuOpenId(null); }}>Edit</button>
                                    <button className="btn btn-sm btn-outline-danger w-100" onClick={() => { handleDeleteGrandChild(s.id, c.id, g.id); setMenuOpenId(null); }}>Delete</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </li>

                          {/* Render great-grandchildren (level 4) when grandchild is expanded */}
                          {expandedIds.has(g.id) && (g.greatchildren || []).map(h => (
                            <React.Fragment key={h.id}>
                              <li
                                key={h.id}
                                className={`list-group-item d-flex justify-content-between align-items-center mb-2 position-relative`}
                                style={{ paddingLeft: '6rem', borderLeft: '1px solid rgba(0,0,0,0.02)' }}
                              >
                                <div
                                  className="d-flex align-items-center gap-3"
                                  onClick={(e) => { e.stopPropagation(); /* leaf level - no expand */ setMenuOpenId(null); }}
                                  style={{ cursor: 'pointer' }}
                                  title="Concept"
                                >
                                  <FaGripVertical className="text-muted" />
                                  <span>{h.name}</span>
                                </div>
                                <div>
                                  <button
                                    className="btn btn-sm btn-light border rounded-circle"
                                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === `h:${s.id}:${c.id}:${g.id}:${h.id}` ? null : `h:${s.id}:${c.id}:${g.id}:${h.id}`); }}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpenId === `h:${s.id}:${c.id}:${g.id}:${h.id}`}
                                  >
                                    <FaEllipsisV />
                                  </button>

                                  {menuOpenId === `h:${s.id}:${c.id}:${g.id}:${h.id}` && (
                                    <div className="card position-absolute shadow-sm" style={{ right: 0, top: "110%", zIndex: 60, minWidth: 180 }}>
                                      <div className="card-body p-2">
                                        <button className="btn btn-sm btn-outline-primary w-100 mb-2" onClick={() => { duplicateGreatChild(s.id, c.id, g.id, h.id); }}>Duplicate</button>
                                        <button className="btn btn-sm btn-outline-secondary w-100 mb-2" onClick={() => { openEditGreatChild(s.id, c.id, g.id, h.id); setMenuOpenId(null); }}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger w-100" onClick={() => { handleDeleteGreatChild(s.id, c.id, g.id, h.id); setMenuOpenId(null); }}>Delete</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </li>
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}

                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>

        {/* Outer box (Add new section) */}
        <div className="mt-4 d-flex justify-content-center">
          <div className="d-flex flex-column align-items-center">
            <div 
              onClick={openAdd} 
              role="button" 
              title="Add Section"
              className="bg-primary rounded d-flex align-items-center justify-content-center"
              style={{ width: '100px', height: '100px', cursor: 'pointer' }}
            >
              <FaPlus size={48} className="text-white" />
            </div>
            <div className="small text-muted mt-2">Add Section</div>
          </div>
        </div>

        {/* Form shown below the box */}
        {showForm && (
          <div className="card p-3 mt-4 shadow" style={{ width: "420px" }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">{getFormTitle()}</h6>
              <div className="small-muted small">Click a label to open its items</div>
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
              <button className="btn btn-primary flex-grow-1" onClick={handleSave}>{getActionText()}</button>
              <button className="btn btn-outline-secondary" onClick={() => { setShowForm(false); setEditingId(null); setInputValue(""); setError(""); }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Syllabus;      


