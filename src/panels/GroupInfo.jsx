import React, { Component } from 'react'
import { Panel, PanelHeader, PanelHeaderBack, RichCell, SimpleCell, Link, Button, Alert, ScreenSpinner, Div, Text, Switch, PanelSpinner, Group, Header, MiniInfoCell, Placeholder, Gallery, Banner } from '@vkontakte/vkui'
import SnackbarError from '../components/SnackbarError';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import Icon28MailOutline from '@vkontakte/icons/dist/28/mail_outline';
import Icon20CommentOutline from '@vkontakte/icons/dist/20/comment_outline';
import Icon20GlobeOutline from '@vkontakte/icons/dist/20/globe_outline';
import Icon20ArticleOutline from '@vkontakte/icons/dist/20/article_outline';
import Icon20CheckBoxOff from '@vkontakte/icons/dist/20/check_box_off';
import Icon20CheckBoxOn from '@vkontakte/icons/dist/20/check_box_on';
import Icon20NarrativeOutline from '@vkontakte/icons/dist/20/narrative_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';
import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';
import Icon24ViewOutline from '@vkontakte/icons/dist/24/view_outline';
import Icon20FollowersOutline from '@vkontakte/icons/dist/20/followers_outline';
import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';
import Icon28ShareExternalOutline from '@vkontakte/icons/dist/28/share_external_outline';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';
import Icon24Dropdown from '@vkontakte/icons/dist/24/dropdown';
import Icon24Qr from '@vkontakte/icons/dist/24/qr';

import bridge from '@vkontakte/vk-bridge'




export class GroupInfo extends Component {

