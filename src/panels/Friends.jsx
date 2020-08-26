import React, { Component } from 'react'
import { Panel, PanelHeader, Placeholder, Button, FixedLayout, Avatar, ScreenSpinner, RichCell, Tabs, TabsItem, Div, ActionSheet, ActionSheetItem, List, Group, Header, PanelHeaderContent, PanelHeaderContext, Cell, Search, Tooltip } from '@vkontakte/vkui'
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import bridge from '@vkontakte/vk-bridge'
import { VKMiniAppAPI } from '@vkontakte/vk-mini-apps-api'
import SnackbarError from '../components/SnackbarError';

import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon36Article from '@vkontakte/icons/dist/36/article'
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon28SortOutline from '@vkontakte/icons/dist/28/sort_outline';
import Icon28SortHorizontalOutline from '@vkontakte/icons/dist/28/sort_horizontal_outline';
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon24Help from '@vkontakte/icons/dist/24/help';


export class Friends extends Component {
  state = {
    activeTab:'friends_boy',

    all_friends_boy:null,
    all_friends_girl:null,

    tooltips: {
      birthday:true,
    },
    activeMenu_friends_boy: null,
    activeMenu_friends_girl: null,

    filter_friends_boy:null,
    filter_friends_girl:null,
    

    activeFilter:0,
    is_group:false,
    friends_boy: null,
    friends_girl: null,
    snackbar:null,
    contextOpened:false
  }

  componentDidMount() {
    this.getFriends()
  }
  
  getFriends = () => {
    this.props.setPopout(<ScreenSpinner />)
    bridge.sendPromise("VKWebAppGetAuthToken", {
      app_id: this.props.state.appId,
      scope: "friends"
    })
    .then(data => {
      if(data.access_token){
        if(data.scope === "friends"){
          bridge.sendPromise("VKWebAppCallAPIMethod", {
            method: "friends.get",
            params: {
              access_token: data.access_token,
              fields: "city,photo_200,country,bdate,status,last_seen,sex,domain",
              v: 5.107
            },
            request_id: '3'
          })
          .then(data => {
            if(data.response.items){
              let arrFriends = data.response.items.filter((item) => item.city).filter((item) => item.city.id !== this.props.state.user.city.id && item.bdate)
              let arr = arrFriends.map((friend) => { 
                  let data = friend.bdate.split('.');
                  if(data[2]) {
                    let age = new Date().getFullYear() - data[2];
                    return {...friend, age}
                  } else {
                    return {...friend, age:100}
                  }
                } 
              )
      
              this.setState({
                friends_boy: arr.filter(friend => friend.sex == 2),
                friends_girl: arr.filter(friend => friend.sex == 1),
                all_friends_girl: arr.filter(friend => friend.sex == 1),
                all_friends_boy: arr.filter(friend => friend.sex == 2),
                filter_friends_boy: arr.filter(friend => friend.sex == 2),
                filter_friends_girl: arr.filter(friend => friend.sex == 1)
              })
              this.props.setPopout(null)
            }else{
              this.setState({snackbar:<SnackbarError text={"У вас нет друзей"} close={() => this.setState({snackbar:null})}/>})
              this.props.setPopout(null)
            }
          })
          .catch((err) => {
            console.log(err)
            this.props.setPopout(null)
            this.setState({snackbar:<SnackbarError text={"Не удалось получить друзей"} close={() => this.setState({snackbar:null})}/>})
          })
        }else{
          this.setState({snackbar:<SnackbarError text={"Не удалось доступ к друзьям"} close={() => this.setState({snackbar:null})}/>})
          this.props.setPopout(null)
        }
      }else{
        this.setState({snackbar:<SnackbarError text={"Ошибка получения токена"} close={() => this.setState({snackbar:null})}/>})
        this.props.setPopout(null)
      }
    })
    .catch(() => {
      this.props.setPopout(null)
      this.setState({snackbar:<SnackbarError text={"Вы не дали доступ к друзьям"} close={() => this.setState({snackbar:null})}/>})
    })
  }

   isEmpty(obj) {
    for (let key in obj) {
      return false;
    }
    return true;
  }

