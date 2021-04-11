import { Settings, Player, Match } from './types';

export const now = () => new Date().getTime();

export const addUsersToSettings = (users: Player[], settings: Settings) => {    
    const ids = settings.restrictions.map((user: any) => user.value)
    users.forEach(userID => { if(!ids.includes(userID)) settings.restrictions.push({ type: "user", value: userID }) })
    return settings;
}

export const getUsersFromMatch = (match: Match) => {
    let users = [];
    try{
        if(match.teams){
            for(const i in match.teams){
                users.push(...match.teams[i].roster.map(user => user.id))
            }
        }
    } catch(err){
        console.log(`Match ${match.id} error - ${err}`)
    }
    return users;
}

export const getListFromFirestore = (snapshot: any) => {
    let items: any = [];
    snapshot.forEach((doc: any) => { items.push(doc.data()) })
    return items;
}