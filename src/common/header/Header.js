import React, { useState, useEffect } from "react";
import "./Header.css";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import green from "@material-ui/core/colors/green";
import { Link, useHistory } from "react-router-dom";
import Modal from "react-modal";
import LoginAndRegister from "../loginAndRegister/LoginAndRegister";

const styles = (theme) => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  success: {
    color: green[600],
  },
});

const Header = (props) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(
    sessionStorage.getItem("isUserLoggedIn") === true ||
      sessionStorage.getItem("isUserLoggedIn") === "true"
  );

  const displayAuthenticationButton = () => {
    if (!(isUserLoggedIn === true || isUserLoggedIn === "true")) {
      return (
        <Button
          variant="contained"
          onClick={openLoginAndRegisterModal}
          color="default"
        >
          Login
        </Button>
      );
    } else {
      return (
        <Button variant="contained" onClick={logOutHandler} color="default">
          Logout
        </Button>
      );
    }
  };

  const logOutHandler = () => {
    sessionStorage.setItem("isUserLoggedIn", false);
    sessionStorage.removeItem("userDetails");
    setIsUserLoggedIn(false);
  };

  const renderBookShowButton = () => {
    debugger;
    return isUserLoggedIn ? (
      <Link to={`/bookshow/${movieId}`}>
        <Button variant="contained" color="primary">
          Book Show
        </Button>
      </Link>
    ) : (
      <Button
        variant="contained"
        onClick={openLoginAndRegisterModal}
        color="primary"
      >
        Book Show
      </Button>
    );
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "auto",
      width: "20%",
      transform: "translate(-50%, -50%)",
      padding: "40px",
    },
  };

  const openLoginAndRegisterModal = () => {
    setIsOpen(true);
  };

  const closeLoginAndRegisterModal = () => {
    setIsOpen(false);
  };

  const isMovieSelected = props.isMovieDetailsPage;
  const movieId = props.movieId;

  const { classes } = props;

  return (
    <div className="Header">
      <div className="mainContainer">
        <div>
          <img
            src={require("../../../src/assets/logo.svg")}
            className="rotating logo"
          />
        </div>
        <div className="headerActionButtons">
          <div style={{ marginLeft: "5px", marginRight: "5px" }}>
            {isMovieSelected ? renderBookShowButton() : null}
          </div>
          <div>{displayAuthenticationButton(0)}</div>
        </div>
      </div>
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeLoginAndRegisterModal}
          style={customStyles}
          contentLabel="Login/Register"
          ariaHideApp={false}
        >
          <LoginAndRegister
            openHandler={openLoginAndRegisterModal}
            closeHandler={closeLoginAndRegisterModal}
            baseUrl={props.baseUrl}
            setIsUserLoggedIn={setIsUserLoggedIn}
          />
        </Modal>
      </div>
    </div>
  );
};

export default withStyles(styles)(Header);
