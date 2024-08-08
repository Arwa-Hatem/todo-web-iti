import React from "react";
import "./Forgetpass.css";
import forgetimg from "../../assets/email.png";
import { useFormik } from "formik";
import * as yup from "yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email not valid"
    ),
});

export default function Forgetpass() {
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await sendPasswordResetEmail(auth, values.email);
        setEmailSent(true);
      } catch (error) {
        setErrorMessage(error.message);
        setEmailSent(false);
      }
    },
  });

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleResend = () => {
    formik.handleSubmit();
  };

  return (
    <div className="email-form-container">
      <div className="email-form-image">
        <img src={forgetimg} alt="Illustration" />
      </div>
      <div className="email-form-content">
        <h1>Enter Your Email</h1>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            className={`email-input ${
              formik.touched.email && formik.errors.email ? "error" : ""
            }`}
            id="exampleInputEmail1"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="error">{formik.errors.email}</p>
          )}
          {emailSent && (
            <p className="sucess text-white">
              check your mail to reset your password
            </p>
          )}

          {emailSent ? (
            <div className="button-group">
              <button
                type="button"
                className="modal-button"
                onClick={handleSignIn}
              >
                Sign In
              </button>
              <button
                type="button"
                className="modal-button"
                onClick={handleResend}
              >
                Resend
              </button>
            </div>
          ) : (
            <div>
              <button type="submit" className="confirm-button center">
                Confirm
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
