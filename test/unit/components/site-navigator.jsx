import {fromJS} from "immutable";
import {Col, FormControl} from "react-bootstrap";

import SiteNavigator from "components/site-navigator";

describe("`SiteNavigator` component", () => {

    var clock;
    var onClickSpy = sinon.spy();
    beforeEach(() => {
        clock = sinon.useFakeTimers(new Date().getTime());
        onClickSpy.reset();
    });

    afterEach(() => {
        clock.restore();
    });

    var sites = fromJS({
        "SitoDiTest1": {
            "_id" : "SitoDiTest1",
            "name" : "Sito di Test 1",
            "sensors" : [
                {
                    "id" : "ANZ01",
                    "description" : "Luci e utenze varie",
                    "measurementTypes" : [
                        "activeEnergy",
                        "reactiveEnergy",
                        "maxPower"
                    ]
                },
                {
                    "id" : "ANZ02",
                    "description" : "Climatizzazione Vendita e Magazzino",
                    "measurementTypes" : [
                        "activeEnergy",
                        "reactiveEnergy",
                        "maxPower"
                    ]
                }
            ],
            "sensorsIds" : [
                "ANZ01",
                "ANZ02"
            ]
        },
        "SitoDiTest2": {
            "_id" : "SitoDiTest2",
            "name" : "Sito di Test 2",
            "sensors" : [
                {
                    "id" : "ANZ03",
                    "description" : "Luci e utenze varie",
                    "measurementTypes" : [
                        "activeEnergy",
                        "reactiveEnergy",
                        "maxPower"
                    ]
                },
                {
                    "id" : "ANZ04",
                    "description" : "Climatizzazione Vendita e Magazzino",
                    "measurementTypes" : [
                        "activeEnergy",
                        "reactiveEnergy",
                        "maxPower"
                    ]
                },
                {
                    "id" : "ANZ05",
                    "description" : "Luci cantina",
                    "children" : [
                        {
                            "id" : "ANZ06",
                            "description": "Luci cantina vini",
                            "measurementTypes" : [
                                "activeEnergy",
                                "reactiveEnergy",
                                "maxPower"
                            ]
                        }
                    ]
                }
            ],
            "sensorsIds" : [
                "ANZ03",
                "ANZ04",
                "ANZ05",
                "ANZ06"
            ]
        },
        "SitoDiTest3": {
            "_id" : "SitoDiTest3",
            "name" : "Sito di Test 1",
            "sensors" : [
                {
                    "id" : "ZTHL01",
                    "description" : "Sensore ambientale 1 area destra",
                    "measurementTypes" : [
                        "temperature"
                    ]
                },
                {
                    "id" : "ZTHL02",
                    "description" : "Sensore ambientale 2 area destra",
                    "measurementTypes" : [
                        "illuminance"
                    ]
                },
                {
                    "id" : "ZTHL03",
                    "description" : "Sensore ambientale 3 area sinistra",
                    "measurementTypes" : [
                        "temperature",
                        "illuminance",
                        "humidity"
                    ]
                },
                {
                    "id" : "ZTHL04",
                    "description" : "Sensore ambientale 4 area sinistra",
                    "measurementTypes" : [
                        "temperature",
                        "illuminance",
                        "humidity"
                    ]
                },
                {
                    "id" : "COOV01",
                    "description" : "Sonda co2 su HVAC01",
                    "measurementTypes" : [
                        "co2"
                    ]
                },
                {
                    "id" : "COOV02",
                    "description" : "Sonda co2 su HVAC02",
                    "measurementTypes" : [
                        "co2"
                    ]
                }
            ]
        }
    });

    var $siteNavigator = $(
        <SiteNavigator
            allowedValues={sites}
            onChange={onClickSpy}
            path={["SitoDiTest1"]}
        />
    ).shallowRender();

    it("have at least one input box", () => {
        expect($siteNavigator.find(FormControl).length).to.equal(1);
    });

    it("have 3 children for filter, sites and sensors", () => {
        expect($siteNavigator.find(Col).length).to.equal(3);
    });

    it("save search into state", () => {
        var $colFilter = $($siteNavigator.find(Col)[0]);
        var $input = $colFilter.find(FormControl);
        $input.trigger("change", {
            target: {
                value: "Test 2"
            }
        });
        expect($siteNavigator.state().inputFilter).to.equal("Test 2");
    });

    describe("`getFilterCriteria`", () => {
        const getFilterCriteria = SiteNavigator.prototype.getFilterCriteria;

        it("properly filters unwanted sensor types", () => {
            const result = getFilterCriteria(sites.getIn(["SitoDiTest1", "sensors"]));

            expect(result.size).to.equals(2);
            expect(result.getIn(["0", "id"])).to.equal("ANZ01");
            expect(result.getIn(["1", "id"])).to.equal("ANZ02");

            const resultSite2 = getFilterCriteria(sites.getIn(["SitoDiTest2", "sensors"]));

            expect(resultSite2.size).to.equals(3);
            expect(resultSite2.getIn(["0", "id"])).to.equal("ANZ03");
        });

        it("properly filters unwanted sensor types [environmental types]", () => {
            expect(getFilterCriteria(sites.getIn(["SitoDiTest3", "sensors"])).size).to.equals(0);
        });
    });
});
