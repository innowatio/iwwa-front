require("unit-setup.js");

var R = require("ramda");

var TreeView = proxyquire("components/tree-view/", {});

describe("The `TreeView` component ", function () {

    describe("the `setPath` function ", function () {
        it("should return the expected array", function () {
            const givenArray = ["a", "b", "c"];
            const expected = ["a", "b", "c", "d"];

            expect(expected).to.eql(TreeView.prototype.setPath(givenArray, "d", 4));
        });

        it("should put the given value in the corret position and remove the following values", function () {
            const givenArray = ["a", "b", "c"];
            const expected = ["a", "d"];

            expect(expected).to.eql(TreeView.prototype.setPath(givenArray, "d", 1));
        });
    });
});
