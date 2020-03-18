import React, { useState, useCallback } from "react";
import "./appbar.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Home from "@material-ui/icons/Home";
import { useSelector } from "react-redux";
import { LoginDialog } from "./loginDialog";
import { LogoutMenu } from "./logoutMenu";
import { useHistory } from "react-router-dom";

export function TopBar() {
  const history = useHistory();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [logoutAnchor, setLogoutAnchor] = useState(null);

  const openDialog = useCallback(() => setDialogIsOpen(true), []);
  const closeDialog = useCallback(() => setDialogIsOpen(false), []);

  const openMenu = useCallback(
    event => setLogoutAnchor(event.currentTarget),
    []
  );
  const closeMenu = useCallback(() => setLogoutAnchor(null), []);

  const user = useSelector(state => state.user);

  return (
    <AppBar>
      <Toolbar>
        <IconButton
          onClick={() => history.push("/")}
          color="inherit"
          edge="start"
        >
          <Home />
        </IconButton>
        <Typography className="app-title" variant="h6">
          Cayo's simple polling
        </Typography>

        {user ? (
          <>
            <IconButton onClick={openMenu} color="inherit">
              <AccountCircle />
            </IconButton>
            <LogoutMenu
              user={user}
              anchorEl={logoutAnchor}
              handleClose={closeMenu}
            />
          </>
        ) : (
          <>
            <Button
              aria-controls="login-menu"
              aria-haspopup="true"
              onClick={openDialog}
              color="inherit"
            >
              Login
            </Button>
            <LoginDialog open={dialogIsOpen} handleClose={closeDialog} />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
