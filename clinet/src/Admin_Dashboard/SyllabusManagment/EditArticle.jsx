// // // // // import React, { useState } from 'react';
// // // // // import { 
// // // // //   FaBold, FaItalic, FaUnderline, FaStrikethrough, FaCheck, 
// // // // //   FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, 
// // // // //   FaListOl, FaListUl, FaUndo, FaRedo, FaLink, FaImage, 
// // // // //   FaVideo, FaCode, FaTable, FaParagraph 
// // // // // } from 'react-icons/fa';

// // // // // const EditArticle = ({ item, onSave, onGoBack }) => {
// // // // //   const [articleTitle, setArticleTitle] = useState(item?.title || 'Untitled article');
// // // // //   const [articleContent, setArticleContent] = useState('');
// // // // //   const [selectedFormat, setSelectedFormat] = useState('paragraph');

// // // // //   const handleSave = () => {
// // // // //     const updatedItem = {
// // // // //       ...item,
// // // // //       title: articleTitle,
// // // // //       content: articleContent
// // // // //     };
// // // // //     onSave(updatedItem);
// // // // //   };

// // // // //   const handleFormatChange = (format) => {
// // // // //     setSelectedFormat(format);
// // // // //     // Add formatting logic here based on the selected format
// // // // //   };

// // // // //   const handleTextFormat = (format) => {
// // // // //     // Implement text formatting logic (bold, italic, etc.)
// // // // //     console.log(`Apply ${format} formatting`);
// // // // //   };

// // // // //   return (
// // // // //     <div className="container-fluid bg-light min-vh-100 p-0">
// // // // //       {/* Header */}
// // // // //       <div className="bg-white border-bottom p-3">
// // // // //         <div className="container">
// // // // //           <div className="d-flex justify-content-between align-items-center">
// // // // //             <div>
// // // // //               <h1 className="h4 fw-bold text-dark mb-1">Manage your syllabus</h1>
// // // // //               <p className="text-muted mb-0 small">
// // // // //                 Program your recorded schedule. Add live events, coding labs, video lessons, and more
// // // // //               </p>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Action Buttons */}
// // // // //       <div className="bg-white border-bottom p-3">
// // // // //         <div className="container">
// // // // //           <div className="d-flex justify-content-between align-items-center">
// // // // //             <button className="btn btn-outline-secondary btn-sm" onClick={onGoBack}>
// // // // //               ← Go back to all items
// // // // //             </button>
// // // // //             <button className="btn btn-primary btn-sm" onClick={handleSave}>
// // // // //               Save changes
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       <div className="container mt-4">
// // // // //         <div className="row justify-content-center">
// // // // //           <div className="col-lg-10">
// // // // //             {/* Title Section */}
// // // // //             <div className="mb-4">
// // // // //               <label className="form-label fw-bold text-muted small">TITLE</label>
// // // // //               <input
// // // // //                 type="text"
// // // // //                 className="form-control border-0 shadow-none fs-3 fw-bold"
// // // // //                 value={articleTitle}
// // // // //                 onChange={(e) => setArticleTitle(e.target.value)}
// // // // //                 placeholder="Untitled article"
// // // // //               />
// // // // //             </div>

// // // // //             {/* Paragraph Section */}
// // // // //             <div className="mb-3">
// // // // //               <label className="form-label fw-bold text-muted small">PARAGRAPH</label>
              
// // // // //               {/* Toolbar */}
// // // // //               <div className="bg-white border rounded-top p-2">
// // // // //                 <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // //                   {/* Format Selector */}
// // // // //                   <select 
// // // // //                     className="form-select form-select-sm" 
// // // // //                     style={{ width: '120px' }}
// // // // //                     value={selectedFormat}
// // // // //                     onChange={(e) => handleFormatChange(e.target.value)}
// // // // //                   >
// // // // //                     <option value="paragraph">Paragraph</option>
// // // // //                     <option value="heading1">Heading 1</option>
// // // // //                     <option value="heading2">Heading 2</option>
// // // // //                     <option value="heading3">Heading 3</option>
// // // // //                     <option value="code">Code</option>
// // // // //                     <option value="quote">Quote</option>
// // // // //                   </select>

// // // // //                   {/* Text Formatting */}
// // // // //                   <div className="d-flex align-items-center gap-1 border-end pe-2 me-2">
// // // // //                     <button 
// // // // //                       className="btn btn-sm btn-outline-secondary border-0"
// // // // //                       onClick={() => handleTextFormat('bold')}
// // // // //                       title="Bold"
// // // // //                     >
// // // // //                       <FaBold />
// // // // //                     </button>
// // // // //                     <button 
// // // // //                       className="btn btn-sm btn-outline-secondary border-0"
// // // // //                       onClick={() => handleTextFormat('italic')}
// // // // //                       title="Italic"
// // // // //                     >
// // // // //                       <FaItalic />
// // // // //                     </button>
// // // // //                     <button 
// // // // //                       className="btn btn-sm btn-outline-secondary border-0"
// // // // //                       onClick={() => handleTextFormat('underline')}
// // // // //                       title="Underline"
// // // // //                     >
// // // // //                       <FaUnderline />
// // // // //                     </button>
// // // // //                     <button 
// // // // //                       className="btn btn-sm btn-outline-secondary border-0"
// // // // //                       onClick={() => handleTextFormat('strikethrough')}
// // // // //                       title="Strikethrough"
// // // // //                     >
// // // // //                       <FaStrikethrough />
// // // // //                     </button>
// // // // //                   </div>

// // // // //                   {/* Text Alignment */}
// // // // //                   <div className="d-flex align-items-center gap-1 border-end pe-2 me-2">
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaAlignLeft />
// // // // //                     </button>
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaAlignCenter />
// // // // //                     </button>
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaAlignRight />
// // // // //                     </button>
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaAlignJustify />
// // // // //                     </button>
// // // // //                   </div>

// // // // //                   {/* Lists */}
// // // // //                   <div className="d-flex align-items-center gap-1 border-end pe-2 me-2">
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaListUl />
// // // // //                     </button>
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaListOl />
// // // // //                     </button>
// // // // //                   </div>

// // // // //                   {/* Undo/Redo */}
// // // // //                   <div className="d-flex align-items-center gap-1 border-end pe-2 me-2">
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaUndo />
// // // // //                     </button>
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaRedo />
// // // // //                     </button>
// // // // //                   </div>

// // // // //                   {/* Media */}
// // // // //                   <div className="d-flex align-items-center gap-1">
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaLink />
// // // // //                     </button>
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaImage />
// // // // //                     </button>
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaVideo />
// // // // //                     </button>
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaCode />
// // // // //                     </button>
// // // // //                     <button className="btn btn-sm btn-outline-secondary border-0">
// // // // //                       <FaTable />
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>

// // // // //               {/* Text Editor Area */}
// // // // //               <div className="border border-top-0 rounded-bottom p-4 bg-white">
// // // // //                 <textarea 
// // // // //                   className="form-control border-0 shadow-none" 
// // // // //                   rows="12"
// // // // //                   value={articleContent}
// // // // //                   onChange={(e) => setArticleContent(e.target.value)}
// // // // //                   placeholder="Type '/' for commands..."
// // // // //                   style={{ resize: 'none', minHeight: '300px', fontSize: '16px' }}
// // // // //                 ></textarea>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Quick Formatting Options */}
// // // // //             <div className="bg-light p-3 rounded">
// // // // //               <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // //                 <span className="text-muted small me-2">Quick formatting:</span>
// // // // //                 <button className="btn btn-sm btn-outline-secondary"># Heading 1</button>
// // // // //                 <button className="btn btn-sm btn-outline-secondary">## Heading 2</button>
// // // // //                 <button className="btn btn-sm btn-outline-secondary">### Heading 3</button>
// // // // //                 <button className="btn btn-sm btn-outline-secondary">Quote</button>
// // // // //                 <button className="btn btn-sm btn-outline-secondary">``` Code</button>
// // // // //                 <button className="btn btn-sm btn-outline-secondary">- List</button>
// // // // //                 <button className="btn btn-sm btn-outline-secondary">1. Numbered</button>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default EditArticle;


// // // //  import React, { useState, useRef, useEffect } from 'react';
// // // // import { 
// // // //   FaBold, FaItalic, FaUnderline, FaStrikethrough,
// // // //   FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
// // // //   FaListOl, FaListUl, FaLink, FaImage, FaVideo, FaCode,
// // // //   FaSave, FaArrowLeft, FaQuoteLeft, FaSubscript,
// // // //   FaSuperscript, FaEraser, FaPalette, FaTable,
// // // //   FaUndo, FaRedo, FaIndent, FaOutdent
// // // // } from 'react-icons/fa';

