require('dotenv').config();

import TelegramBot from 'node-telegram-bot-api';
const {getWeather} = require('./api/getWeather');
const {createBtn, loadUsersData, isNewUser, getUser,createQuery} = require('./funcs');
const {addNewUser, getAllUsers,getAllCities, getCityName, cities} = require('./datas/api');
const api = require('./datas/api')
const templates = require('./templates/');

class User {
    constructor(){
        this.username;
        this.chat_id;
        this.city_code = -1;
    }
}

const TOKEN = process.env.TOKEN;
let bot = new TelegramBot(TOKEN, {
    polling : true
});



const callback = {
    CHOOSE_CITY : 'chooseCity',
    CHOOSED: 'choosed',
    WEATHER : 'weather',
    BACK : 'back'
}

const forms = {
    mainMenu : (cityName, entryMessageID) => {
        return  {
                inline_keyboard : [
                    [createBtn(`${cityName ? cityName : 'انتخاب شهر'}`, createQuery(entryMessageID,callback.CHOOSE_CITY))],
                    [createBtn('وضعیت آب و هوا', createQuery(entryMessageID, callback.WEATHER))]
                ]
            
        }
    },
    chooseCity : (entryMessageId) => {
        let list = [];
        for(let city of cities){
            list.push([createBtn(city.name, createQuery(entryMessageId,callback.CHOOSED,city.code))]);
        }        
        return {
                inline_keyboard :  list
        }
    },
    back : (entryMessageID) => {
        return {
            inline_keyboard : [
                [createBtn('بازگشت', createQuery(entryMessageID, callback.BACK))]
            ]
        }
    }
}

bot.onText(/\/start/, msg => {
    console.log('new Start : ', msg, '--------------');
    let chatId = msg.chat.id;
    let name = msg.from.first_name;

    if(isNewUser(chatId, getAllUsers())){
        let user = new User();
        user.chat_id = chatId;
        user.username = msg.from.username;

        addNewUser(user);
    }
    let user = getUser(chatId, getAllUsers());

    showMainMenu(chatId,name, user.city_code);
});

bot.on('callback_query', msg => {
    let chatId = msg.message.chat.id;
    let user = getUser(chatId, getAllUsers());
    let data = JSON.parse(msg.data);
    let entry = msg.message.message_id;

    if(data.type === callback.CHOOSE_CITY){
        showChooseMenu(chatId, msg.message.message_id);
    }
    if(data.type === callback.CHOOSED){
        let code = data.content;
        
        user.city_code = code;
        api.refreshUser(user);

        showMainMenu(chatId, user.username, code, entry)
    }
    if(data.type === callback.WEATHER){
        if(!user.city_code){
            showChooseMenu(chatId, entry);
            return;
        }

        showWeather(chatId, user.city_code, entry);
    }

    if(data.type === callback.BACK){
        showMainMenu(chatId, user.username, user.city_code, entry);
    }
    bot.answerCallbackQuery(msg.id);
})
function showMainMenu(chatId, username, cityCode, entryMessageID){
    let messageText = templates.mainMenuText(getCityName(cityCode), username);
    if(entryMessageID){
        bot.editMessageText(messageText, {
            chat_id : chatId,
            message_id : entryMessageID,
            reply_markup : forms.mainMenu(getCityName(cityCode))
        })
    }else{
        bot.sendMessage(chatId,messageText, {
        reply_markup : forms.mainMenu(getCityName(cityCode))
    });
    }
}

function showChooseMenu(chatId, entryMessageID){
    let messageText = 'شهر خود را انتخاب کنید';

    bot.editMessageText(messageText, {
        chat_id : chatId, 
        message_id : entryMessageID,
        reply_markup : forms.chooseCity(entryMessageID)
    })
}

function showWeather(chatID, city_code, entryMessageID){
    
    getWeather(city_code, data => {
        let time = 'الان';
        let temp = data.main.temp;
        let wind_speed = data.wind.speed;
        let messageText = templates.weather(time, temp, wind_speed);

        if(entryMessageID){
            bot.editMessageText(messageText, {
                message_id : entryMessageID, 
                chat_id : chatID,
                reply_markup : forms.back(entryMessageID)
            })
        }else{
            bot.sendMessage(chatID, messageText);
        }

    });
    
    
}






