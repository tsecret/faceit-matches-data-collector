const addUsersToSettings = (users, settings) => {    
    const ids = settings.restrictions.map(user => user.value)
    users.forEach(userID => { if(!ids.includes(userID)) settings.restrictions.push({ type: "user", value: userID }) })
    return settings;
}

const getUsersFromMatch = (match) => {
    let users = [];
    if(match.teams){
        for(i in match.teams){
            users.push(...match.teams[i].roster.map(user => user.id))
        }
    }
    return users;
}

module.exports = {
    addUsersToSettings,
    getUsersFromMatch
}