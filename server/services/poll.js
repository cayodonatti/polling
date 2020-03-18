import { Poll } from "../schemas";
import { Types } from "mongoose";
import { getUserId } from "../helpers";
import responses from "../status";

export const pollService = {
  create: async (req, res) => {
    try {
      // Getting userId from jwt token prevents user from faking poll creation
      const userId = getUserId(req.headers.authorization);
      const sessionId = req.headers.sessionid;
      const { title, description, options, requiresAuth } = req.body;

      if (
        title &&
        (Types.ObjectId.isValid(userId) || sessionId) &&
        options &&
        options.filter(x => Boolean(x)).length > 1
      ) {
        const now = new Date();
        const poll = await Poll.create({
          title,
          description,
          ownerId: userId,
          options: options.map((x, i) => ({ text: x, seq: i + 1 })),
          sessionId: userId ? null : sessionId,
          requiresAuth: Boolean(userId && requiresAuth),
          votes: [],
          meta: {
            createdAt: now
          }
        });

        return responses.success(res, poll.toObject({ virtuals: true }));
      } else {
        return responses.error(res, new Error("Invalid request"), 400);
      }
    } catch (e) {
      return responses.error(res, e);
    }
  },
  update: async (req, res) => {
    try {
      // Getting userId from jwt token prevents user from faking poll creation
      const userId = getUserId(req.headers.authorization);
      const sessionId = req.headers.sessionid;
      const { pollId } = req.params;
      const { title, description, options, requiresAuth } = req.body;

      if (
        title &&
        Types.ObjectId.isValid(pollId) &&
        (Types.ObjectId.isValid(userId) || sessionId) &&
        options &&
        options.filter(x => Boolean(x)).length > 1
      ) {
        const poll = await Poll.findOne({ _id: pollId }).exec();

        if (!poll) {
          return responses.error(res, new Error("Poll not found"), 404);
        }
        if (
          (userId && poll.ownerId != userId) ||
          (!userId && sessionId && poll.sessionId != sessionId)
        ) {
          return responses.error(
            res,
            new Error("You can only update your own polls"),
            403
          );
        }

        poll.title = title;
        poll.description = description;
        poll.requiresAuth = userId && requiresAuth;
        poll.options = options.map((x, i) => ({ text: x, seq: i + 1 }));
        poll.meta.updateAt = new Date();

        await poll.save();

        return responses.success(res, poll.toObject({ virtuals: true }));
      } else {
        return responses.error(res, new Error("Invalid request"), 400);
      }
    } catch (e) {
      return responses.error(res, e);
    }
  },
  getById: async (req, res) => {
    try {
      const { pollId } = req.params;
      const userId = getUserId(req.headers.authorization);
      const sessionId = req.headers.sessionid;

      if (!Types.ObjectId.isValid(pollId)) {
        responses.error(res, new Error("Not found"), 400);
        return;
      }
      if (!(Types.ObjectId.isValid(userId) || sessionId)) {
        return responses.error(res, new Error("Invalid request"), 400);
      }

      if (pollId) {
        const poll = await Poll.findById(pollId)
          .populate("owner", "-password")
          .exec();

        const result = poll.toObject({ virtuals: true });
        result.userVote = poll.votes.find(
          x => x.userId == userId || x.userSession == sessionId
        );
        delete result.votes;

        return responses.success(res, result);
      } else {
        return responses.error(res, new Error("Invalid request"), 400);
      }
    } catch (e) {
      return responses.error(res, e);
    }
  },
  getByUser: async (req, res) => {
    try {
      const userId = getUserId(req.headers.authorization);

      if (!Types.ObjectId.isValid(userId)) {
        responses.error(res, new Error("Invalid Request"), 400);
        return;
      }

      if (userId) {
        const pollList = await Poll.find({ ownerId: userId }).exec();

        return responses.success(
          res,
          pollList.map(x => {
            const poll = x.toObject({ virtuals: true });
            delete poll.votes;

            return poll;
          })
        );
      } else {
        return responses.error(res, new Error("Invalid request"), 400);
      }
    } catch (e) {
      return responses.error(res, e);
    }
  },
  addVote: async (req, res) => {
    try {
      const { optionSeq } = req.body;
      const { pollId } = req.params;
      const userId = getUserId(req.headers.authorization);
      const sessionId = req.headers.sessionid;

      if (
        !(
          optionSeq &&
          pollId &&
          Types.ObjectId.isValid(pollId) &&
          (userId || sessionId)
        )
      ) {
        return responses.error(res, new Error("Invalid request"), 400);
      }

      const poll = await Poll.findById(pollId).exec();
      if (poll && poll.requiresAuth && !userId) {
        return responses.error(
          res,
          new Error("This poll requires you to login to vote."),
          403
        );
      }

      const vote = await Poll.findOne({
        _id: pollId,
        $or: [{ "votes.userId": userId }, { "votes.userSession": sessionId }]
      }).exec();

      if (vote) {
        return responses.error(
          res,
          new Error("You have already voted on this poll."),
          403
        );
      } else {
        poll.votes.push({
          userId,
          userSession: userId ? null : sessionId,
          optionSeq
        });
        await poll.save();
      }

      const result = poll.toObject({ virtuals: true });
      delete result.votes;

      return responses.success(res, result);
    } catch (e) {
      return responses.error(res, e);
    }
  },
  updateVote: async (req, res) => {
    try {
      const { optionSeq } = req.body;
      const { pollId } = req.params;
      const userId = getUserId(req.headers.authorization);
      const sessionId = req.headers.sessionid;

      if (
        !(
          optionSeq &&
          pollId &&
          Types.ObjectId.isValid(pollId) &&
          (userId || sessionId)
        )
      ) {
        return responses.error(res, new Error("Invalid request"), 400);
      }

      const poll = await Poll.findById(pollId).exec();
      const userVote = poll.votes.find(
        x => x.userId == userId || x.userSession == sessionId
      );
      userVote.optionSeq = optionSeq;
      poll.markModified("votes");
      await poll.save();

      const result = poll.toObject({ virtuals: true });
      delete result.votes;

      return responses.success(res, result);
    } catch (e) {
      return responses.error(res, e);
    }
  }
};
