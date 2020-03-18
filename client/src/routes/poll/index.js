import React, { useEffect, useCallback, useState } from "react";
import "./index.css";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Page, CenterHorizontal, ErrorDialog } from "../../components";
import { axios } from "../../redux/store";
import { VoteChart } from "./components/VoteChart";
import { RadioGroup, FormLabel, Button } from "@material-ui/core";
import Send from "@material-ui/icons/Send";
import Done from "@material-ui/icons/Done";
import Share from "@material-ui/icons/Share";
import Edit from "@material-ui/icons/Edit";
import Option from "./components/Option";
import Toast from "../../components/toast";

export function PollPage() {
  const { pollId } = useParams();
  const user = useSelector(state => state.user);
  const session = useSelector(state => state.session);
  const [errorMessage, setErrorMessage] = useState(null);
  const [poll, setPoll] = useState(null);
  const [choosenOption, setChoosenOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [preloadedVote, setPreloadedVote] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const history = useHistory();

  const loadPoll = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/poll/${pollId}`);

      if (data.userVote) {
        const option = data.userVote.optionSeq.toString();
        setPreloadedVote(option);
        setChoosenOption(option);
        setVoted(true);
      }

      setPoll(data);
    } catch (e) {
      setErrorMessage(e.message);
    }
  }, [pollId]);

  useEffect(() => {
    loadPoll();
  }, [loadPoll]);

  const vote = useCallback(
    async event => {
      try {
        event.preventDefault();

        if (!choosenOption) {
          setErrorMessage("Select an option to vote.");
          return;
        }
        setLoading(true);

        let result;
        if (preloadedVote) {
          result = await axios.patch(`/api/poll/${poll._id}/vote`, {
            optionSeq: Number(choosenOption)
          });
        } else {
          result = await axios.post(`/api/poll/${poll._id}/vote`, {
            optionSeq: Number(choosenOption)
          });
        }

        const { data } = result;

        setPoll(data);
        setLoading(false);
        setVoted(true);
        setPreloadedVote(choosenOption);
      } catch (e) {
        setErrorMessage(e.message);
        setLoading(false);
      }
    },
    [choosenOption, poll, preloadedVote]
  );

  const copyToClipboard = useCallback(() => {
    const textField = document.createElement("textarea");
    textField.innerText = window.location.href;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();

    setToastOpen(true);
  }, []);

  const blockUnlogged = poll?.requiresAuth && !user;
  const lockVote = voted && preloadedVote === choosenOption && blockUnlogged;

  return (
    <Page>
      <CenterHorizontal>
        {poll && (
          <>
            <div>
              <h1>{poll.title}</h1>
              <p>{poll.description}</p>

              {poll.totalVotes > 0 ? (
                <VoteChart data={poll.groupedVotes} />
              ) : (
                <>
                  <br />
                  <p>No votes yet! Be the first to vote.</p>
                </>
              )}
            </div>
            <form onSubmit={vote} className="optionForm">
              <FormLabel>
                Choose an option {blockUnlogged && "(requires login)"}:
              </FormLabel>
              <RadioGroup
                name="choosenOption"
                value={choosenOption}
                onChange={event => setChoosenOption(event.target.value)}
              >
                {poll.options.map((option, index) => (
                  <Option
                    key={index.toString()}
                    option={option}
                    index={index}
                    loading={loading}
                  />
                ))}
              </RadioGroup>

              <div className="buttonContainer">
                <Button
                  disabled={
                    loading || lockVote || preloadedVote === choosenOption
                  }
                  type="submit"
                  variant="contained"
                  startIcon={
                    loading || lockVote || preloadedVote === choosenOption ? (
                      <Done />
                    ) : (
                      <Send />
                    )
                  }
                  color="secondary"
                >
                  {voted && preloadedVote === choosenOption
                    ? "Voted!"
                    : preloadedVote
                    ? "Update vote"
                    : "Send vote"}
                </Button>
                <div className="buttonSeparator" />
                <Button
                  onClick={copyToClipboard}
                  variant="outlined"
                  startIcon={<Share />}
                  color="secondary"
                >
                  Share
                </Button>
                {(poll.ownerId === user?._id || poll.sessionId === session) && (
                  <>
                    <div className="buttonSeparator" />
                    <Button
                      onClick={() => history.push(`/poll/${pollId}/edit`)}
                      variant="outlined"
                      startIcon={<Edit />}
                      color="primary"
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </form>
          </>
        )}
      </CenterHorizontal>

      <Toast
        isOpen={toastOpen}
        close={() => setToastOpen(false)}
        message={"Poll link copied to clipdoard."}
      />
      <ErrorDialog message={errorMessage} close={() => setErrorMessage(null)} />
    </Page>
  );
}