// // // // const RichTextEditor = ({ value, onChange }) => {
// // // //   const editorRef = useRef(null);
// // // //   const [showColorPicker, setShowColorPicker] = useState(false);
// // // //   const [showLinkDialog, setShowLinkDialog] = useState(false);
// // // //   const [linkUrl, setLinkUrl] = useState('');
// // // //   const [linkText, setLinkText] = useState('');
// // // //   const [history, setHistory] = useState([value]);
// // // //   const [historyIndex, setHistoryIndex] = useState(0);

// // // //   // Update history when value changes externally
// // // //   useEffect(() => {
// // // //     if (value !== history[historyIndex]) {
// // // //       const newHistory = history.slice(0, historyIndex + 1);
// // // //       newHistory.push(value);
// // // //       setHistory(newHistory);
// // // //       setHistoryIndex(newHistory.length - 1);
// // // //     }
// // // //   }, [value]);

// // // //   const handleInput = () => {
// // // //     if (editorRef.current) {
// // // //       const newValue = editorRef.current.innerHTML;
// // // //       onChange(newValue);
      
// // // //       // Add to history
// // // //       const newHistory = history.slice(0, historyIndex + 1);
// // // //       newHistory.push(newValue);
// // // //       setHistory(newHistory);
// // // //       setHistoryIndex(newHistory.length - 1);
// // // //     }
// // // //   };

// // // //   const execCommand = (command, value = null) => {
// // // //     if (editorRef.current) {
// // // //       editorRef.current.focus();
      
// // // //       try {
// // // //         if (value) {
// // // //           document.execCommand(command, false, value);
// // // //         } else {
// // // //           document.execCommand(command, false, null);
// // // //         }
// // // //         handleInput();
// // // //       } catch (error) {
// // // //         console.warn(`Command ${command} failed:`, error);
// // // //       }
// // // //     }
// // // //   };

// // // //   const insertHTML = (html) => {
// // // //     if (editorRef.current) {
// // // //       editorRef.current.focus();
// // // //       try {
// // // //         document.execCommand('insertHTML', false, html);
// // // //         handleInput();
// // // //       } catch (error) {
// // // //         console.warn('Insert HTML failed:', error);
// // // //       }
// // // //     }
// // // //   };

// // // //   const handlePaste = (e) => {
// // // //     e.preventDefault();
// // // //     const text = e.clipboardData.getData('text/plain');
// // // //     if (editorRef.current) {
// // // //       editorRef.current.focus();
// // // //       document.execCommand('insertText', false, text);
// // // //       handleInput();
// // // //     }
// // // //   };

// // // //   const handleImageUpload = (e) => {
// // // //     const file = e.target.files[0];
// // // //     if (file && file.type.startsWith('image/')) {
// // // //       const reader = new FileReader();
// // // //       reader.onload = (event) => {
// // // //         insertHTML(`<img src="${event.target.result}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 10px 0;" />`);
// // // //       };
// // // //       reader.readAsDataURL(file);
// // // //     }
// // // //     // Reset file input
// // // //     e.target.value = '';
// // // //   };

// // // //   const handleInsertLink = () => {
// // // //     if (linkUrl) {
// // // //       const html = linkText ? 
// // // //         `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>` :
// // // //         `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkUrl}</a>`;
// // // //       insertHTML(html);
// // // //       setShowLinkDialog(false);
// // // //       setLinkUrl('');
// // // //       setLinkText('');
// // // //     }
// // // //   };

// // // //   const handleInsertTable = () => {
// // // //     const rows = parseInt(prompt('Enter number of rows:', '3')) || 3;
// // // //     const cols = parseInt(prompt('Enter number of columns:', '3')) || 3;
    
// // // //     let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #ddd;"><tbody>';
    
// // // //     for (let i = 0; i < rows; i++) {
// // // //       tableHTML += '<tr>';
// // // //       for (let j = 0; j < cols; j++) {
// // // //         tableHTML += `<td style="border: 1px solid #ddd; padding: 8px; min-width: 50px;">&nbsp;</td>`;
// // // //       }
// // // //       tableHTML += '</tr>';
// // // //     }
    
// // // //     tableHTML += '</tbody></table>';
// // // //     insertHTML(tableHTML);
// // // //   };

// // // //   const undo = () => {
// // // //     if (historyIndex > 0) {
// // // //       const newIndex = historyIndex - 1;
// // // //       setHistoryIndex(newIndex);
// // // //       onChange(history[newIndex]);
// // // //       if (editorRef.current) {
// // // //         editorRef.current.innerHTML = history[newIndex];
// // // //       }
// // // //     }
// // // //   };

// // // //   const redo = () => {
// // // //     if (historyIndex < history.length - 1) {
// // // //       const newIndex = historyIndex + 1;
// // // //       setHistoryIndex(newIndex);
// // // //       onChange(history[newIndex]);
// // // //       if (editorRef.current) {
// // // //         editorRef.current.innerHTML = history[newIndex];
// // // //       }
// // // //     }
// // // //   };

// // // //   const clearFormatting = () => {
// // // //     if (editorRef.current) {
// // // //       editorRef.current.focus();
// // // //       // Select all text and remove formatting
// // // //       document.execCommand('selectAll', false, null);
// // // //       document.execCommand('removeFormat', false, null);
// // // //       document.execCommand('unlink', false, null);
// // // //       handleInput();
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="border rounded bg-white">
// // // //       {/* Main Toolbar */}
// // // //       <div className="bg-light border-bottom p-2 d-flex gap-1 flex-wrap">
        
// // // //         {/* Undo/Redo */}
// // // //         <div className="d-flex align-items-center gap-1 me-2">
// // // //           <button 
// // // //             className={`btn btn-sm border-0 ${historyIndex > 0 ? 'btn-outline-secondary' : 'btn-outline-secondary disabled'}`}
// // // //             onClick={undo}
// // // //             title="Undo"
// // // //             disabled={historyIndex <= 0}
// // // //           >
// // // //             <FaUndo />
// // // //           </button>
// // // //           <button 
// // // //             className={`btn btn-sm border-0 ${historyIndex < history.length - 1 ? 'btn-outline-secondary' : 'btn-outline-secondary disabled'}`}
// // // //             onClick={redo}
// // // //             title="Redo"
// // // //             disabled={historyIndex >= history.length - 1}
// // // //           >
// // // //             <FaRedo />
// // // //           </button>
// // // //         </div>

// // // //         <div className="vr"></div>

// // // //         {/* Font Style */}
// // // //         <div className="d-flex align-items-center gap-1 me-2">
// // // //           <select 
// // // //             className="form-select form-select-sm"
// // // //             style={{ width: '120px' }}
// // // //             onChange={(e) => execCommand('fontName', e.target.value)}
// // // //             defaultValue="Arial"
// // // //           >
// // // //             <option value="Arial">Arial</option>
// // // //             <option value="Helvetica">Helvetica</option>
// // // //             <option value="Times New Roman">Times New Roman</option>
// // // //             <option value="Georgia">Georgia</option>
// // // //             <option value="Verdana">Verdana</option>
// // // //           </select>
          
// // // //           <select 
// // // //             className="form-select form-select-sm"
// // // //             style={{ width: '90px' }}
// // // //             onChange={(e) => execCommand('fontSize', e.target.value)}
// // // //             defaultValue="3"
// // // //           >
// // // //             <option value="1">10px</option>
// // // //             <option value="2">13px</option>
// // // //             <option value="3">16px</option>
// // // //             <option value="4">18px</option>
// // // //             <option value="5">24px</option>
// // // //             <option value="6">32px</option>
// // // //             <option value="7">48px</option>
// // // //           </select>
// // // //         </div>

// // // //         <div className="vr"></div>

// // // //         {/* Text Formatting */}
// // // //         <div className="d-flex align-items-center gap-1 me-2">
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('bold')}
// // // //             title="Bold"
// // // //           >
// // // //             <FaBold />
// // // //           </button>
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('italic')}
// // // //             title="Italic"
// // // //           >
// // // //             <FaItalic />
// // // //           </button>
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('underline')}
// // // //             title="Underline"
// // // //           >
// // // //             <FaUnderline />
// // // //           </button>
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('strikeThrough')}
// // // //             title="Strikethrough"
// // // //           >
// // // //             <FaStrikethrough />
// // // //           </button>
// // // //         </div>

