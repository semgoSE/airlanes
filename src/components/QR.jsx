import  React, { Component } from 'react';
import vkQr from '@vkontakte/vk-qr';

export default class QR extends Component {
    componentDidMount() { 
        const qrSvg = vkQr.createQR('https://vk.com/' + this.props.state.currentGroup.code, {
            qrSize: 256,
            isShowLogo: true
          });
        const script = document.createElement('div') 
        script.innerHTML = qrSvg;
        this.scriptTag.appendChild(script) 
        }
        
        render() { 
        return ( 
        <div ref={ref => (this.scriptTag = ref)} /> 
        ) 
        } 
        
}