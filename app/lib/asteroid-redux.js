import debounce from "lodash.debounce";

export const COLLECTIONS_CHANGE = "COLLECTIONS_CHANGE";

function changeCollections (collections) {
    return {
        type: COLLECTIONS_CHANGE,
        payload: collections
    };
}

export function syncStoreAndAsteroid (store, asteroid) {
    store.dispatch(changeCollections(asteroid.collections));
    asteroid.on("collections:change", debounce(() => {
        store.dispatch(changeCollections(asteroid.collections));
    }, 50));
}
