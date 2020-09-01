import React, { Component } from 'react';
import { Panel, PanelHeader, List, SimpleCell, ScreenSpinner, FormLayout, Textarea, Button, Cell } from '@vkontakte/vkui';
import { VKMiniAppAPI } from '@vkontakte/vk-mini-apps-api';
import bridge from '@vkontakte/vk-bridge'

const api = new VKMiniAppAPI();
 
export default class Admin extends Component {
    state = {
        data:[],
        is_list:false,
        text:'',
    }

    componentDidMount() {
        api.getAccessToken(this.props.state.appId, 'groups')
        .then(accessToken => {
            bridge.sendPromise("VKWebAppCallAPIMethod", {
                method: "groups.get",
                params: {
                  access_token: accessToken.accessToken,
                  filter: "admin",
                  extended:1,
                  v: 5.107
                },
              })
            .then(response => {
                this.setState({ data: response.response.items})
            }).catch(err => console.log(err))
        })
    }


    save_admin = () => {
      this.props.setPopout(<ScreenSpinner />)
      fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/save-admin", {
        "headers": {
          "accept": "*/*",
          "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json;charset=utf-8",
        },
        "body": JSON.stringify({
            api_text:this.state.text,
        }),
        "method": "POST",
      })
      .then(response => response.json())
      .then(res => {
        this.props.setPopout(null)
      }) 
    }

   action = (item, index) => {
        this.props.setPopout(<ScreenSpinner />)
        bridge.send("VKWebAppGetCommunityToken", {app_id: this.props.state.appId, group_id: item.id, scope: "manage,messages"})
        .then((token) => {
            bridge.sendPromise("VKWebAppCallAPIMethod", {
                method: "groups.getCallbackConfirmationCode",
                params: {
                  access_token: token.access_token,
                  group_id: item.id,
                  v: 5.107
                },
              }).then(res => {
                fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/setup-confirmation", {
                    "headers": {
                      "accept": "*/*",
                      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                      "content-type": "application/json;charset=utf-8",
                    },
                    "body": JSON.stringify({
                        confirmation_code: res.response.code
                    }),
                    "method": "POST",
                  })
                  .then(response => response.json())
                  .then(data => {
                    bridge.sendPromise("VKWebAppCallAPIMethod", {
                      method: "groups.getCallbackServers",
                      params: {
                        access_token: token.access_token,
                        group_id: item.id,
                        v: 5.107
                      }
                    }).then(res => {
                        res.response.items.forEach(s => {
                          bridge.sendPromise("VKWebAppCallAPIMethod", {
                            method: "groups.deleteCallbackServer",
                            params: {
                              server_id: s.id,
                              access_token: token.access_token,
                              group_id: item.id,
                              v: 5.107
                            }
                          })
                        })
                        bridge.sendPromise("VKWebAppCallAPIMethod", {
                          method: "groups.addCallbackServer",
                          params: {
                            url: "https://appvk.flights.ru/bot",
                            title: 'botserver',
                            access_token: token.access_token,
                            group_id: item.id,
                            v: 5.107
                          }
                        }).then((server) => {
                          bridge.sendPromise("VKWebAppCallAPIMethod", {
                            method: "groups.setCallbackSettings",
                            params: {
                              server_id: server.response.server_id,
                              access_token: token.access_token,
                              api_version: 5.103,
                              wall_post_new:1,
                              confirmation:1,
                              message_allow:1,
                              group_id: item.id,
                              v: 5.107
                            }
                          }).then((y) => {
                            bridge.sendPromise("VKWebAppCallAPIMethod", {
                              method: "groups.setSettings",
                              params: {
                                api_version: 5.103,
                                messages: 1,
                                access_token: token.access_token,
                                group_id: item.id,
                                v: 5.107
                              }
                            })
                          })
                        })
                      }).then(() => {
                        fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/save-chat", {
                          "headers": {
                            "accept": "*/*",
                            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                            "content-type": "application/json;charset=utf-8",
                          },
                          "body": JSON.stringify({
                              id:item.id,
                              token: token.access_token
                          }),
                          "method": "POST",
                        })
                        .then(response => response.json())
                        .then(res => {
                          this.state.data.splice(index, 1, {...item, act:true});
                          this.props.setPopout(null)
                        }) 
                      })
                  })
              })
        }).catch(err => this.props.setPopout(null))
    }


    render() {
        const { id } = this.props;
        return (
            <Panel id={id}>
                <PanelHeader>Админка</PanelHeader>
                <SimpleCell onClick={() => this.setState({ is_list: !this.state.is_list})}>группы</SimpleCell>
                {this.state.is_list && <List>
                    {this.state.data.map((item, index) =>
                        <SimpleCell onClick={() => this.action(item, index)} indicator={item.act ? "активна":'не активна'}>{item.name}</SimpleCell>
                    )}
                </List>}
                    <FormLayout>
                    <Textarea value={this.state.text} onChange={(e) => this.setState({text: e.target.value })} /> 
                    <Button onClick={this.save_admin}>Сохранить</Button> 
                    </FormLayout>
                    <Cell>
                        [[srcCity]] - город вылета
                    </Cell>
                    <Cell>
                        [[srcCountry]] - страна вылета
                    </Cell>
                    <Cell>
                        [[arrow]] - стрелочка-разделитель
                    </Cell>
                    <Cell>
                        [[dstCity]] - город прилета
                    </Cell>
                    <Cell>
                        [[dstCountry]] - страна прилета
                    </Cell>
                    <Cell>
                        [[dates]] - даты
                    </Cell>
                    <Cell>
                        [[price]] - цена 　　
                    </Cell>
                    <Cell>
                        [[oldPrice]] - обычная цена
                    </Cell>
                    <Cell>
                        [[discount]] - выгода
                    </Cell>
                    <Cell>
                        [[footer]] - футер
                    </Cell>
                    <Cell>
                        [[tempMin]], [[tempMax]] - температура в день прилета мин-я и макс-я
                    </Cell>
                    <Cell>
                        [[vkAppId]] - ссылка на приложение
                    </Cell>
                    <Cell>
                        [[updated:d]] - дата нахождения авиабилета
                    </Cell>
                    <Cell>
                        [[updated:g]] - дата и время нахождения авиабилета
                    </Cell>
                    <Cell>
                        [[tempSummary]] - дополнительная информация о погоде (например, облачно, с прояснениями)
                    </Cell>
                    <Cell>
                        [[url]] - это ссылка в выбранной валюте и на выбранное кол-во и класс билетов
                    </Cell>
                    <Cell>
                        [[passengers]] - пассажиры
                    </Cell>

            </Panel>
        )
    }
}