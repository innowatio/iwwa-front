import "unit-setup.js";

import chartReducer from "reducers/chart";

describe("`chart` reducer", () => {

    describe("`zoom` reducer", () => {
        const zoom = chartReducer.__get__("zoom");

        it("return an empty object if is passed type `RESET_ZOOM`", () => {
            const valuePassedFromAction = {
                type: "RESET_ZOOM"
            };
            const previousState = {min: 0, max: 1};
            const ret = zoom(previousState, valuePassedFromAction);
            expect(ret).to.deep.equal([]);
        });

        it("return the zoomed extreme of the chart if type `SET_ZOOM_EXTREMES`", () => {
            const valuePassedFromAction = {
                type: "SET_ZOOM_EXTREMES",
                payload: {
                    min: 1,
                    max: 7
                }
            };
            const ret = zoom(undefined, valuePassedFromAction);
            expect(ret).to.deep.equal({
                min: 1,
                max: 7
            });
        });

        it("return the default state if is not passed a correct type", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE"
            };
            const ret = zoom(undefined, valuePassedFromAction);
            expect(ret).to.deep.equal([]);
        });

    });

});
