import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText
} from "@material-ui/core";
import PieChart from "@material-ui/icons/PieChart";
import ArrowForward from "@material-ui/icons/ArrowForward";

export default function Poll({ poll, onClick }) {
  return (
    <ListItem button onClick={() => onClick(poll._id)}>
      <ListItemAvatar>
        <Avatar>
          <PieChart />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={poll.title}
        secondary={`${poll.totalVotes} votes`}
      />
      <ArrowForward edge="end" />
    </ListItem>
  );
}
