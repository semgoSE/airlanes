import React, { Component } from 'react'
import SnackbarError from './SnackbarError';
import { Group, ScreenSpinner, CardGrid, Card, Div, Button, Alert, Placeholder, List, PromoBanner, PullToRefresh, Link, Title, SimpleCell, Text } from '@vkontakte/vkui'

import booking from '../img/booking.png';

import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';
import Icon28ChevronDownOutline from '@vkontakte/icons/dist/28/chevron_down_outline';



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

const blue = {
  color:'var(--accent)'
}

const bannerData = {
  title: 'Отели, хостелы',
  domain: 'booking.com',
  trackingLink: 'https://www.booking.com?aid=1540284',
  ctaText: 'Перейти',
  advertisingLabel: 'Реклама',
  iconLink: booking,
  description: 'Бронирование отелей',
  statistics: [
    { url: '', type: 'playbackStarted' },
    { url: '', type: 'click' }
  ]
};

export class MyDB extends Component {
  state = {
    snackbar:null,
    is_watch:false,
    is_market:true,
    data:this.props.DB,
    isFetching:false,
    list:{}
  }


  componentDidMount() {
    let obj = {};
    this.state.data.forEach((el) => {
      obj = { ...obj, [el.id]:false}
    })
    this.setState({list:obj})
  }

  openAlert = (request_id, i) => {
    console.log(request_id)
      this.props.setPopout(
        <Alert
        actions={[{
          title: 'Нет',
          autoclose: true,
          mode: 'cancel'
        }, {
          title: 'Да',
          autoclose: true,
          mode: 'destructive',
          action: () => this.delete(request_id, i),
        }]}
        onClose={() => this.props.setPopout(null)}>
          <Text>Удалить?</Text>
        </Alert>
      )
  }