// // // //         <div className="vr"></div>

// // // //         {/* Script */}
// // // //         <div className="d-flex align-items-center gap-1 me-2">
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('subscript')}
// // // //             title="Subscript"
// // // //           >
// // // //             <FaSubscript />
// // // //           </button>
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('superscript')}
// // // //             title="Superscript"
// // // //           >
// // // //             <FaSuperscript />
// // // //           </button>
// // // //         </div>

// // // //         <div className="vr"></div>

// // // //         {/* Color Picker */}
// // // //         <div className="d-flex align-items-center gap-1 me-2 position-relative">
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => setShowColorPicker(!showColorPicker)}
// // // //             title="Text Color"
// // // //           >
// // // //             <FaPalette />
// // // //           </button>
// // // //           {showColorPicker && (
// // // //             <div className="position-absolute top-100 start-0 bg-white border rounded p-2 mt-1 shadow z-3">
// // // //               <div className="d-flex gap-1 flex-wrap" style={{ width: '120px' }}>
// // // //                 {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'].map(color => (
// // // //                   <button
// // // //                     key={color}
// // // //                     className="btn btn-sm border"
// // // //                     style={{ backgroundColor: color, width: '20px', height: '20px' }}
// // // //                     onClick={() => {
// // // //                       execCommand('foreColor', color);
// // // //                       setShowColorPicker(false);
// // // //                     }}
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //       </div>

// // // //       {/* Secondary Toolbar */}
// // // //       <div className="bg-light border-bottom p-2 d-flex gap-1 flex-wrap">
        
// // // //         {/* Paragraph Format */}
// // // //         <div className="d-flex align-items-center gap-1 me-2">
// // // //           <select 
// // // //             className="form-select form-select-sm"
// // // //             style={{ width: '140px' }}
// // // //             onChange={(e) => execCommand('formatBlock', e.target.value === 'p' ? '<p>' : `<${e.target.value}>`)}
// // // //             defaultValue="p"
// // // //           >
// // // //             <option value="p">Paragraph</option>
// // // //             <option value="h1">Heading 1</option>
// // // //             <option value="h2">Heading 2</option>
// // // //             <option value="h3">Heading 3</option>
// // // //             <option value="h4">Heading 4</option>
// // // //             <option value="blockquote">Quote</option>
// // // //           </select>
// // // //         </div>

// // // //         <div className="vr"></div>

// // // //         {/* Alignment */}
// // // //         <div className="d-flex align-items-center gap-1 me-2">
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('justifyLeft')}
// // // //             title="Align Left"
// // // //           >
// // // //             <FaAlignLeft />
// // // //           </button>
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('justifyCenter')}
// // // //             title="Align Center"
// // // //           >
// // // //             <FaAlignCenter />
// // // //           </button>
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('justifyRight')}
// // // //             title="Align Right"
// // // //           >
// // // //             <FaAlignRight />
// // // //           </button>
// // // //         </div>

// // // //         <div className="vr"></div>

// // // //         {/* Lists & Indent */}
// // // //         <div className="d-flex align-items-center gap-1 me-2">
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('insertUnorderedList')}
// // // //             title="Bullet List"
// // // //           >
// // // //             <FaListUl />
// // // //           </button>
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('insertOrderedList')}
// // // //             title="Numbered List"
// // // //           >
// // // //             <FaListOl />
// // // //           </button>
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('outdent')}
// // // //             title="Outdent"
// // // //           >
// // // //             <FaOutdent />
// // // //           </button>
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('indent')}
// // // //             title="Indent"
// // // //           >
// // // //             <FaIndent />
// // // //           </button>
// // // //         </div>

// // // //         <div className="vr"></div>

// // // //         {/* Media & Elements */}
// // // //         <div className="d-flex align-items-center gap-1 me-2">
// // // //           {/* Image Upload */}
// // // //           <label className="btn btn-sm btn-outline-secondary border-0 m-0" title="Insert Image">
// // // //             <FaImage />
// // // //             <input
// // // //               type="file"
// // // //               accept="image/*"
// // // //               onChange={handleImageUpload}
// // // //               style={{ display: 'none' }}
// // // //             />
// // // //           </label>

// // // //           {/* Link */}
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => setShowLinkDialog(true)}
// // // //             title="Insert Link"
// // // //           >
// // // //             <FaLink />
// // // //           </button>

// // // //           {/* Table */}
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={handleInsertTable}
// // // //             title="Insert Table"
// // // //           >
// // // //             <FaTable />
// // // //           </button>

// // // //           {/* Code Block */}
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => insertHTML('<pre style="background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>// Your code here</code></pre>')}
// // // //             title="Insert Code Block"
// // // //           >
// // // //             <FaCode />
// // // //           </button>

// // // //           {/* Quote */}
// // // //           <button 
// // // //             className="btn btn-sm btn-outline-secondary border-0"
// // // //             onClick={() => execCommand('formatBlock', '<blockquote>')}
// // // //             title="Insert Quote"
// // // //           >
// // // //             <FaQuoteLeft />
// // // //           </button>
// // // //         </div>

// // // //         <div className="vr"></div>

// // // //         {/* Clear Formatting */}
// // // //         <button 
// // // //           className="btn btn-sm btn-outline-secondary border-0"
// // // //           onClick={clearFormatting}
// // // //           title="Clear Formatting"
// // // //         >
// // // //           <FaEraser />
// // // //         </button>
// // // //       </div>

// // // //       {/* Link Dialog */}
// // // //       {showLinkDialog && (
// // // //         <div className="border-bottom p-3 bg-light">
// // // //           <div className="row g-2 align-items-center">
// // // //             <div className="col-md-5">
// // // //               <input
// // // //                 type="url"
// // // //                 className="form-control form-control-sm"
// // // //                 placeholder="Enter URL (https://...)"
// // // //                 value={linkUrl}
// // // //                 onChange={(e) => setLinkUrl(e.target.value)}
// // // //                 onKeyPress={(e) => e.key === 'Enter' && handleInsertLink()}
// // // //               />
// // // //             </div>
// // // //             <div className="col-md-4">
// // // //               <input
// // // //                 type="text"
// // // //                 className="form-control form-control-sm"
// // // //                 placeholder="Link text (optional)"
// // // //                 value={linkText}
// // // //                 onChange={(e) => setLinkText(e.target.value)}
// // // //                 onKeyPress={(e) => e.key === 'Enter' && handleInsertLink()}
// // // //               />
// // // //             </div>
// // // //             <div className="col-md-3">
// // // //               <div className="d-flex gap-1">
// // // //                 <button 
// // // //                   className="btn btn-primary btn-sm"
// // // //                   onClick={handleInsertLink}
// // // //                   disabled={!linkUrl}
// // // //                 >
// // // //                   Insert
// // // //                 </button>
// // // //                 <button 
// // // //                   className="btn btn-secondary btn-sm"
// // // //                   onClick={() => setShowLinkDialog(false)}
// // // //                 >
// // // //                   Cancel
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Editor Area */}
// // // //       <div
// // // //         ref={editorRef}
// // // //         contentEditable
// // // //         className="p-4"
// // // //         style={{ 
// // // //           minHeight: '400px', 
// // // //           outline: 'none',
// // // //           fontFamily: 'Arial, sans-serif',
// // // //           fontSize: '16px',
// // // //           lineHeight: '1.6'
// // // //         }}
// // // //         onInput={handleInput}
// // // //         onPaste={handlePaste}
// // // //         dangerouslySetInnerHTML={{ __html: value }}
// // // //         placeholder="Start writing your content here..."
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // // Keep the EditArticle component exactly as you had it
// // // // const EditArticle = ({ item, onSave, onGoBack }) => {
// // // //   const [articleTitle, setArticleTitle] = useState(item?.title || 'Untitled article');
// // // //   const [articleContent, setArticleContent] = useState(item?.content || '');

// // // //   const handleSave = () => {
// // // //     const updatedItem = {
// // // //       ...item,
// // // //       title: articleTitle,
// // // //       content: articleContent
// // // //     };
// // // //     onSave(updatedItem);
// // // //   };

