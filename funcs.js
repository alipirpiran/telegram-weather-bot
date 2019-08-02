const fs = require('fs');

class Query {
    constructor(entryMessageID, type){
        this.entryMessageID = entryMessageID;
        this.type = type;
    }
}

export const createQuery = (entryMessageID, type) => {
    let q = new Query(entryMessageID, type);
    return JSON.stringify(q);
}

export const createBtn = (text,data) => {
    return {
        text,
        callback_data:data
    }
}

export const isNewUser = (chat_id, allUsers) => {
    for (const item of allUsers) {
        if(item.chat_id === chat_id)
            return false;
    }
    return true;
}

export const getUser = (chat_id, allUsers)=>{
    for (const item of allUsers) {
        if(item.chat_id === chat_id)
        return item;
    }
    return null;
}

