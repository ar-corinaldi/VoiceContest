export async function doFetch(url = "", method = "GET", body, token) {
  let URL = `${process.env.REACT_APP_URL_ENDPOINTS_TEST}${url}`;
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    URL = `${process.env.REACT_APP_URL_ENDPOINTS_PROD}${url}`;
  }
  try {
    const CREDENTIALS = `JWT ${token}`;
    const FETCH_URL = URL;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    let res;
    if (method === "GET") {
      if (token) {
        const headers = new Headers();
        headers.append("Authorization", CREDENTIALS);
        res = await fetch(FETCH_URL, { headers });
      } else {
        res = await fetch(FETCH_URL);
      }
    } else if (method === "POST" || method === "PUT") {
      if (token) headers.append("Authorization", CREDENTIALS);
      res = await fetch(FETCH_URL, {
        method,
        body: JSON.stringify(body),
        headers,
      });
    } else if (method === "DELETE") {
      if (token) {
        headers.append("Authorization", CREDENTIALS);
        res = await fetch(FETCH_URL, { method, headers });
      } else {
        res = await fetch(FETCH_URL, { method });
      }
    }
    if (!res.ok) {
      throw new Error(await res.json().error);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("error", e);
    return { error: e };
  }
}
