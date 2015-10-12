var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");
var Router     = require("react-router");

var CollectionUtils  = require("lib/collection-utils");
var components       = require("components");
var icons            = require("lib/icons");
var colors           = require("lib/colors");

var styles = {
    userDiv: {
        border: `1px solid ${colors.greyBorder}`,
        width: "100%",
        display: "inline-block",
        borderRadius: "4px"
    },
    title: {
        paddingLeft: "15px"
    }
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
            inputPassword: ""
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
                <td style={{textAlign: "left"}}>
                    {sito.get("pod")} <components.Spacer direction="h" size={20}/> {CollectionUtils.siti.getLabel(sito)}
                </td>
                <td onClick={R.partial(this.removeSiteFromUser, sito)}
                    style={{width: "36px", textAlign: "center", cursor: "pointer"}}>
                    <components.Icon icon="minus" />
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
                        marginRight: "5px",
                        backgroundColor: userHasRole ? colors.primary : colors.white,
                        color: userHasRole ? colors.white : colors.black
                    }}>
                    {role.get("name")}
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
                    rules={{
                        ".panel-body": {
                            display: "inline-block"
                        },
                        ".form-group": {
                            marginBottom: "0px"
                        }
                    }}
                    scopeSelector=".users-admin"
                />
                <div style={{paddingTop: "20px"}}>
                    <bootstrap.Col xs={6}>
                        <div style={styles.userDiv}>
                            <h4 style={styles.title}>{"Ruoli dell'utente"}</h4>
                            <div style={{borderTop: `1px solid ${colors.greyBorder}`, paddingBottom: "5px"}}/>
                            <div style={{marginLeft: "10px", marginTop: "15px"}}>
                                {this.renderRolesButtons()}
                                <br />
                                <components.Spacer direction="v" size={15} />
                                <span>{"Clicca un ruolo per selezionarlo"}</span>
                                <components.Spacer direction="v" size={15} />
                            </div>
                        </div>
                        <components.Spacer direction="v" size={2} />
                        <div style={styles.userDiv}>
                            <h4 style={styles.title}>{"Reset password"}</h4>
                            <div style={{borderTop: `1px solid ${colors.greyBorder}`, paddingBottom: "5px"}}></div>
                            <div style={{marginLeft: "10px"}}>
                                <span>{"Manda una email per il reset della password a "}</span>
                                <span style={{fontWeight: "600"}}>{this.getUserEmail()}</span>
                                <br />
                                <components.Spacer direction="v" size={15} />
                                <components.Button onClick={this.sendResetEmail}>
                                    {"Manda email"}
                                </components.Button>
                                <components.Spacer direction="v" size={15} />
                            </div>
                        </div>
                        <components.Spacer direction="v" size={2} />
                        <div style={styles.userDiv}>
                            <h4 style={styles.title}>{"Cambio password"}</h4>
                            <div style={{borderTop: `1px solid ${colors.greyBorder}`, paddingBottom: "5px"}}></div>
                            <div style={{marginLeft: "10px"}}>
                                <bootstrap.Input
                                    label={"Password"}
                                    onChange={(input) => this.setState({inputPassword: input.target.value})}
                                    type="text" />
                                <components.Button onClick={this.setNewPassword}>
                                    {"Cambia password"}
                                </components.Button>
                                <components.Spacer direction="v" size={15} />
                            </div>
                        </div>
                    </bootstrap.Col>
                    {/* This part is for the selection of the site for the user selected */}
                    <bootstrap.Col style={{height: "100%", textAlign: "center"}} xs={6}>
                        <div style={R.merge(styles.userDiv, {height: "calc(100vh - 140px)"})}>
                            <h4 style={styles.title}>{"Siti accessibili all'utente"}</h4>
                            <div style={{borderTop: `1px solid ${colors.greyBorder}`, paddingBottom: "5px"}}></div>
                            <div style={{marginBottom: "20px"}}>
                                {this.renderSelectUserSite()}
                                <components.Button onClick={this.removeAllSiteFromUser}>
                                    {"Rimuovi i siti"}
                                </components.Button>
                                <components.Button onClick={this.selectAllSiteToUser}>
                                    {"Aggiungi tutti i siti"}
                                </components.Button>
                            </div>
                            <bootstrap.Input
                                onChange={(input) => this.setState({inputFilter: input.target.value})}
                                placeholder={"Filtro"}
                                style={{borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px", borderBottom: "0px"}}
                                type="text" />
                            <div style={{width: "100%", height: "calc(100vh - 280px)", overflowY: "auto"}}>
                                <bootstrap.Table bordered hover style={{marginBottom: "0px"}}>
                                    <tbody>
                                        {getSitiOfUser}
                                    </tbody>
                                </bootstrap.Table>
                            </div>
                        </div>
                    </bootstrap.Col>
                </div>
            </div>
        );
    }
});

module.exports = User;
