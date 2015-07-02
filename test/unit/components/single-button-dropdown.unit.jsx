require("unit-setup.js");

var R         = require("ramda");
var bootstrap = require("react-bootstrap");

describe("The `DropdownButtonSelect` component ", function () {

    var DropdownButtonSelect = proxyquire("components/single-button-dropdown/", {});

    it("should have a default prop `getLabel` which stringifies `allowedItems`", function () {
        expect(DropdownButtonSelect.defaultProps.getLabel).to.be.a("function");
        var allowedValue = {
            a: 1,
            b: 2
        };
        var stringifiedValue = DropdownButtonSelect.defaultProps.getLabel(allowedValue);
        expect(stringifiedValue).to.be.a("string");
    });

    it("should call the `getLabel` prop (if supplied) to get the label for the children dropdown button", function () {
        var allowedItems = [1, 2, 3, 4];
        var getLabel = R.add(5);
        var getLabelSpy = sinon.spy(getLabel);
        var selectNode = TestUtils.renderIntoDocument(
            <DropdownButtonSelect
                allowedItems={allowedItems}
                getLabel={getLabelSpy}
                onChange={R.identity}
                value={allowedItems[0]}
            />
        );
        var menuItemNodes = TestUtils.scryRenderedComponentsWithType(selectNode, bootstrap.MenuItem);
        var expectedLabels = R.map(getLabel, allowedItems);
        var actualLabels = R.map(function (menuNodes) {
            return menuNodes.props.children;
        }, menuItemNodes);
        expect(expectedLabels).to.eql(actualLabels);
        expect(getLabelSpy.callCount).to.equal(allowedItems.length);
    });

    it("should set the active state of the button which corresponds to the value we supply", function () {
        var allowedItems = [{id: 1}, {id: 2}, {id: 3}];
        var selectedIndex = 0;
        var selectElement = (
            <DropdownButtonSelect
                allowedItems={allowedItems}
                getLabel={R.prop("id")}
                onChange={R.identity}
                value={allowedItems[selectedIndex]}
            />
        );
        var selectNode = TestUtils.renderIntoDocument(selectElement);
        var menuItemNodes = TestUtils.scryRenderedComponentsWithType(selectNode, bootstrap.MenuItem);
        var actualStates = menuItemNodes.map(function (buttonNode) {
            return buttonNode.props.active;
        });
        var expectedStates = allowedItems.map(function (allowedItem, index) {
            return index === selectedIndex;
        });
        expect(actualStates).to.eql(expectedStates);
    });

});
