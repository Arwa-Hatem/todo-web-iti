import React, { useState } from "react";

import { auth, db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Home.css";
import homeimg from "../../assets/home.png";

import Homemodal from "./Homemodal";
import { doc, setDoc } from "firebase/firestore";

import AllTasks from "./AllTasks";
import Aside from "../../shared/Aside";
import HighPriority from "./HighPerioty";
import TaskViewmodal from "./TaskViewmodal";
import CompletedTasks from "./CompletedTasks";
import HighPerioty from "./HighPerioty";
import ReactLoading from "react-loading";
import { Commet } from "react-loading-indicators";
import moment from "moment";

export default function Home() {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const [showaddModal, setshowaddModal] = useState(false);

  const [title, settitle] = useState("");
  const [array, setarray] = useState([]);
  const [subTask, setsubTask] = useState("");
  const [showloading, setshowloading] = useState(false);

  const titleInput = (eo) => {
    settitle(eo.target.value);
  };

  const detailsInput = (eo) => {
    setsubTask(eo.target.value);
  };

  const addBTN = () => {
    if (!array.includes(subTask)) {
      array.push(subTask);
    }

    console.log(array);
    setsubTask("");
  };

  const submitBTN = async (eo) => {
    eo.preventDefault();
    setshowloading(true);
    const taskid = new Date().getTime();
    const creationTimestamp = moment().toISOString();
    try {
      await setDoc(doc(db, user.uid, `${taskid}`), {
        title: title,
        data: array,
        id: taskid,
        completed: false,
        priority: false,
        createdAt: creationTimestamp,
      });
      console.log("done");
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setshowloading(false);
      setarray([]);
      settitle("");
      setsubTask("");
      setshowaddModal(false);
    }
  };

  const closeModal = () => {
    setshowaddModal(false);
    settitle("");
    setarray([]);
  };

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

  if (error) {
    return <div>Errorrrr</div>;
  }

  if (!user) {
    navigate("/");
  }

  if (user) {
    return (
      <div className="home-container">
        <Aside />
        <main className="main-content">
          <div className="to-do-section">
            <div className="add-to-do">
              <h4 className="py-5">Want to write a To-Do?</h4>
              <button
                className="add-button my-5"
                onClick={() => {
                  setshowaddModal(true);
                }}
              >
                + Add
              </button>

              {showaddModal && (
                <Homemodal
                  closeModal={closeModal}
                  titleInput={titleInput}
                  detailsInput={detailsInput}
                  addBTN={addBTN}
                  submitBTN={submitBTN}
                  title={title}
                  subTask={subTask}
                  array={array}
                  showloading={showloading}
                />
              )}
            </div>
            <div className="home-img">
              <img src={homeimg} alt="Home Illustration" />
            </div>
          </div>

          <HighPerioty user={user} />

          <AllTasks user={user} />
          <CompletedTasks user={user} />
        </main>
      </div>
    );
  }
}
