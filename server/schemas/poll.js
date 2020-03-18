import mongoose, { Schema } from "mongoose";

const voteSchema = new Schema({
  userId: mongoose.Types.ObjectId,
  userSession: String,
  optionSeq: Number
});
const optionSchema = new Schema({
  text: String,
  seq: Number
});

const pollSchema = new Schema({
  title: String,
  description: String,
  requiresAuth: Boolean,
  options: [optionSchema],
  ownerId: mongoose.Types.ObjectId,
  sessionId: String,
  votes: [voteSchema],
  meta: {
    createdAt: Date,
    lastUpdated: Date
  }
});

pollSchema.virtual("totalVotes").get(function() {
  return this.votes.length;
});
pollSchema.virtual("groupedVotes").get(function() {
  const groupedVotes = this.options.toObject().map(x => ({
    text: x.text,
    seq: x.seq,
    count: 0
  }));

  for (let vote of this.votes.toObject()) {
    groupedVotes.find(x => x.seq === vote.optionSeq).count++;
  }

  return groupedVotes;
});
pollSchema.virtual("owner", {
  ref: "user",
  localField: "ownerId",
  foreignField: "_id",
  justOne: true
});

export const Poll = mongoose.model("poll", pollSchema);
