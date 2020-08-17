import React, { Component } from 'react'
import { Panel, PanelHeader, PanelHeaderBack, Div, Input, List, SimpleCell, Placeholder } from '@vkontakte/vkui'
import Icon24Done from '@vkontakte/icons/dist/24/done';

export class ChooseCity extends Component {
  state = {
    inp: this.props.default,
    list:null
  }

  onChange = (e) => {
    let country = "";
    if(this.props.changeDefaultName == 'citySrc') 
        country = this.props.state.countrySrc;
    if(this.props.changeDefaultName == 'cityDst') 
        country = this.props.state.countryDst;
    if(this.props.changeDefaultName == 'city_')
        country = this.props.state.user.country.title;
    console.log(this.props.state);        
    fetch(`https://autocomplete.travelpayouts.com/places2?term=${country} ${
      e.currentTarget.value
    }&locale=ru&types[]=city`)
    .then(response => response.json())
    .then(list => {
      if(list.length > 0){
        var resArr = [];
        list.forEach(function(item){
          if(item.country_name === country){
            resArr.push(item);
          }
        });
        this.setState({
          list: resArr
        })
      }
    })
  }

  onChoose = (name) => {
    this.props.changeFunction(name);
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
        <Placeholder>Начните вводить название города</Placeholder>:
        <List>
          {
            list && list.map((item, i) => 
              <SimpleCell
                onClick={() => this.onChoose(item.name)}
                id={item.name}
                key={i}
                after={
                  item.name === text && (
                    <Icon24Done />
                  )
                }
              >
                {item.name}
              </SimpleCell>
            )
          }
        </List>
      }
      </Panel>
    )
  }
}

export default ChooseCity
