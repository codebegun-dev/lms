// import React, { useState } from 'react';
// import { 
//   FaBold, FaItalic, FaUnderline, FaStrikethrough, FaCheck, 
//   FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, 
//   FaListOl, FaListUl, FaUndo, FaRedo, FaLink, FaImage, 
//   FaVideo, FaCode, FaTable, FaParagraph 
// } from 'react-icons/fa';

// const EditArticle = ({ item, onSave, onGoBack }) => {
//   const [articleTitle, setArticleTitle] = useState(item?.title || 'Untitled article');
//   const [articleContent, setArticleContent] = useState('');
//   const [selectedFormat, setSelectedFormat] = useState('paragraph');

//   const handleSave = () => {
//     const updatedItem = {
//       ...item,
//       title: articleTitle,
//       content: articleContent
//     };
//     onSave(updatedItem);
//   };

//   const handleFormatChange = (format) => {
//     setSelectedFormat(format);
//     // Add formatting logic here based on the selected format
//   };

//   const handleTextFormat = (format) => {
//     // Implement text formatting logic (bold, italic, etc.)
//     console.log(`Apply ${format} formatting`);
//   };

//   return (
//     <div className="container-fluid bg-light min-vh-100 p-0">
//       {/* Header */}
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

//       {/* Action Buttons */}
//       <div className="bg-white border-bottom p-3">
//         <div className="container">
//           <div className="d-flex justify-content-between align-items-center">
//             <button className="btn btn-outline-secondary btn-sm" onClick={onGoBack}>
//               ← Go back to all items
//             </button>
//             <button className="btn btn-primary btn-sm" onClick={handleSave}>
//               Save changes
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container mt-4">
//         <div className="row justify-content-center">
//           <div className="col-lg-10">
//             {/* Title Section */}
//             <div className="mb-4">
//               <label className="form-label fw-bold text-muted small">TITLE</label>
//               <input
//                 type="text"
//                 className="form-control border-0 shadow-none fs-3 fw-bold"
//                 value={articleTitle}
//                 onChange={(e) => setArticleTitle(e.target.value)}
//                 placeholder="Untitled article"
//               />
//             </div>

//             {/* Paragraph Section */}
//             <div className="mb-3">
//               <label className="form-label fw-bold text-muted small">PARAGRAPH</label>
              
//               {/* Toolbar */}
//               <div className="bg-white border rounded-top p-2">
//                 <div className="d-flex align-items-center gap-2 flex-wrap">
//                   {/* Format Selector */}
//                   <select 
//                     className="form-select form-select-sm" 
//                     style={{ width: '120px' }}
//                     value={selectedFormat}
//                     onChange={(e) => handleFormatChange(e.target.value)}
//                   >
//                     <option value="paragraph">Paragraph</option>
//                     <option value="heading1">Heading 1</option>
//                     <option value="heading2">Heading 2</option>
//                     <option value="heading3">Heading 3</option>
//                     <option value="code">Code</option>
//                     <option value="quote">Quote</option>
//                   </select>

//                   {/* Text Formatting */}
//                   <div className="d-flex align-items-center gap-1 border-end pe-2 me-2">
//                     <button 
//                       className="btn btn-sm btn-outline-secondary border-0"
//                       onClick={() => handleTextFormat('bold')}
//                       title="Bold"
//                     >
//                       <FaBold />
//                     </button>
//                     <button 
//                       className="btn btn-sm btn-outline-secondary border-0"
//                       onClick={() => handleTextFormat('italic')}
//                       title="Italic"
//                     >
//                       <FaItalic />
//                     </button>
//                     <button 
//                       className="btn btn-sm btn-outline-secondary border-0"
//                       onClick={() => handleTextFormat('underline')}
//                       title="Underline"
//                     >
//                       <FaUnderline />
//                     </button>
//                     <button 
//                       className="btn btn-sm btn-outline-secondary border-0"
//                       onClick={() => handleTextFormat('strikethrough')}
//                       title="Strikethrough"
//                     >
//                       <FaStrikethrough />
//                     </button>
//                   </div>

