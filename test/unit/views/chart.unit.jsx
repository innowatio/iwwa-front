require("unit-setup.js");

var Immutable = require("immutable");

var transformers = proxyquire("views/chart/transformers.js", {});

describe("The `sito` transformer", function () {

    describe("the `parse` function should return", function () {

        it("an empty `Immutable.Map` if `siti` is empty", function () {
            var siti = Immutable.Map();
            var st = transformers.sito(siti);
            var ret = st.parse("_id");
            expect(ret).to.be.an.instanceOf(Immutable.Map);
            expect(ret.isEmpty()).to.equal(true);
        });

        it("the first element of `siti` if `siti` has no key that matches the supplied string", function () {
            var siti = Immutable.Map({
                "sito_0": Immutable.Map({a: 0}),
                "sito_1": Immutable.Map({a: 1})
            });
            var st = transformers.sito(siti);
            expect(st.parse("non-existent-sito")).to.equal(siti.first());
        });

        it("the value of the property of `siti` which key matches the supplied string", function () {
            var siti = Immutable.Map({
                "sito_0": Immutable.Map({a: 0}),
                "sito_1": Immutable.Map({a: 1})
            });
            var st = transformers.sito(siti);
            expect(st.parse("sito_1")).to.equal(siti.get("sito_1"));
        });

    });

    describe("the `stringify` function should return", function () {

        it("the `_id` of the supplied `Immutable.Map`", function () {
            var sito = Immutable.Map({
                _id: "sito_id"
            });
            var st = transformers.sito(Immutable.Map());
            expect(st.stringify(sito)).to.equal("sito_id");
        });

    });

});

describe("The `tipologia` transformer", function () {

    describe("the `parse` function should return", function () {

        it("the tipologia which `key` equals the supplied string", function () {
            var tipologie = [
                {label: "Attiva", key: 1},
                {label: "Potenza", key: 2},
                {label: "Reattiva", key: 3}
            ];
            var st = transformers.tipologia(tipologie);
            var ret = st.parse("3");
            expect(ret).to.equal(tipologie[2]);
        });

        it("the first tipologia if no `key` equals the supplied string", function () {
            var tipologie = [
                {label: "Attiva", key: 1},
                {label: "Potenza", key: 2},
                {label: "Reattiva", key: 3}
            ];
            var st = transformers.tipologia(tipologie);
            var ret = st.parse("4");
            expect(ret).to.equal(tipologie[0]);
        });

    });

    describe("the `stringify` function should return", function () {

        it("the stringified `key` of the supplied tipologia", function () {
            var tipologie = [
                {label: "Attiva", key: 1},
                {label: "Potenza", key: 2},
                {label: "Reattiva", key: 3}
            ];
            var st = transformers.tipologia(tipologie);
            expect(st.stringify(tipologie[0])).to.equal("1");
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
