const Access = {

    pages: {
        adminPage: "adminPage",
        userPage: "userPage",
    },

    checkAccess(rol, page) {

        let accessPermissions = {
            adminPage: [
                "admin"
            ],
            userPage: [
                "admin", "user"
            ],
        };

        return accessPermissions[page].includes(rol);
    }

}

export default Access;