import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { updateUser } from "../../services/Api";
import { fetchUser } from "../../slices/UserSlice";
import lockIcon from "../../assets/icons/lock.svg";
import userIcon from "../../assets/icons/user.svg";
import viewIcon from "../../assets/icons/viewpassword.svg";
import emailIcon from "../../assets/icons/email.svg";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Updateuser.module.css";

const UpdateUser = () => {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      newPassword: "",
      oldPassword: "",
   });

   const dispatch = useDispatch();

   const token = localStorage.getItem("token");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState({
      name: "",
      email: "",
      newPassword: "",
      oldPassword: "",
   });

   const validateForm = () => {
      let valid = true;
      const newErrors = {
         name: "",
         email: "",
         newPassword: "",
         oldPassword: "",
      };

      const filledFields = Object.keys(formData).filter(
         (key) => formData[key].trim() !== ""
      );
      if (filledFields.length > 1) {
         newErrors[filledFields[1]] =
            "Only one field can be updated at a time.";
         valid = false;
      } else {
         if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
            valid = false;
         }
         if (formData.newPassword && formData.newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters";
            valid = false;
         }
         if (formData.newPassword && !formData.oldPassword) {
            newErrors.oldPassword =
               "Old password is required to set a new password";
            valid = false;
         }
      }

      setErrors(newErrors);
      return valid;
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      const newErrors = { ...errors };
      if (name === "name" && value.trim()) newErrors.name = "";
      if (name === "email" && /\S+@\S+\.\S+/.test(value)) newErrors.email = "";
      if (name === "newPassword" && value.length >= 6)
         newErrors.newPassword = "";
      if (name === "oldPassword") newErrors.oldPassword = "";

      setErrors(newErrors);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      if (validateForm()) {
         try {
            const filledField = Object.keys(formData).find(
               (key) => formData[key].trim() !== ""
            );

            const singleFieldData = { [filledField]: formData[filledField] };

            await updateUser(singleFieldData, token);
            dispatch(fetchUser(token));
            toast.success(" User Updated", {
               position: "top-right",
               autoClose: 1500,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "light",
            });
         } catch (error) {
            console.log(error);
         } finally {
            setLoading(false);
         }
      } else {
         setLoading(false);
      }
   };

   return (
      <div className={styles.update}>
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
               />
            </label>
            {errors.name && <p className={styles.error}>{errors.name}</p>}

            <label htmlFor="email">
               <img src={emailIcon} alt="email-icon" />
               <input
                  type="email"
                  placeholder="Update Email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
               />
            </label>
            {errors.email && <p className={styles.error}>{errors.email}</p>}

            <label htmlFor="oldPassword">
               <img src={lockIcon} alt="lock" />
               <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Old Password"
                  name="oldPassword"
                  id="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
               />
               <img
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  src={viewIcon}
                  alt="view"
               />
            </label>
            {errors.oldPassword && (
               <p className={styles.error}>{errors.oldPassword}</p>
            )}

            <label htmlFor="newPassword">
               <img src={lockIcon} alt="lock" />
               <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  name="newPassword"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
               />
               <img
                  onClick={() => setShowPassword(!showPassword)}
                  src={viewIcon}
                  alt="view"
               />
            </label>
            {errors.newPassword && (
               <p className={styles.error}>{errors.newPassword}</p>
            )}

            <button className={styles.authBtn} type="submit" disabled={loading}>
               {loading ? "Updating..." : "Update"}
            </button>
         </form>
         {<ToastContainer />}
      </div>
   );
};

export default UpdateUser;