  delete = (request_id, i) => {
    this.props.setPopout(<ScreenSpinner />);
    fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/delete-request", {
      "headers": {
        "accept": "*/*",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=utf-8",
      },
      "referrer": "https://appvk.flights.ru/",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": JSON.stringify({request_id:request_id}),
      "method": "POST",
    })
    .then(response => response.json())
    .then(check => {
      if(check.response === 'ok'){
        let remove = this.state.data.splice(i, 1);
        this.props.onChangeCount('countDB', remove.length-1);
        this.props.onChangeGroups('countDB', remove.length-1);
        this.props.setPopout(null);
      }
    })
  }

  edit = (obj) => {
    let data = JSON.parse(obj.output);
    this.props.onChangeGroups('form', {...data, id:obj.id});
    setTimeout(() => this.props.go('edit_settings'), 500)
  }

  onRefresh = () => {
    this.setState({ isFetching:true })
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
      console.log(data);
      this.setState({ data: data.requests, isFetching:false })
      this.props.setPopout(null)
    }).catch(err => {
      this.props.setPopout(null)
      this.setState({snackbar:<SnackbarError close={() => this.setState({snackbar:null})}/>, data:'error'})
    })
  }
  

  render() {
    const {
      data
    } = this.state
    return (
      <div>
        {this.state.is_market && <Div style={{ marginTop: 12 }}>
        <PromoBanner onClose={() => this.setState({is_market: false})} bannerData={bannerData}/>
        </Div>}
      <PullToRefresh isFetching={this.state.isFetching} onRefresh={this.onRefresh}>
      <div>
        {
          data &&        
          <div>
          {data === 'error' ? <Placeholder>Ошибка интернет-соединения</Placeholder> :
          <div>
            {(data.length === 0 || this.props.info.info_db) ? <Placeholder>
              {this.props.state.user.sex === 2 ? 
              <div align='justify'>
                <Title level='3' weight='heavy'>Чем отличаются разделы "Витрина" и "Мой выбор?"</Title>
                <p>
                Ты уже знаешь, что мы показываем авиабилеты в момент снижения цены на 30% или больше.
                </p>
                <p>
                После того, как они попадают в гипермаркет "Дешевые авиабилеты" (как и откуда - описано в разделе "Помощь") у дешевых авиабилетов есть два пути:
                </p>
                <p>
                Один ты видел - это "Витрина" гипермаркета с 700-ми сообществами. Можно подписаться на любые или все сразу, даже не заходя в них и получать билеты в новостную ленту или выборочно со стены - в личные сообщения.
                </p>
                <p>
                Какие там показываются авиабилеты - выбирали мы, на основе своего опыта и изучения спроса пассажиров
                </p>
                <p>
                Второй способ реализован в разделе "Мой выбор" и ты сейчас именно здесь.
                </p>
                <Title level='3' weight='heavy'>Мой выбор</Title>
                <p>
                Это оптовый склад гипермаркета "Дешевые авиабилеты" и у тебя теперь есть персональный доступ. Выбери все параметры сам и получай информацию в личные сообщения.
                </p>
                <p>
                Раздел так и называется - "Мой выбор". Так ведь и есть? Теперь это - твой уникальный выбор
                </p>
                <p>
                Посмотри вокруг - никого нет, ни охранников, ни расписания работы, ни кассиров... Все работает автоматически, круглосуточно, без выходных, во всех странах мира.
                </p>
                <p>
                Выбирай и получай дешевые авиабилеты в момент снижения цены в личные сообщения.
                </p>
                <Link onClick={() => {this.setState({is_watch:!this.state.is_watch})}}>читать далее...</Link>
                {this.state.is_watch && 
                <div>
                  <Title level='3' weight='heavy'>Кто владеет информацией - тот владеет миром</Title>
                  <p>
                  Более 200 лет назад, в 1815 году произошел обвал на фондовых биржах Европы. Как так получилось и кто былв этом виноват?
                  </p>
                  <p>
                  Вся Европа была напугана возможным реваншем Наполеона. После триумфа «Ста дней» фондовые биржи Англии лихорадило — все с тревогой ждали, чем закончится решающая битва между армиями Наполеона и Веллингтона при Ватерлоо.
                  </p>
                  <p>
                  В начале сражения наблюдателям показалось, что выигрывает Наполеон, о чем срочно сообщили в Лондон. Однако, на помощь войскам Веллингтона подоспел прусский корпус и решил исход боя в пользу союзников. Наполеон бежал.
                  </p>
                  <p>
                  У братьев Ротшильд было хобби - они занимались разведением почтовых голубей и одновременно следили за исходом битвы при Ватерлоо, т.к. были заметными игроками на фондовом рынке, владя крупным банком, через который финансировалась война против Наполеона.
                  </p>
                  <p>
                  Итак, была середина июня, победу в битве должен был одержать Наполеон Банапарт, об этом были извещены в Лондоне, но на помощь Велингтону подоспел прусский корпус Блюхера.
                  </p>
                  <p>
                  Об этом никто в Лондоне не знал...
                  </p>
                  <p>
                  Всё это время шпионы Натана Ротшильда следовали по пятам за войсками и тотчас же отсылали донесения своему хозяину о всех важных событиях. Как? Естественно, голубиной почтой. Последние голуби с шифрованными инструкциями, привязанными к лапкам, были немедленно выпущены сразу после окончания битвы и сообщили хозяину про ее итог.
                  </p>
                  <p>
                  Утром следующего дня Натан Ротшильд явился на Лондонскую биржу. Он был единственным в Лондоне, кто достоверно знал о поражении Наполеона. Сокрушаясь (демонстративно) по поводу успехов Наполеона, он немедленно приступил к массовой продаже своих акций. Все остальные биржевики сразу же последовали его примеру, так как решили, что сражение проиграли англичане. Поднялась паника.
                  </p>
                  <p>
                  Английские, австрийские и прусские ценные бумаги дешевели с каждой минутой. Лондонская биржа буквально ломилась от обесцененных акций, а в это время их тайно скупали подставные агенты Ротшильда.
                  </p>
                  <p>
                  По прошествии суток люди узнали, что Наполеон битву проиграл, но было уже поздно – они успели продать акции, подвергнувшись общей панике.
                  </p>
                  <p>
                  Многие держатели ценных бумаг покончили с собой, а Натан за один день заработал 40 миллионов фунтов стерлингов и овладел большой долей британской экономики.
                  </p>
                  <p>
                  Такую же операцию на Парижской бирже осуществил брат Натана Ротшильда - Якоб.
                  </p>
                  <p>
                  Кто владеет информацией - тот владеет миром – это слова Натана.
                  </p>
                  <p>
                  Владея своевременной информацией о снижении цены на авиабилеты, ты тоже становишься обладателем преимущества, а Ватерлоо - это местечко в 15 км от Брюсселя по дороге из города в аэропорт Шарлеруа. Как-то раз мы проезжали на машине мимо.
                  </p>
                  <p>
                  Вспомни об этой истории, когда будешь в тех краях и увидишь пролетающего над собой голубя...
                  </p>
                  <Link onClick={() => {this.setState({is_watch:!this.state.is_watch})}}>свернуть</Link>
                </div>
                }
              </div>: 
              <div>
                <Title level='3' weight='heavy'>Чем отличается раздел «Витрина» от раздела «Мой выбор»</Title>
                <p>
                Не каждой девушке по силам отслеживать колебания цен на авиаполеты...
                </p>
                <p>
                Ты уже знаешь, что мы показываем авиабилеты в момент снижения цены на 30% и даже больше, как повезет. Именно поэтому они и называются «дешевыми».
                </p>
                <p>
                После того, как дешевые авиабилеты попадают к нам в систему (как именно и откуда - описано в разделе "Помощь") у них есть два пути:
                </p>
                <p>
                Один мы уже описали - это раздел "Витрина" с 700-ми сообществами. Можно подписаться на любые направления полетов, даже не заходя в сообщества и получать дешевые билеты в новостную ленту или выборочно со стены - в личные сообщения. Теперь можно и так.
                </p>
                <p>
                Какие там показываются авиабилеты - выбирали мы, на основе своего опыта путешествий более, чем в 100 странах и изучения спроса пассажиров.
                </p>
                <p>
                Второй способ реализован в разделе "Мой выбор" и ты сейчас здесь.
                </p>
                <Title level='3' weight='heavy'>Мой выбор</Title>
                <p>
                Это оптовый склад-outlet гипермаркета "Дешевые авиабилеты" и у тебя теперь есть персональный доступ.
                </p>
                <p>
                Выбери нужные параметры и получай информацию в личные сообщения. Раздел так и называется - "Мой выбор". Так ведь и есть? Теперь это - твой уникальный выбор. Увидишь все, что хотела, бюджетные способы побывать во всех пунктиках своего wish-листа.
                </p>
                <p>
                Все можно посмотреть и потрогать, везде тестеры и отливанты. Не понравилось – можно отказаться или поменять подписку. Заведение работает автоматически, круглосуточно, без выходных, во всех странах мира.
                </p>
                <p>
                Выбери то ,что хочешь и получай дешевые авиабилеты самой первой!
                </p>
                <Link onClick={() => {this.setState({is_watch:!this.state.is_watch})}}>показать еще...</Link>
                {this.state.is_watch && 
                <div>
                  <p>
                  Более 200 лет назад, в 1815 году произошел обвал на фондовых биржах Европы.
                  </p>
                  <p>
                  Как так получилось и кто был в этом виноват? Более 200 лет назад, в 1815 году произошел обвал на фондовых биржах Европы.
                  </p>
                  <p>
                  Вся Европа была напугана возможным возвращением к власти Наполеона. После триумфа «Ста дней» фондовые биржи Англии лихорадило — все с тревогой ждали, чем закончится решающая битва между армиями Наполеона и Веллингтона при Ватерлоо.
                  </p>
                  <p>
                  В начале сражения наблюдателям показалось, что выигрывает Наполеон, о чем срочно сообщили в Лондон. Однако, на помощь войскам Веллингтона подоспел прусский корпус Блюхера и решил исход боя в пользу союзников. Наполеон бежал.
                  </p>
                  <p>
                  Ах! Бедная Жозефина! К этому моменту они были женаты уже 19 лет.
                  </p>
                  <p>
                  У братьев Ротшильд было хобби - они занимались разведением почтовых голубей и одновременно следили за исходом битвы при Ватерлоо, владея крупным банком, через который финансировалась война против Наполеона.
                  </p>
                  <p>
                  Победу в битве должен был одержать Наполеон Банапарт, об этом были извещены в Лондоне, но на помощь Велингтону подоспел прусский корпус и все закончилось ровно наоборот.
                  </p>
                  <p>
                  Об этом никто в Лондоне не знал...
                  </p>
                  <p>
                  Всё это время шпионы коварного Натана Ротшильда следовали по пятам за войсками и тотчас же отсылали донесения своему хозяину о всех важных событиях. Как? Естественно - голубиной почтой. Последние голуби с шифрованными инструкциями, привязанными к лапкам, были немедленно выпущены сразу после окончания битвы и сообщили хозяину про ее итог.
                  </p>
                  <p>
                  Утром следующего дня Натан Ротшильд явился на Лондонскую биржу. Он был единственным в Лондоне, кто достоверно знал о поражении Наполеона. Сокрушаясь демонстративно по поводу успехов Наполеона, он немедленно приступил к массовой продаже своих акций.
                  </p>
                  <p>
                  Все остальные биржевики сразу же последовали его примеру, так как решили, что сражение проиграли англичане. Поднялась паника. Английские, австрийские и прусские ценные бумаги дешевели с каждой минутой. Лондонская биржа буквально ломилась от обесцененных акций. В это время их тайно скупали подставные агенты Ротшильда.
                  </p>
                  <p>
                  По прошествии суток люди узнали, что Наполеон битву проиграл, но было уже поздно – они успели продать акции, подвергнувшись общей панике. Многие держатели ценных бумаг покончили с собой, а Натан Ротшильд за один день заработал 40 миллионов фунтов стерлингов и овладел большой долей британской экономики. Такую же операцию на Парижской бирже осуществил брат Натана Ротшильда - Якоб.
                  </p>
                  <p>
                  Кто владеет информацией - тот владеет миром – это слова Натана Ротшильда.
                  </p>
                  <p>
                  Владея своевременной информацией о снижении цены на авиабилеты, ты тоже становишься обладателем преимущества. Наряду с женственностью и красотой – это страшная сила!
                  </p>
                  <p>
                  Ватерлоо - местечко в 15 км от Брюсселя по дороге из города в аэропорт Шарлеруа. Как-то раз мы проезжали мимо на машине.
                  </p>
                  <p>
                  Вспомни об этой истории и о любви Мари Роз Жозефа Таше де ла Пажери (так звали Жозефину) и Наполеона, когда будешь в тех краях и увидишь пролетающего над собой голубя...
                  </p>
                  <p>
                  Жозефина была родом с Мартиники, это Антильские острова и билеты туда ты тоже увидишь у нас.
                  </p>
                  <Link onClick={() => {this.setState({is_watch:!this.state.is_watch})}}>свернуть</Link>
                </div>
                }
              </div>}
            </Placeholder>:
          (
            <List>
             {data.map((item, index) =>
              <div>
              <SimpleCell onClick={() => this.setState({ list: {...this.state.list, [item.id]:!this.state.list[item.id]}})} style={{ fontWeight:'bold',  marginTop:(index == 0 && !this.state.is_market ? 24 : 0)}} after={<Icon28ChevronDownOutline fill='#4BBDE7' style={{ transform: `rotate(${this.state.list[item.id] ? '180deg' : '0'})` }} />}>
                <Title weight='heavy' level='3'>{CONTINENTS[JSON.parse(item.output).continentDst] + (JSON.parse(item.output).countryDst ? " - " + JSON.parse(item.output).countryDst : '') + (JSON.parse(item.output).cityDst ? " - " + JSON.parse(item.output).cityDst : '')}</Title>
              </SimpleCell>
              {this.state.list[item.id] && 
              <div>
                <SimpleCell>
                  <Link style={{ display: 'flex'}}><Icon28SettingsOutline onClick={() => this.edit(item)} fill='#0E62F1'/><Icon28DeleteOutlineAndroid style={{ marginLeft:22 }} fill='#0E62F1' onClick={() => this.openAlert(item.id, index)} /></Link>
                </SimpleCell>
              <Div style={{ paddingTop: 0 }}>
                <Title weight='regular' level='3'>
        Из страны <b style={blue}>{
          JSON.parse(item.output).countrySrc ? JSON.parse(item.output).countrySrc : "любая"
        }</b> и города <b style={blue}>{JSON.parse(item.output).citySrc ? JSON.parse(item.output).citySrc : "любой"}</b><br />
        В часть света <b style={blue}>{CONTINENTS[JSON.parse(item.output).continentDst]}</b> и страну <b  style={blue}>{ JSON.parse(item.output).countryDst ?  JSON.parse(item.output).countryDst : "любая"}</b><br />
        В город <b  style={blue}>{ JSON.parse(item.output).cityDst ?  JSON.parse(item.output).cityDst : "любой"}</b><br />
        {
          JSON.parse(item.output).dates.map((item, i) => 
            <div key={i}>
              <div style={{ color: 'var(--tabbar_inactive_icon)' }}>Период вылета {i+1}</div>
              год <b style={blue}>{item.year}</b><br />
              {item.month ==  '0' && <span>время года <b style={blue}>{SEASONS_TRANSCRIPTION[item.season]}</b><br /></span>}
              месяц <b style={blue}>{MONTHS_TRANSCRIPTION[item.month]}</b><br />
              
            </div>    
          )
        }<br />
                Направление полетов: туда-обратно - <b style={blue}>{JSON.parse(item.output).dual ? "да" : "нет"}</b><br />
        Направление полетов: туда - <b style={blue}>{JSON.parse(item.output).forward ? "да" : "нет"}</b><br />
        Пассажиры <b style={blue}>{PASSENGERS[JSON.parse(item.output).passengers]}</b><br />
        Цена от <b style={blue}>{JSON.parse(item.output).costMin}</b> до <b style={blue}>{JSON.parse(item.output).costMax}</b> {CURRENCY1[JSON.parse(item.output).currency]}<br />

        Период показа <b style={blue}>{JSON.parse(item.output).interval}</b> минут<br />
        Глубина поиска <b style={blue}>{JSON.parse(item.output).updated}</b> минут<br />
        Максимальное количество билетов за 24 часа <b style={blue}>{JSON.parse(item.output).limit === "0" ? "все" : JSON.parse(item.output).limit}</b><br />
        Язык (туда-обратно) <b style={blue}>{LANGUAGES[JSON.parse(item.output).language]}</b><br />
        Валюта (цена) <b style={blue}>{CURRENCY[JSON.parse(item.output).currency]}</b><br />
        Валюта (метапоисковика) <b style={blue}>{CURRENCY[JSON.parse(item.output).currencyForUrl]}</b><br />
        {
          JSON.parse(item.output).optional && (
            <div><br />
              <div style={{ color: 'var(--tabbar_inactive_icon)' }}>Дополнительные параметры</div>
              {
                JSON.parse(item.output).profitability && ("Выгодность покупки больше ")
              }
              {
                JSON.parse(item.output).profitability && 
                <b style={blue}>{JSON.parse(item.output).profitability+"%"}</b>
              }<br />
              Дни недели вылета <b style={blue}>{
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
                    Днем от <b style={blue}>{JSON.parse(item.output)['dayTemp.min']}</b> С до <b style={blue}>+{JSON.parse(item.output)['dayTemp.max']}</b> С<br />
                    Ночью от <b style={blue}>{JSON.parse(item.output)['nightTemp.min']}</b> С до <b style={blue}>+{JSON.parse(item.output)['nightTemp.max']}</b> С<br />
                  </div>
                )
              }
            </div>
          )
        }
              </Title>
                </Div>
                </div>
                }
              </div>
             )
             } 
            </List>
              
          )
            }
          </div>
         }
         </div> 
        }
        {this.state.snackbar}
        <Div />
        <Div />
      </div>
      </PullToRefresh>
      </div>
    )
  }
}

