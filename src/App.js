import React from 'react'
import { Epic, Tabbar, TabbarItem, View, Panel, ModalRoot, ModalPage,  Div, List, Title, FormLayout, Switch, Cell, ScreenSpinner, Button, ModalPageHeader, Card, ConfigProvider, Spinner, Avatar, Link , Input, SimpleCell, IS_PLATFORM_IOS , IS_PLATFORM_ANDROID , PanelHeaderButton, ModalCard, Text, Radio, Snackbar, RichCell } from '@vkontakte/vkui'
import bridge from '@vkontakte/vk-bridge'
import axios from 'axios';
import {Howl, Howler} from 'howler';
import { VKMiniAppAPI  } from '@vkontakte/vk-mini-apps-api';
 

// icons
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon28GlobeOutline from '@vkontakte/icons/dist/28/globe_outline';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28Settings from '@vkontakte/icons/dist/28/settings';
import Icon28HomeOutline from '@vkontakte/icons/dist/28/home_outline';
import Icon28Users from '@vkontakte/icons/dist/28/users';
import Icon28Send from '@vkontakte/icons/dist/28/send';
import Icon28HelpOutline from '@vkontakte/icons/dist/28/help_outline';
import Icon28ServicesOutline from '@vkontakte/icons/dist/28/services_outline';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon28MenuOutline from '@vkontakte/icons/dist/28/menu_outline';
import Icon20GlobeOutline from '@vkontakte/icons/dist/20/globe_outline';
import Icon28NarrativeOutline from '@vkontakte/icons/dist/28/narrative_outline';
import Icon36Article from '@vkontakte/icons/dist/36/article';
import Icon28LinkOutline from '@vkontakte/icons/dist/28/link_outline';
import Icon56RecentOutline from '@vkontakte/icons/dist/56/recent_outline';


// panels
import Groups from './panels/Groups'
import User from './panels/User';
import GroupInfo from './panels/GroupInfo';
import Catalog from './panels/Catalog'
import SectionCatalog from './panels/SectionCatalog'
import MySubs from './panels/MySubs'
import Services from './panels/Services';
import Aviasales from './panels/Aviasales';
import Help from './panels/Help';
import Friends from './panels/Friends'
import Settings from './panels/Settings'
import EditSettings from './panels/EditSettings';
import Admin from './panels/Admin';
import QR from './components/QR';
import SnackbarError from './components/SnackbarError';

const api  = new VKMiniAppAPI();

const blue = {
  color:'var(--accent)'
}

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
//https://appvk.flights.ru/?vk_access_token_settings=groups&vk_app_id=7453233&vk_are_notifications_enabled=0&vk_group_id=194458223&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=267319094&vk_viewer_group_role=admin&sign=47OlYAJq9Er-BJcvHTQ9RIlZkCGgh9d36tj519NRcGU

class App extends React.Component {
  audio = null;

  state = {
    activeStory: 'subscribes',
    activePanel: 'home',
    theme: 'bright_light',
    activeModal: null,
    popout: null,
    currentCatalog: 0,
    currentGroup:"",
    catalog:null,
    appId: null,
    user:{},
    type: null,
    marker:122890,
    marker_ozon:'uvw34jlz',
    marker_aviakassa:1543,
    marker_booking:1540284,
    is_first:true,
    is_admin:false,
    is_meta:false,
    activeTab: 'groups',
    countGroups:null,
    countDB:10,
    my_groups:[],
    history:[{}],

    go_to_help: null,

    go_to_service_activeMenu: null,
    go_to_service_text: null,
    go_to_active_Of:0,
    go_to_service_viget: null,

    snackbar:null,

    activeTabSub: 'groups',


    info_viget:{header: '', caption: ''},

    form:null, //state для проброса значений из редактора подписки(база данных)
    obj:{
      from:[],
      to:[],
      all:false
    } , //state для проброса значений из создания и редоктирования подписки база данных
    data:[],
  }

