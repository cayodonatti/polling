import { pollService } from "../services";
import { Router } from "express";
import { authMiddleware } from "../middlewares";

export const pollRouter = router => {
  const internalRouter = Router();

  // Auth-only routes can use auth middleware
  internalRouter.get("/user", authMiddleware, pollService.getByUser);
  internalRouter.post("/:pollId/vote", pollService.addVote);
  internalRouter.patch("/:pollId/vote", pollService.updateVote);
  internalRouter.get("/:pollId", pollService.getById);
  internalRouter.patch("/:pollId", pollService.update);
  internalRouter.post("/", pollService.create);

  router.use("/poll", internalRouter);
};
