import React, { Component } from 'react'
import { Tabs, Panel, TabsItem, PanelHeader, Div, Button, FixedLayout, ActionSheet, ActionSheetItem} from '@vkontakte/vkui';

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline';
import Icon28HelpOutline from '@vkontakte/icons/dist/28/help_outline';
import Icon28UserCircleOutline from '@vkontakte/icons/dist/28/user_circle_outline';

export default class Help extends Component {
    state = {
        activeTab: 'about'
    }

    openMenuAbout() {
        this.props.setPopout(      
        <ActionSheet onClose={() => this.props.setPopout(null)}>
        <ActionSheetItem autoclose>
          Позиция 1 
        </ActionSheetItem>
        <ActionSheetItem autoclose>
          Позиция 2 
        </ActionSheetItem>
        <ActionSheetItem autoclose>
          Позиция 3 
        </ActionSheetItem>
      </ActionSheet>
      )
    }

    openMenuCashback() {
        this.props.setPopout(      
            <ActionSheet onClose={() => this.props.setPopout(null)}>
            <ActionSheetItem autoclose>
                Ссылка 1 
            </ActionSheetItem>
            <ActionSheetItem autoclose>
                Ссылка 2 
            </ActionSheetItem>
            <ActionSheetItem autoclose>
                Ссылка 3 
            </ActionSheetItem>
          </ActionSheet>
          )
    }

    openMenuUser() {
        this.props.setPopout(     
            <ActionSheet onClose={() => this.props.setPopout(null)}>
            <ActionSheetItem before={<Icon28UserCircleOutline />} autoclose onClick={() => this.props.openModal('status')}>
                Статус
            </ActionSheetItem>
            <ActionSheetItem before={<Icon28UserCircleOutline />} onClick={() => this.props.onChangeGroups('theme', (this.props.state.theme == 'space_gray' ? 'bright_light' : 'space_gray'))} autoclose>
                Сменить тему
            </ActionSheetItem>
            <ActionSheetItem data-story='subscribes' onClick={() => this.props.onChangeGroups('activeStory', 'subscribes')} before={<Icon28UserCircleOutline />} autoclose>
                Мои подписки
            </ActionSheetItem>
          </ActionSheet>
          )
    }

    render() {
        const {activeTab} = this.state;
        const { id } = this.props;
        return (
            <Panel id={id}>
                <PanelHeader separator={false}>Помощь</PanelHeader>
                <Tabs>
                    <TabsItem selected={activeTab === 'about'} onClick={() => this.setState({ activeTab: 'about'})}>Как это сделано?</TabsItem>
                    <TabsItem selected={activeTab === 'cashback'} onClick={() => this.setState({ activeTab: 'cashback' })}>Cashback</TabsItem>
                </Tabs>

                <FixedLayout vertical='bottom'>
                    <div style={{ display:'flex', justifyContent:'center'}}>
                    <div style={{ paddingBottom:6 }}>
                        <Button className='circle_button' onClick={() => {
                                                            if(activeTab === 'about') this.openMenuAbout()
                                                            else this.openMenuCashback()
                        }}><Icon28ViewOutline />
                        </Button>
                    </div>
                    <div style={{ paddingBottom:6,paddingRight:32,right:'0%', position:'absolute' }}>
                        <Button className='circle_button' style={{backgroundColor:'#4BBDE7'}} onClick={() => this.openMenuUser()}>
                            <Icon28UserOutline />
                        </Button>
                    </div>
                    </div>
                </FixedLayout>
            </Panel>
        )
    }
}