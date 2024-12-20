import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import authImg from "../../assets/images/authimg.png";
import lockIcon from "../../assets/icons/lock.svg";
import userIcon from "../../assets/icons/user.svg";
import viewIcon from "../../assets/icons/viewpassword.svg";
import emailIcon from "../../assets/icons/email.svg";
import { registerUser } from "../../services/Api";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Auth.module.css";

const Signup = () => {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
   });

   const navigate = useNavigate();

   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [apiError, setApiError] = useState("");

   const [errors, setErrors] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
   });

   useEffect(() => {
      setApiError("");
   }, [formData.email]);

   const validateForm = () => {
      let valid = true;
      const newErrors = {
         name: "",
         email: "",
         password: "",
         confirmPassword: "",
      };

      if (!formData.name) {
         newErrors.name = "Name is required";
         valid = false;
      }

      const emailRegex = /\S+@\S+\.\S+/;
      if (!formData.email) {
         newErrors.email = "Email is required";
         valid = false;
      } else if (!emailRegex.test(formData.email)) {
         newErrors.email = "Invalid email format";
         valid = false;
      }

      if (!formData.password) {
         newErrors.password = "Password is required";
         valid = false;
      } else if (formData.password.length < 6) {
         newErrors.password = "Password must be at least 6 characters";
         valid = false;
      }

      if (!formData.confirmPassword) {
         newErrors.confirmPassword = "Confirm Password is required";
         valid = false;
      } else if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = "Passwords do not match";
         valid = false;
      }

      setErrors(newErrors);
      return valid;
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      const newErrors = { ...errors };

      if (name === "name" && value.trim() !== "") {
         newErrors.name = "";
      }

      if (name === "email") {
         const emailRegex = /\S+@\S+\.\S+/;
         if (emailRegex.test(value)) {
            newErrors.email = "";
         }
      }

      if (name === "password" && value.length >= 6) {
         newErrors.password = "";
      }

      if (name === "confirmPassword" && value === formData.password) {
         newErrors.confirmPassword = "";
      }

      setErrors(newErrors);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setApiError("");

      if (validateForm()) {
         try {
            const res = await registerUser(formData);
            localStorage.setItem("token", res.data.token);
            toast.success("Signup Successful! Please Wait", {
               position: "top-right",
               autoClose: 100,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "light",
               onClose: () => {
                  navigate("/home");
               },
            });
         } catch (error) {
            if (error.response && error.response.status === 400) {
               setApiError("User already exists");
            } else {
               setApiError("An error occurred. Please try again.");
            }
         } finally {
            setLoading(false);
         }
      } else {
         setLoading(false);
      }
   };

   return (
      <div className={styles.auth}>
         <div className={styles.auth_img}>
            <div>
               <img src={authImg} alt="auth" />
            </div>
            <div className={styles.auth_content}>
               <h3>Welcome aboard my friend</h3>
               <p>Just a couple of clicks and we start!</p>
            </div>
         </div>
         <div className={styles.authFormContainer}>
            <h1>Register</h1>
            {apiError && <p className={styles.error}>{apiError}</p>}
            <form className={styles.authForm} onSubmit={handleSubmit}>
               <label htmlFor="name">
                  <img src={userIcon} alt="user-icon" />
                  <input
                     type="text"
                     placeholder="Name"
                     name="name"
                     id="name"
                     value={formData.name}
                     onChange={handleInputChange}
                     required
                  />
               </label>
               {errors.name && <p className={styles.error}>{errors.name}</p>}

               <label htmlFor="email">
                  <img src={emailIcon} alt="email-icon" />
                  <input
                     type="email"
                     placeholder="Email"
                     name="email"
                     id="email"
                     value={formData.email}
                     onChange={handleInputChange}
                     required
                  />
               </label>
               {errors.email && <p className={styles.error}>{errors.email}</p>}

               <label htmlFor="confirm-password">
                  <img src={lockIcon} alt="lock" />
                  <input
                     type={showConfirmPassword ? "text" : "password"}
                     placeholder="Confirm Password"
                     name="confirmPassword"
                     id="confirm-password"
                     value={formData.confirmPassword}
                     onChange={handleInputChange}
                     required
                  />
                  <img
                     onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                     }
                     src={viewIcon}
                     alt="view"
                  />
               </label>
               {errors.confirmPassword && (
                  <p className={styles.error}>{errors.confirmPassword}</p>
               )}

               <label htmlFor="password">
                  <img src={lockIcon} alt="lock" />
                  <input
                     type={showPassword ? "text" : "password"}
                     placeholder="Password"
                     name="password"
                     id="password"
                     value={formData.password}
                     onChange={handleInputChange}
                     required
                  />
                  <img
                     onClick={() => setShowPassword(!showPassword)}
                     src={viewIcon}
                     alt="view"
                  />
               </label>
               {errors.password && (
                  <p className={styles.error}>{errors.password}</p>
               )}

               <button
                  className={styles.authBtn}
                  type="submit"
                  disabled={loading}
               >
                  {loading ? "Registering..." : "Register"}
               </button>
            </form>
            <div className={styles.authForm}>
               <p>Have an account?</p>
               <Link to="/signin" className={styles.authBtn2}>
                  Log In
               </Link>
            </div>
         </div>
         {<ToastContainer />}
      </div>
   );
};

export default Signup;
