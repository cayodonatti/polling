import { loginService } from "../services";

export const loginRouter = router => {
  router.post("/login", loginService.login);
};
