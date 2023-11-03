import type {
  _ActionsTree,
  _GettersTree,
  PiniaPluginContext,
  StateTree,
  Store
} from "pinia";

declare const window: Window & {
  INITIAL_STATE_FOR_RESET: Record<string, StateTree>;
};

type _Store = Store<string, StateTree, _GettersTree<StateTree>, _ActionsTree>;
export const state: Record<string, StateTree> = {};
export const stores: Record<string, _Store> = {};

if (!import.meta.env.SSR) {
  Object.assign(state, window.INITIAL_STATE_FOR_RESET);
}

/**
 * @description reset all registered stores in pinia except the ones in the excludedStoreNames parameter.
 * @returns void
 */
export function resetAll(excludedStoreNames: string[]): void {
  for (const storeName in stores) {
    if (!excludedStoreNames || !excludedStoreNames.includes(storeName)) {
      stores[storeName].$reset();
    }
  }
}

export function resetState({ store }: PiniaPluginContext): void {
  if (import.meta.env.SSR) {
    const initialState = JSON.parse(JSON.stringify(store.$state));
    state[store.$id] = initialState;
    stores[store.$id] = store;
    store.$reset = () => store.$patch(JSON.parse(JSON.stringify(initialState)));
    store.$resetAll = resetAll;
  } else {
    state[store.$id] = JSON.parse(JSON.stringify(store.$state));
    stores[store.$id] = store;
    store.$reset = () => {
      const initialState = state[store.$id];
      for (const key in store.$state) {
        store.$state[key] = JSON.parse(JSON.stringify(initialState[key]));
      }
    };

    store.$resetAll = resetAll;
  }
}
