export default {
  success: (res, data) => {
    let payload = {
      data,
      message: "Success"
    };
    res.status(200).json(payload);
  },
  error: (res, error, status = 500) => {
    const data = {
      data: null,
      message: error.message
    };
    res.status(status ?? 500).json(data);
  }
};
