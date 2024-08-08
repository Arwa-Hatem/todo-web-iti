import React from "react";
import Modal from "../../shared/Modal";
import "./taskview.css";
import { BsDot } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

export default function TaskViewmodal({ closetaskmodal, task }) {
  if (!task) return null;

  return (
    <div>
      <Modal>
        <div className="taskview">
          <h1>{`Title : ${task.title}`}</h1>

          {task.data.map((subtask, index) => (
            <p key={index}>
              <span>
                {" "}
                <BsDot />
              </span>
              {subtask}
            </p>
          ))}
          <IoClose className="close" onClick={closetaskmodal} />
        </div>
      </Modal>
    </div>
  );
}
