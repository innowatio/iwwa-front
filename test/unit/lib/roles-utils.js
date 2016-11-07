import {fromJS} from "immutable";

import {getRoles, isAdmin} from "lib/roles-utils";

describe("`roles-utils`", () => {

    function getAsteroid (userId) {
        return {
            userId: userId,
            collections: fromJS({
                users: {
                    utenteAdmin: {
                        groups: ["admin"]
                    },
                    utenteYousave: {
                        groups: ["yousave"]
                    },
                    utenteMultiRoles: {
                        groups: ["multiroles"]
                    },
                    utenteNoRoles: {
                    }
                },
                groups: {
                    admin: {
                        name: "admin",
                        roles: ["manage-all"]
                    },
                    yousave: {
                        name: "yousave",
                        roles: ["access-lucy-pro"]
                    },
                    multiroles: {
                        name: "multiroles",
                        roles: ["access-lucy-pro", "access-lucy-light", "access-lucy-mobile"]
                    }
                }
            })
        };
    }

    it("`getRoles`", () => {
        it("returns an array of the roles", () => {
            expect(getRoles(getAsteroid("utenteAdmin"))).to.deep.equal(["manage-all"]);
            expect(getRoles(getAsteroid("utenteYousave"))).to.deep.equal(["access-lucy-pro"]);
            expect(getRoles(getAsteroid("utenteNoRoles"))).to.deep.equal([]);
            expect(getRoles(getAsteroid("utenteMultiRoles"))).to.deep.equal(["access-lucy-pro", "access-lucy-light", "access-lucy-mobile"]);
        });
    });
});
