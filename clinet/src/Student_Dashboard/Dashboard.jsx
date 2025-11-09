import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    setFullName(name || "Student");
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-5">
          <h2 className="card-title text-primary mb-3">Hi, welcome {fullName}!</h2>
          <p className="card-text text-muted fs-5 mb-4">
            This is your dashboard. Here you can view your scheduled interviews, start mock interviews, 
            track your progress, and manage your profile.
          </p>
 
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
