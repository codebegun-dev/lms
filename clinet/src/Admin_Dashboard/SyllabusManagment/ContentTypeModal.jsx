// ContentTypeModal.jsx
import { FaPlus } from "react-icons/fa6";

const ContentTypeModal = ({ show, onClose, onSelectType }) => {
  if (!show) return null;

  const contentTypes = [
    {
      type: "Article",
      description: "Add text-based content with rich formatting",
      icon: "📝"
    },
    {
      type: "Recorded video",
      description: "Upload video lectures of any duration, including DRM protection",
      icon: "🎥"
    },
    {
      type: "Coding lab",
      description: "Hands-on coding exercises for DSA/Web development/Data science and more",
      icon: "💻",
      featured: true
    },
    {
      type: "Quiz",
      description: "Test knowledge with multiple choice questions",
      icon: "❓"
    },
    {
      type: "Contest",
      description: "Timed assessment for students with built-in monitoring",
      icon: "⏱️"
    },
    {
      type: "Upload assignment",
      description: "Let students submit files for review, grade it from the dashboard",
      icon: "📤"
    },
    {
      type: "eBook",
      description: "Add non-downloadable books with built-in browser reader",
      icon: "📚"
    },
    {
      type: "SCORM",
      description: "Import SCORM-compliant learning packages",
      icon: "📦"
    },
    {
      type: "Iframe embed",
      description: "Embed external content from any website",
      icon: "🌐"
    },
    {
      type: "Chapter",
      description: "Group related content together",
      icon: "📑"
    }
  ];

  const handleTypeSelect = (type) => {
    onSelectType(type);
    onClose();
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div className="modal-backdrop show"></div>

      {/* Modal */}
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Add course item</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <p className="text-muted mb-4">
                Choose the type of content you want to add to your course:
              </p>
              <div className="row g-3">
                {contentTypes.map((item, index) => (
                  <div key={item.type} className="col-6">
                    {item.type === "Coding lab" && (
                      <div></div>
                    )}

                    <div
                      className="card border cursor-pointer bg-white"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        borderColor: '#dee2e6'
                      }}
                      onClick={() => handleTypeSelect(item.type)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center">
                          <span className="fs-5 me-3">{item.icon}</span>
                          <div className="flex-grow-1">
                            <h6 className={`mb-1 ${item.featured ? 'fw-bold' : ''}`}>
                              {item.type}
                            </h6>
                            <p className="text-muted small mb-0">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {item.type === "Coding lab" && (
                      <div></div>
                    )}
                  </div>
                ))}





              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentTypeModal;