import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as eruda from 'eruda';
import * as erudaCode from 'eruda-code';
import * as erudaDom from 'eruda-dom';
import bridge from '@vkontakte/vk-bridge'
import '@vkontakte/vkui/dist/vkui.css';
 
import './main.css';
import './style.css';

bridge.send("VKWebAppInit", {})

ReactDOM.render(
  <App />,
  document.getElementById('root')
);



eruda.init();
eruda.add(erudaCode);
eruda.add(erudaDom);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
