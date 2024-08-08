import logo from "../../assets/last_logo.svg";
import "./Landing.css";
import landingimg from "../../assets/landin.png";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/config";
import { Commet } from "react-loading-indicators";

export default function Landing() {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  if (loading) {
    return <Commet color="#ffffff" size="small" text="" textColor="" />;
  }
  if (error) {
    return <h1>Erorr..........</h1>;
  }
  if (user) {
    navigate("/home");
  } else {
    return (
      <div className="landing">
        <div className="content col-12 col-md-6   ">
          <img src={logo} alt="" height={"230px"} />
          <p>
            here you can organize all your tasks <br />
            many feature are here.... <br />
            wat TODO with TODO?
          </p>
          <div className="btns">
            <button onClick={() => navigate("/signin")}>sign in</button>
            <button onClick={() => navigate("/signup")}>sign up</button>
          </div>
        </div>
        <div className="img col-12 col-md-6  ">
          <img src={landingimg} alt="" className="landimg" />
        </div>
      </div>
    );
  }
}
