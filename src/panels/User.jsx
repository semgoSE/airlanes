import React, { Component } from 'react'
import { Panel, Div, Avatar, PanelHeader, PanelHeaderBack, SimpleCell, InfoRow } from '@vkontakte/vkui'

const User = ({ id, user, status, go }) => (
    <Panel id={id}>
        <PanelHeader left={<PanelHeaderBack onClick={() => go('home')} />}>{user.first_name + " " + user.last_name}</PanelHeader>
        <Div align='center'>
            <Avatar src={user.photo_200} size={96}/>
        </Div>
        <Div>
        {user.city && <SimpleCell disabled indicator={user.city.title}>Город</SimpleCell>}
        <SimpleCell disabled indicator={status}>Ваш статус</SimpleCell>
        </Div>
    </Panel>
)
export default User;