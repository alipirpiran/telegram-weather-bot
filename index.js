require('dotenv').config();

import TelegramBot from 'node-telegram-bot-api';
const {getWeather} = require('./api/getWeather');
const {getAllCities, getCityName, cities} = require('./country');
const {createBtn, loadUsersData, isNewUser, getUser,createQuery} = require('./funcs');
const {addNewUser, getAllUsers} = require('./datas/api');
const {help, info, mainMenuText} = require('./templates/');

class User {
    constructor(){
        this.username;
        this.chat_id;
        this.city_code = -1;
    }
}
let users = getAllUsers();


const TOKEN = process.env.TOKEN;
let bot = new TelegramBot(TOKEN, {
    polling : true
});


console.log('all users : ', users);

const callback = {
    CHOOSE_CITY : 'chooseCity',
    CHOOSED: 'choosed'
}

const forms = {
    mainMenu : (cityName, entryMessageID) => {
        return  {
                inline_keyboard : [
                    [createBtn(`${cityName ? cityName : 'انتخاب شهر'}`, createQuery(entryMessageID,callback.CHOOSE_CITY))]
                ]
            
        }
    },
    chooseCity : (entryMessageId) => {
        let list = [];
        for(let city of cities){
            list.push([createBtn(city.name, createQuery(entryMessageId,callback.CHOOSED ))]);
        }
        console.log(list);
        
        return {
            
                inline_keyboard : 
                    list
            
        }
    }
}

bot.onText(/\/start/, msg => {
    let chatId = msg.chat.id;
    let name = msg.from.first_name;

    if(isNewUser(chatId, users)){
        let user = new User();
        user.chat_id = chatId;
        user.username = msg.from.username;

        addNewUser(user);
        users.push(user);
    }
    let user = getUser(chatId, users);

    showMainMenu(chatId,name, user.city_code);
})
bot.on('callback_query', msg => {
    console.log(msg);
    let chatId = msg.message.chat.id;
    let data = JSON.parse(msg.data);

    if(data.type === callback.CHOOSE_CITY){
        showChooseMenu(chatId, msg.message.message_id);
    }
})
function showMainMenu(chatId, username, cityCode){
    bot.sendMessage(chatId,mainMenuText(getCityName(cityCode), username), {
        reply_markup : forms.mainMenu(getCityName(cityCode))
    } );
}

function showChooseMenu(chatId, entryMessageID){
    let messageText = 'شهر خود را انتخاب کنید';
    // bot.sendMessage(chatId,'شهر خود را انتخاب کنید' ,forms.chooseCity(entryMessageID));

    bot.editMessageText(messageText, {
        chat_id : chatId, 
        message_id : entryMessageID,
        reply_markup : forms.chooseCity(entryMessageID)
    })
}
// getWeather(2172797, data => {
//     console.log(data)
// });






