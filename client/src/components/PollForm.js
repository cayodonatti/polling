import React, { useImperativeHandle, forwardRef, useState } from "react";
import "../index.css";
import { useSelector } from "react-redux";
import {
  TextField,
  Button,
  FormControlLabel,
  Switch,
  FormGroup
} from "@material-ui/core";

import Add from "@material-ui/icons/Add";
import Done from "@material-ui/icons/Done";

import { Option } from "./Option";

function Form(
  {
    edit,
    formTitle,
    options,
    loading,
    onSubmit,
    onOptionChange,
    onOptionRemove,
    addOption
  },
  ref
) {
  const user = useSelector(state => state.user);

  const [defaultValues, setDefaultValues] = useState({});
  const [formKey, setFormKey] = useState(new Date().getTime());

  useImperativeHandle(ref, () => ({
    // Very ugly hack to reset form default values and update Material UI animations
    // Setting value via document.getElementById didn't work
    // Should consider making the whole thing controlled
    resetFormValues: ({ title, description, requiresAuth }) => {
      setDefaultValues({ title, description, requiresAuth });
      setFormKey(new Date().getTime());
    }
  }));

  return (
    <form key={formKey} onSubmit={onSubmit}>
      <h2>{formTitle}</h2>
      <TextField
        defaultValue={defaultValues.title}
        disabled={loading}
        fullWidth
        type="text"
        id="title"
        label="Title"
        placeholder="Pick a title for your poll"
        variant="outlined"
        margin="normal"
        required
      />
      <TextField
        defaultValue={defaultValues.description}
        disabled={loading}
        fullWidth
        multiline={true}
        type="text"
        id="description"
        label="Description"
        variant="outlined"
        margin="normal"
      />
      {user && (
        <FormGroup row>
          <FormControlLabel
            size={"small"}
            control={
              <Switch
                defaultChecked={defaultValues.requiresAuth}
                disabled={loading}
                id="requiresAuth"
                value="requiresAuth"
              />
            }
            label="Require login for voting"
          />
        </FormGroup>
      )}

      <h2>Options</h2>
      <div className="options">
        {options.map((x, i) => (
          <Option
            key={i.toString()}
            item={x}
            index={i}
            disabled={loading}
            onChange={event => onOptionChange(event, i)}
            onRemove={event => onOptionRemove(event, i)}
          />
        ))}
      </div>

      <div className="addOptionButton">
        <Button
          disabled={loading}
          variant="outlined"
          onClick={addOption}
          startIcon={<Add />}
          color="primary"
        >
          Add option
        </Button>
        <div className="separator" />
        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          startIcon={<Done />}
          color="secondary"
        >
          {edit ? "Update poll" : "Create poll"}
        </Button>
      </div>
    </form>
  );
}

export const PollForm = forwardRef(Form);