  componentDidMount() {
    // Получаем данные о пользователе и каналы
    api.initApp();
    api.onUpdateConfig(this.setTheme)
    api.onViewHide(() => { Howler.volume(0)});
    api.onViewRestore(() => { Howler.volume(1)});
    this.setPopout(<ScreenSpinner />)
    bridge.sendPromise("VKWebAppGetUserInfo")
    .then(user => {
      if(window.location.hash) {
        let id = window.location.hash.split('ref')[1];
        axios.post('https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/user/' + user.id + '/data/sub_user_id', { value: id})
        .then(response => {
          axios.get('https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/user/' + user.id + '/data?keys=marker,marker_ozon,marker_booking,sub_user_id')
          .then(data => {
            let obj  = { marker:122890, marker_booking: 'uvw34jlz', marker_ozon:1540284};
            if(data.data) {
              obj = { ...obj, ...data.data}
              if(obj.sub_user_id) {
                axios.get('https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/user/' + obj.sub_user_id + '/data?keys=marker,marker_ozon,marker_booking')
                .then(data => {
                  Object.keys(obj).forEach(key => {
                    if(obj[key] == null) {
                      obj[key] = data[key];
                    } 
                  })
                  console.log(obj)
                  this.setState({ ...obj })
                })
              }
            }
          })
      })
    } else {
      axios.get('https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/user/' + user.id + '/data?keys=marker,marker_ozon,marker_booking,sub_user_id')
      .then(data => {
        let obj  = { marker:122890, marker_booking: 'uvw34jlz', marker_ozon:1540284};
        if(data.data) {
          obj = { ...obj, ...data.data}
          if(obj.sub_user_id) {
            axios.get('https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/user/' + obj.sub_user_id + '/data?keys=marker,marker_ozon,marker_booking')
            .then(data => {
              Object.keys(obj).forEach(key => {
                if(obj[key] == null) {
                  obj[key] = data[key];
                } 
              })
              console.log(obj)
              this.setState({ ...obj })
            })
          }
        }
      })
    }



      if(user.id == 267319094 || user.id == 382960669 || user.id == 448030989 || user.id == 567797551) {
        this.setState({ is_admin:true})
      }
        this.setState({
          activeStory:'subscribes',
          appId: parseInt(window.location.href.split("vk_app_id=")[1].split("&")[0], 10),
          user,
          platform:this.props.platform
        })
        this.setPopout(null)
       }
      )

      axios.get("https://cors-anywhere.herokuapp.com/https://api.cheapflights.sale/api/Channels")
      .then(async data => {
        console.log(this.state)
        this.setState({ data:data.data})
        await this.sortData(data.data)
      })

            
          
  }

  setTheme = (e) => {
    
    this.setState({ theme: e.scheme})
  }

  goViget = (e) => {
    this.setState({ go_to_service_text:e.group, go_to_service_viget:e.viget, go_to_service_activeMenu: e.activeMenu, go_to_active_Of: e.i, activeStory: 'services'})
  }

  on_audio = (sound) => {
    this.audio = new Howl({ 
      src:[sound],
      loop: true,
      volume:0.3,
      autoplay:true
    })
  }

  stop_audio = () => {
    if(this.audio) {
      this.audio.stop();
    }
  }

  // Приведение каналов в адекватный вид:
  // [
  //   {
  //     catalog: "catalog name",
  //     to: [
  //       "country",
  //       {
  //         "section": "в европу",
  //         arr: [
  //           "country"
  //         ]
  //       }
  //     ]
  //   }
  // ]
  sortData = async data => {
    const catalog = []
    data.forEach(async item => {
      let index = catalog.findIndex(a => a.catalog === item.catalog)
      if(index === -1){
        catalog.push({
          catalog: item.catalog,
          to: []
        })
        index = catalog.length-1
      }
      if(item.section){
        const sectionIndex = catalog[index].to.findIndex(a => a.section === item.section)
        if(sectionIndex === -1){
          catalog[index].to.push({
            section: item.section,
            arr: [item]
          })
        }else{
          catalog[index].to[sectionIndex].arr.push(item)
        }
      }else{
        catalog[index].to.push(item)
      }
    })
    catalog.shift()
    catalog.splice(catalog.findIndex(a => a.catalog === ""),1)
    this.setState({ catalog })
  }
  
  // Смена табов
  onStoryChange = (e) => {
    this.setState({ activeStory: e.currentTarget.dataset.story, activePanel: 'home' })
  }

  // Рисование попаута
  setPopout = popout => {
    this.setState({ popout })
  }

  // Открытие той или иной части света
  openCatalog = e => {
    this.setState({ 
      activePanel: 'catalog',
      currentCatalog: parseInt(e.currentTarget.id, 10),
    })
  }
  //открытие модалки
  openModal = modal => {
  
    this.setState({activeModal: modal});
  }
 // не используется
  chooseGlobal = ( data) => {
    this.setState({[this.state.changeDefaultName]: data});
  }

  // Изменение панели
  go = activePanel => {
    this.setState({ activePanel, currentSection: null })
  }

  // Открыть секцию
  chooseSection = e => {
    this.setState({ activePanel: "sectionCatalog", currentSection: parseInt(e.currentTarget.id, 10) })
  }