  openMenu = () => {
    const name = 'activeMenu_' + this.state.activeTab;
    const g = 'all_' + this.state.activeTab; 
    this.props.setPopout(
      <ActionSheet onClose={() => this.props.setPopout(null)}>
        <ActionSheetItem autoclose before={<Icon28ListOutline />} onClick={() => {this.sortCity(); this.setState({activeFilter:0, [name]:null, [this.state.activeTab]:this.state[g]})}}>по городу</ActionSheetItem>
        <ActionSheetItem autoclose before={<Icon28ListOutline />} onClick={() => {this.sortAlfName(); this.setState({activeFilter:0, [name]:'alf', [this.state.activeTab]:this.state[g]})}}>по алфавиту</ActionSheetItem>
        <ActionSheetItem autoclose before={<Icon28ListOutline />} onClick={() => {this.sortAge(); this.setState({activeFilter:0, [name]:'age',[this.state.activeTab]:this.state[g]})}}>по возрасту</ActionSheetItem>
        <ActionSheetItem autoclose before={<Icon28ListOutline />} onClick={() => {this.sortDate(this.state[g]); this.setState({activeFilter:0, [name]:'birthday'})}}>по дням рождения</ActionSheetItem>
        <ActionSheetItem autoclose before={<Icon28ListOutline />} onClick={() => {this.sortDate(this.state[g]); this.setState({activeFilter:0, [name]:'zodiac'})}}>по знакам зодиака</ActionSheetItem>
        <ActionSheetItem autoclose before={<Icon28ListOutline />} onClick={() => {this.sortOnline(1); this.setState({activeFilter:0, [name]:'online',[this.state.activeTab]:this.state[g]})}}>сейчас на сайте</ActionSheetItem>
        <ActionSheetItem autoclose before={<Icon28ViewOutline />} href='https://vk.com/friends?w=calendar' target='_blank'>календарь дней рождений</ActionSheetItem>
      </ActionSheet>
    )
  }

  sortOnline = (i) => {
    const { activeTab } = this.state;
    const g = 'all_' + this.state.activeTab; 
    this.setState({[activeTab]:this.state[g]}, () => {
      let arr = this.state[activeTab].filter((el) => el.online == i);
      let filter = 'filter_' + activeTab;
      setTimeout(() =>this.setState({[activeTab]: arr, [filter]: arr}), 200)
    
    })
  }

  sortAgeTo = (min, max) => {
    const { activeTab } = this.state;
    const g = 'all_' + this.state.activeTab; 
    this.setState({[activeTab]:this.state[g]}, () => {
      let arr = this.state[activeTab].filter((el) => el.age >= min && el.age <= max);
      arr.sort((a, b) => {
        return a.age-b.age
      })
      let filter = 'filter_' + activeTab;
      this.setState({ [activeTab]: arr, [filter]: arr});
    })
  }

  sortMothTo = (min, max) => {
    const { activeTab } = this.state;
    const g = 'all_' + this.state.activeTab; 
    this.setState({[activeTab]:this.state[g]}, () => {
      let arr = this.state[activeTab].filter((el) => Number(el.bdate.split('.')[1]) >= min && Number(el.bdate.split('.')[1]) <= max);
      let filter = 'filter_' + activeTab;
      this.sortDate(arr);
    })
    
  }

  sortDate = (data) => {
    const { activeTab } = this.state;
    let filter = 'filter_' + activeTab;
    let arrMoth = [];
    let arr = [];
    data.forEach(el => {
      if(arrMoth.indexOf(Number(el.bdate.split('.')[1])) == -1) 
        arrMoth.push(Number(el.bdate.split('.')[1]));
    })
    arrMoth.sort((a, b) => {
      return a-b
    })
  
    arrMoth.forEach(e => {
      let obj  =  { moth:e, 
                    data:
                      this.state[activeTab].filter((i) => Number(i.bdate.split('.')[1]) == e).sort((a, b) => {
                        return Number(a.bdate.split('.')[0]) - Number(b.bdate.split('.')[0])
                      })};
      arr.push(obj);
    })
    let all = [];
    arr.forEach(e => { 
      all = all.concat(e.data)
    })
    this.setState({ [activeTab]:all, [filter]:all })
  
  }

