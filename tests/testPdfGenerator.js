const DIR = __dirname;
const config = require(DIR + '/../app/config').config[process.env.NODE_ENV||'dev'];
const mocha = require('mocha');
const chai = require('chai');
chai.use(require("chai-as-promised"));
const assert = chai.assert;
const helpers = require(DIR + '/../app/helpers').helpers;

const PdfGenerator = require(DIR + '/../app/PdfGenerator');


let testSet = [

   {
    input: { registration:
        { contact_name_second: 'Константинов',
          contact_name_name: 'Константин',
          contact_name_middle: 'Константинович',
          pass_number: '3603567805',
          pass_emitter: 'Ленинским РОВД города Константинополя',
          pass_date_menu: false,
          pass_date: '2008-10-08',
          regadress: 'Москва, улица Ленина 5к4',
          contact_email: 'ide404@gmail.com',
          contact_phone: '+79626114494',
          hasPenalties: 'yes',
          hasUnpayTaxes: 'yes',
          hasRealty: 'yes',
          hasMovables: 'yes',
          hasDebitors: 'yes' },
       creditors:
        [ { id: 1591234666740,
            name: 'ПАО Сбербанк',
            legalForm: 'legal',
            address: 'г. Екатеринбург, ул. 100 лет Ильича, 101',
            phone: '8-800-800-800',
            email: 'sberbankfoo@gmail.com',
            credit: '1000000',
            interest: '300000',
            penalties: '200000',
            document: 'Договор займа Сбербанк СБЗМ-01' },
          { id: 1590946793067,
            name: 'ЗАО МТС Банк',
            legalForm: 'legal',
            address: 'Санкт-Петербург, ул. Карла Маркса, 50',
            phone: '8-900-900-900',
            email: 'mtsbankfoo@gmail.com',
            credit: '2000000',
            interest: '800000',
            penalties: '200000',
            document: 'Договор займа МТСБанк МТ-ЗМ-02' } ],
       timestamp: 1590035254585,
       recaptchaToken:
        '03AGdBq26txUgg25G5JhxQopgVlbTeo1AMDZyGbYSHNWkYKlSq8NSQgYi3b7ltdbz5D2K6IYzP65DbkKVxx0knkQOx91Bi3rzfReovg-o35b6hcw-25GPgBjFdL7gd6HJbK36jAGmO_thiohu8kcQDIX66wtXR00pQd5foYNr-8Kx_cdomB3UJmUw9HBzAXgcDicul0nqZrQfgRO4MB-nUgYHpkUJffBcA3RRIW5cNa-72Xn-Ho9I5UcMJDEKYrwrSOwfWRhL376uZy5-jFx87JU3eRNvNRfz_-3XK6ziZoMWI6-NbII89pjB-vWFNO-mvt1adUgHN2yubZvzqA7gUucM5d0d23Kcginr6cLNphNHZtijO-zEXVZEtKVa6XUJ2UzGQ9arg3BHnXxZv7N4MRWY6NtmKSTriND2DFeVnYqnLAYpnYviEwMBn-gO_cCfVZj0rUTCjVTIA',
       debitors:
        [ { id: 1598073943323,
            name: 'Сергеев Константин Робертович',
            legalForm: 'private',
            address: 'Приморский бульвар 5',
            phone: '40-50-60',
            email: null,
            credit: '5000',
            interest: '3000',
            penalties: '2000',
            document: 'Долговая расписка от 21.05.2020' },
          { id: 1591005767353,
            name: 'ООО "Иванов и партнеры"',
            legalForm: 'legal',
            address: 'Новый проезд 8',
            phone: '(495) 540-60-70',
            email: null,
            credit: '15000',
            interest: '4000',
            penalties: '1000',
            document: 'Трудовой договор от 12.04.2018' } ],
       penalties:
        [ { id: 1597928071925,
            requisites: 'Штраф за паркову 001',
            amount: '1500' },
          { id: 1597523231023,
            requisites: 'Штраф за светофор 002',
            amount: '500' } ],
       taxes:
        [ { id: 1599804230020,
            requisites: 'Земельный налог ЗН-01',
            amount: '2500',
            fine: '2000',
            peny: '500' },
          { id: 1594825421355,
            requisites: 'Транспортный налог ТН-01',
            amount: '4000',
            fine: '300',
            peny: '700' } ],
       realty:
        [ { id: 1591205277005,
            name: 'Квартира на Анохина 5к',
            cadastral: 'КДН-001',
            square: '60',
            address: 'Москва, Анохина 5к4, 212',
            price: '1000000' },
          { id: 1595343115265,
            name: 'Домик в деревне',
            cadastral: 'КДН-002',
            square: '44',
            address: 'Ульяновск, Малахитовая,3',
            price: '500000' } ],
       movable:
        [ { id: 1593366488586,
            name: 'Автомобиль VW POLO',
            vin: 'VIN-001',
            price: '300000' },
          { id: 1599725278770,
            name: 'Мотоцикл Suzuki',
            vin: null,
            price: '200000' } ] },
    output: "foo: bar\r\nsome: foobar"
    } 
]

