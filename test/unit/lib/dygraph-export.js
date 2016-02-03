require("unit-setup.js");

var DygraphExportCSV = proxyquire("lib/dygraph-export-csv.js", {});

describe("The Dygraph CSV Export method", function () {

    it("should properly convert dygraph's data", function () {
        /*
        *   file format is like:
        *   [
        *       [X1, [Y1, SD], [Y2, SD], ...],
        *       ....
        *   ]
        */
        var today = new Date();
        var dygraph = {
            attr_: function (val) {
                if (val === "labels") {
                    return ["date", "label1", "label2"];
                }
            },
            file_: [[today, [1], [2, 5]]]
        };

        var expected = "date,label1,label2\n" + today.toString() + ",1,2";
        var result = DygraphExportCSV.exportCSV(dygraph);
        expect(expected).to.be.eql(result);
    });

});