// // // //   return (
// // // //     <div className="container-fluid bg-light min-vh-100 p-0">
// // // //       {/* Header and other components remain exactly the same */}
// // // //       <div className="bg-white border-bottom p-3">
// // // //         <div className="container">
// // // //           <div className="d-flex justify-content-between align-items-center">
// // // //             <div>
// // // //               <h1 className="h4 fw-bold text-dark mb-1">Manage your syllabus</h1>
// // // //               <p className="text-muted mb-0 small">
// // // //                 Program your recorded schedule. Add live events, coding labs, video lessons, and more
// // // //               </p>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Action Buttons */}
// // // //       <div className="bg-white border-bottom p-3">
// // // //         <div className="container">
// // // //           <div className="d-flex justify-content-between align-items-center">
// // // //             <button 
// // // //               className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
// // // //               onClick={onGoBack}
// // // //             >
// // // //               <FaArrowLeft /> Go back to all items
// // // //             </button>
// // // //             <button 
// // // //               className="btn btn-primary btn-sm d-flex align-items-center gap-2"
// // // //               onClick={handleSave}
// // // //             >
// // // //               <FaSave /> Save changes
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div className="container mt-4">
// // // //         <div className="row justify-content-center">
// // // //           <div className="col-lg-12">
// // // //             {/* Title Section */}
// // // //             <div className="mb-4">
// // // //               <label className="form-label fw-bold text-muted small">TITLE</label>
// // // //               <input
// // // //                 type="text"
// // // //                 className="form-control border-0 shadow-none fs-3 fw-bold p-3 bg-white rounded"
// // // //                 value={articleTitle}
// // // //                 onChange={(e) => setArticleTitle(e.target.value)}
// // // //                 placeholder="Untitled article"
// // // //               />
// // // //             </div>

// // // //             {/* Rich Text Editor */}
// // // //             <div className="mb-4">
// // // //               <label className="form-label fw-bold text-muted small">CONTENT</label>
// // // //               <RichTextEditor
// // // //                 value={articleContent}
// // // //                 onChange={setArticleContent}
// // // //               />
// // // //             </div>

             
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default EditArticle;




// // // import React, { useState, useRef, useEffect } from 'react';
// // // import { 
// // //   FaBold, FaItalic, FaUnderline, FaStrikethrough,
// // //   FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
// // //   FaListOl, FaListUl, FaLink, FaImage, FaVideo, FaCode,
// // //   FaSave, FaArrowLeft, FaQuoteLeft, FaSubscript,
// // //   FaSuperscript, FaEraser, FaPalette, FaTable,
// // //   FaUndo, FaRedo, FaIndent, FaOutdent
// // // } from 'react-icons/fa';

// // // const RichTextEditor = ({ value, onChange }) => {
// // //   const editorRef = useRef(null);
// // //   const [showColorPicker, setShowColorPicker] = useState(false);
// // //   const [showLinkDialog, setShowLinkDialog] = useState(false);
// // //   const [linkUrl, setLinkUrl] = useState('');
// // //   const [linkText, setLinkText] = useState('');
// // //   const [history, setHistory] = useState([value || '<p><br></p>']);
// // //   const [historyIndex, setHistoryIndex] = useState(0);

// // //   // Sync external value changes with history
// // //   // useEffect(() => {
// // //   //   if (value !== history[historyIndex]) {
// // //   //     const newHistory = history.slice(0, historyIndex + 1);
// // //   //     newHistory.push(value);
// // //   //     setHistory(newHistory);
// // //   //     setHistoryIndex(newHistory.length - 1);
// // //   //     if (editorRef.current && editorRef.current.innerHTML !== value) {
// // //   //       editorRef.current.innerHTML = value;
// // //   //     }
// // //   //   }
// // //   // }, [value]);

// // //   // // Update state and history on input
// // //   // const handleInput = () => {
// // //   //   if (editorRef.current) {
// // //   //     const newValue = editorRef.current.innerHTML;
// // //   //     onChange(newValue);

// // //   //     // Avoid adding duplicates to history
// // //   //     if (newValue !== history[historyIndex]) {
// // //   //       const newHistory = history.slice(0, historyIndex + 1);
// // //   //       newHistory.push(newValue);
// // //   //       setHistory(newHistory);
// // //   //       setHistoryIndex(newHistory.length - 1);
// // //   //     }
// // //   //   }
// // //   // };

 






 




// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   FaBold, FaItalic, FaUnderline, FaStrikethrough,
//   FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
//   FaListOl, FaListUl, FaLink, FaImage, FaVideo, FaCode,
//   FaSave, FaArrowLeft, FaQuoteLeft, FaSubscript,
//   FaSuperscript, FaEraser, FaPalette, FaTable,
//   FaUndo, FaRedo, FaIndent, FaOutdent
// } from 'react-icons/fa';

// const RichTextEditor = ({ value, onChange }) => {
//   const editorRef = useRef(null);
//   const [showColorPicker, setShowColorPicker] = useState(false);
//   const [showLinkDialog, setShowLinkDialog] = useState(false);
//   const [linkUrl, setLinkUrl] = useState('');
//   const [linkText, setLinkText] = useState('');
//   const [history, setHistory] = useState([value || '<p><br></p>']);
//   const [historyIndex, setHistoryIndex] = useState(0);
//   const [isComposing, setIsComposing] = useState(false);
//   const [isInCodeBlock, setIsInCodeBlock] = useState(false);

//   // Initialize editor
//   useEffect(() => {
//     if (editorRef.current && !editorRef.current.innerHTML) {
//       editorRef.current.innerHTML = value || '<p><br></p>';
//     }
//   }, []);

//   // Sync external value changes
//   useEffect(() => {
//     if (editorRef.current && value !== editorRef.current.innerHTML) {
//       editorRef.current.innerHTML = value || '<p><br></p>';
//       const newHistory = history.slice(0, historyIndex + 1);
//       if (value !== newHistory[newHistory.length - 1]) {
//         newHistory.push(value || '<p><br></p>');
//         setHistory(newHistory);
//         setHistoryIndex(newHistory.length - 1);
//       }
//     }
//   }, [value]);

//   // Check if we're inside a code block
//   useEffect(() => {
//     const checkSelectionInCodeBlock = () => {
//       if (!editorRef.current) return;
//       const selection = window.getSelection();
//       if (selection.rangeCount === 0) return;
      
//       const range = selection.getRangeAt(0);
//       const node = range.startContainer;
//       const preElement = node.nodeType === 3 ? 
//         node.parentElement.closest('pre') : 
//         node.closest('pre');
      
//       setIsInCodeBlock(!!preElement);
//     };

//     const handleSelectionChange = () => {
//       checkSelectionInCodeBlock();
//     };

//     document.addEventListener('selectionchange', handleSelectionChange);
//     return () => {
//       document.removeEventListener('selectionchange', handleSelectionChange);
//     };
//   }, []);

//   const handleInput = () => {
//     if (editorRef.current && !isComposing) {
//       const newValue = editorRef.current.innerHTML;
//       if (newValue !== value) {
//         onChange(newValue);
//         if (newValue !== history[historyIndex]) {
//           const newHistory = history.slice(0, historyIndex + 1);
//           newHistory.push(newValue);
//           setHistory(newHistory);
//           setHistoryIndex(newHistory.length - 1);
//         }
//       }
//     }
//   };

//   const handleCompositionStart = () => {
//     setIsComposing(true);
//   };

//   const handleCompositionEnd = () => {
//     setIsComposing(false);
//     setTimeout(() => {
//       if (editorRef.current) {
//         const newValue = editorRef.current.innerHTML;
//         if (newValue !== value) {
//           onChange(newValue);
//           if (newValue !== history[historyIndex]) {
//             const newHistory = history.slice(0, historyIndex + 1);
//             newHistory.push(newValue);
//             setHistory(newHistory);
//             setHistoryIndex(newHistory.length - 1);
//           }
//         }
//       }
//     }, 0);
//   };

//   const execCommand = (command, value = null) => {
//     if (editorRef.current) {
//       editorRef.current.focus();
//       try {
//         const selection = window.getSelection();
//         const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        
//         // Handle subscript/superscript differently
//         if (command === 'subscript' || command === 'superscript') {
//           // Toggle behavior - if already has the tag, remove it
//           if (range && !range.collapsed) {
//             const container = document.createElement('div');
//             container.appendChild(range.cloneContents());
//             const hasTag = container.querySelector(command === 'subscript' ? 'sub' : 'sup');
            
//             if (hasTag) {
//               // Remove the tag
//               document.execCommand('removeFormat', false, null);
//             } else {
//               // Apply the tag
//               document.execCommand(command, false, null);
//             }
//           } else {
//             document.execCommand(command, false, null);
//           }
//         } else if (value) {
//           if (command === 'formatBlock' && !value.startsWith('<')) {
//             value = `<${value}>`;
//           }
//           document.execCommand(command, false, value);
//         } else {
//           document.execCommand(command, false, null);
//         }
        
