export const findRole = (roles, role) => {
    for (let i = 0; i < roles.length; i++) {
        if (roles[i] === role) {
            return i;
        }
    }
    return -1;
}