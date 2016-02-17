import "unit-setup.js";

import R from "ramda";

import Button from "components/button";
import components from "components";

describe("The `ButtonGroupSelect` component ", function () {

    it("should have a default prop `getLabel` which stringifies `allowedValues`", function () {
        expect(components.ButtonGroupSelect.defaultProps.getLabel).to.be.a("function");
        const allowedValue = {
            a: 1,
            b: 2
        };
        const stringifiedValue = components.ButtonGroupSelect.defaultProps.getLabel(allowedValue);
        expect(stringifiedValue).to.be.a("string");
    });

    it("should have a default prop `getKey` which stringifies `allowedValues`", function () {
        expect(components.ButtonGroupSelect.defaultProps.getKey).to.be.a("function");
        const allowedValue = {
            a: 1,
            b: 2
        };
        const stringifiedValue = components.ButtonGroupSelect.defaultProps.getKey(allowedValue);
        expect(stringifiedValue).to.be.a("string");
    });

    it("should call the `getLabel` prop (if supplied) to get the label for the children buttons", function () {
        const allowedValues = [1, 2, 3, 4];
        const getLabel = R.add(5);
        const getLabelSpy = sinon.spy(getLabel);
        const selectNode = TestUtils.renderIntoDocument(
            <components.ButtonGroupSelect
                allowedValues={allowedValues}
                getLabel={getLabelSpy}
                onChange={R.identity}
                value={allowedValues.slice(0, 1)}
            />
        );
        const buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, Button);
        const expectedLabels = R.map(getLabel, allowedValues);
        const actualLabels = R.map(function (buttonNode) {
            return buttonNode.props.children;
        }, buttonNodes);
        expect(expectedLabels).to.eql(actualLabels);
        expect(getLabelSpy.callCount).to.equal(allowedValues.length);
    });

    it("should call the `getKey` prop (if supplied) to get the key for the children buttons", function () {
        const allowedValues = [1, 2, 3, 4];
        const getKeySpy = sinon.spy();
        const selectNode = TestUtils.renderIntoDocument(
            <components.ButtonGroupSelect
                allowedValues={allowedValues}
                getKey={getKeySpy}
                isDisabled={false}
                onChange={R.identity}
                value={allowedValues.slice(0, 1)}
            />
        );
        TestUtils.scryRenderedComponentsWithType(selectNode, Button);
        // we call get key 3 times: 1 when we pass the key prop on buttons
        // creation and 2 more when we check if the button `isActive`.
        const callsPerValue = 3;
        expect(getKeySpy.callCount).to.equal(allowedValues.length * callsPerValue);
    });

    it("should render a button in the button group for each of the `allowedValues` passed as props", function () {
        const allowedValues = [1, 2, 3, 4];
        const selectElement = (
            <components.ButtonGroupSelect
                allowedValues={allowedValues}
                onChange={R.identity}
                value={allowedValues.slice(0, 1)}
            />
        );
        const selectNode = TestUtils.renderIntoDocument(selectElement);
        const selectDOMNode = ReactDOM.findDOMNode(selectNode);
        expect(selectDOMNode.children.length).to.equal(allowedValues.length);
    });

    describe("when prop `multi` is not set (default)", function () {

        it("should set the active state of the button which corresponds to the value we supply", function () {
            const allowedValues = [{id: 1}, {id: 2}, {id: 3}];
            const selectedIndex = 0;
            const selectElement = (
                <components.ButtonGroupSelect
                    allowedValues={allowedValues}
                    getKey={R.prop("id")}
                    getLabel={R.prop("id")}
                    multi={false}
                    onChange={R.identity}
                    value={allowedValues.slice(selectedIndex, selectedIndex + 1)}
                />
            );
            const selectNode = TestUtils.renderIntoDocument(selectElement);
            const actualStates = allowedValues.map(allowedValue => {
                return selectNode.isActive(allowedValue);
            });
            const expectedStates = allowedValues.map(function (allowedValue, index) {
                return index === selectedIndex;
            });
            expect(actualStates).to.eql(expectedStates);
        });

        it("should call the `onChange` handler with an array containing the corresponding value as first and only element when a button is clicked", function () {
            const allowedValues = [{id: 1}, {id: 2}, {id: 3}];
            const changeSpy = sinon.spy();
            const selectElement = (
                <components.ButtonGroupSelect
                    allowedValues={allowedValues}
                    getKey={R.prop("id")}
                    getLabel={R.prop("id")}
                    onChange={changeSpy}
                    value={allowedValues.slice(0, 1)}
                />
            );
            const selectNode = TestUtils.renderIntoDocument(selectElement);
            const buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, Button);
            buttonNodes.forEach(function (buttonNode, index) {
                const buttonDOMNode = ReactDOM.findDOMNode(buttonNode);
                TestUtils.Simulate.click(buttonDOMNode);
                expect(changeSpy).to.have.been.calledWith(allowedValues.slice(index, index + 1));
                changeSpy.reset();
            });
        });

    });

    describe("when prop `multi` is set", function () {

        it("should allow to set the active state of more than one button", function () {
            const allowedValues = [{id: 1}, {id: 2}, {id: 3}];
            const selectedValues = allowedValues.slice(1);
            const selectElement = (
                <components.ButtonGroupSelect
                    allowedValues={allowedValues}
                    getKey={R.prop("id")}
                    getLabel={R.prop("id")}
                    multi={true}
                    onChange={R.identity}
                    onChangeMulti={R.identity}
                    value={selectedValues}
                />
            );
            const selectNode = TestUtils.renderIntoDocument(selectElement);
            const actualStates = allowedValues.map(allowedValue => {
                return selectNode.isActive(allowedValue);
            });
            const expectedStates = allowedValues.map(function (allowedValue) {
                return R.contains(allowedValue, selectedValues);
            });
            expect(actualStates).to.eql(expectedStates);
        });

        it("should call the `onChange` handler with the new active values", function () {
            const allowedValues = [{id: 1}, {id: 2}, {id: 3}];
            const onChangeSpy = sinon.spy();
            const onChangeMultiSpy = sinon.spy();
            const selectElement = (
                <components.ButtonGroupSelect
                    allowedValues={allowedValues}
                    getKey={R.prop("id")}
                    getLabel={R.prop("id")}
                    multi={true}
                    onChange={onChangeSpy}
                    onChangeMulti={onChangeMultiSpy}
                    value={[]}
                />
            );
            const selectNode = TestUtils.renderIntoDocument(selectElement);
            const buttonNodes = TestUtils.scryRenderedComponentsWithType(selectNode, Button);
            buttonNodes.forEach(function (buttonNode, index) {
                const buttonDOMNode = ReactDOM.findDOMNode(buttonNode);
                TestUtils.Simulate.click(buttonDOMNode);
                expect(onChangeMultiSpy).to.have.been.calledWith([], allowedValues[index]);
                expect(onChangeSpy).to.have.callCount(0);
                onChangeMultiSpy.reset();
                onChangeSpy.reset();
            });
        });

    });

});
