 
 import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiMoreVertical } from "react-icons/fi";
import { FaEyeSlash } from "react-icons/fa";
import { FaGripVertical } from "react-icons/fa6";
import { MdOutlineEditNote } from "react-icons/md";
import { RiFileListLine, RiFileListFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { 
  FaVideo, 
  FaCode, 
  FaQuestionCircle, 
  FaClock, 
  FaUpload, 
  FaBook, 
  FaCube, 
  FaExternalLinkAlt, 
  FaFolder
} from "react-icons/fa";

import EditArticle from './EditArticle';
import ContentTypeModal from './ContentTypeModal';

// Constants for drag and drop
const ItemTypes = {
  SECTION: 'section',
  COURSE_ITEM: 'course_item',
};

// Icon mapping for different content types
const getContentIcon = (type, isPublished) => {
  const baseProps = { className: `text-primary fs-5 ${isPublished ? '' : 'opacity-50'}` };
  
  switch (type.toLowerCase()) {
    case 'article':
      return isPublished ? 
        <RiFileListFill {...baseProps} /> : 
        <RiFileListLine {...baseProps} />;
    
    case 'recorded video':
      return <FaVideo {...baseProps} />;
    
    case 'coding lab':
      return <FaCode {...baseProps} />;
    
    case 'quiz':
      return <FaQuestionCircle {...baseProps} />;
    
    case 'contest':
      return <FaClock {...baseProps} />;
    
    case 'upload assignment':
      return <FaUpload {...baseProps} />;
    
    case 'ebook':
      return <FaBook {...baseProps} />;
    
    case 'scorm':
      return <FaCube {...baseProps} />;
    
    case 'iframe embed':
      return <FaExternalLinkAlt {...baseProps} />;
    
    case 'sub-section':
      return <FaFolder {...baseProps} />;
    
    default:
      return isPublished ? 
        <RiFileListFill {...baseProps} /> : 
        <RiFileListLine {...baseProps} />;
  }
};

// Draggable Section Component
const DraggableSection = ({
  section,
  index,
  moveSection,
  children
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SECTION,
    item: { id: section.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.SECTION,
    hover: (draggedItem) => {
      if (draggedItem.id !== section.id) {
        moveSection(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}
    >
      {children}
    </div>
  );
};

// Draggable Course Item Component
const DraggableCourseItem = ({
  item,
  sectionId,
  index,
  moveItem,
  isPublished,
  onTogglePublish,
  onToggleMenu,
  onEdit,
  onDelete,
  openMenuId
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COURSE_ITEM,
    item: {
      id: item.id,
      sectionId: sectionId,
      index,
      type: item.type,
      title: item.title
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.COURSE_ITEM,
    hover: (draggedItem) => {
      if (draggedItem.id !== item.id && draggedItem.sectionId === sectionId) {
        moveItem(draggedItem.index, index, sectionId);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      className="d-flex align-items-center justify-content-between p-3 position-relative"
    >
      <div className="d-flex align-items-center gap-3 ms-4 flex-grow-1">
        <FaGripVertical className="text-muted fs-6 cursor-grab" style={{ cursor: 'grab' }} />
        
        {/* Dynamic icon based on content type */}
        {getContentIcon(item.type, isPublished)}
        
        <div className="flex-grow-1">
          <span className="text-muted small">{item.type}:</span>
          <span className="ms-1 fw-medium">{item.title}</span>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        {!isPublished && (
          <FaEyeSlash className="text-muted fs-6" />
        )}
        <button
          className={`btn px-4 ${isPublished ? 'btn-outline-secondary' : 'btn-primary'}`}
          onClick={() => onTogglePublish(item.id)}
        >
          {isPublished ? 'Unpublish' : 'Publish'}
        </button>

        {/* Three dots menu button */}
        <div className="position-relative">
          <button
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => onToggleMenu(item.id)}
          >
            <FiMoreVertical className="text-muted fs-3" />
          </button>

          {/* Dropdown menu   */}
          {openMenuId === item.id && (
            <div className="card position-absolute shadow-sm border-0" style={{ right: 0, top: '100%', zIndex: 1000, minWidth: '220px' }}>
              <div className="card-body p-0">
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td className="p-0 border-bottom">
                        <button
                          className="btn btn-sm w-100 text-start px-3 py-2 border-0 text-danger"
                          onClick={() => onDelete(item.id, sectionId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="p-0 border-bottom">
                        <button
                          className="btn btn-sm w-100 text-start px-3 py-2 border-0"
                          onClick={() => onEdit(item, sectionId)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="p-0 border-bottom">
                        <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
                          Modify availability
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="p-0 border-bottom">
                        <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
                          Enable free preview
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="p-0 border-bottom">
                        <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
                          Attach a resource
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="p-0">
                        <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
                          Manage tags
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add Item Component
const AddItemButton = ({ onClick }) => {
  return (
    <div className="p-3 ms-4">
      <button
        className="btn btn-sm border-0 text-primary p-0 d-flex align-items-center gap-1"
        onClick={onClick}
      >
        <FaPlus className="fs-6" />
        Add in this section
      </button>
    </div>
  );
};

const Syllabus = () => {
  const [showModal, setShowModal] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [sections, setSections] = useState([]);
  const [publishedItems, setPublishedItems] = useState(new Set());
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionName, setEditingSectionName] = useState('');
  const [currentView, setCurrentView] = useState('syllabus');
  const [editingItem, setEditingItem] = useState(null);
  const [showContentTypeModal, setShowContentTypeModal] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // Move section function for drag and drop
  const moveSection = (fromIndex, toIndex) => {
    setSections(prevSections => {
      const updatedSections = [...prevSections];
      const [movedSection] = updatedSections.splice(fromIndex, 1);
      updatedSections.splice(toIndex, 0, movedSection);
      return updatedSections;
    });
  };

  // Move item within section function for drag and drop
  const moveItem = (fromIndex, toIndex, sectionId) => {
    setSections(prevSections => {
      return prevSections.map(section => {
        if (section.id === sectionId) {
          const updatedItems = [...section.items];
          const [movedItem] = updatedItems.splice(fromIndex, 1);
          updatedItems.splice(toIndex, 0, movedItem);
          return { ...section, items: updatedItems };
        }
        return section;
      });
    });
  };

  const handleSubmit = () => {
    if (sectionName.trim()) {
      const newSection = {
        id: Date.now(),
        name: sectionName,
        items: [
          {
            id: Date.now() + 1,
            type: 'Article',
            title: 'Untitled article'
          }
        ]
      };
      setSections([...sections, newSection]);
      setSectionName('');
      setShowModal(false);
    }
  };

  const addItemToSection = (sectionId) => {
    setSelectedSectionId(sectionId);
    setShowContentTypeModal(true);
  };

  const handleContentTypeSelect = (type) => {
    if (selectedSectionId) {
      setSections(sections.map(section =>
        section.id === selectedSectionId
          ? {
            ...section,
            items: [
              ...section.items,
              {
                id: Date.now(),
                type: type,
                title: `Untitled ${type.toLowerCase()}`
              }
            ]
          }
          : section
      ));
    }
    setSelectedSectionId(null);
  };

  const togglePublish = (itemId) => {
    setPublishedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleMenu = (itemId) => {
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  const handleDelete = (itemId, sectionId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setSections(prevSections => {
        // First, remove the item from the section
        const updatedSections = prevSections.map(section =>
          section.id === sectionId
            ? {
              ...section,
              items: section.items.filter(item => item.id !== itemId)
            }
            : section
        );

        // Then, check if the section is empty and remove it if needed
        const sectionToCheck = updatedSections.find(s => s.id === sectionId);
        if (sectionToCheck && sectionToCheck.items.length === 0) {
          // Remove the empty section
          return updatedSections.filter(section => section.id !== sectionId);
        }

        return updatedSections;
      });
      setOpenMenuId(null);
    }
  };

  const handleEdit = (item, sectionId) => {
    setEditingItem({ ...item, sectionId });
    setCurrentView('edit');
    setOpenMenuId(null);
  };

  const handleSaveArticle = (updatedItem) => {
    setSections(sections.map(section =>
      section.id === updatedItem.sectionId
        ? {
          ...section,
          items: section.items.map(item =>
            item.id === updatedItem.id ? updatedItem : item
          )
        }
        : section
    ));
    setCurrentView('syllabus');
    setEditingItem(null);
  };

  const handleGoBack = () => {
    setCurrentView('syllabus');
    setEditingItem(null);
  };

  // Start editing section name
  const startEditingSection = (sectionId, currentName) => {
    setEditingSectionId(sectionId);
    setEditingSectionName(currentName);
  };

  // Save edited section name
  const saveSectionName = (sectionId) => {
    if (editingSectionName.trim()) {
      setSections(sections.map(section =>
        section.id === sectionId
          ? { ...section, name: editingSectionName.trim() }
          : section
      ));
    }
    setEditingSectionId(null);
    setEditingSectionName('');
  };

  // Cancel editing
  const cancelEditingSection = () => {
    setEditingSectionId(null);
    setEditingSectionName('');
  };

  // Handle Enter key press in edit input
  const handleKeyPress = (e, sectionId) => {
    if (e.key === 'Enter') {
      saveSectionName(sectionId);
    } else if (e.key === 'Escape') {
      cancelEditingSection();
    }
  };

  // Render the appropriate view
  if (currentView === 'edit' && editingItem) {
    return (
      <EditArticle
        item={editingItem}
        onSave={handleSaveArticle}
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container-fluid bg-light min-vh-100 p-4">
        <div className="container">
          {/* Header */}
          <div className="mb-4">
            <h1 className="h2 fw-bold text-dark">Manage your syllabus</h1>
            <p className="text-muted mb-0">
              Program your recorded schedule. Add live events, coding labs, video lessons, and more
            </p>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-end mb-5">
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary">
                Bulk import items from CSV
              </button>
              <button className="btn btn-outline-secondary">
                Preview your course as student
              </button>
            </div>
          </div>

          {/* Sections */}
          {sections.length > 0 ? (
            <div className="sections-container">
              {sections.map((section, index) => (
                <DraggableSection
                  key={section.id}
                  section={section}
                  index={index}
                  moveSection={moveSection}
                >
                  <div className="mb-4">
                    {/* Section Header */}
                    <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded-top">
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <FaGripVertical className="text-muted fs-6 cursor-grab" style={{ cursor: 'grab' }} />
                          <i className="bi bi-chevron-down text-muted"></i>

                          {/* Section Name - Display or Edit Mode */}
                          {editingSectionId === section.id ? (
                            <div className="d-flex align-items-center gap-2">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editingSectionName}
                                onChange={(e) => setEditingSectionName(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, section.id)}
                                onBlur={() => saveSectionName(section.id)}
                                autoFocus
                                style={{ width: '200px' }}
                              />
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => saveSectionName(section.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={cancelEditingSection}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <h5 className="mb-0 fw-bold">{section.name}</h5>
                          )}

                          {/* Edit Icon - Only show when not in edit mode */}
                          {editingSectionId !== section.id && (
                            <MdOutlineEditNote
                              className="text-muted fs-3 cursor-pointer"
                              style={{ cursor: 'pointer' }}
                              onClick={() => startEditingSection(section.id, section.name)}
                              title="Edit section name"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section Items */}
                    <div className="bg-white border border-top-0 rounded-bottom">
                      {section.items.map((item, itemIndex) => {
                        const isPublished = publishedItems.has(item.id);

                        return (
                          <DraggableCourseItem
                            key={item.id}
                            item={item}
                            sectionId={section.id}
                            index={itemIndex}
                            moveItem={moveItem}
                            isPublished={isPublished}
                            onTogglePublish={togglePublish}
                            onToggleMenu={toggleMenu}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            openMenuId={openMenuId}
                          />
                        );
                      })}

                      {/* Add Item Button */}
                      <AddItemButton onClick={() => addItemToSection(section.id)} />
                    </div>
                  </div>
                </DraggableSection>
              ))}

              {/* Add New Section Button */}
              <div className="text-center mt-4">
                <div
                  className="bg-white border border-dashed rounded p-4"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowModal(true)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="text-muted mb-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p className="text-muted mb-0 small">Add a new section here</p>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-5">
              <div
                className="bg-white border border-dashed rounded p-5"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowModal(true)}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-muted mb-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-muted mb-0">Your course has nothing. Add a course item to start.</p>
              </div>
            </div>
          )}

          {/* Modal for Adding Section */}
          {showModal && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="mb-4">
                      <h6 className="fw-bold">Enter section name</h6>
                      <p className="text-muted small mb-2">
                        Enter a name for your section. You can change it later
                      </p>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter section name"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      />
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setShowModal(false);
                          setSectionName('');
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={!sectionName.trim()}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Type Selection Modal */}
          <ContentTypeModal
            show={showContentTypeModal}
            onClose={() => setShowContentTypeModal(false)}
            onSelectType={handleContentTypeSelect}
          />

          {/* Modal Backdrop for Section Modal */}
          {showModal && <div className="modal-backdrop show"></div>}
        </div>
      </div>
    </DndProvider>
  );
};

export default Syllabus;