import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchUser, fetchProjectById } from "../../../services/Api";
import { editProject } from "../../../slices/ProjectSlice";
import { fetchProjects } from "../../../slices/ProjectSlice";
import styles from "../create-project/CreateTask.module.css";

function EditTask({ projectId, onClose }) {
   const dispatch = useDispatch();

   const [formData, setFormData] = useState({
      title: "",
      priority: "",
      checklist: [],
      assignTo: "",
      dueDate: "",
   });

   const [errors, setErrors] = useState({});
   const [newChecklistItem, setNewChecklistItem] = useState("");
   const [showDropdown, setShowDropdown] = useState(false);
   const [users, setUsers] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [loadingUsers, setLoadingUsers] = useState(true);
   const [id, setId] = useState("");

   useEffect(() => {
      const loadProjectData = async () => {
         try {
            const project = await fetchProjectById(projectId);
            const dueDate = project?.data.dueDate
               ? new Date(project.data.dueDate).toISOString().split("T")[0]
               : "";
            setFormData({
               title: project?.data.title || "",
               priority: project?.data.priority || "",
               checklist: project?.data.checkList || [],
               assignTo: project?.data.assignTo?.email || "",
               dueDate: dueDate,
            });

            setId(project?.data._id);
         } catch (error) {
            console.error("Error fetching project:", error);
         }
      };

      const loadUsers = async () => {
         try {
            setLoadingUsers(true);
            const response = await fetchUser();
            setUsers(response.data);
         } catch (error) {
            console.error("Error fetching users:", error);
         } finally {
            setLoadingUsers(false);
         }
      };

      loadProjectData();
      loadUsers();
   }, [projectId]);

   const handleInputChange = useCallback(
      (e) => {
         const { name, value } = e.target;
         setFormData({ ...formData, [name]: value });
         if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
         }
      },
      [formData, errors]
   );

   const handleAddChecklist = () => {
      if (newChecklistItem.trim() === "") return;
      if (
         formData.checklist.some(
            (item) => item.description === newChecklistItem
         )
      ) {
         setErrors((prev) => ({ ...prev, checklist: "Item already exists." }));
         return;
      }
      setFormData((prevFormData) => ({
         ...prevFormData,
         checklist: [
            ...prevFormData.checklist,
            { description: newChecklistItem },
         ],
      }));
      setNewChecklistItem("");
      setErrors((prev) => ({ ...prev, checklist: "" }));
   };

   const handleRemoveChecklist = (index) => {
      const updatedChecklist = formData.checklist.filter((_, i) => i !== index);
      setFormData({ ...formData, checklist: updatedChecklist });
   };

   const handleAssignToClick = () => {
      setShowDropdown((prev) => !prev);
   };

   const handleSelectEmail = (email) => {
      setFormData({ ...formData, assignTo: email });
      setShowDropdown(false);
   };

   const handlePriorityChange = (priority) => {
      setFormData({ ...formData, priority });
      setErrors((prevErrors) => ({ ...prevErrors, priority: "" }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      let newErrors = {};

      if (!formData.title) newErrors.title = "Title is required";
      if (!formData.priority) newErrors.priority = "Priority is required";
      if (formData.checklist.length === 0)
         newErrors.checklist = "At least one checklist item is required";

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
         setIsSubmitting(true);
         const token = localStorage.getItem("token");
         try {
            dispatch(editProject({ projectId: id, updatedData: formData }));
            dispatch(fetchProjects({ filter: "All", token }));
            onClose();
         } catch (error) {
            console.error("Error updating project:", error);
         } finally {
            setIsSubmitting(false);
         }
      }
   };

   return (
      <div className={styles.popupOverlay}>
         <div className={styles.popupForm}>
            <form onSubmit={handleSubmit} className={styles.form}>
               <div>
                  <label className={styles.label} htmlFor="title">
                     Title *
                  </label>
                  <input
                     type="text"
                     id="title"
                     name="title"
                     value={formData.title}
                     onChange={handleInputChange}
                     className={`${styles.textInput} ${
                        errors.title ? styles.errorInput : ""
                     }`}
                  />
                  {errors.title && (
                     <p className={styles.errorText}>{errors.title}</p>
                  )}
               </div>

               <div className={styles.formGroup}>
                  <label className={styles.label}>Select Priority *</label>
                  <div className={styles.priorityButtons}>
                     {["High", "Moderate", "Low"].map((priority) => (
                        <button
                           key={priority}
                           type="button"
                           className={`${styles.priorityButton} ${
                              formData.priority === priority
                                 ? styles.selected
                                 : ""
                           }`}
                           onClick={() => handlePriorityChange(priority)}
                        >
                           {priority} Priority
                        </button>
                     ))}
                  </div>
                  {errors.priority && (
                     <p className={styles.errorText}>{errors.priority}</p>
                  )}
               </div>

               <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="assignTo">
                     Assign To
                  </label>
                  <div className={styles.dropdownContainer}>
                     <input
                        type="text"
                        id="assignTo"
                        name="assignTo"
                        value={formData.assignTo}
                        onChange={handleInputChange}
                        onClick={handleAssignToClick}
                        className={`${styles.dropdwnInput} ${
                           errors.assignTo ? styles.errorInput : ""
                        }`}
                        readOnly
                     />
                     {showDropdown && (
                        <ul className={styles.dropdownList}>
                           {loadingUsers ? (
                              <li>Loading users...</li>
                           ) : users.length > 0 ? (
                              users.map((user, index) => (
                                 <li
                                    key={index}
                                    onClick={() =>
                                       handleSelectEmail(user.email)
                                    }
                                    className={styles.dropdownItem}
                                 >
                                    {user}
                                 </li>
                              ))
                           ) : (
                              <li className={styles.dropdownItem}>
                                 No users available
                              </li>
                           )}
                        </ul>
                     )}
                  </div>
               </div>

               <div>
                  <label className={styles.label}>
                     Checklist({formData.checklist.length}) *
                  </label>
                  {formData.checklist.map((item, index) => (
                     <div key={index} className={styles.checklistItem}>
                        <span>{item.description}</span>
                        <button
                           type="button"
                           className={styles.deleteChecklistBtn}
                           onClick={() => handleRemoveChecklist(index)}
                        >
                           🗑
                        </button>
                     </div>
                  ))}
                  <input
                     type="text"
                     value={newChecklistItem}
                     onChange={(e) => setNewChecklistItem(e.target.value)}
                     className={styles.textInput}
                     placeholder="Enter checklist item"
                  />
                  <button
                     type="button"
                     className={styles.addChecklistBtn}
                     onClick={handleAddChecklist}
                  >
                     + Add New
                  </button>
                  {errors.checklist && (
                     <p className={styles.errorText}>{errors.checklist}</p>
                  )}
               </div>

               <div className={styles.formActions}>
                  <div>
                     <label className={styles.label} htmlFor="dueDate">
                        Select Due Date *
                     </label>
                     <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        className={`${styles.textInput} ${
                           errors.dueDate ? styles.errorInput : ""
                        }`}
                     />
                     {errors.dueDate && (
                        <p className={styles.errorText}>{errors.dueDate}</p>
                     )}
                  </div>
                  <button
                     type="button"
                     className={styles.cancelBtn}
                     onClick={onClose}
                     disabled={isSubmitting}
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className={styles.saveBtn}
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default EditTask;
