import React from 'react'
import { Alert, Checkbox, Title, FormLayout } from '@vkontakte/vkui'

export class SubscribeCities extends React.Component {
  state = {
    from: null,
    to: null,
  }

  componentDidMount() {
    this.setState({ from: this.props.from, to: this.props.to })
  }

  choose = e => {
    this.setState({
      [e.currentTarget.name]: this.state[e.currentTarget.name].map((item, i) => {
        if(i === parseInt(e.currentTarget.id, 10)){
          item.checked = e.currentTarget.checked
          return item
        }else{
          return item
        }
      })
    })
  }

  submit = async () => {
    if(this.state.from.filter((item) => item.checked).length > 0 && 
      this.state.to.filter((item) => item.checked).length > 0
    ){
      let arr = []
      arr = arr.concat(this.state.from.filter((item) => item.checked)
      .map((item) => item.tag+"/"+this.props.groupId+"/"+this.props.name+"/"+this.props.catalog+"/"+(this.props.section ? this.props.section : "Любой")))
      arr = arr.concat(this.state.to.filter((item) => item.checked)
      .map((item) => item.tag+"/"+this.props.groupId+"/"+this.props.name+"/"+this.props.catalog+"/"+(this.props.section ? this.props.section : "Любой")))
      fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/get-tags", {
        "headers": {
          "accept": "*/*",
          "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json;charset=utf-8",
        },
        "body": JSON.stringify({
          user_id: String(this.props.userId)
        }),
        "method": "POST",
      })
      .then(response => response.json())
      .then(data => {
        if(data.tags.length > 0){
          arr = arr.concat(
            data.tags.map((item) => 
              item.body+"/"+item.group_id+"/"+item.group_name+"/"+item.category+"/"+item.section
            )
          )
        }
        fetch("https://cors-anywhere.herokuapp.com/https://appvk.flights.ru/save-tags", {
          "headers": {
            "accept": "*/*",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json;charset=utf-8",
          },
          "referrer": "https://appvk.flights.ru/",
          "referrerPolicy": "no-referrer-when-downgrade",
          "body": JSON.stringify({
            user_id: String(this.props.userId),
            checkbox: arr
          }),
          "method": "POST",
        })
        .then(response => response.json())
        .then(check => {
          if(check.response === 'ok'){
            this.props.close()
          }
        })
      })
    }
  }

  render() {
    const {
      from,
      to
    } = this.state
    const {
      close
    } = this.props
    return (
      <Alert
        actionsLayout="vertical"
        actions={[{
            title: 'Применить',
            action: () => this.submit(),
          },
          {
          title: 'Отмена',
          autoclose: true,
          mode: 'cancel'
        }]}
        onClose={close}
      >
        <div style={{ position: "relative", textAlign: "left", overflowX: "hidden", height: '300px', overflowY: "auto" }}>
          <Title level="3" weight="bold">Показывать авиабилеты из:</Title>
          <FormLayout>
            {
              from && (
                from.map((item, index) => 
                  <Checkbox
                    key={index}
                    id={index}
                    name="from"
                    onChange={this.choose}
                    checked={item.checked}
                  >
                    {item.tag.split("#")[1].split("@")[0]}
                  </Checkbox>
                )
              )
            }
            <Title level="3" weight="bold">Показывать авиабилеты в:</Title>
            {
              to && (
                to.map((item, index) => 
                  <Checkbox
                    key={index}
                    id={index}
                    name="to"
                    onChange={this.choose}
                    checked={item.checked}
                  >
                    {item.tag.split("#")[1].split("@")[0]}
                  </Checkbox>
                )
              )
            }
          </FormLayout>
        </div>
      </Alert>
    )
  }
}

export default SubscribeCities
