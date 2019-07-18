const drafts = {};

export const recoverDraft = key => {
  return drafts[key];
};

export const saveDraft = (key, value) => {
  drafts[key] = value;
};

export const deleteDraft = key => {
  delete drafts[key];
};
