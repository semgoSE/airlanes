import React, { Component } from 'react'
import { Group, ScreenSpinner, List, RichCell, Link, Separator } from '@vkontakte/vkui'
import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';
import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';

export class MyGroups extends Component {
  state = {
    data: null,
  }
  componentDidMount() {
    this.props.setPopout(<ScreenSpinner />)
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
      this.setState({ data: data.tags })
      this.props.setPopout(null)
    })
  }
  render() {
    const {
      data
    } = this.state
    return (
      <Group>
        <List>
          {
            data && (
              data.map((item, i) =>
                <div key={i}>
                  <RichCell
                    text={item.group_name}
                    caption={
                      "Куда: "+item.body.split("#")[1].split("@")[0]
                    }
                    after={
                      <div>
                        <Link>
                          <Icon28EditOutline />
                        </Link><br /><br />
                        <Link>
                          <Icon28DeleteOutlineAndroid />
                        </Link>
                      </div>
                    }
                  >
                    {item.category}
                  </RichCell>
                  <Separator />
                </div>
              )
            )
          }
        </List>
      </Group>
    )
  }
}

export default MyGroups
