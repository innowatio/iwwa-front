import {Map} from "immutable";

import {COLLECTIONS_CHANGE} from "lib/asteroid-redux";

export function collections (state = Map(), {type, payload}) {
    switch (type) {
    case COLLECTIONS_CHANGE:
        return payload;
    default:
        return state;
    }
}
