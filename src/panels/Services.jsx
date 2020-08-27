import React, { Component } from 'react'
import { Tabs, Panel, TabsItem, PanelHeader, Div, Button, FixedLayout, ActionSheet, ActionSheetItem, Header, Cell, List, PanelHeaderContent, PanelHeaderContext, Tooltip, Link, Title, SimpleCell} from '@vkontakte/vkui';

import Viget from '../components/Viget';

import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon36Article from '@vkontakte/icons/dist/36/article';
import Icon28LinkOutline from '@vkontakte/icons/dist/28/link_outline';
import Icon28GlobeOutline from '@vkontakte/icons/dist/28/globe_outline';
import {Howl, Howler} from 'howler';

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import { render } from '@testing-library/react';

export default class Services extends Component {
    state = {
         activeTab: 'search',
         viget_text: 'Пакетные туры', 
         search_text: 'Пакетные туры',
         viget_activeMenu:'tours',
         search_activeMenu:'packet',
         activeMenu: null, 
         contextOpened:false,
         activeOf:0,
         viget_viget: 'best_price',
         search_viget: 'travelata', 
         tooltip:true,
         itai: 'MOW'
    }

    componentDidMount() {
        this.props.stop_audio();
        fetch("https://cors-anywhere.herokuapp.com/https://api.travelpayouts.com/data/ru/cities.json")
        .then(response => response.json())
        .then(cities => {
          let myCode = cities.filter((item) => item.name === this.props.state.user.city.title)[0].code;
          this.setState({ itai : myCode });
        })
    }

    openMenu_2 = () => {
        const name = this.state.activeTab + '_activeMenu';
        const viget = this.state.activeTab + '_viget';
        const text = this.state.activeTab + '_text';
        this.props.setPopout(
            <ActionSheet onClose={() => this.props.setPopout(null)}>
                <ActionSheetItem before={<Icon28ViewOutline />}  autoclose onClick={() => this.setState({ [name]:'packet',[text]: 'Пакетные туры', tooltip:true,  activeOf:0, [viget]:'travelata'})}>
                Пакетные туры
                </ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose onClick={() => this.setState({ [name]:'hotel_2',[text]: 'Отели, хостелы, квартиры, дома и др.',tooltip:true,  activeOf:0, [viget]:'booking.com'})}>
                Отели, хостелы, квартиры, дома и др.
                </ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose onClick={() => this.setState({ [name]:'st',[text]: 'Страхование',tooltip:true,  activeOf:0, [viget]:'sravni'})}>
                Страхование
                </ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose onClick={() => this.setState({ [name]:'procat',[text]: 'Прокат автомобилей',tooltip:true,  activeOf:0, [viget]:'discovercars'})}>
                Прокат автомобилей
                </ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose onClick={() => this.setState({ [name]:'transfers_2',[text]: 'Трансферы',tooltip:true,  activeOf:0, [viget]:'intui'})}>
                Трансферы
                </ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose onClick={() => this.setState({ [name]: null ,[text]: 'Морские круизы',  [viget]: 'dreamlines', activeOf:0})}>
                Морские круизы
                </ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose onClick={() => this.setState({ [name]: 'excursion_and_m' ,[text]: 'Экскурсии и мероприятия', tooltip:true,   [viget]: 'tezeks', activeOf:0})}>
                Экскурсии и мероприятия
                </ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose onClick={() => this.setState({ [name]: null ,[text]: 'Попутчики',  [viget]: 'poputchiki',  activeOf:0})}>
                Попутчики
                </ActionSheetItem>
                
            </ActionSheet>
        )
    }

    openMenu_1 = () => {
        const text = this.state.activeTab + '_text';
        const name = this.state.activeTab + '_activeMenu';
        const viget = this.state.activeTab + '_viget'
        this.props.setPopout(
            <ActionSheet onClose={() => this.props.setPopout(null)}>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose onClick={() => this.setState({ [name]: 'tours',[text]: 'Пакетные туры',tooltip:true, [viget]: 'best_price', activeOf:0})}>Пакетные туры</ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose onClick={() => this.setState({ [name]: 'hotel',[text]: 'Отели, хостелы, квартиры, дома и др.',tooltip:true, [viget]: 'booking', activeOf:0})}>Отели, хостелы, квартиры, дома и др.</ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose onClick={() => this.setState({ [name]: 'excursion',[text]: 'Экскурсии',tooltip:true,  [viget]: 'e1', activeOf:0})}>Экскурсии</ActionSheetItem>
                <ActionSheetItem before={<Icon28ViewOutline />} autoclose onClick={() => this.setState({ [name]: 'museum_ticket',[text]: 'Билеты в музеи',tooltip:true,  [viget]: 'm1',activeOf:0})}>Билеты в музеи</ActionSheetItem>
            </ActionSheet>
        )
    }

    toggleContext = () => {
        this.setState({ contextOpened: !this.state.contextOpened });
    }

    openMenu = (to) => {
        const name = this.state.activeTab + '_viget'
        requestAnimationFrame(this.toggleContext);
        this.setState({ [name]:to })
    }

