import React, {PropTypes} from "react";
import {Col, Clearfix, ControlLabel, FormControl} from "react-bootstrap";
import {Link} from "react-router";
import Radium from "radium";

import {Button, Icon, FullscreenModal} from "components";

import {hasRole, DOWNLOAD_CHART_DATA} from "lib/roles-utils";
import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";

const inputStyleRules = (theme) => ({
    "": {
        padding: "0px 5px",
        margin: "0px 0px 20px 0px"
    },
    "label.control-label": {
        display: "block",
        color: theme.colors.white,
        fontWeight: "300",
        padding: "0px",
        margin: "0px"
    },
    "label.control-label span": {
        display: "block"
    },
    "input": {
        borderBottom: "1px solid",
        borderColor: theme.colors.white + "!important"
    },
    "span": {
        display: "none"
    }
});

const stylesFunction = (theme, active) => ({
    buttonIconStyle: {
        backgroundColor: active ? theme.colors.buttonPrimary : theme.colors.primary,
        border: "0px none",
        borderRadius: "100%",
        height: "50px",
        width: "50px",
        padding: "0px",
        textAlign: "center",
        margin: "0px 5px"
    },
    inputs: {
        width: "90%",
        margin: "0px auto",
        height: "60px",
        fontSize: "20px",
        fontWeight: "300",
        borderRadius: "20px",
        borderColor: theme.colors.borderInputSearch,
        backgroundColor: theme.colors.backgroundInputSearch,
        color: theme.colors.mainFontColor
    },
    labelStyle: {
        color: theme.colors.white,
        display: "inherit",
        marginBottom: "10px",
        textAlign: "center",
        fontWeight: "400",
        fontSize: "16px"
    },
    modalTitleStyle: {
        color: theme.colors.white,
        display: "inherit",
        marginBottom: "50px",
        textAlign: "center",
        fontWeight: "400",
        fontSize: "28px"
    }
});

