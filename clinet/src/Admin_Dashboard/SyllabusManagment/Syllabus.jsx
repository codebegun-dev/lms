

// // import { useState, useEffect } from 'react';
// // import { DndProvider, useDrag, useDrop } from 'react-dnd';
// // import { HTML5Backend } from 'react-dnd-html5-backend';
// // import { FiMoreVertical } from "react-icons/fi";
// // import { FaEyeSlash } from "react-icons/fa";
// // import { FaGripVertical } from "react-icons/fa6";
// // import { MdOutlineEditNote } from "react-icons/md";
// // import { RiFileListLine, RiFileListFill } from "react-icons/ri";
// // import { FaPlus } from "react-icons/fa6";
// // import { BsThreeDotsVertical } from "react-icons/bs";
// // import { 
// //   FaVideo, 
// //   FaCode, 
// //   FaQuestionCircle, 
// //   FaClock, 
// //   FaUpload, 
// //   FaBook, 
// //   FaCube, 
// //   FaExternalLinkAlt, 
// //   FaFolder
// // } from "react-icons/fa";
// // import { useParams, useNavigate } from 'react-router-dom';

// // import ContentTypeModal from './ContentTypeModal';
// // import EditArticle from './EditArticle';

// // // Constants for drag and drop
// // const ItemTypes = {
// //   SECTION: 'section',
// //   COURSE_ITEM: 'course_item',
// // };

// // // Icon mapping for different content types
// // const getContentIcon = (type, isPublished) => {
// //   const baseProps = { className: `text-primary fs-5 ${isPublished ? '' : 'opacity-50'}` };
  
// //   switch (type.toLowerCase()) {
// //     case 'article':
// //       return isPublished ? 
// //         <RiFileListFill {...baseProps} /> : 
// //         <RiFileListLine {...baseProps} />;
    
// //     case 'recorded video':
// //       return <FaVideo {...baseProps} />;
    
// //     case 'coding lab':
// //       return <FaCode {...baseProps} />;
    
// //     case 'quiz':
// //       return <FaQuestionCircle {...baseProps} />;
    
// //     case 'contest':
// //       return <FaClock {...baseProps} />;
    
// //     case 'upload assignment':
// //       return <FaUpload {...baseProps} />;
    
// //     case 'ebook':
// //       return <FaBook {...baseProps} />;
    
// //     case 'scorm':
// //       return <FaCube {...baseProps} />;
    
// //     case 'iframe embed':
// //       return <FaExternalLinkAlt {...baseProps} />;
    
// //     case 'sub-section':
// //       return <FaFolder {...baseProps} />;
    
// //     default:
// //       return isPublished ? 
// //         <RiFileListFill {...baseProps} /> : 
// //         <RiFileListLine {...baseProps} />;
// //   }
// // };

// // // Draggable Section Component
// // const DraggableSection = ({
// //   section,
// //   index,
// //   moveSection,
// //   children
// // }) => {
// //   const [{ isDragging }, drag] = useDrag({
// //     type: ItemTypes.SECTION,
// //     item: { id: section.id, index },
// //     collect: (monitor) => ({
// //       isDragging: monitor.isDragging(),
// //     }),
// //   });

// //   const [, drop] = useDrop({
// //     accept: ItemTypes.SECTION,
// //     hover: (draggedItem) => {
// //       if (draggedItem.id !== section.id) {
// //         moveSection(draggedItem.index, index);
// //         draggedItem.index = index;
// //       }
// //     },
// //   });

// //   return (
// //     <div
// //       ref={(node) => drag(drop(node))}
// //       style={{
// //         opacity: isDragging ? 0.5 : 1,
// //         cursor: 'move'
// //       }}
// //     >
// //       {children}
// //     </div>
// //   );
// // };

// // // Draggable Course Item Component
// // const DraggableCourseItem = ({
// //   item,
// //   sectionId,
// //   index,
// //   moveItem,
// //   isPublished,
// //   onTogglePublish,
// //   onToggleMenu,
// //   onEdit,
// //   onDelete,
// //   openMenuId
// // }) => {
// //   const [{ isDragging }, drag] = useDrag({
// //     type: ItemTypes.COURSE_ITEM,
// //     item: {
// //       id: item.id,
// //       sectionId: sectionId,
// //       index,
// //       type: item.type,
// //       title: item.title
// //     },
// //     collect: (monitor) => ({
// //       isDragging: monitor.isDragging(),
// //     }),
// //   });

// //   const [, drop] = useDrop({
// //     accept: ItemTypes.COURSE_ITEM,
// //     hover: (draggedItem) => {
// //       if (draggedItem.id !== item.id && draggedItem.sectionId === sectionId) {
// //         moveItem(draggedItem.index, index, sectionId);
// //         draggedItem.index = index;
// //       }
// //     },
// //   });

// //   return (
// //     <div
// //       ref={(node) => drag(drop(node))}
// //       style={{
// //         opacity: isDragging ? 0.5 : 1,
// //       }}
// //       className="d-flex align-items-center justify-content-between p-3 position-relative"
// //     >
// //       <div className="d-flex align-items-center gap-3 ms-4 flex-grow-1">
// //         <FaGripVertical className="text-muted fs-6 cursor-grab" style={{ cursor: 'grab' }} />
        
// //         {/* Dynamic icon based on content type */}
// //         {getContentIcon(item.type, isPublished)}
        
// //         <div className="flex-grow-1">
// //           <span className="text-muted small">{item.type}:</span>
// //           <span className="ms-1 fw-medium">{item.title}</span>
// //         </div>
// //       </div>
// //       <div className="d-flex align-items-center gap-3">
// //         {!isPublished && (
// //           <FaEyeSlash className="text-muted fs-6" />
// //         )}
// //         <button
// //           className={`btn px-4 ${isPublished ? 'btn-outline-secondary' : 'btn-primary'}`}
// //           onClick={() => onTogglePublish(item.id)}
// //         >
// //           {isPublished ? 'Unpublish' : 'Publish'}
// //         </button>

// //         {/* Three dots menu button */}
// //         <div className="position-relative">
// //           <button
// //             className="btn btn-sm btn-outline-secondary border-0"
// //             onClick={() => onToggleMenu(item.id)}
// //           >
// //             <FiMoreVertical className="text-muted fs-3" />
// //           </button>

// //           {/* Dropdown menu   */}
// //           {openMenuId === item.id && (
// //             <div className="card position-absolute shadow-sm border-0" style={{ right: 0, top: '100%', zIndex: 1000, minWidth: '220px' }}>
// //               <div className="card-body p-0">
// //                 <table className="table table-borderless mb-0">
// //                   <tbody>
// //                     <tr>
// //                       <td className="p-0 border-bottom">
// //                         <button
// //                           className="btn btn-sm w-100 text-start px-3 py-2 border-0 text-danger"
// //                           onClick={() => onDelete(item.id, sectionId)}
// //                         >
// //                           Delete
// //                         </button>
// //                       </td>
// //                     </tr>

// //                     <tr>
// //                       <td className="p-0 border-bottom">
// //                         <button
// //                           className="btn btn-sm w-100 text-start px-3 py-2 border-0"
// //                           onClick={() => onEdit(item, sectionId)}
// //                         >
// //                           Edit
// //                         </button>
// //                       </td>
// //                     </tr>

// //                     <tr>
// //                       <td className="p-0 border-bottom">
// //                         <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
// //                           Modify availability
// //                         </button>
// //                       </td>
// //                     </tr>

// //                     <tr>
// //                       <td className="p-0 border-bottom">
// //                         <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
// //                           Enable free preview
// //                         </button>
// //                       </td>
// //                     </tr>

// //                     <tr>
// //                       <td className="p-0 border-bottom">
// //                         <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
// //                           Attach a resource
// //                         </button>
// //                       </td>
// //                     </tr>

// //                     <tr>
// //                       <td className="p-0">
// //                         <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
// //                           Manage tags
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Section Menu Component
// // const SectionMenu = ({ 
// //   section, 
// //   onEdit, 
// //   onDelete, 
// //   onCloneToCourse,
// //   isOpen, 
// //   onToggle 
// // }) => {
// //   return (
// //     <div className="position-relative">
// //       <button
// //         className="btn btn-sm btn-outline-secondary border-0"
// //         onClick={(e) => {
// //           e.stopPropagation();
// //           onToggle(section.id);
// //         }}
// //       >
// //         <BsThreeDotsVertical className="text-muted fs-5" />
// //       </button>

// //       {/* Dropdown menu */}
// //       {isOpen && (
// //         <div className="card position-absolute shadow-sm border-0" style={{ right: 0, top: '100%', zIndex: 1000, minWidth: '180px' }}>
// //           <div className="card-body p-0">
// //             <table className="table table-borderless mb-0">
// //               <tbody>
// //                 <tr>
// //                   <td className="p-0 border-bottom">
// //                     <button
// //                       className="btn btn-sm w-100 text-start px-3 py-2 border-0"
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         onEdit(section);
// //                         onToggle(null);
// //                       }}
// //                     >
// //                       Edit
// //                     </button>
// //                   </td>
// //                 </tr>

// //                 <tr>
// //                   <td className="p-0 border-bottom">
// //                     <button
// //                       className="btn btn-sm w-100 text-start px-3 py-2 border-0"
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         onCloneToCourse(section);
// //                         onToggle(null);
// //                       }}
// //                     >
// //                       Clone to another course
// //                     </button>
// //                   </td>
// //                 </tr>
                
// //                 <tr>
// //                   <td className="p-0">
// //                     <button
// //                       className="btn btn-sm w-100 text-start px-3 py-2 border-0 text-danger"
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         onDelete(section.id);
// //                         onToggle(null);
// //                       }}
// //                     >
// //                       Delete
// //                     </button>
// //                   </td>
// //                 </tr>
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // // Add Item Component
// // const AddItemButton = ({ onClick }) => {
// //   return (
// //     <div className="p-3 ms-4">
// //       <button
// //         className="btn btn-sm border-0 text-primary p-0 d-flex align-items-center gap-1"
// //         onClick={onClick}
// //       >
// //         <FaPlus className="fs-6" />
// //         Add in this section
// //       </button>
// //     </div>
// //   );
// // };

// // // Clone Section to Course Modal Component
// // const CloneSectionToCourseModal = ({ 
// //   show, 
// //   onClose, 
// //   onClone, 
// //   currentCourseName, 
// //   availableCourses = [],
// //   sectionToClone 
// // }) => {
// //   const [selectedCourse, setSelectedCourse] = useState('');
// //   const [sectionName, setSectionName] = useState('');
// //   const [validationError, setValidationError] = useState('');

// //   useEffect(() => {
// //     if (show && sectionToClone) {
// //       setSelectedCourse('');
// //       setSectionName(`${sectionToClone.name} (Copy)`);
// //       setValidationError('');
// //     }
// //   }, [show, sectionToClone]);

// //   const handleClone = () => {
// //     if (!selectedCourse) {
// //       setValidationError('Please select a target course');
// //       return;
// //     }

// //     if (!sectionName.trim()) {
// //       setValidationError('Please enter a section name');
// //       return;
// //     }

// //     onClone(selectedCourse, sectionName, sectionToClone);
// //   };

// //   const handleCancel = () => {
// //     setSelectedCourse('');
// //     setSectionName('');
// //     setValidationError('');
// //     onClose();
// //   };

// //   if (!show) return null;

// //   return (
// //     <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
// //       <div className="modal-dialog modal-dialog-centered">
// //         <div className="modal-content">
// //           <div className="modal-header">
// //             <h5 className="modal-title">Clone Section to Another Course</h5>
// //             <button 
// //               type="button" 
// //               className="btn-close" 
// //               onClick={handleCancel}
// //             ></button>
// //           </div>
// //           <div className="modal-body">
// //             <div className="alert alert-info">
// //               <small>
// //                 <strong>Source Course:</strong> {currentCourseName}
// //                 <br />
// //                 <strong>Section to Clone:</strong> {sectionToClone?.name}
// //                 <br />
// //                 <strong>Items in section:</strong> {sectionToClone?.items?.length || 0} items
// //               </small>
// //             </div>

// //             <div className="mb-3">
// //               <label className="form-label fw-semibold">Select Target Course *</label>
// //               <select
// //                 className={`form-select ${validationError && !selectedCourse ? 'is-invalid' : ''}`}
// //                 value={selectedCourse}
// //                 onChange={(e) => {
// //                   setSelectedCourse(e.target.value);
// //                   if (validationError) setValidationError('');
// //                 }}
// //               >
// //                 <option value="">Choose a target course</option>
// //                 {availableCourses
// //                   .filter(course => course.courseName !== currentCourseName)
// //                   .map(course => (
// //                     <option key={course.courseId} value={course.courseName}>
// //                       {course.courseName}
// //                     </option>
// //                   ))
// //                 }
// //               </select>
// //               {validationError && !selectedCourse && (
// //                 <div className="invalid-feedback">{validationError}</div>
// //               )}
// //               <div className="form-text">
// //                 Select the course where you want to clone this section
// //               </div>
// //             </div>

// //             <div className="mb-3">
// //               <label className="form-label fw-semibold">Section Name for Target Course *</label>
// //               <input
// //                 type="text"
// //                 className={`form-control ${validationError && !sectionName.trim() ? 'is-invalid' : ''}`}
// //                 value={sectionName}
// //                 onChange={(e) => {
// //                   setSectionName(e.target.value);
// //                   if (validationError) setValidationError('');
// //                 }}
// //                 placeholder="Enter section name for the target course"
// //               />
// //               {validationError && !sectionName.trim() && (
// //                 <div className="invalid-feedback">{validationError}</div>
// //               )}
// //               <div className="form-text">
// //                 This will be the name of the section in the target course
// //               </div>
// //             </div>

// //             {validationError && (
// //               <div className="alert alert-warning py-2">
// //                 <small>{validationError}</small>
// //               </div>
// //             )}

