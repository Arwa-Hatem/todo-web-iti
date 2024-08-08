import React, { useState, useEffect } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import {
  arrayRemove,
  arrayUnion,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Commet } from "react-loading-indicators";

const SubTasksSection = ({ user, taskId }) => {
  const navigate = useNavigate();
  const [value, loading, error] = useDocument(doc(db, user.uid, taskId));
  const [showAddNewTask, setshowAddNewTask] = useState(false);
  const [subTask, setsubTask] = useState("");

  const checkboxcompleted = async (e) => {
    if (e.target.checked) {
      await updateDoc(doc(db, user.uid, taskId), {
        completed: true,
      });
    } else {
      await updateDoc(doc(db, user.uid, taskId), {
        completed: false,
      });
    }
  };
  const checkboxperiorty = async (e) => {
    if (e.target.checked) {
      await updateDoc(doc(db, user.uid, taskId), {
        priority: true,
      });
    } else {
      await updateDoc(doc(db, user.uid, taskId), {
        priority: false,
      });
    }
  };
  const deletItem = async (item) => {
    await updateDoc(doc(db, user.uid, taskId), {
      data: arrayRemove(item),
    });
  };
  const addItem = async (item) => {
    await updateDoc(doc(db, user.uid, taskId), {
      data: arrayUnion(item),
    });
  };
  const deleteTask = async () => {
    try {
      await deleteDoc(doc(db, user.uid, taskId));
      console.log(`Task ${taskId} deleted.`);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };
  if (loading) {
    <Commet
      color="#ffffff"
      size="small"
      text=""
      textColor=""
      className="d-flex justify-content-center col"
    />;
  }

  if (value) {
    return (
      <section className="sub-task mtt">
        <div className="parent-time">
          <div>
            <input
              onChange={(e) => {
                checkboxcompleted(e);
              }}
              checked={value.data().completed}
              id="checkbox"
              type="checkbox"
            />
            <label htmlFor="checkbox">Completed </label>
          </div>
          <div>
            <input
              onChange={(e) => {
                checkboxperiorty(e);
              }}
              checked={value.data().priority}
              id="checkbox"
              type="checkbox"
            />
            <label htmlFor="checkbox">priority </label>
          </div>
        </div>

        {value.data().data.map((item) => {
          return (
            <div className=" card-task flex">
              <div className="itemedit">
                <p> {item} </p>

                <MdDeleteOutline
                  onClick={() => deletItem(item)}
                  className="delicon"
                />
              </div>
            </div>
          );
        })}

        {showAddNewTask && (
          <div className="card-task flex">
            <input
              type="text"
              className="add-task"
              value={subTask}
              onChange={(e) => setsubTask(e.target.value)}
            />
            <button
              onClick={() => {
                addItem(subTask);
                setsubTask("");
                setshowAddNewTask(false);
              }}
            >
              Add
            </button>
            <button onClick={() => setshowAddNewTask(false)}>Cancel</button>
          </div>
        )}
        <div>
          <button
            className="add-more-btn"
            onClick={() => setshowAddNewTask(true)}
          >
            Add more <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              deleteTask();

              navigate("/home", { replace: true });
            }}
          >
            delete Task
          </button>
        </div>
        <button
          onClick={() => {
            navigate("/home");
          }}
        >
          cancel
        </button>
        <button onClick={() => navigate("/home")}>done</button>
      </section>
    );
  }
};

export default SubTasksSection;
