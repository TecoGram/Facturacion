export const updateState = (component, action) => {
  if (!action) return;

  component.setState(currentState => {
    const reducerFn = component.createReducer(action);
    const res = reducerFn(currentState);

    if (Array.isArray(res)) {
      const [newState, promise] = res;
      runSideEffect(component, promise);
      return newState;
    }

    return res;
  });
};

const runSideEffect = (component, promise) =>
  promise.then(
    action => updateState(component, action),
    action => updateState(component, action)
  );
