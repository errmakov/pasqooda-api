const DIR = __dirname;
const helpers = require(DIR + '/helpers').helpers;
const PDFDocument = require('pdfkit');
const fs = require('fs');
let petrovich = require('petrovich');
const { resolve } = require('path');
let rubles = require('rubles').rubles;



class PdfGenerator {
    constructor(options) {
      this._data = options.data;
      this._filename = options.filename;
      this._pdf = {};
      this._pdf.fontSize = 10;
      this._taxesTotal = this.taxesTotal();
      this._taxesTotalString = this.sumToString(this._taxesTotal);
      this._penaltiesTotal = this.penaltiesTotal();
      this._penaltiesTotalString = this.sumToString(this._penaltiesTotal);
      this._creditTotal = this.creditTotal();
      this._creditTotalString = this.sumToString(this._creditTotal);
      this._debitTotal = this.debitTotal();
      this._debitorGap = parseFloat(this._creditTotal - this._debitTotal);
      this._debitorGapString = this.sumToString(this._debitorGap);
      this._globalNum = 0;
      this._globalPropNum = 0;
      this._court = '';
    }

    /**
     * Prepare credit analysis section of PDF based on data object passed into constructor
     * @returns {string}
     */
    creditAnalysis() {
      let creditSet = [];
      let result = '';
      for (let i in this._data.creditors) {
        let creditor = this._data.creditors[i];
        let creditorTotal = parseFloat(creditor.credit) + parseFloat(creditor.interest) + parseFloat(creditor.penalties);
        creditSet[i] = creditorTotal;
      };
      let satisfactionCount = helpers.minSum(this._debitTotal, creditSet);
      if (satisfactionCount === 0) return result;
      if (satisfactionCount === 1) {
        result = 'Удовлетворение требований одного из кредиторов приведет к невозможности исполнения должником денежных обязательств и (или) обязанности по уплате обязательных платежей в полном объеме перед другими кредиторами.';
      } else if (satisfactionCount > 1) {
        result = 'Удовлетворение требований нескольких кредиторов приведет к невозможности исполнения должником денежных обязательств и (или) обязанности по уплате обязательных платежей в полном объеме перед другими кредиторами.';
      };

      return result;
    }

    
    creditors(creditor) {
      let result = '';
      
        for (let i in creditor) {
          let num = parseInt(i) + 1;
          result += 'Кредитор ' + num + ': ' + creditor[i].name + '\n' +
          'адрес: ' + creditor[i].address + '\n' +
          'телефон: ' + creditor[i].phone + '\n' +
          'адрес электронной почты: ' + creditor[i].email + '\n\n'
        };
      
      //console.log(result);
      return result;
    } 
    
    creditorsDetailed() {
      let result = '';
      let li = 0;
      
        for (let i in this._data.creditors) {
          let creditor = this._data.creditors[i]
          let num = parseInt(i) + 1;
          let totalCreditorSum = parseFloat(creditor.credit) + parseFloat(creditor.penalties) + parseFloat(creditor.interest);
          result += (li + num) + '. Неспособность удовлетворить требования кредитора ' + num + ' по денежным обязательствам в сумме ' + totalCreditorSum.toFixed(2) + ' ' + this.sumToString(totalCreditorSum) + ', вытекающим из ' + creditor.document + '\n';
          this._globalNum = (li + num);
        };
      //console.log(result);
      return result;
    } 
    
    /**
     * Prepare debitors section of PDF based on data object passed into constructor
     * @returns {string}
     */
    debitorsDetailed() {
      let result = '';
      let propLi = 0;
      if (this._data.registration.hasDebitors === 'yes') {
        this._globalPropNum += 1;
        result += '\n' + parseInt(this._globalPropNum) + '. Дебиторская задолженность: \n';
        for (let i in this._data.debitors) {
          let debitor = this._data.debitors[i];
          let debt = parseInt(debitor.credit) + parseInt(debitor.interest) + parseInt(debitor.penalties);
          result += helpers.abcList(i) + ') Должник ' + debitor.name;
          result += ', задолженность в размере ' + debt + ' ' + this.sumToString(debt) + ' включая сумму основного долга, процентов и штрафов';
          result += ((debitor.document !== '') && (debitor.document !== null)) ? ', вытекающая из ' + debitor.document + '.': '.';
          result += '\n'
        }
      }
      //console.log(result);
      return result;
    };
    
