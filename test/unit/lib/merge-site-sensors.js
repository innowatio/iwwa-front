import {fromJS} from "immutable";

import mergeSiteSensors from "lib/merge-site-sensors";

describe("`mergeSiteSensors`", () => {

    it("returns the site structure with the sensors informations", () => {
        const site = fromJS({
            _id: "site-id-1",
            name: "test site 1 name",
            description: "a site",
            sensors: [{
                id: "sensor1",
                children: [{
                    id: "sensor3"
                }, {
                    id: "sensor4"
                }]
            }, {
                id: "sensor2"
            }]
        });

        const sensors = fromJS({
            "sensor1": {
                _id: "sensor1",
                name: "sensor number one"
            }, "sensor2": {
                _id: "sensor2",
                name: "sensor number two"
            }, "sensor3": {
                _id: "sensor3",
                name: "sensor number three"
            }, "sensor4": {
                _id: "sensor4",
                name: "sensor number four"
            }, "sensor5": {
                _id: "sensor5",
                name: "this sensor is useless"
            }
        });

        expect(mergeSiteSensors(site, sensors)).to.deep.equal({
            _id: "site-id-1",
            name: "test site 1 name",
            description: "a site",
            sensors: [{
                _id: "sensor1",
                id: "sensor1",
                name: "sensor number one",
                children: [{
                    _id: "sensor3",
                    id: "sensor3",
                    name: "sensor number three"
                }, {
                    _id: "sensor4",
                    id: "sensor4",
                    name: "sensor number four"
                }]
            }, {
                _id: "sensor2",
                id: "sensor2",
                name: "sensor number two"
            }]
        });
    });

});
