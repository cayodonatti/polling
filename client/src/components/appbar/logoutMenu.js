import React, { useCallback } from "react";
import "./appbar.css";
import { Menu, MenuItem, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/actions";
import { useHistory } from "react-router-dom";

export function LogoutMenu({ anchorEl, handleClose, user }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const onLogout = useCallback(() => {
    dispatch(clearUser());
    handleClose();
  }, [dispatch, handleClose]);
  const navigate = useCallback(
    route => {
      history.push(route);
      handleClose();
    },
    [history, handleClose]
  );

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <Typography component={"h6"} className="logoutMenuTitle">
        Hey, {user.username}!
      </Typography>
      <MenuItem onClick={() => navigate("/")}>Home</MenuItem>
      <MenuItem onClick={() => navigate("/user/polls")}>My polls</MenuItem>
      <MenuItem onClick={onLogout}>Logout</MenuItem>
    </Menu>
  );
}
