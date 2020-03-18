import React, { useCallback, useState, useEffect } from "react";
import "./index.css";
import { Page, ErrorDialog, CenterHorizontal } from "../../components";
import { useSelector } from "react-redux";
import { axios } from "../../redux/store";
import { Button, List } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Poll from "./components/Poll";

export function UserPollsPage() {
  const user = useSelector(state => state.user);
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState(null);
  const [polls, setPolls] = useState(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await axios.get("/api/poll/user");
      setPolls(data);
    } catch (e) {
      setErrorMessage(e.message);
    }
  }, [user]);
  const gotToPoll = useCallback(pollId => history.push(`/poll/${pollId}`), [
    history
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Page>
      <CenterHorizontal>
        {user ? (
          <>
            {polls && polls.length > 0 ? (
              <>
                <h1>{user.username}'s polls</h1>
                <List className="pollList">
                  {polls.map(poll => (
                    <Poll onClick={gotToPoll} key={poll._id} poll={poll} />
                  ))}
                </List>
              </>
            ) : (
              <>
                <h1 className="title">No polls yet. Go make some!</h1>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => history.push("/new-poll")}
                >
                  Create a poll
                </Button>
              </>
            )}
          </>
        ) : (
          <h1 className="title">Login to view your polls</h1>
        )}

        <ErrorDialog
          message={errorMessage}
          close={() => setErrorMessage(null)}
        />
      </CenterHorizontal>
    </Page>
  );
}