//         if (range && selection.rangeCount === 0) {
//           selection.removeAllRanges();
//           selection.addRange(range);
//         }
        
//         handleInput();
//       } catch (err) {
//         console.warn(`Command ${command} failed`, err);
//       }
//     }
//   };

//   const insertHTML = (html) => {
//     if (editorRef.current) {
//       editorRef.current.focus();
//       try {
//         const selection = window.getSelection();
//         const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        
//         document.execCommand('insertHTML', false, html);
        
//         if (range) {
//           selection.removeAllRanges();
//           selection.addRange(range);
//         }
        
//         handleInput();
//       } catch (err) {
//         console.warn('Insert HTML failed', err);
//       }
//     }
//   };

//   // Handle code block insertion
//   const handleInsertCodeBlock = () => {
//     if (editorRef.current) {
//       editorRef.current.focus();
      
//       const selection = window.getSelection();
//       if (selection.rangeCount === 0) return;
      
//       const range = selection.getRangeAt(0);
      
//       // Create code block
//       const pre = document.createElement('pre');
//       pre.style.cssText = 'background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 10px 0; font-family: monospace;';
      
//       const code = document.createElement('code');
//       code.textContent = '// Your code here';
//       pre.appendChild(code);
      
//       // Insert at cursor position
//       range.deleteContents();
//       range.insertNode(pre);
      
//       // Place cursor inside the code block
//       const newRange = document.createRange();
//       newRange.setStart(code, 0);
//       newRange.setEnd(code, 0);
//       selection.removeAllRanges();
//       selection.addRange(newRange);
      
//       handleInput();
//     }
//   };

//   // Handle quote insertion
//   const handleInsertQuote = () => {
//     execCommand('formatBlock', '<blockquote>');
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const text = e.clipboardData.getData('text/plain');
//     if (editorRef.current) {
//       editorRef.current.focus();
//       document.execCommand('insertText', false, text);
//       handleInput();
//     }
//   };

//   const handleKeyDown = (e) => {
//     // Handle Enter key differently for code blocks
//     if (e.key === 'Enter' && !e.shiftKey) {
//       if (isInCodeBlock) {
//         e.preventDefault();
//         // Inside code block, just insert a new line
//         document.execCommand('insertText', false, '\n');
//         handleInput();
//         return;
//       }
      
//       e.preventDefault();
//       document.execCommand('insertParagraph', false, null);
//       handleInput();
//     }
    
//     // Handle Tab key in code blocks
//     if (e.key === 'Tab' && isInCodeBlock) {
//       e.preventDefault();
//       document.execCommand('insertText', false, '  '); // Insert 2 spaces
//       handleInput();
//     }
    
//     // Handle Escape to exit code block
//     if (e.key === 'Escape' && isInCodeBlock) {
//       e.preventDefault();
//       // Move selection after the code block
//       const selection = window.getSelection();
//       if (selection.rangeCount > 0) {
//         const range = selection.getRangeAt(0);
//         const preElement = range.startContainer.parentElement.closest('pre');
//         if (preElement) {
//           const newRange = document.createRange();
//           newRange.setStartAfter(preElement);
//           newRange.collapse(true);
//           selection.removeAllRanges();
//           selection.addRange(newRange);
//           setIsInCodeBlock(false);
//         }
//       }
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         insertHTML(`<img src="${event.target.result}" alt="Uploaded image" style="max-width:100%; height:auto; margin:10px 0;" />`);
//       };
//       reader.readAsDataURL(file);
//     }
//     e.target.value = '';
//   };

//   const handleInsertLink = () => {
//     if (linkUrl) {
//       const html = linkText ? 
//         `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>` :
//         `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkUrl}</a>`;
//       insertHTML(html);
//       setShowLinkDialog(false);
//       setLinkUrl('');
//       setLinkText('');
//     }
//   };

//   const handleInsertTable = () => {
//     const rows = parseInt(prompt('Enter number of rows:', '3')) || 3;
//     const cols = parseInt(prompt('Enter number of columns:', '3')) || 3;
    
//     let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #ddd;"><tbody>';
    
//     for (let i = 0; i < rows; i++) {
//       tableHTML += '<tr>';
//       for (let j = 0; j < cols; j++) {
//         tableHTML += `<td style="border: 1px solid #ddd; padding: 8px; min-width: 50px;">&nbsp;</td>`;
//       }
//       tableHTML += '</tr>';
//     }
    
//     tableHTML += '</tbody></table>';
//     insertHTML(tableHTML);
//   };

//   const undo = () => {
//     if (historyIndex > 0) {
//       const newIndex = historyIndex - 1;
//       setHistoryIndex(newIndex);
//       const newValue = history[newIndex];
//       onChange(newValue);
//       if (editorRef.current) {
//         editorRef.current.innerHTML = newValue;
//       }
//     }
//   };

//   const redo = () => {
//     if (historyIndex < history.length - 1) {
//       const newIndex = historyIndex + 1;
//       setHistoryIndex(newIndex);
//       const newValue = history[newIndex];
//       onChange(newValue);
//       if (editorRef.current) {
//         editorRef.current.innerHTML = newValue;
//       }
//     }
//   };

//   const clearFormatting = () => {
//     if (editorRef.current) {
//       editorRef.current.focus();
      
//       const selection = window.getSelection();
//       const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      
//       if (range) {
//         selection.removeAllRanges();
//         selection.addRange(range);
//       }
      
//       document.execCommand('removeFormat', false, null);
//       document.execCommand('unlink', false, null);
//       handleInput();
//     }
//   };

//   return (
//     <div className="border rounded bg-white">
//       {/* Main Toolbar */}
//       <div className="bg-light border-bottom p-2 d-flex gap-1 flex-wrap">
        
//         {/* Undo/Redo */}
//         <div className="d-flex align-items-center gap-1 me-2">
//           <button 
//             className={`btn btn-sm border-0 ${historyIndex > 0 ? 'btn-outline-secondary' : 'btn-outline-secondary disabled'}`}
//             onClick={undo}
//             title="Undo"
//             disabled={historyIndex <= 0}
//           >
//             <FaUndo />
//           </button>
//           <button 
//             className={`btn btn-sm border-0 ${historyIndex < history.length - 1 ? 'btn-outline-secondary' : 'btn-outline-secondary disabled'}`}
//             onClick={redo}
//             title="Redo"
//             disabled={historyIndex >= history.length - 1}
//           >
//             <FaRedo />
//           </button>
//         </div>

//         <div className="vr"></div>

//         {/* Font Style */}
//         <div className="d-flex align-items-center gap-1 me-2">
//           <select 
//             className="form-select form-select-sm"
//             style={{ width: '120px' }}
//             onChange={(e) => execCommand('fontName', e.target.value)}
//             defaultValue="Arial"
//           >
//             <option value="Arial">Arial</option>
//             <option value="Helvetica">Helvetica</option>
//             <option value="Times New Roman">Times New Roman</option>
//             <option value="Georgia">Georgia</option>
//             <option value="Verdana">Verdana</option>
//           </select>
          
//           <select 
//             className="form-select form-select-sm"
//             style={{ width: '90px' }}
//             onChange={(e) => execCommand('fontSize', e.target.value)}
//             defaultValue="3"
//           >
//             <option value="1">10px</option>
//             <option value="2">13px</option>
//             <option value="3">16px</option>
//             <option value="4">18px</option>
//             <option value="5">24px</option>
//             <option value="6">32px</option>
//             <option value="7">48px</option>
//           </select>
//         </div>

//         <div className="vr"></div>

//         {/* Text Formatting */}
//         <div className="d-flex align-items-center gap-1 me-2">
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('bold')}
//             title="Bold"
//           >
//             <FaBold />
//           </button>
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('italic')}
//             title="Italic"
//           >
//             <FaItalic />
//           </button>
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('underline')}
//             title="Underline"
//           >
//             <FaUnderline />
//           </button>
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('strikeThrough')}
//             title="Strikethrough"
//           >
//             <FaStrikethrough />
//           </button>
//         </div>

//         <div className="vr"></div>

//         {/* Script - Fixed with toggle behavior */}
//         <div className="d-flex align-items-center gap-1 me-2">
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('subscript')}
//             title="Subscript (Toggle)"
//           >
//             <FaSubscript />
//           </button>
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('superscript')}
//             title="Superscript (Toggle)"
//           >
//             <FaSuperscript />
//           </button>
//         </div>

//         <div className="vr"></div>

