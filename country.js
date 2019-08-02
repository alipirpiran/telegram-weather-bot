import fs from 'fs';


let allData;

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

readFile();
