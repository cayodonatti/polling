import React, { useReducer, useCallback, useState } from "react";
import "./index.css";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  Page,
  CenterHorizontal,
  ErrorDialog,
  PollForm
} from "../../components";
import { axios } from "../../redux/store";

export function NewPollPage() {
  const [options, dispatchAction] = useReducer(optionsReducer, ["", "", ""]); // defaults to three options
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const user = useSelector(state => state.user);

  const createPoll = useCallback(
    async event => {
      event.preventDefault();
      try {
        const poll = {
          title: event.target?.title?.value,
          description: event.target?.description?.value,
          options: options.filter(x => Boolean(x)),
          requiresAuth: user && event.target?.requiresAuth?.checked
        };

        if (poll.options.length < 2) {
          setErrorMessage("A poll needs at least 2 filled options");
          return;
        }

        setLoading(true);
        const { data } = await axios.post("/api/poll", poll);
        setLoading(false);

        history.push(`/poll/${data._id}`);
      } catch (e) {
        setLoading(false);
        setErrorMessage(e.message);
      }
    },
    [options, user, history]
  );

  return (
    <Page>
      <CenterHorizontal>
        <PollForm
          formTitle="Poll info"
          loading={loading}
          options={options}
          onSubmit={createPoll}
          onOptionChange={(event, i) =>
            dispatchAction({
              type: "changeOptionText",
              index: i,
              text: event.target.value
            })
          }
          onOptionRemove={(event, i) =>
            dispatchAction({
              type: "removeOption",
              index: i
            })
          }
          addOption={() =>
            dispatchAction({
              type: "addOption"
            })
          }
        />
      </CenterHorizontal>

      <ErrorDialog message={errorMessage} close={() => setErrorMessage(null)} />
    </Page>
  );
}

const optionsReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case "changeOptionText":
      newState = [...state];
      newState[action.index] = action.text;

      return newState;
    case "addOption":
      return [...state, ""];
    case "removeOption":
      newState = [...state];
      newState.splice(action.index, 1);

      return newState;
    default:
      return state;
  }
};
