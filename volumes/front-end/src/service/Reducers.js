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
    return {
      ...state,
      path: window.location.pathname,
      search: window.location.search
    };
  }
  else if ( action.type === "@@router/update" ){
    return {
      ...state,
      ...(action.payload || {})
    };
  }
  return state;
};

export const navbar = (action, state = {}) => {
  if ( action.type === "app-load" ){
    return {
      links: [
        {
          to: "/home",
          label: "Home"
        },
        {
          to: "/about",
          label: "About"
        },
        {
          to: "/contact",
          label: "Contact"
        },
        {
          to: "/contact/jim",
          label: "Jim"
        }
      ]
    };
  }
  return state;
};
