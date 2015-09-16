require("unit-setup.js");

var AlarmRepetitionModal = proxyquire("components/alarm-repetition-modal/", {});

describe("The `onClickConfirm` function of the `AlarmRepetitionModal` component ", function () {

    it("should call the `updateParentState` prop with an object in a defined format", function () {
        var expectedValue = {
            repetition: {
                weekDays: [],
                day: null,
                timeEnd: "00:00",
                timeStart: "00:00"
            }
        };
        var updateParentStateSpy = sinon.spy();
        var fakeValue = {};
        var repetitionComponent = (
            <AlarmRepetitionModal
                updateParentState={updateParentStateSpy}
                value={fakeValue}
            />
        );
        var componentNode = TestUtils.renderIntoDocument(repetitionComponent);
        componentNode.onClickConfirm();
        expect(updateParentStateSpy).to.have.been.calledWith(expectedValue);
    });
});
