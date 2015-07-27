var DygraphCSVExport = {

    exportCSV: function (dygraph) {
        var labels = dygraph.attr_("labels");
        var data = dygraph.file_;

        var csvResult = labels + "\n";

        csvResult += data.map(function (dataRow) {
            var res = dataRow.map(function (field) {

                // avoid to export standard deviation
                if (Array.isArray(field)) {
                    field = field[0];
                }

                return field + "";
            });

            return res;
        }).join("\n");
        console.log(csvResult);

        return csvResult;
    }
};

module.exports = DygraphCSVExport;