  save_request = () => {  //сохранение подписки
    this.setState({ popout: <ScreenSpinner /> });
    axios.get('https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/groups?sex=' + this.state.user.sex)
    .then(groups => {
    bridge.sendPromise("VKWebAppAllowMessagesFromGroup", {"group_id": groups.data[this.state.countDB > 21 ? 21 : this.state.countDB]})
    .then(() => {
      fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/save-user-api-request", {
        "headers": {
          "accept": "*/*",
          "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json;charset=utf-8",
        },
        "referrer": "https://appvk.flights.ru/",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": JSON.stringify({...this.state.item, group_id:groups.data[this.state.countDB]}),
        "method": "POST",
      })
      .then(response => response.json())
      .then(check => {
        if(check.response === 'ok'){
          this.setState({ popout: null,countDB:this.state.countDB+1, activeModal: null, activePanel:'home', activeTabSub: 'database'});
        
        }
        }).catch(err => {
          this.setState({snackbar:<SnackbarError close={() => this.setState({snackbar:null})} />})
          this.setState({ popout: null });
    })
  })
  }).catch(() => this.setPopout(null))
  }
  
  //редактирование state(Дял формы редактирования и создания подписки на сообщества)
  onChangeGroups = (name, obj) => {

   this.setState({ [name]: obj });
  }


  choose = e => {
    this.setState({
      obj:{ ...this.state.obj,
      [e.currentTarget.name]: this.state.obj[e.currentTarget.name].map((item, i) => {
        if(i === parseInt(e.currentTarget.id, 10)){
          item.checked = e.currentTarget.checked
          return item
        }else{
          return item
        }
      })
    }
    })
    let bool = true;
    this.state.obj.from.forEach(element => {
      if(!element.checked) {
        bool = false;
      }
    });
    this.state.obj.to.forEach(element => {
      if(!element.checked) {
        bool = false;
      }
    })
    this.setState({ obj:{ ...this.state.obj,all:bool }})
  }

  //открытие группы
  goGroup = (item) => {
    this.setState({ currentGroup: item, activePanel:'group'});
  }
  //выбераем все для настройки в разделе витрина
  chooseAll = () => {
    let bool = !this.state.obj.all;
    const { from , to} = this.state.obj;
    this.setState({
      obj: {
      ...this.state.obj,
      from: from.map((item, i) => {  
          item.checked = bool;
          return item
      }),
      to: to.map((item, i) => {  
        item.checked = bool;
        return item
    }), all:bool
  }
    })
  }

  // сохранение подписки(настройка)
  submit = async () => {
    const { from, to, name, groupId, screenName } = this.state.obj;
    const { catalog, currentCatalog, currentSection, user} = this.state;
    this.setPopout(<ScreenSpinner />);
    if(from.filter((item) => item.checked).length > 0 && 
      to.filter((item) => item.checked).length > 0
    ){
      let arr = []
      arr = arr.concat(from.filter((item) => item.checked)
      .map((item) => item.tag+"/"+groupId+"/"+name+"/"+catalog[currentCatalog].catalog+"/"+(currentSection ? currentSection : "Любой")))
      arr = arr.concat(to.filter((item) => item.checked)
      .map((item) => item.tag+"/"+groupId+"/"+name+"/"+catalog[currentCatalog].catalog+"/"+(currentSection ? currentSection : "Любой")))

      fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/get-tags", {
        "headers": {
          "accept": "*/*",
          "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json;charset=utf-8",
        },
        "body": JSON.stringify({
          user_id: String(user.id)
        }),
        "method": "POST",
      })
      .then(response => response.json())
      .then(data => {
        if(data.tags.length > 0){
          arr = arr.concat(
            data.tags.map((item) => 
              item.body+"/"+item.group_id+"/"+item.group_name+"/"+item.category+"/"+item.section
            )
          )
        }
        fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/save-tags", {
          "headers": {
            "accept": "*/*",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json;charset=utf-8",
          },
          "referrer": "https://appvk.flights.ru/",
          "referrerPolicy": "no-referrer-when-downgrade",
          "body": JSON.stringify({
            user_id: String(user.id),
            checkbox: arr
          }),
          "method": "POST",
        })
        .then(response => response.json())
        .then(check => {
          fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/save-groups", {
            "headers": {
              "accept": "*/*",
              "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
              "content-type": "application/json;charset=utf-8",
            },
            "referrer": "https://appvk.flights.ru/",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": JSON.stringify({
              user_id: String(user.id),
              checkbox: arr,
              app_id:7529463,
            }),
            "method": "POST",
          })
          .then(response => response.json())
          .then(d => {
          if(check.response === 'ok'){
            let arr = this.state.my_groups.push(screenName)
    
            this.setState({ popout: null, activeModal: null});
          }
        })
      })
      })
    }
  }
  //получаем статус
  getStatus(n) {
    let name = 'Посетитель'
     if(n == 0 || n == 1) {
         return 'Посетитель';
     }else if(n >= 2 && n < 5) {
         return 'Пользователь'
     } else if(n >=5 && n < 10) {
         return 'Опытный пользователь'
     } else if(n >=10 && n < 15) {
         return 'Путешественник'
     } else {
         return 'Опытный путешественник'
     }

  }

  save_marker = (e) => {
    this.setPopout(<ScreenSpinner />);
    axios.post('https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/user/' + this.state.user.id + '/data/' + e, { value: this.state[e]})
    .then(response => {
      this.setPopout(null)
      this.setState({ status: "Маркер сохранен"})
      setTimeout(() => {this.setState({status: null})}, 1000)})
    }
    


  render () {
    const {
      activePanel,
      popout,
      defaultCountry,
      chooseCountryText,
      changeFunction,
      changeDefaultName,
      friend,
      calendar,
      item
    } = this.state
    const {
      from,
      to,
      all
    } = this.state.obj;
    return (
      <ConfigProvider isWebView={true} scheme={this.state.theme}>
      <Epic activeStory={this.state.activeStory}  tabbar={
        <Tabbar>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'about'}
            data-story="about"
            text="Помощь"
          ><Icon28HelpOutline /></TabbarItem>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'subscribes'}
            data-story="subscribes"
            text="Подписки"
          ><Icon28NarrativeOutline /></TabbarItem>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'friends'}
            data-story="friends"
            text="Друзья"
          ><Icon28Users /></TabbarItem>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'aviasales'}
            data-story="aviasales"
            text="Авиабилеты"
          ><Icon28Send /></TabbarItem>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'services'}
            data-story="services"
            text="Сервисы"
          ><Icon28ServicesOutline /></TabbarItem>
          {this.state.is_admin && <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'admin'}
            data-story="admin"
            text="Админ">
              
          </TabbarItem>}
        </Tabbar>
      }>

        <View id='about' activePanel={activePanel} popout={popout} modal={
          <ModalRoot activeModal={this.state.activeModal}>
            <ModalCard 
              id='status'
              onClose={() => this.setState({ activeModal: null })}
              header={this.state.user.first_name + " " + this.state.user.last_name}
              icon={<Avatar size={96} src={this.state.user.photo_200}/>}
              caption={<span>{this.state.user.city && this.state.user.city.title}<br />{"текущий статус - " + this.getStatus(this.state.countDB + this.state.my_groups.length)}<br />Подписки на дешевые авиабилеты<br />Раздел "витрина" - {this.state.my_groups.length}<br />Раздел "Мой выбор" - {this.state.countDB}<br />Всего подписок - {(this.state.countDB + this.state.my_groups.length)}</span>}
            />
            <ModalCard 
              id='dark' 
              icon={<Icon56RecentOutline />}
              onClose={() => this.setState({ activeModal: null})}
              header="Включить темную тему?" 
              actions={[
                {
                 title: 'Включить',
                  mode: 'primary',
                  action: () => {
                    this.setState({ theme: 'space_gray', activeModal: null})
                 }
                }
              ]}
            />
            <ModalPage id='save_marker_trevel' onClose={() => this.setState({ activeModal: null, type: null})} header={<ModalPageHeader>Travelpayouts</ModalPageHeader>} dynamicContentHeight>
              <Div>
                <Radio name='type' value='user' onChange={(e) => this.setState({ type: e.target.value })}>Буду пользоваться {this.state.user.sex == 2 ? 'сам':'сама'}</Radio>
                <Radio name='type' value='admin' onChange={(e) => this.setState({ type: e.target.value })}>Установлю в своё сообщество или пошлю ссылку друзьям</Radio>

                <Input style={{ marginTop: 12 }} onChange={(e) => this.setState({ marker: e.target.value})} type='tel' min={100000} max={999999} placeholder='Введите маркер' />
                <Button size='xl' style={{ marginTop: 12}} disabled={this.state.type == null} onClick={() => this.save_marker('marker')}>Сохранить</Button>
                {this.state.status && <SimpleCell description={this.state.status}></SimpleCell>}
                {this.state.type === 'admin' &&
                  <RichCell disabled actions={
                  <>
                    <Button onClick={() => { bridge.send("VKWebAppCopyText", {"text": "https://vk.com/app7529463#ref" + this.state.user.id}); this.setState({ status: "Ссылка скопирована"}); setTimeout(() => {this.setState({status: null})}, 1000)}}>Копировать</Button>
                    <Button onClick={() => bridge.send("VKWebAppShare", {"link": "https://vk.com/app7529463#ref" + this.state.user.id}).then().catch()}>Поделиться</Button>
                  </>} multiline caption='Ссылка для установки гипермаркета "Дешевые авиабилеты" в сообщество'><Link>{"vk.com/app7529463#ref" + this.state.user.id}</Link></RichCell>
                }
                
              </Div>
            </ModalPage>
            <ModalPage id='save_marker_booking' onClose={() => this.setState({ activeModal: null, type: null})} header={<ModalPageHeader>Booking</ModalPageHeader>} dynamicContentHeight>
              <Div>
                <SimpleCell disabled multiline><Title level='3' weight='heavy'>Ваш статус в социальной сети vk.com?</Title></SimpleCell>
                <Radio name='type' value='user' onChange={(e) => this.setState({ type: e.target.value })}>Буду пользоваться {this.state.user.sex == 2 ? 'сам':'сама'}</Radio>
                <Radio name='type' value='admin' onChange={(e) => this.setState({ type: e.target.value })}>Установлю в своё сообщество или пошлю ссылку друзьям</Radio>
                <Input style={{ marginTop: 12 }} onChange={(e) => this.setState({ marker_booking: e.target.value})} placeholder='Введите маркер' />
                <Button size='xl' style={{ marginTop: 12}} onClick={() => this.save_marker('marker_booking')}>Сохранить</Button>
                {this.state.status && <SimpleCell description={this.state.status}></SimpleCell>}
                {this.state.type === 'admin' &&
                  <RichCell disabled actions={
                  <>
                    <Button onClick={() => { bridge.send("VKWebAppCopyText", {"text": "https://vk.com/app7529463#ref" + this.state.user.id}); this.setState({ status: "Ссылка скопирована"}); setTimeout(() => {this.setState({status: null})}, 1000)}}>Копировать</Button>
                    <Button onClick={() => bridge.send("VKWebAppShare", {"link": "https://vk.com/app7529463#ref" + this.state.user.id}).then().catch()}>Поделиться</Button>
                  </>} multiline caption='Ссылка для установки гипермаркета "Дешевые авиабилеты" в сообщество'><Link>{"vk.com/app7529463#ref" + this.state.user.id}</Link></RichCell>
                }
              </Div>
              {this.state.snackbar}
            </ModalPage>
            <ModalPage id='save_marker_ozon' onClose={() => this.setState({ activeModal: null, type: null})} header={<ModalPageHeader>Ozon</ModalPageHeader>} dynamicContentHeight>
              <Div>
                <SimpleCell disabled multiline><Title level='3' weight='heavy'>Ваш статус в социальной сети vk.com?</Title></SimpleCell>
                <Radio name='type' value='user' onChange={(e) => this.setState({ type: e.target.value })}>Буду пользоваться {this.state.user.sex == 2 ? 'сам':'сама'}</Radio>
                <Radio name='type' value='admin' onChange={(e) => this.setState({ type: e.target.value })}>Установлю в своё сообщество или пошлю ссылку друзьям</Radio>
                <Input style={{ marginTop: 12 }} onChange={(e) => this.setState({ marker_ozon: e.target.value})} placeholder='Введите маркер' />
                <Button size='xl' style={{ marginTop: 12}} onClick={() => this.save_marker('marker_ozon')}>Сохранить</Button>
                {this.state.type === 'admin' &&
                  <RichCell disabled actions={
                  <>
                    <Button onClick={() => { bridge.send("VKWebAppCopyText", {"text": "https://vk.com/app7529463#ref" + this.state.user.id}); this.setState({ status: "Ссылка скопирована"}); setTimeout(() => {this.setState({status: null})}, 1000)}}>Копировать</Button>
                    <Button onClick={() => bridge.send("VKWebAppShare", {"link": "https://vk.com/app7529463#ref" + this.state.user.id}).then().catch()}>Поделиться</Button>
                  </>} multiline caption='Ссылка для установки гипермаркета "Дешевые авиабилеты" в сообщество'><Link>{"vk.com/app7529463#ref" + this.state.user.id}</Link></RichCell>
                }
              </Div>
              {this.state.snackbar}
            </ModalPage>
          </ModalRoot>
        }>
            <Help id='home' 
                  onChangeGroups={this.onChangeGroups}
                  state={this.state} 
                  openModal={this.openModal}
                  goViget={this.goViget}
                  stop_audio={this.stop_audio}
                  marker={this.state.marker}
                  setPopout={this.setPopout}/>

        </View>

       <View id='services' activePanel={activePanel} popout={popout} modal={
         <ModalRoot activeModal={this.state.activeModal}>
           <ModalPage 
              id='info_viget'
              header={<ModalPageHeader right={<PanelHeaderButton onClick={() => this.setState({ activeModal: null })}><Icon24Dismiss /></PanelHeaderButton>}>{this.state.info_viget.header}</ModalPageHeader>}
              onClose={() => this.setState({ activeModal: null })}
           >
             <SimpleCell disabled before={<Icon36Article fill='var(--accent)' height={28} width={28} />} multiline>
              {this.state.info_viget.caption}
             </SimpleCell>
             <SimpleCell before={<Icon28LinkOutline />} multiline>
              <Link href={this.state.info_viget.href} target='_blank'>Перейти на сайт</Link>
             </SimpleCell>
             {this.state.info_viget.header == 'vk.com/poputchiki' && 
              <div>
                    <SimpleCell multiline before={<Icon28GlobeOutline />} href='https://vk.com/board22763723' target='_blank'><Link>более 19000 обсуждений по всем странам мира</Link></SimpleCell>
                    <SimpleCell multiline before={<Icon28ViewOutline />} href='https://vk.com/page-22763723_52665761' target='_blank'><Link>правила публикации</Link></SimpleCell>
                    <SimpleCell multiline before={<Icon28ListOutline />} href='https://vk.com/page-22763723_52665761' target='_blank'><Link>меню сообщества</Link></SimpleCell>
              </div>
             }
             </ModalPage>
         </ModalRoot>
       }>
          <Services 
            id='home'
            stop_audio={this.stop_audio}
            goViget={this.goViget}
            openModal={this.openModal}
            onChangeGroups={this.onChangeGroups}
            setPopout={this.setPopout}
            state={this.state}
          />
       </View>

        <View id="subscribes" activePanel={activePanel} popout={popout} modal={
        <ModalRoot activeModal={this.state.activeModal}>
          <ModalPage id='subscribeCities' onClose={() => this.setState({ activeModal:null, obj:{to:[], from:[], all:false}} )} dynamicContentHeight settlingHeight={100} header={<ModalPageHeader>Настройка</ModalPageHeader>}>
          <div style={{ position: "relative", textAlign: "left", overflowX: "hidden", overflowY: "auto", backgroundColor:'#fff' }} className="SubscribeCities">
          <Cell indicator={<Switch checked={all || (!all && from.findIndex(t => t.checked == false) == -1 && to.findIndex(t => t.checked == false) == -1)} onChange={this.chooseAll}/>}>Показывать все</Cell>
          <Div style={{ paddingTop: 0 }}>
          <Title level="3" weight="bold" style={{ paddingBottom: '11px', paddingTop: 11}}>Показывать авиабилеты из</Title>
            {
              from && (
                from.map((item, index) => 
                  <SimpleCell style={{ padding: 0}} after={                  
                  <Switch
                    key={index}
                    id={index}
                    name="from"
                    onChange={this.choose}
                    checked={item.checked}

                  />}>
                    {item.tag.split("#")[1].split("@")[0]}
                  </SimpleCell>         
                )
              )
            }
            <Title level="3" weight="bold" style={{ padding: '11px 0'}}>Показывать авиабилеты в</Title>
            {
              to && (
                to.map((item, index) => 
                <SimpleCell style={{ padding: 0}} after={                  
                  <Switch
                    key={index}
                    id={index}
                    name="to"
                    onChange={this.choose}
                    checked={item.checked}

                  />}>
                    {item.tag.split("#")[1].split("@")[0]}
                  </SimpleCell>   
                )
              )
            } 
          </Div>
          <Div style={{ paddingTop:8}}>
          <Button size='xl' onClick={this.submit} disabled={from.findIndex(t => t.checked == true) === -1 && to.findIndex(t => t.checked == true) == -1}>Применить</Button>
          </Div>
        </div>
          </ModalPage>
          <ModalPage id='confirm_settings' header={<ModalPageHeader>Подтверждение</ModalPageHeader>} onClose={() => this.setState({ activeModal: null})} settlingHeight={100}>
      
              {item && 
              <Card size="l" mode="shadow">
                  <Div style={{ padding: '20px', lineHeight: 1.5 }}>
                    Из страны <b style={blue}>{
                    (item.output).countrySrc ? (item.output).countrySrc : "любая"
                    }</b> и города <b style={blue}>{(item.output).citySrc ? (item.output).citySrc : "любой"}</b><br />
                    В часть света <b style={blue}>{CONTINENTS[(item.output).continentDst]}</b> и страну <b  style={blue}>{(item.output).countryDst ? (item.output).countryDst : "любая"}</b><br />
                    В город <b  style={blue}>{(item.output).cityDst ? (item.output).cityDst : "любой"}</b><br />
                    {
                      (item.output).dates.map((item, i) => 
                        <div key={i}>
                          <div style={{ color: 'var(--tabbar_inactive_icon)' }}>Период вылета {i+1}</div>
                          год <b  style={blue}>{item.year}</b><br />
                          {item.month == '0' && <span>время года <b  style={blue}>{SEASONS_TRANSCRIPTION[item.season]}</b><br /></span>}
                          месяц <b  style={blue}>{MONTHS_TRANSCRIPTION[item.month]}</b><br />
                        </div>    
                      )
                    }<br />
                    Направление полетов: туда-обратно - <b  style={blue}>{(item.output).dual ? "да" : "нет"}</b><br />
                    Направление полетов: туда - <b  style={blue}>{(item.output).forward ? "да" : "нет"}</b><br />
                    Пассажиры <b style={blue}>{PASSENGERS[(item.output).passengers]}</b><br />
                    Цена от <b style={blue}>{(item.output).costMin}</b> до <b style={blue}>{(item.output).costMax}</b> {CURRENCY1[(item.output).currency]}<br />

                    Период показа <b style={blue}>{(item.output).interval}</b> минут<br />
                    Глубина поиска <b style={blue}>{(item.output).updated}</b> минут<br />
                    Максимальное количество билетов за 24 часа <b style={blue}>{(item.output).limit === "0" ? "все" : (item.output).limit}</b><br />
                    Язык <b style={blue}>{LANGUAGES[(item.output).language]}</b><br />
                    Валюта (цена) <b style={blue}>{CURRENCY[(item.output).currency]}</b><br />
                    Валюта (метапоисковика) <b style={blue}>{CURRENCY[(item.output).currencyForUrl]}</b><br />
                    {
                      (item.output).optional && (
                        <div><br />
                          <div style={{ color: 'var(--tabbar_inactive_icon)' }}>Дополнительные параметры</div>
                          {
                            (item.output).profitability && ("Выгодность покупки больше ")
                          }
                          {
                            (item.output).profitability && 
                            <b style={blue}>{(item.output).profitability+"%"}</b>
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
                            })((item.output).days)
                          }</b><br />
                          {
                            (item.output).showAddionalWeather && (
                              <div>
                                Прогноз погоды в день прилета<br />
                                Днем от <b style={blue}>{(item.output)['dayTemp.min']}</b> С до <b style={blue}>+{(item.output)['dayTemp.max']}</b> С<br />
                                Ночью от <b style={blue}>{(item.output)['nightTemp.min']}</b> С до <b style={blue}>+{(item.output)['nightTemp.max']}</b> С<br />
                              </div>
                            )
                          }
                        </div>
                      )
                    }
                  </Div>
                    <Div>
                      <Button size='xl' onClick={this.save_request}>Подписаться</Button>  
                    </Div>

                    <Div>
                      <Button style={{ border: '1px solid var(--accent)'}} mode='secondary' size='xl' onClick={() => this.setState({activeModal:null})}>Редактировать</Button>
                    </Div>
                          
                </Card>
              }
            </ModalPage>
          <ModalCard id='info_status' onClose={() => this.setState({ activeModal: null })}
                     caption={<div>{'Выбор этого параметра доступен, начиная со статуса "опытный пользователь"'}<br /><Link onClick={() => this.setState({ activeStory: 'about', activePanel:'home' })}>подробнее...</Link></div> }
                     header={this.state.user.first_name + " " + this.state.user.last_name} />
          <ModalCard id='qr' onClose={() => this.setState({ activeModal: null})} icon={<QR state={this.state}/>} />
            

          <ModalPage id='menu_map' onClose={() => this.setState({ activeModal: null})} settlingHeight={100} header={<ModalPageHeader>Карта полетов</ModalPageHeader>}>
            <List>
        <SimpleCell before={<Icon28MenuOutline />}  target='_blank' href='https://vk.com/page-192548341_54391753'>
        из Москвы
        </SimpleCell>
        <SimpleCell before={<Icon28MenuOutline />}  target='_blank' href='https://vk.com/page-192548341_54391754'>
        из Санкт-Петербурга 
        </SimpleCell>
        <SimpleCell before={<Icon28MenuOutline />}  target='_blank' href='https://vk.com/page-192548341_54356637'>
        из России
        </SimpleCell>
        <SimpleCell before={<Icon28MenuOutline />}  autoclose target='_blank' href='https://vk.com/page-192548341_54350351'>
        из СНГ и Украины
        </SimpleCell>
        <SimpleCell before={<Icon28MenuOutline />} target='_blank' href='https://vk.com/page-192548341_54349630'>
        из Европы
        </SimpleCell>
        <SimpleCell before={<Icon20GlobeOutline height={28} width={28}/>} autoclose target='_blank' href='https://vk.com/page-192548341_54350266'>
        Северная Америка
        </SimpleCell>
        <SimpleCell before={<Icon20GlobeOutline height={28} width={28}/>} target='_blank' href='https://vk.com/page-192548341_54350525'>
        в Африку
        </SimpleCell>
        <SimpleCell before={<Icon20GlobeOutline height={28} width={28}/>} target='_blank' href='https://vk.com/page-192548341_54350558'>
        в Южную Америку
        </SimpleCell>
        <SimpleCell before={<Icon20GlobeOutline height={28} width={28}/>} target='_blank' href='https://vk.com/page-192548341_54350574'>
        в Центральную Америку
        </SimpleCell>
        <SimpleCell before={<Icon20GlobeOutline height={28} width={28}/>} autoclose target='_blank' href='https://vk.com/page-192548341_54350363'>
        в Азию
        </SimpleCell>
        <SimpleCell before={<Icon20GlobeOutline height={28} width={28}/>} target='_blank' href='https://vk.com/page-192548341_54350602'>
        в Океанию
        </SimpleCell>
        <SimpleCell before={<Icon20GlobeOutline height={28} width={28}/>} target='_blank' href='https://vk.com/page-192548341_54350642'>
        на острова Индийского океана
        </SimpleCell>
        <SimpleCell before={<Icon20GlobeOutline height={28} width={28}/>} target='_blank' href='https://vk.com/page-177701331_54004476'>
        для круизов
        </SimpleCell>
            </List>
          </ModalPage>
        </ModalRoot>
      }>
          <MySubs
            id="home"
            state={this.state}
            go={this.go}
            onChangeGroups={this.onChangeGroups}
            onChange={this.onChangeForm}
            changeFunction={this.chooseGlobal}
            changeDefaultName={(changeDefaultName) => this.setState({ changeDefaultName })}
            openModal={this.openModal}
            onChangeGroups={this.onChangeGroups}
            setPopout={this.setPopout}
            on_audio={this.on_audio}
            stop_audio={this.stop_audio}
          />

          <Settings
            id="settings"
            state={this.state}
            setPopout={this.setPopout}
            onChangeGroups={this.onChangeGroups}
            openModal={this.openModal}
            on_audio={this.on_audio}
            stop_audio={this.stop_audio}
            go={this.go}
          />

          <EditSettings 
            id='edit_settings'
            onChangeGroups={this.onChangeGroups}
            setPopout={this.setPopout}
            go={this.go}
            openModal={this.openModal}
            state={this.state}
          />

          <Groups
            id="groups"
            state={this.state}
            setPopout={this.setPopout}
            go={this.go}
            openCatalog={this.openCatalog}
            on_audio={this.on_audio}
            stop_audio={this.stop_audio}
          />
          <Catalog
            id="catalog"
            state={this.state}
            setPopout={this.setPopout}
            openModal={this.openModal}
            go={this.go}
            goGroup={this.goGroup}
            onChangeGroups={this.onChangeGroups}
            chooseSection={this.chooseSection}
            on_audio={this.on_audio}
            stop_audio={this.stop_audio}
          />
          <SectionCatalog
            id="sectionCatalog"
            goGroup={this.goGroup}
            state={this.state}
            setPopout={this.setPopout}
            openModal={this.openModal}
            onChangeGroups={this.onChangeGroups}
            on_audio={this.on_audio}
            stop_audio={this.stop_audio}
            go={this.go}
          />

          <GroupInfo
            id="group"
            onChangeGroups={this.onChangeGroups}
            openModal={this.openModal}
            go={this.go}
            setPopout={this.setPopout}
            on_audio={this.on_audio}
            stop_audio={this.stop_audio}
            state={this.state}
          />

        </View>
        <View id="friends" activePanel={activePanel} popout={popout} modal={
          <ModalRoot activeModal={this.state.activeModal}>
            <ModalPage id='bullet_to_friend' onClose={() => this.setState({ activeModal: null })} header={<ModalPageHeader>{"Календарь низких цен"}</ModalPageHeader>} dynamicContentHeight>
            {friend == null ? <Spinner />:(
              <SimpleCell disabled
                          before={<Avatar src={friend.photo_200}/>}
                          description={friend.city.title }>{friend.first_name+" "+friend.last_name}</SimpleCell>
            )
            }
            
            {calendar && 
            <div className="container" style={{ paddingLeft: 12, paddingRight: 12}}>
                {Object.keys(calendar).map((name, day) => 
                <div size='s' className="container__item">
                  <div align='center'>
                    <SimpleCell 
                        description={calendar[name].price+" RUB"} 
                        target="_blank" 
                        href={"https://www.aviasales.ru/search?origin_iata=" + calendar[name].origin + "&destination_iata=" + calendar[name].destination + "&depart_date=" + calendar[name].departure_at.split('T')[0] + "&return_date=" + calendar[name].return_at.split('T')[0] + "&locale=ru&currency=RUB&with_request=true&adults=1&children=0&infants=0&trip_class=0&expected_price="+calendar[name].price+"&one_way=false&marker=" + this.state.marker}
                    >{name.split('-')[2]+"."+name.split('-')[1]+"."+name.split('-')[0]}</SimpleCell>
                  </div>
                </div>
                )}
            </div>
            }
          </ModalPage>
          <ModalPage 
              id='info_boy'
              header={<ModalPageHeader right={<PanelHeaderButton onClick={() => this.setState({ activeModal: null })}><Icon24Dismiss /></PanelHeaderButton>}>Информация</ModalPageHeader>}
              onClose={() => this.setState({ activeModal: null })}
           >
             <SimpleCell multiline disabled before={<Icon36Article fill='var(--accent)' height={28} width={28} />}>
               {this.state.user.sex == 1 ? 
               "Не нашла некоторых друзей? Наверное, они живут с тобой в одном городе? Мы показываем друзей только из других городов. В некоторые из них не летают самолеты или мы не можем показать авиабилеты, потому, что название своего города кто-нибудь написал на другом языке. Мы работаем над этим. Много друзей? Воспользуйся фильтрами по городу, имени, возрасту или даже по знакам зодиака": 
               "Не нашел некоторых друзей? Наверное, они живут с тобой в одном городе? Мы показываем друзей только из других городов. В некоторые из них не летают самолеты или мы не можем показать авиабилеты, потому, что название своего города кто-нибудь написал на другом языке. Мы работаем над этим. Воспользуйся фильтрами по городу, имени, возрасту или даже по знакам зодиака"
               }
            </SimpleCell>
             </ModalPage>
             <ModalPage 
              id='info_girl'
              header={<ModalPageHeader right={<PanelHeaderButton onClick={() => this.setState({ activeModal: null })}><Icon24Dismiss /></PanelHeaderButton>}>Информация</ModalPageHeader>}
              onClose={() => this.setState({ activeModal: null })}
           >
             <SimpleCell multiline disabled before={<Icon36Article fill='var(--accent)' height={28} width={28} />}>
               {this.state.user.sex == 1 ? 
               "Не нашла некоторых подруг? Наверное, они живут с тобой в одном городе? Мы показываем подруг только из других городов. В некоторые из них не летают самолеты или мы не можем показать авиабилеты, потому, что название своего города одна из них написала на другом языке. Мы работаем над этим. Воспользуйся фильтрами по городу, имени, возрасту или даже по знакам зодиака": 
               "Не нашел некоторых подруг? Наверное, они живут с тобой в одном городе? Мы показываем подруг только из других городов. В некоторые из них не летают самолеты или мы не можем показать авиабилеты, потому, что название своего города одна из них написала на другом языке. Мы работаем над этим. Воспользуйся фильтрами по городу, имени, возрасту или даже по знакам зодиака"
               }
            </SimpleCell>
             </ModalPage>
          </ModalRoot>
        }>
          <Friends
            id="home"
            state={this.state}
            setPopout={this.setPopout}
            go={this.go}
            openModal={this.openModal}
            onChangeGroups={this.onChangeGroups}
            stop_audio={this.stop_audio}
          />
 
        </View>
        <View id="aviasales" activePanel={activePanel} popout={popout}>
          <Aviasales id='home' stop_audio={this.stop_audio} setPopout={this.setPopout} onChangeGroups={this.onChangeGroups} state={this.state} />
        </View>

        <View id='admin' activePanel={activePanel} popout={popout}>
          <Admin 
            id='home' 
            state={this.state} 
            setPopout={this.setPopout}
          />
        </View>
      </Epic>
      </ConfigProvider>
    )
  }
}

export default App
