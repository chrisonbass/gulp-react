export const updateField = (e) => ({
  type: "update-field",
  value: e.target.value
});

export const noAction = () => ({
  type: "no-action",
  data: { fake: "foo" }
});

export const toggleName = () => ({
  type: "toggle-name"
});

export const routerChange = (to = document.location.pathname, pushState = true) => ({
  type: "@@router/change",
  to,
  pushState
});

export const routerUpdate = (payload) => ({
  type: "@@router/update",
  payload
});

export const appLoad = () => ({
  type: "app-load"
});
