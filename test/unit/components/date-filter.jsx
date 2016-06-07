import {Calendar} from "react-widgets";
import moment from "moment";

import DateFilter from "components/date-filter";
import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles";
import ButtonGroupSelect from "components/button-group-select";
import Button from "components/button";

describe("`DateFilter` component", () => {

    var clock;
    var onChangeSpy = sinon.spy();

    beforeEach(() => {
        // Set date to first of month because output of calendar is always first
        // day of the month.
        clock = sinon.useFakeTimers(new Date("2016-01-01").getTime());
    });

    afterEach(() => {
        onChangeSpy.reset();
        clock.restore();
    });

    const $DateFilter = $(
        <DateFilter
            onChange={onChangeSpy}
            title={"title"}
        />
    ).shallowRender();
    const title = $DateFilter.find("h3");
    const calendar = $DateFilter.find(Calendar);
    const buttonGroupSelect = $DateFilter.find(ButtonGroupSelect);

    it("renders a div with class `date-filter`", () => {
        expect($DateFilter.find(".date-filter").length).to.equal(1);
        expect($DateFilter.find(".date-filter")[0].type).to.equal("div");
    });

    it("renders an `h3` tag", () => {
        expect(title.length).to.equal(1);
    });

    it("renders an `h3` with class `text-center`", () => {
        expect(title.props().className).to.equal("text-center");
    });

    it("renders an `h3` with the props `title` as children", () => {
        expect(title.props().children).to.equal("title");
    });

    it("renders an `h3` with style `titleFullScreenModal`", () => {
        expect(title.props().style).to.deep.equal(styles(defaultTheme).titleFullScreenModal);
    });

    it("renders a `Calendar` component", () => {
        expect(calendar.length).to.equal(1);
    });

    it("renders a `ButtonGroupSelect` component", () => {
        expect(buttonGroupSelect.length).to.equal(1);
    });

    it("renders 4 `Button`", () => {
        expect(buttonGroupSelect.shallowRender().find(Button).length).to.equal(4);
    });

    it("call the `onChange` props with correct object [CASE: click on calendar button]", () => {
        calendar.trigger("change");
        expect(onChangeSpy).to.have.callCount(1);
        expect(onChangeSpy).to.have.been.calledWith({
            start: moment.utc("2016-01-01").add({minutes: moment("2016-01-01").utcOffset()}).valueOf(),
            end: moment.utc("2016-01-31").add({minutes: moment("2016-01-01").utcOffset()}).endOf("day").valueOf(),
            valueType: {label: "calendario", key: "calendar"}
        });
    });

    it("call the `onChange` props [CASE: click on the `ButtonGroupSelect` buttons]", () => {
        const buttonNodes = buttonGroupSelect.render().find(Button).find("button");
        buttonNodes.each((buttonNode, index) => {
            TestUtils.Simulate.click(buttonNode);
            expect(onChangeSpy).to.have.callCount(index + 1);
        });
    });

    describe("`setMonthlyDate` function", () => {

        const setMonthlyDate = DateFilter.prototype.setMonthlyDate;
        var instance;

        beforeEach(() => {
            instance = {
                props: {
                    onChange: sinon.spy()
                }
            };
        });

        afterEach(() => {
            instance.props.onChange.reset();
        });

        it("call `onChange` function with the correct object [CASE: temporalFilter: `calendar`]", () => {
            // New Date() is mocked to "2016-01-01"
            setMonthlyDate.call(instance, new Date());
            expect(instance.props.onChange).to.have.been.callCount(1);
            expect(instance.props.onChange).to.have.been.calledWith({
                start: moment.utc("2016-01-01").add({minutes: moment("2016-01-01").utcOffset()}).valueOf(),
                end: moment.utc("2016-01-31").add({minutes: moment("2016-01-01").utcOffset()}).endOf("day").valueOf(),
                valueType: {label: "calendario", key: "calendar"}
            });
        });

    });

    describe("`setTimeInterval` function", () => {

        const setTimeInterval = DateFilter.prototype.setTimeInterval;
        var instance;

        beforeEach(() => {
            instance = {
                props: {
                    onChange: sinon.spy()
                }
            };
        });

        afterEach(() => {
            instance.props.onChange.reset();
        });

        it("call `onChange` function with the correct object [CASE: temporalFilter: `yesterday`]", () => {
            const valueType = {label: "IERI", key: "yesterday"};
            setTimeInterval.call(instance, [valueType]);
            expect(instance.props.onChange).to.have.been.callCount(1);
            expect(instance.props.onChange).to.have.been.calledWith({
                start: moment.utc("2015-12-31").valueOf(),
                end: moment.utc("2015-12-31").endOf("day").valueOf(),
                valueType
            });
        });

        it("call `onChange` function with the correct object [CASE: temporalFilter: `today`]", () => {
            const valueType = {label: "OGGI", key: "today"};
            setTimeInterval.call(instance, [valueType]);
            expect(instance.props.onChange).to.have.been.callCount(1);
            expect(instance.props.onChange).to.have.been.calledWith({
                start: moment.utc("2016-01-01").valueOf(),
                end: moment.utc("2016-01-01").endOf("day").valueOf(),
                valueType
            });
        });

        it("call `onChange` function with the correct object [CASE: temporalFilter: `currentWeek`]", () => {
            const valueType = {label: "SETTIMANA CORRENTE", key: "currentWeek"};
            setTimeInterval.call(instance, [valueType]);
            expect(instance.props.onChange).to.have.been.callCount(1);
            expect(instance.props.onChange).to.have.been.calledWith({
                start: moment.utc("2015-12-28").valueOf(),
                end: moment.utc("2016-01-03").endOf("day").valueOf(),
                valueType
            });
        });

        it("call `onChange` function with the correct object [CASE: temporalFilter: `lastWeek`]", () => {
            const valueType = {label: "SETTIMANA SCORSA", key: "lastWeek"};
            setTimeInterval.call(instance, [valueType]);
            expect(instance.props.onChange).to.have.been.callCount(1);
            expect(instance.props.onChange).to.have.been.calledWith({
                start: moment.utc("2015-12-21").valueOf(),
                end: moment.utc("2015-12-27").endOf("day").valueOf(),
                valueType
            });
        });

    });

});
