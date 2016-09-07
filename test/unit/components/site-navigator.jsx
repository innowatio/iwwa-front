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

    var allowedValues = fromJS({
        "SitoDiTest1": {
            "_id" : "SitoDiTest1",
            "name" : "Sito di Test 1",
            "sensors" : [
                {
                    "id" : "IT001",
                    "type" : "pod",
                    "description" : "Luci e utenze varie",
                    "children" : [
                        {
                            "id" : "ANZ01",
                            "type" : "pod-anz",
                            "description" : "Luci e utenze varie"
                        }
                    ]
                },
                {
                    "id" : "IT002",
                    "type" : "pod",
                    "description" : "Climatizzazione Vendita e Magazzino",
                    "children" : [
                        {
                            "id" : "ANZ02",
                            "type" : "pod-anz",
                            "description" : "Climatizzazione Vendita e Magazzino"
                        }
                    ]
                }
            ],
            "sensorsIds" : [
                "IT001",
                "ANZ01",
                "IT002",
                "ANZ02"
            ]
        },
        "SitoDiTest2": {
            "_id" : "SitoDiTest2",
            "name" : "Sito di Test 2",
            "sensors" : [
                {
                    "id" : "ANZ03",
                    "type" : "pod-anz",
                    "description" : "Luci e utenze varie"
                },
                {
                    "id" : "ANZ04",
                    "type" : "pod-anz",
                    "description" : "Climatizzazione Vendita e Magazzino"
                },
                {
                    "id" : "ANZ05",
                    "type" : "anz",
                    "description" : "Luci cantina",
                    "children" : [
                        {
                            "id" : "ANZ06",
                            "type" : "anz",
                            "description" : "Luci cantina vini"
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
            "_id" : "SitoDiTest1",
            "name" : "Sito di Test 1",
            "sensors" : [
                {
                    "id" : "ZTHL01",
                    "type" : "thl",
                    "description" : "Sensore ambientale 1 area destra",
                    "children" : []
                },
                {
                    "id" : "ZTHL02",
                    "type" : "thl",
                    "description" : "Sensore ambientale 2 area destra",
                    "children" : []
                },
                {
                    "id" : "ZTHL03",
                    "type" : "thl",
                    "description" : "Sensore ambientale 3 area sinistra",
                    "children" : []
                },
                {
                    "id" : "ZTHL04",
                    "type" : "thl",
                    "description" : "Sensore ambientale 4 area sinistra",
                    "children" : []
                },
                {
                    "id" : "COOV01",
                    "type" : "co2",
                    "description" : "Sonda co2 su HVAC01",
                    "children" : []
                },
                {
                    "id" : "COOV02",
                    "type" : "co2",
                    "description" : "Sonda co2 su HVAC02",
                    "children" : []
                }
            ]
        }
    });

    var $siteNavigator = $(
        <SiteNavigator
            allowedValues={allowedValues}
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

        it("properly filters unwanted sensor types [returns POD]", () => {
            const result = getFilterCriteria(allowedValues.getIn(["SitoDiTest1", "sensors"]));

            expect(result.size).to.equals(2);
            expect(result.getIn(["0", "id"])).to.equal("IT001");
            expect(result.getIn(["1", "id"])).to.equal("IT002");
        });

        it("properly filters unwanted sensor types [pod-anz types]", () => {
            const result = getFilterCriteria(allowedValues.getIn(["SitoDiTest2", "sensors"]));

            expect(result.size).to.equals(1);
            expect(result.getIn(["0", "id"])).to.equal("ANZ05");
        });

        it("properly filters unwanted sensor types [environmental types]", () => {
            expect(getFilterCriteria(allowedValues.getIn(["SitoDiTest3", "sensors"])).size).to.equals(0);
        });
    });
});
