import React, { useRef } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FaRegEdit } from "react-icons/fa";

const TitleSection = ({ user, taskId }) => {
  const inputElement = useRef(null);
  const [value] = useDocument(doc(db, user.uid, taskId));

  const titleInput = async (e) => {
    await updateDoc(doc(db, user.uid, taskId), {
      title: e.target.value,
    });
  };

  if (value) {
    return (
      <section className="title-section">
        <h1 className="title-container">
          <div className="editt">
            <input
              ref={inputElement}
              onChange={(e) => titleInput(e)}
              defaultValue={value.data().title}
              className="title-input"
              type="text"
            />
            <FaRegEdit
              className="edit-icon"
              onClick={() => inputElement.current.focus()}
            />
          </div>
        </h1>
      </section>
    );
  }
};

export default TitleSection;
