var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var React      = require("react");
var Router     = require("react-router");
var moment     = require("moment");

var components = require("components");
var colors     = require("lib/colors");
var styles     = require("lib/styles");

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
                    return value.getIn(["0", "address"]);
                }
            },
            {
                key: "emails",
                style: function () {
                    return {
                        width: "25%",
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
                        width: "40%",
                        color: colors.greySubTitle
                    };
                },
                valueFormatter: function (value) {
                    var date = moment(value && value.get("$date"));
                    return date.locale("it").format("LL");
                }
            },
            {
                key: "_id",
                style: function () {
                    return {
                        width: "20%"
                    };
                },
                valueFormatter: function (value) {
                    return (
                        <Router.Link to={`/users/${value}`}>
                            <components.Icon icon="pencil" style={{color: colors.primary, paddingLeft: "7px"}}/>
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
                    style={styles.titlePage}
                >
                    <components.Spacer direction="v" size={5} />
                    {"Admin"}
                </h2>
                <div style={{width: "98%", position: "relative", left: "1%"}}>
                    <components.CollectionElementsTable
                        collection={this.props.collections.get("users") || Immutable.Map()}
                        columns={this.getColumnsUsers()}
                        headColumn={["Email", "Email verificata", "Data di creazione", ""]}
                        headStyle={{color: colors.titleColor, fontSize: "13pt", backgroundColor: colors.greyBackground}}
                        hover={true}
                    />
                </div>
            </div>
        );
    }
});

module.exports = Users;
