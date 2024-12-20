import { useState } from "react";
import collapseIcon from "../../assets/icons/collapse.svg";
import TaskCard from "../task-card/TaskCard";
import CreateTask from "../../pages/popups/create-project/CreateTask";
import styles from "./Dashboard.module.css";

const Dashboard = ({ projects, status, error }) => {
   const [createTaskPopup, setCreateTaskPopup] = useState(false);
   const [isAllCollapsed, setIsAllCollapsed] = useState(false);

   const handleCollapseAll = () => {
      setIsAllCollapsed(true);
   };

   if (status === "loading") return <p>Loading project...</p>;
   if (status === "failed") return <p>Error: {error}</p>;

   return (
      <div className={styles.dashboard}>
         <h2>Board</h2>
         <div className={styles.boardContainer}>
            <div className={styles.board}>
               <div className={styles.head}>
                  <h2>Backlog</h2>
                  <div>
                     <img
                        src={collapseIcon}
                        alt="collapse"
                        onClick={handleCollapseAll}
                     />
                  </div>
               </div>
               {status === "succeeded" &&
                  projects &&
                  projects
                     ?.filter((project) => project.status === "BACKLOG")
                     .map((project) => (
                        <TaskCard
                           key={project._id}
                           project={project}
                           isAllCollapsed={isAllCollapsed}
                           resetAllCollapsed={() => setIsAllCollapsed(false)}
                        />
                     ))}
            </div>
            <div className={styles.board}>
               <div className={styles.head}>
                  <h2>TODO</h2>
                  <div>
                     <button
                        onClick={() => setCreateTaskPopup((prev) => !prev)}
                     >
                        +
                     </button>
                     <img
                        src={collapseIcon}
                        alt="collapse"
                        onClick={handleCollapseAll}
                     />
                  </div>
               </div>
               {createTaskPopup && (
                  <CreateTask onClose={() => setCreateTaskPopup(false)} />
               )}
               {projects &&
                  projects
                     ?.filter((project) => project.status === "TODO")
                     .map((project) => (
                        <TaskCard
                           key={project._id}
                           project={project}
                           isAllCollapsed={isAllCollapsed}
                           resetAllCollapsed={() => setIsAllCollapsed(false)}
                        />
                     ))}
            </div>
            <div className={styles.board}>
               <div className={styles.head}>
                  <h2>Progress</h2>
                  <div>
                     <img
                        src={collapseIcon}
                        alt="collapse"
                        onClick={handleCollapseAll}
                     />
                  </div>
               </div>
               {projects &&
                  projects
                     ?.filter((project) => project.status === "PROGRESS")
                     .map((project) => (
                        <TaskCard
                           key={project._id}
                           project={project}
                           isAllCollapsed={isAllCollapsed}
                           resetAllCollapsed={() => setIsAllCollapsed(false)}
                        />
                     ))}
            </div>
            <div className={styles.board}>
               <div className={styles.head}>
                  <h2>Done</h2>
                  <div>
                     <img
                        src={collapseIcon}
                        alt="collapse"
                        onClick={handleCollapseAll}
                     />
                  </div>
               </div>
               {projects &&
                  projects
                     ?.filter((project) => project.status === "DONE")
                     .map((project) => (
                        <TaskCard
                           key={project._id}
                           project={project}
                           isAllCollapsed={isAllCollapsed}
                           resetAllCollapsed={() => setIsAllCollapsed(false)}
                        />
                     ))}
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
