import React, { useState, useCallback } from "react";
import "./appbar.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/actions";
import { axios } from "../../redux/store";
import { ErrorDialog } from "../errorDialog";

export function LoginDialog({ open, handleClose = () => {} }) {
  const [formErrored, setFormErrored] = useState(false);
  const [apiMessage, setApiMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const submitForm = useCallback(
    async event => {
      event.preventDefault();
      try {
        const user = {
          username: event.target.username.value,
          password: event.target.password.value
        };

        if (user.username.length < 5 || user.username.length > 23) {
          setFormErrored(true);
          return;
        }
        if (user.password.length < 8 || user.password.length > 23) {
          setFormErrored(true);
          return;
        }
        setLoading(true);
        const { data } = await axios.post("/api/login", user);

        setLoading(false);

        dispatch(setUser(data));
        handleClose();
      } catch (e) {
        setLoading(false);
        setApiMessage(e.message);
      }
    },
    [handleClose, dispatch]
  );

  return (
    <>
      <Dialog
        onClose={() => {
          setFormErrored(false);
          handleClose();
        }}
        open={open}
      >
        <DialogTitle id="simple-dialog-title">Welcome!</DialogTitle>
        <DialogContent className="dialogContainer">
          Please register or sign in to keep all your polls in place!
          <div className="separator" />
          <form
            onSubmit={submitForm}
            className="login-form"
            noValidate
            autoComplete="off"
          >
            <TextField
              disabled={loading}
              id="username"
              label="Username"
              variant="outlined"
              margin="normal"
              required
              helperText={
                formErrored && "Username must have between 5 and 23 digits"
              }
              error={formErrored}
            />
            <TextField
              disabled={loading}
              id="password"
              type="password"
              label="Password"
              variant="outlined"
              margin="normal"
              required
              helperText={
                formErrored && "Password must have between 8 and 23 digits"
              }
              error={formErrored}
            />

            <div className="separator" />

            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              color="primary"
            >
              Login/Register
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <ErrorDialog message={apiMessage} close={() => setApiMessage(null)} />
    </>
  );
}
