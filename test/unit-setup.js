var chai           = require("chai");
var jsdom          = require("jsdom");
var proxyquire     = require("proxyquire");
var React          = require("react");
var ReactDOM       = require("react-dom");
var ReactTestUtils = require("react-addons-test-utils");
var sinon          = require("sinon");
var sinonChai      = require("sinon-chai");
var MockStorage    = require("mock-localstorage");

// Setup fake DOM
global.document = jsdom.jsdom();
global.window = document.defaultView;
global.navigator = {
    userAgent: "node.js"
};

// Setup sinon and chai
global.sinon = sinon;
chai.use(sinonChai);
global.expect = chai.expect;

// Setup proxyquire
proxyquire.noPreserveCache();
proxyquire.noCallThru();
global.proxyquire = proxyquire;

// Setup React
global.React = React;
global.ReactDOM = ReactDOM;
global.TestUtils = ReactTestUtils;

// Avoid `Dygraph is not defined` when running tests
global.Dygraph = {};
// Avoid `ENVIRONMENT is not defined` when running tests
global.ENVIRONMENT = "";
// empty localStorage for tests
global.localStorage = new MockStorage();
