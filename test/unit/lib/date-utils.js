import getLastUpdate from "lib/date-utils";

describe("`getLastUpdate`", () => {
    it("returns a string that show the time pass from date to now", () => {
        const dateValue = new Date();
        expect(getLastUpdate(dateValue)).to.deep.equal("qualche secondo fa");
    });

    it("returns a message error about date format", () => {
        const dateValue = "";
        expect(getLastUpdate(dateValue)).to.deep.equal("formato data errato");
    });
});
