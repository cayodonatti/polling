import { testService } from "../services";

export const testRouter = router => {
  router.get("/test", testService.test);
};