  sortCity = () => {
    const { activeTab } = this.state;
    let cities = [];
    this.state[activeTab].forEach((el) => {
        if(cities.indexOf(el.city.title) == -1) cities.push(el.city.title);
    });
    console.log(cities);
    let name = 'is_group_' + activeTab; 
    let friends_name = 'groups_' + activeTab;
    let filter = 'filter_' + activeTab;
    let arr = cities.map((city) =>  ({ city, data:this.state[activeTab].filter((friend) => friend.city.title == city)}));
    this.setState({ [friends_name]:arr,[filter]:arr, [name]:true });
  }

  sortAge = () => {
    const { activeTab }  = this.state;
    this.state[activeTab].sort((a, b) => {
      return a.age-b.age
    })
    let name = 'is_group_' + activeTab;
    let filter = 'filter_' + activeTab;
    this.setState({ [name]:false, [activeTab]:  this.state[activeTab], [filter]:this.state[activeTab]});
  }

  sortAlfName = () => {
    const { activeTab } = this.state;
    this.setState({ activeMenu: 'alf'});
    this.state[activeTab].sort((a, b) => {
      let name_a = a.first_name.toLowerCase() 
      let name_b = b.first_name.toLowerCase() 
      if (name_a < name_b)
        return -1
      if (name_a > name_b)
        return 1
      return 0 
      })
      let name = 'is_group_' + activeTab;
      let filter = 'filter_' + activeTab;
     this.setState({ [name]:false, [activeTab]:  this.state[activeTab], [filter]:this.state[activeTab]});
  }

  sortAlfLastName = () => {
    const { activeTab } = this.state;
    this.setState({ activeMenu: 'alf'});
    this.state[activeTab].sort((a, b) => {
      let name_a = a.last_name.toLowerCase();
      let name_b = b.last_name.toLowerCase();
      if (name_a < name_b)
        return -1
      if (name_a > name_b)
        return 1
      return 0 
      })
      let name = 'is_group_' + activeTab;
      let filter = 'filter_' + activeTab;
     this.setState({ [name]:false, [activeTab]:  this.state[activeTab], [filter]:this.state[activeTab] });
  }

  sortZodiac = (d1, d2) => {
    const data_1 = d1.split('.');
    const data_2 = d2.split('.');

    const { activeTab } = this.state;
    const g = 'all_' + this.state.activeTab; 
    this.setState({[activeTab]:this.state[g]}, () => {
      let arr = this.state[activeTab].filter((e) => {
        const m  = Number(e.bdate.split('.')[1]);
        const den = Number(e.bdate.split('.')[0]);
        let znak;
        switch (m) {
            case 1:
                if (den <= 19)
                    znak = 'Козерог';
                else
                    znak = 'Водолей';
                break;
            case 2:
                if (den <= 18)
                    znak = 'Водолей';
                else
                    znak = 'Рыбы';
                break;
            case 3:
                if (den <= 20)
                    znak = 'Рыбы';
                else
                    znak = 'Овен';
                break;
            case 4:
                if (den <= 19)
                    znak = 'Овен';
                else
                    znak = 'Телец';
                break;
            case 5:
                if (den <= 20)
                    znak = 'Телец';
                else
                    znak = 'Близнецы';
                break;
            case 6:
                if (den <= 21)
                    znak = 'Близнецы';
                else
                    znak = 'Рак';
                break;
            case 7:
                if (den <= 22)
                    znak = 'Рак';
                else
                    znak = 'Лев';
                break;
            case 8:
                if (den <= 22)
                    znak = 'Лев';
                else
                    znak = 'Дева';
                break;
            case 9:
                if (den <= 22)
                    znak = 'Дева';
                else
                    znak = 'Весы';
                break;
            case 10:
                if (den <= 22)
                    znak = 'Весы';
                else
                    znak = 'Скорпион';
                break;
            case 11:
                if (den <= 22)
                    znak = 'Скорпион';
                else
                    znak = 'Стрелец';
                break;
            case 12:
                if (den <= 21)
                    znak = 'Стрелец';
                else
                    znak = 'Козерог';
                break;
        }
        if(znak == d1 || znak == d2 || d1 == 'all')  {
          return true;
        } else { return false; }
      })

      let filter = 'filter_' + activeTab;
      this.sortDate(arr)
    })
  }