// //             <div className="alert alert-warning">
// //               <small>
// //                 <strong>Note:</strong> Only the selected section "<strong>{sectionToClone?.name}</strong>" 
// //                 with its {sectionToClone?.items?.length || 0} items will be cloned to the target course. 
// //                 Other sections will not be affected.
// //               </small>
// //             </div>
// //           </div>
// //           <div className="modal-footer">
// //             <button
// //               type="button"
// //               className="btn btn-outline-secondary"
// //               onClick={handleCancel}
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               type="button"
// //               className="btn btn-primary"
// //               onClick={handleClone}
// //             >
// //               Clone Section
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const Syllabus = () => {
// //   const { courseName } = useParams();
// //   const navigate = useNavigate();
// //   const [showModal, setShowModal] = useState(false);
// //   const [sections, setSections] = useState([]);
// //   const [publishedItems, setPublishedItems] = useState(new Set());
// //   const [openMenuId, setOpenMenuId] = useState(null);
// //   const [openSectionMenuId, setOpenSectionMenuId] = useState(null);
// //   const [currentView, setCurrentView] = useState('syllabus');
// //   const [editingItem, setEditingItem] = useState(null);
// //   const [showContentTypeModal, setShowContentTypeModal] = useState(false);
// //   const [selectedSectionId, setSelectedSectionId] = useState(null);
// //   const [editingSectionData, setEditingSectionData] = useState(null);
// //   const [showCloneSectionModal, setShowCloneSectionModal] = useState(false);
// //   const [sectionToClone, setSectionToClone] = useState(null);
// //   const [availableCourses, setAvailableCourses] = useState([]);

// //   // New section form state
// //   const [newSectionData, setNewSectionData] = useState({
// //     name: '',
// //     duration: '',
// //     level: 'Beginner',
// //     tags: '',
// //     description: ''
// //   });

// //   // Decode course name from URL
// //   const decodedCourseName = courseName ? decodeURIComponent(courseName) : 'Untitled Course';

// //   // localStorage key for this course
// //   const storageKey = `syllabus_${decodedCourseName}`;

// //   // Load data from localStorage when component mounts or courseName changes
// //   useEffect(() => {
// //     const fetchCourses = async () => {
// //       try {
// //         const res = await fetch("http://localhost:8080/api/courses/all");
// //         const data = await res.json();
// //         setAvailableCourses(data);
// //       } catch (error) {
// //         console.error("Error fetching courses:", error);
// //       }
// //     };

// //     fetchCourses();
// //   }, []);

// //   // Enhanced data loading with better error handling
// //   useEffect(() => {
// //     const loadSyllabusData = () => {
// //       try {
// //         const savedData = localStorage.getItem(storageKey);
// //         if (savedData) {
// //           const parsedData = JSON.parse(savedData);
// //           console.log('Loaded syllabus data:', parsedData);
          
// //           // Ensure we have valid arrays
// //           setSections(Array.isArray(parsedData.sections) ? parsedData.sections : []);
// //           setPublishedItems(new Set(Array.isArray(parsedData.publishedItems) ? parsedData.publishedItems : []));
// //         } else {
// //           // Initialize with empty arrays if no data exists
// //           setSections([]);
// //           setPublishedItems(new Set());
// //           console.log('No existing data found, initializing empty syllabus');
// //         }
// //       } catch (error) {
// //         console.error('Error loading saved syllabus data:', error);
// //         // Reset to empty state on error
// //         setSections([]);
// //         setPublishedItems(new Set());
// //       }
// //     };

// //     loadSyllabusData();
// //   }, [storageKey, courseName]);

// //   // Enhanced data saving with better error handling
// //   useEffect(() => {
// //     const saveSyllabusData = () => {
// //       try {
// //         const syllabusData = {
// //           sections: Array.isArray(sections) ? sections : [],
// //           publishedItems: Array.from(publishedItems),
// //           lastUpdated: new Date().toISOString(),
// //           courseName: decodedCourseName
// //         };
        
// //         localStorage.setItem(storageKey, JSON.stringify(syllabusData));
// //         console.log('Saved syllabus data:', syllabusData);
// //       } catch (error) {
// //         console.error('Error saving syllabus data:', error);
// //       }
// //     };

// //     // Only save if we have valid data
// //     if (Array.isArray(sections)) {
// //       saveSyllabusData();
// //     }
// //   }, [sections, publishedItems, storageKey, decodedCourseName]);

// //   const handleBackToCourses = () => {
// //     navigate('/admin-dashboard/courses', { replace: true });
// //   };

// //   // Move section function for drag and drop
// //   const moveSection = (fromIndex, toIndex) => {
// //     setSections(prevSections => {
// //       const updatedSections = [...prevSections];
// //       const [movedSection] = updatedSections.splice(fromIndex, 1);
// //       updatedSections.splice(toIndex, 0, movedSection);
// //       return updatedSections;
// //     });
// //   };

// //   // Move item within section function for drag and drop
// //   const moveItem = (fromIndex, toIndex, sectionId) => {
// //     setSections(prevSections => {
// //       return prevSections.map(section => {
// //         if (section.id === sectionId) {
// //           const updatedItems = [...section.items];
// //           const [movedItem] = updatedItems.splice(fromIndex, 1);
// //           updatedItems.splice(toIndex, 0, movedItem);
// //           return { ...section, items: updatedItems };
// //         }
// //         return section;
// //       });
// //     });
// //   };

// //   const handleSubmit = () => {
// //     if (newSectionData.name.trim()) {
// //       const newSection = {
// //         id: Date.now(),
// //         name: newSectionData.name,
// //         duration: newSectionData.duration,
// //         level: newSectionData.level,
// //         tags: newSectionData.tags,
// //         description: newSectionData.description,
// //         items: []
// //       };
      
// //       setSections(prev => {
// //         const updatedSections = [...prev, newSection];
// //         console.log('Added new section:', newSection, 'Total sections:', updatedSections.length);
// //         return updatedSections;
// //       });
      
// //       setNewSectionData({
// //         name: '',
// //         duration: '',
// //         level: 'Beginner',
// //         tags: '',
// //         description: ''
// //       });
// //       setShowModal(false);
// //     }
// //   };

// //   const addItemToSection = (sectionId) => {
// //     setSelectedSectionId(sectionId);
// //     setShowContentTypeModal(true);
// //   };

// //   const handleContentTypeSelect = (type) => {
// //     if (selectedSectionId) {
// //       setSections(prevSections => prevSections.map(section =>
// //         section.id === selectedSectionId
// //           ? {
// //             ...section,
// //             items: [
// //               ...section.items,
// //               {
// //                 id: Date.now(),
// //                 type: type,
// //                 title: `Untitled ${type.toLowerCase()}`
// //               }
// //             ]
// //           }
// //           : section
// //       ));
// //     }
// //     setSelectedSectionId(null);
// //   };

// //   const togglePublish = (itemId) => {
// //     setPublishedItems(prev => {
// //       const newSet = new Set(prev);
// //       if (newSet.has(itemId)) {
// //         newSet.delete(itemId);
// //       } else {
// //         newSet.add(itemId);
// //       }
// //       return newSet;
// //     });
// //   };

// //   const toggleMenu = (itemId) => {
// //     setOpenMenuId(openMenuId === itemId ? null : itemId);
// //   };

// //   const toggleSectionMenu = (sectionId) => {
// //     setOpenSectionMenuId(openSectionMenuId === sectionId ? null : sectionId);
// //   };

// //   const handleDelete = (itemId, sectionId) => {
// //     if (window.confirm('Are you sure you want to delete this item?')) {
// //       setSections(prevSections => {
// //         const updatedSections = prevSections.map(section =>
// //           section.id === sectionId
// //             ? {
// //               ...section,
// //               items: section.items.filter(item => item.id !== itemId)
// //             }
// //             : section
// //         );

// //         const sectionToCheck = updatedSections.find(s => s.id === sectionId);
// //         if (sectionToCheck && sectionToCheck.items.length === 0) {
// //           return updatedSections.filter(section => section.id !== sectionId);
// //         }

// //         return updatedSections;
// //       });
// //       setOpenMenuId(null);
// //     }
// //   };

// //   const handleDeleteSection = (sectionId) => {
// //     if (window.confirm('Are you sure you want to delete this section? This will also delete all items within it.')) {
// //       setSections(prevSections => prevSections.filter(section => section.id !== sectionId));
// //       setOpenSectionMenuId(null);
// //     }
// //   };

// //   const handleEdit = (item, sectionId) => {
// //     setEditingItem({ ...item, sectionId });
// //     setCurrentView('edit');
// //     setOpenMenuId(null);
// //   };

// //   const handleSaveArticle = (updatedItem) => {
// //     setSections(prevSections => prevSections.map(section =>
// //       section.id === updatedItem.sectionId
// //         ? {
// //           ...section,
// //           items: section.items.map(item =>
// //             item.id === updatedItem.id ? updatedItem : item
// //           )
// //         }
// //         : section
// //     ));
// //     setCurrentView('syllabus');
// //     setEditingItem(null);
// //   };

// //   const handleGoBack = () => {
// //     setCurrentView('syllabus');
// //     setEditingItem(null);
// //   };

// //   // Start editing section metadata
// //   const startEditingSection = (section) => {
// //     setEditingSectionData(section);
// //     setOpenSectionMenuId(null);
// //   };

// //   // Save edited section metadata
// //   const saveSectionMetadata = () => {
// //     if (editingSectionData && editingSectionData.name.trim()) {
// //       setSections(prevSections => prevSections.map(section =>
// //         section.id === editingSectionData.id
// //           ? { ...editingSectionData }
// //           : section
// //       ));
// //       setEditingSectionData(null);
// //     }
// //   };

// //   // Cancel editing section metadata
// //   const cancelEditingSection = () => {
// //     setEditingSectionData(null);
// //   };

// //   // Handle section metadata change
// //   const handleSectionMetadataChange = (field, value) => {
// //     setEditingSectionData(prev => ({
// //       ...prev,
// //       [field]: value
// //     }));
// //   };

// //   // Handle new section data change
// //   const handleNewSectionDataChange = (field, value) => {
// //     setNewSectionData(prev => ({
// //       ...prev,
// //       [field]: value
// //     }));
// //   };

// //   // Cancel adding new section
// //   const cancelAddSection = () => {
// //     setShowModal(false);
// //     setNewSectionData({
// //       name: '',
// //       duration: '',
// //       level: 'Beginner',
// //       tags: '',
// //       description: ''
// //     });
// //   };

// //   // Open clone section to another course modal
// //   const handleOpenCloneToCourseModal = (section) => {
// //     setSectionToClone(section);
// //     setShowCloneSectionModal(true);
// //     setOpenSectionMenuId(null);
// //   };

// //   // Clone SPECIFIC section to another course
// //   const handleCloneSectionToCourse = async (targetCourse, sectionName, section) => {
// //     try {
// //       console.log("Cloning SPECIFIC section to:", targetCourse, "Section:", section.name);
      
// //       // Create storage key for target course
// //       const targetStorageKey = `syllabus_${targetCourse}`;
      
// //       // Get existing target course data or initialize empty
// //       const existingTargetData = localStorage.getItem(targetStorageKey);
// //       let targetSyllabus = {
// //         sections: [],
// //         publishedItems: [],
// //         lastUpdated: new Date().toISOString(),
// //         courseName: targetCourse
// //       };
      
// //       if (existingTargetData) {
// //         try {
// //           targetSyllabus = JSON.parse(existingTargetData);
// //           // Ensure sections is an array
// //           if (!Array.isArray(targetSyllabus.sections)) {
// //             targetSyllabus.sections = [];
// //           }
// //         } catch (error) {
// //           console.error('Error parsing target course data, initializing fresh:', error);
// //         }
// //       }
      
// //       // Create cloned section with new IDs - ONLY THE SPECIFIC SECTION
// //       const clonedSection = {
// //         ...section,
// //         id: Date.now() + Math.random(),
// //         name: sectionName,
// //         items: section.items.map(item => ({
// //           ...item,
// //           id: Date.now() + Math.random()
// //         }))
// //       };
      
// //       // Add ONLY the specific cloned section to target course
// //       targetSyllabus.sections.push(clonedSection);
      
// //       // Save to target course's localStorage
// //       localStorage.setItem(targetStorageKey, JSON.stringify(targetSyllabus));
      
// //       console.log('✅ Successfully cloned SPECIFIC section to target course:', {
// //         targetCourse,
// //         sectionName,
// //         originalSection: section.name,
// //         itemsCloned: section.items.length
// //       });
      
// //       // Show success message and close modal
// //       alert(`✅ Section "${section.name}" successfully cloned to course "${targetCourse}"!\n\nCloned ${section.items.length} items.`);
// //       setShowCloneSectionModal(false);
// //       setSectionToClone(null);
      
// //     } catch (error) {
// //       console.error("❌ Error cloning section:", error);
// //       alert("❌ Failed to clone section. Please try again.");
// //     }
// //   };

// //   // Clear syllabus data for current course (useful for testing)
// //   const handleClearData = () => {
// //     if (window.confirm('Are you sure you want to clear all syllabus data for this course? This action cannot be undone.')) {
// //       localStorage.removeItem(storageKey);
// //       setSections([]);
// //       setPublishedItems(new Set());
// //       alert('Syllabus data cleared successfully!');
// //     }
// //   };

// //   // Render the appropriate view
// //   if (currentView === 'edit' && editingItem) {
// //     return (
// //       <EditArticle
// //         item={editingItem}
// //         onSave={handleSaveArticle}
// //         onGoBack={handleGoBack}
// //       />
// //     );
// //   }

// //   return (
// //     <DndProvider backend={HTML5Backend}>
// //       <div className="container-fluid bg-light min-vh-100 p-4">
// //         <div className="container">
// //           {/* Header with Back Button and Course Name */}
// //           <div className="mb-4">
// //             <button 
// //               className="btn btn-outline-secondary btn-sm mb-3"
// //               onClick={handleBackToCourses}
// //             >
// //               ← Back to Courses
// //             </button>
// //             <div className="d-flex justify-content-between align-items-center">
// //               <div>
// //                 <h1 className="h2 fw-bold text-dark">Manage your syllabus</h1>
// //                 <p className="text-muted mb-0">
// //                   Program your recorded schedule. Add live events, coding labs, video lessons, and more
// //                 </p>
// //               </div>
// //               <div className="d-flex gap-2">
// //                 <button 
// //                   className="btn btn-outline-primary btn-sm"
// //                   onClick={handleClearData}
// //                 >
// //                   Clear Data
// //                 </button>
// //                 <button 
// //                   className="btn btn-primary btn-sm"
// //                   onClick={() => setShowModal(true)}
// //                 >
// //                   + Add Section
// //                 </button>
// //               </div>
// //             </div>
// //             {courseName && (
// //               <div className="mt-2 p-3 bg-white rounded border">
// //                 <h3 className="h5 fw-bold text-primary mb-1">Current Course: {decodedCourseName}</h3>
                 
// //               </div>
// //             )}
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="d-flex justify-content-between mb-5">
// //             <div className="d-flex gap-2">
// //               <button className="btn btn-outline-secondary">
// //                 Bulk import items from CSV
// //               </button>
// //               <button className="btn btn-outline-secondary">
// //                 Preview your course as student
// //               </button>
// //             </div>
// //           </div>

// //           {/* Sections */}
// //           {sections.length > 0 ? (
// //             <div className="sections-container">
// //               {sections.map((section, index) => (
// //                 <DraggableSection
// //                   key={section.id}
// //                   section={section}
// //                   index={index}
// //                   moveSection={moveSection}
// //                 >
// //                   <div className="mb-4">
// //                     {/* Section Header */}
// //                     <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded-top">
// //                       <div className="d-flex align-items-center gap-3 flex-grow-1">
// //                         <div className="d-flex align-items-center gap-2">
// //                           <FaGripVertical className="text-muted fs-6 cursor-grab" style={{ cursor: 'grab' }} />
// //                           <i className="bi bi-chevron-down text-muted"></i>
// //                         </div>
                        
// //                         <div className="flex-grow-1">
// //                           {/* Section Name */}
// //                           <h5 className="mb-1 fw-bold">{section.name}</h5>
                          
// //                           {/* Section Metadata */}
// //                           <div className="d-flex flex-wrap gap-3 align-items-center text-muted small">
// //                             {section.duration && (
// //                               <span className="d-flex align-items-center gap-1">
// //                                 <strong>Duration:</strong> {section.duration}
// //                               </span>
// //                             )}
// //                             {section.level && section.level !== 'Beginner' && (
// //                               <span className="d-flex align-items-center gap-1">
// //                                 <strong>Level:</strong> {section.level}
// //                               </span>
// //                             )}
// //                             {section.tags && (
// //                               <span className="d-flex align-items-center gap-1">
// //                                 <strong>Tags:</strong> {section.tags}
// //                               </span>
// //                             )}
// //                             {section.description && (
// //                               <span className="d-flex align-items-center gap-1">
// //                                 <strong>Description:</strong> {section.description}
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>
// //                       </div>

// //                       {/* Section Menu with Three Dots */}
// //                       <SectionMenu
// //                         section={section}
// //                         onEdit={startEditingSection}
// //                         onDelete={handleDeleteSection}
// //                         onCloneToCourse={handleOpenCloneToCourseModal}
// //                         isOpen={openSectionMenuId === section.id}
// //                         onToggle={toggleSectionMenu}
// //                       />
// //                     </div>

// //                     {/* Section Items */}
// //                     <div className="bg-white border border-top-0 rounded-bottom">
// //                       {section.items && section.items.map((item, itemIndex) => {
// //                         const isPublished = publishedItems.has(item.id);

// //                         return (
// //                           <DraggableCourseItem
// //                             key={item.id}
// //                             item={item}
// //                             sectionId={section.id}
// //                             index={itemIndex}
// //                             moveItem={moveItem}
// //                             isPublished={isPublished}
// //                             onTogglePublish={togglePublish}
// //                             onToggleMenu={toggleMenu}
// //                             onEdit={handleEdit}
// //                             onDelete={handleDelete}
// //                             openMenuId={openMenuId}
// //                           />
// //                         );
// //                       })}

// //                       {/* Add Item Button */}
// //                       <AddItemButton onClick={() => addItemToSection(section.id)} />
// //                     </div>
// //                   </div>
// //                 </DraggableSection>
// //               ))}

// //               {/* Add New Section Button */}
// //               <div className="text-center mt-4">
// //                 <div
// //                   className="bg-white border border-dashed rounded p-4"
// //                   style={{ cursor: 'pointer' }}
// //                   onClick={() => setShowModal(true)}
// //                 >
// //                   <svg
// //                     width="24"
// //                     height="24"
// //                     viewBox="0 0 24 24"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     className="text-muted mb-2"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth="1"
// //                       d="M12 6v6m0 0v6m0-6h6m-6 0H6"
// //                     />
// //                   </svg>
// //                   <p className="text-muted mb-0 small">Add a new section here</p>
// //                 </div>
// //               </div>
// //             </div>
// //           ) : (
// //             /* Empty State */
// //             <div className="text-center py-5">
// //               <div
// //                 className="bg-white border border-dashed rounded p-5"
// //                 style={{ cursor: 'pointer' }}
// //                 onClick={() => setShowModal(true)}
// //               >
// //                 <svg
// //                   width="48"
// //                   height="48"
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   className="text-muted mb-3"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth="1"
// //                     d="M12 6v6m0 0v6m0-6h6m-6 0H6"
// //                   />
// //                 </svg>
// //                 <p className="text-muted mb-0">Your course has nothing. Add a course item to start.</p>
// //                 {courseName && (
// //                   <p className="text-primary fw-semibold mt-2">Course: {decodedCourseName}</p>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Modal for Adding New Section */}
// //           {showModal && (
// //             <div className="modal show d-block" tabIndex="-1">
// //               <div className="modal-dialog modal-dialog-centered modal-lg">
// //                 <div className="modal-content">
// //                   <div className="modal-header">
// //                     <h5 className="modal-title">Create New Section</h5>
// //                     <button 
// //                       type="button" 
// //                       className="btn-close" 
// //                       onClick={cancelAddSection}
// //                     ></button>
// //                   </div>
// //                   <div className="modal-body">
// //                     <div className="mb-4">
// //                       <h6 className="fw-bold">Section Information</h6>
// //                       <p className="text-muted small mb-3">
// //                         Configure your section details and metadata
// //                       </p>

// //                       <div className="row g-3">
// //                         <div className="col-12">
// //                           <label className="form-label fw-semibold">Section Name *</label>
// //                           <input
// //                             type="text"
// //                             className="form-control"
// //                             value={newSectionData.name}
// //                             onChange={(e) => handleNewSectionDataChange('name', e.target.value)}
// //                             placeholder="Enter section name"
// //                           />
// //                         </div>
// //                         <div className="col-md-6">
// //                           <label className="form-label fw-semibold">Duration</label>
// //                           <input
// //                             type="text"
// //                             className="form-control"
// //                             value={newSectionData.duration}
// //                             onChange={(e) => handleNewSectionDataChange('duration', e.target.value)}
// //                             placeholder="e.g., 8 weeks"
// //                           />
// //                         </div>
// //                         <div className="col-md-6">
// //                           <label className="form-label fw-semibold">Level</label>
// //                           <select
// //                             className="form-select"
// //                             value={newSectionData.level}
// //                             onChange={(e) => handleNewSectionDataChange('level', e.target.value)}
// //                           >
// //                             <option value="Beginner">Beginner</option>
// //                             <option value="Intermediate">Intermediate</option>
// //                             <option value="Advanced">Advanced</option>
// //                           </select>
// //                         </div>
// //                         <div className="col-12">
// //                           <label className="form-label fw-semibold">Tags</label>
// //                           <input
// //                             type="text"
// //                             className="form-control"
// //                             value={newSectionData.tags}
// //                             onChange={(e) => handleNewSectionDataChange('tags', e.target.value)}
// //                             placeholder="Enter tags separated by commas"
// //                           />
// //                         </div>
// //                         <div className="col-12">
// //                           <label className="form-label fw-semibold">Description</label>
// //                           <textarea
// //                             className="form-control"
// //                             rows="3"
// //                             value={newSectionData.description}
// //                             onChange={(e) => handleNewSectionDataChange('description', e.target.value)}
// //                             placeholder="Enter section description"
// //                           />
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <div className="d-flex justify-content-end gap-2 mt-4">
// //                       <button
// //                         className="btn btn-outline-secondary"
// //                         onClick={cancelAddSection}
// //                       >
// //                         Cancel
// //                       </button>
// //                       <button
// //                         className="btn btn-primary"
// //                         onClick={handleSubmit}
// //                         disabled={!newSectionData.name.trim()}
// //                       >
// //                         Create Section
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Modal for Editing Section Metadata */}
// //           {editingSectionData && (
// //             <div className="modal show d-block" tabIndex="-1">
// //               <div className="modal-dialog modal-dialog-centered modal-lg">
// //                 <div className="modal-content">
// //                   <div className="modal-header">
// //                     <h5 className="modal-title">Edit Section Details</h5>
// //                     <button 
// //                       type="button" 
// //                       className="btn-close" 
// //                       onClick={cancelEditingSection}
// //                     ></button>
// //                   </div>
// //                   <div className="modal-body">
// //                     <div className="mb-4">
// //                       <h6 className="fw-bold">Section Information</h6>
// //                       <p className="text-muted small mb-3">
// //                         Update your section details and metadata
// //                       </p>

