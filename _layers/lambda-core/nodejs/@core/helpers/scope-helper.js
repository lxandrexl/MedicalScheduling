
function scopeToWhere(user, scope) {
    const clientCode = user.clientCode || user.code;
    const userId = user.sub;
    const groupId = user.groupId;
    if (scope === "ALL") {
        return { clientCode };
    } else if (scope === "OWN") {
        return { userId, clientCode };
    } else if (scope === "GROUP") {
        return { groupId, clientCode };
    } else {
        return null;
    }
}

function createIdentification(user) {
    const clientCode = user.clientCode || user.code;
    const userId = user.sub;
    const groupId = user.groupId;
    return {
        userId,
        clientCode,
        groupId,
    };
}

exports.scopeToWhere = scopeToWhere;
exports.createIdentification = createIdentification;