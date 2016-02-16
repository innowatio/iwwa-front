var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");
var icons      = require("lib/icons");
import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles_restyling";

const itemsStyle = (theme) => (R.merge(styles(theme).buttonBasicStyle, {
    background: theme.colors.white,
    border: `1px solid ${theme.colors.greySubTitle}`,
    marginTop: "5px",
    width: "100%",
    padding: "10px"
}));

const itemsStyleActive = ({colors}) => ({
    background: colors.primary,
    color: colors.white,
    fontSize: "13px"
});

var SiteNavigator = React.createClass({
    propTypes: {
        allowedValues: IPropTypes.map.isRequired,
        onChange: React.PropTypes.func.isRequired,
        path: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.list
        ]),
        title: React.PropTypes.string
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            inputFilter: ""
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getKeyParent: function (value) {
        return value.get("_id");
    },
    getLabelParent: function (value) {
        return value.get("name");
    },
    getKeyChildren: function (value) {
        return value.get("id");
    },
    getLabelChildren: function (value) {
        return value.get("id");
    },
    getFilterCriteria: function (values) {
        const NOT_VISIBLE_SENSORS = ["CO2", "THL", "POD-ANZ"];
        return values.filter((value) => {
            return NOT_VISIBLE_SENSORS.indexOf(value.get("type").toUpperCase()) < 0;
        });
    },
    getFilteredValues: function () {
        var clause = this.state.inputFilter.toLowerCase();
        return this.props.allowedValues.filter((value) => {
            var pods = this.getFilterCriteria(value.get("sensors") || Immutable.Map())
                .map(this.getLabelChildren);
            return value.get("name").toLowerCase().includes(clause) ||
                pods.map((pod) => {
                    return pod.toLowerCase().includes(clause);
                }).contains(true);
        });
    },
    onClickChildren: function (value) {
        const childrenPath = value.filter(value => {
            return !R.isNil(value);
        });
        this.props.onChange({
            fullPath: [this.props.path[0]].concat(childrenPath) || [],
            site: this.props.path[0],
            sensor: R.last(childrenPath)
        });
    },
    onClickParent: function (value) {
        const site = this.getKeyParent(value[0]);
        this.props.onChange({
            fullPath: [site],
            site,
            sensor: null
        });
    },
    getValue: function () {
        const self = this;
        return [this.props.allowedValues
            .find(value => self.getKeyParent(value) === self.props.path[0])
        ].filter(value => !R.isNil(value));
    },
    renderSitesParent: function () {
        return (
            <components.ButtonGroupSelect
                allowedValues={this.getFilteredValues().toArray()}
                getKey={this.getKeyParent}
                getLabel={this.getLabelParent}
                multi={false}
                onChange={this.onClickParent}
                style={itemsStyle(this.getTheme())}
                styleToMergeWhenActiveState={itemsStyleActive(this.getTheme())}
                value={this.getValue()}
                vertical={true}
            />
        );
    },
    renderSitesChildren: function () {
        if (this.props.path[0]) {
            return (
                <components.TreeView
                    allowedValues={this.getFilteredValues().getIn([this.props.path[0], "sensors"]) || []}
                    filterCriteria={this.getFilterCriteria}
                    getKey={this.getKeyChildren}
                    getLabel={this.getLabelChildren}
                    multi={false}
                    onChange={this.onClickChildren}
                    style={itemsStyle(this.getTheme())}
                    styleToMergeWhenActiveState={itemsStyleActive(this.getTheme())}
                    value={this.props.path.slice(1, this.props.path.length)}
                    vertical={true}
                />
            );
        }
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <h3 className="text-center" style={{color: theme.colors.white}}>{this.props.title}</h3>
                <bootstrap.Col style={{marginTop: "15px"}} xs={12}>
                    <bootstrap.Input
                        addonAfter={<img src={icons.iconSearch} style={{height: "21px"}}/>}
                        className="input-search"
                        onChange={(input) => this.setState({inputFilter: input.target.value})}
                        placeholder="Ricerca"
                        type="text"
                        value={this.state.inputFilter}
                    />
                </bootstrap.Col>
                <bootstrap.Col style={{overflow: "auto", marginTop: "10px", height: "calc(100vh - 350px)", minHeight: "300px"}} xs={4}>
                    <div className="site-navigator-parent">
                        <Radium.Style
                            rules={{
                                ".btn-group-vertical": {
                                    width: "100%",
                                    padding: "12px",
                                    overflow: "auto"
                                }
                            }}
                            scopeSelector=".site-navigator-parent"
                        />
                        {this.renderSitesParent()}
                    </div>
                </bootstrap.Col>
                <bootstrap.Col style={{height: "calc(100vh - 350px)", minHeight: "300px"}} xs={8}>
                    <div
                        className="site-navigator-child"
                        style={{
                            border: "solid " + theme.colors.primary,
                            height: "100%",
                            marginTop: "10px"
                        }}
                    >
                        <Radium.Style
                            rules={{
                                ".btn-group-vertical": {
                                    width: "30%",
                                    padding: "12px"
                                },
                                "button.btn": itemsStyle(theme),
                                "button.btn.active": itemsStyleActive(theme)
                            }}
                            scopeSelector=".site-navigator-child"
                        />
                        {this.renderSitesChildren()}
                    </div>
                </bootstrap.Col>
            </div>
        );
    }
});

module.exports = Radium(SiteNavigator);