    /**
     * Calculate total debit sum based on data object passed into constructor
     * @returns {number}
     */
    debitTotal() {
      let result = 0;
      if (this._data.registration.hasDebitors === 'yes') {
        for (let i in this._data.debitors) {
          result += parseFloat(this._data.debitors[i].credit) + parseFloat(this._data.debitors[i].interest) + parseFloat(this._data.debitors[i].penalties);
        }
      }

      if (this._data.registration.hasRealty === 'yes') {
        for (let i in this._data.realty) {
          result += parseFloat(this._data.realty[i].price);
        }
      }
      
      if (this._data.registration.hasMovables === 'yes') {
        for (let i in this._data.movable) {
          result += parseFloat(this._data.movable[i].price);
        }
      }

      return result;
    }
    


    /**
     * Prepare movables section of PDF based on data object passed into constructor
     * @returns {string}
     */
    movablesDetailed() {
      let result = '';
      if (this._data.registration.hasMovables !== 'yes')  return result;
      
      for (let i in this._data.movable) {
        let movable = this._data.movable[i];
        //console.log(realty);
        //result += helpers.abcList(i) + '. ';
        result += movable.name !== '' ? movable.name + ', ' : '';
        result += (movable.vin !== '') && (movable.vin!==null) ? 'VIN ' + movable.vin + ', ': '';
        result += movable.price !== '' ? 'стоимость ' + movable.price : '';
        result += '; ';
      };

      return result;
    } 

    /**
     * Prepare penalties section of PDF based on data object passed into constructor
     * @returns {string}
     */
    penaltiesDetailed() {
      let result = '';
      if (this._penaltiesTotal === 0) return result;

      this._globalNum+=1;
      result = this._globalNum + '. Административные штрафы и установленные уголовным законодательством штрафы в сумме ' + this._penaltiesTotal + ' ' + this._penaltiesTotalString + '.';
      //console.log(result);
      return result;
    } 

    /**
     * Prepare property section of PDF based on data object passed into constructor
     * @returns {string}
     */
    propertyDetailed() {
      let result = '';
      let propLi = 0;
      
      if ((this._data.registration.hasRealty === 'yes') || (this._data.registration.hasMovables === 'yes')) {
        this._globalPropNum += 1;
        result = '\nВ настоящее время у должника имеется следующее имущество, в том числе платежные средства';
        result += this._data.registration.hasDebitors === 'yes' ? ' и дебиторская задолженность:' : ':';
        result += '\n' + parseInt(this._globalPropNum) + '. Имущество: \n';
        
        let realty = this.realtyDetailed();
        if (realty!=='') {
          result += helpers.abcList(propLi) + ') недвижимое имущество: ' + realty;
          result +='\n'
          propLi+=1;
        };

        let movables = this.movablesDetailed();
        if (movables!=='') {
          result += helpers.abcList(propLi) + ') движимое имущество: ' + movables;
          result +='\n';
          propLi+=1;
        }
        
      }
      //console.log(result);
      return result;
    } 

    

    /**
     * Prepare realty section of PDF based on data object passed into constructor
     * @returns {string}
     */
    realtyDetailed() {
      let result = '';
      if (this._data.registration.hasRealty !== 'yes')  return result;
      
      for (let i in this._data.realty) {
        let realty = this._data.realty[i];
        //console.log(realty);
        //result += helpers.abcList(i) + '. ';
        result += realty.name !== '' ? realty.name: '';
        result += result !== '' ? ', ' : ''
        result += realty.cadastral !== '' ? 'кадастровый номер ' + realty.cadastral: '';
        result += result !== '' ? ', ' : '';
        result += realty.square !== '' ? 'площадь ' + realty.square  + ' кв. м.': '';
        result += result !== '' ? ', ' : '';
        result += realty.address !== '' ? 'адрес: ' + realty.address : '';
        result += result !== '' ? ', ' : '';
        result += realty.price !== '' ? 'стоимость ' + realty.price : '';
        result += '; ';
      };
//      console.log(result);
      return result;
    } 

    
    
    taxesDetailed() {
      let result = '';
      if (this._taxesTotal === 0) return result;

      this._globalNum+=1;
      result = this._globalNum + '. Обязательства по уплате обязательных платежей в сумме ' + this._taxesTotal + ' ' + this._taxesTotalString + '. Реестр недоимок, пени, штрафов прилагается.';
      //console.log(result);
      return result;
    } 

