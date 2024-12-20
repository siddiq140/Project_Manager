import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../slices/ProjectSlice";
import { fetchUser } from "../../slices/UserSlice";
import Analytics from "../analytics/Analytics";
import logoutIcon from "../../assets/icons/logout.svg";
import appIcon from "../../assets/icons/app.svg";
import settingIcon from "../../assets/icons/settings.svg";
import analyticIcon from "../../assets/icons/analytics.svg";
import boardIcon from "../../assets/icons/board.svg";
import styles from "./Sidebar.module.css";
import UpdateUser from "../update-user/UpdateUser";
import Dashboard from "../dashboard/Dashboard";
import LogoutModal from "../../pages/popups/logout/LogoutModal";

const Sidebar = () => {
   const [selectedValue, setSelectedValue] = useState("All");
   const filter = selectedValue;
   const navigate = useNavigate();

   const [logoutModal, setLogoutModal] = useState(false);

   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.userData);
   const { projects, status, error } = useSelector((state) => state.project);

   const token = localStorage.getItem("token");

   const formatDate = (date) => {
      const options = { day: "numeric", month: "short", year: "numeric" };
      return date
         .toLocaleDateString("en-GB", options)
         .replace(/(\d+)(th|st|nd|rd)/, "$1$2");
   };

   const currentDate = formatDate(new Date());

   const location = useLocation();
   const [tab, setTab] = useState("dashboard");

   useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabUrl = urlParams.get("tab");

      if (tabUrl) {
         setTab(tabUrl);
      }
   }, [location.search]);

   useEffect(() => {
      if (token) {
         dispatch(fetchUser(token));
      }
   }, [dispatch, token]);

   useEffect(() => {
      dispatch(fetchProjects({ filter, token }));
   }, [dispatch, filter, token]);

   const handleChange = (e) => {
      setSelectedValue(e.target.value);
   };

   const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/signin");
   };

   const handleCloseLogout = () => {
      setLogoutModal(!logoutModal);
   };

   return (
      <div className={styles.sidebar_main}>
         <div className={styles.sidebar}>
            <div className={styles.sidebar_btn}>
               <div>
                  <img src={appIcon} alt="app-icon" />
                  <h2>Pro Manage</h2>
               </div>
               <div className={tab === "dashboard" && styles.active}>
                  <img src={boardIcon} alt="dashboard" />
                  <Link to="/home?tab=dashboard" className={styles.unactive}>
                     <h3>Dashboard</h3>
                  </Link>
               </div>
               <div className={tab === "analytics" && styles.active}>
                  <img src={analyticIcon} alt="analytics" />
                  <Link to="/home?tab=analytics" className={styles.unactive}>
                     <h3>Analytics</h3>
                  </Link>
               </div>
               <div className={tab === "settings" && styles.active}>
                  <img src={settingIcon} alt="settings" />
                  <Link to="/home?tab=settings" className={styles.unactive}>
                     <h3>Settings</h3>
                  </Link>
               </div>
            </div>
            <div className={styles.sidebar_btn}>
               <div>
                  <img src={logoutIcon} alt="logout" />
                  <h3 onClick={handleCloseLogout}>Logout</h3>
                  {logoutModal && (
                     <LogoutModal
                        onCancel={handleCloseLogout}
                        onConfirm={handleLogout}
                     />
                  )}
               </div>
            </div>
         </div>
         <div className={styles.sidebar_content}>
            {tab === "dashboard" && (
               <div className={styles.sidebar_header}>
                  <h3>Welcome! {user?.name}</h3>
                  <div>
                     <p>{currentDate}</p>
                     <div className={styles.dropdown}>
                        <select value={selectedValue} onChange={handleChange}>
                           <option value="All">All</option>
                           <option value="Today">Today</option>
                           <option value="This Week">This Week</option>
                           <option value="This Month">This Month</option>
                        </select>
                     </div>
                  </div>
               </div>
            )}
            <div className={styles.sidebar_footer}>
               {tab === "analytics" && <Analytics />}
               {tab === "settings" && <UpdateUser />}
               {tab === "dashboard" && (
                  <Dashboard
                     projects={projects}
                     status={status}
                     error={error}
                  />
               )}
               {error && (
                  <p className={styles.errorText}>
                     Error fetching projects: {error}
                  </p>
               )}
            </div>
         </div>
      </div>
   );
};

export default Sidebar;
