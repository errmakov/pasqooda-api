let helpers = {
    convertDate(date, isTime) {
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
      
        //let result = day + '.' + month + '.' + year;
        let result = year  + '-' + month + '-' + day;
      
        if (isTime) {
          //result += ' ' + hours + ':' + mins + ':' + secs;
          result += '-' + hours + '-' + mins + '-' + secs;
        }
      
        return result;
    },
    
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    },

    convertDate(date, isTime) {
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
    
        let result = day + '.' + month + '.' + year;
    
        if (isTime) {
          result += ' ' + hours + ':' + mins + ':' + secs;
        }
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

            result+="Документ: " + items[i].document;

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
        }

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

                result+="Документ: " + items[i].document;

                result+="\r\n";
    
                result+='Долг: ' + items[i].credit + '\r\n';
                result+='Проценты: ' + items[i].interest + '\r\n';
                result+='Штрафы: ' + items[i].penalties;
    
                result+='\r\n\r\n';
            }                
        } 

        //console.log(result);
        return result;
    }
    
}

module.exports = {helpers}
  