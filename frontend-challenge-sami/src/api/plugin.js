import qs from "query-string";

async function callApi(endpoint, payload) {
  let [method, url] = endpoint;

  if (method === "get" && payload) {
    url = `${url}?${qs.stringify(payload)}`;
    payload = undefined;
  } else {
    payload = payload && JSON.stringify(payload);
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...makeHeaders({ token: this.$store.state.token })
    },
    body: payload
  });
  const data = await response.json();

  return data;
}

function makeHeaders({ token }) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export function ApiPlugin(Vue) {
  Vue.prototype.$api = callApi;
}
