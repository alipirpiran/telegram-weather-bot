export const info = `
ربات اعلام وضعیت هوا
<a href='https://openweathermap.org'>openweathermap</a> قدرت گرفته از
سازنده : @mralpr
`;

export const help = `
انتخاب شهر :‌ /setCity
`

export const mainMenuText = (cityName, username) => {
    return `
    کاربر : ${username}
    شهر شما : ${cityName ? cityName : 'انتخاب نشده'}
`
}

export const weather = (time, temp, wind_speed) => {

    return `
    وضعیت آب و هوا

ساعت : ${time}
------------------
- دما : ${temp}
- سرعت باد : ${wind_speed}

`
}