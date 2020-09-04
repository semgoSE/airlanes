import React, { Component } from 'react'
import { Tabs, Panel, ActionSheetItem, PanelHeader, Div, Button, FixedLayout, ActionSheet, Avatar, Input, TabsItem, Group, Title, Cell, RichCell, Separator, Link, SimpleCell, Text} from '@vkontakte/vkui';

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
import Cashback from '../components/Cashback';

export default class Help extends Component {
    state = {
        activeTab: 'about',
        activeTabView: 'about',
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

    openMenu_2 = () => {
        this.props.setPopout(
            <ActionSheet onClose={() => this.props.setPopout(null)}>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose  onClick={() => this.setState({ activeTab: 'trevelpayouts'})}>Партнерская программа Travelpayouts</ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />}  autoclose onClick={() => this.setState({ activeTab: 'booking' })}>Партнерская программа Booking</ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />}  autoclose onClick={() => this.setState({ activeTab: 'ozon'})}>Партнерская программа Ozon</ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />}  autoclose  onClick={() => this.setState({ activeTab: 'cashback', activeTabView: 'about' })}>Как работает кэшбэк </ActionSheetItem>
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
        const {activeTab, activeTabView } = this.state;
        const { id, state, marker } = this.props;
        const list = [
            {group: 'Пакетные туры', button: 'Найти тур', activeMenu: 'packet',data: [
                {name: 'travelata.com', img: 'https://sun1-85.userapi.com/TvWyEumvgTCCGpiNNRR5xZzzWtGByRx_w7wcvQ/djGI3iaTa1Y.jpg', viget: 'travelata',f: '3.8% ',href: `https://tp.media/r?marker=${marker}&p=771&u=https%3A%2F%2Ftravelata.ru%2F`},
        
                {name : 'onlinetours.ru', img: 'https://sun1-83.userapi.com/HsFVc4tf4Bff0tdQZBiELKkSH8IEItHUFq9txQ/XY-m22Rogy4.jpg', viget: 'onlinetours',f: '3,8%',href: `https://tp.media/r?marker=${marker}&p=1094&u=https%3A%2F%2Fwww.onlinetours.ru%2F`},
        
                {name : 'level.travel', img: 'https://sun1-94.userapi.com/0eqWlgr7-uVWZpn2vDIM71XTamVW9N3ZxMbMXA/VrClLGmHYEI.jpg', viget: 'level',f: '4,25%', href:`https://tp.media/r?marker=${marker}&p=660&u=https%3A%2F%2Flevel.travel%2F`}
            ]},
            {group:'Отели, хостелы, квартиры, дома и др.', button: 'Забронировать жилье' ,activeMenu: 'hotel',data: [
                {name: 'booking.com', img: 'https://sun1-91.userapi.com/e23hLqQ2CkLpYD57ZwJvSdHPZzSVdokvbA3Cmw/fX7c2seDMwM.jpg', viget: 'booking.com',f:'4%', href:`https://tp.media/r?marker=${marker}&p=3650&u=https%3A%2F%2Fbooking.com`},
                {name : 'sutochno.ru',img: 'https://sun1-83.userapi.com/H1wOSc2bmOv9gIgrjppaYTpHYu0RDHhsVe5A7Q/jcTIDa9j2dA.jpg', viget: 'sutochno',f: '5%', href: `https://tp.media/r?marker=${marker}&p=2690&u=https%3A%2F%2Fsutochno.ru%2F`},
                {name:'Hotels.com',img: 'https://sun1-29.userapi.com/D0TYWRvhESG_stncOgUAwK3yyZ2re3NUYhJtCQ/CDBBTZNdbWM.jpg', viget: 'Hotels',f: '4,8%', href:`https://tp.media/r?marker=${marker}&p=3247&u=https%3A%2F%2Fru.hotels.com`},
                {name:'hotellook.ru',img: 'https://sun1-25.userapi.com/agLTRPBYypquFIIU0BqonFOiDLI2ycYjUxWC3w/LXBKEobBTzg.jpg', viget: 'hotellook',f:'50% от вознаграждения агрегатора', href:`https://tp.media/r?marker=${marker}&p=4115&u=https%3A%2F%2Fhotellook.com`}
            ]}, 
            {group: 'Страхование', button: 'Купить страховку', activeMenu: 'st', data: [
                {name: 'sravni.ru', img: 'https://sun1-26.userapi.com/U3I0u7e6ycRsmhOjyJ6DmWF8bpheMYvbTyMfew/gqBTPKsRTOQ.jpg', viget: 'sravni',f: '13,6%', href: `https://tp.media/r?marker=${marker}&p=1416&u=https%3A%2F%2Fwww.sravni.ru%2F`},
                {name:'cherehapa.ru',img: 'https://sun1-24.userapi.com/WXECfvXhj-1U9bcr4wdeqfx3jW6qd2kel91Vkg/A1H4qcVQ3ms.jpg', viget: 'cherehapa',f:'15%', href:`https://tp.media/r?marker=${marker}&p=659&u=https%3A%2F%2Fcherehapa.ru%2F`},
                {name: 'strahovkaru.ru',img: 'https://sun1-17.userapi.com/1YGm9F3c9Sh97L3LGGMCFykyYtRU0AJPxB6NYw/XfmTJy_MLL0.jpg', viget: 'strahovkaru',f: '25%', href: `https://tp.media/r?marker=${marker}&p=1582&u=https%3A%2F%2Fstrahovkaru.ru`},
                {name: 'tripinsurance.ru',img: 'https://sun9-71.userapi.com/oadhTBH0iULWrBYahBTmNx2uEoH238Vo8vDLqA/2vQKlX3ocMI.jpg', viget: 'tripinsurance',f:'25%', href: `https://tp.media/r?marker=${marker}&p=1588&u=https%3A%2F%2Fwww.tripinsurance.ru%2F`}
            ]}, 
            {group: 'Прокат автомобилей', button: 'Арендовать авто', activeMenu: 'procat', data: [
                {name: 'discovercars.com',img: 'https://sun9-6.userapi.com/gehNVc_m7627jcyRYkEcNdN3PJhKjfZgVk-AZw/A7kxsMmFRn0.jpg',viget: 'discovercars',f:  '56% от вознаграждения агрегатора', href: `https://tp.media/r?marker=${marker}&p=3555&u=https%3A%2F%2Fwww.discovercars.com%2F`},
                {name: 'economybookings.com',img: 'https://sun9-63.userapi.com/Ifrzxlwdd7KLXjUfbZY24TYcEJfw28I4BgkIrw/O493r7moinE.jpg', viget: 'economybookings',f: '56% от дохода агрегатора', href:`https://tp.media/r?marker=${marker}&p=2018&u=https%3A%2F%2Fwww.economybookings.com%2F`},
                {name: 'autoeurope.ru',img: 'https://sun1-26.userapi.com/TtfkZannI0IZjyD3w0MkIIpip-7omflR9GpkYw/-sytqQkODlU.jpg', viget: 'autoEurope',f: '8%', href:`https://tp.media/r?marker=${marker}&p=1591&u=https%3A%2F%2Fwww.autoeurope.ru`}
            ]}, 
            {group: 'Трансферы', button:'Арендовать авто', activeMenu: 'transfers_2', data: [
                {name: 'intui.travel',img: 'https://sun9-72.userapi.com/sMH4TiQAfmLqhmcMKJnYsc-ZGhArcsw-gUvdNw/kw-InsfZRks.jpg',viget: 'intui', f: '6,5%', href: `https://tp.media/r?marker=${marker}&p=657&u=https%3A%2F%2Fwww.intui.travel%2F`},
                {name: 'iway.ru',img: 'https://sun1-88.userapi.com/1XedpCKWgT6TszWveZHzxx2MPAm5Qbdp9efulg/PNkaeVOleIQ.jpg', viget: 'iway', f: '7%', href: `https://tp.media/r?marker=${marker}&p=4235&u=https%3A%2F%2Fiway.ru`},
                {name: 'kiwitaxi.ru',img: 'https://sun9-55.userapi.com/CwA6hNCDJpSB7iYk6B6eQGd9v4J1MCbH7f8QKQ/1Gy59-pgx50.jpg', viget:'kiwitaxi', f: '50% от вознаграждения агрегатора', href:`https://tp.media/r?marker=${marker}&p=647&u=https%3A%2F%2Fkiwitaxi.ru`}
            ]},
            {group: 'Морские круизы',button:'Купить круиз', activeMenu: null, viget: 'dreamlines', data: [
                {name: 'dreamlines.ru',img: 'https://sun9-44.userapi.com/LSTiVHYhVqrt-DihIX9hgxhas41bQm8RP59Nqw/twywzR61j2U.jpg', f: '3,5%', href: `https://tp.media/r?marker=${marker}&p=1919&u=https%3A%2F%2Fwww.dreamlines.ru%2F`}
            ]}, 
            {group: 'Экскурсии', activeMenu:'excursion_and_m',button:'Купить экскурсию',data: [
            {name: 'tezeks.com' ,img: 'https://sun9-45.userapi.com/5c5L1I6703AhVSjhNdOPwfMz-VlxS2c2l9-JFw/5L62jxcBQaE.jpg',viget: 'tezeks',f: '8%', href:  `https://tp.media/r?marker=${marker}&p=4268&u=https%3A%2F%2Ftezeks.com%2F`},
            {name: 'tripster.ru' ,img: 'https://sun9-14.userapi.com/5wz1RPdbZ3g3BHhaEYmipEn8fEINBK_xmX20KA/JuisSSSHBnw.jpg',viget: 'tripster',f: '8%', href:`https://tp.media/r?marker=${marker}&p=652&u=https%3A%2F%2Fexperience.tripster.ru`},
            {name: 'musement.com',img: 'https://sun1-91.userapi.com/t-zViv64FFD3_Oj9NJgZWXrrNM5Yl_KeS1ry-A/ZQA6Kss2vSk.jpg',viget: 'musement',f: '8%', href: `https://tp.media/r?marker=${marker}&p=2015&u=https%3A%2F%2Fwww.musement.com%2F`},    
            {name: 'ticketnetwork.com',img: 'https://sun1-17.userapi.com/_RacIyBL8-ouYyzoh6cYQBafjB-rpMCEMVmcxA/WpCqA7pk0Xs.jpg',viget: 'ticketnetwork',f: '12,5%', href: `https://tp.media/r?marker=${marker}&p=1948&u=https%3A%2F%2Fwww.ticketnetwork.com%2F`},
            {name: 'tiqets.com',img: 'https://sun1-23.userapi.com/dfDapyYeJ4WedrDyWdSY_t-GuBAbLfuvwgfykA/Ah2Oth0TbME.jpg',viget: 'tiqets',f: '6%', href: `https://tp.media/r?marker=${marker}&p=2074&u=https%3A%2F%2Fwww.tiqets.com%2Fen%2F`},
            {name: 'sputnik8.com',img: 'https://sun9-63.userapi.com/nuVI8ANYLx3WMEUSTM0ic_BAEUnYth9J8mF6nA/tL-vtKYRjq4.jpg',viget: 'sputnik8',f: null, href: `https://tp.media/r?marker=${marker}&p=656&u=https%3A%2F%2Fwww.sputnik8.com%2F`},
            {name: 'weatlas.com',img: 'https://sun1-26.userapi.com/C2rhpzA31a6qd-3BE_kICmABWQ5-dgIArYSP-g/AWDdWnhA0lk.jpg',viget: 'weatlas',f: '10%', href: `https://tp.media/r?marker=${marker}&p=654&u=https%3A%2F%2Fweatlas.com%2F`}
            ]}]
        return (
            <Panel id={id}>
                <PanelHeader separator={false}>Помощь</PanelHeader>
                <Tabs>
                    <TabsItem selected={activeTabView === 'about'} onClick={() => this.setState({ activeTabView: 'about', activeTab: 'about' })}>Как это работает?</TabsItem>
                    <TabsItem selected={activeTabView === 'cashback' } onClick={() => this.setState({ activeTabView: 'cashback', activeTab: 'trevelpayouts'})}>Кэшбэк</TabsItem>
                </Tabs>
                {activeTab === 'trevelpayouts' && 
                    <div>
                        <Div>
                        <Title weight='heavy' level='2'>Партнерская программа Travelpayouts</Title>
                        <Text weight='heavy' level='3'>
                            Засчитываются покупки, сделанные в разделах:<br />
                            <Link>Кэшбэк</Link> <br />
                            <Link onClick={() => this.props.onChangeGroups('activeStory', 'services')}>Сервисы</Link> <br />
                            <Link onClick={() => this.props.onChangeGroups('activeStory', 'aviasales')}>Авиабилеты</Link> (кроме поисковой формы ozon.travel)<br />
                        </Text>
                        <RichCell 
                            before={<Avatar size={64} src='https://sun1-27.userapi.com/VoT7qhx7GijIUjK_T_JZ6slFYT-YOwSeNMi2CA/3uIuAQ7C1U0.jpg' />}
                            actions={<>
                                    <Button href="https://www.travelpayouts.com/?marker=122890" target="_blank">Зарегистрироваться</Button>
                                    <Button onClick={() => this.props.openModal('save_marker_trevel')}>Ввести маркер</Button>
                                    </>
                                    }
                        >
                                    Travelpayouts
                        </RichCell>
                        
                        </Div>

                        <Separator />
                {list.map((item) => (
                <Group header={<Cell multiline disabled><Title weight='heavy' level='2'>{item.group}</Title></Cell>}>
                        {item.data.map((v, i) => (
                            <RichCell
                                caption={v.f}
                                before={<Avatar size={64} src={v.img} />}
                                multiline
                                actions={
                                    <>
                                    <Button href={v.href} target='_blank'>Перейти на сайт</Button>
                                    <Button onClick={() => this.props.goViget({...v,i, activeMenu: item.activeMenu, group:item.group,})}>{item.button}</Button>
                                    </>
                                }
                            >
                                {v.name}
                            </RichCell>
                        ))}
                </Group>
            ))}
                    </div>
                }
                {activeTab == 'ozon' && 
                    <div>
                        <Div>
                        <Title weight='heavy' level='2'>Партнерская программа Ozon</Title>
                        <Button size='xl' style={{ marginTop: 12 }} onClick={() => this.props.openModal('save_marker_ozon')}>ввести маркер</Button>
                        </Div>
                    </div>
                }
                {activeTab == 'booking' && 
                    <div>
                        <Div>
                        <Title weight='heavy' level='2'>Партнерская программа Booking</Title>
                        <Text>
                        Можно получить 25% от вознаграждения системы бронирования, которое составляет от 10 до 20%.<br />
                        Это составит от 2,5% до 5% от стоимости бронирования.<br />

                        Засчитываются покупки, сделанные по переходам в рекламных блоках в разделах:<br />
                        <Link onClick={() => {
                            this.props.onChangeGroups('activeTabSub', 'groups')
                            this.props.onChangeGroups('activeStory', 'subscribes')
                            }}>Подписки - Витрина</Link><br />
                        <Link onClick={() => {
                            this.props.onChangeGroups('activeTabSub', 'database')
                            this.props.onChangeGroups('activeStory', 'subscribes')
                        }}>Подписки - Мой выбор</Link>
                        </Text>
                        <RichCell 
                            before={<Avatar size={64} src='https://sun1-91.userapi.com/e23hLqQ2CkLpYD57ZwJvSdHPZzSVdokvbA3Cmw/fX7c2seDMwM.jpg' />}
                            actions={<>
                                    <Button href="https://www.booking.com/affiliate-program/v2/index.html" target="_blank">Начать регистрацию</Button>
                                    <Button onClick={() => this.props.openModal('save_marker_booking')}>Ввести маркер</Button>
                                    </>
                                    }
                        >
                                    Booking
                        </RichCell>
                        </Div>
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
                {activeTab == 'cashback' && <Cashback sex={this.props.state.user.sex} go={() => this.setState({ activeTabView: 'cashback', activeTab: 'trevelpayouts'})} state={this.props.state} />}

                <FixedLayout vertical='bottom'>
                    <div style={{ display:'flex', justifyContent:'center'}}>
                    <div style={{ paddingBottom:6 }}>
                        <Button className='circle_button' onClick={() => {if(activeTabView == 'about') this.openMenu(); else this.openMenu_2()}}>
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