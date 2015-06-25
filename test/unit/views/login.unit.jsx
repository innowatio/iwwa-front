require("unit-setup.js");

var Login = proxyquire("views/login/", {});

describe("The Login view", function () {
    it("should contain a button", function () {
        var login = TestUtils.renderIntoDocument(<Login />);
        TestUtils.findRenderedDOMComponentWithTag(login, "button");
    });
});
