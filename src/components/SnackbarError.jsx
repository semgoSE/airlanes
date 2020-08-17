import React, { Component } from 'react'
import { render } from '@testing-library/react';
import { Snackbar } from '@vkontakte/vkui';

import Icon24Error from '@vkontakte/icons/dist/24/error';

const SnakbarError = ({ text , is_error, close}) => (
        <Snackbar onClose={close} before={is_error && <Icon24Error fill='#FA5728'/>}>{text ? text : "Ошибка интернет-соединения."}</Snackbar>
        )
    

export default SnakbarError;