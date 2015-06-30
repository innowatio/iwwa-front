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

    it("should render a button in button group for each of the `allowedValues` passed as props", function () {
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
    // TODO Testare lo stato active o meno dei bottoni
    // it("should set the active button props on true after click", function () {
    //     var allowedValues = [1, 2, 3];
    //     var selectElement = (
    //         <ButtonGroupSelect
    //             allowedValues={allowedValues}
    //             onChange={R.identity}
    //             value={allowedValues[0]}
    //         />
    //     );
    //     var selectNode = TestUtils.renderIntoDocument(selectElement);
    //     var selectDOMNode = selectNode.getDOMNode();
    //     console.log(ButtonGroupSelect);
    //
    //
    // });

    // TODO Testare che l'onChange venga chiamato con il parametro corretto (hint: usare le spie sinon)
});