    render() {
        const { id, state} = this.props;
        const { activeTab, activeViget, activeMenu, activeOf } = this.state;
        const name = activeTab + "_activeMenu";
        const text = this.state.activeTab + '_text';
        const viget = this.state.activeTab + '_viget'
        const textVigets = {
            onlinetours:{
                header: 'onlinetours.ru',
                caption: 'Популярный онлайн-сервис по продаже туров от ведущих туроператоров, более чем в 80 стран мира. Миллионы турпакетов, в которые входят авиабилеты, проживание в отеле, медицинская страховка и трансфер.',
                href: `https://tp.media/r?marker=${state.marker}&p=1094&u=https%3A%2F%2Fwww.onlinetours.ru%2F`
            },
            travelata:{
                header: 'travelata.ru', 
                caption: 'Поиск туров по 68 направлениям. Посещаемость сайта составляет более 2 млн визитов в месяц.', 
                href: `https://tp.media/r?marker=${state.marker}&p=771&u=https%3A%2F%2Ftravelata.ru%2F`
            },
            level: {
                header: 'level.travel',
                caption: 'Автоматизированная система поиска туров от всех надежных туроператоров и их покупки в режиме онлайн, без участия турагента. Система позволяет купить тур по аналогии с покупкой авиабилетов или бронированием отелей онлайн. Уникально низкие цены на туры в тысячи отелей Египта, Таиланда, Турции, ОАЭ, Кипра, Доминиканы, Сейшел, Хайнаня и других мировых курортов.',
                href: `https://tp.media/r?marker=${state.marker}&p=660&u=https%3A%2F%2Flevel.travel%2F`
            },
            ['booking.com']: {
                header: 'booking.com',
                caption: 'Cамый популярный в мире интернет ресурс по бронированию отелей, гарантирует лучшие цены на любой тип недвижимости, начиная от кемпингов и заканчивая роскошными 5-звездочными отелями.',
                href: `https://tp.media/r?marker=${state.marker}&p=3650&u=https%3A%2F%2Fbooking.com`
            },
            ['суточно']: {
                header: 'суточно.ру',
                caption: 'Жилье для командировок, деловых поездок, путешествий, отдыха на море или горнолыжных курортах и множества других жизненных ситуаций.', 
                href: `https://tp.media/r?marker=${state.marker}&p=2690&u=https%3A%2F%2Fsutochno.ru%2F`
            },
            hotels: {
                header:'hotels.ru',
                caption: 'Ведущая платформа для онлайн бронирования отелей по всему миру. На сайте представлено более 800 000 отелей, хостелов и других видов жилья в 16 000 населённых пунктах. Пользователям доступна программа лояльности: Welcome Rewards™.',
                href: `https://tp.media/r?marker=${state.marker}i&p=3247&u=https%3A%2F%2Fru.hotels.com`
            },
            hotellook: {
                header: 'hotellook',
                caption: "Поиск и сравнение цен на отели и гостиницы со скидкой до 60%. Для бронирования доступно 242000 отелей, 39000 хостелов, 373000 гостевых домов и 1056000 апартаментов. Поиск по 70-ти системам бронирования отелей. Возможность сравнения цен на других сайтах. Результат поиска - окончательная цена на отель без дополнительных налогов и комиссий",
                href: `https://tp.media/r?marker=${state.marker}&p=4115&u=https%3A%2F%2Fhotellook.com`
            },
            sravni: {
                header: 'sravni.ru',
                caption: 'Cравнение страховых продуктов, туристическое страхование.',
                href: `https://tp.media/r?marker=${state.marker}&p=1416&u=https%3A%2F%2Fwww.sravni.ru%2F`
            },
            сherehapa: {
                header: 'сherehapa.ru',
                caption: 'Онлайн-сервис по сравнению и продаже туристических страховок', 
                href: `https://tp.media/r?marker=${state.marker}&p=659&u=https%3A%2F%2Fcherehapa.ru%2F`
            },
            strahovkaru: {
                header: 'strahovkaru.ru',
                caption: 'Поисковик страховок онлайн (ВЗР, ОСАГО, Жизнь, Недвижимость)', 
                href: `https://tp.media/r?marker=${state.marker}&p=1582&u=https%3A%2F%2Fstrahovkaru.ru`
            },
            tripinsurance: {
                header: 'tripinsurance.ru',
                caption: 'Премиальное туристическое страхование по доступной цене. Мы применяем лучшие мировые практики туристического страхования на российском рынке. Полис можно приобрести уже находясь в путешествии.', 
                href: `https://tp.media/r?marker=${state.marker}&p=1588&u=https%3A%2F%2Fwww.tripinsurance.ru%2F`
            },
            dreamlines: {
                header: 'dreamlines.ru',
                caption: 'Dreamlines предлагает круизы более чем от 30 круизных компаний по всему миру. Наши круизные эксперты имеют 10+ лет опыта в продажах круизов.', 
                href: `https://tp.media/r?marker=${state.marker}&p=1919&u=https%3A%2F%2Fwww.dreamlines.ru%2F`
            },
            discovercars: {
                header: 'discovercars.com',
                caption: 'Cайт для сравнения цен на прокат автомобилей по всему миру. Сервис предлагает эксклюзивные цены от пунктов проката по всему миру. В базе доступно более 2 000 000 предложений по аренде автомобилей в 150+ странах.'
            },
            economybookings: {
                header: 'economybookings.ru', 
                caption:'Международный сервис бронирования дешевого автопроката в мире, России, Европе. 25000 пунктов проката, 150 стран мира.Русскоязычная служба резервирования и поддержки во время Вашей аренды. Круглосуточное обслуживание. Более 800 автопрокатных компаний, включая все ведущие бренды.', 
                href: `https://tp.media/r?marker=${state.marker}&p=2018&u=https%3A%2F%2Fwww.economybookings.com%2F`
            },
            autoEurope: {
                header: 'autoEurope.ru',
                caption: 'Онлайн-сервис для бронирования автомобилей в 180+ странах мира. На карточках автомобилей расположена основная информация и условия аренды. Можно сравнить тарифы от разных арендодателей: Herz, Sixt, и других.', 
                href: `https://tp.media/r?marker=${state.marker}&p=1591&u=https%3A%2F%2Fwww.autoeurope.ru`
            },
            myrentacar: {
                header: 'myrentacar.com',
                caption: 'Брокер аренды автомобилей в локальных прокатных компаниях. Регионы присутствия:Крым, Черногория, Чехия, Грузия, Кипр, Болгария, ОАЭ, Греция, Сочи, Армения, Турция, Таиланд'
            },
            intui: {
                header: 'intui.travel',
                caption: 'Платформа по бронированию трансферов в 156 странах мира от лучших местных транспортных компаний.', 
                href: `https://tp.media/r?marker=${state.marker}&p=657&u=https%3A%2F%2Fwww.intui.travel%2F`
            },
            iway: {
                header: 'iway.ru',
                caption: 'Первая система онлайн-бронирования трансферов в России. С 2009 года перевезли более 9 миллионов пассажиров.Поиск адресов на движке Гугл-карт — вводите название отеля или улицу, на любом языке, с опечатками и без.Покрытие не ограничено городами и курортами — iway строит любые маршруты на периферии обслуживаемых аэропортов и городов: везде, где есть дороги. В сети 670 аэропортов в 120 странах. Мобильное приложение для клиентов i’way assist — показывает, где находится водитель и позволяет написать ему в чате — выручает, если Вы заблудились в аэропорту. Бесплатное ожидание пассажира с момента прилёта в течение часа для внутренних рейсов, и двух часов — для международных. Встреча с табличкой в аэропорту или на вокзале, помощь с багажом по пути к автомобилю. Машины без логотипов и рекламы — для требовательных клиентов.Автомобили от стандарта до представительского, включая минивэны Тесла. Окончательная цена считается сразу и не меняется в поездке. Круглосуточная поддержка на русском и английском, прямые номера в 15 самых популярных странах.',
                href: `https://tp.media/r?marker=${state.marker}&p=4235&u=https%3A%2F%2Fiway.ru`
            },
            kiwitaxi: {
                header: 'kiwitaxi.ru',
                caption: 'Cистема онлайн-бронирования индивидуальных трансферов. 500 аэропортов и 117500 маршрутов в 100 странах — трансферы в аэропортах всех топовых курортов и новые подключения почти каждый месяц. 12 классов авто: от микро на 3-х пассажиров до микроавтобуса и премиум — трансферы под любые запросы туристов.600 лицензированных перевозчиков на 5 континентах, фиксированная стоимость трансфера, дополнительные услуги, круглосуточная поддержка клиентов на русском и английском языке.',
                href: `https://tp.media/r?marker=122890.vkappui&p=647&u=https%3A%2F%2Fkiwitaxi.ru`
            },
            tezeks: {
                header: 'tezeks.com',
                caption: 'Официальный сервис туроператора TEZ TOUR по бронированию русскоязычных экскурсий, экскурсионных туров и аэропортовых трансферов, а также входных билетов в музеи и другие туристические объекты развлечений и достопримечательности более, чем в 35 странах мира и один из ведущих ресурсов данной тематики в рунете.', 
                href: `https://tp.media/r?marker=${state.marker}&p=4268&u=https%3A%2F%2Ftezeks.com%2F`
            },
            tripster: {
                header: 'tripster.ru',
                caption: 'Лидирующий сервис онлайн-бронирования экскурсий в России. Необычные экскурсии от местных жителей в 560+ городах мира.', 
                href: `https://tp.media/r?marker=${state.marker}&p=652&u=https%3A%2F%2Fexperience.tripster.ru`
            },
            musement: {
                header: 'musement.com',
                caption: 'Musement предлагает билеты на самые захватывающие туры и мероприятия в любой точке мира. От Рима до Бангкока Musement предлагает множество различных продуктов, таких как:Билеты на аттракционы без очередейГородские туры, Сити-пассы, Тематические парки, Гастрономические туры, Выставки, Спортивные и культурные мероприятия', 
                href: `https://tp.media/r?marker=${state.marker}&p=2015&u=https%3A%2F%2Fwww.musement.com%2F`
            },
            ticketnetwork: {
                header:'ticketnetwork.com',
                caption:'Площадка, где продавцы выставляют на продажу билеты на спортивные, театральные и концертные мероприятия по всему миру. Концерты: Эд Ширан, Леди Гага, Кэти Перри Театральные шоу: Wicked, Jersey Boys, Lion King, Cirque du Soleil. Спортивные события: MLB, НБА, НФЛ, НХЛ, NCAA, бокс и многое другое.',
                href: `https://tp.media/r?marker=${state.marker}&p=1948&u=https%3A%2F%2Fwww.ticketnetwork.com%2F`
            },
            tiqets: {
                header:'tiqets.com',
                caption: 'Крупнейшая онлайн-платформа для продажи билетов в мире. Мы предлагаем электронные билеты в музеи, шоу и аттракционы по всему миру. В том числе такие города, как Дубай, Рим, Нью-Йорк и многие другие. Инновационная технология Tiqets гарантирует, что путешественники могут забронировать билеты со своего телефона в последнюю минуту, затем получить их в электронной форме и показать с мобильного телефона в музеях, достопримечательностях и достопримечательностях.', 
                href: `https://tp.media/r?marker=${state.marker}&p=2074&u=https%3A%2F%2Fwww.tiqets.com%2Fen%2F`
            },
            sputnik8:{
                header:'sputnik8.com',
                caption: 'Поиск и бронирование экскурсий и мастер-классов по всему миру. У нас размещено более 5000 экскурсий в более, чем 100 городах: Москве, Санкт-Петербурге, Киеве, Праге, Париже, Барселоне, Риме, Лондоне, Паттайе, Пхукете и многих других.', 
                href: `https://tp.media/r?marker=${state.marker}&p=656&u=https%3A%2F%2Fwww.sputnik8.com%2F`
            },
            weatlas: {
                header:'weatlas.com',
                caption: 'Сервис бронирования экскурсий и развлечений в любом городе мира. Сервис предлагает экскурсии, развлечения, трансферы, билеты в различные достопримечательности и музеи. И все это — на одной площадке! У нас — только лучшие гиды, с отличными рекомендациями, и все проверены нами. Мы настолько уверены в качестве работы, что гарантируем вам самые лучшие впечатления.'
            },
            poputchiki: {
                header: 'vk.com/poputchiki',
                caption:'Попутчиков в отпуск или путешествие находят здесь. В любом месте веселее вместе!', 
                href: `https://vk.com/poputchiki`
            }
        
        }
        const MENU = {
            null:[],
            hotel:[
                {name: 'карта цен hotellook', func: () => this.openMenu('hotellok')},
                {name: 'карта цен booking.com', func: () => this.openMenu('booking')},  
                {name: 'описание отелей', func: () => this.openMenu('description')},
                {name: 'подборка отелей', func: () => this.openMenu('collection')},
            ],
            tours:[
                {name:'лучшая цена', func: () => this.openMenu('best_price')}, 
                {name: 'популярные туры', func:() => this.openMenu('pop_tour')}, 
                {name: 'горящие туры', func:() => this.openMenu('hot_tour')},
                {name: 'статистика цен', func:() => this.openMenu('static')}
            ],
            transfers:[
                {name: '1', func:() => this.openMenu('1')},
                {name: '2', func:() => this.openMenu('2')},
                {name: '3', func:() => this.openMenu('3')},
                {name: '4', func:() => this.openMenu('4')}
            ],
            excursion:[
                {name: 'e1', func:() => this.openMenu('e1')},
                {name: 'e2', func:() => this.openMenu('e2')},
                {name: 'e3', func:() => this.openMenu('e3')},
                {name: 'e4', func:() => this.openMenu('e4')},
            ],
            museum_ticket:[
                {name:'m1', func:() => this.openMenu('m1')},
                {name:'m2', func:() => this.openMenu('m2')}
            ],
            packet:[
                {name:'travelata.ru', func:() => this.openMenu('travelata')}, 
                {name: 'onlinetours.ru', func:() => this.openMenu('onlinetours')}, 
                {name: 'level.travel', func:() => this.openMenu('level')}
            ],
            hotel_2:[
                {name: 'booking.com', func:() => this.openMenu('booking.com')},
                {name:'суточно.ру', func:() => this.openMenu('суточно')},
                {name:'hotels.com', func:() => this.openMenu('hotels')},
                {name:'hotellook', func:() => this.openMenu('hotellook')},
            ],
            st:[
                {name:'sravni.ru', func:() => this.openMenu('sravni')}, 
                {name:'сherehapa.ru', func:() => this.openMenu('сherehapa')},
                {name:'strahovkaru.ru', func:() => this.openMenu('strahovkaru')},
                {name: 'tripinsurance.ru', func:() => this.openMenu('tripinsurance')}
            ],
            procat:[
                {name: 'discovercars.com/ru', func:() => this.openMenu('discovercars')},
                {name: 'economybookings.com', func:() => this.openMenu('economybookings')},
                {name: 'autoEurope.ru', func:() => this.openMenu('autoEurope')},
                {name: 'myrentacar.com', func:() => this.openMenu('myrentacar')},
            ],
            transfers_2: [
                {name: 'intui.travel', func:() => this.openMenu('intui')},
                {name: 'iway.ru', func:() => this.openMenu('iway')}, 
                {name: 'kiwitaxi.ru', func:() => this.openMenu('kiwitaxi')}, 
            ],
            excursion_and_m: [
                {name: 'tezeks.com', func:() => this.openMenu('tezeks')}, 
                {name: 'tripster.ru', func:() => this.openMenu('tripster')},
                {name: 'musement.com', func:() => this.openMenu('musement')},
                {name: 'ticketnetwork.com', func:() => this.openMenu('ticketnetwork')}, 
                {name: 'tiqets.com', func:() => this.openMenu('tiqets')},
                {name: 'sputnik8.com', func:() => this.openMenu('sputnik8')}, 
                {name: 'weatlas.com', func:() => this.openMenu('weatlas')}
            ]
        }    
        return (
            <Panel id={id}>
                <PanelHeader separator={false}>
                    {MENU[this.state[name]].length != 0 ?
                    <Tooltip isShown={this.state.tooltip} offsetY={-2} cornerOffset={10} header="выберите" onClose={() => this.setState({ tooltip: false })}>
                    <PanelHeaderContent
                        aside={<Icon16Dropdown style={{ transform: `rotate(${this.state.contextOpened ? '180deg' : '0'})` }} />}
                        onClick={this.toggleContext}
                    >
                     {MENU[this.state[name]][activeOf].name}
                    </PanelHeaderContent>
                    </Tooltip> : 'Сервисы'}
                </PanelHeader>

                <PanelHeaderContext opened={this.state.contextOpened} onClose={this.toggleContext}>
                    <List>
                        {MENU[this.state[name]].map((el, i) => <Cell key={i} before={<Icon28ListOutline />} onClick={() => {el.func(); this.setState({ activeOf:i})}} asideContent={activeOf == i && <Icon24Done fill='var(--accent)'/>}>{el.name}</Cell>)}
                    </List>
                </PanelHeaderContext>

                    <Tabs>
                        <TabsItem selected={activeTab == 'viget'} onClick={() => this.setState({ activeTab: 'viget' })}>Виджеты</TabsItem>
                        <TabsItem selected={activeTab == 'search'} onClick={() => this.setState({ activeTab: 'search' })}>Системы поиска</TabsItem>
                    </Tabs>
                    <Div>
                    <Title weight='heavy' level='2'>{this.state[text]}</Title>
                    </Div>
                {this.state[viget] == 'best_price' && 
                    <div>
                        <Viget url={`https://c26.travelpayouts.com/content?promo_id=1151&shmarker=${state.marker}&popular=true&city_from=Moscow&year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}&title=%D0%9B%D1%83%D1%87%D1%88%D0%B8%D0%B5%20%D1%86%D0%B5%D0%BD%D1%8B%20%D0%BD%D0%B0%20%D1%82%D1%83%D1%80%D1%8B&powered_by=false`}/>
                    </div>
                }

                {this.state[viget] == 'pop_tour' && 
                    <div>

                        <Viget url={`https://tp.media/content?promo_id=4097&shmarker=${state.marker}&campaign_id=26&origin_iata=${this.state.itai}&destination_iata=TR&locale=ru&powered_by=false&currency=rub&min_lines=5&scroll_height=`}/>
                    </div>
                }

                {this.state[viget] == 'hot_tour' && 
                    <div>
                        <Viget url={`https://c26.travelpayouts.com/content?promo_id=1494&shmarker=${state.marker}&city=%D0%90%D0%BD%D1%82%D0%B0%D0%BB%D0%B8%D1%8F&startDate=&endDate=&adults=0&scroll=false&powered_by=false`}/>
                    </div>
                }

                {this.state[viget] == '1' && 
                    <div>
                        <Viget url={`https://c22.travelpayouts.com/content?promo_id=3466&shmarker${state.marker}&locale=ru&color_scheme=blue&ag=65&ap=417&re=r4468h219422`}/>
                    </div>
                }

                {this.state[viget] == '2' && 
                    <div>

                        <Viget url={`https://c22.travelpayouts.com/content?promo_id=3507&shmarker=${state.marker}&locale=ru&curr=RUB&color=blue&ag=10&ap=105&rid=5774&hid=`}/>
                    </div>
                }

                {this.state[viget] == '3' && 
                    <div>

                        <Viget url={`https://c22.travelpayouts.com/content?promo_id=3506&shmarker=${state.marker}&locale=ru&color_scheme=blue&powered_by=false`}/>
                    </div>
                }

                {this.state[viget] == '4' && 
                    <div>
    
                        <Viget url={`https://c1.travelpayouts.com/content?promo_id=1486&shmarker=${state.marker}&language=ru&from=&to=&theme=8&powered_by=false`}/>
                    </div>
                }

                {this.state[viget] == 'renta' && 
                    <div>
      
                        <Viget url={`https://c10.travelpayouts.com/content?promo_id=2082&shmarker=${state.marker}&locale=ru&width=100%25&height=100&powered_by=false`}/>
                    </div>
                }
                {this.state[viget] ==  'static' && 
                    <div>
                        <Viget url={`https://c26.travelpayouts.com/content?promo_id=1495&shmarker=${state.marker}&from_country=RU&to_country=TH&nights=14&adults=2&stars_from=1&stars_to=5&title_size=15&days_count=31&flex_dates=true&flex_nights=true&countries_list=true&departures=true&shown_nights=true&graph_label=true&week_labels=true&month_labels=true&months_switcher=true&tooltip=true&best_price=true&lines=true&medium_line=true&full_month=true&background=false&minimal=true&focus_target=false&from_city=Moscow&start_date=&powered_by=false`}/>
                    </div>
                }
                {this.state[viget] ==  'booking' && 
                    <div>

                        <Viget url={`https://c118.travelpayouts.com/content?promo_id=4071&shmarker=${state.marker}&mark=Moscow&locale=ru&currency=RUB&mwhsb=1&width=100&zoom=10`}/>
                    </div>
                }
                {this.state[viget] ==  'hotellok' && 
                    <div>

                        <Viget url={`https://tp.media/content?0=0&1=10&promo_id=4285&shmarker=${state.marker}&campaign_id=101&search_host=search.hotellook.com&locale=ru&currency=usd&draggable=true&disable_zoom=false&show_logo=false&scrollwheel=true&color=%2307AF61&contrast_color=%23ffffff&width=1000&height=500&zoom=14&radius=29&stars=0%2C1%2C2%2C3%2C4%2C5&price_from=&price_to=&lat=7.893587&lng=98.29682`}/>
                    </div>
                }
                {this.state[viget] ==  'description' && 
                    <div>

                        <Viget url={`https://www.travelpayouts.com/chansey/iframe.js?v=1&marker=${state.marker}&host=search.hotellook.com&locale=ru&currency=rub&nobooking=true&powered_by=false`}/>
                    </div>
                }
                {this.state[viget] ==  'collection' && 
                    <div>

                        <Viget url={`https://www.travelpayouts.com/blissey/scripts.js?categories=5stars%2Cpopularity&id=30553&type=compact&marker=${state.marker}&powered_by=false&host=search.hotellook.com&locale=ru&currency=usd&limit=10&nobooking=true`}/>
                    </div>
                }


                {this.state[viget] ==  'e1' && 
                    <div>

                        <Viget url={`https://c11.travelpayouts.com/content?promo_id=4217&shmarker=${state.marker}&order=top&num=5&widget_template=vertical&width=100%25&bg_color=&logo=true&widgetbar=false&widgetbar_delay=&widgetbar_position=top&powered_by=false`}/>
                    </div>
                }
                {this.state[viget] ==  'e2' && 
                    <div>

                        <Viget url={`https://c11.travelpayouts.com/content?promo_id=4218&shmarker=${state.marker}&city=&geonames_id=&order=top&num=5&widget_template=vertical&width=100%25&bg_color=&logo=true&widgetbar=false&widgetbar_delay=&widgetbar_position=top&powered_by=false`}/>
                    </div>
                }
                {this.state[viget] ==  'e3' && 
                    <div>

                        <Viget url={`https://c11.travelpayouts.com/content?promo_id=4223&shmarker=${state.marker}&city=&query=&order=top&num=3&widget_template=vertical&width=300&bg_color=&logo=true&widgetbar=false&widgetbar_delay=&widgetbar_position=top&powered_by=false`}/>
                    </div>
                }
                {this.state[viget] ==  'e4' && 
                    <div>
                        <Viget url={`https://c21.travelpayouts.com/content?promo_id=1501&shmarker=${state.marker}&activity=https%3A%2F%2Fwww.sputnik8.com%2Fru%2Fst-petersburg%2Factivities%2F27789-onlayn-ekskursiya-strashnye-istorii-peterburga&locale=ru&width=100&topbar=false&disable_logo=false&transparent=false&no_borders=true&powered_by=false`}/>
                    </div>
                }

                {this.state[viget] ==  'm1' && 
                    <div>
  
                        <Viget url={`https://c89.travelpayouts.com/content?promo_id=3948&shmarker=${state.marker}&language=ru&currency=USD&layout=vertical`}/>
                    </div>
                }
                {this.state[viget] ==  'm2' && 
                    <div>
       
                        <Viget url={`https://c14.travelpayouts.com/content?promo_id=1585&shmarker=${state.marker}&ids=&powered_by=false`}/>
                    </div>
                }

                {this.state[viget] ==  'onlinetours' && 
                    <div>

                        <iframe src={`https://c43.travelpayouts.com/content?promo_id=1194&shmarker=${state.marker}&widget=306x488`} width='100%' height="488" frameborder="0" scrolling="no"> </iframe>
                        <p className="des">                    
Популярный онлайн-сервис по продаже туров от ведущих туроператоров, более чем в 80 стран мира. Миллионы турпакетов, в которые входят авиабилеты, проживание в отеле, медицинская страховка и трансфер.
                        </p>
                    </div>
                }
                {this.state[viget] ==  'level' && 
                    <div>
                        <Viget url={`https://c26.travelpayouts.com/content?promo_id=1150&shmarker=${state.marker}&to_city=&to_hotel=&start_date=&nights=14&adults=2&from_city=Moscow&flex_dates=true&flex_nights=true&stars_from=1&stars_to=5&powered_by=false`}/>
                        <p className="des">
                        Автоматизированная система поиска туров от всех надежных туроператоров и их покупки в режиме онлайн, без участия турагента. Система позволяет купить тур по аналогии с покупкой авиабилетов или бронированием отелей онлайн. Уникально низкие цены на туры в тысячи отелей Египта, Таиланда, Турции, ОАЭ, Кипра, Доминиканы, Сейшел, Хайнаня и других мировых курортов.
                        </p>
                    </div>
                }


                {this.state[viget] ==  'booking.com' && 
                    <div>

                        <Viget url={`https://tp.media/content?promo_id=3610&shmarker=${state.marker}&campaign_id=118&locale=ru&border_radius=20&plain=false&powered_by=false`}/>
                        <p className="des">
                        Cамый популярный в мире интернет ресурс по бронированию отелей, гарантирует лучшие цены на любой тип недвижимости, начиная от кемпингов и заканчивая роскошными 5-звездочными отелями.
                        </p>
                    </div>
                }

                {this.state[viget] ==  'суточно' && 
                    <div>

                        <Viget url={`https://tp.media/content?promo_id=2719&shmarker=${state.marker}&locale=ru&campaign_id=99&powered_by=false&border_radius=14&plain=false&color_background=%23FFFFFF&color_border=%23DDDDDD&color_button=%231481F5&color_icons=%23148CF5`}/>
                        <p className="des">
                        Жилье для командировок, деловых поездок, путешествий, отдыха на море или горнолыжных курортах и множества других жизненных ситуаций.
                        </p>
                    </div>
                }
                {this.state[viget] ==  'hotels' && 
                    <div>

                        <Viget url={`https://tp.media/content?promo_id=3996&shmarker=${state.marker}&campaign_id=112&locale=ru&border_radius=20&plain=false&powered_by=false`}/>
                        <p className="des">
                        Ведущая платформа для онлайн бронирования отелей по всему миру. На сайте представлено более 800 000 отелей, хостелов и других видов жилья в 16 000 населённых пунктах. Пользователям доступна программа лояльности: Welcome Rewards™.
                        </p>
                    </div>
                }

                {this.state[viget] ==  'travelata' && 
                    <div>

                        <iframe scrolling="no" width="100%" height="500" frameBorder="0" src="https://www.travelpayouts.com/widgets/94e7d44780e64f2b6fce8fac3410eefd.html?v=2056"></iframe>
                        <p className="des">
                        Поиск туров по 68 направлениям. Посещаемость сайта составляет более 2 млн визитов в месяц.
                        </p>
                    </div>
                }


                {this.state[viget] ==  'sravni' && 
                    <div>

                        <Viget url={`https://c49.travelpayouts.com/content?promo_id=1437&shmarker=${state.marker}&country=ves-mir&open_in_new=true&theme=sravni_light&hide_logo=false&hide_partners=false`}/>
                        <p className="des">
                        Cравнение страховых продуктов, туристическое страхование
                        </p>
                    </div>
                }

                {this.state[viget] ==  'сherehapa' && 
                    <div>
     
                        <Viget url={`https://c24.travelpayouts.com/content?promo_id=2458&shmarker=${state.marker}&countryGroups=all-world&countries=abhazia&background=%2391C5FD&hide_title=true&hide_logos=false&input_titles=true&powered_by=false`}/>
                        <p className="des">
                        Онлайн-сервис по сравнению и продаже туристических страховок
                        </p>
                    </div>
                }

                {this.state[viget] ==  'strahovkaru' && 
                    <div>

                        <Viget url={`https://c53.travelpayouts.com/content?promo_id=1583&shmarker=${state.marker}&width=900&logo=true&background=&border=FFFFFF&icons=&title=&labels=&search_button=&country1=&country2=&country3=&powered_by=true`} />
                        <p className="des">
                        Поисковик страховок онлайн (ВЗР, ОСАГО, Жизнь, Недвижимость)
                        </p>
                    </div>
                }
                {this.state[viget] ==  'tripinsurance' && 
                    <div>
  
                        <Viget url={`https://c55.travelpayouts.com/content?promo_id=1589&shmarker=${state.marker}&territory=17&country=null&width=903&bgColor=%23C7CCF0&textColor=%23ffffff&showLogo=true&logoColor=white&showPrice=true&showMentions=true&showOffers=true&powered_by=false`}/>
                        <p className="des">
                        Премиальное туристическое страхование по доступной цене. Мы применяем лучшие мировые практики туристического страхования на российском рынке. Полис можно приобрести уже находясь в путешествии.
                        </p>
                    </div>
                }

                {this.state[viget] ==  'dreamlines' && 
                    <div>

                        <Viget url={`//tp.media/content?promo_id=2717&shmarker=${state.marker}&campaign_id=81&locale=ru&default_direction=%D0%9D%D0%BE%D1%80%D0%B2%D0%B5%D0%B6%D1%81%D0%BA%D0%B8%D0%B5%20%D1%84%D1%8C%D0%BE%D1%80%D0%B4%D1%8B&border_radius=20&plain=false&color_background=%23FFFFFF&color_text=%23222222&color_border=%23DDDDDD&color_button=%2306AAEE&color_button_text=%23ffffff&color_input_border=%23cccccc&color_input=%23ffffff&color_input_text=%23222222&color_focused=%230085FF&color_icons=%2306AAEE&powered_by=false" charset="utf-8`}/>
                        <p className="des">
                        Dreamlines предлагает круизы более чем от 30 круизных компаний по всему миру. Наши круизные эксперты имеют 10+ лет опыта в продажах круизов.
                        </p>
                    </div>
                }


                {this.state[viget] == 'discovercars' && 
                    <div>
                        <Viget url={`https://c117.travelpayouts.com/content?promo_id=3873&shmarker=${state.marker}&location=russia%2Fmoscow%2Fdowntown&locale=ru&bg_color=F5EFD6&font_color=333333&button_color=00a200&button_font_color=ffffff&button_text=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA&powered_by=false`}/>
                        <p className="des">
                        Cайт для сравнения цен на прокат автомобилей по всему миру. Сервис предлагает эксклюзивные цены от пунктов проката по всему миру. В базе доступно более 2 000 000 предложений по аренде автомобилей в 150+ странах.
                        </p>
                    </div>
                }

                {this.state[viget] == 'economybookings' && 
                    <div>

                        <Viget url={`//tp.media/content?promo_id=4480&shmarker=${state.marker}&campaign_id=10&locale=ru&powered_by=false&border_radius=5&plain=false&show_logo=true&color_background=%23F7E7B5&color_button=%2355a539`}/>
                        <p className="des">
                        Международный сервис бронирования дешевого автопроката в мире, России, Европе. 25000 пунктов проката, 150 стран мира.Русскоязычная служба резервирования и поддержки во время Вашей аренды. Круглосуточное обслуживание.
Более 800 автопрокатных компаний, включая все ведущие бренды.
                        </p>
                    </div>
                }

                {this.state[viget] == 'autoEurope' && 
                    <div>
     
                        <Viget url={`https://tp.media/content?promo_id=4464&shmarker=${state.marker}&campaign_id=52&locale=ru&powered_by=false&border_radius=20&plain=false&show_logo=true&color_background=%2396C3EE&color_button=%23e8b917`}/>
                        <p className="des">
                        Онлайн-сервис для бронирования автомобилей в 180+ странах мира. На карточках автомобилей расположена основная информация и условия аренды. Можно сравнить тарифы от разных арендодателей: Herz, Sixt, и других.
                        </p>
                    </div>
                }

                {this.state[viget] == 'myrentacar' && 
                    <div>

                        <Viget url={`https://c7.travelpayouts.com/content?promo_id=4320&shmarker=${state.marker}&country=35&city=95391&lang=ru&width=100&background=light&logo=true&header=true&gearbox=true&cars=true&border=false&footer=true`}/>
                        <p className="des">
                        Брокер аренды автомобилей в локальных прокатных компаниях. Регионы присутствия:
                        Крым, Черногория, Чехия, Грузия, Кипр, Болгария, ОАЭ, Греция, Сочи, Армения, Турция, Таиланд
                        </p>
                    </div>
                }

                {this.state[viget] == 'intui' && 
                    <div>
   
                        <Viget url={`https://c22.travelpayouts.com/content?promo_id=1586&shmarker=${state.marker}&locale=ru&view=detail&color_scheme=blue&h=&n_ap=&n_re=&powered_by=true" charset="utf-8`}/>
                        <p className="des">
                        Платформа по бронированию трансферов в 156 странах мира от лучших местных транспортных компаний.
                        </p>
                    </div>
                }

                {this.state[viget] == 'iway' && 
                    <div>

                        <Viget url={`https://c142.travelpayouts.com/content?promo_id=4233&shmarker=${state.marker}&lang=ru&currency=RUB&color=%2300AD5A&bodyBackground=%23EFF1F1`}/>
                        <p className="des">
                        Первая система онлайн-бронирования трансферов в России. С 2009 года перевезли более 9 миллионов пассажиров.
                        Поиск адресов на движке Гугл-карт — вводите название отеля или улицу, на любом языке, с опечатками и без.
                        Покрытие не ограничено городами и курортами — i'way строит любые маршруты на периферии обслуживаемых аэропортов и городов: везде, где есть дороги. В сети 670 аэропортов в 120 странах.

                        Мобильное приложение для клиентов i’way assist — показывает, где находится водитель и позволяет написать ему в чате — выручает, если Вы заблудились в аэропорту.
                        Бесплатное ожидание пассажира с момента прилёта в течение часа для внутренних рейсов, и двух часов — для международных. Встреча с табличкой в аэропорту или на вокзале, помощь с багажом по пути к автомобилю
                        Машины без логотипов и рекламы — для требовательных клиентов.

                        Автомобили от стандарта до представительского, включая минивэны Тесла.
                        Окончательная цена считается сразу и не меняется в поездке.
                        Круглосуточная поддержка на русском и английском, прямые номера в 15 самых популярных странах.
                        </p>
                    </div>
                }

                {this.state[viget] == 'kiwitaxi' && 
                    <div>

                        <Viget url={`https://c1.travelpayouts.com/content?shmarker=${state.marker}&promo_id=2949&locale=ru&currency=RUB&wtype=true&transfers_limit=10&powered_by=false&border_color=%23F5E3C2`}/>
                        <p className="des">
                        
Cистема онлайн-бронирования индивидуальных трансферов. 500 аэропортов и 117500 маршрутов в 100 странах — трансферы в аэропортах всех топовых курортов и новые подключения почти каждый месяц.
12 классов авто: от микро на 3-х пассажиров до микроавтобуса и премиум — трансферы под любые запросы туристов.
600 лицензированных перевозчиков на 5 континентах, фиксированная стоимость трансфера, дополнительные услуги, круглосуточная поддержка клиентов на русском и английском языке.
                        </p>
                    </div>
                }

                {this.state[viget] == 'tezeks' && 
                    <div>
     
                        <Viget url={`https://c141.travelpayouts.com/content?promo_id=4227&shmarker=${state.marker}&logo=false`}/>
                        <p className="des">
                        Официальный сервис туроператора TEZ TOUR по бронированию русскоязычных экскурсий, экскурсионных туров и аэропортовых трансферов, а также входных билетов в музеи и другие туристические объекты развлечений и достопримечательности более, чем в 35 странах мира и один из ведущих ресурсов данной тематики в рунете.
                        </p>
                    </div>
                }

                {this.state[viget] == 'tripster' && 
                    <div>

                        <Viget url={`https://c11.travelpayouts.com/content?promo_id=4217&shmarker=${state.marker}&order=top&num=5&widget_template=vertical&width=100%25&bg_color=&logo=true&widgetbar=false&widgetbar_delay=&widgetbar_position=top&powered_by=false`}/>
                        <p className="des">
                        Лидирующий сервис онлайн-бронирования экскурсий в России. Необычные экскурсии от местных жителей в 560+ городах мира.
                        </p>
                    </div>
                }

                {this.state[viget] == 'musement' && 
                    <div>
      
                        <Viget url={`https://tp.media/content?promo_id=4085&shmarker=${state.marker}&campaign_id=83&border_radius=20&color_button=%23FA6D55&plain=false&locale=ru&powered_by=false`}/>
                        <p className="des">
                        Musement предлагает билеты на самые захватывающие туры и мероприятия в любой точке мира.

                        От Рима до Бангкока Musement предлагает множество различных продуктов, таких как:
                        Билеты на аттракционы без очередей,
                        Городские туры,
                        Сити-пассы,
                        Тематические парки,
                        Гастрономические туры,
                        Выставки,
                        Спортивные и культурные мероприятия
                        </p>
                    </div>
                }

                {this.state[viget] == 'ticketnetwork' && 
                    <div>
   
                        <Viget url={`https://c72.travelpayouts.com/content?promo_id=2408&shmarker=${state.marker}&state=&results=10&text_color=%23000000&text_hover_color=%230077FF&button_color=%23ff5566&powered_by=false`}/>
                        <p className="des">
                        Площадка, где продавцы выставляют на продажу билеты на спортивные, театральные и концертные мероприятия по всему миру.
Концерты: Эд Ширан, Леди Гага, Кэти Перри
Театральные шоу: Wicked, Jersey Boys, Lion King, Cirque du Soleil
Спортивные события: MLB, НБА, НФЛ, НХЛ, NCAA, бокс и многое другое.
                        </p>
                    </div>
                }
                {this.state[viget] == 'tiqets' && 
                    <div>
    
                        <Viget url={`https://c89.travelpayouts.com/content?promo_id=3984&shmarker=${state.marker}&product=973698&language=ru&currency=EUR&powered_by=false`}/>
                        <p className="des">
                        Крупнейшая онлайн-платформа для продажи билетов в мире. Мы предлагаем электронные билеты в музеи, шоу и аттракционы по всему миру. В том числе такие города, как Дубай, Рим, Нью-Йорк и многие другие. Инновационная технология Tiqets гарантирует, что путешественники могут забронировать билеты со своего телефона в последнюю минуту, затем получить их в электронной форме и показать с мобильного телефона в музеях, достопримечательностях и достопримечательностях.
                        </p>
                    </div>
                }                
                {this.state[viget] == 'sputnik8' && 
                <div>
 
                    <Viget url={`https://c21.travelpayouts.com/content?promo_id=1500&shmarker=${state.marker}&city=18&query=&locale=ru&limit=5&pages=4&width=100&topbar=false&lead_text=true&disable_logo=true&transparent=false&no_borders=true&horizontal=false&show_top=true&all_btn=true&powered_by=false`}/>
                    <p className="des">
                    Поиск и бронирование экскурсий и мастер-классов по всему миру. У нас размещено более 5000 экскурсий в более, чем 100 городах: Москве, Санкт-Петербурге, Киеве, Праге, Париже, Барселоне, Риме, Лондоне, Паттайе, Пхукете и многих других.
                    </p>
                </div>
            }

            {this.state[viget] == 'weatlas' && 
                <div>

                    <Viget url={`https://c14.travelpayouts.com/content?promo_id=1584&shmarker=${state.marker}&view=base2&powered_by=false`}/>
                    <p  className="des">
                    Cервис бронирования экскурсий и развлечений в любом городе мира. Сервис предлагает экскурсии, развлечения, трансферы, билеты в различные достопримечательности и музеи. И все это — на одной площадке! У нас — только лучшие гиды, с отличными рекомендациями, и все проверены нами. Мы настолько уверены в качестве работы, что гарантируем вам самые лучшие впечатления.
                    </p>
                </div>
            }

            {this.state[viget] == 'poputchiki' && 
                <div>
                   <p className="des">
                   Попутчиков в отпуск или путешествие находят здесь. В любом месте веселее вместе!
                   </p>
                   <iframe src="https://vk.com/video_ext.php?oid=382960669&id=456239045&hash=3cb1826aa434671e&hd=2" width="100%" height="480" frameBorder="0" allowfullscreen></iframe>                
                </div>
            }

        
                <FixedLayout vertical='bottom'>
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <div align="center" style={{ paddingBottom:6 }}>
                            <Button className='circle_button' onClick={() => {
                                if(activeTab == 'viget') 
                                    this.openMenu_1()
                                else
                                    this.openMenu_2()
                            }}>
                                <Icon28ViewOutline />
                            </Button>
                        </div>
                        {activeTab == 'search' && <div style={{ paddingBottom:6,paddingRight:32,right:'0%', position:'absolute' }}>
                            <Button className='circle_button' style={{backgroundColor:'#4BBDE7'}} onClick={() => { this.props.onChangeGroups('info_viget', textVigets[this.state[viget]]); this.props.openModal('info_viget')}}>
                                <Icon36Article height={28} width={28}/>
                            </Button>
                        </div>}
                    </div>
                </FixedLayout>
                <Div />
                <Div />
            </Panel>
        )
    }
}