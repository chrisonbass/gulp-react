export const routerMiddlere = (store, action, next) => {
  if ( action.type === "@@router/change" && action.pushState === true ){
    window.history.pushState(action.state || {
      to: action.to || "/"
    }, action.title || "", action.to || "/");
  }
  return next();
};
