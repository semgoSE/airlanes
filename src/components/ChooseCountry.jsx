import React, { Component } from 'react'
import { Panel, PanelHeader, PanelHeaderBack, Div, Input, List, SimpleCell, Placeholder } from '@vkontakte/vkui'
import Icon24Done from '@vkontakte/icons/dist/24/done';

export class ChooseCountry extends Component {
  state = {
    inp: this.props.default,
    list:null
  }

  onChange = (e) => {
    fetch(`https://autocomplete.travelpayouts.com/places2?term=${
      e.currentTarget.value
    }&locale=ru`)
    .then(response => response.json())
    .then(list => {
      if(list.length > 0){
        var resArr = [];
        list.forEach(function(item){
          var i = resArr.findIndex(x => x.country_name === item.country_name);
          if(i <= -1){
            resArr.push(item);
          }
        });
        this.setState({
          list: resArr
        })
      }
    })
  }

  onChoose = (country_name) => {
    this.props.changeFunction(country_name);
    this.props.back()
  }

  render() {
    const {
      list
    } = this.state
    const {
      id,
      back,
      text
    } = this.props
    return (
      <Panel id={id}>
        <PanelHeader
          left={
            <PanelHeaderBack onClick={back} />
          }
        >{text}</PanelHeader>
        <Div>
          <Input
            onChange={this.onChange}
          />
        </Div>
        {list === null ? 
        <Placeholder>Начните вводить название страны</Placeholder>
        :
        <List>
          {
            list && list.map((item, i) => 
              <SimpleCell
                onClick={() => this.onChoose(item.country_name)}
                id={item.country_name}
                key={i}
                after={
                  item.country_name === text && (
                    <Icon24Done />
                  )
                }
              >
                {item.country_name}
              </SimpleCell>
            )
          }
        </List>
       }
      </Panel>
    )
  }
}

export default ChooseCountry