// //                       <div className="row g-3">
// //                         <div className="col-12">
// //                           <label className="form-label fw-semibold">Section Name *</label>
// //                           <input
// //                             type="text"
// //                             className="form-control"
// //                             value={editingSectionData.name || ''}
// //                             onChange={(e) => handleSectionMetadataChange('name', e.target.value)}
// //                             placeholder="Enter section name"
// //                           />
// //                         </div>
// //                         <div className="col-md-6">
// //                           <label className="form-label fw-semibold">Duration</label>
// //                           <input
// //                             type="text"
// //                             className="form-control"
// //                             value={editingSectionData.duration || ''}
// //                             onChange={(e) => handleSectionMetadataChange('duration', e.target.value)}
// //                             placeholder="e.g., 8 weeks"
// //                           />
// //                         </div>
// //                         <div className="col-md-6">
// //                           <label className="form-label fw-semibold">Level</label>
// //                           <select
// //                             className="form-select"
// //                             value={editingSectionData.level || 'Beginner'}
// //                             onChange={(e) => handleSectionMetadataChange('level', e.target.value)}
// //                           >
// //                             <option value="Beginner">Beginner</option>
// //                             <option value="Intermediate">Intermediate</option>
// //                             <option value="Advanced">Advanced</option>
// //                           </select>
// //                         </div>
// //                         <div className="col-12">
// //                           <label className="form-label fw-semibold">Tags</label>
// //                           <input
// //                             type="text"
// //                             className="form-control"
// //                             value={editingSectionData.tags || ''}
// //                             onChange={(e) => handleSectionMetadataChange('tags', e.target.value)}
// //                             placeholder="Enter tags separated by commas"
// //                           />
// //                         </div>
// //                         <div className="col-12">
// //                           <label className="form-label fw-semibold">Description</label>
// //                           <textarea
// //                             className="form-control"
// //                             rows="3"
// //                             value={editingSectionData.description || ''}
// //                             onChange={(e) => handleSectionMetadataChange('description', e.target.value)}
// //                             placeholder="Enter section description"
// //                           />
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <div className="d-flex justify-content-end gap-2 mt-4">
// //                       <button
// //                         className="btn btn-outline-secondary"
// //                         onClick={cancelEditingSection}
// //                       >
// //                         Cancel
// //                       </button>
// //                       <button
// //                         className="btn btn-primary"
// //                         onClick={saveSectionMetadata}
// //                         disabled={!editingSectionData.name?.trim()}
// //                       >
// //                         Save Changes
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Content Type Selection Modal */}
// //           <ContentTypeModal
// //             show={showContentTypeModal}
// //             onClose={() => setShowContentTypeModal(false)}
// //             onSelectType={handleContentTypeSelect}
// //           />

// //           {/* Clone Section to Course Modal */}
// //           <CloneSectionToCourseModal
// //             show={showCloneSectionModal}
// //             onClose={() => setShowCloneSectionModal(false)}
// //             onClone={handleCloneSectionToCourse}
// //             currentCourseName={decodedCourseName}
// //             availableCourses={availableCourses}
// //             sectionToClone={sectionToClone}
// //           />

// //           {/* Modal Backdrop for Modals */}
// //           {(showModal || editingSectionData || showCloneSectionModal) && <div className="modal-backdrop show"></div>}
// //         </div>
// //       </div>
// //     </DndProvider>
// //   );
// // };

// // export default Syllabus;











 


// import { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FiMoreVertical } from "react-icons/fi";
// import { FaEyeSlash } from "react-icons/fa";
// import { FaGripVertical } from "react-icons/fa6";
// import { MdOutlineEditNote } from "react-icons/md";
// import { RiFileListLine, RiFileListFill } from "react-icons/ri";
// import { FaPlus } from "react-icons/fa6";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { 
//   FaVideo, 
//   FaCode, 
//   FaQuestionCircle, 
//   FaClock, 
//   FaUpload, 
//   FaBook, 
//   FaCube, 
//   FaExternalLinkAlt, 
//   FaFolder,
//   FaChevronDown,
//   FaChevronRight
// } from 'react-icons/fa';
// import { useParams, useNavigate } from 'react-router-dom';

// import ContentTypeModal from './ContentTypeModal';
// import EditArticle from './EditArticle';

// // Constants for drag and drop
// const ItemTypes = {
//   SECTION: 'section',
//   COURSE_ITEM: 'course_item',
// };

