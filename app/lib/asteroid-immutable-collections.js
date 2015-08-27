var Immutable = require("immutable");

var normalizeId = function (id) {
    /*
    *   When elements of a collection have an ObjectId as _id, the
    *   stringification of the ObjectId meteor does before sending the element
    *   to the client prepends a dash `-` to the normal stringification of the
    *   _id. See https://github.com/meteor/meteor/issues/1679 for details.
    */
    return (id[0] === "-") ? id.slice(1) : id;
};

exports.init = function init () {
    var self = this;
    self.collections = Immutable.Map();
    self.ddp.on("added", function (msg) {
        var id = normalizeId(msg.id);
        var element = Immutable.fromJS(msg.fields).set("_id", id);
        self.collections = self.collections
            .setIn([msg.collection, id], element);
        self.emit("collections:change");
    });
    self.ddp.on("changed", function (msg) {
        var id = normalizeId(msg.id);
        if (msg.fields) {
            self.collections = self.collections
                .mergeIn([msg.collection, id], msg.fields);
        }
        if (msg.cleared) {
            self.collections = msg.cleared.reduce(function (acc, field) {
                return acc.deleteIn([msg.collection, id, field]);
            }, self.collections);
        }
        self.emit("collections:change");
    });
    self.ddp.on("removed", function (msg) {
        var id = normalizeId(msg.id);
        self.collections = self.collections
            .deleteIn([msg.collection, id]);
        self.emit("collections:change");
    });
};
