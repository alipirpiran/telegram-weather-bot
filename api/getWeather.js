const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const key = process.env.APIKEY;
export const getWeather = (cityCode, func) => {
    let url = `http://api.openweathermap.org/data/2.5/weather?id=${cityCode}&appid=${key}`;
        sendReq(url).then(e=>{
        let data = JSON.parse(e);
        func(data);
        
    })

}

export const api = process.env.APIKEY;

function sendReq(url){
    return new Promise((resolve, rejects) => {
        let req = new XMLHttpRequest();
        req.open('GET', url);
        req.onreadystatechange = () => {
            if(req.status == 200 && req.readyState == req.DONE){
                resolve(req.responseText);
            }
        }
    
        req.send();
    })
    
}

