var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var React      = require("react");
var Router     = require("react-router");
var moment     = require("moment");
var R          = require("ramda");

var components = require("components");
var colors     = require("lib/colors_restyling");
var styles     = require("lib/styles_restyling");
var icons      = require("lib/icons");

var icon = {
    color: colors.primary,
    paddingRight: "10px",
    float: "right",
    width: "30px"
};

var Users = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("users");
    },
    getColumnsUsers: function () {
        return [
            {
                key: "emails",
                style: function () {
                    return {
                        width: "25%",
                        color: colors.greySubTitle
                    };
                },
                valueFormatter: function (value) {
                    return value.getIn(["0", "address"]) || "";
                }
            },
            {
                key: "emails",
                style: function () {
                    return {
                        width: "15%",
                        color: colors.greySubTitle
                    };
                },
                valueFormatter: function (value) {
                    return value.getIn(["0", "verified"]) ? "Si" : "No";
                }
            },
            {
                key: "createdAt",
                style: function () {
                    return {
                        width: "20%",
                        color: colors.greySubTitle
                    };
                },
                valueFormatter: function (value) {
                    var date = moment.utc(value && value.get("$date")) || "";
                    return date.locale("it").format("LL");
                }
            },
            {
                key: "roles",
                style: function () {
                    return {
                        width: "30%",
                        color: colors.greySubTitle
                    };
                },
                valueFormatter: function (value) {
                    return !R.isNil(value) ? value.join(", ") : "";
                }
            },
            {
                key: "_id",
                style: function () {
                    return {
                        width: "10%"
                    };
                },
                valueFormatter: function (value) {
                    return (
                        <Router.Link to={`/users/${value}`}>
                            <img src={icons.iconEdit} style={icon}/>
                        </Router.Link>
                    );
                }
            }
        ];
    },
    getKey: function (value) {
        return value.get("emails").getIn(["0", "address"]);
    },
    render: function () {
        return (
            <div>
                <h2
                    className="text-center"
                    style={R.merge(styles.titlePage, {fontSize: "14pt", paddingTop: "4px"})}
                >
                    <components.Spacer direction="v" size={5} />
                    {"Amministra utenti"}
                </h2>
                <div style={{width: "98%", position: "relative", left: "1%", marginTop: "20px"}}>
                    <components.CollectionElementsTable
                        collection={this.props.collections.get("users") || Immutable.Map()}
                        columns={this.getColumnsUsers()}
                        headColumn={["Email", "Email verificata", "Data di creazione", "Ruolo", ""]}
                        headStyle={{color: colors.titleColor, fontSize: "13pt", backgroundColor: colors.greyBackground}}
                        hover={true}
                        style={{height: "calc(100vh - 100px)", paddingBottom: "10px"}}
                    />
                </div>
            </div>
        );
    }
});

module.exports = Users;
