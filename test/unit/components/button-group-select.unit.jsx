require("unit-setup.js");

var R = require("ramda");

var Button = require("components/button/");

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

    it("should have a default prop `getKey` which stringifies `allowedValues`", function () {
        expect(ButtonGroupSelect.defaultProps.getKey).to.be.a("function");
        var allowedValue = {
            a: 1,
            b: 2
        };
        var stringifiedValue = ButtonGroupSelect.defaultProps.getKey(allowedValue);
        expect(stringifiedValue).to.be.a("string");
    });

    it("should call the `getLabel` prop (if supplied) to get the label for the children buttons", function () {
        var allowedValues = [1, 2, 3, 4];
        var getLabel = R.add(5);
        var getLabelSpy = sinon.spy(getLabel);
        var selectNode = TestUtils.renderIntoDocument(
            <ButtonGroupSelect
                allowedValues={allowedValues}
                getActiveStyle={R.identity}
                getLabel={getLabelSpy}
                onChange={R.identity}
                value={allowedValues.slice(0, 1)}
            />
        );
        var buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, Button);
        var expectedLabels = R.map(getLabel, allowedValues);
        var actualLabels = R.map(function (buttonNode) {
            return buttonNode.props.children;
        }, buttonNodes);
        expect(expectedLabels).to.eql(actualLabels);
        expect(getLabelSpy.callCount).to.equal(allowedValues.length);
    });

    it("should call the `getKey` prop (if supplied) to get the key for the children buttons", function () {
        var allowedValues = [1, 2, 3, 4];
        var getKeySpy = sinon.spy();
        var selectNode = TestUtils.renderIntoDocument(
            <ButtonGroupSelect
                allowedValues={allowedValues}
                getActiveStyle={R.identity}
                getKey={getKeySpy}
                onChange={R.identity}
                value={allowedValues.slice(0, 1)}
            />
        );
        TestUtils.scryRenderedComponentsWithType(selectNode, Button);
        // we call get key 4 times: 1 when we pass the key prop on buttons
        // creation 2 more when we check if the button `isActive` and 2 more
        // when we check for disabled button.
        var callsPerValue = 4;
        expect(getKeySpy.callCount).to.equal(allowedValues.length * callsPerValue);
    });

    it("should render a button in the button group for each of the `allowedValues` passed as props", function () {
        var allowedValues = [1, 2, 3, 4];
        var selectElement = (
            <ButtonGroupSelect
                allowedValues={allowedValues}
                getActiveStyle={R.identity}
                onChange={R.identity}
                value={allowedValues.slice(0, 1)}
            />
        );
        var selectNode = TestUtils.renderIntoDocument(selectElement);
        var selectDOMNode = ReactDOM.findDOMNode(selectNode);
        expect(selectDOMNode.children.length).to.equal(allowedValues.length);
    });

    describe("when prop `multi` is not set (default)", function () {

        it("should set the active state of the button which corresponds to the value we supply", function () {
            var allowedValues = [{id: 1}, {id: 2}, {id: 3}];
            var selectedIndex = 0;
            var selectElement = (
                <ButtonGroupSelect
                    allowedValues={allowedValues}
                    getActiveStyle={R.identity}
                    getKey={R.prop("id")}
                    getLabel={R.prop("id")}
                    multi={false}
                    onChange={R.identity}
                    value={allowedValues.slice(selectedIndex, selectedIndex + 1)}
                />
            );
            var selectNode = TestUtils.renderIntoDocument(selectElement);
            var buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, Button);
            var actualStates = buttonNodes.map(function (buttonNode) {
                return !R.isNil(buttonNode.props.style.id);
            });
            var expectedStates = allowedValues.map(function (allowedValue, index) {
                return index === selectedIndex;
            });
            expect(actualStates).to.eql(expectedStates);
        });

        it("should call the `onChange` handler with an array containing the corresponding value as first and only element when a button is clicked", function () {
            var allowedValues = [{id: 1}, {id: 2}, {id: 3}];
            var changeSpy = sinon.spy();
            var selectElement = (
                <ButtonGroupSelect
                    allowedValues={allowedValues}
                    getActiveStyle={R.identity}
                    getKey={R.prop("id")}
                    getLabel={R.prop("id")}
                    onChange={changeSpy}
                    value={allowedValues.slice(0, 1)}
                />
            );
            var selectNode = TestUtils.renderIntoDocument(selectElement);
            var buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, Button);
            buttonNodes.forEach(function (buttonNode, index) {
                var buttonDOMNode = ReactDOM.findDOMNode(buttonNode);
                TestUtils.Simulate.click(buttonDOMNode);
                expect(changeSpy).to.have.been.calledWith(allowedValues.slice(index, index + 1));
                changeSpy.reset();
            });
        });

    });

    // This test are skipped because there is only one value.
    describe.skip("when prop `multi` is set", function () {

        it("should allow to set the active state of more than one button", function () {
            var allowedValues = [{id: 1}, {id: 2}, {id: 3}];
            var selectedValues = allowedValues.slice(1);
            var selectElement = (
                <ButtonGroupSelect
                    allowedValues={allowedValues}
                    getActiveStyle={R.identity}
                    getKey={R.prop("id")}
                    getLabel={R.prop("id")}
                    multi={true}
                    onChange={R.identity}
                    value={selectedValues}
                />
            );
            var selectNode = TestUtils.renderIntoDocument(selectElement);
            var buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, Button);
            var actualStates = buttonNodes.map(function (buttonNode) {
                return !R.isNil(buttonNode.props.style.id);
            });
            var expectedStates = allowedValues.map(function (allowedValue) {
                return R.contains(allowedValue, selectedValues);
            });
            expect(actualStates).to.eql(expectedStates);
        });

        it("should call the `onChange` handler with the new active values", function () {
            var allowedValues = [{id: 1}, {id: 2}, {id: 3}];
            var changeSpy = sinon.spy();
            var selectElement = (
                <ButtonGroupSelect
                    allowedValues={allowedValues}
                    getActiveStyle={R.identity}
                    getKey={R.prop("id")}
                    getLabel={R.prop("id")}
                    multi={true}
                    onChange={changeSpy}
                    value={[]}
                />
            );
            var selectNode = TestUtils.renderIntoDocument(selectElement);
            var buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, Button);
            buttonNodes.forEach(function (buttonNode, index) {
                var buttonDOMNode = ReactDOM.findDOMNode(buttonNode);
                TestUtils.Simulate.click(buttonDOMNode);
                expect(changeSpy).to.have.been.calledWith([allowedValues[index]]);
                changeSpy.reset();
            });
        });

    });

});
