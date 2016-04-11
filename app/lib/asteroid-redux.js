import debounce from "lodash.debounce";

import {changeCollections} from "actions/collections";

export function syncStoreAndAsteroid (store, asteroid) {
    store.dispatch(changeCollections(asteroid.collections));
    asteroid.on("collections:change", debounce(() => {
        store.dispatch(changeCollections(asteroid.collections));
    }, 150));
}