//         {/* Color Picker */}
//         <div className="d-flex align-items-center gap-1 me-2 position-relative">
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => setShowColorPicker(!showColorPicker)}
//             title="Text Color"
//           >
//             <FaPalette />
//           </button>
//           {showColorPicker && (
//             <div className="position-absolute top-100 start-0 bg-white border rounded p-2 mt-1 shadow z-3">
//               <div className="d-flex gap-1 flex-wrap" style={{ width: '120px' }}>
//                 {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'].map(color => (
//                   <button
//                     key={color}
//                     className="btn btn-sm border"
//                     style={{ backgroundColor: color, width: '20px', height: '20px' }}
//                     onClick={() => {
//                       execCommand('foreColor', color);
//                       setShowColorPicker(false);
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Secondary Toolbar */}
//       <div className="bg-light border-bottom p-2 d-flex gap-1 flex-wrap">
//         {/* Paragraph Format */}
//         <div className="d-flex align-items-center gap-1 me-2">
//           <select 
//             className="form-select form-select-sm"
//             style={{ width: '140px' }}
//             onChange={(e) => execCommand('formatBlock', e.target.value === 'p' ? '<p>' : `<${e.target.value}>`)}
//             defaultValue="p"
//           >
//             <option value="p">Paragraph</option>
//             <option value="h1">Heading 1</option>
//             <option value="h2">Heading 2</option>
//             <option value="h3">Heading 3</option>
//             <option value="h4">Heading 4</option>
//             <option value="blockquote">Quote</option>
//           </select>
//         </div>

//         <div className="vr"></div>

//         {/* Alignment */}
//         <div className="d-flex align-items-center gap-1 me-2">
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('justifyLeft')}
//             title="Align Left"
//           >
//             <FaAlignLeft />
//           </button>
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('justifyCenter')}
//             title="Align Center"
//           >
//             <FaAlignCenter />
//           </button>
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('justifyRight')}
//             title="Align Right"
//           >
//             <FaAlignRight />
//           </button>
//         </div>

//         <div className="vr"></div>

//         {/* Lists & Indent */}
//         <div className="d-flex align-items-center gap-1 me-2">
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('insertUnorderedList')}
//             title="Bullet List"
//           >
//             <FaListUl />
//           </button>
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('insertOrderedList')}
//             title="Numbered List"
//           >
//             <FaListOl />
//           </button>
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('outdent')}
//             title="Outdent"
//           >
//             <FaOutdent />
//           </button>
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => execCommand('indent')}
//             title="Indent"
//           >
//             <FaIndent />
//           </button>
//         </div>

//         <div className="vr"></div>

//         {/* Media & Elements */}
//         <div className="d-flex align-items-center gap-1 me-2">
//           {/* Image Upload */}
//           <label className="btn btn-sm btn-outline-secondary border-0 m-0" title="Insert Image">
//             <FaImage />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               style={{ display: 'none' }}
//             />
//           </label>

//           {/* Link */}
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={() => setShowLinkDialog(true)}
//             title="Insert Link"
//           >
//             <FaLink />
//           </button>

//           {/* Table */}
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={handleInsertTable}
//             title="Insert Table"
//           >
//             <FaTable />
//           </button>

//           {/* Code Block - Fixed with custom insertion */}
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={handleInsertCodeBlock}
//             title="Insert Code Block"
//           >
//             <FaCode />
//           </button>

//           {/* Quote - Fixed */}
//           <button 
//             className="btn btn-sm btn-outline-secondary border-0"
//             onClick={handleInsertQuote}
//             title="Insert Quote"
//           >
//             <FaQuoteLeft />
//           </button>
//         </div>

//         <div className="vr"></div>

//         {/* Clear Formatting */}
//         <button 
//           className="btn btn-sm btn-outline-secondary border-0"
//           onClick={clearFormatting}
//           title="Clear Formatting"
//         >
//           <FaEraser />
//         </button>
//       </div>

//       {/* Link Dialog */}
//       {showLinkDialog && (
//         <div className="border-bottom p-3 bg-light">
//           <div className="row g-2 align-items-center">
//             <div className="col-md-5">
//               <input
//                 type="url"
//                 className="form-control form-control-sm"
//                 placeholder="Enter URL (https://...)"
//                 value={linkUrl}
//                 onChange={(e) => setLinkUrl(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleInsertLink()}
//               />
//             </div>
//             <div className="col-md-4">
//               <input
//                 type="text"
//                 className="form-control form-control-sm"
//                 placeholder="Link text (optional)"
//                 value={linkText}
//                 onChange={(e) => setLinkText(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleInsertLink()}
//               />
//             </div>
//             <div className="col-md-3">
//               <div className="d-flex gap-1">
//                 <button 
//                   className="btn btn-primary btn-sm"
//                   onClick={handleInsertLink}
//                   disabled={!linkUrl}
//                 >
//                   Insert
//                 </button>
//                 <button 
//                   className="btn btn-secondary btn-sm"
//                   onClick={() => setShowLinkDialog(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Editor Area */}
//       <div
//         ref={editorRef}
//         contentEditable
//         className="p-4"
//         style={{ 
//           minHeight: '400px', 
//           outline: 'none',
//           fontFamily: 'Arial, sans-serif',
//           fontSize: '16px',
//           lineHeight: '1.6',
//           direction: 'ltr',
//           textAlign: 'left',
//           overflowWrap: 'break-word',
//           wordBreak: 'break-word',
//           border: '1px solid #ccc',
//           borderTop: 'none',
//           borderRadius: '0 0 4px 4px',
//         }}
//         onInput={handleInput}
//         onKeyDown={handleKeyDown}
//         onPaste={handlePaste}
//         onCompositionStart={handleCompositionStart}
//         onCompositionEnd={handleCompositionEnd}
//         suppressContentEditableWarning={true}
//         placeholder="Start writing your content here..."
//       />
//     </div>
//   );
// };

// const EditArticle = ({ item, onSave, onGoBack }) => {
//   const [articleTitle, setArticleTitle] = useState(item?.title || 'Untitled article');
//   const [articleContent, setArticleContent] = useState(item?.content || '');

//   const handleSave = () => {
//     const updatedItem = {
//       ...item,
//       title: articleTitle,
//       content: articleContent
//     };
//     onSave(updatedItem);
//   };

//   return (
//     <div className="container-fluid bg-light min-vh-100 p-0">
//       <div className="bg-white border-bottom p-3">
//         <div className="container">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <h1 className="h4 fw-bold text-dark mb-1">Manage your syllabus</h1>
//               <p className="text-muted mb-0 small">
//                 Program your recorded schedule. Add live events, coding labs, video lessons, and more
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white border-bottom p-3">
//         <div className="container">
//           <div className="d-flex justify-content-between align-items-center">
//             <button 
//               className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
//               onClick={onGoBack}
//             >
//               <FaArrowLeft /> Go back to all items
//             </button>
//             <button 
//               className="btn btn-primary btn-sm d-flex align-items-center gap-2"
//               onClick={handleSave}
//             >
//               <FaSave /> Save changes
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container mt-4">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div className="mb-4">
//               <label className="form-label fw-bold text-muted small">TITLE</label>
//               <input
//                 type="text"
//                 className="form-control border-0 shadow-none fs-3 fw-bold p-3 bg-white rounded"
//                 value={articleTitle}
//                 onChange={(e) => setArticleTitle(e.target.value)}
//                 placeholder="Untitled article"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="form-label fw-bold text-muted small">CONTENT</label>
//               <RichTextEditor
//                 value={articleContent}
//                 onChange={setArticleContent}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditArticle;



