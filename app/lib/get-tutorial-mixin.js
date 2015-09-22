var Intro = require("intro.js").introJs;
var R     = require("ramda");

var TutorialMixin = function (page, refs) {
    return {
        componentDidMount: function () {
            if (R.isNil(localStorage[`hideTutorialOnPage_${page}`]) || localStorage[`hideTutorialOnPage_${page}`] === "false") {
                localStorage[`hideTutorialOnPage_${page}`] = true;
                var intro = new Intro();
                intro.setOptions({
                    steps: R.sortBy(R.prop("order"), refs.map(ref => this.refs[ref].getOptions())),
                    nextLabel: "Succ. →",
                    prevLabel: "← Prec.",
                    skipLabel: "Salta",
                    doneLabel: "Fatto",
                    exitOnOverlayClick: false,
                    showProgress: true,
                    showBullets: false,
                    scrollToElement: true,
                    disableInteraction: false
                });
                intro.start();
            }
        }
    };
};

module.exports = TutorialMixin;
