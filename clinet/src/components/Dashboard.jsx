import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // --- State variables ---
  const [selectedInterviewType, setSelectedInterviewType] = useState("");
  const [scheduledInterviewType, setScheduledInterviewType] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [completedInterviews, setCompletedInterviews] = useState(0);

  // --- Interview durations ---
  const interviewDurations = {
    "Technical Interview": 20,
    "Behavioral Interview": 10,
    "Communication Interview": 30,
  };

  // --- Handle Start Interview ---
  const handleStartInterviewClick = () => {
    if (!selectedInterviewType) {
      alert("Please select an interview type!");
      return;
    }

    navigate("/start-interview", {
      state: { interviewType: selectedInterviewType },
    });
  };

  // --- Handle Schedule Interview ---
  const handleScheduleInterviewSubmit = () => {
    if (!scheduledInterviewType || !scheduledDate || !selectedTime) {
      alert("Please select interview type, date, and time!");
      return;
    }

    alert(
      `${scheduledInterviewType} scheduled on ${new Date(
        `${scheduledDate} ${selectedTime}`
      ).toLocaleString()}`
    );

    // Reset fields
    setScheduledInterviewType("");
    setScheduledDate("");
    setSelectedTime("");
  };

  // --- Handle Progress Update ---
  const handleMarkProgressClick = () => {
    const nextProgress = completedInterviews + 1;
    if (nextProgress > 20) {
      alert("All interviews completed!");
      return;
    }
    setCompletedInterviews(nextProgress);
  };

  // --- Time slots ---
  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary">Dashboard</h2>

      <div className="row g-4">
        {/* --- Card 1: Take Interview --- */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Take Interview</h5>
              <select
                className="form-select mb-3"
                value={selectedInterviewType}
                onChange={(e) => setSelectedInterviewType(e.target.value)}
              >
                <option value="">Select Interview Type</option>
                <option value="Technical Interview">Technical Interview</option>
                <option value="Behavioral Interview">
                  Behavioral Interview
                </option>
                <option value="Communication Interview">
                  Communication Interview
                </option>
              </select>
              <button
                className="btn btn-primary mt-auto"
                onClick={handleStartInterviewClick}
              >
                Start Interview
              </button>
            </div>
          </div>
        </div>

        {/* --- Card 2: Schedule Interview --- */}
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h4 className="text-center mb-4 fw-bold">
              Schedule a Mock Interview
            </h4>

            <div className="row g-4">
              {/* Left Section - Module and Date */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Select Interview Module
                </label>
                <select
                  className="form-select mb-4"
                  value={scheduledInterviewType}
                  onChange={(e) => setScheduledInterviewType(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Technical Interview">Technical</option>
                  <option value="Behavioral Interview">Behavioral</option>
                  <option value="Communication Interview">
                    Communication
                  </option>
                </select>

                {scheduledInterviewType && (
                  <p className="text-muted">
                    Duration: {interviewDurations[scheduledInterviewType]}{" "}
                    minutes
                  </p>
                )}

                <label className="form-label fw-semibold">Select Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>

              {/* Right Section - Time Slots */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Available Time Slots
                </label>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`btn btn-outline-primary ${
                        selectedTime === slot ? "active" : ""
                      }`}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <label className="form-label fw-semibold">
                  Interviewer Preference (Optional)
                </label>
                <select className="form-select mb-4">
                  <option>Any Available</option>
                  <option>Interviewer A</option>
                  <option>Interviewer B</option>
                </select>

                <button
                  className="btn btn-primary w-100 py-2"
                  onClick={handleScheduleInterviewSubmit}
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Card 3: Student Progress --- */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Student Interview Progress</h5>
              <div className="progress mb-3" style={{ height: "25px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${(completedInterviews / 20) * 100}%` }}
                  aria-valuenow={completedInterviews}
                  aria-valuemin="0"
                  aria-valuemax="20"
                >
                  {completedInterviews}/20
                </div>
              </div>
              <button
                className="btn btn-info mt-auto"
                onClick={handleMarkProgressClick}
              >
                Mark Interview Completed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Optional custom style for active time slot --- */}
      <style>{`
        .btn-outline-primary.active {
          background-color: #007bff;
          color: #fff;
          border-color: #007bff;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;









// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   // --- State variables ---
//   const [selectedInterviewType, setSelectedInterviewType] = useState("");
//   const [scheduledInterviewType, setScheduledInterviewType] = useState("");
//   const [scheduledDate, setScheduledDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [completedInterviews, setCompletedInterviews] = useState(0);

//   // --- Interview durations ---
//   const interviewDurations = {
//     "Technical Interview": 20,
//     "Behavioral Interview": 10,
//     "Communication Interview": 30,
//   };

//   // --- Handle Start Interview ---
//   const handleStartInterviewClick = () => {
//     if (!selectedInterviewType) {
//       alert("Please select an interview type!");
//       return;
//     }
//     navigate("/start-interview", { state: { interviewType: selectedInterviewType } });
//   };

//   // --- Handle Schedule Interview ---
//   const handleScheduleInterviewSubmit = () => {
//     if (!scheduledInterviewType || !scheduledDate || !selectedTime) {
//       alert("Please select interview type, date, and time!");
//       return;
//     }
//     alert(
//       `${scheduledInterviewType} scheduled on ${new Date(
//         `${scheduledDate} ${selectedTime}`
//       ).toLocaleString()}`
//     );

//     // Reset fields
//     setScheduledInterviewType("");
//     setScheduledDate("");
//     setSelectedTime("");
//   };

//   // --- Handle Progress Update ---
//   const handleMarkProgressClick = () => {
//     const nextProgress = completedInterviews + 1;
//     if (nextProgress > 20) {
//       alert("All interviews completed!");
//       return;
//     }
//     setCompletedInterviews(nextProgress);
//   };

//   // --- Time slots ---
//   const timeSlots = [
//     "9:00 AM",
//     "9:30 AM",
//     "10:00 AM",
//     "10:30 AM",
//     "11:00 AM",
//     "11:30 AM",
//     "1:00 PM",
//     "1:30 PM",
//     "2:00 PM",
//     "2:30 PM",
//     "3:00 PM",
//     "3:30 PM",
//   ];

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4 text-center text-primary">Dashboard</h2>

//       {/* --- 3 Cards in One Row --- */}
//       <div className="row row-cols-1 row-cols-md-3 g-4">
//         {/* --- Card 1: Take Interview --- */}
//         <div className="col">
//           <div className="card shadow-sm h-100">
//             <div className="card-body d-flex flex-column">
//               <h5 className="card-title mb-3">Take Interview</h5>
//               <select
//                 className="form-select mb-3"
//                 value={selectedInterviewType}
//                 onChange={(e) => setSelectedInterviewType(e.target.value)}
//               >
//                 <option value="">Select Interview Type</option>
//                 <option value="Technical Interview">Technical Interview</option>
//                 <option value="Behavioral Interview">Behavioral Interview</option>
//                 <option value="Communication Interview">Communication Interview</option>
//               </select>
//               <button
//                 className="btn btn-primary mt-auto"
//                 onClick={handleStartInterviewClick}
//               >
//                 Start Interview
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* --- Card 2: Schedule Interview --- */}
//         <div className="col">
//           <div className="card shadow-sm h-100 p-3">
//             <h5 className="text-center mb-3 fw-bold">Schedule a Mock Interview</h5>

//             <label className="form-label fw-semibold">Select Interview Module</label>
//             <select
//               className="form-select mb-3"
//               value={scheduledInterviewType}
//               onChange={(e) => setScheduledInterviewType(e.target.value)}
//             >
//               <option value="">Select</option>
//               <option value="Technical Interview">Technical</option>
//               <option value="Behavioral Interview">Behavioral</option>
//               <option value="Communication Interview">Communication</option>
//             </select>

//             {scheduledInterviewType && (
//               <p className="text-muted mb-2">
//                 Duration: {interviewDurations[scheduledInterviewType]} minutes
//               </p>
//             )}

//             <label className="form-label fw-semibold">Select Date</label>
//             <input
//               type="date"
//               className="form-control mb-3"
//               value={scheduledDate}
//               onChange={(e) => setScheduledDate(e.target.value)}
//             />

//             <label className="form-label fw-semibold">Available Time Slots</label>
//             <div className="d-flex flex-wrap gap-2 mb-3">
//               {timeSlots.map((slot) => (
//                 <button
//                   key={slot}
//                   className={`btn btn-outline-primary btn-sm ${
//                     selectedTime === slot ? "active" : ""
//                   }`}
//                   onClick={() => setSelectedTime(slot)}
//                 >
//                   {slot}
//                 </button>
//               ))}
//             </div>

//             <label className="form-label fw-semibold">
//               Interviewer Preference (Optional)
//             </label>
//             <select className="form-select mb-3">
//               <option>Any Available</option>
//               <option>Interviewer A</option>
//               <option>Interviewer B</option>
//             </select>

//             <button
//               className="btn btn-primary w-100 mt-auto"
//               onClick={handleScheduleInterviewSubmit}
//             >
//               Confirm Schedule
//             </button>
//           </div>
//         </div>

//         {/* --- Card 3: Student Progress --- */}
//         <div className="col">
//           <div className="card shadow-sm h-100">
//             <div className="card-body d-flex flex-column">
//               <h5 className="card-title mb-3">Student Interview Progress</h5>
//               <div className="progress mb-3" style={{ height: "25px" }}>
//                 <div
//                   className="progress-bar"
//                   role="progressbar"
//                   style={{ width: `${(completedInterviews / 20) * 100}%` }}
//                   aria-valuenow={completedInterviews}
//                   aria-valuemin="0"
//                   aria-valuemax="20"
//                 >
//                   {completedInterviews}/20
//                 </div>
//               </div>
//               <button
//                 className="btn btn-info mt-auto"
//                 onClick={handleMarkProgressClick}
//               >
//                 Mark Interview Completed
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
 
//     </div>
//   );
// };

// export default Dashboard;












// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   // --- State variables ---
//   const [selectedInterviewType, setSelectedInterviewType] = useState("");
//   const [scheduledInterviewType, setScheduledInterviewType] = useState("");
//   const [scheduledDate, setScheduledDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [completedInterviews, setCompletedInterviews] = useState(0);

//   const interviewDurations = {
//     "Technical Interview": 20,
//     "Behavioral Interview": 10,
//     "Communication Interview": 30,
//   };

//   const handleStartInterviewClick = () => {
//     if (!selectedInterviewType) {
//       alert("Please select an interview type!");
//       return;
//     }
//     navigate("/start-interview", { state: { interviewType: selectedInterviewType } });
//   };

//   const handleScheduleInterviewSubmit = () => {
//     if (!scheduledInterviewType || !scheduledDate || !selectedTime) {
//       alert("Please select interview type, date, and time!");
//       return;
//     }
//     alert(
//       `${scheduledInterviewType} scheduled on ${new Date(
//         `${scheduledDate} ${selectedTime}`
//       ).toLocaleString()}`
//     );
//     setScheduledInterviewType("");
//     setScheduledDate("");
//     setSelectedTime("");
//   };

//   const handleMarkProgressClick = () => {
//     const nextProgress = completedInterviews + 1;
//     if (nextProgress > 20) {
//       alert("All interviews completed!");
//       return;
//     }
//     setCompletedInterviews(nextProgress);
//   };

//   const timeSlots = [
//     "9:00 AM",
//     "9:30 AM",
//     "10:00 AM",
//     "10:30 AM",
//     "11:00 AM",
//     "11:30 AM",
//     "1:00 PM",
//     "1:30 PM",
//     "2:00 PM",
//     "2:30 PM",
//     "3:00 PM",
//     "3:30 PM",
//   ];

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4 text-center text-primary">Dashboard</h2>

//       {/* 3 Cards per row on desktop */}
//       <div className="row row-cols-1 row-cols-md-3 g-4">
//         {/* --- Card 1: Take Interview --- */}
//         <div className="col">
//           <div className="card shadow-sm p-3">
//             <h5 className="card-title mb-3">Take Interview</h5>
//             <select
//               className="form-select mb-3"
//               value={selectedInterviewType}
//               onChange={(e) => setSelectedInterviewType(e.target.value)}
//             >
//               <option value="">Select Interview Type</option>
//               <option value="Technical Interview">Technical Interview</option>
//               <option value="Behavioral Interview">Behavioral Interview</option>
//               <option value="Communication Interview">Communication Interview</option>
//             </select>
//             <button className="btn btn-primary" onClick={handleStartInterviewClick}>
//               Start Interview
//             </button>
//           </div>
//         </div>

//         {/* --- Card 2: Schedule Interview --- */}
//         <div className="col">
//           <div className="card shadow-sm p-3">
//             <h5 className="text-center mb-3 fw-bold">Schedule a Mock Interview</h5>

//             <label className="form-label fw-semibold">Select Interview Module</label>
//             <select
//               className="form-select mb-3"
//               value={scheduledInterviewType}
//               onChange={(e) => setScheduledInterviewType(e.target.value)}
//             >
//               <option value="">Select</option>
//               <option value="Technical Interview">Technical</option>
//               <option value="Behavioral Interview">Behavioral</option>
//               <option value="Communication Interview">Communication</option>
//             </select>

//             {scheduledInterviewType && (
//               <p className="text-muted mb-2">
//                 Duration: {interviewDurations[scheduledInterviewType]} minutes
//               </p>
//             )}

//             <label className="form-label fw-semibold">Select Date</label>
//             <input
//               type="date"
//               className="form-control mb-3"
//               value={scheduledDate}
//               onChange={(e) => setScheduledDate(e.target.value)}
//             />

//             <label className="form-label fw-semibold">Available Time Slots</label>
//             <div className="d-flex flex-wrap gap-2 mb-3">
//               {timeSlots.map((slot) => (
//                 <button
//                   key={slot}
//                   className={`btn btn-outline-primary btn-sm ${
//                     selectedTime === slot ? "active" : ""
//                   }`}
//                   onClick={() => setSelectedTime(slot)}
//                 >
//                   {slot}
//                 </button>
//               ))}
//             </div>

//             <label className="form-label fw-semibold">
//               Interviewer Preference (Optional)
//             </label>
//             <select className="form-select mb-3">
//               <option>Any Available</option>
//               <option>Interviewer A</option>
//               <option>Interviewer B</option>
//             </select>

//             <button
//               className="btn btn-primary w-100"
//               onClick={handleScheduleInterviewSubmit}
//             >
//               Confirm Schedule
//             </button>
//           </div>
//         </div>

//         {/* --- Card 3: Student Progress --- */}
//         <div className="col">
//           <div className="card shadow-sm p-3">
//             <h5 className="card-title mb-3">Student Interview Progress</h5>
//             <div className="progress mb-3" style={{ height: "25px" }}>
//               <div
//                 className="progress-bar"
//                 role="progressbar"
//                 style={{ width: `${(completedInterviews / 20) * 100}%` }}
//                 aria-valuenow={completedInterviews}
//                 aria-valuemin="0"
//                 aria-valuemax="20"
//               >
//                 {completedInterviews}/20
//               </div>
//             </div>
//             <button
//               className="btn btn-info"
//               onClick={handleMarkProgressClick}
//             >
//               Mark Interview Completed
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- Active button color --- */}
//       <style>{`
//         .btn-outline-primary.active {
//           background-color: #0d6efd;
//           color: white;
//           border-color: #0d6efd;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Dashboard;