// // Icon mapping for different content types
// const getContentIcon = (type, isPublished) => {
//   const baseProps = { className: `text-primary fs-5 ${isPublished ? '' : 'opacity-50'}` };
  
//   switch (type.toLowerCase()) {
//     case 'article':
//       return isPublished ? 
//         <RiFileListFill {...baseProps} /> : 
//         <RiFileListLine {...baseProps} />;
    
//     case 'recorded video':
//       return <FaVideo {...baseProps} />;
    
//     case 'coding lab':
//       return <FaCode {...baseProps} />;
    
//     case 'quiz':
//       return <FaQuestionCircle {...baseProps} />;
    
//     case 'contest':
//       return <FaClock {...baseProps} />;
    
//     case 'upload assignment':
//       return <FaUpload {...baseProps} />;
    
//     case 'ebook':
//       return <FaBook {...baseProps} />;
    
//     case 'scorm':
//       return <FaCube {...baseProps} />;
    
//     case 'iframe embed':
//       return <FaExternalLinkAlt {...baseProps} />;
    
//     case 'Chapter':
//       return <FaFolder {...baseProps} />;
    
//     default:
//       return isPublished ? 
//         <RiFileListFill {...baseProps} /> : 
//         <RiFileListLine {...baseProps} />;
//   }
// };

// // Draggable Section Component
// const DraggableSection = ({
//   section,
//   index,
//   moveSection,
//   children,
//   level = 0,
//   parentId = null
// }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.SECTION,
//     item: { id: section.id, index, level, parentId },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.SECTION,
//     hover: (draggedItem) => {
//       if (draggedItem.id !== section.id) {
//         moveSection(draggedItem.index, index, draggedItem.parentId, parentId);
//         draggedItem.index = index;
//         draggedItem.parentId = parentId;
//       }
//     },
//   });

//   const paddingLeft = level * 40; // 40px per level for indentation

//   return (
//     <div
//       ref={(node) => drag(drop(node))}
//       style={{
//         opacity: isDragging ? 0.5 : 1,
//         cursor: 'move',
//         marginLeft: `${paddingLeft}px`,
//         marginTop: '10px'
//       }}
//       className="section-wrapper"
//     >
//       {children}
//     </div>
//   );
// };

// // Draggable Course Item Component
// const DraggableCourseItem = ({
//   item,
//   sectionId,
//   index,
//   moveItem,
//   isPublished,
//   onTogglePublish,
//   onToggleMenu,
//   onEdit,
//   onDelete,
//   openMenuId,
//   level = 0
// }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.COURSE_ITEM,
//     item: {
//       id: item.id,
//       sectionId: sectionId,
//       index,
//       type: item.type,
//       title: item.title
//     },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.COURSE_ITEM,
//     hover: (draggedItem) => {
//       if (draggedItem.id !== item.id && draggedItem.sectionId === sectionId) {
//         moveItem(draggedItem.index, index, sectionId);
//         draggedItem.index = index;
//       }
//     },
//   });

//   const paddingLeft = level * 40; // 40px per level for indentation

//   return (
//     <div
//       ref={(node) => drag(drop(node))}
//       style={{
//         opacity: isDragging ? 0.5 : 1,
//         marginLeft: `${paddingLeft}px`
//       }}
//       className="d-flex align-items-center justify-content-between p-3 position-relative"
//     >
//       <div className="d-flex align-items-center gap-3 ms-4 flex-grow-1">
//         <FaGripVertical className="text-muted fs-6 cursor-grab" style={{ cursor: 'grab' }} />
        
//         {/* Dynamic icon based on content type */}
//         {getContentIcon(item.type, isPublished)}
        
//         <div className="flex-grow-1">
//           <span className="text-muted small">{item.type}:</span>
//           <span className="ms-1 fw-medium">{item.title}</span>
//         </div>
//       </div>
//       <div className="d-flex align-items-center gap-3">
//         {!isPublished && (
//           <FaEyeSlash className="text-muted fs-6" />
//         )}
//         <button
//           className={`btn px-4 ${isPublished ? 'btn-outline-secondary' : 'btn-primary'}`}
//           onClick={() => onTogglePublish(item.id)}
//         >
//           {isPublished ? 'Unpublish' : 'Publish'}
//         </button>

//         {/* Three dots menu button */}
//         <div className="position-relative">
//           <button
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => onToggleMenu(item.id)}
//           >
//             <FiMoreVertical className="text-muted fs-3" />
//           </button>

//           {/* Dropdown menu */}
//           {openMenuId === item.id && (
//             <div className="card position-absolute shadow-sm border-0" style={{ right: 0, top: '100%', zIndex: 1000, minWidth: '220px' }}>
//               <div className="card-body p-0">
//                 <table className="table table-borderless mb-0">
//                   <tbody>
//                     <tr>
//                       <td className="p-0 border-bottom">
//                         <button
//                           className="btn btn-sm w-100 text-start px-3 py-2 border-0 text-danger"
//                           onClick={() => onDelete(item.id, sectionId)}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>

//                     <tr>
//                       <td className="p-0 border-bottom">
//                         <button
//                           className="btn btn-sm w-100 text-start px-3 py-2 border-0"
//                           onClick={() => onEdit(item, sectionId)}
//                         >
//                           Edit
//                         </button>
//                       </td>
//                     </tr>

//                     <tr>
//                       <td className="p-0 border-bottom">
//                         <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
//                           Modify availability
//                         </button>
//                       </td>
//                     </tr>

//                     <tr>
//                       <td className="p-0 border-bottom">
//                         <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
//                           Enable free preview
//                         </button>
//                       </td>
//                     </tr>

//                     <tr>
//                       <td className="p-0 border-bottom">
//                         <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
//                           Attach a resource
//                         </button>
//                       </td>
//                     </tr>

//                     <tr>
//                       <td className="p-0">
//                         <button className="btn btn-sm w-100 text-start px-3 py-2 border-0">
//                           Manage tags
//                         </button>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Section Menu Component
// const SectionMenu = ({ 
//   section, 
//   onEdit, 
//   onDelete, 
//   onCloneToCourse,
//   isOpen, 
//   onToggle,
//   onAddSubSection,
//   level = 0
// }) => {
//   return (
//     <div className="position-relative">
//       <button
//         className="btn btn-sm btn-outline-secondary border-0"
//         onClick={(e) => {
//           e.stopPropagation();
//           onToggle(section.id);
//         }}
//       >
//         <BsThreeDotsVertical className="text-muted fs-5" />
//       </button>

//       {/* Dropdown menu */}
//       {isOpen && (
//         <div className="card position-absolute shadow-sm border-0" style={{ right: 0, top: '100%', zIndex: 1000, minWidth: '180px' }}>
//           <div className="card-body p-0">
//             <table className="table table-borderless mb-0">
//               <tbody>
//                 <tr>
//                   <td className="p-0 border-bottom">
//                     <button
//                       className="btn btn-sm w-100 text-start px-3 py-2 border-0"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onEdit(section);
//                         onToggle(null);
//                       }}
//                     >
//                       Edit
//                     </button>
//                   </td>
//                 </tr>

//                 {/* Only show Add Sub-section for levels 0-3 (max 5 levels total) */}
//                 {level < 4 && (
//                   <tr>
//                     <td className="p-0 border-bottom">
//                       <button
//                         className="btn btn-sm w-100 text-start px-3 py-2 border-0"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onAddSubSection(section.id);
//                           onToggle(null);
//                         }}
//                       >
//                         Add Sub-section
//                       </button>
//                     </td>
//                   </tr>
//                 )}

//                 <tr>
//                   <td className="p-0 border-bottom">
//                     <button
//                       className="btn btn-sm w-100 text-start px-3 py-2 border-0"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onCloneToCourse(section);
//                         onToggle(null);
//                       }}
//                     >
//                       Clone to another course
//                     </button>
//                   </td>
//                 </tr>
                
//                 <tr>
//                   <td className="p-0">
//                     <button
//                       className="btn btn-sm w-100 text-start px-3 py-2 border-0 text-danger"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onDelete(section.id);
//                         onToggle(null);
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Add Item Component
// const AddItemButton = ({ onClick, level = 0 }) => {
//   const paddingLeft = level * 40; // 40px per level for indentation
  
//   return (
//     <div className="p-3" style={{ marginLeft: `${paddingLeft + 16}px` }}>
//       <button
//         className="btn btn-sm border-0 text-primary p-0 d-flex align-items-center gap-1"
//         onClick={onClick}
//       >
//         <FaPlus className="fs-6" />
//         Add in this section
//       </button>
//     </div>
//   );
// };

// // Clone Section to Course Modal Component
// const CloneSectionToCourseModal = ({ 
//   show, 
//   onClose, 
//   onClone, 
//   currentCourseName, 
//   availableCourses = [],
//   sectionToClone 
// }) => {
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [sectionName, setSectionName] = useState('');
//   const [validationError, setValidationError] = useState('');

//   useEffect(() => {
//     if (show && sectionToClone) {
//       setSelectedCourse('');
//       setSectionName(`${sectionToClone.name} (Copy)`);
//       setValidationError('');
//     }
//   }, [show, sectionToClone]);

//   const handleClone = () => {
//     if (!selectedCourse) {
//       setValidationError('Please select a target course');
//       return;
//     }

//     if (!sectionName.trim()) {
//       setValidationError('Please enter a section name');
//       return;
//     }

//     onClone(selectedCourse, sectionName, sectionToClone);
//   };

//   const handleCancel = () => {
//     setSelectedCourse('');
//     setSectionName('');
//     setValidationError('');
//     onClose();
//   };

//   if (!show) return null;

//   return (
//     <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Clone Section to Another Course</h5>
//             <button 
//               type="button" 
//               className="btn-close" 
//               onClick={handleCancel}
//             ></button>
//           </div>
//           <div className="modal-body">
//             <div className="alert alert-info">
//               <small>
//                 <strong>Source Course:</strong> {currentCourseName}
//                 <br />
//                 <strong>Section to Clone:</strong> {sectionToClone?.name}
//                 <br />
//                 <strong>Items in section:</strong> {sectionToClone?.items?.length || 0} items
//               </small>
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-semibold">Select Target Course *</label>
//               <select
//                 className={`form-select ${validationError && !selectedCourse ? 'is-invalid' : ''}`}
//                 value={selectedCourse}
//                 onChange={(e) => {
//                   setSelectedCourse(e.target.value);
//                   if (validationError) setValidationError('');
//                 }}
//               >
//                 <option value="">Choose a target course</option>
//                 {availableCourses
//                   .filter(course => course.courseName !== currentCourseName)
//                   .map(course => (
//                     <option key={course.courseId} value={course.courseName}>
//                       {course.courseName}
//                     </option>
//                   ))
//                 }
//               </select>
//               {validationError && !selectedCourse && (
//                 <div className="invalid-feedback">{validationError}</div>
//               )}
//               <div className="form-text">
//                 Select the course where you want to clone this section
//               </div>
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-semibold">Section Name for Target Course *</label>
//               <input
//                 type="text"
//                 className={`form-control ${validationError && !sectionName.trim() ? 'is-invalid' : ''}`}
//                 value={sectionName}
//                 onChange={(e) => {
//                   setSectionName(e.target.value);
//                   if (validationError) setValidationError('');
//                 }}
//                 placeholder="Enter section name for the target course"
//               />
//               {validationError && !sectionName.trim() && (
//                 <div className="invalid-feedback">{validationError}</div>
//               )}
//               <div className="form-text">
//                 This will be the name of the section in the target course
//               </div>
//             </div>

//             {validationError && (
//               <div className="alert alert-warning py-2">
//                 <small>{validationError}</small>
//               </div>
//             )}

//             <div className="alert alert-warning">
//               <small>
//                 <strong>Note:</strong> Only the selected section "<strong>{sectionToClone?.name}</strong>" 
//                 with its {sectionToClone?.items?.length || 0} items will be cloned to the target course. 
//                 Other sections will not be affected.
//               </small>
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button
//               type="button"
//               className="btn btn-outline-secondary"
//               onClick={handleCancel}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={handleClone}
//             >
//               Clone Section
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Recursive Section Component to handle nested sections
// const RecursiveSection = ({
//   section,
//   index,
//   moveSection,
//   moveItem,
//   publishedItems,
//   openMenuId,
//   openSectionMenuId,
//   togglePublish,
//   toggleMenu,
//   toggleSectionMenu,
//   handleEdit,
//   handleDelete,
//   startEditingSection,
//   handleDeleteSection,
//   handleOpenCloneToCourseModal,
//   addItemToSection,
//   level = 0,
//   parentId = null,
//   sections,
//   setSections,
//   addSubSection
// }) => {
//   const [isExpanded, setIsExpanded] = useState(true);

//   const handleToggleExpand = () => {
//     setIsExpanded(!isExpanded);
//   };

//   // Calculate indentation for visual hierarchy
//   const paddingLeft = level * 40;

//   // Helper function to find a section by ID
//   const findSectionById = (id, sectionsArray) => {
//     for (const section of sectionsArray) {
//       if (section.id === id) return section;
//       if (section.subSections && section.subSections.length > 0) {
//         const found = findSectionById(id, section.subSections);
//         if (found) return found;
//       }
//     }
//     return null;
//   };

//   // Handle adding a sub-section
//   const handleAddSubSection = (parentId) => {
//     const newSubSection = {
//       id: Date.now() + Math.random(),
//       name: 'Sub-section',
//       duration: '',
//       level: 'Beginner',
//       tags: '',
//       description: '',
//       items: [],
//       subSections: [],
//       parentId: parentId,
//       isExpanded: true
//     };

//     const addSubSectionRecursive = (sectionsArray) => {
//       return sectionsArray.map(section => {
//         if (section.id === parentId) {
//           return {
//             ...section,
//             subSections: [...(section.subSections || []), newSubSection]
//           };
//         }
//         if (section.subSections && section.subSections.length > 0) {
//           return {
//             ...section,
//             subSections: addSubSectionRecursive(section.subSections)
//           };
//         }
//         return section;
//       });
//     };

