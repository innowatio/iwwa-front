var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var React      = require("react");
var Router     = require("react-router");
var moment     = require("moment");
var R          = require("ramda");

var components = require("components");
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

// var iconStyle = ({colors}) => ({
//     color: colors.primary,
//     paddingRight: "10px",
//     float: "right",
//     width: "30px"
// });

var Users = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("users");
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getColumnsUsers: function () {
        const theme = this.getTheme();
        return [
            {
                key: "emails",
                style: function () {
                    return {
                        width: "25%",
                        color: theme.colors.greySubTitle
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
                        color: theme.colors.greySubTitle
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
                        color: theme.colors.greySubTitle
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
                        color: theme.colors.greySubTitle
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
                            <components.Icon
                                color={theme.colors.iconEditUser}
                                icon={"edit"}
                                size={"24px"}
                                style={{float:"right", paddingTop:"5px"}} 
                            />
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
        const theme = this.getTheme();
        return (
            <div>
                <div style={styles(this.getTheme()).titlePage}>
                    <div style={{fontSize: "18px", marginBottom: "0px", paddingTop: "18px", width: "100%"}}>
                        {""}
                    </div>
                </div>
                <div style={{width: "98%", position: "relative", left: "1%", marginTop: "20px"}}>
                    <components.CollectionElementsTable
                        collection={this.props.collections.get("users") || Immutable.Map()}
                        columns={this.getColumnsUsers()}
                        headColumn={["Email", "Email verificata", "Data di creazione", "Ruolo", ""]}
                        headStyle={{
                            color: theme.colors.titleColor,
                            fontSize: "13pt",
                            backgroundColor: theme.colors.greyBackground
                        }}
                        hover={true}
                        style={{height: "calc(100vh - 100px)", paddingBottom: "10px"}}
                    />
                </div>
            </div>
        );
    }
});

module.exports = Users;
