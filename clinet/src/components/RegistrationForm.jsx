import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import registrationImage from "../assets/registrationImage.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    else if (!/^[A-Za-z]+$/.test(formData.firstName))
      newErrors.firstName = "Only letters allowed";

    if (!formData.lastName) newErrors.lastName = "Last name is required";
    else if (!/^[A-Za-z]+$/.test(formData.lastName))
      newErrors.lastName = "Only letters allowed";

    if (!formData.email) newErrors.email = "Email is required";
    else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    )
      newErrors.email = "Invalid email";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Enter valid 10-digit phone number";

    if (!formData.password)
      newErrors.password = "Password is required";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(
        formData.password
      )
    )
      newErrors.password =
        "8-12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char";

    if (!formData.role) newErrors.role = "Please select a role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(formData));
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row shadow rounded overflow-hidden flex-column flex-md-row">
        {/* Left Image */}
        <div className="col-md-6 p-0">
          <img
            src={registrationImage}
            alt="Registration"
            className="img-fluid w-100 image"
           />
          <div className="text-center py-3 bg-light">
            <h4>Join Our Community</h4>
            <p>Create your account to access exclusive features</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="col-md-6 p-4 bg-light d-flex align-items-center flex-column">
          <div className="w-100">
            <h2 className="text-center mb-4 text-primary">Registration Form</h2>

            {success && (
              <div className="alert alert-success text-center">
                Registration Successful! Redirecting to Login...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <label className="form-label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute eye-icon"
                   onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  className={`form-select ${errors.role ? "is-invalid" : ""}`}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                  <option value="Interviewer">Interviewer</option>
                </select>
                {errors.role && <div className="invalid-feedback">{errors.role}</div>}
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Register
              </button>

              <p className="text-center">
                Already have an account? <Link to="/login" className="text-primary">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;





// import React, { useState, useEffect } from "react";
// import registrationImage from "../assets/registrationImage.png";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const RegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     role: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.firstName) newErrors.firstName = "First name is required";
//     else if (!/^[A-Za-z]+$/.test(formData.firstName))
//       newErrors.firstName = "Only letters allowed";

//     if (!formData.lastName) newErrors.lastName = "Last name is required";
//     else if (!/^[A-Za-z]+$/.test(formData.lastName))
//       newErrors.lastName = "Only letters allowed";

//     if (!formData.email) newErrors.email = "Email is required";
//     else if (
//       !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
//     )
//       newErrors.email = "Invalid email";

//     if (!formData.phone) newErrors.phone = "phone number is required";
//     else if (!/^[6-9]\d{9}$/.test(formData.phone))
//       newErrors.phone = "Enter valid 10-digit phone number";

//     if (!formData.password)
//       newErrors.password = "Password is required";
//     else if (
//       !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(
//         formData.password
//       )
//     )
//       newErrors.password =
//         "8-12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char";

//     if (!formData.role) newErrors.role = "Please select a role";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError("");

//     if (validate()) {
//       try {
//         const response = await fetch("http://localhost:8080/api/user", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             firstName: formData.firstName,
//             lastName: formData.lastName,
//             email: formData.email,
//             phone: formData.phone, // backend expects 'phone'
//             password: formData.password,
//             role: formData.role.toUpperCase(), // uppercase for API
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || "Registration failed");
//         }

//         setSuccess(true);
//         setFormData({
//           firstName: "",
//           lastName: "",
//           email: "",
//           phone: "",
//           password: "",
//           role: "",
//         });
//       } catch (error) {
//         setApiError(error.message);
//         setSuccess(false);
//       }
//     } else {
//       setSuccess(false);
//     }
//   };

//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => setSuccess(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [success]);

//   return (
//     <div className="container mt-5">
//       <div className="row shadow rounded overflow-hidden flex-column flex-md-row">
//         {/* Left Image */}
//         <div className="col-md-6 p-0">
//           <img
//             src={registrationImage}
//             alt="Registration"
//             className="img-fluid w-100"
//             style={{ objectFit: "cover", maxHeight: "500px" }}
//           />
//           <div className="text-center py-3 bg-light">
//             <h4>Join Our Professional Community</h4>
//             <p>Create your account to access exclusive features and opportunities</p>
//           </div>
//         </div>

//         {/* Right Form */}
//         <div className="col-md-6 p-4 bg-light d-flex align-items-center flex-column">
//           <div className="w-100">
//             <h2 className="text-center mb-4 text-primary">Registration Form</h2>

//             {success && (
//               <div className="alert alert-success">Registration Successful!</div>
//             )}
//             {apiError && (
//               <div className="alert alert-danger">{apiError}</div>
//             )}

//             <form onSubmit={handleSubmit}>
//               {/* First & Last Name */}
//               <div className="row mb-3">
//                 <div className="col-md-6 mb-3 mb-md-0">
//                   <label className="form-label">First Name</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
//                     placeholder="Enter first name"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                   />
//                   {errors.firstName && (
//                     <div className="invalid-feedback">{errors.firstName}</div>
//                   )}
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Last Name</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
//                     placeholder="Enter last name"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                   />
//                   {errors.lastName && (
//                     <div className="invalid-feedback">{errors.lastName}</div>
//                   )}
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="mb-3">
//                 <label className="form-label">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   className={`form-control ${errors.email ? "is-invalid" : ""}`}
//                   placeholder="Enter email"
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//                 {errors.email && (
//                   <div className="invalid-feedback">{errors.email}</div>
//                 )}
//               </div>

//               {/* phone */}
//               <div className="mb-3">
//                 <label className="form-label">phone Number</label>
//                 <input
//                   type="text"
//                   name="phone"
//                   className={`form-control ${errors.phone ? "is-invalid" : ""}`}
//                   placeholder="Enter phone number"
//                   value={formData.phone}
//                   onChange={handleChange}
//                 />
//                 {errors.phone && (
//                   <div className="invalid-feedback">{errors.phone}</div>
//                 )}
//               </div>

//               {/* Password */}
//               <div className="mb-3 position-relative">
//                 <label className="form-label">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   className={`form-control ${errors.password ? "is-invalid" : ""}`}
//                   placeholder="Enter password"
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//                 <span
//                   className="position-absolute"
//                   style={{ top: "38px", right: "10px", cursor: "pointer" }}
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//                 {errors.password && (
//                   <div className="invalid-feedback">{errors.password}</div>
//                 )}
//               </div>

//               {/* Role */}
//               <div className="mb-4">
//                 <label className="form-label">Role</label>
//                 <select
//                   name="role"
//                   className={`form-select ${errors.role ? "is-invalid" : ""}`}
//                   value={formData.role}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Role</option>
//                   <option value="Student">Student</option>
//                   <option value="Admin">Admin</option>
//                   <option value="Interviewer">Interviewer</option>
//                 </select>
//                 {errors.role && (
//                   <div className="invalid-feedback">{errors.role}</div>
//                 )}
//               </div>

//               {/* Register Button */}
//               <button type="submit" className="btn btn-primary w-100 mb-3">
//                 Register
//               </button>

//               {/* Sign In Link */}
//               <p className="text-center">
//                 Already have an account?{" "}
//                 <a href="/login" className="text-decoration-none text-primary">
//                   Sign in
//                 </a>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegistrationForm;

