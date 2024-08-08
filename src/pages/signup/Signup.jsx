import React, { useState, useEffect } from "react";
import signupimg from "../../assets/sign_up.png";
import "./Signup.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import Modal from "../../shared/Modal";
import { Commet } from "react-loading-indicators";

const schema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(4, "Name must be at least 4 characters"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email not valid"
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function Signup() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (user && !user.emailVerified) {
      const intervalId = setInterval(() => {
        user.reload().then(() => {
          if (user.emailVerified) {
            clearInterval(intervalId);
            navigate("/home");
          }
        });
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      setError("");
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        const user = userCredential.user;

        await updateProfile(auth.currentUser, {
          displayName: values.name,
        });

        await sendEmailVerification(auth.currentUser);

        setShowModal(true);
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setError(
            "This email is already in use. Please use a different email."
          );
        } else {
          setError("An error occurred during signup. Please try again.");
        }
      }
    },
  });

  if (user && user.emailVerified) {
    navigate("/home");
  }
  if (loading) {
    <Commet color="#32cd32" size="medium" text="" textColor="" />;
  }

  return (
    <div className="signup">
      {showModal && (
        <Modal closeModal={closeModal}>
          <div className="verify">
            <h2 className="modaltxt">Check Your Email and verify to sign in</h2>
            <div className="button-container">
              <button className="button" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="button"
                onClick={() => sendEmailVerification(auth.currentUser)}
              >
                Resend
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="form">
        <h1>Sign Up</h1>
        <div className="inputs">
          <form onSubmit={formik.handleSubmit}>
            <input
              type="text"
              className={
                formik.touched.name && formik.errors.name ? "error" : ""
              }
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Name"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="error">{formik.errors.name}</p>
            )}
            <input
              type="email"
              className={
                formik.touched.email && formik.errors.email ? "error" : ""
              }
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="error">{formik.errors.email}</p>
            )}
            <input
              type="password"
              className={
                formik.touched.password && formik.errors.password ? "error" : ""
              }
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Password"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="error">{formik.errors.password}</p>
            )}
            <input
              type="password"
              className={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "error"
                  : ""
              }
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Confirm Password"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="error">{formik.errors.confirmPassword}</p>
              )}
            {error && <p className="error">{error}</p>}
            <div className="form-actions">
              <button type="submit">Sign Up</button>
            </div>
          </form>
          <div className="account">
            <p>
              Have an account?{" "}
              <span
                onClick={() => {
                  if (user) {
                    navigate("/home");
                  } else {
                    navigate("/signin");
                  }
                }}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="img">
        <img src={signupimg} alt="Illustration" />
      </div>
    </div>
  );
}
