import React from 'react'
import { Panel, PanelHeader, List, SimpleCell, PanelSpinner, PanelHeaderBack, Button, FixedLayout } from '@vkontakte/vkui'
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
const Groups = ({ id, state, openCatalog, go }) => (
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
              {item.catalog}
            </SimpleCell>
          )
        )
          
       
      }
    </List>

    }
  </Panel>
)

export default Groups
