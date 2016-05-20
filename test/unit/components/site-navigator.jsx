require("unit-setup.js");
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

    var allowedValues = fromJS([{
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
            },
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
        ],
        "sensorsIds" : [
            "IT001",
            "ANZ01",
            "IT002",
            "ANZ02",
            "ZTHL01",
            "ZTHL02",
            "ZTHL03",
            "ZTHL04",
            "COOV01",
            "COOV02"
        ]
    }, {
        "_id" : "SitoDiTest2",
        "name" : "Sito di Test 2",
        "sensors" : [
            {
                "id" : "IT003",
                "type" : "pod",
                "description" : "Luci e utenze varie",
                "children" : [
                    {
                        "id" : "ANZ03",
                        "type" : "pod-anz",
                        "description" : "Luci e utenze varie"
                    }
                ]
            },
            {
                "id" : "IT004",
                "type" : "pod",
                "description" : "Climatizzazione Vendita e Magazzino",
                "children" : [
                    {
                        "id" : "ANZ04",
                        "type" : "pod-anz",
                        "description" : "Climatizzazione Vendita e Magazzino",
                        "children" : [
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
                        ]
                    }
                ]
            },
            {
                "id" : "ZTHL05",
                "type" : "thl",
                "description" : "Sensore ambientale 1 area destra",
                "children" : [
                    {
                        "id" : "ZTHL06",
                        "type" : "thl",
                        "description" : "Sensore ambientale 5 area destra",
                        "children" : [
                            {
                                "id" : "ZTHL07",
                                "type" : "thl",
                                "description" : "Sensore ambientale 5 area destra"
                            }
                        ]
                    }
                ]
            },
            {
                "id" : "ZTHL08",
                "type" : "thl",
                "description" : "Sensore ambientale 2 area destra",
                "children" : [
                    {
                        "id" : "ZTHL09",
                        "type" : "thl",
                        "description" : "Sensore ambientale 6 area destra"
                    }
                ]
            },
            {
                "id" : "ZTHL10",
                "type" : "thl",
                "description" : "Sensore ambientale 3 area sinistra",
                "children" : []
            },
            {
                "id" : "ZTHL11",
                "type" : "thl",
                "description" : "Sensore ambientale 4 area sinistra",
                "children" : []
            },
            {
                "id" : "COOV03",
                "type" : "co2",
                "description" : "Sonda co2 su HVAC01",
                "children" : [
                    {
                        "id" : "COOV04",
                        "type" : "co2",
                        "description" : "Sonda co2 su HVAC03"
                    }
                ]
            },
            {
                "id" : "COOV05",
                "type" : "co2",
                "description" : "Sonda co2 su HVAC02",
                "children" : []
            }
        ],
        "sensorsIds" : [
            "IT003",
            "ANZ03",
            "IT004",
            "ANZ04",
            "ANZ05",
            "ANZ06",
            "ZTHL05",
            "ZTHL06",
            "ZTHL07",
            "ZTHL08",
            "ZTHL09",
            "ZTHL10",
            "ZTHL11",
            "COOV03",
            "COOV04",
            "COOV05"
        ]
    }]);

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
});