//     setSections(addSubSectionRecursive(sections));
//   };

//   return (
//     <DraggableSection
//       key={section.id}
//       section={section}
//       index={index}
//       moveSection={moveSection}
//       level={level}
//       parentId={parentId}
//     >
//       <div className="mb-4">
//         {/* Section Header */}
//         <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded-top">
//           <div className="d-flex align-items-center gap-3 flex-grow-1">
//             <div className="d-flex align-items-center gap-2">
//               <FaGripVertical className="text-muted fs-6 cursor-grab" style={{ cursor: 'grab' }} />
//               <button
//                 className="btn btn-sm border-0 p-0"
//                 onClick={handleToggleExpand}
//               >
//                 {isExpanded ? 
//                   <FaChevronDown className="text-muted" /> : 
//                   <FaChevronRight className="text-muted" />
//                 }
//               </button>
//             </div>
            
//             <div className="flex-grow-1">
//               {/* Section Name with level indicator */}
//               <h5 className="mb-1 fw-bold">                
//                 {section.name}
//               </h5>
              
//               {/* Section Metadata */}
//               <div className="d-flex flex-wrap gap-3 align-items-center text-muted small">
//                 {section.duration && (
//                   <span className="d-flex align-items-center gap-1">
//                     <strong>Duration:</strong> {section.duration}
//                   </span>
//                 )}
//                 {section.level && section.level !== 'Beginner' && (
//                   <span className="d-flex align-items-center gap-1">
//                     <strong>Level:</strong> {section.level}
//                   </span>
//                 )}
//                 {section.tags && (
//                   <span className="d-flex align-items-center gap-1">
//                     <strong>Tags:</strong> {section.tags}
//                   </span>
//                 )}
//                 {section.description && (
//                   <span className="d-flex align-items-center gap-1">
//                     <strong>Description:</strong> {section.description}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Section Menu with Three Dots */}
//           <SectionMenu
//             section={section}
//             onEdit={startEditingSection}
//             onDelete={handleDeleteSection}
//             onCloneToCourse={handleOpenCloneToCourseModal}
//             onAddSubSection={handleAddSubSection}
//             isOpen={openSectionMenuId === section.id}
//             onToggle={toggleSectionMenu}
//             level={level}
//           />
//         </div>

//         {/* Section Content (Items and Sub-sections) - Only show if expanded */}
//         {isExpanded && (
//           <div className="bg-white border border-top-0 rounded-bottom">
//             {/* Render items in this section */}
//             {section.items && section.items.map((item, itemIndex) => {
//               const isPublished = publishedItems.has(item.id);

//               return (
//                 <DraggableCourseItem
//                   key={item.id}
//                   item={item}
//                   sectionId={section.id}
//                   index={itemIndex}
//                   moveItem={moveItem}
//                   isPublished={isPublished}
//                   onTogglePublish={togglePublish}
//                   onToggleMenu={toggleMenu}
//                   onEdit={handleEdit}
//                   onDelete={handleDelete}
//                   openMenuId={openMenuId}
//                   level={level}
//                 />
//               );
//             })}

//             {/* Render nested sub-sections */}
//             {section.subSections && section.subSections.map((subSection, subIndex) => (
//               <RecursiveSection
//                 key={subSection.id}
//                 section={subSection}
//                 index={subIndex}
//                 moveSection={moveSection}
//                 moveItem={moveItem}
//                 publishedItems={publishedItems}
//                 openMenuId={openMenuId}
//                 openSectionMenuId={openSectionMenuId}
//                 togglePublish={togglePublish}
//                 toggleMenu={toggleMenu}
//                 toggleSectionMenu={toggleSectionMenu}
//                 handleEdit={handleEdit}
//                 handleDelete={handleDelete}
//                 startEditingSection={startEditingSection}
//                 handleDeleteSection={handleDeleteSection}
//                 handleOpenCloneToCourseModal={handleOpenCloneToCourseModal}
//                 addItemToSection={addItemToSection}
//                 level={level + 1}
//                 parentId={section.id}
//                 sections={sections}
//                 setSections={setSections}
//                 addSubSection={handleAddSubSection}
//               />
//             ))}

//             {/* Add Item Button */}
//             <AddItemButton 
//               onClick={() => addItemToSection(section.id)} 
//               level={level}
//             />
//           </div>
//         )}
//       </div>
//     </DraggableSection>
//   );
// };

// const Syllabus = () => {
//   const { courseName } = useParams();
//   const navigate = useNavigate();
//   const [showModal, setShowModal] = useState(false);
//   const [sections, setSections] = useState([]);
//   const [publishedItems, setPublishedItems] = useState(new Set());
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [openSectionMenuId, setOpenSectionMenuId] = useState(null);
//   const [currentView, setCurrentView] = useState('syllabus');
//   const [editingItem, setEditingItem] = useState(null);
//   const [showContentTypeModal, setShowContentTypeModal] = useState(false);
//   const [selectedSectionId, setSelectedSectionId] = useState(null);
//   const [editingSectionData, setEditingSectionData] = useState(null);
//   const [showCloneSectionModal, setShowCloneSectionModal] = useState(false);
//   const [sectionToClone, setSectionToClone] = useState(null);
//   const [availableCourses, setAvailableCourses] = useState([]);

//   // New section form state
//   const [newSectionData, setNewSectionData] = useState({
//     name: '',
//     duration: '',
//     level: 'Beginner',
//     tags: '',
//     description: ''
//   });

//   // Decode course name from URL
//   const decodedCourseName = courseName ? decodeURIComponent(courseName) : 'Untitled Course';

//   // localStorage key for this course
//   const storageKey = `syllabus_${decodedCourseName}`;

//   // Load data from localStorage when component mounts or courseName changes
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/api/courses/all");
//         const data = await res.json();
//         setAvailableCourses(data);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       }
//     };

//     fetchCourses();
//   }, []);

//   // Enhanced data loading with better error handling
//   useEffect(() => {
//     const loadSyllabusData = () => {
//       try {
//         const savedData = localStorage.getItem(storageKey);
//         if (savedData) {
//           const parsedData = JSON.parse(savedData);
//           console.log('Loaded syllabus data:', parsedData);
          
//           // Ensure we have valid arrays
//           setSections(Array.isArray(parsedData.sections) ? parsedData.sections : []);
//           setPublishedItems(new Set(Array.isArray(parsedData.publishedItems) ? parsedData.publishedItems : []));
//         } else {
//           // Initialize with empty arrays if no data exists
//           setSections([]);
//           setPublishedItems(new Set());
//           console.log('No existing data found, initializing empty syllabus');
//         }
//       } catch (error) {
//         console.error('Error loading saved syllabus data:', error);
//         // Reset to empty state on error
//         setSections([]);
//         setPublishedItems(new Set());
//       }
//     };

//     loadSyllabusData();
//   }, [storageKey, courseName]);

//   // Enhanced data saving with better error handling
//   useEffect(() => {
//     const saveSyllabusData = () => {
//       try {
//         const syllabusData = {
//           sections: Array.isArray(sections) ? sections : [],
//           publishedItems: Array.from(publishedItems),
//           lastUpdated: new Date().toISOString(),
//           courseName: decodedCourseName
//         };
        
//         localStorage.setItem(storageKey, JSON.stringify(syllabusData));
//         console.log('Saved syllabus data:', syllabusData);
//       } catch (error) {
//         console.error('Error saving syllabus data:', error);
//       }
//     };

//     // Only save if we have valid data
//     if (Array.isArray(sections)) {
//       saveSyllabusData();
//     }
//   }, [sections, publishedItems, storageKey, decodedCourseName]);

//   const handleBackToCourses = () => {
//     navigate('/admin-dashboard/courses', { replace: true });
//   };

//   // Move section function for drag and drop
//   const moveSection = (fromIndex, toIndex, fromParentId, toParentId) => {
//     setSections(prevSections => {
//       // This is a simplified version - you might need to implement
//       // more complex logic for nested section dragging
//       const updatedSections = [...prevSections];
//       const [movedSection] = updatedSections.splice(fromIndex, 1);
//       updatedSections.splice(toIndex, 0, movedSection);
//       return updatedSections;
//     });
//   };

//   // Move item within section function for drag and drop
//   const moveItem = (fromIndex, toIndex, sectionId) => {
//     const updateItemsInSection = (sectionsArray, targetSectionId) => {
//       return sectionsArray.map(section => {
//         if (section.id === targetSectionId) {
//           const updatedItems = [...section.items];
//           const [movedItem] = updatedItems.splice(fromIndex, 1);
//           updatedItems.splice(toIndex, 0, movedItem);
//           return { ...section, items: updatedItems };
//         }
        
//         if (section.subSections && section.subSections.length > 0) {
//           return {
//             ...section,
//             subSections: updateItemsInSection(section.subSections, targetSectionId)
//           };
//         }
        
//         return section;
//       });
//     };

//     setSections(prevSections => updateItemsInSection(prevSections, sectionId));
//   };

//   const handleSubmit = () => {
//     if (newSectionData.name.trim()) {
//       const newSection = {
//         id: Date.now(),
//         name: newSectionData.name,
//         duration: newSectionData.duration,
//         level: newSectionData.level,
//         tags: newSectionData.tags,
//         description: newSectionData.description,
//         items: [],
//         subSections: [],
//         isExpanded: true
//       };
      
//       setSections(prev => {
//         const updatedSections = [...prev, newSection];
//         console.log('Added new section:', newSection, 'Total sections:', updatedSections.length);
//         return updatedSections;
//       });
      
//       setNewSectionData({
//         name: '',
//         duration: '',
//         level: 'Beginner',
//         tags: '',
//         description: ''
//       });
//       setShowModal(false);
//     }
//   };

//   const addItemToSection = (sectionId) => {
//     setSelectedSectionId(sectionId);
//     setShowContentTypeModal(true);
//   };

//   const handleContentTypeSelect = (type) => {
//     if (selectedSectionId) {
//       const addItemToSectionRecursive = (sectionsArray, targetSectionId) => {
//         return sectionsArray.map(section => {
//           if (section.id === targetSectionId) {
//             return {
//               ...section,
//               items: [
//                 ...section.items,
//                 {
//                   id: Date.now(),
//                   type: type,
//                   title: `Untitled ${type.toLowerCase()}`
//                 }
//               ]
//             };
//           }
          
//           if (section.subSections && section.subSections.length > 0) {
//             return {
//               ...section,
//               subSections: addItemToSectionRecursive(section.subSections, targetSectionId)
//             };
//           }
          
//           return section;
//         });
//       };

//       setSections(prevSections => addItemToSectionRecursive(prevSections, selectedSectionId));
//     }
//     setSelectedSectionId(null);
//   };

//   const togglePublish = (itemId) => {
//     setPublishedItems(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(itemId)) {
//         newSet.delete(itemId);
//       } else {
//         newSet.add(itemId);
//       }
//       return newSet;
//     });
//   };

//   const toggleMenu = (itemId) => {
//     setOpenMenuId(openMenuId === itemId ? null : itemId);
//   };

//   const toggleSectionMenu = (sectionId) => {
//     setOpenSectionMenuId(openSectionMenuId === sectionId ? null : sectionId);
//   };

//   const handleDelete = (itemId, sectionId) => {
//     if (window.confirm('Are you sure you want to delete this item?')) {
//       const deleteItemFromSection = (sectionsArray, targetSectionId) => {
//         return sectionsArray.map(section => {
//           if (section.id === targetSectionId) {
//             const filteredItems = section.items.filter(item => item.id !== itemId);
//             return { ...section, items: filteredItems };
//           }
          
//           if (section.subSections && section.subSections.length > 0) {
//             return {
//               ...section,
//               subSections: deleteItemFromSection(section.subSections, targetSectionId)
//             };
//           }
          
//           return section;
//         });
//       };

//       setSections(prevSections => deleteItemFromSection(prevSections, sectionId));
//       setOpenMenuId(null);
//     }
//   };

//   const handleDeleteSection = (sectionId) => {
//     if (window.confirm('Are you sure you want to delete this section? This will also delete all items and sub-sections within it.')) {
//       const deleteSectionRecursive = (sectionsArray) => {
//         return sectionsArray.filter(section => {
//           if (section.id === sectionId) return false;
          
//           if (section.subSections && section.subSections.length > 0) {
//             section.subSections = deleteSectionRecursive(section.subSections);
//           }
          
//           return true;
//         });
//       };

//       setSections(prevSections => deleteSectionRecursive(prevSections));
//       setOpenSectionMenuId(null);
//     }
//   };

//   const handleEdit = (item, sectionId) => {
//     setEditingItem({ ...item, sectionId });
//     setCurrentView('edit');
//     setOpenMenuId(null);
//   };

//   const handleSaveArticle = (updatedItem) => {
//     const updateItemInSection = (sectionsArray, targetSectionId) => {
//       return sectionsArray.map(section => {
//         if (section.id === targetSectionId) {
//           return {
//             ...section,
//             items: section.items.map(item =>
//               item.id === updatedItem.id ? updatedItem : item
//             )
//           };
//         }
        
//         if (section.subSections && section.subSections.length > 0) {
//           return {
//             ...section,
//             subSections: updateItemInSection(section.subSections, targetSectionId)
//           };
//         }
        
//         return section;
//       });
//     };

//     setSections(prevSections => updateItemInSection(prevSections, updatedItem.sectionId));
//     setCurrentView('syllabus');
//     setEditingItem(null);
//   };

//   const handleGoBack = () => {
//     setCurrentView('syllabus');
//     setEditingItem(null);
//   };

//   // Start editing section metadata
//   const startEditingSection = (section) => {
//     setEditingSectionData(section);
//     setOpenSectionMenuId(null);
//   };

