import "./editTask.css";

import React from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/config";

import TitleSection from "./TitleSection";
import SubTasksSection from "./SubTasksSection";

import { useNavigate, useParams } from "react-router-dom";
import Aside from "../../shared/Aside";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Commet } from "react-loading-indicators";

const EditTask = () => {
  const [user, loading, error] = useAuthState(auth);

  let { taskId } = useParams();
  const checkboxComp = async (e) => {
    try {
      await updateDoc(doc(db, user.uid, taskId), {
        completed: e.target.checked,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  const checkboxper = async (e) => {
    try {
      await updateDoc(doc(db, user.uid, taskId), {
        priority: e.target.checked,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const deleteTask = async () => {
    await deleteDoc(doc(db, user.uid, taskId));
  };

  if (error) {
    return <h1>Error : {error.message}</h1>;
  }

  if (loading) {
    return (
      <Commet
        color="#ffffff"
        size="medium"
        text=""
        textColor=""
        className="d-flex justify-content-center col"
      />
    );
  }

  if (user) {
    return (
      <div className="view">
        <Aside />
        <div className="edit-task">
          <TitleSection user={user} taskId={taskId} />

          <SubTasksSection
            user={user}
            taskId={taskId}
            checkboxComp={checkboxComp}
            checkboxper={checkboxper}
            deleteTask={deleteTask}
          />
        </div>
      </div>
    );
  }
};

export default EditTask;
