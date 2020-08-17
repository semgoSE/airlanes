import React, { Component } from 'react'
import SnackbarError from '../components/SnackbarError'; 
import { Panel, PanelHeader, FormLayout, Header, Input, Select, Checkbox, Button, Div, RangeSlider, PanelHeaderBack, ScreenSpinner, SimpleCell, Cell, Switch, FormLayoutGroup, Tabs, TabsItem, Separator } from '@vkontakte/vkui'
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon28CancelCircleOutline from '@vkontakte/icons/dist/28/cancel_circle_outline';
import Icon16Add from '@vkontakte/icons/dist/16/add';
import Icon16Cancel from '@vkontakte/icons/dist/16/cancel';
import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';

import SelectSearch from 'react-select-search';

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

const CONTINENT_DST = {
  E:'Европа',
  F:"Африка",
  D:'Океания',
  A:"Азия",
  S:"Южная Америка",
  N:"Северная Америка"
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

const CURRENCY = {
  AZN: {name:"манат", min:5, max:7000},
  BYN: {name:"беларусский рубль", min:10, max:10000},
  CNY: {name:"юань", min:10, max:30000},
  EUR: {name:"евро", min:1, max:4000},
  KGS: {name:"сом", min:100, max:300000},
  KZT: {name:"тенге", min:500, max:1500000},
  RUB: {name:"рубль", min:100, max:300000},
  THB: {name:"бат", min:10, max:150000},
  UAH: {name:"гривна", min:50, max:100000},
  USD: {name:"доллар", min:1, max:5000},
  UZS: {name:"сум", min:500, max:500000}
}

const PASSENGERS = {
  url: "1 пассажир, экономкласс",
  url2Passengers: "2 пассажира, экономкласс",
  url1Business: "1 пассажир, бизнес-класс",
  urlForma: "другой вариант"
}

const checkbox = {
  paddingTop:0, paddingBottom:0
}

export class Settings extends Component {
  state = {
    data:[],
    listCountry:[],
    cities:[],
    updated: "60",
    interval: "60",
    limit: "0",
    countryDst:'all',
    continentDst:'E',
    cityDst:'all',
    datesCnt: [{
      year: (new Date()).getFullYear(),
      season: 'all',
      month: '0'
    }],
    activeCnt:0,
    language: 'ru',
    dual: true,
    forward: true,
    profitability:30,
    currency: 'RUB',
    currencyForUrl: 'RUB',
    passengers:'url',
    randomCost:true,
    randomTempDay:true,
    randomTempNight:true,
    costMin: 100,
    costMax: 500000,
    dayTempMin:-50,
    dayTempMax:50,
    interval:'60',
    nighTempMin:-50,
    nighTempMax:50,
    days:[true, true, true, true, true, true, true],
    allDays:true,
    snackbar:null,
    all_flight:true,
    random_day_count:true,
    count_day_Min:3,
    count_day_Max:20
  }


  componentDidMount() {
    this.props.setPopout(<ScreenSpinner />);
    fetch(`https://cors-anywhere.herokuapp.com/https://api.cheapflights.sale/api/Countries`)
    .then(response => response.json())
    .then(listCountry => {
        listCountry.unshift({code:'all', nameTranslations:{ru:"любая"}})
        let s = listCountry.filter(country => country.nameTranslations.ru.indexOf(this.props.state.user.country.title) > -1)[0];
        fetch(`https://cors-anywhere.herokuapp.com/https://api.cheapflights.sale/api/Cities/byCountry/`+s.code)
          .then(response => response.json())
          .then(cities => {
              cities.unshift({code:'all', nameTranslations:{ru:"любая"}})
              let n = cities.filter(city => city.nameTranslations.ru != null && city.nameTranslations.ru.indexOf(this.props.state.user.city.title) > -1)[0];
              console.log(n);
              this.setState({ listCountry, cities, countrySrc:s.code,  countrySrcCode:s.nameTranslations.ru, citySrc:n.code, citySrcCode:n.nameTranslations.ru}, this.props.setPopout(null));
        })
    })

    /**/
  }

  onChange = e => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
  }

  onChangeCheck = (e) => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.checked
    })
  }

  onChangeFrom = e => {
    const { datesCnt } = this.state
    datesCnt[parseInt(e.currentTarget.id, 10)][e.currentTarget.name] = e.currentTarget.value
    if([e.currentTarget.name] == 'year') {
      console.log('p');
      datesCnt[parseInt(e.currentTarget.id, 10)]['season'] = 'all';
      datesCnt[parseInt(e.currentTarget.id, 10)]['month'] = 0;
    }
    this.setState({
      datesCnt
    })
  }

  addFrom = () => {
    const { datesCnt } = this.state
    datesCnt.push({
      year: (new Date()).getFullYear(),
      season: 'all',
      month: '0'
    })
    this.setState({
      datesCnt,
      activeCnt:datesCnt.length-1
    })
  }

  removeFrom = () => {
    const { datesCnt, activeCnt } = this.state
    this.setState({
      activeCnt: (activeCnt != 0 ? activeCnt -1 : 0),
      datesCnt: datesCnt.splice(0, datesCnt.length-1)
    })
  }

  onChangeDays = (e) => {
    console.log(e.currentTarget.name);
    if(e.currentTarget.name == 'all') {
      this.setState({ allDays:!this.state.allDays, days:[false, false, false, false, false, false, false]});
    }else{
      //this.setState({ allDays:!this.state.allDays});
      let bool = !this.state.days[Number(e.currentTarget.name)];
      let days = this.state.days.splice([Number(e.currentTarget.name)], 1, bool);
      console.log(this.state.days);
      
      let t = true;
      this.state.days.forEach(e => {
        if(!e) t = false
      })
      this.setState({ days:this.state.days, allDays:t });
    }

  }

