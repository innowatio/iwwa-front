require("unit-setup.js");

import {chart} from "reducers/chart";

describe("`chart` reducer", () => {

    const chartState = Object.freeze({
        alarms: 1449157137862,
        sites: [],
        types: [
            {
                label: "labelType",
                key: "keyType"
            },
            {
                label: "labelEnvironmental",
                key: "keyEnvironment",
                color: "color",
                icon: "icon",
                selected: "iconSelected"
            }
        ],
        dateRanges: [{
            start: 1449157137862,
            end: 1449157157862
        }],
        sources: [{
            label: "labelSource",
            color: "color",
            key: "keySource"
        }]
    });

    describe("`SELECT_SINGLE_SITE` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "SELECT_SINGLE_SITE",
                payload: ["siteId"]
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: ["siteId"],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {
                        label: "labelEnvironmental",
                        key: "keyEnvironment",
                        color: "color",
                        icon: "icon",
                        selected: "iconSelected"
                    }
                ],
                dateRanges: [{
                    start: 1449157137862,
                    end: 1449157157862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

    });

    describe("`SELECT_TYPE` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "SELECT_TYPE",
                payload: {
                    label: "labelTypeModify",
                    key: "keyTypeModify"
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: [],
                types: [
                    {
                        label: "labelTypeModify",
                        key: "keyTypeModify"
                    },
                    {
                        label: "labelEnvironmental",
                        key: "keyEnvironment",
                        color: "color",
                        icon: "icon",
                        selected: "iconSelected"
                    }
                ],
                dateRanges: [{
                    start: 1449157137862,
                    end: 1449157157862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

    });

    describe("`SELECT_MULTIPLE_SITE` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "SELECT_MULTIPLE_SITE",
                payload: ["siteId1", "siteId2"]
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: ["siteId1", "siteId2"],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {}
                ],
                dateRanges: [{
                    start: 1449157137862,
                    end: 1449157157862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

    });

    describe("`SELECT_DATA_RANGES_COMPARE` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "SELECT_DATA_RANGES_COMPARE",
                payload: {
                    period: {
                        label: "labelPeriodDateCompare",
                        key: "keyPeriodDateCompare"
                    },
                    dateOne: 1449157137862
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: [],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {}
                ],
                dateRanges: [{
                    period: {
                        label: "labelPeriodDateCompare",
                        key: "keyPeriodDateCompare"
                    },
                    dateOne: 1449157137862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

    });

    describe("`SELECT_ENVIRONMENTAL` type", () => {

        it("should have the toggle functionality if the payload object is the same of that in the state", () => {
            const valuePassedFromAction = {
                type: "SELECT_ENVIRONMENTAL",
                payload: {
                    label: "labelEnvironmental",
                    key: "keyEnvironment",
                    color: "color",
                    icon: "icon",
                    selected: "iconSelected"
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: [],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {}
                ],
                dateRanges: [{
                    start: 1449157137862,
                    end: 1449157157862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

        it("should return the correct object if the payload object isn't the same of that in the state", () => {
            const valuePassedFromAction = {
                type: "SELECT_ENVIRONMENTAL",
                payload: {
                    label: "labelEnvironmentalMod",
                    key: "keyEnvironmentMod",
                    color: "color",
                    icon: "icon",
                    selected: "iconSelected"
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: [],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {
                        label: "labelEnvironmentalMod",
                        key: "keyEnvironmentMod",
                        color: "color",
                        icon: "icon",
                        selected: "iconSelected"
                    }
                ],
                dateRanges: [{
                    start: 1449157137862,
                    end: 1449157157862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

    });

    describe("`SELECT_SOURCES` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "SELECT_SOURCES",
                payload: [{
                    label: "labelSourceMod",
                    color: "color",
                    key: "keySourceMod"
                }]
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: [],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {
                        label: "labelEnvironmental",
                        key: "keyEnvironment",
                        color: "color",
                        icon: "icon",
                        selected: "iconSelected"
                    }
                ],
                dateRanges: [{
                    start: 1449157137862,
                    end: 1449157157862
                }],
                sources: [{
                    label: "labelSourceMod",
                    color: "color",
                    key: "keySourceMod"
                }]
            });
        });

    });

    describe("`SELECT_DATE_RANGES` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "SELECT_DATE_RANGES",
                payload: {
                    start: 1498749876543,
                    end: 1516543214890
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: 1449157137862,
                sites: [],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {
                        label: "labelEnvironmental",
                        key: "keyEnvironment",
                        color: "color",
                        icon: "icon",
                        selected: "iconSelected"
                    }
                ],
                dateRanges: [{
                    start: 1498749876543,
                    end: 1516543214890
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

    });

    describe("`REMOVE_ALL_COMPARE` type", () => {

        it("should return the correct object if there is a date compare", () => {
            const chartRemoveDateCompareState = Object.freeze({
                alarms: undefined,
                sites: ["site1"],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {
                        label: "labelEnvironmental",
                        key: "keyEnvironment",
                        color: "color",
                        icon: "icon",
                        selected: "iconSelected"
                    }
                ],
                dateRanges: [{
                    period: {
                        label: "labelPeriod",
                        key: "keyPeriod"
                    },
                    dateOne: 1449157157862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
            const valuePassedFromAction = {
                type: "REMOVE_ALL_COMPARE"
            };
            const ret = chart(chartRemoveDateCompareState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: ["site1"],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {}
                ],
                dateRanges: [],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

        it("should return the correct object if there are two sites in the state", () => {
            const chartRemoveSiteCompareState = Object.freeze({
                alarms: undefined,
                sites: ["site1", "site2"],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {
                        label: "labelEnvironmental",
                        key: "keyEnvironment",
                        color: "color",
                        icon: "icon",
                        selected: "iconSelected"
                    }
                ],
                dateRanges: [{
                    start: 1449157137862,
                    end: 1449157157862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
            const valuePassedFromAction = {
                type: "REMOVE_ALL_COMPARE"
            };
            const ret = chart(chartRemoveSiteCompareState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: ["site1"],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {}
                ],
                dateRanges: [{
                    start: 1449157137862,
                    end: 1449157157862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

    });

    describe("`DISPLAY_ALARMS_ON_CHART` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "DISPLAY_ALARMS_ON_CHART",
                payload: {
                    siteId: ["site1"],
                    alarms: [1498749876543, 1516543214890],
                    startDate: 1449157137862,
                    endDate: 1449157157862
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: [1498749876543, 1516543214890],
                sites: ["site1"],
                types: [
                    {
                        label: "Attiva",
                        key: "energia attiva"
                    },
                    {}
                ],
                dateRanges: [{
                    start: 1449157137862,
                    end: 1449157157862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

    });

    it("should return the previous state if any correct `type` is checked", () => {
        const valuePassedFromAction = {
            type: "NOT_A_CORRECT_TYPE_CASE"
        };
        const ret = chart(chartState, valuePassedFromAction);
        expect(ret).to.deep.equal(chartState);
    });

});
