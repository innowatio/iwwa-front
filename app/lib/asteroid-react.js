// var throttle = require("lodash.throttle");
var debounce = require("lodash.debounce");

exports.getControllerViewMixin = function getControllerViewMixin () {
    var self = this;
    return {
        getInitialState: function () {
            return {
                collections: self.collections,
                userId: self.userId,
                user: self.collections.getIn(["users", self.userId])
            };
        },
        setUserId: function () {
            this.setState({
                userId: self.userId,
                user: self.collections.getIn(["users", self.userId])
            });
        },
        // updateCollections: throttle(function () {
        //     if (self.loggedIn) {
        //         this.setState({
        //             collections: self.collections
        //         });
        //     }
        // }, 1000),
        updateCollections: debounce(function () {
            if (self.loggedIn) {
                this.setState({
                    collections: self.collections
                });
            }
        }, 500),
        componentDidMount: function () {
            self.on("loggedIn", this.setUserId);
            self.on("loggedOut", this.setUserId);
            self.on("collections:change", this.updateCollections);
        },
        componentWillUnmount: function () {
            self.off("collections:change", this.updateCollections);
            self.off("loggedIn", this.setUserId);
            self.off("loggedOut", this.setUserId);
        }
    };
};
