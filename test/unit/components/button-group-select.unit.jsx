require("unit-setup.js");

var R         = require("ramda");
var bootstrap = require("react-bootstrap");

describe("The `ButtonGroupSelect` component ", function () {

    var ButtonGroupSelect = proxyquire("components/button-group-select/", {});

    it("should have a default prop `getLabel` which stringifies `allowedValues`", function () {
        expect(ButtonGroupSelect.defaultProps.getLabel).to.be.a("function");
        var allowedValue = {
            a: 1,
            b: 2
        };
        var stringifiedValue = ButtonGroupSelect.defaultProps.getLabel(allowedValue);
        expect(stringifiedValue).to.be.a("string");
    });

    it("should call the `getLabel` prop (if supplied) to get the label for the children buttons", function () {
        var allowedValues = [1, 2, 3, 4];
        var getLabel = R.add(5);
        var getLabelSpy = sinon.spy(getLabel);
        var selectNode = TestUtils.renderIntoDocument(
            <ButtonGroupSelect
                allowedValues={allowedValues}
                getLabel={getLabelSpy}
                onChange={R.identity}
                value={allowedValues[0]}
            />
        );
        var buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, bootstrap.Button);
        var expectedLabels = R.map(getLabel, allowedValues);
        var actualLabels = R.map(function (buttonNode) {
            return buttonNode.props.children;
        }, buttonNodes);
        expect(expectedLabels).to.eql(actualLabels);
        expect(getLabelSpy.callCount).to.equal(allowedValues.length);
    });

    it("should render a button in the button group for each of the `allowedValues` passed as props", function () {
        var allowedValues = [1, 2, 3, 4];
        var selectElement = (
            <ButtonGroupSelect
                allowedValues={allowedValues}
                onChange={R.identity}
                value={allowedValues[0]}
            />
        );
        var selectNode = TestUtils.renderIntoDocument(selectElement);
        var selectDOMNode = selectNode.getDOMNode();
        expect(selectDOMNode.children.length).to.equal(allowedValues.length);
    });

    it("should set the active state of the button which corresponds to the value we supply", function () {
        var allowedValues = [{id: 1}, {id: 2}, {id: 3}];
        var selectedIndex = 0;
        var selectElement = (
            <ButtonGroupSelect
                allowedValues={allowedValues}
                getLabel={R.prop("id")}
                multi={false}
                onChange={R.identity}
                value={allowedValues[selectedIndex]}
            />
        );
        var selectNode = TestUtils.renderIntoDocument(selectElement);
        var buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, bootstrap.Button);
        var actualStates = buttonNodes.map(function (buttonNode) {
            return buttonNode.props.active;
        });
        var expectedStates = allowedValues.map(function (allowedValue, index) {
            return index === selectedIndex;
        });
        expect(actualStates).to.eql(expectedStates);
    });

    it("should set the active state of the button which corresponds to the value we supply", function () {
        var allowedValues = [{id: 1}, {id: 2}, {id: 3}];
        var changeSpy = sinon.spy();
        var selectElement = (
            <ButtonGroupSelect
                allowedValues={allowedValues}
                getLabel={R.prop("id")}
                onChange={changeSpy}
                value={allowedValues[0]}
            />
        );
        var selectNode = TestUtils.renderIntoDocument(selectElement);
        var buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, bootstrap.Button);
        buttonNodes.forEach(function (buttonNode, index) {
            var buttonDOMNode = buttonNode.getDOMNode();
            TestUtils.Simulate.click(buttonDOMNode);
            expect(changeSpy).to.have.been.calledWith(allowedValues[index]);
            changeSpy.reset();
        });
    });

    it("should allow to set the active state of more than one button if the prop `multi` is enabled", function () {
        var allowedValues = [{id: 1}, {id: 2}, {id: 3}];
        var selectedValues = R.remove(1, 1, allowedValues);
        var selectElement = (
            <ButtonGroupSelect
                allowedValues={allowedValues}
                getLabel={R.prop("id")}
                multi={true}
                onChange={R.identity}
                value={selectedValues}
            />
        );
        var selectNode = TestUtils.renderIntoDocument(selectElement);
        var buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, bootstrap.Button);
        var actualStates = buttonNodes.map(function (buttonNode) {
            return buttonNode.props.active;
        });
        var expectedStates = allowedValues.map(function (allowedValue) {
            return R.contains(allowedValue, selectedValues);
        });
        expect(actualStates).to.eql(expectedStates);
    });

});