    /**
    * Inflect given name
    * See petrovich.js for more details.
    * @param {object} person  Object contains name {last: 'Doe', first: 'John', middle: 'Foo', gender: 'male'} 
    * @param {string} to Case. One of: nominative, genitive, dative, accusative, instrumental, prepositional.
    */
    inflect(person, to = 'dative') {
      let fullname = '';
      try {
        let result = petrovich(person, to);
        fullname = result.last + ' ' + result.first;
        fullname += (result.middle!=='') ? ' ' + result.middle : '';
        
      } catch (e) {
        console.log(e);
      }
      return fullname;
    }

    /**
    * Format passport number: 1234123456 => 1234 N 123456
    * @param {string} number - number of passport 
    * @returns {string}
    */
    passport(number) {
      return number.substring(0,4) + ' N ' + number.substring(4);
    }

    /**
    * Calculate total sum of total debt to creditors (includes credits, taxes, fines and so on), passed into constructor
    * @return {number}
    */
    creditTotal() {
      let sumCreditor = 0;
      let sumPenalties = this._penaltiesTotal;;
      let sumTaxes = this._taxesTotal;
      for (let i in this._data.creditors) {
        sumCreditor+=parseFloat(this._data.creditors[i].credit) + parseFloat(this._data.creditors[i].interest) + parseFloat(this._data.creditors[i].penalties);
      };
      
      
      let result = sumCreditor + sumPenalties + sumTaxes;
      //console.log(typeof(result.toFixed(2)))
      return result;
    }
    /**
    * Calculate total sum of penalties passed into constructor
    * @return {number}
    */
   penaltiesTotal() {
    let sumPenalties = 0;
    if (this._data.registration.hasPenalties == 'no') return sumPenalties;

    for (let i in this._data.penalties) {
      sumPenalties+=parseFloat(this._data.penalties[i].amount);
    };
    //console.log(typeof(result.toFixed(2)))
    //console.log('sumPenalties: ', sumPenalties);
    return sumPenalties;
  }

    /**
    * Calculate total sum of taxes passed into constructor
    * @return {number}
    */
   taxesTotal() {
    let sumTaxes = 0;
    if (this._data.registration.hasUnpayTaxes == 'no') return sumTaxes;

    for (let i in this._data.taxes) {
      sumTaxes+=parseFloat(this._data.taxes[i].amount) + parseFloat(this._data.taxes[i].fine) + parseFloat(this._data.taxes[i].peny);
    };
    //console.log(typeof(result.toFixed(2)))
    //console.log('sumTaxes: ', sumTaxes);
    return sumTaxes;
  }
    
    /**
    * Convert sum to string in Russian with formatting for PDF: 1524.78 => (одна тысяча пятьсот двадцать четыре) рубля 78 копеек
    * @param {number} sum - Sum to convert
    * @returns {string}
    */
    sumToString(sum) {
      
      if (sum === 0) return false;
      if (sum < 0) sum = sum * (-1);
      
      let str =  rubles(sum);
    
      let i = str.indexOf('руб');
      
      let result = '(' + str.substring(0,(i-1)) + ')' + str.substring(i-1);
      return result;
    }


    dateToString(date) {
      let months = {
        1: 'Января',
        2: 'Февраля',
        3: 'Марта',
        4: 'Апреля',
        5: 'Мая',
        6: 'Июня',
        7: 'Июля',
        8: 'Августа',
        9: 'Сентября',
        10: 'Октября',
        11: 'Ноября',
        12: 'Декабря',
      }
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      day = day.toString().padStart(2,'0');
      

      let result = '"' + day + '" ' + months[month] + ' ' + year + ' г.';
      return result;
    }

    /**
    * Return jurisdiction (court name) for given registration address (passed into constructor)
    * 
    * @returns {Promise}
    */
    getCourt() {
      return new Promise((resolve,reject)=>{
        console.log('Getting court for: ', this._data.registration.regadress);        
        helpers.getJurisdiction(this._data.registration.regadress)
        .then((res)=>{
          this._court = res;
          resolve(res);
        })
      })
      
    }

