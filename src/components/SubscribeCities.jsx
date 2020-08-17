import React from 'react'
import { Div, Checkbox, Title, FormLayout, Switch, Cell, ScreenSpinner, ModalPage, withModalRootContext } from '@vkontakte/vkui'

export class SubscribeCities extends React.Component {
  state = {
    from: null,
    to: null,
    all:false,
  }

  componentDidMount() {
    this.setState({ from: this.props.state.obj.from, to: this.props.state.obj.to })
    this.props.updateModalHeight();
  }




  render() {
    const {
      from,
      to,
      all
    } = this.state
    const {
      id,
      close,
      state
    } = this.props
    return (
    
<div />
      

    )
  }
}
export default withModalRootContext(SubscribeCities);

