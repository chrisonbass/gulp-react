export const name = (action, state = "N/A") => {
  if ( action.type === "toggle-name" ){
    return state === "Ted" ? "Dan" : "Ted";
  }
  return state;
};

export const field = (action, state = "N/A") => {
  if ( action.type === "update-field" ){
    return action.value;
  }
  return state;
};

export const router = (action, state = "N/A") => {
  if ( action.type === "@@router/change" ){
    let newState = {
      ...state,
      path: window.location.pathname,
      search: window.location.search
    };
    return newState;
  }
  return state;
};