var MonitoringChartToolbar = React.createClass({
    propTypes: {
        addToFavorite: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        changeYAxisValues: PropTypes.func.isRequired,
        getYAxis: PropTypes.func.isRequired,
        monitoringChart: PropTypes.object.isRequired,
        monitoringChartRef: PropTypes.any,
        resetYAxisValues: PropTypes.func.isRequired,
        selectChartType: PropTypes.func.isRequired,
        toggleComparisonChart: PropTypes.func.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function (props) {
        this.setState(this.getStateFromProps(props));
    },
    getStateFromProps: function (props) {
        let state = {
            yAxis: props.monitoringChart.yAxis,
            favoriteName: null
        };
        let yAxis = props.getYAxis(props);
        yAxis.forEach(y => {
            if (!state.yAxis[y]) {
                state.yAxis[y] = {
                    min: "",
                    max: ""
                };
            }
        });
        return state;
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getYAxisValidationState: function () {
        let yAxis = this.props.getYAxis(this.props);
        let success = true;
        yAxis.forEach((y) => {
            let {min, max} = this.state.yAxis[y];
            success = success && (parseInt(min) < parseInt(max));
        });
        return success ? "success" : "error";
    },
    getChartPeriod: function () {
        const xAxis = this.props.monitoringChartRef.refs.DEFAULT.getChart().xAxis[0];
        return {
            max: xAxis.max,
            min: xAxis.min
        };
    },
    changeYAxisValues: function () {
        this.props.changeYAxisValues(this.state.yAxis, this.getChartPeriod());
    },
    exportSV: function () {
        const csvData = this.props.monitoringChartRef.refs.DEFAULT.getChart().getCSV();
        let csvFile = document.createElement("a");
        csvFile.href = "data:attachment/csv," + encodeURIComponent(csvData);
        csvFile.target = "_blank";
        csvFile.download = "monitoring-export.csv";
        document.body.appendChild(csvFile);
        csvFile.click();
    },
    openModal: function () {
        this.setState({showModal:true});
    },
    closeModal: function () {
        this.setState({
            showModal: false,
            value: null
        });
    },
    onConfirmFullscreenModal: function () {
        this.props.addToFavorite(this.props.monitoringChart, this.state.favoriteName, this.props.asteroid.userId);
        this.closeModal();
    },
    renderChartStyleButton: function (theme, chartType, icon) {
        return (
            <Button
                disabled={!this.props.monitoringChartRef}
                onClick={() => this.props.selectChartType(chartType, this.getChartPeriod())}
                style={stylesFunction(theme, this.props.monitoringChart.type === chartType).buttonIconStyle}
            >
                <Icon
                    color={theme.colors.white}
                    icon={icon}
                    size={"36px"}
                    style={{lineHeight: "20px"}}
                />
            </Button>
        );
    },
    renderComparisonButton:  function (theme, icon) {
        return (
            <Button
                disabled={!this.props.monitoringChartRef}
                onClick={() => this.props.toggleComparisonChart(icon, this.getChartPeriod())}
                style={stylesFunction(theme, this.props.monitoringChart.comparisonCharts[icon]).buttonIconStyle}
            >
                <Icon
                    color={theme.colors.white}
                    icon={icon}
                    size={"32px"}
                    style={{lineHeight: "20px", verticalAlign: "middle"}}
                />
            </Button>
        );
    },
    renderFavouriteButton: function (theme) {
        return (
            <div>
                <Button
                    disabled={!this.props.monitoringChartRef}
                    onClick={this.openModal}
                    style={stylesFunction(theme).buttonIconStyle}
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"star-o"}
                        size={"28px"}
                        style={{lineHeight: "20px"}}
                    />
                </Button>
                <p style={{
                    marginBottom: "25px",
                    fontSize: "16px",
                    color: theme.colors.navText,
                    fontWeight: "300"
                }}>
                    {"Aggiungi ai preferiti"}
                </p>
                <FullscreenModal
                    onConfirm={this.onConfirmFullscreenModal}
                    onHide={this.closeModal}
                    onReset={this.closeModal}
                    renderConfirmButton={true}
                    show={this.state.showModal}
                >
                    {this.renderModalBody(theme)}
                </FullscreenModal>
            </div>
        );
    },
    renderModalBody: function (theme) {
        return (
            <div style={{textAlign: "center"}}>
                <div>
                    <label style={stylesFunction(theme).modalTitleStyle}>
                        {"AGGIUNGI GRAFICO AI PREFERITI"}
                    </label>
                </div>
                <FormControl
                    bsSize="small"
                    onChange={input => this.setState({favoriteName: input.target.value})}
                    placeholder={"Inserisci il nome per il tuo grafico"}
                    style={stylesFunction(theme).inputs}
                    type="text"
                />
            </div>
        );
    },
    renderYAxisValuesChange: function (theme) {
        return (
            <div style={{
                padding: "20px",
                borderBottom: "solid 1px",
                borderColor: theme.colors.white
            }}>
                <label style={stylesFunction(theme).labelStyle}>
                    {"CAMBIA VALORI ASSI Y"}
                </label>
                {this.renderYAxisInputs(theme)}
                <div style={{textAlign: "center", marginLeft: "25px"}}>
                    <Button
                        disabled={!this.props.monitoringChartRef}
                        onClick={this.changeYAxisValues}
                        style={{
                            ...styles(theme).buttonSelectChart,
                            width: "120px",
                            height: "40px",
                            lineHeight: "40px",
                            padding: "0px",
                            margin: "0px 0px 0px 30px",
                            fontSize: "20px",
                            border: "0px",
                            backgroundColor: theme.colors.buttonPrimary
                        }}
                    >
                        {"OK"}
                    </Button>
                    <Button
                        bsStyle={"link"}
                        disabled={!this.props.monitoringChartRef}
                        onClick={this.props.resetYAxisValues}
                    >
                        <Icon
                            color={theme.colors.iconArrow}
                            icon={"reset"}
                            size={"35px"}
                            style={{
                                float: "right",
                                verticalAlign: "middle",
                                lineHeight: "20px"
                            }}
                        />
                    </Button>
                </div>
            </div>
        );
    },
    renderYAxisInputs: function (theme) {
        let yAxis = this.props.getYAxis(this.props);
        let components = [];
        yAxis.forEach((y, index) => {
            components.push(
                <div key={index}>
                    <Col className="input-style" md={6}>
                        <Radium.Style
                            rules={inputStyleRules(theme)}
                            scopeSelector=".input-style"
                        />
                        <ControlLabel>{y +" min:"}</ControlLabel>
                        <FormControl
                            type="number"
                            disabled={this.props.monitoringChart.yAxis.disabled}
                            bsStyle={this.getYAxisValidationState()}
                            hasFeedback={true}
                            onChange={input => {
                                let newState = JSON.parse(JSON.stringify(this.state));
                                newState.yAxis[y].min = input.target.value;
                                this.setState(newState);
                            }}
                            style={{...styles(theme).inputLine}}
                            value={this.state.yAxis[y].min}
                        />
                    </Col>
                    <Col className="input-style" md={6}>
                        <Radium.Style
                            rules={inputStyleRules(theme)}
                            scopeSelector=".input-style"
                        />
                        <ControlLabel>{y + " max:"}</ControlLabel>
                        <FormControl
                            type="number"
                            disabled={this.props.monitoringChart.yAxis.disabled}
                            bsStyle={this.getYAxisValidationState()}
                            hasFeedback={true}
                            onChange={input => {
                                let newState = JSON.parse(JSON.stringify(this.state));
                                newState.yAxis[y].max = input.target.value;
                                this.setState(newState);
                            }}
                            style={{...styles(theme).inputLine}}
                            value={this.state.yAxis[y].max}
                        />
                    </Col>
                </div>
            );
        });
        return components;
    },
    renderCSVExport: function (theme) {
        return hasRole(this.props.asteroid, DOWNLOAD_CHART_DATA) ? (
            <div style={{textAlign: "center", padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                <Button
                    disabled={!this.props.monitoringChartRef}
                    onClick={this.exportSV}
                    style={{
                        ...styles(theme).buttonSelectChart,
                        width: "120px",
                        height: "40px",
                        lineHeight: "40px",
                        padding: "0px",
                        margin: "0px 0px 0px 30px",
                        fontSize: "20px",
                        border: "0px",
                        backgroundColor: theme.colors.buttonPrimary
                    }}
                >
                    {"Eporta CSV"}
                </Button>
            </div>
        ) : null;
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <div style={{
                    padding: "20px",
                    textAlign: "center",
                    borderBottom: "solid 1px",
                    borderColor: theme.colors.white
                }}>
                    <label style={stylesFunction(theme).labelStyle}>
                        {"SCEGLI LO STILE DEL GRAFICO"}
                    </label>
                    <div>
                        {this.renderChartStyleButton(theme, "spline", "chart-style1")}
                        {this.renderChartStyleButton(theme, "column", "chart-style2")}
                        {this.renderChartStyleButton(theme, "stacked", "chart-style4")}
                        {this.renderChartStyleButton(theme, "percent", "chart-style3")}
                    </div>
                </div>
                {this.renderYAxisValuesChange(theme)}
                <div style={{textAlign: "center", marginTop: "25px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                    <Col lg={6} md={6} xs={12}>
                        {this.renderFavouriteButton(theme)}
                    </Col>
                    <Col className="link" lg={6} md={6} xs={12}>
                        <Radium.Style
                            rules={{
                                ":hover": {
                                    textDecoration: "none"
                                },
                                ".btn-default:hover": {
                                    backgroundColor: theme.colors.buttonPrimary + "!important"
                                }
                            }}
                            scopeSelector=".link"
                        />
                        <Link to={"/monitoring/favorites/"}>
                            <Button style={stylesFunction(theme).buttonIconStyle}>
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"list-favourite"}
                                    size={"32px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                        </Link>
                        <p style={{
                            marginBottom: "25px",
                            fontSize: "16px",
                            color: theme.colors.navText,
                            fontWeight: "300",
                            textDecoratio: "none"
                        }}>
                            {"Visualizza elenco"}
                        </p>
                    </Col>
                    <Clearfix>{}</Clearfix>
                </div>
                <div style={{textAlign: "center", padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                    <label style={stylesFunction(theme).labelStyle}>
                    {"VEDI SETTIMANA/MESE/ANNO PRECEDENTE:"}
                    </label>
                    <div>
                        {this.renderComparisonButton(theme, "week")}
                        {this.renderComparisonButton(theme, "month")}
                        {this.renderComparisonButton(theme, "year")}
                    </div>
                </div>
                {this.renderCSVExport(theme)}
            </div>
        );
    }
});

module.exports = MonitoringChartToolbar;