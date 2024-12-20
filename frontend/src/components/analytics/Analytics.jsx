import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectCount } from "../../slices/ProjectCountSlice";
import styles from "./Analytics.module.css";

const Analytics = () => {
   const dispatch = useDispatch();
   const { counts, status, error } = useSelector((state) => state.projectCount);
   const token = localStorage.getItem("token");

   const [tab, setTab] = useState("");

   useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabUrl = urlParams.get("tab");

      if (tabUrl) {
         setTab(tabUrl);
      }
   }, [location.search]);

   useEffect(() => {
      if (token) {
         dispatch(fetchProjectCount(token));
      }
   }, [dispatch, token]);

   if (status === "loading") return <p>Loading project count...</p>;
   if (status === "failed") return <p>Error: {error}</p>;

   return (
      <div className={styles.analytics}>
         <div>
            <h1>Analytics</h1>
         </div>

         <div className={styles.count}>
            <div>
               <p>Priority Counts:</p>
               <ul>
                  {counts.priorityCounts.map((priority) => (
                     <li key={priority.priority}>
                        {priority.priority} Priority: {priority.count}
                     </li>
                  ))}
               </ul>

               <p>Status Counts:</p>
               <ul>
                  {counts.statusCounts.map((status) => (
                     <li key={status.status}>
                        {status.status} TASKS: {status.count}
                     </li>
                  ))}
               </ul>
            </div>

            <div>
               <p>Due Date Counts:</p>
               <ul>
                  <li>Overdue: {counts.dueDateCounts.overdue}</li>
                  <li>Due Today: {counts.dueDateCounts.dueToday}</li>
                  <li>Due This Week: {counts.dueDateCounts.dueThisWeek}</li>
                  <li>Due This Month: {counts.dueDateCounts.dueThisMonth}</li>
               </ul>
            </div>
         </div>
      </div>
   );
};

export default Analytics;
