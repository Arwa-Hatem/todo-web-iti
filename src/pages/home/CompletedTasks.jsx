import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { useCollection } from "react-firebase-hooks/firestore";

import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { BsDot } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import TaskViewmodal from "./TaskViewmodal";
import { Commet } from "react-loading-indicators";
import moment from "moment";

export default function CompletedTasks({ user }) {
  const navigate = useNavigate();

  const [value, loading, error] = useCollection(
    query(
      collection(db, user.uid),

      where("completed", "==", true)
    )
  );
  const [selectedTask, setSelectedTask] = useState(false);

  const [showtaskModal, setshowtaskModal] = useState(false);
  const closetaskmodal = () => {
    setshowtaskModal(false);
    setSelectedTask(false);
  };
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, user.uid, taskId));
      console.log(`Task ${taskId} deleted.`);
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
        <div className="completed-section">
          <h1>completed Tasks</h1>
          <div className="tasks">
            {value.docs.map((item, index) => {
              return (
                <div
                  onClick={() => {
                    setSelectedTask(item.data());
                    setshowtaskModal(true);
                  }}
                  className="task-item"
                  style={{ position: "relative" }}
                >
                  <div className="task">
                    <h4 className="pagination2">{index + 1}</h4>
                    <h3> {`Title : ${item.data().title}`} </h3>

                    {item.data().data.map((item, index) => {
                      if (index < 3) {
                        return (
                          <p>
                            <span>
                              <BsDot />
                            </span>
                            {item}{" "}
                          </p>
                        );
                      } else {
                        return false;
                      }
                    })}

                    <div className="time" style={{ width: "10px" }}>
                      <p style={{ fontSize: "20px" }}>
                        {moment(item.data().createdAt).fromNow()}
                      </p>
                    </div>

                    <div className="icons">
                      <MdDeleteOutline
                        style={{
                          color: "#F9252570",
                        }}
                        className="icon"
                        onClick={(e) => {
                          e.stopPropagation();

                          deleteTask(item.id);
                          setshowtaskModal(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <TaskViewmodal
              closetaskmodal={closetaskmodal}
              task={selectedTask}
            />
          </div>
        </div>
      </div>
    );
  }
}