//   // Save edited section metadata
//   const saveSectionMetadata = () => {
//     if (editingSectionData && editingSectionData.name.trim()) {
//       const updateSectionRecursive = (sectionsArray) => {
//         return sectionsArray.map(section => {
//           if (section.id === editingSectionData.id) {
//             return { ...editingSectionData };
//           }
          
//           if (section.subSections && section.subSections.length > 0) {
//             return {
//               ...section,
//               subSections: updateSectionRecursive(section.subSections)
//             };
//           }
          
//           return section;
//         });
//       };

//       setSections(prevSections => updateSectionRecursive(prevSections));
//       setEditingSectionData(null);
//     }
//   };

//   // Cancel editing section metadata
//   const cancelEditingSection = () => {
//     setEditingSectionData(null);
//   };

//   // Handle section metadata change
//   const handleSectionMetadataChange = (field, value) => {
//     setEditingSectionData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Handle new section data change
//   const handleNewSectionDataChange = (field, value) => {
//     setNewSectionData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Cancel adding new section
//   const cancelAddSection = () => {
//     setShowModal(false);
//     setNewSectionData({
//       name: '',
//       duration: '',
//       level: 'Beginner',
//       tags: '',
//       description: ''
//     });
//   };

//   // Open clone section to another course modal
//   const handleOpenCloneToCourseModal = (section) => {
//     setSectionToClone(section);
//     setShowCloneSectionModal(true);
//     setOpenSectionMenuId(null);
//   };

//   // Clone SPECIFIC section to another course
//   const handleCloneSectionToCourse = async (targetCourse, sectionName, section) => {
//     try {
//       console.log("Cloning SPECIFIC section to:", targetCourse, "Section:", section.name);
      
//       // Create storage key for target course
//       const targetStorageKey = `syllabus_${targetCourse}`;
      
//       // Get existing target course data or initialize empty
//       const existingTargetData = localStorage.getItem(targetStorageKey);
//       let targetSyllabus = {
//         sections: [],
//         publishedItems: [],
//         lastUpdated: new Date().toISOString(),
//         courseName: targetCourse
//       };
      
//       if (existingTargetData) {
//         try {
//           targetSyllabus = JSON.parse(existingTargetData);
//           // Ensure sections is an array
//           if (!Array.isArray(targetSyllabus.sections)) {
//             targetSyllabus.sections = [];
//           }
//         } catch (error) {
//           console.error('Error parsing target course data, initializing fresh:', error);
//         }
//       }
      
//       // Create cloned section with new IDs - ONLY THE SPECIFIC SECTION
//       const cloneSectionWithNewIds = (originalSection) => {
//         return {
//           ...originalSection,
//           id: Date.now() + Math.random(),
//           name: sectionName,
//           items: originalSection.items.map(item => ({
//             ...item,
//             id: Date.now() + Math.random()
//           })),
//           subSections: originalSection.subSections ? 
//             originalSection.subSections.map(sub => cloneSectionWithNewIds(sub)) : 
//             []
//         };
//       };
      
//       const clonedSection = cloneSectionWithNewIds(section);
      
//       // Add ONLY the specific cloned section to target course
//       targetSyllabus.sections.push(clonedSection);
      
//       // Save to target course's localStorage
//       localStorage.setItem(targetStorageKey, JSON.stringify(targetSyllabus));
      
//       console.log('✅ Successfully cloned SPECIFIC section to target course:', {
//         targetCourse,
//         sectionName,
//         originalSection: section.name,
//         itemsCloned: section.items.length
//       });
      
//       // Show success message and close modal
//       alert(`✅ Section "${section.name}" successfully cloned to course "${targetCourse}"!\n\nCloned ${section.items.length} items.`);
//       setShowCloneSectionModal(false);
//       setSectionToClone(null);
      
//     } catch (error) {
//       console.error("❌ Error cloning section:", error);
//       alert("❌ Failed to clone section. Please try again.");
//     }
//   };

//   // Clear syllabus data for current course (useful for testing)
//   const handleClearData = () => {
//     if (window.confirm('Are you sure you want to clear all syllabus data for this course? This action cannot be undone.')) {
//       localStorage.removeItem(storageKey);
//       setSections([]);
//       setPublishedItems(new Set());
//       alert('Syllabus data cleared successfully!');
//     }
//   };

//   // Helper function to flatten sections for display
//   const flattenSections = (sectionsArray, level = 0) => {
//     let result = [];
    
//     sectionsArray.forEach(section => {
//       result.push({ ...section, level });
      
//       if (section.subSections && section.subSections.length > 0) {
//         result = [...result, ...flattenSections(section.subSections, level + 1)];
//       }
//     });
    
//     return result;
//   };

//   // Render the appropriate view
//   if (currentView === 'edit' && editingItem) {
//     return (
//       <EditArticle
//         item={editingItem}
//         onSave={handleSaveArticle}
//         onGoBack={handleGoBack}
//       />
//     );
//   }

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="container-fluid bg-light min-vh-100 p-4">
//         <div className="container">
//           {/* Header with Back Button and Course Name */}
//           <div className="mb-4">
//             <button 
//               className="btn btn-outline-secondary btn-sm mb-3"
//               onClick={handleBackToCourses}
//             >
//               ← Back to Courses
//             </button>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h1 className="h2 fw-bold text-dark">Manage your syllabus</h1>
//                 <p className="text-muted mb-0">
//                   Program your recorded schedule. Add live events, coding labs, video lessons, and more
//                 </p>
//               </div>
//               <div className="d-flex gap-2">
//                 <button 
//                   className="btn btn-outline-primary btn-sm"
//                   onClick={handleClearData}
//                 >
//                   Clear Data
//                 </button>
//                 <button 
//                   className="btn btn-primary btn-sm"
//                   onClick={() => setShowModal(true)}
//                 >
//                   + Add Section
//                 </button>
//               </div>
//             </div>
//             {courseName && (
//               <div className="mt-2 p-3 bg-white rounded border">
//                 <h3 className="h5 fw-bold text-primary mb-1">Current Course: {decodedCourseName}</h3>
                
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="d-flex justify-content-between mb-5">
//             <div className="d-flex gap-2">
//               <button className="btn btn-outline-secondary">
//                 Bulk import items from CSV
//               </button>
//               <button className="btn btn-outline-secondary">
//                 Preview your course as student
//               </button>
//             </div>
//           </div>

//           {/* Sections */}
//           {sections.length > 0 ? (
//             <div className="sections-container">
//               {sections.map((section, index) => (
//                 <RecursiveSection
//                   key={section.id}
//                   section={section}
//                   index={index}
//                   moveSection={moveSection}
//                   moveItem={moveItem}
//                   publishedItems={publishedItems}
//                   openMenuId={openMenuId}
//                   openSectionMenuId={openSectionMenuId}
//                   togglePublish={togglePublish}
//                   toggleMenu={toggleMenu}
//                   toggleSectionMenu={toggleSectionMenu}
//                   handleEdit={handleEdit}
//                   handleDelete={handleDelete}
//                   startEditingSection={startEditingSection}
//                   handleDeleteSection={handleDeleteSection}
//                   handleOpenCloneToCourseModal={handleOpenCloneToCourseModal}
//                   addItemToSection={addItemToSection}
//                   level={0}
//                   parentId={null}
//                   sections={sections}
//                   setSections={setSections}
//                 />
//               ))}

//               {/* Add New Section Button */}
//               <div className="text-center mt-4">
//                 <div
//                   className="bg-white border border-dashed rounded p-4"
//                   style={{ cursor: 'pointer' }}
//                   onClick={() => setShowModal(true)}
//                 >
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     className="text-muted mb-2"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="1"
//                       d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                     />
//                   </svg>
//                   <p className="text-muted mb-0 small">Add a new section here</p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             /* Empty State */
//             <div className="text-center py-5">
//               <div
//                 className="bg-white border border-dashed rounded p-5"
//                 style={{ cursor: 'pointer' }}
//                 onClick={() => setShowModal(true)}
//               >
//                 <svg
//                   width="48"
//                   height="48"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   className="text-muted mb-3"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1"
//                     d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                   />
//                 </svg>
//                 <p className="text-muted mb-0">Your course has nothing. Add a course item to start.</p>
//                 {courseName && (
//                   <p className="text-primary fw-semibold mt-2">Course: {decodedCourseName}</p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Modal for Adding New Section */}
//           {showModal && (
//             <div className="modal show d-block" tabIndex="-1">
//               <div className="modal-dialog modal-dialog-centered modal-lg">
//                 <div className="modal-content">
//                   <div className="modal-header">
//                     <h5 className="modal-title">Create New Section</h5>
//                     <button 
//                       type="button" 
//                       className="btn-close" 
//                       onClick={cancelAddSection}
//                     ></button>
//                   </div>
//                   <div className="modal-body">
//                     <div className="mb-4">
//                       <h6 className="fw-bold">Section Information</h6>
//                       <p className="text-muted small mb-3">
//                         Configure your section details and metadata
//                       </p>

//                       <div className="row g-3">
//                         <div className="col-12">
//                           <label className="form-label fw-semibold">Section Name *</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             value={newSectionData.name}
//                             onChange={(e) => handleNewSectionDataChange('name', e.target.value)}
//                             placeholder="Enter section name"
//                           />
//                         </div>
//                         <div className="col-md-6">
//                           <label className="form-label fw-semibold">Duration</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             value={newSectionData.duration}
//                             onChange={(e) => handleNewSectionDataChange('duration', e.target.value)}
//                             placeholder="e.g., 8 weeks"
//                           />
//                         </div>
//                         <div className="col-md-6">
//                           <label className="form-label fw-semibold">Level</label>
//                           <select
//                             className="form-select"
//                             value={newSectionData.level}
//                             onChange={(e) => handleNewSectionDataChange('level', e.target.value)}
//                           >
//                             <option value="Beginner">Beginner</option>
//                             <option value="Intermediate">Intermediate</option>
//                             <option value="Advanced">Advanced</option>
//                           </select>
//                         </div>
//                         <div className="col-12">
//                           <label className="form-label fw-semibold">Tags</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             value={newSectionData.tags}
//                             onChange={(e) => handleNewSectionDataChange('tags', e.target.value)}
//                             placeholder="Enter tags separated by commas"
//                           />
//                         </div>
//                         <div className="col-12">
//                           <label className="form-label fw-semibold">Description</label>
//                           <textarea
//                             className="form-control"
//                             rows="3"
//                             value={newSectionData.description}
//                             onChange={(e) => handleNewSectionDataChange('description', e.target.value)}
//                             placeholder="Enter section description"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="d-flex justify-content-end gap-2 mt-4">
//                       <button
//                         className="btn btn-outline-secondary"
//                         onClick={cancelAddSection}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         className="btn btn-primary"
//                         onClick={handleSubmit}
//                         disabled={!newSectionData.name.trim()}
//                       >
//                         Create Section
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Modal for Editing Section Metadata */}
//           {editingSectionData && (
//             <div className="modal show d-block" tabIndex="-1">
//               <div className="modal-dialog modal-dialog-centered modal-lg">
//                 <div className="modal-content">
//                   <div className="modal-header">
//                     <h5 className="modal-title">Edit Section Details</h5>
//                     <button 
//                       type="button" 
//                       className="btn-close" 
//                       onClick={cancelEditingSection}
//                     ></button>
//                   </div>
//                   <div className="modal-body">
//                     <div className="mb-4">
//                       <h6 className="fw-bold">Section Information</h6>
//                       <p className="text-muted small mb-3">
//                         Update your section details and metadata
//                       </p>

//                       <div className="row g-3">
//                         <div className="col-12">
//                           <label className="form-label fw-semibold">Section Name *</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             value={editingSectionData.name || ''}
//                             onChange={(e) => handleSectionMetadataChange('name', e.target.value)}
//                             placeholder="Enter section name"
//                           />
//                         </div>
//                         <div className="col-md-6">
//                           <label className="form-label fw-semibold">Duration</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             value={editingSectionData.duration || ''}
//                             onChange={(e) => handleSectionMetadataChange('duration', e.target.value)}
//                             placeholder="e.g., 8 weeks"
//                           />
//                         </div>
//                         <div className="col-md-6">
//                           <label className="form-label fw-semibold">Level</label>
//                           <select
//                             className="form-select"
//                             value={editingSectionData.level || 'Beginner'}
//                             onChange={(e) => handleSectionMetadataChange('level', e.target.value)}
//                           >
//                             <option value="Beginner">Beginner</option>
//                             <option value="Intermediate">Intermediate</option>
//                             <option value="Advanced">Advanced</option>
//                           </select>
//                         </div>
//                         <div className="col-12">
//                           <label className="form-label fw-semibold">Tags</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             value={editingSectionData.tags || ''}
//                             onChange={(e) => handleSectionMetadataChange('tags', e.target.value)}
//                             placeholder="Enter tags separated by commas"
//                           />
//                         </div>
//                         <div className="col-12">
//                           <label className="form-label fw-semibold">Description</label>
//                           <textarea
//                             className="form-control"
//                             rows="3"
//                             value={editingSectionData.description || ''}
//                             onChange={(e) => handleSectionMetadataChange('description', e.target.value)}
//                             placeholder="Enter section description"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="d-flex justify-content-end gap-2 mt-4">
//                       <button
//                         className="btn btn-outline-secondary"
//                         onClick={cancelEditingSection}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         className="btn btn-primary"
//                         onClick={saveSectionMetadata}
//                         disabled={!editingSectionData.name?.trim()}
//                       >
//                         Save Changes
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Content Type Selection Modal */}
//           <ContentTypeModal
//             show={showContentTypeModal}
//             onClose={() => setShowContentTypeModal(false)}
//             onSelectType={handleContentTypeSelect}
//           />

//           {/* Clone Section to Course Modal */}
//           <CloneSectionToCourseModal
//             show={showCloneSectionModal}
//             onClose={() => setShowCloneSectionModal(false)}
//             onClone={handleCloneSectionToCourse}
//             currentCourseName={decodedCourseName}
//             availableCourses={availableCourses}
//             sectionToClone={sectionToClone}
//           />

