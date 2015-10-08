var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var React      = require("react");
var Router     = require("react-router");
var moment     = require("moment");

var components = require("components");
var colors     = require("lib/colors");

var Admin = React.createClass({
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
                valueFormatter: function (value) {
                    return value.getIn(["0", "address"]);
                }
            },
            {
                key: "emails",
                valueFormatter: function (value) {
                    return value.getIn(["0", "verified"]) ? "Si" : "No";
                }
            },
            {
                key: "createdAt",
                valueFormatter: function (value) {
                    var date = moment(value.get("$date"));
                    return date.locale("it").format("LL");
                }
            },
            {
                key: "_id",
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
            <div style={{width: "98%", position: "relative", left: "1%"}}>
                <h3>{"Admin"}</h3>
                <components.CollectionElementsTable
                    collection={this.props.collections.get("users") || Immutable.Map()}
                    columns={this.getColumnsUsers()}
                    head={["Email", "Email verificata", "Data di creazione", "Edit"]}
                    hover={true}
                />
            </div>
        );
    }
});

module.exports = Admin;
