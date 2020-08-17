import React, { Component } from 'react'
import { Tabs, Panel, TabsItem, PanelHeader, Div, Button, FixedLayout, ActionSheet, ActionSheetItem, Header} from '@vkontakte/vkui';

import Viget from '../components/Viget';

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import { render } from '@testing-library/react';

export default class Services extends Component {
    state = {
         activeTab: 'viget',
         activeViget: 'best_price',
    }

    openMenu_2 = () => {
        this.props.setPopout(
            <ActionSheet onClose={() => this.props.setPopout(null)}>
                <ActionSheetItem autoclose>
                Отели, хостелы, квартиры, дома и др.
                </ActionSheetItem>
                <ActionSheetItem autoclose>
                Страхование
                </ActionSheetItem>
                <ActionSheetItem autoclose>
                Авто-, вело- и прокат байков
                </ActionSheetItem>
                <ActionSheetItem autoclose>
                Трансферы
                </ActionSheetItem>
                <ActionSheetItem autoclose>
                Автобусы
                </ActionSheetItem>
                <ActionSheetItem autoclose>
                Морские круизы
                </ActionSheetItem>
                <ActionSheetItem autoclose>
                Экскурсии
                </ActionSheetItem>
                <ActionSheetItem autoclose>
                Попутчики
                </ActionSheetItem>
                
            </ActionSheet>
        )
    }

    openMenu_1 = () => {
        this.props.setPopout(
            <ActionSheet onClose={() => this.props.setPopout(null)}>
                <ActionSheetItem autoclose onClick={() => this.setState({ activeViget: 'best_price'})}>Лучшая цена</ActionSheetItem>
                <ActionSheetItem autoclose onClick={() => this.setState({ activeViget: 'pop_tour'})}>Популярные туры</ActionSheetItem>
                <ActionSheetItem autoclose onClick={() => this.setState({ activeViget: 'hot_tour'})}>Горящие туры</ActionSheetItem>
            </ActionSheet>
        )
    }

    render() {
        const { id, state} = this.props;
        const { activeTab, activeViget } = this.state;
        return (
            <Panel id={id}>
                <PanelHeader separator={false}>Сервисы</PanelHeader>
                    <Tabs>
                        <TabsItem selected={activeTab == 'viget'} onClick={() => this.setState({ activeTab: 'viget' })}>Виджеты</TabsItem>
                        <TabsItem selected={activeTab == 'search'} onClick={() => this.setState({ activeTab: 'search' })}>Системы поиска</TabsItem>
                    </Tabs>

                {activeTab == 'viget' && activeViget == 'best_price' && 
                    <div>
                        <Header>Лучшая цена</Header>
                        <Viget url={`https://c26.travelpayouts.com/content?promo_id=1151&shmarker=${state.marker}&popular=true&city_from=Moscow&year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}&title=%D0%9B%D1%83%D1%87%D1%88%D0%B8%D0%B5%20%D1%86%D0%B5%D0%BD%D1%8B%20%D0%BD%D0%B0%20%D1%82%D1%83%D1%80%D1%8B&powered_by=false`}/>
                    </div>
                }

                {activeTab == 'viget' && activeViget == 'pop_tour' && 
                    <div>
                        <Header>Популярные туры</Header>
                        <Viget url={`https://tp.media/content?promo_id=4097&shmarker=${state.marker}&campaign_id=26&origin_iata=MOW&destination_iata=TR&locale=ru&powered_by=false&currency=rub&min_lines=5&scroll_height=`}/>
                    </div>
                }

                {activeTab == 'viget' && activeViget == 'hot_tour' && 
                    <div>
                        <Header>Горящие туры</Header>
                        <Viget url={`https://c26.travelpayouts.com/content?promo_id=1494&shmarker=${state.marker}&city=%D0%90%D0%BD%D1%82%D0%B0%D0%BB%D0%B8%D1%8F&startDate=&endDate=&adults=0&scroll=false&powered_by=false`}/>
                    </div>
                }


        
                <FixedLayout vertical='bottom'>
                    <Div align="center" style={{ paddingBottom:6 }}>
                        <Button className='circle_button' onClick={() => {
                            if(activeTab == 'viget') 
                                this.openMenu_1()
                            else
                                this.openMenu_2()
                        }}>
                            <Icon28ViewOutline />
                        </Button>
                    </Div>
                </FixedLayout>
            </Panel>
        )
    }
}