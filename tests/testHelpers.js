const DIR = __dirname;
const config = require(DIR + '/../app/config').config[process.env.NODE_ENV||'dev'];
const mocha = require('mocha');
const chai = require('chai');
const assert = chai.assert;
const helpers = require(DIR + '/../app/helpers').helpers;

let testSet = [

   {
    input: { registration:
        { contact_name_second: 'Ермаков',
          contact_name_name: 'Денис',
          contact_name_middle: 'Владимирович',
          pass_number: '3604692805',
          pass_emitter: 'Октябрьским РОВД города Самары',
          pass_date_menu: false,
          pass_date: '2020-05-12',
          regadress: 'Анохина 5к4',
          contact_email: 'ide404@gmail.com',
          contact_phone: '+79626114494',
          hasPenalties: 'yes',
          hasUnpayTaxes: 'yes',
          hasRealty: 'yes',
          hasMovables: 'yes',
          hasDebitors: 'yes' },
       creditors:
        [ { id: 1591234666740,
            name: 'Сбербанк',
            legalForm: 'legal',
            address: 'Ленина, 101',
            phone: '8-800-800-800',
            email: 'sberbankfoo@gmail.com',
            credit: '1000',
            interest: '500',
            penalties: '100',
            document: 'Договор займа Сбербанк СБЗМ-01' },
          { id: 1590946793067,
            name: 'МТС Банк',
            legalForm: 'legal',
            address: 'Маркса, 50',
            phone: '8-900-900-900',
            email: 'mtsbankfoo@gmail.com',
            credit: '5000',
            interest: '300',
            penalties: '100',
            document: 'Договор займа МТСБанк МТ-ЗМ-02' } ],
       timestamp: 1590035254585,
       recaptchaToken:
        '03AGdBq26txUgg25G5JhxQopgVlbTeo1AMDZyGbYSHNWkYKlSq8NSQgYi3b7ltdbz5D2K6IYzP65DbkKVxx0knkQOx91Bi3rzfReovg-o35b6hcw-25GPgBjFdL7gd6HJbK36jAGmO_thiohu8kcQDIX66wtXR00pQd5foYNr-8Kx_cdomB3UJmUw9HBzAXgcDicul0nqZrQfgRO4MB-nUgYHpkUJffBcA3RRIW5cNa-72Xn-Ho9I5UcMJDEKYrwrSOwfWRhL376uZy5-jFx87JU3eRNvNRfz_-3XK6ziZoMWI6-NbII89pjB-vWFNO-mvt1adUgHN2yubZvzqA7gUucM5d0d23Kcginr6cLNphNHZtijO-zEXVZEtKVa6XUJ2UzGQ9arg3BHnXxZv7N4MRWY6NtmKSTriND2DFeVnYqnLAYpnYviEwMBn-gO_cCfVZj0rUTCjVTIA',
       debitors:
        [ { id: 1598073943323,
            name: 'Анатолий',
            legalForm: 'private',
            address: 'Приморский бульвар 5',
            phone: '40-50-60',
            email: null,
            credit: '10000',
            interest: '2000',
            penalties: '1000',
            document: 'Долговая расписка' },
          { id: 1591005767353,
            name: 'ООО "ИТ"',
            legalForm: 'legal',
            address: 'Новый проезд 8',
            phone: '40-60-70',
            email: null,
            credit: '40000',
            interest: '20000',
            penalties: '10000',
            document: 'Трудовой договор' } ],
       penalties:
        [ { id: 1597928071925,
            requisites: 'Штраф за паркову 001',
            amount: '500' },
          { id: 1597523231023,
            requisites: 'Штраф за светофор 002',
            amount: '5000' } ],
       taxes:
        [ { id: 1599804230020,
            requisites: 'Земельный налог ЗН-01',
            amount: '5000',
            fine: '1000',
            peny: '500' },
          { id: 1594825421355,
            requisites: 'Транспортный налог ТН-01',
            amount: '4000',
            fine: '100',
            peny: '50' } ],
       realty:
        [ { id: 1591205277005,
            name: 'Квартира на Анохина 5к',
            cadastral: 'КДН-001',
            square: '60',
            address: 'Москва, Анохина 5к4, 212',
            price: '5000000' },
          { id: 1595343115265,
            name: 'Домик в деревне',
            cadastral: 'КДН-002',
            square: '44',
            address: 'Ульновск, Малахитовая,3',
            price: '1000000' } ],
       movable:
        [ { id: 1593366488586,
            name: 'Автомобиль VW POLO',
            vin: 'VIN-001',
            price: '300000' },
          { id: 1599725278770,
            name: 'Мотоцикл Suzuki',
            vin: null,
            price: '100000' } ] },
    output: "foo: bar\r\nsome: foobar"
    } 
]

it("Returns formed email body from json", function() {
    for(let i in testSet) {
        assert.isNotNull(helpers.prepareNotice(testSet[i].input));
    }
})

it("Returns formed date", function() {
    assert.isNotNull(helpers.convertDate(new Date(), true));
})