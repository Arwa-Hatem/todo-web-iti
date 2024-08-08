import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { useCollection } from "react-firebase-hooks/firestore";
import { DateTime } from "luxon";
import "./Home.css";
import { BsDot } from "react-icons/bs";

import { Link, useNavigate } from "react-router-dom";
import TaskViewmodal from "./TaskViewmodal";
import { LuBellPlus } from "react-icons/lu";
import {
  MdDeleteOutline,
  MdModeEditOutline,
  MdOutlineDone,
} from "react-icons/md";
import { Commet } from "react-loading-indicators";
import moment from "moment";

export default function HighPerioty({ user }) {
  const navigate = useNavigate();

  const [showtaskModal, setshowtaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(false);

  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);
  const closetaskmodal = () => {
    setshowtaskModal(false);
    setSelectedTask(null);
  };

  const [value, loading, error] = useCollection(
    query(
      collection(db, user.uid),
      where("completed", "==", false),

      where("priority", "==", true)
    )
  );
  const updateCompleted = async (taskId) => {
    try {
      await updateDoc(doc(db, user.uid, taskId), {
        completed: true,
      });
    } catch (error) {
      console.error("Error updating completed status: ", error);
    }
  };
  const updatePriority = async (taskId) => {
    try {
      await updateDoc(doc(db, user.uid, taskId), {
        priority: false,
      });
    } catch (error) {
      console.error("Error updating completed status: ", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, user.uid, taskId));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

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
      <div>
        <h1>High periorty</h1>
        <div className="highper">
          <div className="tasks">
            {value.docs.map((item, index) => {
              return (
                <div
                  onClick={() => {
                    setSelectedTask(item.data());
                    setshowtaskModal(true);
                  }}
                  className="task-item"
                >
                  <div className="task">
                    <h4 className="pagination2">{index + 1}</h4>
                    <h3>{`Title : ${item.data().title}`}</h3>

                    {item.data().data.map((item, index) => {
                      if (index < 3) {
                        return (
                          <p>
                            <span>
                              <BsDot />
                            </span>{" "}
                            {item}{" "}
                          </p>
                        );
                      } else {
                        return false;
                      }
                    })}

                    <>
                      <div className="time">
                        <p style={{ fontSize: "15px" }}>
                          {moment(item.data().createdAt).from(currentTime)}
                        </p>
                      </div>
                      <button
                        className="perbtn"
                        onClick={(e) => {
                          e.stopPropagation();

                          updatePriority(item.id);
                          setshowtaskModal(false);
                        }}
                      >
                        <span>
                          {" "}
                          <LuBellPlus style={{ color: "#000000" }} />
                        </span>
                        periorty
                      </button>{" "}
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
                            e.preventDefault();
                            updateCompleted(item.id);
                            setshowtaskModal(false);
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
              );
            })}
          </div>
        </div>
        {showtaskModal && (
          <TaskViewmodal closetaskmodal={closetaskmodal} task={selectedTask} />
        )}
      </div>
    );
  }
}
