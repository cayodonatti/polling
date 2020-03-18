import React, { useCallback } from "react";
import "./index.css";
import { Button } from "@material-ui/core";
import { Page, Center } from "../../components";
import { useHistory } from "react-router-dom";
import { BarChart, Bar } from "recharts";
import { data } from "./chartData";
import { useSelector } from "react-redux";

export function HomePage() {
  const user = useSelector(state => state.user);
  const history = useHistory();
  const navigate = useCallback(
    route => {
      history.push(route);
    },
    [history]
  );

  return (
    <Page>
      <Center>
        <BarChart width={150} height={100} data={data}>
          <Bar dataKey="uv" fill="#8884d8" />
        </BarChart>
        <h1 className="title">Welcome to Cayo's simple polling</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/new-poll")}
        >
          Create a poll
        </Button>

        <div className="separator" />

        {user && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/user/polls")}
          >
            My polls
          </Button>
        )}
      </Center>
    </Page>
  );
}