    generate(court) {
      
      return new Promise((resolve,reject)=>{
        const doc = new PDFDocument({
          size: 'A4',
          margins: {top:72, bottom:72, left: 36, right:36}, 
          info: {
            Title:'Заявление на банкроство физлица ' + helpers.getRandomInt(1000), 
            Author:'Pasqooda Robot', 
            Subject:'Банкротство физлица', 
            Keywords: 'заявление, банкротство, долг'
          }
        });
        let pdfFileName = DIR + '/userfiles/' +  this._filename + '.pdf';
        //let pdfFileName = DIR + '/userfiles/output.pdf';
        try {
          let person = {
            first: this._data.registration.contact_name_name,
            middle: this._data.registration.contact_name_middle,
            last: this._data.registration.contact_name_second,
            gender: this._data.registration.contact_name_gender
          }
          doc.pipe(fs.createWriteStream(pdfFileName));
          doc
          .fontSize(this._pdf.fontSize)
          .font(DIR + '/fonts/Roboto-Regular.ttf')
          .text(
          'В Арбитражный суд ' + this._court + '\n' +
          'Должник: ' + this._data.registration.contact_name_second + ' ' + this._data.registration.contact_name_name + ' ' + this._data.registration.contact_name_middle +  '\n' +
          'адрес: ' + this._data.registration.regadress + ',\n' +
          'телефон: ' + this._data.registration.contact_phone + ',\n' +
          'адрес электронной почты: ' + this._data.registration.contact_email + ',\n\n' +
          
          this.creditors(this._data.creditors) + 
          'Госпошлина: ____________________________________________\n'
          , 250,36)
          .font(DIR + '/fonts/Roboto-Bold.ttf')
          .text('\n\nЗаявление\n о признании банкротом\n\n', 72, undefined, {align: 'center'})
          .font(DIR + '/fonts/Roboto-Regular.ttf')
          .text('По состоянию на ' + this.dateToString(new Date()) + ' размер требований, предъявленных к гражданину Российской Федерации ' + this.inflect(person) + ', паспорт: ' + this.passport(this._data.registration.pass_number)+ ', выдан ' + this._data.registration.pass_emitter + ' ' + this.dateToString(new Date(this._data.registration.pass_date))+ ', составляет ' + this._creditTotal.toFixed(2) + ' ' + this._creditTotalString + ', в том числе:', 36, undefined, {align: 'left', indent:18})
          
          .text(this.creditorsDetailed(), 36, undefined, {align: 'left', indent:18})
          .text(this.taxesDetailed(), 36, undefined, {align: 'left', indent:18})
          .text(this.penaltiesDetailed(), 36, undefined, {align: 'left', indent:18})
          .text(this.propertyDetailed(), 36, undefined, {align: 'left', indent:18})
          .text(this.debitorsDetailed(), 36, undefined, {align: 'left', indent:18})
          .text('\nФактически, по состоянию на дату подачи заявления, общая сумма долгов должника перед кредиторами, включая задолженность по обязательным платежам, превышает стоимость принадлежащего ему имущества и имущественных прав на ' + this._debitorGap  + ' ' + this._debitorGapString + '.', 36, undefined, {align: 'left', indent:18})
          .text('\n' + this.creditAnalysis(), 36, undefined, {align: 'left', indent:18})
          .text('\nДолжник согласен на привлечение следующих лиц, обеспечивающих исполнение возложенных на финансового управляющего обязанностей:____________________,____________________, ____________________', 36, undefined, {align: 'left', indent:18})
          .text('\nМаксимальный размер осуществляемых за счет заявителя расходов финансового управляющего на оплату услуг привлекаемых лиц составляет 30000 ' + this.sumToString(30000) + '.', 36, undefined, {align: 'left', indent:18})
          .text('\nДенежные средства на выплату на возмещение расходов финансового управляющего на оплату услуг привлекаемых лиц в указанном размере внесены должником в депозит суда. ', 36, undefined, {align: 'left', indent:18})
          .text('\nНа основании вышеизложенного и руководствуясь ст. ст. 213.1-213.4 Федерального закона от 26.10.2002 N 127-ФЗ "О несостоятельности (банкротстве)", ст. ст. 223-224 Арбитражного процессуального кодекса Российской Федерации, прошу: ', 36, undefined, {align: 'left', indent:18})
          .text('\nПризнать гражданина Российской Федерации ' + this.inflect(person, 'genitive') + ', паспорт:' + this.passport(this._data.registration.pass_number)+ ', выдан ' + this._data.registration.pass_emitter + ' ' + this.dateToString(new Date(this._data.registration.pass_date))+ ', несостоятельным(банкротом). ', 36, undefined, {align: 'left', indent:18})
          .text('\nУтвердить финансового управляющего из числа членов Саморегулируемой организации арбитражных управляющих "________________", ОГРН _______, ИНН _______, КПП ______, адрес: _______________________________.', 36, undefined, {align: 'left', indent:18})
          doc.end();
          console.log('Saved: ', pdfFileName);
          resolve(true);
        } catch (e) {
          fs.unlink(pdfFileName, (err) => {
            reject(e);
          });
          reject(e);
        }
        
      })
    }
   
}


module.exports = PdfGenerator;