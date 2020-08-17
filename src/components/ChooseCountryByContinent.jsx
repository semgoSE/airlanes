import React, { Component } from 'react'
import { Panel, PanelHeader, PanelHeaderBack, Div, Input, List, SimpleCell, Placeholder } from '@vkontakte/vkui'
import Icon24Done from '@vkontakte/icons/dist/24/done';

export class ChooseCountryByContinentp extends Component {
  state = {
    inp: this.props.default,
    list:null
  }

  onChange = (e) => {
    const search = e.currentTarget.value.toLowerCase();
    fetch(`https://cors-anywhere.herokuapp.com/https://api.cheapflights.sale/api/countries/byContinent/${
      this.props.state.continentDst
    }`)
    .then(response => response.json())
    .then(list => {

        let arr = list.map((item) => { return item.nameTranslations.ru});
        let resArr = arr.filter((name) => name.toLowerCase().indexOf(search) > -1);
        console.log(resArr);
        this.setState({
          list: resArr
        })
      }
    )
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
                onClick={() => this.onChoose(item)}
                id={item}
                key={i}
                after={
                    item === text && (
                    <Icon24Done />
                  )
                }
              >
                {item}
              </SimpleCell>
            )
          }
        </List>
       }
      </Panel>
    )
  }
}

export default ChooseCountryByContinentp;
