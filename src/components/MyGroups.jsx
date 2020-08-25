import React, { Component } from 'react'
import bridge from '@vkontakte/vk-bridge'
import { Group, ScreenSpinner, List, Text, Link, Header, Placeholder, ActionSheet, ActionSheetItem, Alert, SimpleCell, PullToRefresh, Checkbox, Div, Separator, Snackbar, Title, PromoBanner } from '@vkontakte/vkui'
import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';
import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';
import Icon24Settings from '@vkontakte/icons/dist/24/settings';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28ChevronDownOutline from '@vkontakte/icons/dist/28/chevron_down_outline';

import SnackbarError from './SnackbarError';
import booking from '../img/booking.png';

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

export class MyGroups extends Component {
  state = {
    data: this.props.groups,
    list:{},
    snackbar:null,
    isFetching:false,
    is_watch:false,
    is_market:true,
    deleted:[]
  }

  componentDidMount() {
    console.log(this.props.info)
    let obj = {};
    this.state.data.forEach((el) => {
      el.data.forEach((data) => {
          obj = {...obj, [data.code]:false};
      })
    })
    console.log(obj)
    this.setState({list:obj});
  }

  onChangeDelete = (e) => {
    const { name , checked, id } = e.currentTarget;
    if(checked) 
      this.state.deleted.push({group:id, to:name});
    else {
      let i = this.state.deleted.findIndex(i => i.to === name);
      this.state.deleted.splice(i, 1);
    }
    console.log(this.state.deleted)
  }

  openConfirm = (name, screenName, n, i) => { 

    this.props.setPopout(<ScreenSpinner />)
      bridge.sendPromise("VKWebAppGetAuthToken", {
        app_id: this.props.state.appId,
        scope:"",
        request_id: 1
      })
      .then((auth) => {
          bridge.send("VKWebAppCallAPIMethod", {"method": "groups.getById", "params": {"group_id": screenName,"fields":"description", "v": "5.120", "access_token":auth.access_token}})
          .then((data) => {
            this.props.setPopout(
              <Alert
                actions={[{
                  title: 'Отмена',
                  autoclose: true,
                  mode: 'cancel'
                }, {
                  title: 'Удалить',
                  autoclose: true,
                  mode:'destructive',
                  action: () => this.deleteAll(screenName, n, i),
                }]}
                onClose={() => this.props.setPopout(null)}
              >
                <Text>Удалить все подписки в личные сообщения из сообщества <b>"{data.response[0].name}"</b>?</Text>
              </Alert>
            )
          });
   });
  }

