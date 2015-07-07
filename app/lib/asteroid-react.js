var throttle = require("lodash.throttle");

exports.getControllerViewMixin = function getControllerViewMixin () {
    var self = this;
    return {
        getInitialState: function () {
            return {
                collections: self.collections
            };
        },
        setUserId: function () {
            this.setState({
                userId: self.userId,
                user: self.collections.getIn(["users", self.userId])
            });
        },
        updateCollections: throttle(function () {
            this.setState({
                collections: self.collections
            });
        }, 500),
        componentDidMount: function () {
            self.on("collections:change", this.updateCollections);
            self.on("loggedIn", this.setUserId);
            self.on("loggedOut", this.setUserId);
        },
        componentWillUnmount: function () {
            self.off("collections:change", this.updateCollections);
            self.off("loggedIn", this.setUserId);
            self.off("loggedOut", this.setUserId);
        }
    };
};

exports.getSubscriptionMixin = function getSubscriptionMixin () {
    var self = this;
    return {
        asteroidSubscribe: function (/* subscription arguments */) {
            var sub = self.subscribe.apply(self, arguments);
            this.asteroidSubscriptions.push(sub);
        },
        componentWillUnmount: function () {
            this.asteroidSubscriptions.forEach(function (subscription) {
                self.unsubscribe(subscription.id);
            });
        }
    };
};
