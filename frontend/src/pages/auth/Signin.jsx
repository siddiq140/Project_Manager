import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { loginUser } from "../../services/Api";
import authImg from "../../assets/images/authimg.png";
import lockIcon from "../../assets/icons/lock.svg";
import viewIcon from "../../assets/icons/viewpassword.svg";
import emailIcon from "../../assets/icons/email.svg";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Auth.module.css";

const Signin = () => {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });

   const navigate = useNavigate();

   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);

   const [errors, setErrors] = useState({
      email: "",
      password: "",
   });

   const validateForm = () => {
      let valid = true;
      const newErrors = {
         email: "",
         password: "",
      };

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

      setErrors(newErrors);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      if (validateForm()) {
         try {
            const response = await loginUser(formData);
            localStorage.setItem("token", response.data.token);
            toast.success("Login Successful! Please Wait", {
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
            console.error("Login error:", error);
            toast.error("Incorrect email or password", {
               position: "top-right",
               autoClose: 1500,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "light",
            });
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
            <h1>Login</h1>
            <form className={styles.authForm} onSubmit={handleSubmit}>
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
                  {loading ? "Loading..." : "Login"}
               </button>
            </form>
            <div className={styles.authForm}>
               <p>Don not an account?</p>
               <Link to="/signup" className={styles.authBtn2}>
                  Register
               </Link>
            </div>
         </div>
         {<ToastContainer />}
      </div>
   );
};

export default Signin;
