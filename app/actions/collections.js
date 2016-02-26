import {Map} from "immutable";

export const COLLECTIONS_CHANGE = "COLLECTIONS_CHANGE";

export function changeCollections (collections) {
    if (!Map.isMap(collections)) {
        throw new Error("collections should be immutable.js");
    }
    return {
        type: COLLECTIONS_CHANGE,
        payload: collections
    };
}
