import React from "react";
import Modal from "../../shared/Modal";
import ReactLoading from "react-loading";
import "./Homemodal.css";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function Homemodal({
  closeModal,
  titleInput,
  detailsInput,
  addBTN,
  submitBTN,
  title,
  subTask,
  array,
  showloading,
}) {
  return (
    <div>
      <Modal closeModal={closeModal}>
        <div style={{ textAlign: "left", height: "100%" }} className="content">
          <form className="inputs">
            <input
              className="input"
              onChange={(eo) => {
                titleInput(eo);
              }}
              required
              placeholder="Add title:"
              type="text"
              value={title}
            />
            <div className="addcon">
              <input
                className="input"
                onChange={(eo) => {
                  detailsInput(eo);
                }}
                placeholder="Details"
                type="text"
                value={subTask}
              />

              <IoIosAddCircleOutline
                className="add"
                onClick={(eo) => {
                  eo.preventDefault();
                  addBTN();
                }}
              />
            </div>
          </form>

          <ul>
            {array.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <div className="btns">
            <button
              onClick={async (eo) => {
                eo.preventDefault();
                submitBTN(eo);
              }}
              disabled={showloading}
            >
              {showloading ? (
                <ReactLoading
                  type={"spin"}
                  color={"white"}
                  height={20}
                  width={20}
                  className="mx-auto"
                />
              ) : (
                "Submit"
              )}
            </button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