  state = {
    subscribeGroup: {},
    allowMessages:{},
    group:null,
    subscribe: false,
    is_watch:false,
    snackbar:null
  }
  // Подписка на сообщество
  subscribe = e => {
    if(e.currentTarget.checked) {
    this.props.setPopout(<ScreenSpinner />)
    const { state } = this.props
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
            group_id: this.props.state.currentGroup.code,
            access_token: auth.access_token,
            v: 5.107,
          }
        })
        .then(data => {
          bridge.sendPromise("VKWebAppJoinGroup", {"group_id": data.response[0].id})
          .then(() => {
            // Если пользователь подписался, то отправляем запрос 
            // на сохранение этих данных
            fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/save-groups", {
              "headers": {
                "accept": "*/*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json;charset=utf-8",
              },
              "body": JSON.stringify({
                user_id: state.user.id,
                app_id: state.appId,
                checkbox: data.response[0].id
              }),
              "method": "POST",
            })
            .then(() => {
              this.props.setPopout(null);
              this.setState({ subscribe: true })
            })
            .catch(() => {
              this.props.setPopout(null);
              this.setState({ snackbar: <SnackbarError text="Ошибка интернет-соеденения" onClose={() => this.setState({ snackbar: null})} />})
            })
          })
          .catch(() => {
            this.props.setPopout(null);
            this.setState({ snackbar: <SnackbarError text="Вы не подписались на группу." onClose={() => this.setState({ snackbar: null})} />}) 
          })
        })
        .catch(() => {
          this.props.setPopout(null);
          this.setState({ snackbar: <SnackbarError text="Ошибка получения группы" onClose={() => this.setState({ snackbar: null})} />})
        })
      }
    })
    .catch(() => {
      this.props.setPopout(null);
      this.setState({ snackbar: <SnackbarError text="Ошибка получения токена" onClose={() => this.setState({ snackbar: null})} />})
    })
    }
  }

  componentDidMount() {

    bridge.sendPromise("VKWebAppGetAuthToken", {
      app_id: this.props.state.appId,
      scope:"",
      request_id: 1
    })
    .then((auth) => {
      bridge.send("VKWebAppCallAPIMethod", {"method": "groups.isMember", "params": {"group_id": this.props.state.currentGroup.code, "user_id":this.props.state.user.id, "v": "5.120", "access_token":auth.access_token}})
      .then((response) => {
        console.log(response)
        bridge.send("VKWebAppCallAPIMethod", {"method": "groups.getById", "params": {"group_id": this.props.state.currentGroup.code,"fields":"description,members_count", "v": "5.120", "access_token":auth.access_token}})
        .then((data) => {
          console.log(data)
          this.setState({group: data.response[0], subscribe:(response.response == 1)});
        });
      });


    })






  }

  // Запрос на сообщения
  subscribeMessages = (screenName, name) => {
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
              request_id: 2,
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
                screenName,
                id:null,
                groupId:data.response[0].id, 
                from:tagsOut.map((item) => {
                  return {
                    tag: item,
                    checked: false
                  }
                }),
                to:tagsIn.map((item) => {
                  return {
                    tag: item,
                    checked: false
                  }
                })

              }
              this.props.onChangeGroups('obj', obj);
              this.props.openModal('subscribeCities')
              this.props.setPopout(null) 
              
            })
            .catch(() => {
              this.props.setPopout(null)
              this.setState({ snackbar: <SnackbarError text="Ошибка получения записей" onClose={() => this.setState({ snackbar: null})} />})
            })
          })
          .catch(() => {
            this.props.setPopout(null)
            this.setState({ snackbar: <SnackbarError text="Вы не разрешили сообщения" onClose={() => this.setState({ snackbar: null})} />})
          })
        })
        .catch(() => {
          this.props.setPopout(null)
          this.setState({ snackbar: <SnackbarError text="Ошибка получения группы" onClose={() => this.setState({ snackbar: null})} />})
        })
      }
    })
    .catch(() => {
      this.props.setPopout(null)
      this.setState({ snackbar: <SnackbarError text="Ошибка получения токена" onClose={() => this.setState({ snackbar: null})} />})
    })
  }

  // Предупреждение с информацией
  subscribeMessagesAlert = e => {
    const screenName = e.currentTarget.id.split("com/")[1]
    const name = e.currentTarget.name
    this.props.setPopout(
      <Alert
        actions={[{
          title: 'Отмена',
          autoclose: true,
          mode: 'cancel'
        }, {
          title: 'Разрешить',
          autoclose: true,
          action: () => this.subscribeMessages(screenName, name),
        }]}
        onClose={() => this.props.setPopout(null)}
      >
        <p>Вы можете получать со стены сообщества в личные сообщения только те авиабилеты, которые Вам интересны. Для этого разрешите сейчас сообщения в сообществе и выберите города прилета из списка.</p>
      </Alert>
    )
  }

  openAlert = (item, e) => {
    if(e.currentTarget.checked) {
      this.subscribeMessages(item.code, item.description);
    }else {
      this.props.setPopout(<ScreenSpinner />)
      bridge.sendPromise("VKWebAppGetAuthToken", {
        app_id: this.props.state.appId,
        scope:"",
        request_id: 1
      })
      .then((auth) => {
          bridge.send("VKWebAppCallAPIMethod", {"method": "groups.getById", "params": {"group_id": item.code,"fields":"description", "v": "5.120", "access_token":auth.access_token}})
          .then((data) => {
            console.log(data);
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
                  action: () => this.delete(item.code),
                }]}
                onClose={() => this.props.setPopout(null)}
              >
                <Text weight='regular'>Удалить все подписки в личные сообщения из сообщества <b>"{data.response[0].name}"</b>?</Text>
              </Alert>
            )
          });
   });
  }
}

  delete = (code) => {
    this.props.setPopout(<ScreenSpinner />);
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
      let arrCategory = [];
      let arr = [];
      data.tags.forEach(tag => {
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
      );
      this.props.state.my_groups.splice(this.props.state.my_groups.indexOf(code), 1);
      console.log(this.props.state.my_groups.indexOf(code), arr)
      this.props.setPopout(null);
    }).catch(err => {
      this.props.setPopout(null)
      this.setState({snackbar:<SnackbarError close={() => this.setState({snackbar:null})}/>, data:'error'})
    })
  }

  share = () => {
    bridge.send("VKWebAppShare", {"link": "https://vk.com/" + this.props.state.currentGroup.code})
    .then()
    .catch((ee) => {
      console.log(ee)
    })
  }

  render() {
    const {
      id,
      state,
      go,
    } = this.props

    const { group, subscribe } = this.state;
    return (
      <Panel id={id}>
        <PanelHeader
          left={
            <PanelHeaderBack onClick={() => this.props.onChangeGroups('activePanel',state.currentGroup.source)} />
          }
        >{group && group.name}</PanelHeader>
        {
          group == null ? <PanelSpinner /> : (
          <div>  
            <SimpleCell before={<Icon24ViewOutline fill='var(--accent)' />}>
              <Link href={"https://vk.com/"+state.currentGroup.code} target="_blank">Перейти в сообщество</Link>
            </SimpleCell>
            <SimpleCell before={<Icon20FollowersOutline height={24} width={24} fill={!subscribe ? '#4BBDE7' : '#0E62F1'}/>} multiline after={<Switch checked={subscribe} onChange={this.subscribe}/>}>
              Добавить дешевые авиабилеты в ленту новостей
            </SimpleCell>
          <SimpleCell before={<Icon28MessageOutline height={24} width={24} fill={state.my_groups.indexOf(state.currentGroup.code) === -1 ? '#4BBDE7' : '#0E62F1'}/>} multiline  after={<Switch onChange={(e) => this.openAlert(state.currentGroup, e)} checked={state.my_groups.indexOf(state.currentGroup.code) !== -1} />}>
          Хочу выбрать дешевые авиабилеты, которые нужно присылать со стены сообщества в личные сообщения
            </SimpleCell>



            <SimpleCell before={<Icon20FollowersOutline />}>
              {group.members_count + ' подписчиков'}
            </SimpleCell>
            <SimpleCell before={<Icon28ShareExternalOutline height={24} width={24} fill='var(--accent)' />} onClick={this.share}>
              <Link>Поделиться с друзьями</Link>
            </SimpleCell>
            {!this.state.is_watch && <SimpleCell onClick={() => this.setState({ is_watch:true})} before={<Icon24Dropdown />}><Link>показать больше</Link></SimpleCell>}
            {this.state.is_watch &&
            <div>
            <SimpleCell before={<Icon28Notifications height={24} width={24} />} after={<Switch />}>
              Уведомлять о записях
            </SimpleCell>

            <SimpleCell before={<Icon28FavoriteOutline height={24} width={24} />} after={<Switch />}>
              Сохранить в закладках
            </SimpleCell>

            <SimpleCell before={<Icon24Qr height={24} width={24} fill='var(--accent)' />} onClick={() => this.props.openModal('qr')}>
              <Link>Открыть QR</Link>
            </SimpleCell>
            <Gallery>
              <div>
                <Banner />
              </div>
              <div>
                <Banner />
              </div>
            </Gallery>
            </div>
  }
            {this.state.snackbar}
          </div>
          ) 
        }
      </Panel>
    )
  }
}

export default GroupInfo
