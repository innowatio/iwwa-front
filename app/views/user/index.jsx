var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");
var Router     = require("react-router");

var CollectionUtils = require("lib/collection-utils");
var components      = require("components");
var icons           = require("lib/icons");
var colors          = require("lib/colors");
var styles          = require("lib/styles");
var stringIt        = require("lib/string-it");

var buttonStyle = {
        width: "200px",
        height: "40px",
        backgroundColor: colors.primary,
        color: colors.white
};

var User = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map,
        user: IPropTypes.map
    },
    getInitialState: function () {
        return {
            inputFilter: "",
            inputPassword: "",
            key: 3
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("siti");
        this.props.asteroid.subscribe("users");
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
            userSiti.map(sitoId => this.props.collections.getIn(["siti", sitoId])) ||
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
        var siti = this.props.collections.get("siti") || Immutable.Map();
        siti.map((sito) => {
            this.selectSiteToUser(sito);
        });
    },
    removeAllSiteFromUser: function () {
        var siti = this.props.collections.get("siti") || Immutable.Map();
        var userSiti = this.getUser().get("siti") || Immutable.List();
        siti.filter(sito => {
            return userSiti.includes(sito.get("_id"));
        }).map(this.removeSiteFromUser);
    },
    selectSiteToUser: function (value) {
        if (R.is(Array, value)) {
            value = value[0];
        }
        this.props.asteroid.call("addSitoToUser", value.get("_id"), this.getUser().get("_id"))
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
                <img src={icons.iconDown} style={{float: "right", paddingTop: "5px", width: "16px"}}/>
            </span>
        );
    },
    renderSelectUserSite: function () {
        var siti = this.props.collections.get("siti") || Immutable.Map();
        var userSiti = this.getUser().get("siti");
        var sitiToAdd = siti.filter(sito => {
            return !userSiti.includes(sito.get("_id"));
        });
        return (
            <components.Popover
                arrow="none"
                hideOnChange={true}
                notClosePopoverOnClick={true}
                style="inherit"
                title={this.renderTitleSelectSite()}
            >
                <components.SelectTree
                    allowedValues={sitiToAdd}
                    buttonCloseDefault={true}
                    filter={CollectionUtils.siti.filter}
                    getKey={CollectionUtils.siti.getKey}
                    getLabel={CollectionUtils.siti.getLabel}
                    onChange={this.selectSiteToUser}
                />
            </components.Popover>
        );
    },
    renderTableSitiToUser: function (sito) {
        return (
            <tr key={sito}>
                <td style={{textAlign: "left", color: colors.greySubTitle}}>
                    {sito.get("pod")} <components.Spacer direction="h" size={20}/> {CollectionUtils.siti.getLabel(sito)}
                </td>
                <td onClick={R.partial(this.removeSiteFromUser, sito)}
                    style={{width: "36px", textAlign: "center", cursor: "pointer", paddingRight: "20px"}}>
                    <components.Icon icon="minus" style={{color: colors.primary}} />
                </td>
            </tr>
        );
    },
    renderRolesButtons: function () {
        var userRoles = this.getUser().get("roles") || Immutable.List;
        return this.getRoles().map(role => {
            const userHasRole = userRoles.includes(role.get("name"));
            return role.get("name") !== "admin" ? (
                <components.Button key={role.get("_id")} onClick={R.partial(this.onToggleUserRoles, role.get("name"))}
                    style={{
                        marginRight: "20px",
                        backgroundColor: userHasRole ? colors.primary : colors.greyBackground,
                        color: userHasRole ? colors.white : colors.greySubTitle
                    }}>
                    {role.get("name").toUpperCase()}
                </components.Button>
            ) : null;
        }).toList().toJS();
    },
    render: function () {
        var getSitiOfUser = this.getSiti()
            .filter(value => CollectionUtils.siti.filter(value, this.state.inputFilter))
            .map(this.renderTableSitiToUser);
        return (
            <div className="users-admin">
                <Radium.Style
                    rules={R.merge(styles.tabForm, {
                        ".panel-body": {
                            display: "inline-block"
                        },
                        ".form-group": {
                            marginBottom: "0px"
                        },
                        ".form-control:focus": {
                            borderColor: colors.greyBorder
                        },
                        ".input-group-addon": {
                            backgroundColor: colors.white
                        },
                        ".table > tbody > tr > td": {
                            borderTop: "0px"
                        },
                        "span": {
                            color: colors.greySubTitle
                        }
                    })}
                    scopeSelector=".users-admin"
                />
                <Router.Link to="/users/">
                    <bootstrap.Button bsStyle="link" style={{height: "40px", outline: "0px"}}>
                        <img src={icons.iconArrowLeft} style={{height: "30px"}} />
                    </bootstrap.Button>
                </Router.Link>
                <div className="tabbed-area" style={R.merge(styles.tabbedArea, {marginTop: "0px"})}>
                    <bootstrap.TabbedArea
                        activeKey={this.state.key}
                        animation={false}
                        bsStyle={"tabs"}
                        onSelect={this.activeKey}
                    >

                        <bootstrap.TabPane eventKey={1} style={{marginLeft: "15px"}} tab="Ruoli dell'utente">
                                <components.Spacer direction="v" size={15} />
                                <span>{stringIt.roleTab}</span>
                                <components.Spacer direction="v" size={40} />
                                {this.renderRolesButtons()}
                        </bootstrap.TabPane>

                        <bootstrap.TabPane eventKey={2} tab="Password" >

                            <bootstrap.Col style={{height: "calc(100vh - 200px)", paddingRight: "0px"}} xs={6} >
                                <div style={{
                                        borderRight: `1px solid ${colors.greyBorder}`,
                                        marginTop: "40px",
                                        height: "calc(100vh - 260px)"
                                    }}
                                >
                                    <h4 style={styles.titleTab}>{stringIt.automaticReset}</h4>
                                    <components.Spacer direction="v" size={20} />
                                    <span>{stringIt.automaticEmail}</span>
                                    <span style={{fontSize: "12pt", color: colors.titleColor}}>
                                        {this.getUserEmail()}
                                    </span>
                                    <components.Spacer direction="v" size={60} />
                                    <div style={{position: "absolute", left: "36%", bottom: "20%"}}>
                                        <bootstrap.Button onClick={this.sendResetEmail} style={buttonStyle}>
                                            {stringIt.send}
                                        </bootstrap.Button>
                                    </div>
                                </div>
                            </bootstrap.Col >

                            <bootstrap.Col style={{height: "calc(100vh - 200px)"}} xs={6}>
                                <div style={{marginTop: "40px", height: "calc(100vh - 260px)"}} >
                                    <h4 style={styles.titleTab}>{stringIt.manualReset}</h4>
                                    <components.Spacer direction="v" size={20} />
                                    <span>{stringIt.manualEmail}</span>
                                    <span style={{fontSize: "12pt", color: colors.titleColor}}>
                                        {this.getUserEmail()}
                                    </span>
                                    <h4 style={{color: colors.primary}}>{stringIt.newPassword}</h4>
                                    <div style={{textAlign: "center"}}>
                                        <bootstrap.Input
                                            onChange={(input) => this.setState({inputPassword: input.target.value})}
                                            style={R.merge(styles.inputLine, {width: "95%", display: "inline"})}
                                            type="text"
                                        />
                                        <components.Spacer direction="v" size={40} />
                                    </div>
                                    <div style={{position: "absolute", left: "36%", bottom: "20%"}}>
                                        <components.Button onClick={this.setNewPassword} style={buttonStyle}>
                                            {stringIt.confirm}
                                        </components.Button>
                                    </div>
                                </div>
                            </bootstrap.Col>

                        </bootstrap.TabPane>

                        <bootstrap.TabPane eventKey={3} style={{marginLeft: "15px"}} tab="Siti">
                            <h4 style={R.merge(styles.titleTab, {marginTop: "0px", paddingTop: "30px"})} >
                                {stringIt.setSitiOfUser}
                            </h4>
                            <span>{stringIt.setUserSite}</span>
                            <components.Spacer direction="v" size={15} />
                            {this.renderSelectUserSite()}
                            {
                                /* <components.Button onClick={this.removeAllSiteFromUser}>
                                    {"Rimuovi i siti"}
                                </components.Button> */
                            }
                            <components.Button
                                onClick={this.selectAllSiteToUser}
                                style={R.merge(buttonStyle, {marginLeft: "20px", height: "34px"})}
                            >
                                {stringIt.addAllSites}
                            </components.Button>
                            <h4 style={R.merge(styles.titleTab, {fontSize: "14pt", marginTop: "20px", marginBottom: "20px"})} >
                                {stringIt.getSitiOfUser}
                            </h4>
                            <div style={{display: "flex"}}>
                                <bootstrap.Input
                                    addonBefore={<img src={icons.iconSearch} style={{height: "20px"}} />}
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
                                    <span style={{
                                            paddingTop: "5px",
                                            color: colors.greySubTitle,
                                            fontStyle: "italic",
                                            fontSize: "12pt",
                                            width: "125px"
                                        }}
                                    >
                                        {stringIt.removeAllSites}
                                    </span>
                                    <components.Spacer direction="h" size={15} />
                                    <div onClick={this.removeAllSiteFromUser}>
                                        <components.Icon
                                            icon="minus"
                                            onClick={this.removeAllSiteFromUser}
                                            style={{
                                                color: colors.primary,
                                                padding: "8px",
                                                border: `1px solid ${colors.greyBorder}`,
                                                height: "30px"
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                                <div style={{width: "100%", height: "calc(100vh - 442px)", overflowY: "auto"}}>
                                    <bootstrap.Table hover style={{marginBottom: "0px"}}>
                                        <tbody>
                                            {getSitiOfUser}
                                        </tbody>
                                    </bootstrap.Table>
                                </div>
                        </bootstrap.TabPane>
                    </bootstrap.TabbedArea>
                </div>
            </div>
        );
    }
});

module.exports = User;
