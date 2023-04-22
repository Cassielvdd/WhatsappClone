import React from "react";
import "./Login.css";
import api from "../api";
import GoogleIcon from "@mui/icons-material/Google";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";

const Login = ({ onRecieve }) => {
  async function Google() {
    let result = await api.GooglePopup();
    if (result) {
      onRecieve(result.user);
    } else {
    }
  }
  return (
    <div className="container">
      <div className="login">
        <h2 className="title">Login</h2>
        <button onClick={Google}>
          <span className="span-1">
            <GoogleIcon />
          </span>
          <span className="text">Login com o Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
