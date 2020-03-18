import React from "react";
import { TextField, Button } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";

export const Option = ({ item, index, onChange, onRemove, disabled }) => {
  return (
    <div key={index.toString()} className="option">
      <TextField
        disabled={disabled}
        label={`Option ${index + 1}`}
        placeholder="Option description..."
        size="small"
        onChange={onChange}
        value={item}
      />
      <Button disabled={disabled} onClick={onRemove}>
        <Delete />
      </Button>
    </div>
  );
};
