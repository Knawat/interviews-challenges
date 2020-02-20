export const callApi = async (
  url,
  { method, headers, payload = undefined }
) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: payload && JSON.stringify(payload)
  });
  const data = await response.json();

  return data;
};
