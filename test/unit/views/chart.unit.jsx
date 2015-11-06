require("unit-setup.js");

var Immutable = require("immutable");
var moment    = require("moment");

var transformers = proxyquire("views/chart/transformers.js", {});

describe("The `sito` transformer", function () {

    describe("the `parse` function should return", function () {

        it("an empty array if `siti` is empty", function () {
            var siti = Immutable.Map();
            var st = transformers.sito(siti);
            var ret = st.parse("_id");
            expect(ret).to.eql([]);
        });

        it("an empty array` if `siti` has no key that matches the supplied strings", function () {
            var siti = Immutable.Map({
                "sito_0": Immutable.Map({a: 0}),
                "sito_1": Immutable.Map({a: 1})
            });
            var st = transformers.sito(siti);
            expect(st.parse("non-existent-sito")).to.eql([]);
        });

        it("the values of the property of `siti` which key matches the supplied strings", function () {
            var siti = Immutable.Map({
                "sito_0": Immutable.Map({a: 0}),
                "sito_1": Immutable.Map({a: 1})
            });
            var st = transformers.sito(siti);
            expect(st.parse("sito_1")).to.be.an("array");
            expect(st.parse("sito_1")[0]).to.equal(siti.get("sito_1"));
        });

    });

    describe("the `stringify` function should return", function () {

        it("the `_id` of the supplied `Immutable.Map`", function () {
            var sito = Immutable.Map({
                _id: "sito_id"
            });
            var st = transformers.sito(Immutable.Map());
            expect(st.stringify([sito])).to.equal("sito_id");
        });

    });

});

describe("The `dateFilter` transformer", function () {

    describe("the `parse` function, given two strings rappresentition of dates in format `YYYYMMDD`, should return", function () {

        it("an object which contains `start` and `end` dates", function () {
            var expected = {
                start: moment("20140606", "YYYYMMDD").toDate(),
                end: moment("20150505", "YYYYMMDD").toDate()
            };

            var transformer = transformers.dateFilter();
            var ret = transformer.parse("20140606-20150505");

            expect(ret).to.eql(expected);
        });
    });

    describe("the `stringify` function should return", function () {

        it("an object which contains `start` and `end` dates", function () {
            var values = {
                start: moment("20140606", "YYYYMMDD").toDate(),
                end: moment("20150505", "YYYYMMDD").toDate()
            };
            var expected = "20140606-20150505";

            var transformer = transformers.dateFilter();
            var ret = transformer.stringify(values);

            expect(ret).to.eql(expected);
        });
    });
});

describe("The `tipologia` transformer", function () {

    describe("the `parse` function should return", function () {

        it("the tipologia which `key` equals the supplied string", function () {
            var tipologie = [
                {label: "Attiva", key: "energia attiva"},
                {label: "Potenza", key: "potenza totale"},
                {label: "Reattiva", key: "energia reattiva"}
            ];
            var st = transformers.tipologia(tipologie);
            var ret = st.parse("energia reattiva");
            expect(ret).to.equal(tipologie[2]);
        });

        it("the first tipologia if no `key` equals the supplied string", function () {
            var tipologie = [
                {label: "Attiva", key: "energia attiva"},
                {label: "Potenza", key: "potenza totale"},
                {label: "Reattiva", key: "energia reattiva"}
            ];
            var st = transformers.tipologia(tipologie);
            var ret = st.parse("4");
            expect(ret).to.equal(tipologie[0]);
        });

    });

    describe("the `stringify` function should return", function () {

        it("the stringified `key` of the supplied tipologia", function () {
            var tipologie = [
                {label: "Attiva", key: "energia attiva"},
                {label: "Potenza", key: "potenza totale"},
                {label: "Reattiva", key: "energia reattiva"}
            ];
            var st = transformers.tipologia(tipologie);
            expect(st.stringify(tipologie[0])).to.equal("energia attiva");
        });

    });

});

describe("The `valore` transformer", function () {

    describe("the `parse` function should return", function () {

        it("an array with all valori-s with a `key` contained in the supplied string", function () {
            var valori = [
                {label: "Reale", key: "reale"},
                {label: "Contrattuale", key: "contrattuale"},
                {label: "Previsionale 1gg", key: "realeMeno1"},
                {label: "Previsionale 7gg", key: "realeMeno7"}
            ];
            var st = transformers.valore(valori);
            var ret = st.parse("reale,realeMeno7");
            expect(ret).to.include(valori[0]);
            expect(ret).to.include(valori[3]);
        });

        it("an array with with the first valore in the valori array if no `key` is found in the supplied string", function () {
            var valori = [
                {label: "Reale", key: "reale"},
                {label: "Contrattuale", key: "contrattuale"},
                {label: "Previsionale 1gg", key: "realeMeno1"},
                {label: "Previsionale 7gg", key: "realeMeno7"}
            ];
            var st = transformers.valore(valori);
            var ret = st.parse("no,keys,here");
            expect(ret).to.include(valori[0]);
        });

    });

    describe("the `stringify` function should return", function () {

        it("the `key`-s of the supplied valori joined by a comma", function () {
            var valori = [
                {label: "Reale", key: "reale"},
                {label: "Contrattuale", key: "contrattuale"},
                {label: "Previsionale 1gg", key: "realeMeno1"},
                {label: "Previsionale 7gg", key: "realeMeno7"}
            ];
            var st = transformers.valore(valori);
            var selectedValori = [valori[1], valori[3]];
            expect(st.stringify(selectedValori)).to.equal("contrattuale,realeMeno7");
        });

    });

});

describe("The `alarms` transformer", function () {

    describe("the `parse` function should return", function () {

        it("an array of dates in millisecond format", function () {
            var input = new Date("2011-02-03T04:05:00").getTime() + "-" + new Date("2015-01-01T00:00:00").getTime();
            var expected = [
                new Date("2011-02-03T04:05:00").getTime(),
                new Date("2015-01-01T00:00:00").getTime()
            ];
            var st = transformers.alarms();
            var ret = st.parse(input);
            expect(ret).to.include(expected[0]);
            expect(ret).to.include(expected[1]);
        });

    });

    describe("the `stringify` function should return", function () {

        it("the dates in format `YYYYMMDDHHmm` separeted by a `-`", function () {
            var input = [
                new Date("2011-02-03T04:05:00").getTime(),
                new Date("2015-01-01T00:00:00").getTime()
            ];
            var expected = new Date("2011-02-03T04:05:00").getTime() + "-" + new Date("2015-01-01T00:00:00").getTime();
            var st = transformers.alarms();
            var ret = st.stringify(input);
            expect(expected).to.be.eql(ret);
        });

    });

});
