const fs = require('fs');

let filePath = process.env.DATA_DIR;
let users = {
    allUsers : []
};

setAllUsers();
readFile();


let allData;

// ------------------ CITIES ------------------------

export const getAllCities = countryCode => {
    let list = [];
    return new Promise((resolve, reject) => {
        for (const item of allData) {
            if(item.country === countryCode){
                list.push(item);
            }
        }
        resolve(list);
    })
}
export const cities =  [
    {
        name : 'esfahan',
        code : 418863
    },
    {
        name : 'tehran',
        code : 112931
    }
]

export const getCityName= (cityCode) => {
    for (const city of cities) {
        if(city.code === cityCode) return city.name;
    }
    return undefined;
}
function readFile(){
    let temp = "";
    fs.readFile('./datas/city.json', (err, data) => {
        if(err){
            console.log(err);
        }
        allData = JSON.parse(data); 
    });

}

// ------------------ USERS ------------------------

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