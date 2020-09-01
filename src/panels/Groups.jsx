import React, {Component} from 'react'
import { Panel, PanelHeader, List, SimpleCell, PanelSpinner, PanelHeaderBack, Button, FixedLayout, Title } from '@vkontakte/vkui'
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import Vitrina from '../components/Vitrina.mp3';
export default class Groups extends Component {

  componentDidMount() {
    this.props.stop_audio();
    this.props.on_audio(Vitrina)
  }

  render() {
    const {  id, state, openCatalog, go } = this.props;
  return(
  <Panel id={id}>
    <PanelHeader left={<PanelHeaderBack onClick={() => go('home')} />}>Сообщества</PanelHeader>
    
      {state.catalog === null ? 
        <PanelSpinner size='large'/>
      :
    <List>
      {
        state.catalog && (
          state.catalog.map((item, index) => 
            <SimpleCell
              key={item.catalog}
              id={index}
              expandable
              onClick={openCatalog}
            >
              <Title weight='heavy' level='2'>{item.catalog}</Title>
            </SimpleCell>
          )
        )
          
       
      }
    </List>

    }
  </Panel>
)
  }
}