  search = (value) => {
    const { activeTab } = this.state;
    const search = value.toLowerCase();
    let filter = 'filter_' + activeTab;
    this.setState({ [activeTab]:this.state[filter]}, () => {
      this.setState({[activeTab]: this.state[activeTab].filter(({first_name, last_name}) => first_name.toLowerCase().indexOf(search) > -1 || last_name.toLowerCase().indexOf(search) > -1)});
    })
    
  }


  date(date) {
    if(date == "" || date == null) {
      return "нет данных";
    }
    let arr = date.split('.');
    switch (arr[1]) {
      case '1':
        return arr[0]+' января';
      break

      case '2':
        return arr[0]+' февраля';
      break

      case '3':
        return arr[0]+' марта';
      break

      case '4':
        return arr[0]+' апреля';
      break
      case '5':
        return arr[0]+' мая';
      break
      case '6':
        return arr[0]+' июня';
      break
      case '7':
        return arr[0]+' июля';
      break
      case '8':
        return arr[0]+' августа';
      break
      case '9':
        return arr[0]+' сентября';
      break

      case '10':
        return arr[0]+' октября';
      break 
        
      case '11':
        return arr[0]+' ноября';
      break
      case '12':
        return arr[0]+' декабря';
      break
    }
  }

  seacrh_city  = (value) => {
    const { activeTab } = this.state;
    const search = value.toLowerCase();
    let filter = 'filter_' + activeTab;

  }

