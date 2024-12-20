import React from "react";
import styles from "./DeleteModal.module.css";

const DeleteModal = ({ onConfirm, onCancel }) => {
   return (
      <div className={styles.overlay}>
         <div className={styles.modal}>
            <p className={styles.message}>Are you sure you want to Logout?</p>
            <div className={styles.actions}>
               <button className={styles.confirmButton} onClick={onConfirm}>
                  Yes, Delete
               </button>
               <button className={styles.cancelButton} onClick={onCancel}>
                  Cancel
               </button>
            </div>
         </div>
      </div>
   );
};

export default DeleteModal;
