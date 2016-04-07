var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");
var Router     = require("react-router");

var CollectionUtils = require("lib/collection-utils");
var components      = require("components");
var stringIt        = require("lib/string-it");
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

const buttonStyle = ({colors}) => ({
    width: "200px",
    height: "40px",
    backgroundColor: colors.primary,
    color: colors.white
});
var User = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map,
        user: IPropTypes.map
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            inputFilter: "",
            inputPassword: "",
            key: 3
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
        this.props.asteroid.subscribe("users");
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getUser: function () {
        var userId = R.path(["params", "id"], this.props);
        var users = this.props.collections.get("users") || Immutable.Map();
        return (
            users.find(user => user.get("_id") === userId) ||
            Immutable.Map()
        );
    },
    getSiti: function () {
        var user = this.getUser();
        var userSiti = user.get("siti") || Immutable.List();
        return (
            userSiti.map(sitoId => this.props.collections.getIn(["sites", sitoId])) ||
            Immutable.List()
        );
    },
    getUserEmail: function () {
        var user = this.getUser();
        if (user.size !== 0) {
            return user.get("emails").getIn(["0", "address"]);
        }
    },
    getRoles: function () {
        return this.props.collections.get("roles") || Immutable.Map();
    },
    selectAllSiteToUser: function () {
        var siti = this.props.collections.get("sites") || Immutable.Map();
        siti.map((sito) => {
            this.selectSiteToUser(sito.get("_id"));
        });
    },
    removeAllSiteFromUser: function () {
        var siti = this.props.collections.get("sites") || Immutable.Map();
        var userSiti = this.getUser().get("siti") || Immutable.List();
        siti.filter(sito => {
            return R.isNil(userSiti) ? {} : userSiti.includes(sito.get("_id"));
        }).map(this.removeSiteFromUser);
    },
    selectSiteToUser: function (value) {
        if (R.is(Array, value)) {
            value = value[0];
        }
        this.props.asteroid.call("addSitoToUser", value, this.getUser().get("_id"))
            .catch(e => console.log(e));
    },
    removeSiteFromUser: function (sito) {
        this.props.asteroid.call("removeSitoFromUser", sito.get("_id"), this.getUser().get("_id"))
            .catch(e => console.log(e));
    },
    onToggleUserRoles: function (role) {
        this.props.asteroid.call("toggleUserRole", role, this.getUser().get("_id"))
            .catch(e => console.log(e));
    },
    sendResetEmail: function () {
        this.props.asteroid.call("sendResetEmail", this.getUser().get("_id"))
            .catch(e => console.log(e));
    },
    setNewPassword: function () {
        this.props.asteroid.call("setPassword", this.getUser().get("_id"), this.state.inputPassword)
            .catch(e => console.log(e));
    },
    activeKey: function (key) {
        this.setState({
            key: key
        });
    },
    renderTitleSelectSite: function () {
        return (
            <span>
                {"Seleziona uno o più siti siti"}
                <components.Icon
                    color={this.getTheme().colors.iconInputSelect}
                    icon={"arrow-down"}
                    size={"20px"}
                    style={{
                        float: "right",
                        lineHeight: "20px",
                        verticalAlign: "middle"
                    }}
                />
            </span>
        );
    },
    renderSelectUserSite: function () {
        var siti = this.props.collections.get("sites") || Immutable.Map();
        var userSiti = this.getUser().get("siti");
        var sitiToAdd = siti.filter(sito => {
            return R.isNil(userSiti) ? {} : !userSiti.includes(sito.get("_id"));
        });
        return (
            <components.Popover
                arrow="none"
                hideOnChange={true}
                notClosePopoverOnClick={true}
                title={this.renderTitleSelectSite()}
            >
                <components.SelectTree
                    allowedValues={sitiToAdd}
                    buttonCloseDefault={true}
                    filter={CollectionUtils.sites.filter}
                    getKey={CollectionUtils.sites.getKey}
                    getLabel={CollectionUtils.sites.getLabel}
                    onChange={this.selectSiteToUser}
                />
            </components.Popover>
        );
    },
    renderTableSitiToUser: function (sito) {
        const {colors} = this.getTheme();
        return (
            <tr key={sito}>
                <td style={{textAlign: "left", color: colors.greySubTitle}}>
                    {sito.get("pod")} <components.Spacer direction="h" size={20}/> {CollectionUtils.sites.getLabel(sito)}
                </td>
                <td onClick={R.partial(this.removeSiteFromUser, [sito])}
                    style={{width: "36px", textAlign: "center", cursor: "pointer", paddingRight: "20px"}}
                >
                    <p style={{
                        color: colors.primary,
                        textAlign: "center",
                        fontSize: "30px",
                        fontWeight: "900",
                        lineHeight: "12px"
                    }}
                    >
                        {"–"}
                    </p>
                </td>
            </tr>
        );
    },
    renderRolesButtons: function () {
        const {colors} = this.getTheme();
        var userRoles = this.getUser().get("roles") || Immutable.List();
        return this.getRoles().map(role => {
            const userHasRole = userRoles.includes(role.get("name"));
            return role.get("name") !== "admin" ? (
                <components.Button key={role.get("_id")} onClick={R.partial(this.onToggleUserRoles, [role.get("name")])}
                    style={{
                        marginRight: "20px",
                        backgroundColor: userHasRole ? colors.primary : colors.greyBackground,
                        color: userHasRole ? colors.white : colors.greySubTitle
                    }}
                >
                    {role.get("name").toUpperCase()}
                </components.Button>
            ) : null;
        }).toList().toJS();
    },
    renderRolesTab: function () {
        return (
            <bootstrap.Tab eventKey={1} style={{marginLeft: "15px"}} title="Ruoli dell'utente">
                <components.Spacer direction="v" size={15} />
                <span>{stringIt.roleTab}</span>
                <components.Spacer direction="v" size={40} />
                {this.renderRolesButtons()}
            </bootstrap.Tab>
        );
    },
    renderPasswordTab: function () {
        const theme = this.getTheme();
        return (
            <bootstrap.Tab eventKey={2} title="Password" >
                {/* Automatic change of the password */}
                <bootstrap.Col style={{height: "calc(100vh - 200px)", paddingRight: "0px"}} xs={6} >
                    <div style={{
                        borderRight: `1px solid ${theme.colors.greyBorder}`,
                        marginTop: "40px",
                        height: "calc(100vh - 260px)"
                    }}
                    >
                        <h4 style={styles(theme).titleTab}>{stringIt.automaticReset}</h4>
                        <components.Spacer direction="v" size={20} />
                        <span>{stringIt.automaticEmail}</span>
                        <span style={{fontSize: "12pt", color: theme.colors.titleTabColor}}>
                            {this.getUserEmail()}
                        </span>
                        <components.Spacer direction="v" size={60} />
                        <div style={{position: "absolute", left: "36%", bottom: "20%"}}>
                            <bootstrap.Button onClick={this.sendResetEmail} style={buttonStyle(theme)}>
                                {stringIt.send}
                            </bootstrap.Button>
                        </div>
                    </div>
                </bootstrap.Col >
                {/* Manual change of the password */}
                <bootstrap.Col style={{height: "calc(100vh - 200px)"}} xs={6}>
                    <div style={{marginTop: "40px", height: "calc(100vh - 260px)"}} >
                        <h4 style={styles(theme).titleTab}>{stringIt.manualReset}</h4>
                        <components.Spacer direction="v" size={20} />
                        <span>{stringIt.manualEmail}</span>
                        <span style={{fontSize: "12pt", color: theme.colors.titleTabColor}}>
                            {this.getUserEmail()}
                        </span>
                        <h4 style={{color: theme.colors.primary}}>{stringIt.newPassword}</h4>
                        <div style={{textAlign: "center"}}>
                            <bootstrap.Input
                                onChange={(input) => this.setState({inputPassword: input.target.value})}
                                style={R.merge(styles(theme).inputLine, {width: "95%", display: "inline"})}
                                type="text"
                            />
                            <components.Spacer direction="v" size={40} />
                        </div>
                        <div style={{position: "absolute", left: "36%", bottom: "20%"}}>
                            <components.Button onClick={this.setNewPassword} style={buttonStyle(theme)}>
                                {stringIt.confirm}
                            </components.Button>
                        </div>
                    </div>
                </bootstrap.Col>

            </bootstrap.Tab>
        );
    },
    renderUserSitiTab: function () {
        const theme = this.getTheme();
        const getSitiOfUser = this.getSiti()
            .filter(value => CollectionUtils.sites.filter(value, this.state.inputFilter))
            .map(this.renderTableSitiToUser);
        return (
            <bootstrap.Tab eventKey={3} style={{marginLeft: "15px"}} title="Siti">
                <h4 style={R.merge(styles(theme).titleTab, {marginTop: "0px", paddingTop: "30px"})} >
                    {stringIt.setSitiOfUser}
                </h4>
                <span>{stringIt.setUserSite}</span>
                <components.Spacer direction="v" size={15} />
                {this.renderSelectUserSite()}
                <components.Button
                    onClick={this.selectAllSiteToUser}
                    style={R.merge(buttonStyle(theme), {marginLeft: "20px", height: "34px"})}
                >
                    {stringIt.addAllSites}
                </components.Button>
                <h4 style={R.merge(styles(theme).titleTab, {fontSize: "14pt", marginTop: "20px", marginBottom: "20px"})} >
                    {stringIt.getSitiOfUser}
                </h4>
                <div style={{display: "flex"}}>
                    <bootstrap.Input
                        addonBefore={
                            <components.Icon
                                color={this.getTheme().colors.iconSearchUser}
                                icon={"search"}
                                size={"18px"}
                                style={{lineHeight: "14px"}}
                            />
                        }
                        onChange={(input) => this.setState({inputFilter: input.target.value})}
                        placeholder={stringIt.filterUserSite}
                        style={{
                            borderRadius: "0px",
                            width: "40%",
                            borderLeft: "0px",
                            WebkitBoxShadow: "none",
                            boxShadow: "none"
                        }}
                        type="text"
                    />
                    <div style={{display: "flex", marginRight: "12px"}}>
                        <span style={{paddingTop: "5px", fontStyle: "italic", fontSize: "12pt", width: "125px"}} >
                            {stringIt.removeAllSites}
                        </span>
                        <components.Spacer direction="h" size={15} />
                        <div onClick={this.removeAllSiteFromUser}>
                            <p onClick={this.removeAllSiteFromUser} style={{
                                cursor: "pointer",
                                color: theme.colors.primary,
                                textAlign: "center",
                                width: "34px",
                                height: "34px",
                                border: `1px solid ${theme.colors.greyBorder}`,
                                fontSize: "28px",
                                fontWeight: "900",
                                lineHeight: "28px"
                            }}
                            >
                                {"–"}
                            </p>
                        </div>
                    </div>
                </div>
                <div style={{width: "100%", height: "calc(100vh - 442px)", overflowY: "auto"}}>
                    <bootstrap.Table hover={true} style={{marginBottom: "0px"}}>
                        <tbody>
                            {getSitiOfUser}
                        </tbody>
                    </bootstrap.Table>
                </div>
            </bootstrap.Tab>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div className="users-admin">
                <div style={styles(theme).titlePage}>
                    <Router.Link style={{float: "left", paddingTop: "6px"}} to="/users/">
                        <bootstrap.Button bsStyle="link" style={{height: "40px", outline: "0px", padding: "0"}}>
                            <components.Icon
                                color={theme.colors.iconHeader}
                                icon={"arrow-left"}
                                size={"40px"}
                                style={{lineHeight: "30px"}}
                            />
                        </bootstrap.Button>
                    </Router.Link>
                    <div style={{
                        fontSize: "18px",
                        marginBottom: "0px",
                        paddingTop: "18px",
                        width: "100%",
                        textAlign: "center"
                    }}
                    >
                        {`Modifica utente: ${this.getUserEmail()}`}
                    </div>
                </div>
                <Radium.Style
                    rules={R.merge(styles(theme).tabForm, {
                        ".panel-body": {
                            display: "inline-block"
                        },
                        ".form-group": {
                            marginBottom: "0px"
                        },
                        ".form-control:focus": {
                            borderColor: theme.colors.greyBorder
                        },
                        ".input-group-addon": {
                            backgroundColor: theme.colors.white
                        },
                        ".table > tbody > tr > td": {
                            borderTop: "0px"
                        },
                        "span": {
                            color: theme.colors.greySubTitle
                        }
                    })}
                    scopeSelector=".users-admin"
                />
                <div className="tabbed-area" style={R.merge(styles(theme).tabbedArea, {marginTop: "25px"})}>
                    <bootstrap.Tabs
                        activeKey={this.state.key}
                        animation={false}
                        bsStyle={"tabs"}
                        onSelect={this.activeKey}
                    >
                        {this.renderRolesTab()}
                        {this.renderPasswordTab()}
                        {this.renderUserSitiTab()}
                    </bootstrap.Tabs>
                </div>
            </div>
        );
    }
});

module.exports = User;
