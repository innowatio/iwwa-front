var chai       = require("chai");
var jsdom      = require("jsdom");
var proxyquire = require("proxyquire");
var React      = require("react/addons");
var sinon      = require("sinon");
var sinonChai  = require("sinon-chai");

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
global.TestUtils = React.addons.TestUtils;

// to avoid `Dygraph is not defined` while running tests
global.Dygraph = {};
