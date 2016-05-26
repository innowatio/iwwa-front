import {Map} from "immutable";

import {collections} from "reducers/collections";

describe("`collections` reducer", () => {

    describe("`COLLECTIONS_CHANGE` type", () => {

        const stateCollections = Object.freeze(
            Map({})
        );

        it("should return the correct Immutable.Map", () => {
            const valuePassedFromAction = {
                type: "COLLECTIONS_CHANGE",
                payload: Map({
                    a: "a"
                })
            };
            const ret = collections(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal(Map({
                a: "a"
            }));
        });

        it("should return the previous state if any correct `type` is checked", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE"
            };
            const ret = collections(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal(Map({}));
        });

    });

});
