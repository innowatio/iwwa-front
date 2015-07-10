require("unit-setup.js");

var R         = require("ramda");
var bootstrap = require("react-bootstrap");

describe("The `DropdownSelect` component ", function () {

    var DropdownSelect = proxyquire("components/dropdown-select/", {});

    it("should have a default prop `getLabel` which stringifies `allowedValues`", function () {
        expect(DropdownSelect.defaultProps.getLabel).to.be.a("function");
        var allowedValue = {
            a: 1,
            b: 2
        };
        var stringifiedValue = DropdownSelect.defaultProps.getLabel(allowedValue);
        expect(stringifiedValue).to.be.a("string");
    });

    it("should have a default prop `getKey` which stringifies `allowedValues`", function () {
        expect(DropdownSelect.defaultProps.getLabel).to.be.a("function");
        var allowedValue = {
            a: 1,
            b: 2
        };
        var stringifiedValue = DropdownSelect.defaultProps.getKey(allowedValue);
        expect(stringifiedValue).to.be.a("string");
    });

    it("should call the `getLabel` prop (if supplied) to get the label for the children dropdown button", function () {
        var allowedValues = [1, 2, 3, 4];
        var getLabel = R.add(5);
        var getLabelSpy = sinon.spy(getLabel);
        var selectNode = TestUtils.renderIntoDocument(
            <DropdownSelect
                allowedValues={allowedValues}
                getLabel={getLabelSpy}
                onChange={R.identity}
                value={allowedValues[0]}
            />
        );
        var menuItemNodes = TestUtils.scryRenderedComponentsWithType(selectNode, bootstrap.MenuItem);
        var expectedLabels = R.map(getLabel, allowedValues);
        var actualLabels = R.map(function (menuNodes) {
            return menuNodes.props.children;
        }, menuItemNodes);
        expect(expectedLabels).to.eql(actualLabels);
        expect(getLabelSpy.callCount).to.equal(allowedValues.length);
    });

    it("should call the `getKey` prop (if supplied) to get the key for the children dropdown button", function () {
        var allowedValues = [1, 2, 3, 4];
        var getKey = R.add(5);
        var getKeySpy = sinon.spy(getKey);
        var selectNode = TestUtils.renderIntoDocument(
            <DropdownSelect
                allowedValues={allowedValues}
                getKey={getKeySpy}
                onChange={R.identity}
                value={allowedValues[0]}
            />
        );
        TestUtils.scryRenderedComponentsWithType(selectNode, bootstrap.MenuItem);
        expect(getKeySpy.callCount).to.equal(allowedValues.length);
    });

    it("should set the active state of the button which corresponds to the value we supply", function () {
        var allowedValues = [{id: 1}, {id: 2}, {id: 3}];
        var selectedIndex = 0;
        var selectElement = (
            <DropdownSelect
                allowedValues={allowedValues}
                getKey={R.prop("id")}
                getLabel={R.prop("id")}
                onChange={R.identity}
                value={allowedValues[selectedIndex]}
            />
        );
        var selectNode = TestUtils.renderIntoDocument(selectElement);
        var menuItemNodes = TestUtils.scryRenderedComponentsWithType(selectNode, bootstrap.MenuItem);
        var actualStates = menuItemNodes.map(function (buttonNode) {
            return buttonNode.props.active;
        });
        var expectedStates = allowedValues.map(function (allowedValue, index) {
            return index === selectedIndex;
        });
        expect(actualStates).to.eql(expectedStates);
    });

    it("should call the `onChange` handler with the corresponding value when an item is clicked", function () {
        var allowedValues = [{id: 1}, {id: 2}, {id: 3}];
        var changeSpy = sinon.spy();
        var selectElement = (
            <DropdownSelect
                allowedValues={allowedValues}
                getKey={R.prop("id")}
                getLabel={R.prop("id")}
                onChange={changeSpy}
                value={allowedValues[0]}
            />
        );
        var selectNode = TestUtils.renderIntoDocument(selectElement);
        var itemNodes = TestUtils.scryRenderedComponentsWithType(selectNode, bootstrap.MenuItem);
        itemNodes.forEach(function (itemNode, index) {
            var itemDOMNode = itemNode.getDOMNode();
            TestUtils.Simulate.select(itemDOMNode);
            expect(changeSpy).to.have.been.calledWith(allowedValues[index]);
            changeSpy.reset();
        });
    });

});
