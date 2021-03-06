import React, { useState } from "react";
import PropTypes from "prop-types";
import "./LoginAndRegister.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Tabs, Tab } from "@material-ui/core";

const TablePanel = (props) => {
  const { children, value, index } = props;
  return <div>{value === index && <div>{children}</div>}</div>;
};

const LoginAndRegister = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [registrationMsg, setRegistrationMsg] = useState("");
  const [value, setTabValue] = useState(0);
  const [loginMessage, setLoginMessage] = useState("");
  const [showLoginFailedMsg, setShowLoginFailedMsg] = useState(false);
  const [showMissingLoginFieldsMessage, setShowMissingLoginFieldsMessage] =
    useState(false);
  const [
    showMissingRegisterFieldsMessage,
    setShowMissingRegisterFieldsMessage,
  ] = useState(false);

  const [isLoginButtonClicked, setIsLoginButtonClicked] = useState(false);
  const [isRegisterButtonClicked, setIsRegisterButtonClicked] = useState(false);

  const handleTabChange = (event, value) => {
    setIsLoginButtonClicked(false);
    setIsRegisterButtonClicked(false);
    setTabValue(value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handleLoginPasswordChange = (event) => {
    setLoginPassword(event.target.value);
  };

  const registerUser = () => {
    let data = JSON.stringify({
      email_address: email,
      first_name: firstName,
      last_name: lastName,
      mobile_number: phone,
      password: password,
    });

    fetch(props.baseUrl + "signup", {
      method: "POST",
      headers: {
        Accept: "application/json;charset=UTF-8",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setRegistrationMsg(
            data.status.toUpperCase() === "ACTIVE" ||
              data.status.toUpperCase() === "REGISTERED" ||
              data.status.toUpperCase() === "SUCCESS"
              ? "Registration Successful. Please Login!"
              : "Registration failed!"
          );
        } else {
          setRegistrationMsg(data.message);
        }
        setShowMsg(true);
      });
  };

  const loginUser = () => {
    const authorization = window.btoa(username + ":" + loginPassword);
    const headers = {
      Accept: "application/json;charset=UTF-8",
      authorization: "Basic " + authorization,
    };

    fetch(props.baseUrl + "auth/login", {
      method: "POST",
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status.toUpperCase() === "ACTIVE") {
          sessionStorage.setItem("isUserLoggedIn", true);
          sessionStorage.setItem("userDetails", JSON.stringify(data));
          props.setIsUserLoggedIn(true);
          props.closeHandler();
        } else {
          setShowLoginFailedMsg(true);
          setLoginMessage(data.message);
        }
      });
  };

  const handleFormSubmit = () => {
    // this function will be triggered by the submit event

    if (value === 0) {
      setIsLoginButtonClicked(true);
      if (!username || !loginPassword) {
        setShowMissingLoginFieldsMessage(true);
      } else {
        loginUser();
      }
    } else {
      setIsRegisterButtonClicked(true);
      if (
        !firstName ||
        !lastName ||
        !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ||
        !password ||
        !phone
      ) {
        setShowMissingRegisterFieldsMessage(true);
      } else {
        registerUser();
      }
    }
  };

  const renderLoginForm = (props) => {
    return (
      <form onSubmit={handleFormSubmit} {...props}>
        <div className="formInputs">
          <br />
          <TextField
            required
            id="loginUsername"
            label="Username"
            onChange={handleUsernameChange}
            error={isLoginButtonClicked && !username}
            helperText={isLoginButtonClicked && !username ? "Required" : ""}
            value={username}
          />
          <br />
          <TextField
            required
            id="standard-password-input"
            label="Password"
            type="password"
            error={isLoginButtonClicked && !loginPassword}
            helperText={
              isLoginButtonClicked && !loginPassword ? "Required" : ""
            }
            onChange={handleLoginPasswordChange}
            value={loginPassword}
          />
          <br />
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            color="primary"
          >
            Login
          </Button>
          {showLoginFailedMsg ? (
            <div style={{ textAlign: "center", color: "red" }}>
              <br />
              {loginMessage
                ? loginMessage
                : "Failed to login. Check your credentials!"}
            </div>
          ) : null}
          {showMissingLoginFieldsMessage ? (
            <div style={{ textAlign: "center", color: "red" }}>
              <br />
              Please fill out all the mandatory fields!
            </div>
          ) : null}
        </div>
      </form>
    );
  };

  const renderRegisterForm = () => {
    return (
      <form onSubmit={handleFormSubmit}>
        <div className="formInputs">
          <br />
          <TextField
            required
            id="standard-basic-firstName"
            label="First Name"
            onChange={handleFirstNameChange}
            error={isRegisterButtonClicked && !firstName}
            helperText={isRegisterButtonClicked && !firstName ? "Required" : ""}
            value={firstName}
          />
          <br />
          <TextField
            required
            id="standard-basic-lastname"
            label="Last Name"
            onChange={handleLastNameChange}
            onBlur={handleLastNameChange}
            error={isRegisterButtonClicked && !lastName}
            helperText={isRegisterButtonClicked && !lastName ? "Required" : ""}
            value={lastName}
          />
          <br />
          <TextField
            required
            id="standard-basic-email"
            label="Email"
            onChange={handleEmailChange}
            error={
              isRegisterButtonClicked &&
              !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
            }
            helperText={
              isRegisterButtonClicked &&
              !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
                ? "Required"
                : ""
            }
            value={email}
          />
          <br />
          <TextField
            required
            id="standard-password-input"
            label="Password"
            type="password"
            onChange={handlePasswordChange}
            error={isRegisterButtonClicked && !password}
            helperText={isRegisterButtonClicked && !password ? "Required" : ""}
            value={password}
          />
          <br />
          <TextField
            required
            id="standard-basic-contact"
            label="Contact No."
            onChange={handlePhoneChange}
            error={isRegisterButtonClicked && !phone}
            helperText={isRegisterButtonClicked && !phone ? "Required" : ""}
            value={phone}
          />
          <br />

          {showMsg ? (
            <div>
              {registrationMsg}
              <br />
            </div>
          ) : null}
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            color="primary"
          >
            Register
          </Button>
          {showMissingRegisterFieldsMessage ? (
            <div style={{ textAlign: "center", color: "red" }}>
              <br />
              Please fill out all the mandatory fields!
            </div>
          ) : null}
        </div>
      </form>
    );
  };

  return (
    <div>
      <Tabs value={value} onChange={handleTabChange} className="center">
        <Tab label="Login" />

        <Tab label="Register" />
      </Tabs>

      <TablePanel className="center" value={value} index={0}>
        {renderLoginForm()}
      </TablePanel>
      <TablePanel className="center" value={value} index={1}>
        {renderRegisterForm()}
      </TablePanel>
    </div>
  );
};

LoginAndRegister.propTypes = {
  closeHandler: PropTypes.func.isRequired,
};

export default LoginAndRegister;
