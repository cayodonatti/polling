import React from "react";
import "./index.css";
import { FormControlLabel, Radio } from "@material-ui/core";
import { getColor } from "./VoteChart";

export default function Option({ option, index, loading }) {
  return (
    <div className="radioItem">
      <div className="square" style={{ backgroundColor: getColor(index) }} />
      <FormControlLabel
        size={"small"}
        value={option.seq.toString()}
        control={<Radio disabled={loading} />}
        label={option.text}
      />
    </div>
  );
}
