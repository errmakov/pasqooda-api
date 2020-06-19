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

let abcSet = {0:'а', 2: 'в', 4: 'д'};
for (let i in abcSet) {
  it("Returns abc char of russian alphabet by number " + i + ' => ' + abcSet[i] + ': ', function() {
    return assert.deepEqual(helpers.abcList(i), abcSet[i]);
  })
}

let minSumSet = [
  {src: 1000, set:[4000, 2000, 3000], result: 0},
  {src: 1000, set:[300, 2000, 1500], result: 1},
  {src: 1500, set:[500, 300, 800], result: 3},
];
for (let i in minSumSet) {
  let row = minSumSet[i];
  it("Return count of elements in array, what less than:  " + row.src + '. Array: ' + row.set + '. So, result must be =  ' + row.result, function() {
    return assert.deepEqual(helpers.minSum(row.src, row.set), row.result);
  })
}

let arbitrarySet = [
  {address: '', result: ''},
  {address: 'Тольятти, Бульвар ленина 6 кв 123', result: 'Самарской области'},/*
  {address: 'Москва, Академика Анохина 5к4 кв 212', result: 'города Москвы'},
  {address: 'чехов, улица Гарнаева 5', result: 'Московской области'},
  {address: 'Майкоп, улица Хакурате, 3 квартира 4', result: 'Республики Адыгея'},
  {address: 'Заюкова улица Ногмова дом 4', result: 'Кабардино-Балкарской Республики'},
  {address: 'город Чилгир улица Ленина 1', result: 'Республики Калмыкия'},
  {address: 'город Черкесск улица Октябрьская 5', result: 'Карачаево-Черкесской Республики'},
  {address: 'Петразоводск, проспект Александра Невского 1 кв 5', result: 'Республики Карелия'},
  {address: 'Якутск ул Дзержинского 5 кв 5', result: 'Республики Саха (Якутия)'},
  {address: 'Ардон, Ул Хоранова 1 кв 2', result: 'Республики Северная Осетия — Алания'},
  {address: 'Казань улица Декабристов 10, кв 3', result: 'Республики Татарстан'},
  {address: 'Кызыл, улица Горная 2 кв 5', result: 'Республики Тыва'},
  {address: 'Ижевск улица Кирова 4 кв 5', result: 'Удмуртской Республики'},
  {address: 'Аскиз улица Красноармейская 1 кв 5', result: 'Республики Хакасия'},
  {address: 'Шали ул Луговая 2 кв 3', result: 'Чеченской Республики'},
  {address: 'Чебоксары проспект Мира 1', result: 'Чувашской Республики - Чувашии'},
  {address: 'Алейск ул Давыдова 4 кв 3', result: 'Алтайского края'},
  {address: 'Чита ул Бабушкина 1 кв 3', result: 'Забайкальского края'},
  {address: 'Петропаловск-Камчатский Восточное шоссе 3 кв 1', result: 'Камчатского края'},
  {address: 'Краснодар ул Буденного 1 кв 3', result: 'Краснодарского края'},
  {address: 'Норильск улица Советская 2 кв 3', result: 'Красноярского края'},
  {address: 'Лысьва ул Лязгина 2 кв 3', result: 'Пермского края'},
  {address: 'Дальнегорск улица осипенко 1 кв 2', result: 'Приморского края'},
  {address: 'Буденновск улица советская 1 кв 2', result: 'Ставропольского края'},
  {address: 'Комсомольск-на-Амуре улица вокзальная 1 кв 2', result: 'Хабаровского края'},
  {address: 'Магдагачи пер Гагарина 1 кв 2', result: 'Амурской области'},
  {address: 'Нарьян-мар улица Рабочая 1 кв 2', result: 'Архангельской области'},
  {address: 'Новый оскол улица 1 мая 1 кв 2', result: 'Белгородской области'},
  {address: 'Няндома ул Пионерская 1 кв 2', result: 'Архангельской области'},
  {address: 'Астрахань улица Кирова 1 кв 2', result: 'Астраханской области'},
  {address: 'Мглин ул Ворошилова 1 кв 2', result: 'Брянской области'},
  {address: 'Гусь-Хрустальный Переулок Стекольщиков 1 кв 2', result: 'Владимирской области'},
  {address: 'Фролово ул Спартаковская 1 кв 2', result: 'Волгоградской области'},
  {address: 'Череповец ул Парковая 1 кв 2', result: 'Вологодской области'},
  {address: 'Бутурлиновка ул Калинина 1 кв 2', result: 'Воронежской области'},
  {address: 'Шуя ул генерала белова 1 кв 2', result: 'Ивановской области'},
  {address: 'Братск ул Обручева 1 кв 2', result: 'Иркутской области'},
  {address: 'Светлогорск ул Пригородная 1 кв 2', result: 'Калининградской области'},
  {address: 'Обнинск ул Гагарина 1 кв 2', result: 'Калужской области'},
  {address: 'Новокузнецк ул Кирова 1 кв 2', result: 'Кемеровской области'},
  {address: 'Яранск ул Северная 1 кв 2', result: 'Кировской области'},
  {address: 'Судиславль ул Костромская 1 кв 2', result: 'Костромской области'},
  {address: 'Каргаполье ул Ленина 1 кв 2', result: 'Курганской области'},
  {address: 'Обоянь ул Чайковского 1 кв 2', result: 'Курской области'},
  {address: 'Санкт-Петербуг Невский проспект 1 кв 2', result: 'Санкт-Петербурга и Ленинградской области'},
  {address: 'Луга улица Свободны дом 1 кв 2', result: 'Санкт-Петербурга и Ленинградской области'},
  {address: 'Севастополь Камышовое шоссе 1 кв 2', result: 'города Севастополя'}, 
  {address: 'Елец ул Свердлова 1 кв 2', result: 'Липецкой области'}, 
  {address: 'Сусуман ул Ленина 1 кв 2', result: 'Магаданской области'},
  {address: 'Апатиты ул Козлова 1 кв 2', result: 'Мурманской области'},
  {address: 'Старая Русса ул Трибуны 1 кв 2', result: 'Новгородской области'},
  {address: 'Бердск улица Советская 1 кв 2', result: 'Новосибирской области'},
  {address: 'Тевриз ул Кирова 1 кв 2', result: 'Омской области'},
  {address: 'Бузулук ул Дорожная 1 кв 2', result: 'Оренбургской области'},
  {address: 'Кромы ул Советская 1 кв 2', result: 'Орловской области'},
  {address: 'Каменка улица Озерная 1 кв 2', result: 'Пензенской области'},
  {address: 'город Остров ул Карла Маркса 1 кв 2', result: 'Псковской области'},
  {address: 'Шахты улица Парковая 1 кв 2', result: 'Ростовской области'},
  {address: 'Тольятти бульвар Королева 9 кв 101', result: 'Самарской области'},
  {address: 'Балаково улица Волжская 1 кв 2', result: 'Саратовской области'},
  {address: 'Долинск улица Хабаровская 1 кв 2', result: 'Сахалинской области'},
  {address: 'город Рязань, ул Маяковского, дом 1 кв 2', result: 'Рязанской области'},
  {address: 'Нижний Тагил, ул Горошникова, дом 1 кв 2', result: 'Свердловской области'},
  {address: 'город Вязьма, ул Ямская, дом 1 кв 2', result: 'Смоленской области'},
  {address: 'город Моршанск, ул Транспортная, дом 1 кв 2', result: 'Тамбовской области'},
  {address: 'город Ржев, ул Бехтерева, дом 1 кв 2', result: 'Тверской области'},
  {address: 'город Тула, ул Тургеневская, дом 1 кв 2', result: 'Тульской области'},
  {address: 'Новый Уренгой, Ленинградский проспект, дом 1 кв 2', result: 'Ямало-Ненецкого автономного округа'},
  {address: 'Сургут, улица Профсоюзов, дом 1 кв 2', result: 'Ханты-Мансийского автономного округа — Югры'},
  {address: 'Ульяновск, ул Гончарова, дом 1 кв 2', result: 'Ульяновской области'},
  {address: 'Челябинск, ул Худякова, дом 1 кв 2', result: 'Челябинской области'},
  {address: 'Рыбинск, ул Герцена, дом 1 кв 2', result: 'Ярославской области'},
  {address: 'Биробиджан, ул Школьная, дом 1 кв 2', result: 'Еврейской автономной области'},
  {address: 'Анадырь, ул Мира, дом 1 кв 2', result: 'Чукотского автономного округа'},
  {address: 'Тюмень, ул Ленина, дом 14 кв 2', result: 'Тюменской области'},*/
  
];
chai.use(require("chai-as-promised"));
for (let i in arbitrarySet) {
  let row = arbitrarySet[i];
  it("Return jurisdiction for: '" + row.address + "'. Arbitrary: '" + row.result + "'", function() {
    return assert.becomes(helpers.getJurisdiction(row.address), row.result);
  })
}

