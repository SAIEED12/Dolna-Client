import { getTokenServer } from "./getTokenServer";

const parseError = (result, fallback, status) => {
  const message =
    result?.error || result?.msg || result?.message || `${fallback}: ${status}`;
  const err = new Error(message);
  err.status = status;
  return err;
};

export const authFetch = async (url, options = {}) => {
  const token = await getTokenServer();
  const { headers: customHeaders, ...rest } = options;
  return fetch(url, {
    ...rest,
    headers: {
      ...(rest.method && rest.method !== "GET"
        ? { "Content-Type": "application/json" }
        : {}),
      ...customHeaders,
      Authorization: `Bearer ${token}`,
    },
  });
};

export const authFetchJson = async (url, options = {}, fallback = "Request failed") => {
  const response = await authFetch(url, options);
  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }
  if (!response.ok) {
    throw parseError(result, fallback, response.status);
  }
  return result;
};
