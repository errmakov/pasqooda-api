const axios = require('axios');

let helpers = {
  
    
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    },

    convertDate(date, isTime=false, style='dotted') {
        let result = '';
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let mins = date.getMinutes();
        let secs = date.getSeconds();
    
        day = day.toString().padStart(2,'0');
        month = month.toString().padStart(2,'0');
        hours = hours.toString().padStart(2,'0');
        mins = mins.toString().padStart(2,'0');
        secs = secs.toString().padStart(2,'0');
    
        if (style === 'dotted') {
            result = day + '.' + month + '.' + year;
        } else {
            result = year + '-' + month + '-' + day;
        }
    
        if (isTime) {
            if (style === 'dotted') {
                result += ' ' + hours + ':' + mins + ':' + secs;
            } else {
                result += '-' + hours + '-' + mins + '-' + secs;
            }
          
        }
        return result;
    },

    prepareBuyerNotice(){
        let result = '';
        
        result = 'Ваше заявление готово!\n\n Теперь его нужно распечатать, подписать и отправить в арбитражный суд. \n\n --\n С любовью к вашим долгам, Паскуда';
        
        return result;
    },

    /**
     * Returns string with notification for buyer with order number and pay confirmation ling

     * @param  {object} noticeData Object {orderID: "string with order id", url: "string with url to confirm (make finalisation) of payment"}
     * @returns {string} Body of notification
     */
    preparePaylinkNotice(noticeData){
        let result = '';
        
        result = 'Ваше заявление на банкротство почти готово. Осталось только оплатить. \nНомер заказа: ' + noticeData.orderID + '\nСсылка на оплату: ' + noticeData.url + '\nЕсли что-то пойдет не так - дайте нам знать ответным письмом.\n\n --\n С любовью к вашим долгам, Паскуда';
        
        return result;
    },

    prepareNotice(src) {
        let result = '';
        //console.log(src);
        
        result+=src.registration.contact_name_second + ' ' + src.registration.contact_name_name + ' ' + src.registration.contact_name_middle;
    
        result+="\r\n\r\n";

        result+='Контакты: ' + src.registration.contact_phone + ' ' + src.registration.contact_email;

        result+="\r\n\r\n";

        result+='Паспорт ' + src.registration.pass_number + ' ' + 'выдан ' +  src.registration.pass_date + ' ' + src.registration.pass_emitter;

        result+="\r\n\r\n";

        result+='Кредиторы\r\n';
        let items = src.creditors;
        for (let i in items) {
            let num = parseFloat(i)+1;
            result+=num + '. ';
            result+=(items[i].legalForm==='legal') ? 'Юрлицо ' : 'Физлицо ';

            result+=items[i].name;

            result+="\r\n";

            result+='Контакты: ' + items[i].email + ' ' + items[i].phone;

            result+="\r\n";
            let docDate = new Date(Date.parse(items[i].document.date));
            result+="Документ: " + items[i].document.name + ' ' + items[i].document.number + ' от ' + helpers.convertDate(docDate);

            result+="\r\n";

            result+='Кредит: ' + items[i].credit + '\r\n';
            result+='Проценты: ' + items[i].interest + '\r\n';
            result+='Штрафы: ' + items[i].penalties;

            result+='\r\n\r\n';
        };

        if(src.registration.hasUnpayTaxes == 'yes') {
            result+='Неоплаченные налоги\r\n';
            let items = src.taxes;
            for (let i in items) {
                let num = parseFloat(i)+1;
                result+= 'Налог №' + num + '\r\nСумма: ' + items[i].amount;
                result+= items[i].fine!==null ? ' Штраф: ' + items[i].fine : '';
                result+= items[i].peny!==null ? ' Пени: ' + items[i].peny + '\r\n' : '\r\n';
                
                result+= items[i].requisites!==null ? 'Реквизиты: \r\n' + items[i].requisites : '';

                result+= '\r\n\r\n';


            }
        } else {
            result+='Неоплаченные налоги: нет\r\n\r\n';
        };

        if(src.registration.hasPenalties == 'yes') {
            result+='Неоплаченные штрафы\r\n';
            let items = src.penalties;
            for (let i in items) {
                let num = parseFloat(i)+1;
                result+= 'Штраф №' + num + '\r\nСумма: ' + items[i].amount + '\r\n';
                
                result+= items[i].requisites!==null ? 'Реквизиты: \r\n' + items[i].requisites : '';
                result+= '\r\n\r\n';    
            }
        } else {
            result+='Неоплаченные штрафы: нет\r\n\r\n';
        };

        if(src.registration.hasRealty == 'yes') {
            result+='Недвижимость\r\n';
            let items = src.realty;
            for (let i in items) {
                let num = parseFloat(i)+1;
                result+= num + '. ' + items[i].name;

                result+= items[i].square!==null ? ', площадь ' + items[i].square + '\r\n' : '\r\n';
                
                result+= items[i].price!==null ? 'Цена: ' + items[i].price + '\r\n' : '';

                result+= items[i].cadastral!==null ? 'Кадастровый номер: ' + items[i].cadastral + '\r\n' : '\r\n';

                result+= items[i].address!==null ? 'Адрес: ' + items[i].address : '';
                result+= '\r\n\r\n';
            }
        } else {
            result+='Недвижимость: нет\r\n';
        };

        if(src.registration.hasMovables == 'yes') {
            result+='Движимое имущество\r\n';
            let items = src.movable;
            for (let i in items) {
                let num = parseFloat(i)+1;
                result+= num + '. ' + items[i].name + '\r\n';

                result+= items[i].vin!==null ? 'VIN: ' + items[i].vin + '\r\n' : '';
                
                result+= items[i].price!==null ? 'Цена: ' + items[i].price + '\r\n' : '';

                result+= '\r\n';
            }
        } else {
            result+='Движимое имущество: нет\r\n';
        }


        if(src.registration.hasDebitors == 'yes') {
            result+='Должники\r\n'
            let items = src.debitors;
            for (let i in items) {
                let num = parseFloat(i)+1;
                result+=num + '. ';
                result+=(items[i].legalForm==='legal') ? 'Юрлицо ' : 'Физлицо ';
    
                result+=items[i].name;
    
                result+="\r\n";
    
                result+='Контакты: '; 
                result+= items[i].email!==null ? items[i].email : '';
                
                result+= items[i].phone!==null ? items[i].phone : '';
                
    
                result+="\r\n";
                let docDate = new Date(Date.parse(items[i].document.date));
                result+="Документ: " + items[i].document.name + ' ' + items[i].document.number + ' от ' helpers.convertDate(docDate);

                result+="\r\n";
    
                result+='Долг: ' + items[i].credit + '\r\n';
                result+='Проценты: ' + items[i].interest + '\r\n';
                result+='Штрафы: ' + items[i].penalties;
    
                result+='\r\n\r\n';
            }                
        } 
        result += '\n\nФайл: ' + src.filename;
        //console.log(result);
        return result;
    },

    
    /**
     * Return char from russian alphabet by it's index
     * @param  {number} i Index of alphabet char
     * @returns {string} Char of russian alphabet
     */
    abcList(i)  {
        let abc = 'абвгдежзиклмнопрстуфхцшщэюя';
        return abc[i];
    },

    /**
     * Return count of elements of array, that less then given number
     * @param  {number} src Given number
     * @param  {array} numSet Array with numbers
     * @returns {number}
     */
    minSum(src, numSet)  {
        result = 0;
        for (let i in numSet) {
            result += numSet[i] < src ? 1 : 0;
        };
        return result;
    },

    /**
     * Returns arbitration court 
     * Makes api call to DADATA suggestion API (more details https://dadata.ru/api/suggest/address/), then makes mapping
     * @param  {string} address Address of registration (from the passport)
     * @returns {string} Court name
     */
    getJurisdiction(address)  {
        return new Promise((resolve, reject)=>{
            result = '';
            if (address === '') resolve('');
            let regions = {
                'Москва': 'города Москвы', 
                'Московская': 'Московской области', 
                'Адыгея': 'Республики Адыгея', 
                'Алтай': 'Республики Алтай', 
                'Башкортостан': 'Республики Башкортостан',
                'Бурятия': 'Республики Бурятия',
                'Дагестан': 'Республики Дагестан',
                'Ингушетия': 'Республики Ингушетия',
                'Кабардино-Балкарская': 'Кабардино-Балкарской Республики',
                'Калмыкия': 'Республики Калмыкия',
                'Карачаево-Черкесская': 'Карачаево-Черкесской Республики',
                'Карелия': 'Республики Карелия',
                'Крым': 'Республики Крым',
                'Марий Эл': 'Республики Марий Эл',
                'Мордовия': 'Республики Мордовия',
                'Саха /Якутия/': 'Республики Саха (Якутия)',
                'Северная Осетия - Алания': 'Республики Северная Осетия — Алания',
                'Татарстан': 'Республики Татарстан',
                'Тыва': 'Республики Тыва',
                'Удмуртская': 'Удмуртской Республики',
                'Хакасия': 'Республики Хакасия',
                'Чеченская': 'Чеченской Республики',
                'Чувашская республика': 'Чувашской Республики - Чувашии',
                'Алтайский': 'Алтайского края',
                'Забайкальский': 'Забайкальского края',
                'Камчатский': 'Камчатского края',
                'Краснодарский': 'Краснодарского края',
                'Красноярский': 'Красноярского края',
                'Пермский': 'Пермского края',
                'Приморский': 'Приморского края',
                'Ставропольский': 'Ставропольского края',
                'Хабаровский': 'Хабаровского края',
                'Амурская': 'Амурской области',
                'Архангельская': 'Архангельской области',
                'Ненецкий': 'Архангельской области',
                'Астраханская': 'Астраханской области',
                'Белгородская': 'Белгородской области',
                'Брянская': 'Брянской области',
                'Владимирская': 'Владимирской области',
                'Волгоградская': 'Волгоградской области',
                'Вологодская': 'Вологодской области',
                'Воронежская': 'Воронежской области',
                'Ивановская': 'Ивановской области',
                'Иркутская': 'Иркутской области',
                'Калининградская': 'Калининградской области',
                'Калужская': 'Калужской области',
                'Кемеровская область - Кузбасс': 'Кемеровской области',
                'Кировская': 'Кировской области',
                'Костромская': 'Костромской области',
                'Курганская': 'Курганской области',
                'Курская': 'Курской области',
                'Санкт-Петербург': 'Санкт-Петербурга и Ленинградской области',
                'Ленинградская': 'Санкт-Петербурга и Ленинградской области',
                'Севастополь': 'города Севастополя',
                'Липецкая': 'Липецкой области',
                'Магаданская': 'Магаданской области',
                'Мурманская': 'Мурманской области',
                'Новгородская': 'Новгородской области',
                'Новосибирская': 'Новосибирской области',
                'Омская': 'Омской области',
                'Оренбургская': 'Оренбургской области',
                'Орловская': 'Орловской области',
                'Пензенская': 'Пензенской области',
                'Псковская': 'Псковской области',
                'Ростовская': 'Ростовской области',
                'Рязанская': 'Рязанской области',
                'Самарская': 'Самарской области',
                'Саратовская': 'Саратовской области',
                'Свердловская': 'Свердловской области',
                'Смоленская': 'Смоленской области',
                'Тамбовская': 'Тамбовской области',
                'Тверская': 'Тверской области',
                'Тульская': 'Тульской области',
                'Тюменская': 'Тюменской области',
                'Ямало-Ненецкий': 'Ямало-Ненецкого автономного округа',
                'Ханты-Мансийский Автономный округ - Югра': 'Ханты-Мансийского автономного округа — Югры',
                'Ульяновская': 'Ульяновской области',
                'Челябинская': 'Челябинской области',
                'Ярославская': 'Ярославской области',
                'Еврейская': 'Еврейской автономной области',
                'Чукотский': 'Чукотского автономного округа',
                
                

            }
            axios.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', { "query": address, "count": 1 }, {headers:{"Content-Type": "application/json", "Authorization": "Token e37030a8cc1174fcb954f1f5067a2a899d9abedb"}})
            .then((resp)=>{
                //console.log(resp.data.suggestions);
                if (resp.data.suggestions[0]) {
                    let region = resp.data.suggestions[0].data.region;
                    let jurisdiction = regions[region];
                    if (!jurisdiction) {
                        jurisdiction = resp.data.suggestions[0].data.region;
                        console.log('Key not found: ', region);
                    }
                    resolve(jurisdiction);
                } else {
                    resolve('');
                    console.log('No suggestions found for address: ', address);
                    console.log('Suggest: ', resp.data.suggestions);
                }
            })
            .catch((err)=>{
                console.log('Catch axios err: ', err);
                reject(err);
            })
        })
    }
    
}

module.exports = {helpers}
  