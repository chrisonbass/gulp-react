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

export const routerChange = (to) => ({
  type: "@@router/change",
  to
});
