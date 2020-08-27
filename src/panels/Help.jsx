import React, { Component } from 'react'
import { Tabs, Panel, ActionSheetItem, PanelHeader, Div, Button, FixedLayout, ActionSheet, FormLayout, Input, HorizontalScroll} from '@vkontakte/vkui';

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline';
import Icon28HelpOutline from '@vkontakte/icons/dist/28/help_outline';
import Icon28UserCircleOutline from '@vkontakte/icons/dist/28/user_circle_outline';

import {Howl, Howler} from 'howler';

import How_Work from '../components/How_Work';
import Missia from '../components/Missia';
import Programm from '../components/Programm';
import Vitr from '../components/Vitr';
import My_vybor from '../components/My_vybor';
import Market from '../components/Market';
import Friends_help from '../components/Friends_help';
import Service from '../components/Service';

export default class Help extends Component {
    state = {
        activeTab: 'about'
    }

    componentDidMount() {
        this.props.stop_audio();
    }

    openMenu = () => {
        this.props.setPopout(
        <ActionSheet onClose={() => this.props.setPopout(null)}>
            <ActionSheetItem before={<Icon28ViewOutline />} autoclose  onClick={() => this.setState({ activeTab: 'about'})}>Как это работает?</ActionSheetItem>
            <ActionSheetItem before={<Icon28ViewOutline />}  autoclose  onClick={() => this.setState({ activeTab: 'mis'})}>Миссия</ActionSheetItem>
            <ActionSheetItem before={<Icon28ViewOutline />}  autoclose  onClick={() => this.setState({ activeTab: 'market' })}>Гипермаркет "Дешевые авиабилеты"</ActionSheetItem>
            <ActionSheetItem before={<Icon28ViewOutline />}  autoclose onClick={() => this.setState({ activeTab: 'vitr' })}>Раздел "Витрина"</ActionSheetItem>
            <ActionSheetItem before={<Icon28ViewOutline />}  autoclose onClick={() => this.setState({ activeTab: 'my_vybor' })}>Раздел "Мой выбор"</ActionSheetItem>
            <ActionSheetItem before={<Icon28ViewOutline />}  autoclose onClick={() => this.setState({ activeTab: 'unic' })}>Программа лояльности</ActionSheetItem>
            <ActionSheetItem before={<Icon28ViewOutline />}  autoclose onClick={() => this.setState({ activeTab: 'friends' })}>Навестить друзей?</ActionSheetItem>
            <ActionSheetItem before={<Icon28ViewOutline />}  autoclose onClick={() => this.setState({ activeTab: 'service' })}>Сервисы</ActionSheetItem>
            <ActionSheetItem before={<Icon28ViewOutline />}  autoclose onClick={() => this.setState({ activeTab: 'cashback' })}>Кэшбэк </ActionSheetItem>
        </ActionSheet>    
        )
    }


    openMenuUser() {
        this.props.setPopout(     
            <ActionSheet onClose={() => this.props.setPopout(null)}>
            <ActionSheetItem before={<Icon28UserCircleOutline />} autoclose onClick={() => this.props.openModal('status')}>
                Статус
            </ActionSheetItem>
            <ActionSheetItem before={<Icon28UserCircleOutline />} onClick={() => this.props.onChangeGroups('theme',(this.props.state.theme == 'bright_light' ? 'space_gray' : 'bright_light'))} autoclose>
                Включить {this.props.state.theme == 'bright_light' ? 'темную': 'светлую'} тему
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
                <PanelHeader>Помощь</PanelHeader>
                {activeTab === 'cashback' && 
                    <div>
                        <FormLayout>
                            <Input top='Маркер для авиабилетов'/>
                            <Input top='Маркер для booking'/>
                            <Input top='Маркер для OZON'/>
                        </FormLayout>
                    </div>
                }
                {activeTab == 'about' && <How_Work sex={this.props.state.user.sex}/>}
                {activeTab == 'mis' && <Missia sex={this.props.state.user.sex} />}
                {activeTab == 'unic' && <Programm sex={this.props.state.user.sex} />}
                {activeTab == 'vitr' && <Vitr sex={this.props.state.user.sex} />}
                {activeTab == 'my_vybor' && <My_vybor sex={this.props.state.user.sex} />}
                {activeTab == 'market' && <Market sex={this.props.state.user.sex} />}
                {activeTab == 'friends' && <Friends_help sex={this.props.state.user.sex} />}
                {activeTab == 'service' && <Service sex={this.props.state.user.sex} />}

                <FixedLayout vertical='bottom'>
                    <div style={{ display:'flex', justifyContent:'center'}}>
                    <div style={{ paddingBottom:6 }}>
                        <Button className='circle_button' onClick={() => this.openMenu()}>
                            <Icon28ViewOutline />
                        </Button>
                    </div>
                    <div style={{ paddingBottom:6,paddingRight:32,right:'0%', position:'absolute' }}>
                        <Button className='circle_button' style={{backgroundColor:'#4BBDE7'}} onClick={() => this.openMenuUser()}>
                            <Icon28UserOutline />
                        </Button>
                    </div>
                    </div>
                </FixedLayout>
                <Div />
                <Div />
            </Panel>
        )
    }
}