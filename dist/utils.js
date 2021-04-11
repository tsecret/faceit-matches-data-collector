"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListFromFirestore = exports.getUsersFromMatch = exports.addUsersToSettings = exports.now = void 0;
const now = () => new Date().getTime();
exports.now = now;
const addUsersToSettings = (users, settings) => {
    const ids = settings.restrictions.map((user) => user.value);
    users.forEach(userID => { if (!ids.includes(userID))
        settings.restrictions.push({ type: "user", value: userID }); });
    return settings;
};
exports.addUsersToSettings = addUsersToSettings;
const getUsersFromMatch = (match) => {
    let users = [];
    try {
        if (match.teams) {
            for (const i in match.teams) {
                users.push(...match.teams[i].roster.map(user => user.id));
            }
        }
    }
    catch (err) {
        console.log(`Match ${match.id} error - ${err}`);
    }
    return users;
};
exports.getUsersFromMatch = getUsersFromMatch;
const getListFromFirestore = (snapshot) => {
    let items = [];
    snapshot.forEach((doc) => { items.push(doc.data()); });
    return items;
};
exports.getListFromFirestore = getListFromFirestore;
