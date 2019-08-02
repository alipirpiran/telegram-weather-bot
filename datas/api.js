const fs = require('fs');

let filePath = process.env.DATA_DIR;
let users = {
    allUsers : []
};

setAllUsers();

function setAllUsers() {
    fs.readFile(filePath, (err, data) => {
        if(data.toString()==='')
        return;

        for(const item of JSON.parse(data).allUsers){
            users.allUsers.push(item);
        }


    })
}
export const addNewUser = (user) => {
    console.log(user)
    if(hasUser(user))
    return;

    users.allUsers.push(user);
    writeUsersToFile()
}

function writeUsersToFile(){
    fs.writeFile(filePath, JSON.stringify(users), err => {
        
    });
}

function hasUser(user){
    users.allUsers.forEach(e=>{
        if(e.chat_id === user.chat_id) 
        return true;
    })

    return false;
}

export const getAllUsers = () => {
    return users.allUsers;
}

export const refreshUser = user => {
    users.allUsers.forEach(e => {
        if(e.chat_id === user.chat_id){
            e.city_code = user.city_code;
        }
    })
    writeUsersToFile()

}