testDateSet = [
  {
    input: {
      year: 2020,
      month: 0, //january
      day: 8
    },
    output: '"08" Января 2020 г.'
  },
  {
    input: {
      year: 2019,
      month: 04, //may
      day: 31
    },
    output:  '"31" Мая 2019 г.'
  }
  
]

nameSet = [
  {
    input: {last: 'Стоянов', first: 'Андрей', middle: 'Владимирович', gender: 'male'},
    output: 'Стоянову Андрею Владимировичу'
  },
  {
    input: {last: 'Кукаев', first: 'Анатолий', middle: '', gender: 'male'},
    output: 'Кукаеву Анатолию'
  }
]

let passportSet = [
  {
    input: '3431545268',
    output: '3431 N 545268'
  },
  {
    input: '5334562182',
    output: '5334 N 562182'
  },
]

let sumSet = [
  {
    input: 1,
    output: '(один) рубль 00 копеек'
  },
  {
    input: 3450,
    output: '(три тысячи четыреста пятьдесят) рублей 00 копеек'
  },
  {
    input: 259376.98,
    output: '(двести пятьдесят девять тысяч триста семьдесят шесть) рублей 98 копеек'
  },]

it("getCourt promise becomes resolved", function() {
    testSet[0].input.regadress = 'Город Тольятти, бульвар Королева дом 9 кв 101'
    let pdfGenerator = new PdfGenerator({data:testSet[0].input});
    return assert.becomes(pdfGenerator.getCourt(), 'Самарской области');

})


it("Generator promise becomes resolved", function() {
    for(let i in testSet) {
      testSet[0].input.regadress = 'Город Тольятти, бульвар Королева дом 9 кв 101';
      let randomID = helpers.getRandomInt(10000);
      let convertDate = helpers.convertDate(new Date(), false, 'dashed');
      console.log('Conv date: ', convertDate);
      let userID = convertDate + '_' + randomID;
      let pdfGenerator = new PdfGenerator({data:testSet[i].input, filename: userID});
      return assert.isFulfilled(pdfGenerator.getCourt().then(()=>{pdfGenerator.generate()}));
    }
})

it("Generate creditors text block", function() {
  for(let i in testSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[i].input});
      assert.isNotEmpty(pdfGenerator.creditors(testSet[i].input.creditors));
  }
})

it("Generate creditors detailed text block", function() {
  for(let i in testSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[i].input});
      assert.isNotEmpty(pdfGenerator.creditorsDetailed());
  }
})

it("Convert Date object to String", function() {
  for(let i in testDateSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      let date = new Date(testDateSet[i].input.year, testDateSet[i].input.month, testDateSet[i].input.day);
      assert.deepEqual(pdfGenerator.dateToString(date), testDateSet[i].output);
  }
})

it("Test Name declension", function() {
  for(let i in nameSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.deepEqual(pdfGenerator.inflect(nameSet[i].input), nameSet[i].output);
  }
})

it("Test passport number formatting", function() {
  for(let i in passportSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.deepEqual(pdfGenerator.passport(passportSet[i].input), passportSet[i].output);
  }
})

it("Test credit total sum larger than 0:", function() {
  for(let i in testSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isAbove(pdfGenerator.creditTotal(), 0);
  }
})



it("Test sum to string", function() {
  for(let i in sumSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.deepEqual(pdfGenerator.sumToString(sumSet[i].input), sumSet[i].output);
  }
})

it("Banrkrupt has taxes and it is larger than 0:", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasUnpayTaxes = "yes"
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isAbove(pdfGenerator.taxesTotal(), 0);
  }
})

