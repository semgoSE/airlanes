import React, { Component } from 'react';
import { Panel, PanelHeader, List, SimpleCell, ScreenSpinner, PanelSpinner } from '@vkontakte/vkui';
import { VKMiniAppAPI } from '@vkontakte/vk-mini-apps-api';
import bridge from '@vkontakte/vk-bridge'

const api = new VKMiniAppAPI();
 
export default class Admin extends Component {
    state = {
        data:[]
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
                let arr = [];
                response.response.items.forEach((el) => {
                    if(this.props.state.data.findIndex(t => t.code == el.screen_name) != -1) arr.push({...el, act:false})
                }) 
                this.setState({ data: arr})
            }).catch(err => console.log(err))
            console.log(accessToken);
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
    }


    render() {
        const { id } = this.props;
        return (
            <Panel id={id}>
                <PanelHeader>Админка</PanelHeader>
                {this.props.state.data.length == 0 ? <PanelSpinner />:
                <List>
                    {this.state.data.map((item, index) =>
                        <SimpleCell onClick={() => this.action(item, index)} indicator={item.act ? "активна":'не активна'}>{item.name}</SimpleCell>
                    )}
                </List>
                }
            </Panel>
        )
    }
}