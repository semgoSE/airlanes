import React, { Component } from 'react'
import { Group, ScreenSpinner, CardGrid, Card, Div, Button } from '@vkontakte/vkui'

const SEASONS_TRANSCRIPTION = {
  'all': 'любое',
  'winter': 'зима',
  'spring': 'весна',
  'summer': 'лето',
  'fall': 'осень',
};
const MONTHS_TRANSCRIPTION = {
  0: 'любой',
  1: 'январь', 2: 'февраль', 3: 'март', 4: 'апрель',
  5: 'май', 6: 'июнь', 7: 'июль', 8: 'август',
  9: 'сентябрь', 10: 'октябрь', 11: 'ноябрь', 12: 'декабрь',
};

const CONTINENTS = {
  'random': 'любая',
  'E': 'Европа',
  'F': 'Африка',
  'O': 'Океания',
  'A': 'Азия',
  'S': 'Южная Америка',
  'N': 'Северная Америка',
};

const PASSENGERS = {
  url: "1 пассажир, экономкласс",
  url1Business: "1 пассажир, бизнес-класс",
  url2Passengers: "2 пассажира, экономкласс",
  urlForma: "открытая редактируемая форма поиска"
}

const CURRENCY = {
  AZN: "манат",
  BYN: "беларусский рубль",
  CNY: "юань",
  EUR: "евро",
  KGS: "сом",
  KZT: "тенге ",
  RUB: "рубль ",
  THB: "бат",
  UAH: "гривна",
  USD: "доллар",
  UZS: "сум"
}

const CURRENCY1 = {
  AZN: "манат",
  BYN: "беларусских рублей",
  CNY: "юань",
  EUR: "евро",
  KGS: "сом",
  KZT: "тенге ",
  RUB: "рублей",
  THB: "бат",
  UAH: "гривна",
  USD: "доллар",
  UZS: "сум"
}

const LANGUAGES = {
  de: "немецкий",
  en: "английский",
  es: "испанский",
  fr: "французский",
  it: "итальянский",
  ru: "русский",
  th: "тайский",
  tr: "турецкий"
}

export class MyDB extends Component {
  state = {

  }

  componentDidMount() {
    this.props.setPopout(<ScreenSpinner />)
    fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/get-requests", {
      "headers": {
        "accept": "*/*",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=utf-8",
      },
      "body": JSON.stringify({
        user_id: String(this.props.state.user.id)
      }),
      "method": "POST",
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ data: data.requests })
      this.props.setPopout(null)
    })
  }
  

  render() {
    const {
      data
    } = this.state
    return (
      <div>
        {
          data && (
            data.map((item, index) => 
            <Group separator="hide" key={index}>
              <CardGrid>
                <Card size="l" mode="shadow">
                  <Div style={{ padding: '20px', lineHeight: 1.5 }}>
                    Из страны <b>{
                      JSON.parse(item.output).countrySrc ? JSON.parse(item.output).countrySrc : "любая"
                    }</b> и города <b>{JSON.parse(item.output).citySrc ? JSON.parse(item.output).citySrc : "любой"}</b><br />
                    В часть света <b>{CONTINENTS[JSON.parse(item.output).continentDst]}</b> и страну <b>{JSON.parse(item.output).countryDst ? JSON.parse(item.output).countryDst : "любая"}</b><br />
                    В город <b>{JSON.parse(item.output).cityDst ? JSON.parse(item.output).cityDst : "любой"}</b><br />
                    Направление полетов - <b>{JSON.parse(item.output).forward ? "туда" : "туда-обратно"}</b><br />
                    {
                      JSON.parse(item.output).dates.map((item, i) => 
                        <div key={i}>
                          Год вылета ({i+1}) <b>{item.year}</b><br />
                          Время года ({i+1}) <b>{SEASONS_TRANSCRIPTION[item.season]}</b><br />
                          Месяц ({i+1}) <b>{MONTHS_TRANSCRIPTION[item.month]}</b><br />
                        </div>    
                      )
                    }<br />
                    Пассажиры <b>{PASSENGERS[JSON.parse(item.output).passengers]}</b><br />
                    Цена от <b>{JSON.parse(item.output).costMin}</b> до <b>{JSON.parse(item.output).costMax}</b> {CURRENCY1[JSON.parse(item.output).currency]}<br />

                    Период показа <b>{JSON.parse(item.output).interval}</b> минут<br />
                    Глубина поиска <b>{JSON.parse(item.output).updated}</b> минут<br />
                    Максимальное количество билетов за 24 часа <b>{JSON.parse(item.output).limit === "0" ? "все" : JSON.parse(item.output).limit}</b><br />
                    Язык (туда-обратно) <b>{LANGUAGES[JSON.parse(item.output).language]}</b><br />
                    Валюта (цена) <b>{CURRENCY[JSON.parse(item.output).currency]}</b><br />
                    Валюта (метапоисковика) <b>{CURRENCY[JSON.parse(item.output).currencyForUrl]}</b><br />
                    {
                      JSON.parse(item.output).optional && (
                        <div><br />
                          <div style={{ color: 'var(--tabbar_inactive_icon)' }}>Дополнительные параметры</div>
                          {
                            JSON.parse(item.output).profitability && ("Выгодность покупки больше ")
                          }
                          {
                            JSON.parse(item.output).profitability && 
                            <b>{JSON.parse(item.output).profitability+"%"}</b>
                          }<br />
                          Дни недели вылета <b>{
                            ((days) => {
                              const daysOfWeek = [
                                "вс",
                                "пн",
                                "вт",
                                "ср",
                                "чт",
                                "пт",
                                "сб"
                              ]
                              let check = 0;
                              days.every((element, index, array) => {
                                  check++;
                                  return element === true;
                              });
                              if (check === 7) {
                                  return 'все';
                              }
                              let res = '';
                              for (let index = 1; index < days.length; index++) {
                                  if (days[index]) {
                                      res += daysOfWeek[index].toLowerCase() + ', ';
                                  }
                              }
                              res += daysOfWeek[0].toLowerCase();
                              return res;
                            })(JSON.parse(item.output).days)
                          }</b><br />
                          {
                            JSON.parse(item.output).showAddionalWeather && (
                              <div>
                                Прогноз погоды в день прилета<br />
                                Днем от <b>{JSON.parse(item.output)['dayTemp.min']}</b> С до <b>{JSON.parse(item.output)['dayTemp.max']}</b> С<br />
                                Ночью от <b>{JSON.parse(item.output)['nightTemp.min']}</b> С до <b>{JSON.parse(item.output)['nightTemp.max']}</b> С<br />
                              </div>
                            )
                          }
                        </div>
                      )
                    }
                  </Div>
                  <Div>
                    <Button
                      size="xl"
                    >
                      Редактировать
                    </Button><br />
                    <Button
                      size="xl"
                      mode="destructive"
                    >
                      Удалить
                    </Button>
                  </Div>
                </Card>
              </CardGrid>
            </Group>
            )
          )
        }
      </div>
    )
  }
}

export default MyDB