  open = (friend) => {
    console.log(friend)
    this.props.setPopout(<ScreenSpinner />)
    fetch("https://cors-anywhere.herokuapp.com/https://api.travelpayouts.com/data/ru/cities.json")
    .then(response => response.json())
    .then(cities => {
      let myCode = cities.filter((item) => item.name === this.props.state.user.city.title)[0].code
      const friendCode = cities.filter((item) => item.name === friend.city.title)[0].code
      fetch(`https://cors-anywhere.herokuapp.com/https://api.travelpayouts.com/v1/prices/calendar?&origin=${myCode}&destination=${friendCode}&calendar_type=departure_date&token=d378bb3f3b879e6fc87899314ba5ce5d`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let indexPrice = Object.keys(data.data)[0]
        if(Object.keys(data.data).length > 3){
          indexPrice = Object.keys(data.data)[3]
        }
        console.log(String(indexPrice))
        if(String(indexPrice) !== 'undefined') {
        this.props.onChangeGroups('friend',friend); 
        this.props.onChangeGroups('calendar',data.data);
        this.props.openModal('bullet_to_friend')
        this.props.setPopout(null)
        } else {
          this.setState({snackbar:<SnackbarError text={`Мы не нашли авиарейсов из города ${this.props.state.user.city.title} в город ${friend.city.title}, где живет ${friend.first_name} ${friend.last_name}. Возможно, скоро мы покажем другие возможности навестить ${friend.sex == 2 ? 'его':'ее'}, например, поехать на поезде или автобусе`} close={() => this.setState({snackbar:null})}/>})}
          this.props.setPopout(null)
      }).catch(err => {
        this.props.setPopout(null)
        this.setState({snackbar:<SnackbarError text={`Мы не нашли авиарейсов из города ${this.props.state.user.city.title} в город ${friend.city.title}, где живет ${friend.first_name} ${friend.last_name}. Возможно, скоро мы покажем другие возможности навестить ${friend.sex == 2 ? 'его':'ее'}, например, поехать на поезде или автобусе`} close={() => this.setState({snackbar:null})}/>})
      })
    }).catch(err => {
      this.props.setPopout(null)
      this.setState({snackbar:<SnackbarError text={`Мы не нашли авиарейсов из города ${this.props.state.user.city.title} в город ${friend.city.title}, где живет ${friend.first_name} ${friend.last_name}. Возможно, скоро мы покажем другие возможности навестить ${friend.sex == 2 ? 'его':'ее'}, например, поехать на поезде или автобусе`} close={() => this.setState({snackbar:null})}/>})
    })

  }

  toggleContext = () => {
    this.setState({ contextOpened: !this.state.contextOpened });
  }



  getText = (menu) => {
    console.log(menu)
      switch (menu) {
        case 'birthday':
          return 'выберите месяц'
        case 'age':
          return 'выберите возраст'
        case 'zodiac':
          return 'выберите знак зодиака'

        case 'alf':
          return 'выберите порядок'

        case 'online':
          return 'выберите'
      }
  }

  render() {
    const {   id } = this.props
    const {
      activeTab,
      friends_boy,
      friends_girl,
      activeMenu,
      activeFilter
    } = this.state
    const MENU = {
      null:[],
      alf:[{name:'по имени', func:() => this.sortAlfName()}, {name:'по фамилии', func:() => this.sortAlfLastName()}],
      age:[
        {name:'любой возраст', func:() => this.sortAge()},
        {name:'до 18 лет', func:() => this.sortAgeTo(0, 18)}, 
        {name:'18-25 лет', func:() => this.sortAgeTo(18, 25)},
        {name:'25-30 лет', func:() => this.sortAgeTo(25, 30)},
        {name:'30-35 лет', func:() => this.sortAgeTo(30, 35)},
        {name:'35-45 лет', func:() => this.sortAgeTo(35, 45)}, 
        {name:'45-55 лет', func:() => this.sortAgeTo(45, 55)}, 
        {name:'старше 55 лет', func:() => this.sortAgeTo(55, 99)}, 
        {name:'возраст не указан', func:() => this.sortAgeTo(100, 100)}
          ],
      birthday:[
        {name: 'показать всех', func:() => this.sortMothTo(1, 12)},
        {name:'Январь - Февраль', func:() => this.sortMothTo(1, 2)}, 
        {name:'Март - Апрель', func:() => this.sortMothTo(3, 4)}, 
        {name:'Май - Июнь', func:() => this.sortMothTo(5, 6)}, 
        {name:'Июль - Август', func:() => this.sortMothTo(7, 8)}, 
        {name:'Сентябрь - Октябрь', func:() => this.sortMothTo(9, 10)}, 
        {name:'Ноябрь - Декабрь', func:() => this.sortMothTo(11, 12)}, 
      ],
      zodiac:[
        {name:'все знаки зодиака', func: () => this.sortZodiac('all', 'all')},
        {name:'Овен - Телец', func:() => this.sortZodiac('Овен', 'Телец')}, 
        {name:'Близнецы - Рак', func:() => this.sortZodiac('Близнецы', 'Рак')},
        {name:'Лев - Дева', func:() => this.sortZodiac('Лев', 'Дева')},
        {name:'Весы - Скорпион', func:() => this.sortZodiac('Весы', 'Скорпион')},
        {name:'Стрелец - Козегорог',func:() => this.sortZodiac('Стрелец', 'Козегорог')},
        {name:'Водолей - Рыбы', func:() => this.sortZodiac('Водолей', 'Рыбы')},
      ],
      online:[
        {name: 'сейчас на сайте', func:() => this.sortOnline(1)}, 
        {name:'офлайн ', func:() => this.sortOnline(0)}
      ]
    }
    const name = 'activeMenu_' + this.state.activeTab;

    return (
      <Panel id={id}>
        <PanelHeader separator={false}>
            {this.state[name] ? 
            <Tooltip onClose={() => this.setState({ tooltips:{ ...this.state.tooltips, [this.state[name]]: false} })} isShown={this.state.tooltips[this.state[name]]} offsetY={-2} cornerOffset={10} text={this.getText(this.state[name])}>
            <PanelHeaderContent
              aside={<Icon16Dropdown style={{ transform: `rotate(${this.state.contextOpened ? '180deg' : '0'})` }} />}
              onClick={this.toggleContext}
            >
              {MENU[this.state[name]][activeFilter].name}
            </PanelHeaderContent>
            </Tooltip>: "Слетать к " + (activeTab == 'friends_boy' ? 'друзьям': 'подругам')}
        </PanelHeader>
        <PanelHeaderContext opened={this.state.contextOpened} onClose={this.toggleContext}>
            <List>
              {MENU[this.state[name]].map((item, i) => 
                <Cell before={<Icon28SortHorizontalOutline />} onClick={() => {item.func(); this.setState({ activeFilter:i});requestAnimationFrame(this.toggleContext);}} asideContent={activeFilter == i && <Icon24Done fill='var(--accent)'/>}>
                  {item.name}
                </Cell>
              )}
            </List>
          </PanelHeaderContext>

        {friends_boy && 
        <FixedLayout vertical='bottom'>
          <div align='center' style={{ display: 'flex', justifyContent: 'center'}}>
            <div style={{  paddingBottom:6 }}>
              <Button className='circle_button' onClick={() => this.openMenu()}>
                <Icon28SortOutline />
              </Button>
            </div>
            <div style={{ paddingBottom:6,paddingRight:32,right:'0%', position:'absolute' }}>
            <Button className='circle_button' style={{backgroundColor:'#4BBDE7'}} onClick={() => this.props.openModal(activeTab == 'friends_boy' ? 'info_boy' : 'info_girl')}>
              <Icon36Article height={28} width={28}/>
            </Button>
            </div>
          </div>
        </FixedLayout>}
        <Tabs>
          <TabsItem selected={activeTab == 'friends_boy'} onClick={() => this.setState({ activeTab: 'friends_boy' })}>Друзья</TabsItem>
          <TabsItem selected={activeTab == 'friends_girl'} onClick={() => this.setState({activeTab: 'friends_girl'})}>Подруги</TabsItem>
        </Tabs>

        {activeTab == 'friends_boy' ? 
          <div>
            { friends_boy ? 
            (
              this.state.is_group_friends_boy ? 
              <List>
                {this.state.groups_friends_boy.map((city) => 
                <Group header={<Header>{city.city}</Header>}>
                  {city.data.map((friend) => 
                      <RichCell 
                        before={<Avatar size={64} src={friend.photo_200}/>} 
                        multiline
                        text={friend.status}
                        actions={
                          <React.Fragment>
                            <Button target='_blank' href={"https://vk.com/"+friend.domain}>Перейти в профиль</Button>
                            <Button  onClick={() => this.open(friend)}>Календарь низких цен</Button>
                          </React.Fragment>
                        }
                        caption={friend.city == null || friend.country == null ? '??':<span>{friend.country.title+", "+friend.city.title}<br /> {"День рождения "+this.date(friend.bdate)}</span>}
                        after={friend.online == 1  ? <span style={{ color: 'var(--dynamic_green)', fontSize:12 }}>online</span> : (friend.last_seen ? <span style={{ fontSize: 12, color:'var(--dynamic_gray)'}}>{new Date(friend.last_seen.time*1000).toLocaleString('ru', {  year: 'numeric', month: 'numeric',day: 'numeric', hour: 'numeric',minute: 'numeric'})}</span>: <span style={{ color: 'var(--dynamic_gray)', fontSize:12}}>offline</span>)}
                      >
                      {friend.first_name+" "+friend.last_name}
                      </RichCell>
                  )}
                </Group>
                )}
              </List>: 
              <List>
                <Search onChange={(e) => this.search(e.target.value)} />
                {friends_boy.map((friend, i) => 
                    <RichCell 
                      key={i} 
                      before={<Avatar size={64} src={friend.photo_200}/>} 
                      multiline
                      text={friend.status}
                      caption={friend.city == null || friend.country == null ? '??':<span>{friend.country.title+", "+friend.city.title}<br /> {"День рождения "+this.date(friend.bdate)}</span>}
                      after={friend.online == 1  ? <span style={{ color: 'var(--dynamic_green)', fontSize:12 }}>online</span> : (friend.last_seen ? <span style={{ fontSize: 12, color:'var(--dynamic_gray)'}}>{new Date(friend.last_seen.time*1000).toLocaleString('ru', {  year: 'numeric', month: 'numeric',day: 'numeric', hour: 'numeric',minute: 'numeric'})}</span>: <span style={{ color: 'var(--dynamic_gray)', fontSize:12}}>offline</span>)}
                      actions={
                        <React.Fragment>
                          <Button target='_blank' href={"https://vk.com/"+friend.domain}>Перейти в профиль</Button>
                          <Button onClick={() => this.open(friend)}>Календарь низких цен</Button>
                        </React.Fragment>
                      }
                    >
                    {friend.first_name+" "+friend.last_name}
                    </RichCell>
                )}
              </List>
            )
          :
          <Placeholder
            icon={<Icon56UsersOutline />}
            header="Друзья"
            action={<Button onClick={this.getFriends} size="l">Показать список</Button>}
          >
            Чтобы получить список к друзьям, вам нужно предоставить доступ приложению.
          </Placeholder>}
          </div>
          :
          <div>
          {
            friends_girl ?  (
              this.state.is_group_friends_girl ? 
              <List>
                {this.state.groups_friends_girl.map((city) =>
                  <Group header={<Header>{city.city}</Header>}>
                    {city.data.map((friend) =>
                      <RichCell 
                        before={<Avatar size={64} src={friend.photo_200}/>} 
                        multiline
                        text={friend.status}
                        caption={friend.city == null || friend.country == null ? '??':<span>{friend.country.title+", "+friend.city.title}<br /> {"День рождения "+this.date(friend.bdate)}</span>}
                        after={friend.online == 1  ? <span style={{ color: 'var(--dynamic_green)', fontSize:12 }}>online</span> : (friend.last_seen ? <span style={{ fontSize: 12, color:'var(--dynamic_gray)'}}>{new Date(friend.last_seen.time*1000).toLocaleString('ru', {  year: 'numeric', month: 'numeric',day: 'numeric', hour: 'numeric',minute: 'numeric'})}</span>: <span style={{ color: 'var(--dynamic_gray)', fontSize:12}}>offline</span>)}
                        actions={
                          <React.Fragment>
                            <Button target='_blank' href={"https://vk.com/"+friend.domain}>Перейти в профиль</Button>
                            <Button onClick={() => this.open(friend)}>Календарь низких цен</Button>
                          </React.Fragment>
                        }
                      >
                      {friend.first_name+" "+friend.last_name}
                      </RichCell>
                    )}
                  </Group>
                )}
              </List>
              : 
              <List>
                <Search onChange={(e) => this.search(e.target.value)} />
                {friends_girl.map((friend) =>
                  <RichCell 
                    before={<Avatar size={64} src={friend.photo_200}/>} 
                    multiline
                    text={friend.status}
                    caption={friend.city == null || friend.country == null ? '??':<span>{friend.country.title+", "+friend.city.title}<br /> {"День рождения "+this.date(friend.bdate)}</span>}
                    after={friend.online == 1  ? <span style={{ color: 'var(--dynamic_green)', fontSize:12 }}>online</span> : (friend.last_seen ? <span style={{ fontSize: 12, color:'var(--dynamic_gray)'}}>{new Date(friend.last_seen.time*1000).toLocaleString('ru', {  year: 'numeric', month: 'numeric',day: 'numeric', hour: 'numeric',minute: 'numeric'})}</span>: <span style={{ color: 'var(--dynamic_gray)', fontSize:12}}>offline</span>)}
                    actions={
                      <React.Fragment>
                        <Button target='_blank' href={"https://vk.com/"+friend.domain}>Перейти в профиль</Button>
                        <Button  onClick={() => this.open(friend)}>Календарь низких цен</Button>
                      </React.Fragment>
                    }
                  >
                  {friend.first_name+" "+friend.last_name}
                  </RichCell>
                )}
              </List>
            )
            :
          <Placeholder
            icon={<Icon56UsersOutline />}
            header="Друзья"
            action={<Button onClick={this.getFriends} size="l">Показать список</Button>}
          >
            Чтобы получить список к друзьям, вам нужно предоставить доступ приложению.
          </Placeholder>
        }
          <Div />
          <Div />
          </div>
        }
        {this.state.snackbar}
      </Panel>
    )
  }
}

export default Friends
