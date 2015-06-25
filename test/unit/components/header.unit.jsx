require("unit-setup.js");

var Header = proxyquire("components/header/", {});

describe("The Header component", function () {
    it("should contain the string `Innowatio`", function () {
        var header = React.renderToStaticMarkup(<Header />);
        expect(header).to.match(/Innowatio/);
    });
});
