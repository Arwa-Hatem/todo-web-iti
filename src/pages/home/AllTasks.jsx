import React, { useState, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import {
  MdModeEditOutline,
  MdOutlineDone,
  MdDeleteOutline,
} from "react-icons/md";
import { LuBellPlus } from "react-icons/lu";
import TaskViewmodal from "./TaskViewmodal";
import { BsDot } from "react-icons/bs";
import { Commet } from "react-loading-indicators";
import moment from "moment";

export default function AllTasks({ user }) {
  const navigate = useNavigate();
  const [showtaskModal, setshowtaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [currentTime, setCurrentTime] = useState(moment());

  const closetaskmodal = () => {
    setshowtaskModal(false);
    setSelectedTask(null);
  };

  const [value, loading, error] = useCollection(
    query(
      collection(db, user.uid),
      where("priority", "==", false),
      where("completed", "==", false)
    )
  );

  const updateCompleted = async (taskId) => {
    try {
      await updateDoc(doc(db, user.uid, taskId), {
        completed: true,
      });
      console.log(`Task ${taskId} completed status set to true.`);
    } catch (error) {
      console.error("Error updating completed status: ", error);
    }
  };

  const updatePriority = async (taskId) => {
    try {
      await updateDoc(doc(db, user.uid, taskId), {
        priority: true,
      });
      console.log(`Task ${taskId} priority status set to true.`);
    } catch (error) {
      console.error("Error updating priority status: ", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, user.uid, taskId));
      console.log(`Task ${taskId} deleted.`);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <Commet
        color="#ffffff"
        size="small"
        text=""
        textColor=""
        className="d-flex justify-content-center col"
      />
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (value.docs.length > 0) {
    return (
      <div className="alltasks">
        <h1>Your Tasks</h1>

        {value.docs.map((item, index) => {
          return (
            <div
              key={item.id}
              onClick={() => {
                setSelectedTask(item.data());
                setshowtaskModal(true);
              }}
              className="task-item"
            >
              <div className="new-section">
                <div className="list">
                  <h4 className="pagination">{index + 1}</h4>
                  <h2>{`Title : ${item.data().title}`}</h2>

                  {item.data().data.map((subtask, index) => {
                    if (index < 2) {
                      return (
                        <p key={index}>
                          <span>
                            <BsDot />
                          </span>
                          {subtask}
                        </p>
                      );
                    } else {
                      return null;
                    }
                  })}

                  <>
                    <div className="time">
                      <p>{moment(item.data().createdAt).from(currentTime)}</p>
                    </div>
                    <button
                      className="perbtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setshowtaskModal(false);

                        updatePriority(item.id);
                      }}
                    >
                      <span>
                        <LuBellPlus style={{ color: "#000000" }} />
                      </span>
                      priority
                    </button>
                    <div className="icons">
                      <MdModeEditOutline
                        style={{ color: "#000000" }}
                        className="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-task/${item.id}`);
                        }}
                      />
                      <MdOutlineDone
                        style={{ color: "#6BDA83" }}
                        className="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setshowtaskModal(false);
                          updateCompleted(item.id);
                        }}
                      />
                      <MdDeleteOutline
                        style={{ color: "#F9252570" }}
                        className="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(item.id);
                          setshowtaskModal(false);
                        }}
                      />
                    </div>
                  </>
                </div>
              </div>
            </div>
          );
        })}
        {showtaskModal && (
          <TaskViewmodal closetaskmodal={closetaskmodal} task={selectedTask} />
        )}
      </div>
    );
  }
}