//                   {/* Text Alignment */}
//                   <div className="d-flex align-items-center gap-1 border-end pe-2 me-2">
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaAlignLeft />
//                     </button>
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaAlignCenter />
//                     </button>
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaAlignRight />
//                     </button>
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaAlignJustify />
//                     </button>
//                   </div>

//                   {/* Lists */}
//                   <div className="d-flex align-items-center gap-1 border-end pe-2 me-2">
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaListUl />
//                     </button>
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaListOl />
//                     </button>
//                   </div>

//                   {/* Undo/Redo */}
//                   <div className="d-flex align-items-center gap-1 border-end pe-2 me-2">
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaUndo />
//                     </button>
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaRedo />
//                     </button>
//                   </div>

//                   {/* Media */}
//                   <div className="d-flex align-items-center gap-1">
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaLink />
//                     </button>
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaImage />
//                     </button>
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaVideo />
//                     </button>
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaCode />
//                     </button>
//                     <button className="btn btn-sm btn-outline-secondary border-0">
//                       <FaTable />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Text Editor Area */}
//               <div className="border border-top-0 rounded-bottom p-4 bg-white">
//                 <textarea 
//                   className="form-control border-0 shadow-none" 
//                   rows="12"
//                   value={articleContent}
//                   onChange={(e) => setArticleContent(e.target.value)}
//                   placeholder="Type '/' for commands..."
//                   style={{ resize: 'none', minHeight: '300px', fontSize: '16px' }}
//                 ></textarea>
//               </div>
//             </div>

//             {/* Quick Formatting Options */}
//             <div className="bg-light p-3 rounded">
//               <div className="d-flex align-items-center gap-2 flex-wrap">
//                 <span className="text-muted small me-2">Quick formatting:</span>
//                 <button className="btn btn-sm btn-outline-secondary"># Heading 1</button>
//                 <button className="btn btn-sm btn-outline-secondary">## Heading 2</button>
//                 <button className="btn btn-sm btn-outline-secondary">### Heading 3</button>
//                 <button className="btn btn-sm btn-outline-secondary">Quote</button>
//                 <button className="btn btn-sm btn-outline-secondary">``` Code</button>
//                 <button className="btn btn-sm btn-outline-secondary">- List</button>
//                 <button className="btn btn-sm btn-outline-secondary">1. Numbered</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
  const [history, setHistory] = useState([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Update history when value changes externally
  useEffect(() => {
    if (value !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(value);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      onChange(newValue);
      
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newValue);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const execCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      try {
        if (value) {
          document.execCommand(command, false, value);
        } else {
          document.execCommand(command, false, null);
        }
        handleInput();
      } catch (error) {
        console.warn(`Command ${command} failed:`, error);
      }
    }
  };

  const insertHTML = (html) => {
    if (editorRef.current) {
      editorRef.current.focus();
      try {
        document.execCommand('insertHTML', false, html);
        handleInput();
      } catch (error) {
        console.warn('Insert HTML failed:', error);
      }
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        insertHTML(`<img src="${event.target.result}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 10px 0;" />`);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
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
      onChange(history[newIndex]);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
      }
    }
  };

  const clearFormatting = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      // Select all text and remove formatting
      document.execCommand('selectAll', false, null);
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
            title="Subscript"
          >
            <FaSubscript />
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('superscript')}
            title="Superscript"
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

          {/* Code Block */}
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => insertHTML('<pre style="background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>// Your code here</code></pre>')}
            title="Insert Code Block"
          >
            <FaCode />
          </button>

          {/* Quote */}
          <button 
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => execCommand('formatBlock', '<blockquote>')}
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
          lineHeight: '1.6'
        }}
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        placeholder="Start writing your content here..."
      />
    </div>
  );
};

// Keep the EditArticle component exactly as you had it
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
      {/* Header and other components remain exactly the same */}
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

      {/* Action Buttons */}
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
            {/* Title Section */}
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

            {/* Rich Text Editor */}
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
}

export default EditArticle;