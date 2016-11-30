var bootstrap       = require("react-bootstrap");
var Immutable       = require("immutable");
var IPropTypes      = require("react-immutable-proptypes");
var R               = require("ramda");
var Radium          = require("radium");
var React           = require("react");

import components from "components";
import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles";
import mergeSiteSensors from "lib/merge-site-sensors";

const itemsStyle = (theme) => (R.merge(styles(theme).buttonBasicStyle, {
    background: theme.colors.primary,
    color: theme.colors.white,
    fontSize: "22px",
    border: "0px",
    marginTop: "10px",
    width: "90%",
    minWidth: "100px",
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

const heightBody = "420px";

var SiteNavigator = React.createClass({
    propTypes: {
        allowedValues: IPropTypes.map.isRequired,
        decorators: IPropTypes.map,
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
    getDefaultProps: function () {
        return {
            decorators: Immutable.Map()
        };
    },
    getInitialState: function () {
        return {
            inputFilter: ""
        };
    },
    decoratedValues: function () {
        if (this.props.allowedValues) {
            return this.props.allowedValues.map((value) => Immutable.fromJS(mergeSiteSensors(value, this.props.decorators)));
        }
        return [];
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getKeyParent: function (value) {
        return value.get("_id");
    },
    getLabelParent: function (value) {
        return value.get("name") || value.get("_id");
    },
    getKeyChildren: function (value) {
        return value.get("id");
    },
    getLabelChildren: function (value) {
        return value.get("description") || value.get("id");
    },
    getFilterCriteria: function (values) {
        const NOT_VISIBLE_SENSORS = ["POD-ANZ", "ACTIVEENERGY", "REACTIVEENERGY", "MAXPOWER",
            "THL", "TEMPERATURE", "HUMIDITY", "ILLUMINANCE", "CO2"];

        return values.filter((value) => {
            return NOT_VISIBLE_SENSORS.indexOf((value.get("type") || "").toUpperCase()) < 0;
        });
    },
    getFilteredValues: function () {
        var clause = this.state.inputFilter.toLowerCase();
        return this.decoratedValues().filter((value) => {
            var pods = this.getFilterCriteria(value.get("sensors") || Immutable.Map())
                .map(this.getLabelChildren);
            return value.get("name").toLowerCase().includes(clause) ||
                pods.map((pod) => {
                    return pod.toLowerCase().includes(clause);
                }).contains(true);
        });
    },
    onClickChildren: function (value) {

        /*
        *   if you click 2 times the same value if it's the last
        *   of the path, we remove it, otherwise we just remove
        *   the selected values after it.
        */

        const lastValue = R.last(value.filter(value => {
            return !R.isNil(value);
        }));

        const index = this.props.path.indexOf(lastValue);
        if (index >= 0 && this.props.path.length -1 === index) {
            const newPath = this.props.path.filter(value => {
                return !R.isNil(value);
            }).slice(0, index);

            this.props.onChange(newPath);
        } else {
            const childrenPath = value.filter(value => {
                return !R.isNil(value);
            });
            this.props.onChange([this.props.path[0]].concat(childrenPath) || []);
        }
    },
    onClickParent: function (value) {
        const site = this.getKeyParent(value[0]);
        this.props.onChange([site]);
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
            const sensorsBySite = this.props.allowedValues.getIn([this.props.path[0], "sensors"]) || Immutable.List();

            return (
                <components.TreeView
                    allowedValues={sensorsBySite}
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
            <div style={{padding: "20px"}}>
                <h3 className="text-center" style={styles(theme).titleFullScreenModal}>
                    {this.props.title}
                </h3>
                <bootstrap.Row>
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
                                        borderBottomRightRadius: "0px",
                                        borderTopRightRadius: "0px",
                                        borderColor: theme.colors.borderInputSearch,
                                        backgroundColor: theme.colors.backgroundInputSearch,
                                        color: theme.colors.mainFontColor
                                    },
                                    ".form-control:focus": {
                                        borderColor: theme.colors.borderInputSearch,
                                        outline: "none",
                                        boxShadow: "none",
                                        WebkitBoxShadow: "none"
                                    },
                                    ".input-group-addon:last-child": {
                                        backgroundColor: theme.colors.backgroundInputSearch,
                                        borderColor: theme.colors.borderInputSearch,
                                        borderTopRightRadius: "20px",
                                        borderBottomRightRadius: "20px",
                                        cursor: "pointer"
                                    }
                                }}
                                scopeSelector=".search-container"
                            />
                            <bootstrap.FormGroup style={{display: "table"}}>
                                <bootstrap.FormControl
                                    className="input-search"
                                    onChange={input => this.setState({inputFilter: input.target.value})}
                                    placeholder="Ricerca"
                                    type="text"
                                    value={this.state.inputFilter}
                                />
                                <bootstrap.InputGroup.Addon>
                                    <components.Icon
                                        color={theme.colors.iconInputSearch}
                                        icon={"search"}
                                        size={"34px"}
                                        style={{
                                            lineHeight: "10px",
                                            verticalAlign: "middle"
                                        }}
                                    />
                                </bootstrap.InputGroup.Addon>
                            </bootstrap.FormGroup>
                        </div>
                    </bootstrap.Col>
                </bootstrap.Row>
                <bootstrap.Col
                    style={{
                        position: "relative",
                        overflow: "hidden",
                        paddingRight:"60px",
                        marginTop: "10px",
                        padding: "10px",
                        height: `calc(100vh - ${heightBody})`,
                        minHeight: "350px"
                    }}
                    xs={4}
                >
                    <div
                        className="site-navigator-parent"
                        style={{
                            position: "absolute",
                            overflow: "auto",
                            right: "-15px",
                            padding: "15px 20px",
                            width: "100%",
                            height: "100%"
                        }}
                    >
                        <Radium.Style
                            rules={{
                                ".btn-group-vertical": {
                                    position: "absolute",
                                    top: "0px",
                                    bottom: "0px",
                                    left: "0px",
                                    right: "-20px",
                                    overflow: "auto",
                                    width: "100%"
                                }
                            }}
                            scopeSelector=".site-navigator-parent"
                        />
                        {this.renderSitesParent()}
                    </div>
                </bootstrap.Col>
                <bootstrap.Col
                    style={{
                        overflow: "hidden",
                        height: `calc(100vh - ${heightBody})`,
                        minHeight: "350px",
                        borderRadius: "20px",
                        border: `1px solid ${theme.colors.borderContentModal}`,
                        backgroundColor: theme.colors.backgroundContentModal
                    }}
                    xs={8}
                >
                    <div
                        className="site-navigator-child"
                        style={{
                            position: "absolute",
                            overflow: "auto",
                            right: "-15px",
                            padding: "15px 20px",
                            width: "100%",
                            height: "100%"
                        }}
                    >
                        <Radium.Style
                            rules={{
                                ".btn-group-vertical": {
                                    width: "30%",
                                    minWidth: "100px"
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
