import React from "react";
import styles from "./LogoutModal.module.css";

const LogoutModal = ({ onConfirm, onCancel }) => {
   return (
      <div className={styles.overlay}>
         <div className={styles.modal}>
            <p className={styles.message}>Are you sure you want to Logout?</p>
            <div className={styles.actions}>
               <button className={styles.confirmButton} onClick={onConfirm}>
                  Yes, Logout
               </button>
               <button className={styles.cancelButton} onClick={onCancel}>
                  Cancel
               </button>
            </div>
         </div>
      </div>
   );
};

export default LogoutModal;
