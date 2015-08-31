var color      = require("color");

var colors = require("lib/colors");

exports.base = {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    width: "100%",
    height: "100%"
};

exports.colVerticalPadding = {
    paddingTop: "10px",
    paddingBottom: "15px"
};

exports.flexBase = {
    display: "flex"
};

exports.flexCentered = {
    justifyContent: "center",
    alignItems: "center"
};

exports.tabbedArea = {
    width: "96%",
    marginLeft: "2%",
    marginTop: "2%",
    height: "calc(100vh - 150px)",
    borderBottom: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
    borderRight: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
    borderLeft: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
    borderTop: "0px",
    borderRadius: "3px",
    boxShadow: "2px 2px 5px " + colors.greySubTitle
};

exports.titlePage = {
    color: colors.titleColor,
    backgroundColor: colors.greyBackground,
    marginTop: "0px",
    height: "40px",
    fontSize: "20pt",
    marginBottom: "0px"
};
