import React, { Component } from 'react'
import { Panel, PanelHeader, PanelHeaderBack, Switch, Link, RichCell, Header, ScreenSpinner, Alert, Div, Avatar, Text } from '@vkontakte/vkui'
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import Icon28MailOutline from '@vkontakte/icons/dist/28/mail_outline';
import Icon28UserAddOutline from '@vkontakte/icons/dist/28/user_add_outline';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28HelpOutline from '@vkontakte/icons/dist/28/help_outline';
import Icon28AddSquareOutline from '@vkontakte/icons/dist/28/add_square_outline';
import Icon28CheckSquareOutline from '@vkontakte/icons/dist/28/check_square_outline';
import bridge from '@vkontakte/vk-bridge'
import SubscribeCities from '../components/SubscribeCities'
import SnackbarError from '../components/SnackbarError';

export class SectionCatalog extends Component {

    state = {
      my_groups:this.props.state.my_groups,
      subscribeGroup: {},
      allowMessages:{},
    }

    subscribe = screenName => {
      this.props.setPopout(<ScreenSpinner />);
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
              group_id: screenName,
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
              }).then((response) => response.json)
                .then((response) => {
                  let obj = {...this.state.subscribeGroup, [screenName]:true};
                  
                  this.setState({subscribeGroup: obj})
                  this.props.setPopout(null);
                })
                .catch(() => this.props.setPopout(null));
            }).catch(() => this.props.setPopout(null));
          }).catch(() => this.props.setPopout(null));
        }
      }).catch(() => this.props.setPopout(null));
    }
  
    componentDidMount() {
      
      let list = this.props.state.catalog[this.props.state.currentCatalog].to[this.props.state.currentSection].arr.map((item) => item.code).join(',');
      bridge.sendPromise("VKWebAppGetAuthToken", {
        app_id: this.props.state.appId,
        scope:"",
        request_id: 1
      })
      .then((data) => {
        bridge.send("VKWebAppCallAPIMethod", {"method": "execute.getSubscribeGroup", "params": {"list": list, "v": "5.120", "access_token":data.access_token}})
        .then((response) => {
          let obj = {};
          response.response.forEach((el) => { 
            obj[el.name] = (el.is == 1);
          })
          console.log(obj)
          this.setState({subscribeGroup: obj});
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
                  screenName:screenName,
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
              .catch(() => this.props.setPopout(null))
            })
            .catch(() => this.props.setPopout(null))
          })
          .catch(() => this.props.setPopout(null))
        }
      })
      .catch(() => this.props.setPopout(null))
    }

    edit = (item, n) => {
      let name = item.description;
      let screenName = item.code;
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
              .then(tags => {
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
                .then(arr => {
                  let tagsIn = [];
                  let tagsOut = [];
                  let itemsWall = tags.response.items;
                  let tags_obj = arr.tags.filter(element => { if(element.body.split('@')[1] ===  screenName) { return true; }});
                  let tags_name = arr.tags.map(e => { return e.body});
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
                }).catch(err => {
                  this.props.setPopout(null)
                  console.log(err)
                  this.setState({snackbar:<SnackbarError close={() => this.setState({snackbar:null})}/>, data:'error'})
                })
              })
              .catch((err) => {this.props.setPopout(null); console.log('1')})
            })
            .catch((err) => {this.props.setPopout(null); console.log('2')})
          })
          .catch((err) => {this.props.setPopout(null); console.log('3')})
        }
      })
      .catch(() => {this.props.setPopout(null); console.log('4')})
    }
  
  
    // Предупреждение с информацией
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
                  <Text>Удалить все подписки в личные сообщения из сообщества <b>"{data.response[0].name}"</b>?</Text>
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

  render() {
    const {
      id,
      state,
      go,
    } = this.props
    return (
      <Panel id={id}>
        <PanelHeader
          left={
            <PanelHeaderBack onClick={() => go("catalog")} />
          }
        >{state.catalog[state.currentCatalog].catalog}</PanelHeader>
      
        {
          (state.currentSection || state.currentSection === 0) && (
            <Header>{state.catalog[state.currentCatalog].to[state.currentSection].section}</Header>
          )
        }
        {
          (state.currentSection || state.currentSection === 0) && (
            state.catalog && (
              state.catalog[state.currentCatalog].to[state.currentSection].arr.map((item, index) => 
              <RichCell
                key={index}
                multiline
                actions={this.state.subscribeGroup[item.code] || state.my_groups.indexOf(item.code) !== -1 ? <span style={{ fontSize:12, color:'var(--dynamic_gray)'}}>{this.state.subscribeGroup[item.code] && "добавлено в новостную ленту"}<br /> {state.my_groups.indexOf(item.code) !== -1 && "добавлено в личные сообщения"}</span> : null}
                bottom={
                  <div style={{ marginTop: 8 }}>
                    <Link href={"https://vk.com/"+item.code} target="_blank"><Icon28ViewOutline fill="#4BBDE7"/></Link>
                    <Link style={{ marginLeft:22 }}>{<Icon28UserAddOutline fill={!this.state.subscribeGroup[item.code] ? "#4BBDE7": '#0E62F1'} onClick={() => {if(!this.state.subscribeGroup[item.code]) this.subscribe(item.code)}} />}</Link>
                    <Link style={{ marginLeft:22 }}>{<Icon28SettingsOutline fill={state.my_groups.indexOf(item.code) === -1 ? '#4BBDE7' : '#0E62F1'} onClick={() => {if(state.my_groups.indexOf(item.code) === -1) this.subscribeMessages(item.code, item.description); else this.edit(item)}} />}</Link>
                    <Link style={{ marginLeft:22 }}><Icon28HelpOutline fill="#4BBDE7" onClick={() => this.props.goGroup({...item, source:'catalog'})}/></Link>
                  </div>
                }
                
                after={<Switch onChange={(e) => this.openAlert(item, e)} checked={state.my_groups.indexOf(item.code) !== -1 }/>}
              >
                {item.description}
              </RichCell>
              )
            )
          )
        }
 
      </Panel>
    )
  }
}

export default SectionCatalog
