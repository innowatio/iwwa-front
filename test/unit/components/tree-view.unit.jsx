require("unit-setup.js");

var R         = require("ramda");
var bootstrap = require("react-bootstrap");

describe("The `TreeView` component ", function () {

    var TreeView = proxyquire("components/tree-view/", {});

    describe("the `setPath` function ", function () {
        it("should return the expected array", function () {
            const givenArray = ["a", "b", "c"];
            const expected = ["a", "b", "c", "d", undefined];

            var selectElement = (
                <TreeView
                    allowedValues={[]}
                    value={[]}
                />
            );
            var selectNode = TestUtils.renderIntoDocument(selectElement);
            expect(expected).to.eql(selectNode.setPath(givenArray, "d", 4));
        });

        it("should put the given value in the corret position and remove the following values", function () {
            const givenArray = ["a", "b", "c"];
            const expected = ["a", "d", undefined];

            var selectElement = (
                <TreeView
                    allowedValues={[]}
                    value={[]}
                />
            );
            var selectNode = TestUtils.renderIntoDocument(selectElement);
            expect(expected).to.eql(selectNode.setPath(givenArray, "d", 1));
        });
    });
});
