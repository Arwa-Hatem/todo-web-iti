import "./Signin.css";
import signinimg from "../../assets/sign_in.png";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { auth } from "../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import * as yup from "yup";
import { useState } from "react";
import { Commet } from "react-loading-indicators";

const schema = yup.object({
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
});

export default function Signin() {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [haserror, seterror] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: () => {
      signInWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then((userCredential) => {
          console.log("doneeee");
          navigate("/home");

          const user = userCredential.user;
        })
        .catch(() => {
          seterror(true);
        });
    },
  });
  if (loading) {
    <Commet color="#32cd32" size="#ffffff" text="" textColor="" />;
  }
  if (user) {
    navigate("/home");
  }

  return (
    <div className="signin">
      <div className="form">
        <h1>Sign In</h1>
        <div className="inputs">
          <form action="" onSubmit={formik.handleSubmit}>
            <input
              type="text"
              className={
                formik.touched.email && formik.errors.email ? "error" : ""
              }
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
            <input
              type="password"
              className={
                formik.touched.password && formik.errors.password ? "error" : ""
              }
              id="exampleInputPassword1"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Password"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="error">{formik.errors.password}</p>
            )}
            <div className="form-actions">
              <button type="submit">Sign In</button>
              <p
                className="forgot-password"
                onClick={() => navigate("/forgetpass")}
              >
                Forgot password
              </p>
            </div>
          </form>
          <div className="account">
            <p>
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")}>Sign Up</span>
            </p>
            {haserror && <p className="text-danger">wrong email or password</p>}
          </div>
        </div>
      </div>
      <div className="img">
        <img src={signinimg} alt="Illustration" />
      </div>
    </div>
  );
}