//           {/* Modal Backdrop for Modals */}
//           {(showModal || editingSectionData || showCloneSectionModal) && <div className="modal-backdrop show"></div>}
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default Syllabus;





import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiMoreVertical } from "react-icons/fi";
import { FaEyeSlash } from "react-icons/fa";
import { FaGripVertical } from "react-icons/fa6";
import { MdOutlineEditNote } from "react-icons/md";
import { RiFileListLine, RiFileListFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { 
  FaVideo, 
  FaCode, 
  FaQuestionCircle, 
  FaClock, 
  FaUpload, 
  FaBook, 
  FaCube, 
  FaExternalLinkAlt, 
  FaFolder,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

import ContentTypeModal from './ContentTypeModal';
import EditArticle from './EditArticle';

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
    
    case 'Chapter':
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
  children,
  level = 0,
  parentId = null
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SECTION,
    item: { id: section.id, index, level, parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.SECTION,
    hover: (draggedItem) => {
      if (draggedItem.id !== section.id) {
        moveSection(draggedItem.index, index, draggedItem.parentId, parentId);
        draggedItem.index = index;
        draggedItem.parentId = parentId;
      }
    },
  });

  const paddingLeft = level * 40; // 40px per level for indentation

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        marginLeft: `${paddingLeft}px`,
        marginTop: '10px'
      }}
      className="section-wrapper"
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
  openMenuId,
  level = 0
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

  const paddingLeft = level * 40; // 40px per level for indentation

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        marginLeft: `${paddingLeft}px`
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

          {/* Dropdown menu */}
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

// Section Menu Component
const SectionMenu = ({ 
  section, 
  onEdit, 
  onDelete, 
  onCloneToCourse,
  isOpen, 
  onToggle,
  onAddSubSection,
  level = 0
}) => {
  return (
    <div className="position-relative">
      <button
        className="btn btn-sm btn-outline-secondary border-0"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(section.id);
        }}
      >
        <BsThreeDotsVertical className="text-muted fs-5" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="card position-absolute shadow-sm border-0" style={{ right: 0, top: '100%', zIndex: 1000, minWidth: '180px' }}>
          <div className="card-body p-0">
            <table className="table table-borderless mb-0">
              <tbody>
                <tr>
                  <td className="p-0 border-bottom">
                    <button
                      className="btn btn-sm w-100 text-start px-3 py-2 border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(section);
                        onToggle(null);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>

                {/* Only show Add Sub-section for levels 0-3 (max 5 levels total) */}
                {level < 4 && (
                  <tr>
                    <td className="p-0 border-bottom">
                      <button
                        className="btn btn-sm w-100 text-start px-3 py-2 border-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddSubSection(section.id);
                          onToggle(null);
                        }}
                      >
                        Add Sub-section
                      </button>
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="p-0 border-bottom">
                    <button
                      className="btn btn-sm w-100 text-start px-3 py-2 border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloneToCourse(section);
                        onToggle(null);
                      }}
                    >
                      Clone to another course
                    </button>
                  </td>
                </tr>
                
                <tr>
                  <td className="p-0">
                    <button
                      className="btn btn-sm w-100 text-start px-3 py-2 border-0 text-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(section.id);
                        onToggle(null);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Item Component (UPDATED with less padding)
