import { validateFormWithSchema } from 'facturacion_common/src/Validacion.js';

const runAction = async (createReducer, state, action) => {
  const reducerFn = createReducer(action);
  const result = reducerFn(state);
  if (Array.isArray(result)) {
    const [newState, pendingAction] = result;
    return runAction(createReducer, newState, await pendingAction);
  }
  return result;
};

export const assertWithSchema = (schema, value) => {
  const result = validateFormWithSchema(schema, value);
  if (result.errors != null)
    throw new Error(
      'Schema validation errors: ' + JSON.stringify(result.errors)
    );
};

export const runActions = async (createReducer, actions) => {
  let state;
  for (let i = 0; i < actions.length; i++) {
    const newState = await runAction(createReducer, state, actions[i]);
    if (newState) state = newState;
  }
  return state;
};
