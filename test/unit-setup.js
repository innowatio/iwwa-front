var chai           = require("chai");
var jsdom          = require("jsdom");
var proxyquire     = require("proxyquire");
var React          = require("react");
var ReactDOM       = require("react-dom");
var ReactTestUtils = require("react-addons-test-utils");
var sinon          = require("sinon");
var sinonChai      = require("sinon-chai");
var MockStorage    = require("mock-localstorage");
import $ from "teaspoon";

// Setup fake DOM
global.document = jsdom.jsdom();
global.window = document.defaultView;
global.navigator = {
    userAgent: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2454.85 Safari/537.36"
};

// Setup sinon and chai
global.sinon = sinon;
chai.use(sinonChai);
global.expect = chai.expect;
global.$ = $;

// Setup proxyquire
proxyquire.noPreserveCache();
proxyquire.noCallThru();
global.proxyquire = proxyquire;

// Setup React
global.React = React;
global.ReactDOM = ReactDOM;
global.TestUtils = ReactTestUtils;

// Avoid `EXEC_ENV is not defined` when running tests
window.APP_CONFIG = {
    EXEC_ENV: "",
    READ_BACKEND_ENDPOINT: "",
    WRITE_API_ENDPOINT: ""
};

// Avoid test for Ant Design in order to manage error Error: matchMedia not present, legacy browsers require a polyfill
window.matchMedia = window.matchMedia || function () {
    return {
        matches : false,
        addListener : function () {},
        removeListener: function () {}
    };
};

// empty localStorage for tests
global.localStorage = new MockStorage();