export default MyDB

{ /*    

  <CardGrid>
    <Card size="l" mode="shadow">
      <Div style={{ padding: '20px', lineHeight: 1.5 }}>
        Из страны <b style={blue}>{
          JSON.parse(item.output).countrySrc ? JSON.parse(item.output).countrySrc : "любая"
        }</b> и города <b style={blue}>{JSON.parse(item.output).citySrc ? JSON.parse(item.output).citySrc : "любой"}</b><br />
        В часть света <b style={blue}>{CONTINENTS[JSON.parse(item.output).continentDst]}</b> и страну <b style={blue}>{JSON.parse(item.output).countryDst ? JSON.parse(item.output).countryDst : "любая"}</b><br />
        В город <b style={blue}>{JSON.parse(item.output).cityDst ? JSON.parse(item.output).cityDst : "любой"}</b><br />
        Направление полетов: туда-обратно - <b style={blue}>{JSON.parse(item.output).dual ? "да" : "нет"}</b><br />
        Направление полетов: туда - <b style={blue}>{JSON.parse(item.output).forward ? "да" : "нет"}</b><br />
        {
          JSON.parse(item.output).dates.map((item, i) => 
            <div key={i}>
              Год вылета ({i+1}) <b style={blue}>{item.year}</b><br />
              Время года ({i+1}) <b style={blue}>{SEASONS_TRANSCRIPTION[item.season]}</b><br />
              Месяц ({i+1}) <b style={blue}>{MONTHS_TRANSCRIPTION[item.month]}</b><br />
            </div>    
          )
        }<br />
        Пассажиры <b style={blue}>{PASSENGERS[JSON.parse(item.output).passengers]}</b><br />
        Цена от <b style={blue}>{JSON.parse(item.output).costMin}</b> до <b style={blue}>{JSON.parse(item.output).costMax}</b> {CURRENCY1[JSON.parse(item.output).currency]}<br />

        Период показа <b style={blue}>{JSON.parse(item.output).interval}</b> минут<br />
        Глубина поиска <b style={blue}>{JSON.parse(item.output).updated}</b> минут<br />
        Максимальное количество билетов за 24 часа <b style={blue}>{JSON.parse(item.output).limit === "0" ? "все" : JSON.parse(item.output).limit}</b><br />
        Язык (туда-обратно) <b style={blue}>{LANGUAGES[JSON.parse(item.output).language]}</b><br />
        Валюта (цена) <b style={blue}>{CURRENCY[JSON.parse(item.output).currency]}</b><br />
        Валюта (метапоисковика) <b style={blue}>{CURRENCY[JSON.parse(item.output).currencyForUrl]}</b><br />
        {
          JSON.parse(item.output).optional && (
            <div><br />
              <div style={{ color: 'var(--tabbar_inactive_icon)' }}>Дополнительные параметры</div>
              {
                JSON.parse(item.output).profitability && ("Выгодность покупки больше ")
              }
              {
                JSON.parse(item.output).profitability && 
                <b style={blue}>{JSON.parse(item.output).profitability+"%"}</b>
              }<br />
              Дни недели вылета <b style={blue}>{
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
                    Днем от <b style={blue}>{JSON.parse(item.output)['dayTemp.min']}</b> С до <b style={blue}>{JSON.parse(item.output)['dayTemp.max']}</b> С<br />
                    Ночью от <b style={blue}>{JSON.parse(item.output)['nightTemp.min']}</b> С до <b style={blue}>{JSON.parse(item.output)['nightTemp.max']}</b> С<br />
                  </div>
                )
              }
            </div>
          )
        }
      </Div>
      <Div>
        <Button
          onClick={() => this.edit(item)}
          size="xl"
        >
          Редактировать
        </Button><br />
        <Button
          onClick={() => this.openAlert(item.id, index)}
          size="xl"
          mode="destructive"
        >
          Удалить
        </Button>
      </Div>
    </Card>
  </CardGrid>
</Group>
*/}