  deleteAll = (code, n, i, group) => {
    this.props.setPopout(<ScreenSpinner />);
      this.state.data[n].data[i].data.forEach(tag => {
        if(tag.body.split('@')[1] == code) {
          fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/remove-tag", {
            "headers": {
              "accept": "*/*",
              "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
              "content-type": "application/json;charset=utf-8",
            },
            "referrer": "https://appvk.flights.ru/",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": JSON.stringify({tag_id:tag.id, user_id:this.props.state.user.id}),
            "method": "POST",
          })
          .then(response => response.json())
          .then(check => {
            if(check.response === 'ok'){
            }
          })
        }
      }  
      )
        this.props.state.my_groups.splice(this.props.state.my_groups.indexOf(code), 1);
        this.props.onChangeCount('countGroups', this.props.state.my_groups.length);
        this.state.data[n].data.splice(i, 1);
        this.props.setPopout(null);

  }

  delete = (id, n, i, t) => {
    console.log(i)
    this.props.setPopout(<ScreenSpinner />);
    fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/remove-tag", {
      "headers": {
        "accept": "*/*",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=utf-8",
      },
      "referrer": "https://appvk.flights.ru/",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": JSON.stringify({tag_id:id, user_id:this.props.state.user.id}),
      "method": "POST",
    })
    .then(response => response.json())
    .then(check => {
      if(check.response === 'ok'){
        this.state.data[n].data[i].data.splice(t, 1);
        if(this.state.data[n].data[i].data.length === 0) {
          this.state.data[n].data.splice(i, 1)
        }
        this.props.setPopout(null);
        this.setState({ snackbar: <Snackbar action="Отмена" onClose={() => this.setState({ snackbar: null})}><Text>Подписка удалена.</Text></Snackbar>})
      }
    })
  }


  edit_ = (name, screenName, n, i) => {
    console.log(screenName)
    const { state } = this.props
    this.props.setPopout(<ScreenSpinner />)
    bridge.sendPromise("VKWebAppGetAuthToken", {
      app_id: state.appId,
      scope: "wall,groups",
      request_id: 1
    })
    .then(auth => {
      if(auth.access_token && auth.scope === "wall,groups"){
        bridge.sendPromise("VKWebAppCallAPIMethod", {
          method: "groups.getById",
          request_id: 2,
          params: {
            group_id: screenName,
            access_token: auth.access_token,
            v: 5.107,
          }
        })
        .then(data => {
          bridge.sendPromise("VKWebAppAllowMessagesFromGroup", {"group_id": data.response[0].id, "key": "dBuBKe1kFcdemzB"})
          .then(() => {
            bridge.sendPromise("VKWebAppCallAPIMethod", {
              method: "wall.get",
              request_id: 3,
              params: {
                domain: screenName,
                access_token: auth.access_token,
                v: 5.107,
              }
            })
            .then(async tags => {
              let tagsIn = [];
              let tagsOut = [];
              let itemsWall = tags.response.items;
              let tags_obj = this.state.data[n].data[i].data.filter(element => { if(element.body.split('@')[1] ===  screenName) { return true; }});
              let tags_name = tags_obj.map(e => { return e.body});
              console.log(tags_name);
              itemsWall.forEach((group) => {
                let match = [...group.text.matchAll(/(#.*@.*)/g)];
                if (match.length) {
                  if (match.length > 2) {
                    let matchOut = match[2];
                    tagsOut.push(matchOut)
                }
                let matchIn = match[0];
                tagsIn.push(matchIn)
                }
              });
              tagsIn = tagsIn.map((item) => 
                item[0]
              )
              tagsIn = tagsIn.filter((v,i) => tagsIn.indexOf(v) === i)
              tagsOut = tagsOut.map((item) => 
                item[0]
              )
              tagsOut = tagsOut.filter((v,i) => tagsOut.indexOf(v) === i)
              let obj = {
                name:name,
                groupId:data.response[0].id, 
                from:tagsOut.map((item) => {
                  return {
                    tag: item,
                    checked: tags_name.indexOf(item) !== -1
                  }
                }),
                to:tagsIn.map((item) => {
                  return {
                    tag: item,
                    checked: tags_name.indexOf(item) !== -1
                  }
                })
              }
              this.props.onChangeGroups('obj', obj);
              this.props.openModal('subscribeCities');
              this.props.setPopout(null);

            })
            .catch((err) => {this.props.setPopout(null); console.log(err)})
          })
          .catch((err) => {this.props.setPopout(null); console.log(err)})
        })
        .catch((err) => {this.props.setPopout(null); console.log(err)})
      }
    })
    .catch(() => this.props.setPopout(null))
  }

  onRefresh = () => {
    this.setState({ isFetching:true })
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
      this.setState({ data: arr, isFetching:false})
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
        {this.state.data === 'error' ? <Placeholder>Ошибка интернет-соединения</Placeholder>:
        data && 
        <div>
          {(data.length === 0 || this.props.info.info_groups) ? <Placeholder>
                                    <div align="justify">
                                      <Text>
                                      {this.props.state.user.sex == 2 ? 
                                        <div>
                                          <Title level='3' weight='heavy'>Витрина гипермаркета «Дешевые авиабилеты» - это 700 сообществ</Title>
                                          <p>
                                          Мы показываем авиабилеты в момент снижения цены от 30% по заранее выбранным параметрам на витрине гипермаркета.
                                          </p>
                                          <p>
                                          Например, из Москвы или Санкт-Петербурга по частям света, на курорты, к морским и океанским круизам, на выходные и праздники, из всех городов России, во все страны мира, из Европы, СНГ, а в странах, где русскоязычное население составляет больше 0,4% - из каждого города, где есть международный аэропорт.
                                          </p>
                                          <p>
                                          Если твои интересы учтены - найди свой город вылета, подпишись на выбранные сообщества и получай дешевые авиабилеты по всем направлениям в новостной ленте.
                                          </p>
                                          <Title level='3' weight='heavy'>Не часто смотришь новости? Хочется большего?</Title>
                                          <p>
                                          Цена на авиабилеты постоянно меняется и при ее снижении дешевые авиабилеты раскупаются моментально. Выбери все или отдельные направления полетов в нужном сообществе и получай дешевые авиабилеты в личные сообщения. Так теперь тоже можно, прямо со стены сообщества в личные сообщения. Добавь подписку в этом разделе и узнай первым о снижении цены!
                                          </p>
                                          <p>
                                          Дешевые авиабилеты нас не ждут - все наоборот.
                                          </p>
                                          <Title level='3' weight='heavy'>Лететь одному?</Title>
                                          <p>
                                          Найди <Link target='_blank' href='https://vk.com/poputchiki'>компанию</Link> и каждый день поездки или путешествия наполнится радостью общения. В любом месте веселее вместе! Делись впечатлениями, обсуждай новое и радуйся вместе с новыми друзьями!
                                          </p>
                                          <Title level='3' weight='heavy'>Посетитель или опытный путешественник</Title>
                                          <p>
                                          Подписки в разделе «Витина» помогут повысить статус в программе лояльности и откроют в разделе «Мой выбор» дополнительные возможности – получение авиабилетов с увеличенным размером выгоды (до 90%), выбор дней недели вылета, длительности поездки и др.) Узнай больше в разделе «Помощь».
                                          </p>
                                          <Link onClick={() => {this.setState({is_watch:!this.state.is_watch})}}>показать еще...</Link>
                                          {this.state.is_watch && 
                                          <div>
                                            <p>
                                            Мы показываем авиабилеты в момент снижения цены от 30% и больше. Интересно, как развивается проект? Узнай в <Link href='https://vk.com/public192548341' target='_blank'>сообществе</Link>.
                                            </p>
                                            <p>
                                            Больше не нужно искать дешевые авиабилеты - теперь они сами находят нас.
                                            </p>
                                            
                                            <Link onClick={() => {this.setState({is_watch:!this.state.is_watch})}}>cвернуть</Link>
                                          </div>
                                          }
                                        </div>: 
                                        <div>
                                        <div>
                                          <p>
                                          Витрина гипермаркета «Дешевые авиабилеты» - это 700 сообществ, в которых ты увидишь дешевые авиабилеты по заранее выбранным нами параметрам.
                                          Погуляй среди свежих новостей о стоимости перелетов, присмотри что-нибуь вдохновляющее на выходные или даже - для отличного отпуска? Например, из Москвы в Европу или погулять по Санкт-Петербургу… Ты будешь всегда в курсе оптимальных цен на полеты во все туристические локации мира. Возьми подругу или попутчицу, ведь новые туфельки и платье ждут обсуждения на дефиле вечернего променада!
                                          Дешевые авиабилеты из Москвы, Санкт-Петербурга и еще 140 городов России по частям света, на курорты, к морским и океанским круизам, на выходные и праздники, во все страны мира с выгодой 30-90%, а также вылеты из Европы, стран СНГ, а там, где русскоязычное население составляет больше 0,4% - из каждого города, где есть международный аэропорт. Все это ты увидишь в разделе «Витрина» гипермаркета «Дешевые авиабилеты».                                          
                                          Найди свой город вылета, подпишись на сообщество и получай дешевые авиабилеты по всем направлениям из твоего города в новостной ленте.
                                          </p>
                                          <p>
                                          Найди свой город вылета, подпишись на сообщество и получай дешевые авиабилеты по всем направлениям из твоего города в новостной ленте.
                                          </p>
                                          <Title level='3' weight='heavy'>Хочешь большего?</Title>
                                          <p>
                                          Цена на авиабилеты постоянно меняется и при ее снижении дешевые авиабилеты раскупаются моментально. Выбери все или отдельные направления полетов в нужном сообществе и получай дешевые авиабилеты в личные сообщения. Так теперь тоже можно, прямо со стены сообщества в личные сообщения. Добавь подписку в этом разделе и узнай первая о снижении цены!
                                          </p>
                                          <p>Дешевые авиабилеты нас не ждут - все наоборот…</p>
                                          <Title level='3' weight='heavy'>Лететь одной?</Title>
                                          <p>                                 
                                          Найди <Link href='https://vk.com/poputchiki' target='_blank'>попутчицу или компанию</Link> и каждый день поездки или путешествия наполнится радостью общения. В любом месте веселее вместе! Делись впечатлениями, обсуждай новое и радуйся вместе с новыми друзьями!
                                          </p>
                                          <Title level='3' weight='heavy'>Посетитель или опытная путешественница</Title>
                                          <p>
                                          Мы рады каждой подписчице и не важно, сколько стран ты посетила и как часто летаешь на самолетах. Подписки в разделе «Витина» помогут повысить статус в программе лояльности и откроют в соседнем разделе дополнительные возможности – получение авиабилетов с увеличенным размером выгоды (до 90%), выбор дней недели вылета, длительности поездки и др.) Узнай больше в разделе «Помощь».
                                          </p>
                                          <Link onClick={() => {this.setState({is_watch:!this.state.is_watch})}}>показать еще</Link>
                                          {this.state.is_watch && 
                                          <div>
                                            <p>
                                            Мы показываем авиабилеты в момент снижения цены от 30%. Интересно, что и как мы делаем? Узнай в <Link href="https://vk.com/public192548341" target="_blank">сообществе</Link> (линк ) проекта
                                            </p>
                                            <p>
                                            Больше не нужно искать дешевые авиабилеты - теперь они сами находят нас.
                                            </p>
                                            <Link onClick={() => {this.setState({is_watch:!this.state.is_watch})}}>cвернуть</Link>
                                          </div>
                                          }
                    
                                        </div>
                                        </div>
                                      }
                                      </Text>
                                      </div>
                                  </Placeholder>:
          <List>
            {
                data.map((item, n) => 
                  <div key={n}>
                    {item.data.map((data, i) =>
                      <div key={item.category}>
                        <SimpleCell 
                          onClick={() => this.setState({ list:{...this.state.list, [data.code]:!this.state.list[data.code]}})}
                          style={{ fontWeight: 'bold', marginTop:(i == 0 ? 24 : 0)}} 
                          after={
                             <Icon28ChevronDownOutline fill='#4BBDE7' style={{ transform: `rotate(${this.state.list[data.code] ? '180deg' : '0'})` }} />
                             }>{item.category + " -  " + data.group}
                        </SimpleCell>

                        {this.state.list[data.code] && <div>
                          <SimpleCell>
                          <Link style={{ display: 'flex'}}>
                              <Icon28SettingsOutline onClick={() => this.edit_(data.group, data.code, n, i)} fill='#0E62F1'/>
                              <Icon28DeleteOutlineAndroid style={{ marginLeft:22 }} fill='#0E62F1' onClick={() => this.openConfirm(data.group, data.code, n, i)}/>
                          </Link>
                        </SimpleCell>
                          {data.data.map((res, t) => 
                            <SimpleCell key={res.id} after={<Link onClick={() => this.delete(res.id, n, i, t)}><Icon28DeleteOutlineAndroid fill='#4BBDE7'/></Link>}>{res.body.split('@')[0].split('#')[1]}</SimpleCell>
                          )}  
                          </div>  }               
                      </div>          
                    )}
                </div>  
                )    
            }
          </List>
          }
          <Div />
          <Div />
          </div>
        }
        {this.state.snackbar}
      </div>
      </PullToRefresh>
      
      </div>
    )
  }
}

export default MyGroups
