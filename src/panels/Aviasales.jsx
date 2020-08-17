import React, { Component } from 'react'
import { Tabs, Panel, TabsItem, PanelHeader, Div, Button, FixedLayout, ActionSheetItem, ActionSheet, Header} from '@vkontakte/vkui';
import Viget from '../components/Viget';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import Icon28ChecksOutline from '@vkontakte/icons/dist/28/checks_outline';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28StudOutline from '@vkontakte/icons/dist/28/stud_outline';
import Icon24CheckBoxOff from '@vkontakte/icons/dist/24/check_box_off';
import Icon28SearchOutline from '@vkontakte/icons/dist/28/search_outline';
import Icon24CheckBoxOn from '@vkontakte/icons/dist/24/check_box_on';

export default class Aviasales extends Component {
    state = {
        activeTab:'avia',
        activeViget:'calendar',
        activeMeta:'aviasales'
    }

    componentDidMount() {
        if(this.props.state.is_meta) {
            this.setState({ activeTab:'avia'});
            this.props.onChangeGroups('is_meta', false)
        }
    }

    openMenuMeta = () => {
        this.props.setPopout(
        <ActionSheet onClose={() => this.props.setPopout(null)}>
            <ActionSheetItem autoclose before={<Icon28SearchOutline />} onClick={() => this.setState({ activeMeta: 'aviasales' })}>aviasales.ru </ActionSheetItem>
            <ActionSheetItem autoclose before={<Icon28SearchOutline />} onClick={() => this.setState({ activeMeta:'trip'})}>trip.com</ActionSheetItem>
            <ActionSheetItem autoclose before={<Icon28SearchOutline />} onClick={() => this.setState({ activeMeta:'ozon'})}>ozon.travel</ActionSheetItem>
            <ActionSheetItem autoclose before={<Icon28SearchOutline />} onClick={() => this.setState({ activeMeta:'skyscanner'})}>skyscanner.com</ActionSheetItem>
            <ActionSheetItem autoclose before={<Icon28SearchOutline />} onClick={() => this.setState({ activeMeta:'aviakassa'})}>aviakassa.com</ActionSheetItem>
        </ActionSheet>
        )
    }

    openMenuViget = () => {
        this.props.setPopout(
            <ActionSheet onClose={() => this.props.setPopout(null)}>
                <ActionSheetItem autoclose before={<Icon28StudOutline />} onClick={() => this.setState({ activeViget: 'calendar' })}>Календарь низких цен</ActionSheetItem>
                <ActionSheetItem autoclose before={<Icon28StudOutline />} onClick={() => this.setState({ activeViget:'pop_avisales'})}>Спецпредложения авиакомпаний</ActionSheetItem>
                <ActionSheetItem autoclose before={<Icon28StudOutline />} onClick={() => this.setState({ activeViget:'pop'})}>Популярные направления</ActionSheetItem>
                <ActionSheetItem autoclose before={<Icon28StudOutline />} onClick={() => this.setState({ activeViget:'100'})}>100 дешевых авиабилетов</ActionSheetItem>
            </ActionSheet>
            )        
    }

    render() {
        const { id, state } = this.props;
        const { activeTab, activeViget, activeMeta } = this.state;
        return (
            <Panel id={id}>
                <PanelHeader separator={false}>Авиабилеты</PanelHeader>
                <Tabs>
                    <TabsItem selected={activeTab === 'viget'} onClick={() => this.setState({ activeTab: 'viget'})}>Виджеты</TabsItem>
                    <TabsItem selected={activeTab === 'avia'} onClick={() => this.setState({ activeTab: 'avia'})}>Поиск</TabsItem>
                </Tabs>

                {activeTab == 'avia' && activeMeta == 'aviasales' &&
                <div>
                <Header>aviasales.ru</Header>
                <iframe width="100%" height={window.screen.height} frameBorder="0" src="https://www.travelpayouts.com/widgets/a92ec352ec5c4a659f1ad07c4bf65d99.html?v=2055"></iframe>
                </div>
                }
                {activeTab == 'avia' && activeMeta == 'ozon' && 
                <div>
                <Header>ozon.travel</Header>
                <iframe width="100%" scrolling="no" height="500" frameBorder="0" src={`https://partners.ozon.travel/searchform_v2_0/?forpartner=${state.marker_ozon}&forPartnerRef=vkappui&formOrientation=vertical&tab=avia&tab=railway&tab=insurance&type=avia&bkgrnd_preset=//www.ozon.travel/f/images/index_form_bg.png&bkgrnd=ffffff&color_form=FFFFFF&color_formborder=ffffff&color_blocks=ffffff&color_fields=ffffff&color_button=ff56ff&color_border=ffffff&tab_text_color=757575&active_tab_text_color=494949&inputs_text_color=000000&labels_text_color=757575&button_text_color=ffffff&defaultAvia=`}></iframe>
                </div>
                }
                {activeTab == 'avia' && activeMeta == 'aviakassa' && 
                <div>
                <Header>aviakassa.com</Header>
                <Viget url={'https://widgets.aviakassa.com/partner.js'}/>
                </div>
                }
                {activeTab == 'viget' && activeViget == 'calendar' &&   
                <div>
                <Header>Календарь низких цен</Header>
                <Viget url={`https://www.travelpayouts.com/calendar_widget/iframe.js?destination=BKK&marker=${state.marker}&searchUrl=hydra.aviasales.ru&locale=ru&currency=usd&powered_by=true&one_way=false&only_direct=false&period=year&range=7%2C14`}/>
                </div>
                }

                {activeTab == 'viget' && activeViget == 'pop_avisales' && 
                <div>
                <Header>Спецпредложения авиакомпаний</Header>
                 <Viget url={`https://www.travelpayouts.com/ducklett/scripts.js?v=1&marker=122890&widget_type=brickwork&host=hydra.aviasales.ru&locale=ru&currency=rub&limit=9&powered_by=true`} />
                </div>
                }

                {activeTab == 'viget' && activeViget == 'pop' && 
                <div>
                <Header>Популярные направления</Header>
                <Viget url={`https://www.travelpayouts.com/weedle/widget.js?v=1&marker=${state.marker}&host=hydra.aviasales.ru&locale=ru&currency=usd&powered_by=true`} />
                </div>
                }

                {activeTab == 'viget' && activeViget == '100' && 
                <div>
                    <Header>100 дешевых авиабилетов</Header>
                <iframe width='100%' height={570} src='https://top100.aviasales.ru/MOW?_ga=2.230093269.899426115.1587444996-1554969250.1586643377&utm_campaign=as_marketing_top100&utm_medium=aviasales&utm_source=latest_prices'></iframe>
                </div>
                }

                <FixedLayout vertical='bottom'>
                    <Div align="center" style={{ paddingBottom:6 }}>
                        <Button className='circle_button' onClick={() => {
                            if(activeTab === 'avia') 
                                this.openMenuMeta()
                            else 
                                this.openMenuViget()
                        }}><Icon28ViewOutline />
                        </Button>
                    </Div>
                </FixedLayout>
            </Panel>
        )
    }
}