import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  HomePage,
  NewPollPage,
  PollPage,
  UserPollsPage,
  EditPollPage
} from "./routes";
import { TopBar } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { setSession } from "./redux/actions";
import uuid from "react-uuid";

export function AppRouter() {
  const dispatch = useDispatch();
  const session = useSelector(state => state.session);

  useEffect(() => {
    if (!session) {
      dispatch(setSession(uuid()));
    }
  }, [session, dispatch]);

  return (
    <Router>
      <TopBar />
      <Switch>
        <Route path="/user/polls">
          <UserPollsPage />
        </Route>
        <Route path="/new-poll">
          <NewPollPage />
        </Route>
        <Route path="/poll/:pollId/edit">
          <EditPollPage />
        </Route>
        <Route path="/poll/:pollId">
          <PollPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}