//готовим данные к отправке
  sort_res = () => { 
    this.props.setPopout(<ScreenSpinner />)
    const { user } = this.props.state;
    const { citySrcCode, cityDstCode, countryDstCode, countrySrcCode,citySrc, cityDst, countryDst, countrySrc, costMax, costMin, currency,currencyForUrl,language, randomCost, dual,forward, datesCnt, profitability, dayTempMin, dayTempMax, nighTempMax, nighTempMin,passengers, updated, interval, limit, continentDst } = this.state;
    let days;
    if(this.state.allDays) {
      days = [true, true, true, true, true, true, true];
    }else{
      days = this.state.days;
    }
    let output = {
      citySrc:citySrcCode, 
      cityDst:cityDstCode,
      countryDst:countryDstCode,
      countrySrc:countrySrcCode,
      continentDst,
      costMax, 
      costMin,
      currency,
      currencyForUrl, 
      language,
      randomCost,
      forward,
      dual,
      passengers,
      updated:Number(updated),
      limit,
      interval,
      optional:true,
      dates:datesCnt,
      showAddionalWeather:true,
      profitability:String(profitability),
      ['nightTemp.max']:nighTempMax,
      ['nightTemp.min']:nighTempMin,
      ['dayTemp.max']:dayTempMax,
      ['dayTemp.min']:dayTempMin,
      days
    }

    let src_name;
    let dst_name;
    fetch(` https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191125T185829Z.bafa3ff776a2185a.64a334987cf74f3b022d5c07a4b67f2247dbc05b&lang=ru-en&text=${citySrcCode}`)
    .then(response => response.json())
    .then(res => {
      src_name = res.text;
      fetch(` https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191125T185829Z.bafa3ff776a2185a.64a334987cf74f3b022d5c07a4b67f2247dbc05b&lang=ru-en&text=${cityDstCode}`)
      .then(response => response.json())
      .then(res => {
        dst_name = res.text;
        let content = {
          ['src.CountryCode']:countrySrc,
          ['src.name']:src_name,
          ['dst.name']:dst_name,
          ['Discount']:{ ['$gte']:profitability},
          ['SrcDayOfWeek']:{['$in']:days.map((item, i) => { if(item == true) return i})},
          ['Dst.CountryCode']:(countryDst == 'all' ? null : countryDst),
          ['Price']:{['$gte']:costMin, ['$lte']:costMax},
          ['Temp.Max']:{['$gte']:dayTempMin, ['$lte']:dayTempMax},
          ['Temp.Min']:{['$gte']:nighTempMin, ['$lte']:nighTempMax},
          ['Dst.continentCode']:continentDst,
        }
        let obj = {
          id:null,
          interval:interval,
          limit:limit,
          updated:Number(updated),
          user_id:user.id,
          output,
          content
        }
        //this.save_request(obj);
        this.props.onChangeGroups('item', obj);
        this.props.openModal('confirm_settings');
        this.props.setPopout(null);
      })
    })
  }

