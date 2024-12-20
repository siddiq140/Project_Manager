import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { updateChecklist } from "../../services/Api";
import { fetchProjects } from "../../slices/ProjectSlice";
import { updateProjectStatus, deleteProject } from "../../slices/ProjectSlice";
import EditTask from "../../pages/popups/edit-task/EditTask";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../pages/popups/delete/DeleteModal";
import styles from "./TaskCard.module.css";

const TaskCard = ({ project, isAllCollapsed, resetAllCollapsed }) => {
   const [isCollapsed, setIsCollapsed] = useState(true);
   const [tasks, setTasks] = useState(project.checkList);
   const [projectStatus, setProjectStatus] = useState(project.status);
   const [loading, setLoading] = useState(false);
   const [dropdown, setDropdown] = useState(false);
   const [editTask, setEditTask] = useState(false);
   const [deleteModal, setDeleteModal] = useState(false);

   const copyToast = () => {
      toast.success(" Link copied to clipboard!", {
         position: "top-right",
         autoClose: 1500,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "light",
      });
   };

   const deleteToast = () => {
      toast.success("Project Deleted Successfully", {
         position: "top-right",
         autoClose: 1200,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "light",
      });
   };

   const toggleDeleteModal = () => {
      setDeleteModal(!deleteModal);
   };

   const handleEditTaskToggle = () => {
      setEditTask(!editTask);
   };

   useEffect(() => {
      if (isAllCollapsed) {
         setIsCollapsed(true);
         resetAllCollapsed();
      }
   }, [isAllCollapsed, resetAllCollapsed]);

   const dispatch = useDispatch();
   const token = localStorage.getItem("token");

   const handleCheckboxChange = async (taskIndex, isDone) => {
      try {
         updateChecklist(project._id, taskIndex, isDone);

         const updatedTasks = tasks.map((task, index) => {
            if (index === taskIndex) {
               return { ...task, done: isDone };
            }
            return task;
         });

         setTasks(updatedTasks);
      } catch (error) {
         console.error("Failed to update task:", error.message);
      }
   };

   const formatDate = (date) => {
      const options = { day: "numeric", month: "short" };
      return new Date(date).toLocaleDateString("en-GB", options);
   };

   const isDueToday = (dueDate) => {
      const today = new Date().toISOString().split("T")[0];
      return dueDate === today;
   };

   const toggleCollapse = () => {
      setIsCollapsed((prev) => !prev);
   };

   const highlightDueDate =
      project.priority === "High" || isDueToday(project.dueDate);

   const handleUpdateStatus = async (projectId, status) => {
      setLoading(true);
      try {
         const updatedProject = await dispatch(
            updateProjectStatus({ projectId: projectId, status })
         ).unwrap();
         setProjectStatus(updatedProject.status);
         dispatch(fetchProjects({ filter: "All", token }));
      } catch (error) {
         console.error("Failed to update project status:", error.message);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async () => {
      try {
         await dispatch(deleteProject({ projectId: project._id }));

         dispatch(fetchProjects({ filter: "All", token }));
         deleteToast();
      } catch (error) {
         toast.error("Failed to delete project", {
            position: "top-right",
            autoClose: 1500,
         });
         console.error("Error deleting project:", error);
      }
   };

   const handleCopy = (projectId) => {
      const taskLink = `https://project-manager-ten-gamma.vercel.app/share/${projectId}`;
      navigator.clipboard.writeText(taskLink);

      copyToast().catch((error) => {
         console.log(error);
      });
   };

   const getPriorityClass = () => {
      if (project.priority === "High") return styles.highPriority;
      if (project.priority === "Moderate") return styles.moderatePriority;
      if (project.priority === "Low") return styles.lowPriority;
      return "";
   };

   const getDueDateClass = () => {
      if (projectStatus === "DONE") return styles.doneDueDate;
      if (project.priority === "High" || isDueToday(project.dueDate))
         return styles.highDueDate;
      return styles.defaultDueDate;
   };

   return (
      <div className={styles.card}>
         <div className={styles.header}>
            <div>
               <span
                  className={`${styles.priorityDot} ${getPriorityClass()}`}
               ></span>
               <span className={`${styles.priority} ${getPriorityClass()}`}>
                  {project.priority} Priority
               </span>
            </div>
            <button
               onClick={() => setDropdown((prev) => !prev)}
               className={styles.optionsButton}
            >
               •••
            </button>
            {dropdown && (
               <div className={styles.actionDd}>
                  <div onClick={() => handleCopy(project._id)}>Share</div>
                  <div onClick={handleEditTaskToggle}>Edit</div>
                  <div onClick={toggleDeleteModal}>Delete</div>
                  {deleteModal && (
                     <DeleteModal
                        onCancel={toggleDeleteModal}
                        onConfirm={handleDelete}
                     />
                  )}
               </div>
            )}
         </div>
         <h2 className={styles.title}>{project.title}</h2>
         <div className={styles.checklistHeader}>
            <span>
               Checklist ({tasks.filter((task) => task.done).length}/
               {tasks.length})
            </span>
            <button onClick={toggleCollapse} className={styles.collapseButton}>
               {isCollapsed ? "⬇" : "⬆"}
            </button>
         </div>
         {!isCollapsed && (
            <div className={styles.checklist}>
               {tasks.map((task, index) => (
                  <div key={index} className={styles.task}>
                     <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => handleCheckboxChange(index, !task.done)}
                     />
                     <span>{task.checkList || task.description}</span>
                  </div>
               ))}
            </div>
         )}
         <div className={styles.footer}>
            <div className={`${styles.date} ${getDueDateClass()}`}>
               {formatDate(project.dueDate)}
            </div>
            <div className={styles.statusContainer}>
               {projectStatus === "TODO" && (
                  <>
                     <button
                        onClick={() =>
                           handleUpdateStatus(project._id, "BACKLOG")
                        }
                        disabled={loading}
                        className={styles.button}
                     >
                        Backlog
                     </button>
                     <button
                        onClick={() =>
                           handleUpdateStatus(project?._id, "PROGRESS")
                        }
                        disabled={loading}
                        className={styles.button}
                     >
                        Progress
                     </button>
                     <button
                        onClick={() => handleUpdateStatus(project?._id, "DONE")}
                        disabled={loading}
                        className={styles.button}
                     >
                        Done
                     </button>
                  </>
               )}
               {projectStatus === "PROGRESS" && (
                  <>
                     <button
                        onClick={() =>
                           handleUpdateStatus(project?._id, "BACKLOG")
                        }
                        disabled={loading}
                        className={styles.button}
                     >
                        Backlog
                     </button>
                     <button
                        onClick={() => handleUpdateStatus(project?._id, "TODO")}
                        disabled={loading}
                        className={styles.button}
                     >
                        To-Do
                     </button>
                     <button
                        onClick={() => handleUpdateStatus(project?._id, "DONE")}
                        disabled={loading}
                        className={styles.button}
                     >
                        Done
                     </button>
                  </>
               )}
               {projectStatus === "DONE" && (
                  <>
                     <button
                        onClick={() =>
                           handleUpdateStatus(project?._id, "BACKLOG")
                        }
                        disabled={loading}
                        className={styles.button}
                     >
                        Backlog
                     </button>
                     <button
                        onClick={() => handleUpdateStatus(project?._id, "TODO")}
                        disabled={loading}
                        className={styles.button}
                     >
                        To-Do
                     </button>
                     <button
                        onClick={() =>
                           handleUpdateStatus(project?._id, "PROGRESS")
                        }
                        disabled={loading}
                        className={styles.button}
                     >
                        Progress
                     </button>
                  </>
               )}
               {projectStatus === "BACKLOG" && (
                  <>
                     <button
                        onClick={() => handleUpdateStatus(project?._id, "DONE")}
                        disabled={loading}
                        className={styles.button}
                     >
                        Done
                     </button>
                     <button
                        onClick={() => handleUpdateStatus(project?._id, "TODO")}
                        disabled={loading}
                        className={styles.button}
                     >
                        To-Do
                     </button>
                     <button
                        onClick={() =>
                           handleUpdateStatus(project?._id, "PROGRESS")
                        }
                        disabled={loading}
                        className={styles.button}
                     >
                        Progress
                     </button>
                  </>
               )}
            </div>
         </div>
         {editTask && (
            <EditTask projectId={project._id} onClose={handleEditTaskToggle} />
         )}

         {<ToastContainer />}
      </div>
   );
};

export default TaskCard;