const AddItemButton = ({ onClick, level = 0 }) => {
  const paddingLeft = level * 40; // 40px per level for indentation
  
  return (
    <div 
      className="p-2"  // Changed from p-3 to p-2 for less vertical padding
      style={{ 
        marginLeft: `${paddingLeft + 16}px`,
        marginTop: '4px',  // Add small top margin
        marginBottom: '8px' // Add bottom margin
      }}
    >
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

// Clone Section to Course Modal Component
const CloneSectionToCourseModal = ({ 
  show, 
  onClose, 
  onClone, 
  currentCourseName, 
  availableCourses = [],
  sectionToClone 
}) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (show && sectionToClone) {
      setSelectedCourse('');
      setSectionName(`${sectionToClone.name} (Copy)`);
      setValidationError('');
    }
  }, [show, sectionToClone]);

  const handleClone = () => {
    if (!selectedCourse) {
      setValidationError('Please select a target course');
      return;
    }

    if (!sectionName.trim()) {
      setValidationError('Please enter a section name');
      return;
    }

    onClone(selectedCourse, sectionName, sectionToClone);
  };

  const handleCancel = () => {
    setSelectedCourse('');
    setSectionName('');
    setValidationError('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Clone Section to Another Course</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleCancel}
            ></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-info">
              <small>
                <strong>Source Course:</strong> {currentCourseName}
                <br />
                <strong>Section to Clone:</strong> {sectionToClone?.name}
                <br />
                <strong>Items in section:</strong> {sectionToClone?.items?.length || 0} items
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Select Target Course *</label>
              <select
                className={`form-select ${validationError && !selectedCourse ? 'is-invalid' : ''}`}
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  if (validationError) setValidationError('');
                }}
              >
                <option value="">Choose a target course</option>
                {availableCourses
                  .filter(course => course.courseName !== currentCourseName)
                  .map(course => (
                    <option key={course.courseId} value={course.courseName}>
                      {course.courseName}
                    </option>
                  ))
                }
              </select>
              {validationError && !selectedCourse && (
                <div className="invalid-feedback">{validationError}</div>
              )}
              <div className="form-text">
                Select the course where you want to clone this section
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Section Name for Target Course *</label>
              <input
                type="text"
                className={`form-control ${validationError && !sectionName.trim() ? 'is-invalid' : ''}`}
                value={sectionName}
                onChange={(e) => {
                  setSectionName(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="Enter section name for the target course"
              />
              {validationError && !sectionName.trim() && (
                <div className="invalid-feedback">{validationError}</div>
              )}
              <div className="form-text">
                This will be the name of the section in the target course
              </div>
            </div>

            {validationError && (
              <div className="alert alert-warning py-2">
                <small>{validationError}</small>
              </div>
            )}

            <div className="alert alert-warning">
              <small>
                <strong>Note:</strong> Only the selected section "<strong>{sectionToClone?.name}</strong>" 
                with its {sectionToClone?.items?.length || 0} items will be cloned to the target course. 
                Other sections will not be affected.
              </small>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClone}
            >
              Clone Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recursive Section Component to handle nested sections (UPDATED structure)
const RecursiveSection = ({
  section,
  index,
  moveSection,
  moveItem,
  publishedItems,
  openMenuId,
  openSectionMenuId,
  togglePublish,
  toggleMenu,
  toggleSectionMenu,
  handleEdit,
  handleDelete,
  startEditingSection,
  handleDeleteSection,
  handleOpenCloneToCourseModal,
  addItemToSection,
  level = 0,
  parentId = null,
  sections,
  setSections,
  addSubSection
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate indentation for visual hierarchy
  const paddingLeft = level * 40;

  // Helper function to find a section by ID
  const findSectionById = (id, sectionsArray) => {
    for (const section of sectionsArray) {
      if (section.id === id) return section;
      if (section.subSections && section.subSections.length > 0) {
        const found = findSectionById(id, section.subSections);
        if (found) return found;
      }
    }
    return null;
  };

  // Handle adding a sub-section
  const handleAddSubSection = (parentId) => {
    const newSubSection = {
      id: Date.now() + Math.random(),
      name: 'Sub-section',
      duration: '',
      level: 'Beginner',
      tags: '',
      description: '',
      items: [],
      subSections: [],
      parentId: parentId,
      isExpanded: true
    };

    const addSubSectionRecursive = (sectionsArray) => {
      return sectionsArray.map(section => {
        if (section.id === parentId) {
          return {
            ...section,
            subSections: [...(section.subSections || []), newSubSection]
          };
        }
        if (section.subSections && section.subSections.length > 0) {
          return {
            ...section,
            subSections: addSubSectionRecursive(section.subSections)
          };
        }
        return section;
      });
    };

    setSections(addSubSectionRecursive(sections));
  };

  return (
    <DraggableSection
      key={section.id}
      section={section}
      index={index}
      moveSection={moveSection}
      level={level}
      parentId={parentId}
    >
      <div className="mb-4">
        {/* Section Header */}
        <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded-top">
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <div className="d-flex align-items-center gap-2">
              <FaGripVertical className="text-muted fs-6 cursor-grab" style={{ cursor: 'grab' }} />
              <button
                className="btn btn-sm border-0 p-0"
                onClick={handleToggleExpand}
              >
                {isExpanded ? 
                  <FaChevronDown className="text-muted" /> : 
                  <FaChevronRight className="text-muted" />
                }
              </button>
            </div>
            
            <div className="flex-grow-1">
              {/* Section Name with level indicator */}
              <h5 className="mb-1 fw-bold">                
                {section.name}
              </h5>
              
              {/* Section Metadata */}
              <div className="d-flex flex-wrap gap-3 align-items-center text-muted small">
                {section.duration && (
                  <span className="d-flex align-items-center gap-1">
                    <strong>Duration:</strong> {section.duration}
                  </span>
                )}
                {section.level && section.level !== 'Beginner' && (
                  <span className="d-flex align-items-center gap-1">
                    <strong>Level:</strong> {section.level}
                  </span>
                )}
                {section.tags && (
                  <span className="d-flex align-items-center gap-1">
                    <strong>Tags:</strong> {section.tags}
                  </span>
                )}
                {section.description && (
                  <span className="d-flex align-items-center gap-1">
                    <strong>Description:</strong> {section.description}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section Menu with Three Dots */}
          <SectionMenu
            section={section}
            onEdit={startEditingSection}
            onDelete={handleDeleteSection}
            onCloneToCourse={handleOpenCloneToCourseModal}
            onAddSubSection={handleAddSubSection}
            isOpen={openSectionMenuId === section.id}
            onToggle={toggleSectionMenu}
            level={level}
          />
        </div>

        {/* Section Content (Items and Sub-sections) - Only show if expanded - UPDATED STRUCTURE */}
        {isExpanded && (
          <div className="bg-white border border-top-0 rounded-bottom">
            {/* Render items in this section */}
            {section.items && section.items.map((item, itemIndex) => {
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
                  level={level}
                />
              );
            })}

            {/* Combined Container for Add Button and Sub-sections */}
            <div className="p-0">
              {/* Add Item Button - now placed BEFORE sub-sections */}
              <AddItemButton 
                onClick={() => addItemToSection(section.id)} 
                level={level}
              />
              
              {/* Render nested sub-sections immediately after the Add button */}
              {section.subSections && section.subSections.map((subSection, subIndex) => (
                <RecursiveSection
                  key={subSection.id}
                  section={subSection}
                  index={subIndex}
                  moveSection={moveSection}
                  moveItem={moveItem}
                  publishedItems={publishedItems}
                  openMenuId={openMenuId}
                  openSectionMenuId={openSectionMenuId}
                  togglePublish={togglePublish}
                  toggleMenu={toggleMenu}
                  toggleSectionMenu={toggleSectionMenu}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  startEditingSection={startEditingSection}
                  handleDeleteSection={handleDeleteSection}
                  handleOpenCloneToCourseModal={handleOpenCloneToCourseModal}
                  addItemToSection={addItemToSection}
                  level={level + 1}
                  parentId={section.id}
                  sections={sections}
                  setSections={setSections}
                  addSubSection={handleAddSubSection}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DraggableSection>
  );
};

const Syllabus = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [sections, setSections] = useState([]);
  const [publishedItems, setPublishedItems] = useState(new Set());
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openSectionMenuId, setOpenSectionMenuId] = useState(null);
  const [currentView, setCurrentView] = useState('syllabus');
  const [editingItem, setEditingItem] = useState(null);
  const [showContentTypeModal, setShowContentTypeModal] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [editingSectionData, setEditingSectionData] = useState(null);
  const [showCloneSectionModal, setShowCloneSectionModal] = useState(false);
  const [sectionToClone, setSectionToClone] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);

  // New section form state
  const [newSectionData, setNewSectionData] = useState({
    name: '',
    duration: '',
    level: 'Beginner',
    tags: '',
    description: ''
  });

  // Decode course name from URL
  const decodedCourseName = courseName ? decodeURIComponent(courseName) : 'Untitled Course';

  // localStorage key for this course
  const storageKey = `syllabus_${decodedCourseName}`;

  // Load data from localStorage when component mounts or courseName changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/courses/all");
        const data = await res.json();
        setAvailableCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Enhanced data loading with better error handling
  useEffect(() => {
    const loadSyllabusData = () => {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('Loaded syllabus data:', parsedData);
          
          // Ensure we have valid arrays
          setSections(Array.isArray(parsedData.sections) ? parsedData.sections : []);
          setPublishedItems(new Set(Array.isArray(parsedData.publishedItems) ? parsedData.publishedItems : []));
        } else {
          // Initialize with empty arrays if no data exists
          setSections([]);
          setPublishedItems(new Set());
          console.log('No existing data found, initializing empty syllabus');
        }
      } catch (error) {
        console.error('Error loading saved syllabus data:', error);
        // Reset to empty state on error
        setSections([]);
        setPublishedItems(new Set());
      }
    };

    loadSyllabusData();
  }, [storageKey, courseName]);

  // Enhanced data saving with better error handling
  useEffect(() => {
    const saveSyllabusData = () => {
      try {
        const syllabusData = {
          sections: Array.isArray(sections) ? sections : [],
          publishedItems: Array.from(publishedItems),
          lastUpdated: new Date().toISOString(),
          courseName: decodedCourseName
        };
        
        localStorage.setItem(storageKey, JSON.stringify(syllabusData));
        console.log('Saved syllabus data:', syllabusData);
      } catch (error) {
        console.error('Error saving syllabus data:', error);
      }
    };

    // Only save if we have valid data
    if (Array.isArray(sections)) {
      saveSyllabusData();
    }
  }, [sections, publishedItems, storageKey, decodedCourseName]);

  const handleBackToCourses = () => {
    navigate('/admin-dashboard/courses', { replace: true });
  };

  // Move section function for drag and drop
  const moveSection = (fromIndex, toIndex, fromParentId, toParentId) => {
    setSections(prevSections => {
      // This is a simplified version - you might need to implement
      // more complex logic for nested section dragging
      const updatedSections = [...prevSections];
      const [movedSection] = updatedSections.splice(fromIndex, 1);
      updatedSections.splice(toIndex, 0, movedSection);
      return updatedSections;
    });
  };

  // Move item within section function for drag and drop
  const moveItem = (fromIndex, toIndex, sectionId) => {
    const updateItemsInSection = (sectionsArray, targetSectionId) => {
      return sectionsArray.map(section => {
        if (section.id === targetSectionId) {
          const updatedItems = [...section.items];
          const [movedItem] = updatedItems.splice(fromIndex, 1);
          updatedItems.splice(toIndex, 0, movedItem);
          return { ...section, items: updatedItems };
        }
        
        if (section.subSections && section.subSections.length > 0) {
          return {
            ...section,
            subSections: updateItemsInSection(section.subSections, targetSectionId)
          };
        }
        
        return section;
      });
    };

    setSections(prevSections => updateItemsInSection(prevSections, sectionId));
  };

  const handleSubmit = () => {
    if (newSectionData.name.trim()) {
      const newSection = {
        id: Date.now(),
        name: newSectionData.name,
        duration: newSectionData.duration,
        level: newSectionData.level,
        tags: newSectionData.tags,
        description: newSectionData.description,
        items: [],
        subSections: [],
        isExpanded: true
      };
      
      setSections(prev => {
        const updatedSections = [...prev, newSection];
        console.log('Added new section:', newSection, 'Total sections:', updatedSections.length);
        return updatedSections;
      });
      
      setNewSectionData({
        name: '',
        duration: '',
        level: 'Beginner',
        tags: '',
        description: ''
      });
      setShowModal(false);
    }
  };

  const addItemToSection = (sectionId) => {
    setSelectedSectionId(sectionId);
    setShowContentTypeModal(true);
  };

  const handleContentTypeSelect = (type) => {
    if (selectedSectionId) {
      const addItemToSectionRecursive = (sectionsArray, targetSectionId) => {
        return sectionsArray.map(section => {
          if (section.id === targetSectionId) {
            return {
              ...section,
              items: [
                ...section.items,
                {
                  id: Date.now(),
                  type: type,
                  title: `Untitled ${type.toLowerCase()}`
                }
              ]
            };
          }
          
          if (section.subSections && section.subSections.length > 0) {
            return {
              ...section,
              subSections: addItemToSectionRecursive(section.subSections, targetSectionId)
            };
          }
          
          return section;
        });
      };

      setSections(prevSections => addItemToSectionRecursive(prevSections, selectedSectionId));
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

  const toggleSectionMenu = (sectionId) => {
    setOpenSectionMenuId(openSectionMenuId === sectionId ? null : sectionId);
  };

  const handleDelete = (itemId, sectionId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const deleteItemFromSection = (sectionsArray, targetSectionId) => {
        return sectionsArray.map(section => {
          if (section.id === targetSectionId) {
            const filteredItems = section.items.filter(item => item.id !== itemId);
            return { ...section, items: filteredItems };
          }
          
          if (section.subSections && section.subSections.length > 0) {
            return {
              ...section,
              subSections: deleteItemFromSection(section.subSections, targetSectionId)
            };
          }
          
          return section;
        });
      };

      setSections(prevSections => deleteItemFromSection(prevSections, sectionId));
      setOpenMenuId(null);
    }
  };

  const handleDeleteSection = (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section? This will also delete all items and sub-sections within it.')) {
      const deleteSectionRecursive = (sectionsArray) => {
        return sectionsArray.filter(section => {
          if (section.id === sectionId) return false;
          
          if (section.subSections && section.subSections.length > 0) {
            section.subSections = deleteSectionRecursive(section.subSections);
          }
          
          return true;
        });
      };

      setSections(prevSections => deleteSectionRecursive(prevSections));
      setOpenSectionMenuId(null);
    }
  };

  const handleEdit = (item, sectionId) => {
    setEditingItem({ ...item, sectionId });
    setCurrentView('edit');
    setOpenMenuId(null);
  };

  const handleSaveArticle = (updatedItem) => {
    const updateItemInSection = (sectionsArray, targetSectionId) => {
      return sectionsArray.map(section => {
        if (section.id === targetSectionId) {
          return {
            ...section,
            items: section.items.map(item =>
              item.id === updatedItem.id ? updatedItem : item
            )
          };
        }
        
        if (section.subSections && section.subSections.length > 0) {
          return {
            ...section,
            subSections: updateItemInSection(section.subSections, targetSectionId)
          };
        }
        
        return section;
      });
    };

    setSections(prevSections => updateItemInSection(prevSections, updatedItem.sectionId));
    setCurrentView('syllabus');
    setEditingItem(null);
  };

  const handleGoBack = () => {
    setCurrentView('syllabus');
    setEditingItem(null);
  };

  // Start editing section metadata
  const startEditingSection = (section) => {
    setEditingSectionData(section);
    setOpenSectionMenuId(null);
  };

  // Save edited section metadata
  const saveSectionMetadata = () => {
    if (editingSectionData && editingSectionData.name.trim()) {
      const updateSectionRecursive = (sectionsArray) => {
        return sectionsArray.map(section => {
          if (section.id === editingSectionData.id) {
            return { ...editingSectionData };
          }
          
          if (section.subSections && section.subSections.length > 0) {
            return {
              ...section,
              subSections: updateSectionRecursive(section.subSections)
            };
          }
          
          return section;
        });
      };

      setSections(prevSections => updateSectionRecursive(prevSections));
      setEditingSectionData(null);
    }
  };

  // Cancel editing section metadata
  const cancelEditingSection = () => {
    setEditingSectionData(null);
  };

  // Handle section metadata change
  const handleSectionMetadataChange = (field, value) => {
    setEditingSectionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle new section data change
  const handleNewSectionDataChange = (field, value) => {
    setNewSectionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Cancel adding new section
  const cancelAddSection = () => {
    setShowModal(false);
    setNewSectionData({
      name: '',
      duration: '',
      level: 'Beginner',
      tags: '',
      description: ''
    });
  };

  // Open clone section to another course modal
  const handleOpenCloneToCourseModal = (section) => {
    setSectionToClone(section);
    setShowCloneSectionModal(true);
    setOpenSectionMenuId(null);
  };

  // Clone SPECIFIC section to another course
  const handleCloneSectionToCourse = async (targetCourse, sectionName, section) => {
    try {
      console.log("Cloning SPECIFIC section to:", targetCourse, "Section:", section.name);
      
      // Create storage key for target course
      const targetStorageKey = `syllabus_${targetCourse}`;
      
      // Get existing target course data or initialize empty
      const existingTargetData = localStorage.getItem(targetStorageKey);
      let targetSyllabus = {
        sections: [],
        publishedItems: [],
        lastUpdated: new Date().toISOString(),
        courseName: targetCourse
      };
      
      if (existingTargetData) {
        try {
          targetSyllabus = JSON.parse(existingTargetData);
          // Ensure sections is an array
          if (!Array.isArray(targetSyllabus.sections)) {
            targetSyllabus.sections = [];
          }
        } catch (error) {
          console.error('Error parsing target course data, initializing fresh:', error);
        }
      }
      
      // Create cloned section with new IDs - ONLY THE SPECIFIC SECTION
      const cloneSectionWithNewIds = (originalSection) => {
        return {
          ...originalSection,
          id: Date.now() + Math.random(),
          name: sectionName,
          items: originalSection.items.map(item => ({
            ...item,
            id: Date.now() + Math.random()
          })),
          subSections: originalSection.subSections ? 
            originalSection.subSections.map(sub => cloneSectionWithNewIds(sub)) : 
            []
        };
      };
      
      const clonedSection = cloneSectionWithNewIds(section);
      
      // Add ONLY the specific cloned section to target course
      targetSyllabus.sections.push(clonedSection);
      
      // Save to target course's localStorage
      localStorage.setItem(targetStorageKey, JSON.stringify(targetSyllabus));
      
      console.log('✅ Successfully cloned SPECIFIC section to target course:', {
        targetCourse,
        sectionName,
        originalSection: section.name,
        itemsCloned: section.items.length
      });
      
      // Show success message and close modal
      alert(`✅ Section "${section.name}" successfully cloned to course "${targetCourse}"!\n\nCloned ${section.items.length} items.`);
      setShowCloneSectionModal(false);
      setSectionToClone(null);
      
    } catch (error) {
      console.error("❌ Error cloning section:", error);
      alert("❌ Failed to clone section. Please try again.");
    }
  };

  // Clear syllabus data for current course (useful for testing)
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all syllabus data for this course? This action cannot be undone.')) {
      localStorage.removeItem(storageKey);
      setSections([]);
      setPublishedItems(new Set());
      alert('Syllabus data cleared successfully!');
    }
  };

  // Helper function to flatten sections for display
  const flattenSections = (sectionsArray, level = 0) => {
    let result = [];
    
    sectionsArray.forEach(section => {
      result.push({ ...section, level });
      
      if (section.subSections && section.subSections.length > 0) {
        result = [...result, ...flattenSections(section.subSections, level + 1)];
      }
    });
    
    return result;
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
          {/* Header with Back Button and Course Name */}
          <div className="mb-4">
            <button 
              className="btn btn-outline-secondary btn-sm mb-3"
              onClick={handleBackToCourses}
            >
              ← Back to Courses
            </button>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 fw-bold text-dark">Manage your syllabus</h1>
                <p className="text-muted mb-0">
                  Program your recorded schedule. Add live events, coding labs, video lessons, and more
                </p>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleClearData}
                >
                  Clear Data
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowModal(true)}
                >
                  + Add Section
                </button>
              </div>
            </div>
            {courseName && (
              <div className="mt-2 p-3 bg-white rounded border">
                <h3 className="h5 fw-bold text-primary mb-1">Current Course: {decodedCourseName}</h3>
                
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between mb-5">
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
                <RecursiveSection
                  key={section.id}
                  section={section}
                  index={index}
                  moveSection={moveSection}
                  moveItem={moveItem}
                  publishedItems={publishedItems}
                  openMenuId={openMenuId}
                  openSectionMenuId={openSectionMenuId}
                  togglePublish={togglePublish}
                  toggleMenu={toggleMenu}
                  toggleSectionMenu={toggleSectionMenu}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  startEditingSection={startEditingSection}
                  handleDeleteSection={handleDeleteSection}
                  handleOpenCloneToCourseModal={handleOpenCloneToCourseModal}
                  addItemToSection={addItemToSection}
                  level={0}
                  parentId={null}
                  sections={sections}
                  setSections={setSections}
                />
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
                {courseName && (
                  <p className="text-primary fw-semibold mt-2">Course: {decodedCourseName}</p>
                )}
              </div>
            </div>
          )}

          {/* Modal for Adding New Section */}
          {showModal && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Create New Section</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={cancelAddSection}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-4">
                      <h6 className="fw-bold">Section Information</h6>
                      <p className="text-muted small mb-3">
                        Configure your section details and metadata
                      </p>

                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold">Section Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newSectionData.name}
                            onChange={(e) => handleNewSectionDataChange('name', e.target.value)}
                            placeholder="Enter section name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Duration</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newSectionData.duration}
                            onChange={(e) => handleNewSectionDataChange('duration', e.target.value)}
                            placeholder="e.g., 8 weeks"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Level</label>
                          <select
                            className="form-select"
                            value={newSectionData.level}
                            onChange={(e) => handleNewSectionDataChange('level', e.target.value)}
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold">Tags</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newSectionData.tags}
                            onChange={(e) => handleNewSectionDataChange('tags', e.target.value)}
                            placeholder="Enter tags separated by commas"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold">Description</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={newSectionData.description}
                            onChange={(e) => handleNewSectionDataChange('description', e.target.value)}
                            placeholder="Enter section description"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={cancelAddSection}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={!newSectionData.name.trim()}
                      >
                        Create Section
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Editing Section Metadata */}
          {editingSectionData && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Section Details</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={cancelEditingSection}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-4">
                      <h6 className="fw-bold">Section Information</h6>
                      <p className="text-muted small mb-3">
                        Update your section details and metadata
                      </p>

                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold">Section Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingSectionData.name || ''}
                            onChange={(e) => handleSectionMetadataChange('name', e.target.value)}
                            placeholder="Enter section name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Duration</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingSectionData.duration || ''}
                            onChange={(e) => handleSectionMetadataChange('duration', e.target.value)}
                            placeholder="e.g., 8 weeks"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Level</label>
                          <select
                            className="form-select"
                            value={editingSectionData.level || 'Beginner'}
                            onChange={(e) => handleSectionMetadataChange('level', e.target.value)}
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold">Tags</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingSectionData.tags || ''}
                            onChange={(e) => handleSectionMetadataChange('tags', e.target.value)}
                            placeholder="Enter tags separated by commas"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold">Description</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={editingSectionData.description || ''}
                            onChange={(e) => handleSectionMetadataChange('description', e.target.value)}
                            placeholder="Enter section description"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={cancelEditingSection}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={saveSectionMetadata}
                        disabled={!editingSectionData.name?.trim()}
                      >
                        Save Changes
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

          {/* Clone Section to Course Modal */}
          <CloneSectionToCourseModal
            show={showCloneSectionModal}
            onClose={() => setShowCloneSectionModal(false)}
            onClone={handleCloneSectionToCourse}
            currentCourseName={decodedCourseName}
            availableCourses={availableCourses}
            sectionToClone={sectionToClone}
          />

          {/* Modal Backdrop for Modals */}
          {(showModal || editingSectionData || showCloneSectionModal) && <div className="modal-backdrop show"></div>}
        </div>
      </div>
    </DndProvider>
  );
};

export default Syllabus;

