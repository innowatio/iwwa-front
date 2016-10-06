import {fromJS} from "immutable";

import {getRoles, isAdmin} from "lib/roles-utils";

describe("`roles-utils`", () => {

    function getAsteroid (userId) {
        return {
            userId: userId,
            collections: fromJS({
                users: {
                    utenteAdmin: {
                        roles: ["admin"]
                    },
                    utenteYousave: {
                        roles: ["yousave"]
                    },
                    utenteMultiRoles: {
                        roles: ["role1", "role2", "role3"]
                    },
                    utenteNoRoles: {
                    }
                }
            })
        };
    }

    it("`getRoles`", () => {
        it("returns an array of the roles", () => {
            expect(getRoles(getAsteroid("userAdmin"))).to.deep.equal(["admin"]);
            expect(getRoles(getAsteroid("utenteYousave"))).to.deep.equal(["yousave"]);
            expect(getRoles(getAsteroid("userNoRole"))).to.deep.equal([]);
            expect(getRoles(getAsteroid("utenteMultiRoles"))).to.deep.equal(["role1", "role2", "role3"]);
        });
    });

    it("`isAdmin`", () => {
        expect(isAdmin(getAsteroid("userAdmin"))).to.be.True;
        expect(isAdmin(getAsteroid("utenteYousave"))).to.be.False;
        expect(isAdmin(getAsteroid("userNoRole"))).to.be.False;
        expect(isAdmin(getAsteroid("utenteMultiRoles"))).to.be.False;
    });
});
