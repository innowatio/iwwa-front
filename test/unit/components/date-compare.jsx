import R from "ramda";
import moment from "moment";

import Button from "components/button";
import DateCompare from "components/date-compare";

describe("`DateCompare` component", () => {

    var clock;
    var onClickSpy = sinon.spy();
    beforeEach(() => {
        clock = sinon.useFakeTimers(new Date().getTime());
        onClickSpy.reset();
    });

    afterEach(() => {
        clock.restore();
    });

    var allowedValues = [
        {
            key: "key-1",
            label: "label-1"
        },
        {
            key: "key-2",
            label: "label-2"
        }
    ];

    var $dateCompare = $(
        <DateCompare
            allowedValues={allowedValues}
            onChange={onClickSpy}
            getKey={R.prop("key")}
            getLabel={R.prop("label")}
        />
    ).shallowRender();

    it("renders Button", () => {
        expect($dateCompare.find(Button).length).to.equal(allowedValues.length);
    });

    it("trigger click event Button", () => {
        $($dateCompare.find(Button)[0]).trigger("click");
        expect(onClickSpy).to.have.callCount(1);
        expect(onClickSpy).to.have.calledWith({
            dateOne: moment().valueOf(),
            period: allowedValues[0]
        });
    });
});
