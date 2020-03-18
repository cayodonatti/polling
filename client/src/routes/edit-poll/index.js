import React, {
  useReducer,
  useCallback,
  useState,
  useEffect,
  useRef
} from "react";
import "./index.css";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import {
  Page,
  CenterHorizontal,
  ErrorDialog,
  PollForm
} from "../../components";
import { axios } from "../../redux/store";

export function EditPollPage() {
  const [options, dispatchAction] = useReducer(optionsReducer, []);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const _form = useRef();
  const { pollId } = useParams();

  const user = useSelector(state => state.user);

  const loadPoll = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/poll/${pollId}`);

      dispatchAction({
        type: "setOptions",
        options: data.options.map(x => x.text)
      });

      _form.current.resetFormValues({
        title: data.title,
        description: data.description,
        requiresAuth: data.requiresAuth
      });

      setLoading(false);
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.message);
    }
  }, [pollId]);

  useEffect(() => {
    loadPoll();
  }, [loadPoll]);

  const editPoll = useCallback(
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
        const { data } = await axios.patch(`/api/poll/${pollId}`, poll);
        setLoading(false);

        history.push(`/poll/${data._id}`);
      } catch (e) {
        setLoading(false);
        setErrorMessage(e.message);
      }
    },
    [options, user, history, pollId]
  );

  return (
    <Page>
      <CenterHorizontal>
        <PollForm
          ref={_form}
          edit
          formTitle="Edit poll"
          loading={loading}
          options={options}
          onSubmit={editPoll}
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
    case "setOptions":
      return action.options;
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
