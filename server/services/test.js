import responses from "../status";

export const testService = {
  test: async (req, res) => {
    try {
      let response = {
        a: 1,
        b: 2,
        c: 3
      };

      return responses.success(res, response);
    } catch (e) {
      return responses.error(res, e);
    }
  }
};
