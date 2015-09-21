require("unit-setup.js");

var R      = require("ramda");
var Router = require("react-router");

var QuerystringMixin = proxyquire("lib/querystring-mixin.js", {});

describe("The `QuerystringMixin`", function () {

    it("should be an object", function () {
        expect(QuerystringMixin).to.be.an("object");
    });

    it("should have been mixed in with react-router's `Navigation` mixin", function () {
        expect(QuerystringMixin).to.include.keys(R.keys(Router.Navigation));
    });

    it("should define a `bindToQueryParameter` method", function () {
        expect(QuerystringMixin.bindToQueryParameter).to.be.a("function");
    });

});

describe("The `bindToQueryParameter` method", function () {

    it("should return an obect with a `value` and `onChange` properties", function () {
        var transformer = {
            parse: R.identity,
            stringify: R.identity
        };
        var actual = QuerystringMixin.bindToQueryParameter("queryKey", transformer);
        expect(actual).to.include.keys("value");
        expect(actual.onChange).to.be.a("function");
    });

});

describe("The `value` property of the object returned by the `bindToQueryParameter` method", function () {

    it("should be retrieved by the query parameters and parsed using the supplied transformer", function () {
        var instance = {
            props: {
                location: {
                    query: {
                        queryKey: "queryValue"
                    }
                }
            }
        };
        var transformer = {
            parse: sinon.spy(R.identity),
            stringify: sinon.spy(R.identity)
        };
        var actual = QuerystringMixin.bindToQueryParameter.call(instance, "queryKey", transformer);
        expect(transformer.parse).to.have.been.calledWith(instance.props.location.query.queryKey);
        expect(actual.value).to.equal(transformer.parse(instance.props.location.query.queryKey));
    });

});

describe("The `onChange` property of the object returned by the `bindToQueryParameter` method", function () {

    it("should trigger a query change with the value obtained by stringifying its first argument", function () {
        var instance = {
            props: {
                location: {
                    pathname: "/pathname",
                    query: {
                        queryKey: "queryValue"
                    }
                }
            },
            replaceWith: sinon.spy()
        };
        var transformer = {
            parse: sinon.spy(R.identity),
            stringify: sinon.spy(R.identity)
        };
        var actual = QuerystringMixin.bindToQueryParameter.call(instance, "queryKey", transformer);
        actual.onChange.call(instance, "newQueryValue");
        expect(transformer.stringify).to.have.been.calledWith("newQueryValue");
        expect(instance.replaceWith).to.have.been.calledWith(
            instance.props.location.pathname,
            {queryKey: "newQueryValue"}
        );
    });

});
