import { callApi } from "./index.js";

export const getToken = async () => {
  const {
    channel: { token }
  } = await callApi("/api/token", {
    method: "POST",
    payload: {
      consumerKey: process.env.VUE_APP_CONSUMER_KEY,
      consumerSecret: process.env.VUE_APP_CONSUMER_SECRET
    }
  });

  return token;
};