import React, { useState, useRef, useEffect } from 'react';
import { 
  FaBold, FaItalic, FaUnderline, FaStrikethrough,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaListOl, FaListUl, FaLink, FaImage, FaVideo, FaCode,
  FaSave, FaArrowLeft, FaQuoteLeft, FaSubscript,
  FaSuperscript, FaEraser, FaPalette, FaTable,
  FaUndo, FaRedo, FaIndent, FaOutdent
} from 'react-icons/fa';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [history, setHistory] = useState([value || '<p><br></p>']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isComposing, setIsComposing] = useState(false);

  // Initialize editor
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '<p><br></p>';
    }
  }, []);

  // Sync external value changes
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '<p><br></p>';
      const newHistory = history.slice(0, historyIndex + 1);
      if (value !== newHistory[newHistory.length - 1]) {
        newHistory.push(value || '<p><br></p>');
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && !isComposing) {
      const newValue = editorRef.current.innerHTML;
      if (newValue !== value) {
        onChange(newValue);
        if (newValue !== history[historyIndex]) {
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push(newValue);
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
        }
      }
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
    setTimeout(() => {
      if (editorRef.current) {
        const newValue = editorRef.current.innerHTML;
        if (newValue !== value) {
          onChange(newValue);
          if (newValue !== history[historyIndex]) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newValue);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
          }
        }
      }
    }, 0);
  };

  const execCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      try {
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        
        if (command === 'subscript' || command === 'superscript') {
          // Toggle behavior
          if (range && !range.collapsed) {
            const container = document.createElement('div');
            container.appendChild(range.cloneContents());
            const hasTag = container.querySelector(command === 'subscript' ? 'sub' : 'sup');
            
            if (hasTag) {
              document.execCommand('removeFormat', false, null);
            } else {
              document.execCommand(command, false, null);
            }
          } else {
            document.execCommand(command, false, null);
          }
        } else if (value) {
          if (command === 'formatBlock' && !value.startsWith('<')) {
            value = `<${value}>`;
          }
          document.execCommand(command, false, value);
        } else {
          document.execCommand(command, false, null);
        }
        
        if (range && selection.rangeCount === 0) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        handleInput();
      } catch (err) {
        console.warn(`Command ${command} failed`, err);
      }
    }
  };

  const insertHTML = (html) => {
    if (editorRef.current) {
      editorRef.current.focus();
      try {
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        
        document.execCommand('insertHTML', false, html);
        
        if (range) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        handleInput();
      } catch (err) {
        console.warn('Insert HTML failed', err);
      }
    }
  };

  // // Handle code block insertion - FIXED
  // const handleInsertCodeBlock = () => {
  //   if (editorRef.current) {
  //     editorRef.current.focus();
      
  //     const selection = window.getSelection();
  //     if (selection.rangeCount === 0) return;
      
  //     const range = selection.getRangeAt(0);
      
  //     // Create code block with contenteditable=false to prevent nested editing
  //     const pre = document.createElement('pre');
  //     pre.style.cssText = 'background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 10px 0; font-family: monospace; white-space: pre-wrap;';
  //     pre.contentEditable = 'false';
      
  //     const code = document.createElement('code');
  //     code.textContent = '// Your code here';
  //     code.contentEditable = 'true';
  //     pre.appendChild(code);
      
  //     // Insert at cursor position
  //     range.deleteContents();
  //     range.insertNode(pre);
      
  //     // Place cursor inside the code element
  //     const newRange = document.createRange();
  //     newRange.selectNodeContents(code);
  //     newRange.collapse(false);
  //     selection.removeAllRanges();
  //     selection.addRange(newRange);
      
  //     handleInput();
  //   }
  // };



  // Handle code block insertion - FIXED