// автокомплит стран
  searchCountry = (value, obj, name) => { // автокомплит
        let type = 'citySrc';
        if(name == 'countryDst') type = 'cityDst';
        this.setState({ [name]: value, [type]:null });
        this.props.setPopout(<ScreenSpinner />)
        if(value !== 'all') {
        fetch(`https://cors-anywhere.herokuapp.com/https://api.cheapflights.sale/api/Cities/byCountry/${value}`)
        .then(response => response.json())
        .then(list => {
          list.unshift({code:'all', nameTranslations:{ ru: "любой"}})
          let nameCountry = name+"Code";
          this.setState({cities:list, [nameCountry]: obj.name})
      })
      }
      this.props.setPopout(null)
  }

//// автокомплит городов
  searchCity = (value, obj, name) => {
    let nameCity = name+"Code";
    this.setState({ [name]: value, [nameCity]: obj.name});
    console.log(this.state)
  }



  render() {
    const {
      id,
      state,
    } = this.props
    const {
      count_day_Min,
      count_day_Max,
      random_day_count,
      datesCnt,
      currency,
      currencyForUrl,
      language,
      countrySrc,
      countrySrcCode,
      countryDstCode,
      citySrc,
      countryDst,
      cityDst,
      continentDst,
      randomCost,
      randomTempDay,
      randomTempNight,
      costMin,
      costMax,
      dayTempMin,
      dayTempMax,
      nighTempMax,
      nighTempMin,
      days,
      dual,
      updated,
      interval,
      forward,
      activeCnt,
      all_flight
    } = this.state
    return (
      <Panel id={id}>
        <PanelHeader left={<PanelHeaderBack onClick={() => this.props.go('home')}/>}>Мой выбор</PanelHeader>
        <FormLayout>
        <Header style={{ color: 'var(--accent)' }}>Откуда</Header>
          <FormLayoutGroup top="Страна">
            <div align="left" style={{ padding:"0 12px"}}>
              <SelectSearch 
                placeholder="Выберите страну" 
                options={this.state.listCountry.filter((el) => el.code != 'all').map((el, i) => {return {name: el.nameTranslations.ru, value: el.code}})} 
                value={countrySrc} 
                onChange={(value, obj) => this.searchCountry(value, obj, "countrySrc")}
                search
              />
           </div>
          </FormLayoutGroup>
         {countrySrcCode != null ? 
          <FormLayoutGroup top="Город">
          <div align="left" style={{ padding:"0 12px"}}>
            <SelectSearch 
              placeholder="Выберите город" 
              options={this.state.cities.filter((el) => el.code != 'all').map((el, i) => {return {name: el.nameTranslations.ru, value: el.code}})} 
              value={citySrc} 
              onChange={(value, obj) => this.searchCity(value, obj, "citySrc")}
              search
            />
         </div>
        </FormLayoutGroup>:null
         }
         </FormLayout>
         <datalist id='citySrc'>
             <option>любой</option>
            {this.state.data.map((city) => 
             <option value={city.nameTranslations.ru}>{city.code}</option>
            )}
          </datalist>
          <FormLayout>
          <Header style={{ color: 'var(--accent)' }}>Куда</Header>

          <Select
            top="Часть света"
            name="continentDst"
            onChange={(e) => { this.onChange(e); this.setState({countryDst:'all', cityDst:'all'}, console.log(this.state)) }}
            value={continentDst}
          >
            {
              Object.keys(CONTINENT_DST).map((continent) => 
                <option value={continent} key={continent}>
                  {CONTINENT_DST[continent]}
                </option>
              )
            }
          </Select>
            {continentDst == null || continentDst == 'all' ? null :
          <FormLayoutGroup top="Страна">
          <div align="left" style={{ padding:"0 12px"}}>
            <SelectSearch 
              placeholder="Выберите страну" 
              options={this.state.listCountry.filter(city => city.continentCode == continentDst || city.code == 'all').map((el, i) => {return {name: el.nameTranslations.ru, value: el.code}})} 
              value={countryDst} 
              onChange={(value, obj) => this.searchCountry(value, obj, "countryDst")}
              search
            />
         </div>
        </FormLayoutGroup>}

          {countryDst == 'all' || countryDst == null || continentDst == 'all' ? null :
          <FormLayoutGroup top="Город">
          <div align="left" style={{ padding:"0 12px"}}>
            <SelectSearch 
              placeholder="Выберите город" 
              options={this.state.cities.map((el, i) => {return {name: el.nameTranslations.ru, value: el.code}})} 
              value={countryDst} 
              onChange={(value, obj) => this.searchCity(value, obj, "cityDst")}
              search
            />
         </div>
        </FormLayoutGroup>
            }

<FormLayoutGroup top="Направление полетов">
            <SimpleCell after={<Switch name="all_flight" style={checkbox} onChange={(e) => { this.onChangeCheck(e); this.setState({ forward: e.target.checked, dual:e.target.checked})}} checked={all_flight || (dual && forward)} />}>любое</SimpleCell>
            {!all_flight && <SimpleCell after={<Switch name="forward" onChange={this.onChangeCheck} checked={forward} />}>туда</SimpleCell>}
            {!all_flight && <SimpleCell after={<Switch name="dual" style={checkbox} onChange={this.onChangeCheck} checked={dual} />}>туда-обратно</SimpleCell>}
          </FormLayoutGroup> 


      <Header>Когда</Header>
          <Tabs mode="buttons">
            {datesCnt && (
              datesCnt.map((item, i) => <TabsItem style={{ marginLeft: 14 }} selected={activeCnt == i} onClick={() => this.setState({ activeCnt: i })}><Icon28RecentOutline fill={activeCnt == i ? '#0E62F1':'#4BBDE7'}/></TabsItem>)
            )}
            {datesCnt.length < 3 && <TabsItem onClick={this.addFrom}><Icon16Add /></TabsItem>}
            {datesCnt.length > 1 && <TabsItem onClick={this.removeFrom} ><Icon16Cancel fill="rgb(255, 26, 0)"/></TabsItem>}
          </Tabs>
          </FormLayout>
                <FormLayout key={activeCnt}>
                  <Header mode='secondary'>{"Период вылета "+(activeCnt+1)+" "}</Header>
                  <Select
                    top={`год`}
                    name="year"
                    id={activeCnt}
                    onChange={this.onChangeFrom}
                    value={datesCnt[activeCnt].year}
                  >
                    {
                      Array.from(Array(31).keys()).map((year) => 
                        <option key={year} value={(new Date()).getFullYear()+year}>
                          {(new Date()).getFullYear()+year}
                        </option>
                      )
                    }
                  </Select>
                  {datesCnt[activeCnt].season == 'all' && datesCnt[activeCnt].month == '0' && <Select
                    top={`время года`}
                    name="season"
                    id={activeCnt}
                    onChange={this.onChangeFrom}
                    value={datesCnt[activeCnt].season}
                  >
                    {
                      Object.keys(SEASONS_TRANSCRIPTION).filter((e) => {
                        let s = e;
                        let m = new Date().getMonth()+1;
                      if(new Date().getFullYear() == datesCnt[activeCnt].year) {
                        if(s == 'all') 
                          return s;
                        if(s == 'winter' && m <= 12)
                          return s;
                        if(s == 'spring' && m <= 5) 
                          return s;
                        if(s == 'summer' && m <= 8) 
                          return s;
                        if(s == 'fall' && m <= 11)
                          return s;
                      }else return e;
                      }).map((season) => 
                        <option value={season} key={season}>
                          {SEASONS_TRANSCRIPTION[season]}
                        </option>
                      )
                    }
                  </Select>  
                  }   
                 <Select
                    top={`месяц`}
                    name="month"
                    id={activeCnt}
                    onChange={this.onChangeFrom}
                    value={datesCnt[activeCnt].month}
                  >
                    {
                      Object.keys(MONTHS_TRANSCRIPTION).filter((n) => {
                        if(n == 0) {
                          return n;
                        }
                        let m = new Date().getMonth()+1;
                       if(new Date().getFullYear() == datesCnt[activeCnt].year) { 
                        switch(datesCnt[activeCnt].season) {
                          case 'all': 
                            return n;
                          break;

                          case 'winter':
                            if((n == 12 && m <= n) || (n == 1 && m <= n) || (n == 2 && m <= n)) {
                              return n;
                            }
                          break;  
                          case 'summer':
                            if((n == 6 && m <= n) || (n == 7 && m <= n) || (n == 8 && m <= n)) {
                              return n;
                            }
                          break;  
                          case 'fall':
                            if((n == 9 && n >= m) || (n == 10 && n >= m) || (n == 11 && n >= m)) {
                              return n;
                            }
                          break; 

                          case 'spring':
                            if((n == 3 && n >= m) || (n == 4 && n >= m) || (n == 5 && n >= m)) {
                              return n;
                            }
                          break;  
                        }
                      }else{
                        switch(datesCnt[activeCnt].season) {
                          case 'all': 
                            return n;
                          break;

                          case 'winter':
                            if((n == 12 ) || (n == 1) || (n == 2)) {
                              return n;
                            }
                          break;  
                          case 'summer':
                            if((n == 6 ) || (n == 7) || (n == 8)) {
                              return n;
                            }
                          break;  
                          case 'fall':
                            if((n == 9) || (n == 10) || (n == 11)) {
                              return n;
                            }
                          break; 

                          case 'spring':
                            if((n == 3 ) || (n == 4 ) || (n == 5)) {
                              return n;
                            }
                          break;  
                        }
                      }
                      }).map((month) => 
                        <option value={month} key={month}>
                          {MONTHS_TRANSCRIPTION[month]}
                        </option>
                      )
                    }
                  </Select>
                  </FormLayout>
              <FormLayout>     
        
      <FormLayoutGroup top='Количество дней поездки'>
      <SimpleCell after={
                       <Switch
                       checked={random_day_count}
                       onChange={(e) => {
                        if(!((state.my_groups.length+state.countDB) < 2)) 
                         this.setState({
                           count_day_Min: e.currentTarget.checked ? 3 : count_day_Min,
                           count_day_Max: e.currentTarget.checked ? 20 : count_day_Max,
                           random_day_count: e.currentTarget.checked
                         })
                        else this.props.openModal('info_status');
                       }}
                     />
           }>любое</SimpleCell>
          {!random_day_count && 
            <RangeSlider 
              min={3}
              max={20}
              step={1}
              value={[count_day_Min, count_day_Max]}
              defaultValue={[count_day_Min, count_day_Max]}
              onChange={(value) => {
                this.setState({
                  count_day_Min:value[0],
                  count_day_Max:value[1]
                })
              }}
            />
          }

          {!random_day_count && 
                <div style={{ display: 'flex' }}>
                      <Input
                      onFocus={() => {
                        console.log('focus')
                      }}
                      value={count_day_Min}
                      type="number"
                      onChange={(e) => {
                        const value = parseInt(e.currentTarget.value, 10)
                        if(value){
                          if(value < count_day_Max && value >= 3){
                            this.setState({ count_day_Min: value })
                          }
                        }
                      }}
                    />
                    <Input
                      value={count_day_Max}
                      type="number"
                      onChange={(e) => {
                        const value = parseInt(e.currentTarget.value, 10)
                        if(value){
                          if(value > count_day_Min && value <= 20){
                            this.setState({ count_day_Max: value })
                          }
                        }
                      }}
                    />
                </div>    
                    }
      </FormLayoutGroup>

       <Select
            top="Пассажиры"
            name="passengers"
            onChange={this.onChange}
          >
            {
              Object.keys(PASSENGERS).map((passengers) => 
                <option value={passengers} key={passengers}>
                  {PASSENGERS[passengers]}
                </option>
              )
            }
          </Select>             
      
      <Header style={{ color: 'var(--accent)' }}>Выберите условия</Header>
          <Select
            top="Получать дешевые авиабилеты один раз в"
            name="interval"
            onChange={this.onChange}
          >
            <option value="60">1 час</option>
            <option value="240">4 часа</option>
            <option value="480">8 часов</option>
            <option value="1440">24 часа</option>
          </Select>

          <Select
            top="Получать информацию за крайние N, часов"
            name="updated"
            onChange={this.onChange}
            defaultValue="60"
          >
      <option value="60">1 час</option>
      {Number(interval) > 60 ? <option value="120">2 часа</option> : null}
      {Number(interval) > 60 ? <option value="180">3 часа</option> : null}
      {Number(interval) > 60 ? <option value="240">4 часа</option> : null}
      {Number(interval) > 240 ? <option value="240">5 часов</option> : null}
      {Number(interval) > 240 ? <option value="240">6 часов</option> : null}
      {Number(interval) > 240 ? <option value="240">7 часов</option> : null}
      {Number(interval) > 240 ? <option value="240">8 часов</option> : null}
      </Select>

          <Select
            top="Сколько дешевых авиабилетов показывать в сутки?"
            name="limit"
            defaultValue="0"
          >
            <option value="0">все</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="300">300</option>
          </Select>
                     
         
          <Select
            top="Язык"
            name="language"
            onChange={this.onChange}
            value={language}
          >
            {
              Object.keys(LANGUAGES).map((language) => 
                <option value={language} key={language}>
                  {LANGUAGES[language]}
                </option>
              )
            }
          </Select>
          <Select
            top="Валюта в билете"
            name="currency"
            onChange={(e) => {this.onChange(e); this.setState({randomCost:true, costMin:CURRENCY[e.currentTarget.value].min, costMax:CURRENCY[e.currentTarget.value].max})}}
            value={currency}
          >
            {
              Object.keys(CURRENCY).map((currency) => 
                <option value={currency} key={currency}>
                  {CURRENCY[currency].name}
                </option>
              )
            }
          </Select>
          <Select
            top="Валюта покупки"
            name="currencyForUrl"
            onChange={this.onChange}
            value={currencyForUrl}
          >
            {
              Object.keys(CURRENCY).map((currency) => 
                <option value={currency} key={currency}>
                  {CURRENCY[currency].name}
                </option>
              )
            }
          </Select>

          <FormLayoutGroup top={"Выберите минимальную и максимальную стоимость авиабилетов, " + currency}>
          

           <SimpleCell after={
                       <Switch
                       checked={randomCost}
                       onChange={(e) => {
                         this.setState({
                           costMin: e.currentTarget.checked ? CURRENCY[currency].min : costMin,
                           costMax: e.currentTarget.checked ? CURRENCY[currency].max : costMax,
                           randomCost: e.currentTarget.checked
                         })
                       }}
                     />
           }>любая</SimpleCell>
            
           {!randomCost &&
          <RangeSlider
            top={costMin + " - " + costMax}
            min={CURRENCY[currency].min}
            max={CURRENCY[currency].max}
            step={100}
            defaultValue={[costMin, costMax]}
            value={[costMin, costMax]}
            onChange={(value) => {
              this.setState({
                costMin: value[0],
                costMax: value[1],
                randomCost: false
              })
            }}
          />
          }
          {!randomCost &&
          <div style={{ display: 'flex' }}>
            <Input
              onFocus={() => {
                console.log('focus')
              }}
              value={costMin}
              type="number"
              onChange={(e) => {
                const value = parseInt(e.currentTarget.value, 10)
                if(value){
                  if(value < costMax && value >= CURRENCY[currency].min){
                    this.setState({ costMin: value })
                  }
                }
              }}
            />
            <Input
              value={costMax}
              type="number"
              onChange={(e) => {
                const value = parseInt(e.currentTarget.value, 10)
                if(value){
                  if(value > costMin && value <= CURRENCY[currency].max){
                    this.setState({ costMax: value })
                  }
                }
              }}
            />
          </div>
  }
          </FormLayoutGroup> 
          <Select name='profitability' onChange={this.onChange} top="Показывать авиабилеты только с выгодой больше, %">
            <option value='30'>30</option>
            {(state.my_groups.length+state.countDB) >= 2 && <option value='30'>40</option>}
            {(state.my_groups.length+state.countDB) >= 5 && <option value='30'>50</option>}
            {(state.my_groups.length+state.countDB) >= 10 && <option value='30'>60</option>}
            {(state.my_groups.length+state.countDB) >= 15 && <option value='30'>70</option>}
            {(state.my_groups.length+state.countDB) >= 15 && <option value='30'>80</option>}
            {(state.my_groups.length+state.countDB) >= 15 && <option value='30'>90</option>}
          </Select>
          <FormLayoutGroup top="Хочу вылететь в определенный день недели">
              <SimpleCell after={<Switch checked={this.state.allDays} name='all' onChange={(e) => {if(!((state.my_groups.length+state.countDB) < 5)) this.onChangeDays(e); else this.props.openModal('info_status')}} />}>в любой</SimpleCell>
              {!this.state.allDays &&
              <div>
                <SimpleCell after={<Switch name='0' onChange={this.onChangeDays} checked={days[0] || this.state.allDays} />}>понедельник</SimpleCell>
                <SimpleCell after={<Switch name='1' onChange={this.onChangeDays} checked={days[1] || this.state.allDays} />}>вторник</SimpleCell>
                <SimpleCell after={<Switch name='2' onChange={this.onChangeDays} checked={days[2] || this.state.allDays} />}>среда</SimpleCell>
                <SimpleCell after={<Switch name='3' onChange={this.onChangeDays} checked={days[3] || this.state.allDays} />}>четверг</SimpleCell>
                <SimpleCell after={<Switch name='4' onChange={this.onChangeDays} checked={days[4] || this.state.allDays} />}>пятница</SimpleCell>
                <SimpleCell after={<Switch name='5' onChange={this.onChangeDays} checked={days[5] || this.state.allDays} />}>суббота</SimpleCell>
                <SimpleCell after={<Switch name='6' onChange={this.onChangeDays} checked={days[6] || this.state.allDays} />}>воскресенье</SimpleCell>
                
              
              
              
              
              
              
              </div>
              }
          </FormLayoutGroup>  
          <FormLayoutGroup top="Температура воздуха днем в день прилета, C">
              <SimpleCell after={          
          <Switch
            checked={randomTempDay}
            onChange={(e) => {
              if(!((state.my_groups.length+state.countDB) < 1)) 
              this.setState({
                dayTempMin: e.currentTarget.checked ? -50 : dayTempMin,
                dayTempMax: e.currentTarget.checked ?  50 : dayTempMax,
                randomTempDay: e.currentTarget.checked
              });
              else this.props.openModal('info_status')
            }}
          />}>
                любая
              </SimpleCell>

            
         {!randomTempDay &&
          <RangeSlider
            min={-50}
            max={50}
            step={1}
            defaultValue={[dayTempMin, dayTempMax]}
            value={[dayTempMin, dayTempMax]}
            onChange={(value) => {
              this.setState({
                dayTempMin: value[0],
                dayTempMax: value[1],
                randomTempDay: false
              })
            }}
          />
          }
          {!randomTempDay &&
          <div style={{ display: 'flex' }}>
            <Input
              onFocus={() => {
                console.log('focus')
              }}
              value={dayTempMin}
              type="number"
              onChange={(e) => {
                const value = parseInt(e.currentTarget.value, 10)
                if(value){
                  if(value < dayTempMax && value >= -50){
                    this.setState({ dayTempMin: value })
                  }
                }
              }}
            />
            <Input
              value={dayTempMax}
              type="number"
              onChange={(e) => {
                const value = parseInt(e.currentTarget.value, 10)
                if(value){
                  if(value > dayTempMin && value <= 50){
                    this.setState({ dayTempMax: value })
                  }
                }
              }}
            />
          </div>
          }     
          </FormLayoutGroup>
          
          <FormLayoutGroup top="Температура воздуха ночью в день прилета, C">     
            <SimpleCell after={
                         <Switch
                         checked={randomTempNight}
                         onChange={(e) => {
                          if(!((state.my_groups.length+state.countDB) < 1)) 
                           this.setState({
                             nighTempMin: e.currentTarget.checked ? -50 : nighTempMin,
                             nighTempMax: e.currentTarget.checked ?  50 : nighTempMax,
                             randomTempNight: e.currentTarget.checked
                           });
                           else this.props.openModal('info_status')
                         }}
                       />
            }>любая</SimpleCell>    

          {!randomTempNight &&
          <RangeSlider
            min={-50}
            max={50}
            step={1}
            defaultValue={[nighTempMin, nighTempMax]}
            value={[nighTempMin, nighTempMax]}
            onChange={(value) => {
              this.setState({
                nighTempMin: value[0],
                nighTempMax: value[1],
                randomTempNight: false
              })
            }}
          />
          }
          {!randomTempNight && 
           <div style={{ display: 'flex' }}>
            <Input
              onFocus={() => {
                console.log('focus')
              }}
              value={nighTempMin}
              type="number"
              onChange={(e) => {
                const value = parseInt(e.currentTarget.value, 10)
                if(value){
                  if(value < nighTempMin && value >= -50){
                    this.setState({ nighTempMin: value })
                  }
                }
              }}
            />
            <Input
              value={nighTempMax}
              type="number"
              onChange={(e) => {
                const value = parseInt(e.currentTarget.value, 10)
                if(value){
                  if(value > nighTempMax && value <= 50){
                    this.setState({ nighTempMax: value })
                  }
                }
              }}
            />
          </div>
            }
          </FormLayoutGroup>
          <Button mode='primary' size='xl' onClick={this.sort_res}>Подписаться</Button>
        </FormLayout>
        {this.state.snackbar}
      </Panel>
    )
  }
}

export default Settings 
