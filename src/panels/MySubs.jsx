import React, { Component } from 'react'
import { Panel, PanelHeader, FixedLayout, Tabs, TabsItem, Div, Button, Counter, ActionSheet, ActionSheetItem, MiniInfoCell, PromoBanner } from '@vkontakte/vkui'
import MyGroups from '../components/MyGroups'
import MyDB from '../components/MyDB';
import Load from '../components/Load';
import InfoPlaceholder from '../components/InfoPlaceholder';
import SnackbarError from '../components/SnackbarError';

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon28Send from '@vkontakte/icons/dist/28/send';
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import Icon20FollowersOutline from '@vkontakte/icons/dist/20/followers_outline';
import Icon20MessageOutline from '@vkontakte/icons/dist/20/message_outline';
import Icon28HelpOutline from '@vkontakte/icons/dist/28/help_outline';
import Icon28ArrowUturnRightOutline from '@vkontakte/icons/dist/28/arrow_uturn_right_outline';

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

export default class MySubs extends Component {
  state = {
    activeTab: '',
    progress:0,
    DB:[],
    info_groups:false, 
    info_db:false,
    is_open:false,
    groups:[]
  }

  //получаем данные подписок
  componentDidMount() {
    fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/get-tags", {
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
      let arrGroups = [];
      data.tags.forEach(tag => {if(arrGroups.indexOf(tag.body.split('@')[1]) === -1) arrGroups.push(tag.body.split('@')[1])});
      this.props.onChangeGroups('my_groups', arrGroups);
      let arrCategory = [];
      let arr = [];
      data.tags.forEach(tag => {if(arrCategory.indexOf(tag.category) === -1) arrCategory.push(tag.category)});
      arrCategory.forEach(category => {
        let groupsCategory = [];
        data.tags.forEach(tag => {if(groupsCategory.indexOf(tag.group_name) === -1 && tag.category === category) groupsCategory.push(tag.group_name)});
        let arrG = [];
        groupsCategory.forEach(group => {
          let u = [];
          u = data.tags.filter(tag => tag.category === category && tag.group_name == group);
          let code = data.tags.filter(tag => tag.category === category && tag.group_name == group)[0].body.split('@')[1];
          arrG.push({group, code, data:u});
        })
        arr.push({category, data: arrG})   
      })
      this.setState({ progress : 50 })
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
        this.setState({ DB: data.requests, groups: arr, progress:70, countGroups:arrGroups.length,  countDB:data.requests.length, activeTab:(data.requests.length == 0 && arrGroups.length == 0 ? '' : 'groups')});
        this.props.onChangeGroups('countDB', data.requests.length)
        setTimeout(() => this.setState({ progress:99 }), 700);
        setTimeout(() => {this.setState({ progress:100, is_open:(data.requests.length || arrGroups.length) });this.props.onChangeGroups('is_first', false)}, 1200);
      }).catch(err => {
        this.props.setPopout(null)
        this.setState({snackbar:<SnackbarError close={() => this.setState({snackbar:null})}/>, data:'error'})
      })
    }).catch(err => {
      this.props.setPopout(null)
      this.setState({snackbar:<SnackbarError close={() => this.setState({snackbar:null})}/>, data:'error'})
    })
  }
  //открываем меню 2
  openMenu = () => {
    this.props.setPopout(
      <ActionSheet onClose={() => this.props.setPopout(null)}>
        <ActionSheetItem autoclose before={<Icon28AddOutline />} onClick={() => this.props.go(this.state.activeTab == 'groups' ? 'groups' : 'settings')}>
        Добавить подписку на дешевые авиабилеты в разделе "{this.state.activeTab == 'groups' ? 'Витрина' : 'Мой выбор'}"
        </ActionSheetItem>
        <ActionSheetItem autoclose before={<Icon28AddOutline />} onClick={() => this.props.go(this.state.activeTab != 'groups' ? 'groups' : 'settings')}>
        Добавить подписку на дешевые авиабилеты в разделе "{this.state.activeTab != 'groups' ? 'Витрина' : 'Мой выбор'}"
        </ActionSheetItem>

          <ActionSheetItem autoclose before={<Icon28HelpOutline />} onClick={() => this.setState({[(this.state.activeTab == 'groups' ? 'info_groups' : 'info_db')]: true})}>
            О разделе "{this.state.activeTab == 'groups' ? 'Витрина' : 'Мой выбор'}"
          </ActionSheetItem>
        
        <ActionSheetItem autoclose before={<Icon28Send />} onClick={() => {this.props.onChangeGroups('is_meta', true); this.props.onChangeGroups('activeStory', 'aviasales')}}>
        Купить авиабилет 
        </ActionSheetItem>
      </ActionSheet>
    )
  }

  //открываем меню 1
  openMenuPlaceholder() {
    this.props.setPopout(
      <ActionSheet onClose={() => this.props.setPopout(null)}>
        <ActionSheetItem autoclose before={<Icon28AddOutline />} onClick={() => { this.setState({activeTab: 'groups', is_open:true})}}>
        Добавить подписку на дешевые авиабилеты в разделе "Витрина"
        </ActionSheetItem>
        <ActionSheetItem autoclose before={<Icon28AddOutline />} onClick={() => { this.setState({activeTab: 'database', is_open:true})}}>
        Добавить подписку на дешевые авиабилеты в разделе "Мой выбор"
        </ActionSheetItem>
        <ActionSheetItem autoclose before={<Icon28Send />}  onClick={() => this.props.onChangeGroups('activeStory', 'aviasales')}>
        Купить авиабилет 
        </ActionSheetItem>
      </ActionSheet>
    )
  }

  render() {
    const {
      activeTab,
      progress,
      is_open
    } = this.state
    const {
      id,
      state
    } = this.props
    return (
      <Panel id={id}>
        {is_open ? <PanelHeader>Подписки</PanelHeader>:null}
        {is_open ? 
        <FixedLayout vertical="top"> 
          <Tabs mode='segmented'>
            <TabsItem
              after={this.state.countGroups !== 0 && <Counter>{this.state.countGroups}</Counter>}
              selected={activeTab === 'groups'}
              onClick={() => {this.setState({ activeTab: 'groups' });}}
            >Витрина</TabsItem>
            <TabsItem
              after={this.state.countDB !== 0 && <Counter>{this.state.countDB}</Counter>}
              selected={activeTab === 'database'}
              onClick={() => {this.setState({ activeTab: 'database' });}}
            >Мой выбор</TabsItem>
          </Tabs>
        </FixedLayout>:null
        }

        {progress == 100 &&
        <FixedLayout vertical='bottom'>
          <div align='center' style={{ display: 'flex', justifyContent: 'center'}}>
          <div style={{ paddingBottom:6 }}>
            <Button className='circle_button' onClick={() => {
            if(this.state.is_open) this.openMenu()
            else this.openMenuPlaceholder()
          }}>
              <Icon28AddOutline />
            </Button>
          </div>
          {activeTab == 'groups' && <div style={{ paddingBottom:6,paddingRight:32,right:'0%', position:'absolute' }}>
            <Button className='circle_button' style={{backgroundColor:'#4BBDE7'}} onClick={() => this.props.openModal('menu_map')}>
              <Icon28ViewOutline />
            </Button>
          </div>
          }
          </div>
        </FixedLayout>
        }
        <Div />
        {progress !== 100 ? <Load progress={progress} is_first={this.props.state.is_first} state={this.props.state} user={this.props.state.user}/> :
        <div>
          {this.state.is_open ? 
        <div>
        {
          activeTab === 'groups' ? 
            <MyGroups
              setPopout={this.props.setPopout}
              info={this.state}
              onChangeGroups={this.props.onChangeGroups}
              onChangeCount={(name, value) => this.setState({[name]:value})}
              openModal={this.props.openModal}
              groups={this.state.groups}
              state={state}
            />
          :
            <MyDB
              info={this.state}
              onChangeGroups={this.props.onChangeGroups}
              onChangeCount={(name, value) => this.setState({[name]:value})}
              DB={this.state.DB}
              setPopout={this.props.setPopout}
              state={state}
              onChange={this.props.onChange}
              go={this.props.go}
            />
        }
        </div>: <InfoPlaceholder user={this.props.state.user} />
          }
      
        </div>
        }
      </Panel>
    )
  }
}