const handleInsertCodeBlock = () => {
  if (editorRef.current) {
    editorRef.current.focus();
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // Create code block without border
    const pre = document.createElement('pre');
    pre.style.cssText = 'background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 10px 0; font-family: monospace; white-space: pre-wrap;';
    pre.contentEditable = 'false';
    
    const code = document.createElement('code');
    code.textContent = '// Your code here';
    code.contentEditable = 'true';
    pre.appendChild(code);
    
    // Insert at cursor position
    range.deleteContents();
    range.insertNode(pre);
    
    // Place cursor inside the code element
    const newRange = document.createRange();
    newRange.selectNodeContents(code);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
     
    handleInput();
  }
};

  // Handle quote insertion - FIXED
  const handleInsertQuote = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      
      // Check if we're already in a blockquote
      let blockquoteElement = null;
      let startNode = range.startContainer;
      
      if (startNode.nodeType === 3) {
        startNode = startNode.parentElement;
      }
      
      blockquoteElement = startNode.closest('blockquote');
      
      if (blockquoteElement) {
        // If already in a blockquote, exit it
        const newRange = document.createRange();
        const afterBlockquote = blockquoteElement.nextSibling || blockquoteElement.parentElement;
        
        // Create a new paragraph after the blockquote
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        
        if (blockquoteElement.parentElement.insertBefore) {
          blockquoteElement.parentElement.insertBefore(p, blockquoteElement.nextSibling);
          newRange.setStart(p, 0);
          newRange.collapse(true);
        }
        
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        // Create new blockquote
        const blockquote = document.createElement('blockquote');
        blockquote.style.cssText = 'border-left: 4px solid #ccc; margin: 10px 0; padding-left: 15px; font-style: italic;';
        
        // Check if we have selected text
        if (!range.collapsed) {
          const selectedContent = range.cloneContents();
          blockquote.appendChild(selectedContent);
          range.deleteContents();
          range.insertNode(blockquote);
        } else {
          // Insert empty blockquote with paragraph
          const p = document.createElement('p');
          p.innerHTML = 'Quote text here';
          blockquote.appendChild(p);
          range.deleteContents();
          range.insertNode(blockquote);
          
          // Place cursor inside the blockquote
          const newRange = document.createRange();
          newRange.selectNodeContents(p);
          newRange.collapse(false);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
      
      handleInput();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, text);
      handleInput();
    }
  };

  const handleKeyDown = (e) => {
    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const node = range.startContainer;
      
      // Check if we're inside a code block
      const codeElement = node.nodeType === 3 ? 
        node.parentElement.closest('code') : 
        node.closest('code');
      
      if (codeElement && codeElement.closest('pre')) {
        // Inside code block - insert new line
        const newRange = document.createRange();
        const offset = range.startOffset;
        const textNode = node.nodeType === 3 ? node : document.createTextNode('');
        
        if (node.nodeType === 3) {
          // Insert newline in text node
          const text = node.textContent;
          const newText = text.substring(0, offset) + '\n' + text.substring(offset);
          node.textContent = newText;
          newRange.setStart(node, offset + 1);
        } else {
          // Create new text node with newline
          const newNode = document.createTextNode('\n');
          codeElement.insertBefore(newNode, codeElement.childNodes[range.startOffset] || null);
          newRange.setStart(newNode, 1);
        }
        
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        handleInput();
        return;
      }
      
      // Check if we're inside a blockquote
      const blockquoteElement = node.nodeType === 3 ? 
        node.parentElement.closest('blockquote') : 
        node.closest('blockquote');
      
      if (blockquoteElement) {
        // Inside blockquote - insert new paragraph inside blockquote
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        
        if (range.collapsed) {
          const parent = range.startContainer.nodeType === 3 ? 
            range.startContainer.parentNode : 
            range.startContainer;
          
          // Insert after current position
          const newRange = document.createRange();
          if (parent.nextSibling) {
            parent.parentNode.insertBefore(p, parent.nextSibling);
          } else {
            parent.parentNode.appendChild(p);
          }
          
          newRange.setStart(p, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          // Replace selection with new paragraph
          range.deleteContents();
          range.insertNode(p);
          const newRange = document.createRange();
          newRange.setStart(p, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
        
        handleInput();
        return;
      }
      
      // Default behavior - insert paragraph
      document.execCommand('insertParagraph', false, null);
      handleInput();
    }
    
    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const node = range.startContainer;
      
      // Check if we're inside a code block
      const codeElement = node.nodeType === 3 ? 
        node.parentElement.closest('code') : 
        node.closest('code');
      
      if (codeElement && codeElement.closest('pre')) {
        // Inside code block - insert spaces
        const newRange = document.createRange();
        const offset = range.startOffset;
        
        if (node.nodeType === 3) {
          const text = node.textContent;
          const newText = text.substring(0, offset) + '  ' + text.substring(offset);
          node.textContent = newText;
          newRange.setStart(node, offset + 2);
        } else {
          const newNode = document.createTextNode('  ');
          codeElement.insertBefore(newNode, codeElement.childNodes[range.startOffset] || null);
          newRange.setStart(newNode, 2);
        }
        
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        handleInput();
      } else if (e.shiftKey) {
        // Shift+Tab - outdent
        execCommand('outdent');
      } else {
        // Tab - indent
        execCommand('indent');
      }
    }
    
    // Handle Escape key
    if (e.key === 'Escape') {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const node = range.startContainer;
      
      // Check if we're inside a code block
      const codeElement = node.nodeType === 3 ? 
        node.parentElement.closest('code') : 
        node.closest('code');
      
      if (codeElement && codeElement.closest('pre')) {
        // Move cursor after the code block
        const preElement = codeElement.closest('pre');
        const newRange = document.createRange();
        newRange.setStartAfter(preElement);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        handleInput();
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        insertHTML(`<img src="${event.target.result}" alt="Uploaded image" style="max-width:100%; height:auto; margin:10px 0;" />`);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleInsertLink = () => {
    if (linkUrl) {
      const html = linkText ? 
        `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>` :
        `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkUrl}</a>`;
      insertHTML(html);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleInsertTable = () => {
    const rows = parseInt(prompt('Enter number of rows:', '3')) || 3;
    const cols = parseInt(prompt('Enter number of columns:', '3')) || 3;
    
    let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #ddd;"><tbody>';
    
    for (let i = 0; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHTML += `<td style="border: 1px solid #ddd; padding: 8px; min-width: 50px;">&nbsp;</td>`;
      }
      tableHTML += '</tr>';
    }
    
    tableHTML += '</tbody></table>';
    insertHTML(tableHTML);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const newValue = history[newIndex];
      onChange(newValue);
      if (editorRef.current) {
        editorRef.current.innerHTML = newValue;
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const newValue = history[newIndex];
      onChange(newValue);
      if (editorRef.current) {
        editorRef.current.innerHTML = newValue;
      }
    }
  };

  const clearFormatting = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      
      if (range) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      document.execCommand('removeFormat', false, null);
      document.execCommand('unlink', false, null);
      handleInput();
    }
  };

  return (
    <div className="border rounded bg-white">
      {/* Main Toolbar */}
      <div className="bg-light border-bottom p-2 d-flex gap-1 flex-wrap">
        
        {/* Undo/Redo */}
        <div className="d-flex align-items-center gap-1 me-2">
          <button 
            className={`btn btn-sm border-0 ${historyIndex > 0 ? 'btn-outline-secondary' : 'btn-outline-secondary disabled'}`}
            onClick={undo}
            title="Undo"
            disabled={historyIndex <= 0}
          >
            <FaUndo />
          </button>
          <button 
            className={`btn btn-sm border-0 ${historyIndex < history.length - 1 ? 'btn-outline-secondary' : 'btn-outline-secondary disabled'}`}
            onClick={redo}
            title="Redo"
            disabled={historyIndex >= history.length - 1}
          >
            <FaRedo />
          </button>
        </div>

        <div className="vr"></div>

        {/* Font Style */}
        <div className="d-flex align-items-center gap-1 me-2">
          <select 
            className="form-select form-select-sm"
            style={{ width: '120px' }}
            onChange={(e) => execCommand('fontName', e.target.value)}
            defaultValue="Arial"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
          
          <select 
            className="form-select form-select-sm"
            style={{ width: '90px' }}
            onChange={(e) => execCommand('fontSize', e.target.value)}
            defaultValue="3"
          >
            <option value="1">10px</option>
            <option value="2">13px</option>
            <option value="3">16px</option>
            <option value="4">18px</option>
            <option value="5">24px</option>
            <option value="6">32px</option>
            <option value="7">48px</option>
          </select>
        </div>

        <div className="vr"></div>

        {/* Text Formatting */}
        <div className="d-flex align-items-center gap-1 me-2">
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('bold')}
            title="Bold"
          >
            <FaBold />
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('italic')}
            title="Italic"
          >
            <FaItalic />
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('underline')}
            title="Underline"
          >
            <FaUnderline />
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('strikeThrough')}
            title="Strikethrough"
          >
            <FaStrikethrough />
          </button>
        </div>

        <div className="vr"></div>

        {/* Script */}
        <div className="d-flex align-items-center gap-1 me-2">
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('subscript')}
            title="Subscript (Toggle)"
          >
            <FaSubscript />
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('superscript')}
            title="Superscript (Toggle)"
          >
            <FaSuperscript />
          </button>
        </div>

        <div className="vr"></div>

        {/* Color Picker */}
        <div className="d-flex align-items-center gap-1 me-2 position-relative">
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Text Color"
          >
            <FaPalette />
          </button>
          {showColorPicker && (
            <div className="position-absolute top-100 start-0 bg-white border rounded p-2 mt-1 shadow z-3">
              <div className="d-flex gap-1 flex-wrap" style={{ width: '120px' }}>
                {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'].map(color => (
                  <button
                    key={color}
                    className="btn btn-sm border"
                    style={{ backgroundColor: color, width: '20px', height: '20px' }}
                    onClick={() => {
                      execCommand('foreColor', color);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Toolbar */}
      <div className="bg-light border-bottom p-2 d-flex gap-1 flex-wrap">
        {/* Paragraph Format */}
        <div className="d-flex align-items-center gap-1 me-2">
          <select 
            className="form-select form-select-sm"
            style={{ width: '140px' }}
            onChange={(e) => execCommand('formatBlock', e.target.value === 'p' ? '<p>' : `<${e.target.value}>`)}
            defaultValue="p"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="blockquote">Quote</option>
          </select>
        </div>

        <div className="vr"></div>

        {/* Alignment */}
        <div className="d-flex align-items-center gap-1 me-2">
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('justifyLeft')}
            title="Align Left"
          >
            <FaAlignLeft />
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('justifyCenter')}
            title="Align Center"
          >
            <FaAlignCenter />
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('justifyRight')}
            title="Align Right"
          >
            <FaAlignRight />
          </button>
        </div>

        <div className="vr"></div>

        {/* Lists & Indent */}
        <div className="d-flex align-items-center gap-1 me-2">
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
          >
            <FaListUl />
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered List"
          >
            <FaListOl />
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('outdent')}
            title="Outdent"
          >
            <FaOutdent />
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('indent')}
            title="Indent"
          >
            <FaIndent />
          </button>
        </div>

        <div className="vr"></div>

        {/* Media & Elements */}
        <div className="d-flex align-items-center gap-1 me-2">
          {/* Image Upload */}
          <label className="btn btn-sm btn-outline-secondary border-0 m-0" title="Insert Image">
            <FaImage />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>

          {/* Link */}
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => setShowLinkDialog(true)}
            title="Insert Link"
          >
            <FaLink />
          </button>

          {/* Table */}
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={handleInsertTable}
            title="Insert Table"
          >
            <FaTable />
          </button>

          {/* Code Block - FIXED */}
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={handleInsertCodeBlock}
            title="Insert Code Block"
          >
            <FaCode />
          </button>

          {/* Quote - FIXED */}
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={handleInsertQuote}
            title="Insert Quote"
          >
            <FaQuoteLeft />
          </button>
        </div>

        <div className="vr"></div>

        {/* Clear Formatting */}
        <button 
          className="btn btn-sm btn-outline-secondary border-0"
          onClick={clearFormatting}
          title="Clear Formatting"
        >
          <FaEraser />
        </button>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="border-bottom p-3 bg-light">
          <div className="row g-2 align-items-center">
            <div className="col-md-5">
              <input
                type="url"
                className="form-control form-control-sm"
                placeholder="Enter URL (https://...)"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInsertLink()}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Link text (optional)"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInsertLink()}
              />
            </div>
            <div className="col-md-3">
              <div className="d-flex gap-1">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleInsertLink}
                  disabled={!linkUrl}
                >
                  Insert
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowLinkDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4"
        style={{ 
          minHeight: '400px', 
          outline: 'none',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
          direction: 'ltr',
          textAlign: 'left',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          border: '1px solid #ccc',
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
        }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        suppressContentEditableWarning={true}
        placeholder="Start writing your content here..."
      />
    </div>
  );
};

const EditArticle = ({ item, onSave, onGoBack }) => {
  const [articleTitle, setArticleTitle] = useState(item?.title || 'Untitled article');
  const [articleContent, setArticleContent] = useState(item?.content || '');

  const handleSave = () => {
    const updatedItem = {
      ...item,
      title: articleTitle,
      content: articleContent
    };
    onSave(updatedItem);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 p-0">
      <div className="bg-white border-bottom p-3">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h4 fw-bold text-dark mb-1">Manage your syllabus</h1>
              <p className="text-muted mb-0 small">
                Program your recorded schedule. Add live events, coding labs, video lessons, and more
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-bottom p-3">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <button 
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
              onClick={onGoBack}
            >
              <FaArrowLeft /> Go back to all items
            </button>
            <button 
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={handleSave}
            >
              <FaSave /> Save changes
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="mb-4">
              <label className="form-label fw-bold text-muted small">TITLE</label>
              <input
                type="text"
                className="form-control border-0 shadow-none fs-3 fw-bold p-3 bg-white rounded"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="Untitled article"
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-muted small">CONTENT</label>
              <RichTextEditor
                value={articleContent}
                onChange={setArticleContent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;