import axios from "axios";

//return true only if is object and has items. empty/undefined/null will return false
export const isNotEmpty = (obj) => obj && Object.keys(obj).length > 0;

export const swrFetcher = (url) => axios.get(url).then((res) => res.data);

//@params: size : "MxN" i.e. "300x300"
// export const imgPlaceholderUrl = (size) =>
//   `https://via.placeholder.com/${size}.png?text=Content+is+loading...`;

export const imgPlaceholderUrl =
  "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80";
