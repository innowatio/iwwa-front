var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var React      = require("react");

var CollectionUtils  = require("lib/collection-utils");
var components       = require("components");
var icons            = require("lib/icons");
var colors           = require("lib/colors");

var User = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map,
        user: IPropTypes.map
    },
    getInitialState: function () {
        return {
            selectedSite: null
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("siti");
        this.props.asteroid.subscribe("users");
    },
    onSelectSite: function (value) {
        this.setState({
            selectedSite: value[0]
        });
    },
    selectSiteToUser: function () {
        this.props.asteroid.call("addSitoToUser", this.state.selectedSite.get("_id"))
            .catch(e => console.log(e));
        this.setState({
            selectedSite: null
        });
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
    titleFirstSelect: function () {
        return R.isNil(this.state.selectedSite) ?
        <span>
            Seleziona un sito
            <img src={icons.iconDown} style={{float: "right", paddingTop: "5px", width: "16px"}}/>
        </span> :
        <span>
            {CollectionUtils.siti.getLabel(this.state.selectedSite)}
            <components.Spacer direction="h" size={30} />
            {this.state.selectedSite.get("pod")}
            <img src={icons.iconDown} style={{float: "right", paddingTop: "5px", width: "16px"}}/>
        </span>;
    },
    removeSiteFromUser: function (sito) {
        this.props.asteroid.call("removeSitoFromUser", sito.get("_id"))
            .catch(e => console.log(e));
        this.setState({
            selectedSite: null
        });
    },
    renderSelectUserSite: function () {
        var siti = this.props.collections.get("siti") || Immutable.Map();
        return (
            <components.Popover
                arrow="none"
                hideOnChange={true}
                style="inherit"
                title={this.titleFirstSelect()}
            >
                <components.SelectTree
                    allowedValues={siti}
                    buttonCloseDefault={true}
                    filter={CollectionUtils.siti.filter}
                    getLabel={CollectionUtils.siti.getLabel}
                    onChange={this.onSelectSite}
                />
            </components.Popover>
        );
    },
    renderTableSitiToUser: function (sito) {
        return (
            <tr key={sito}>
                <td style={{textAlign: "left"}}>
                    {CollectionUtils.siti.getLabel(sito)}
                </td>
                <td onClick={R.partial(this.removeSiteFromUser, sito)} style={{width: "36px", textAlign: "center", cursor: "pointer"}}>
                    <components.Icon icon="minus" />
                </td>
            </tr>
        );
    },
    render: function () {
        return (
            <bootstrap.Col style={{textAlign: "center"}} xs={12}>
                <components.Spacer direction="v" size={10}/>
                <bootstrap.Panel header="Siti accessibili all'utente" style={{width: "50%", marginLeft: "25%"}}>
                    <bootstrap.Table bordered hover style={{width: "467px", overflow: "auto", marginLeft: "15.5%"}}>
                        <tbody>
                            {this.getSiti().map(this.renderTableSitiToUser)}
                        </tbody>
                    </bootstrap.Table>
                    {this.renderSelectUserSite()}
                    <components.Button onClick={this.selectSiteToUser}>
                        <components.Icon icon="plus" style={{color: colors.primary}}/>
                    </components.Button>
                </bootstrap.Panel>
            </bootstrap.Col>
        );
    }
});

module.exports = User;
