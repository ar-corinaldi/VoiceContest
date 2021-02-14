export async function doFetch(url = "", method = "GET", body, token) {
  try {
    const CREDENTIALS = `JWT ${token}`;
    const FETCH_URL = `http://localhost:5000${url}`;
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
      throw new Error("Request not fulfilled");
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("error", e);
    return { error: e };
  }
}
