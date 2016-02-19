var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");
import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles_restyling";

const itemsStyle = (theme) => (R.merge(styles(theme).buttonBasicStyle, {
    background: theme.colors.primary,
    color: theme.colors.white,
    fontSize: "22px",
    border: "0",
    marginTop: "10px",
    width: "100%",
    height: "55px",
    lineHeight: "20px",
    padding: "14px",
    borderRadius: "20px"
}));

const itemsStyleActive = ({colors}) => ({
    background: colors.buttonPrimary,
    color: colors.white,
    borderRadius: "20px",
    display: "inline-block",
    position: "relative"
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
                showArrowActive={true}
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
                <h3 className="text-center" style={{color: theme.colors.mainFontColor}}>{this.props.title}</h3>
                <bootstrap.Col style={{marginTop: "20px"}} xs={12}>
                    <div className="search-container">
                        <Radium.Style
                            rules={{
                                ".input-search": {
                                    height: "60px",
                                    fontSize: "20px",
                                    borderRight: "0px",
                                    borderTopLeftRadius: "20px",
                                    borderBottomLeftRadius: "20px",
                                    backgroundColor: theme.colors.backgroundInputSearch,
                                    outline: "none !important"
                                },
                                ".input-group-addon:last-child": {
                                    backgroundColor: theme.colors.backgroundInputSearch,
                                    borderTopRightRadius: "20px",
                                    borderBottomRightRadius: "20px",
                                    cursor: "pointer"
                                }
                            }}
                            scopeSelector=".search-container"
                        />
                        <bootstrap.Input
                            addonAfter={
                                <components.Icon
                                    color={theme.colors.iconInputSearch}
                                    icon={"search"}
                                    size={"34px"}
                                    style={{
                                        lineHeight: "10px",
                                        verticalAlign: "middle"
                                    }}
                                />
                            }
                            className="input-search"
                            onChange={(input) => this.setState({inputFilter: input.target.value})}
                            placeholder="Ricerca"
                            type="text"
                            value={this.state.inputFilter}
                        />
                    </div>
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
                            height: "100%",
                            marginTop: "10px",
                            borderRadius: "20px",
                            border: "1px solid",
                            padding: "16px",
                            borderColor: theme.colors.white,
                            backgroundColor: theme.colors.backgroundSiteNavChildrenModal
                        }}
                    >
                        <Radium.Style
                            rules={{
                                ".btn-group-vertical": {
                                    width: "30%",
                                    padding: "12px"
                                },
                                "button.btn": itemsStyle(theme),
                                "button.btn.active": itemsStyleActive
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
