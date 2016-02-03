require("unit-setup.js");

import {Map} from "immutable";

import {changeCollections} from "actions/collections";

describe("`collections` actions", () => {

    describe("`changeCollections` function", () => {

        it("should return the correct object if parameter is an `Immutable.js`", () => {
            const collections = Map({});
            const ret = changeCollections(collections);
            expect(ret).to.deep.equal({
                type: "COLLECTIONS_CHANGE",
                payload: collections
            });
        });

        it("should throw an error if parameter isn't an `Immutable.js`", () => {
            const collections = {};
            function troublemaker () {
                changeCollections(collections);
            }
            expect(troublemaker).to.throw(Error);
            expect(troublemaker).to.throw("collections should be immutable.js");
        });

    });

});
