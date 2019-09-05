import { createStore } from "redux";
let initialState = {
  tree: { tagName: "div", children: [], css: {}, src: "", href: "" },
  location: [],
  css: {},
  href: "",
  src: "",
  iframeSrc: "",
  username: ""
};

let locReset = state => {
  return { ...state, locationSet: false };
};

let reducer = (state, action) => {
  if (action.type === "addChildToTree") {
    console.log(initialState);
    console.log(action.tree);
    return { ...state, tree: action.tree };
  }
  if (action.type === "updateIframe") {
    return { ...state, iframeSrc: action.iframeSrc };
  }
  if (action.type === "store-node-props") {
    return {
      ...state,
      location: action.location,
      css: action.css,
      href: action.href,
      src: action.src
    };
  }
  if (action.type === "login-success") {
    return {
      ...state,
      username: action.username
    };
  }
  if (action.type === "load-site") {
    return {
      ...state,
      tree: action.siteToLoad
    };
  }

  return state;
};

let store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