it("Banrkrupt has no taxes and taxesTotat() returns 0 :", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasUnpayTaxes = "no"
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.equal(pdfGenerator.taxesTotal(), 0);
  }
})

it("Banrkrupt has taxes and taxesDetailed() is string:", function() {
  for(let i in testSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isString(pdfGenerator.taxesDetailed());
  }
})

it("Banrkrupt has penalties and it is larger than 0:", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasPenalties = "yes"
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isAbove(pdfGenerator.penaltiesTotal(), 0);
  }
})

it("Banrkrupt has no penalties and penaltiesTotat() returns 0 :", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasPenalties = "no"
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.equal(pdfGenerator.penaltiesTotal(), 0);
  }
})

it("Banrkrupt has penalties and penaltiesDetailed() is string:", function() {
  for(let i in testSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isString(pdfGenerator.penaltiesDetailed());
  }
})

it("Banrkrupt has realty and movable and propertyDetailed() is string:", function() {
  for(let i in testSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isString(pdfGenerator.propertyDetailed());
  }
})

it("Banrkrupt has realty and realtyDetailed() is not empty:", function() {
  for(let i in testSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isNotEmpty(pdfGenerator.realtyDetailed());
  }
})

it("Banrkrupt has no realty and realtyDetailed() is empty:", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasRealty = 'no';
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isEmpty(pdfGenerator.realtyDetailed());
  }
})

it("Banrkrupt has movables and movablesDetailed() is not empty:", function() {
  for(let i in testSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isNotEmpty(pdfGenerator.movablesDetailed());
  }
})

it("Banrkrupt has no movables and movablesDetailed() is empty:", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasMovables = 'no';
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isEmpty(pdfGenerator.movablesDetailed());
  }
})

it("Banrkrupt has debitors and debitorsDetailed() is not empty:", function() {
  for(let i in testSet) {
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isNotEmpty(pdfGenerator.debitorsDetailed());
  }
})

it("Banrkrupt has no debitors and debitorsDetailed() is empty:", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasDebitors = 'no';
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isEmpty(pdfGenerator.debitorsDetailed());
  }
})

it("Banrkrupt has debitors and debitTotal() is greater 0:", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasDebitors = 'yes';
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isAbove(pdfGenerator.debitTotal(),0);
  }
})

it("Banrkrupt has no debitors and debitTotal() return 0:", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasDebitors = 'no';
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.deepEqual(pdfGenerator.debitTotal(),0);
  }
})

it("Creditor analysis block. We can pay just one creditor", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasDebitors = 'yes';
      testSet[i].input.registration.hasRealty = 'yes';
      testSet[i].input.registration.hasMovables = 'yes';
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.deepEqual(pdfGenerator.creditAnalysis(), 'Удовлетворение требований одного из кредиторов приведет к невозможности исполнения должником денежных обязательств и (или) обязанности по уплате обязательных платежей в полном объеме перед другими кредиторами.');
  }
})

it("Creditor analysis block. We can pay  two or more creditors", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasDebitors = 'yes';
      testSet[i].input.registration.hasRealty = 'yes';
      testSet[i].input.registration.hasMovables = 'yes';
      testSet[i].input.realty[0].price = '10000000';
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.deepEqual(pdfGenerator.creditAnalysis(), 'Удовлетворение требований нескольких кредиторов приведет к невозможности исполнения должником денежных обязательств и (или) обязанности по уплате обязательных платежей в полном объеме перед другими кредиторами.');
  }
})

it("Creditor analysis block. We can pay nobody", function() {
  for(let i in testSet) {
      testSet[i].input.registration.hasDebitors = 'yes';
      testSet[i].input.registration.hasRealty = 'yes';
      testSet[i].input.registration.hasMovables = 'yes';
      testSet[i].input.realty[0].price = '100';
      testSet[i].input.realty[1].price = '200';
      testSet[i].input.movable[0].price = '100';
      testSet[i].input.movable[1].price = '200';
      testSet[i].input.debitors[0].credit = '100';
      testSet[i].input.debitors[0].interest = '100';
      testSet[i].input.debitors[0].penalties = '100';
      testSet[i].input.debitors[1].credit = '100';
      testSet[i].input.debitors[1].interest = '100';
      testSet[i].input.debitors[1].penalties = '100';
      let pdfGenerator = new PdfGenerator({data:testSet[0].input});
      assert.isEmpty(pdfGenerator.creditAnalysis());
  }
})