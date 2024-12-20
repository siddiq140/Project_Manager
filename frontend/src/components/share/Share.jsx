import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById } from "../../services/Api";
import styles from "./Share.module.css";

const Share = () => {
   const { projectId } = useParams();

   const [formData, setFormData] = useState({
      title: "",
      priority: "",
      checklist: [],
      assignTo: "",
      dueDate: "",
   });

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
               checklist: project?.data?.checkList || [],
               assignTo: project?.data.assignTo?.email || "",
               dueDate: dueDate,
            });
         } catch (error) {
            console.error("Error fetching project:", error);
         }
      };

      loadProjectData();
   }, [projectId]);

   return (
      <div className={styles.projectOverview}>
         <div className={styles.priority}>{formData.priority} Priority</div>

         <h2 className={styles.title}>{formData.title}</h2>

         <div className={styles.checklist}>
            <p>
               Checklist (
               {formData.checklist.filter((item) => item.done).length}/
               {formData.checklist.length})
            </p>
            {formData.checklist.length > 0 ? (
               formData.checklist.map((item) => (
                  <div key={item._id} className={styles.completed}>
                     <input type="checkbox" checked={item.done} readOnly />
                     <label>{item.description}</label>
                  </div>
               ))
            ) : (
               <p>No checklist items available.</p>
            )}
         </div>

         <div className={styles.dueDateSection}>
            <span>Due Date</span>
            <div className={styles.dueDateBadge}>{formData.dueDate}</div>
         </div>
      </div>
   );
};

export default Share;
