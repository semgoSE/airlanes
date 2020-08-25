import React, { Component } from 'react'
import logo from '../img/logo.png';
import { Panel, Avatar, Div, Progress, Spinner, FixedLayout, InfoRow } from '@vkontakte/vkui';


export default class Load extends Component {

state = {
    welcome: '' 
}

componentDidMount() {

    let h = new Date().getHours()
    if(h >=  0 && h < 6) 
        this.setState({ welcome: 'Доброй ночи, ' + this.props.state.user.first_name + '!'})
    else 
        if(h >=6 && h < 12)
            this.setState({ welcome: 'Доброе утро, ' + this.props.state.user.first_name + '!'})
        else 
            if(h >=12 && h < 18)
                this.setState({ welcome: 'Добрый день, ' + this.props.state.user.first_name + '!'})
            else 
                this.setState({ welcome: 'Добрый вечер, ' + this.props.state.user.first_name + '!'})
    setTimeout(() => this.setState({welcome: 'Cегодня ' + new Date().toLocaleString('ru', { day: 'numeric', month: 'long' }) }), 2000)
}


 getStatus(n) {
    let name = 'посетитель'
     if(n == 0 || n == 1) {
         return 'посетитель';
     }else if(n >= 2 && n < 5) {
         return 'пользователь'
     } else if(n >=5 && n < 10) {
         return 'опытный пользователь'
     } else if(n >=10 && n < 15) {
         return 'путешественник'
     } else {
         return 'опытный путешественник'
     }

}



   render() {
       const { is_first, progress, state } = this.props;
        return(
     <Div>
         <Div align='center'>
             {is_first ? <img weidth={120} style={{ marginTop: 60}} height={120} src={logo} /> : <Avatar size={120} src='https://sun9-9.userapi.com/cBhXydLqUUQkHDWZkxYtVMivVmuxM1IRo5JWkQ/yvpKLp5qKus.jpg'/>}
         </Div>

                <FixedLayout vertical='bottom'>
                {!is_first && <div style={{ marginBottom: 12 }} align='center'><span>{state.user.first_name + " " + state.user.last_name}</span><br />{this.getStatus(state.my_groups.length + state.countDB)}</div>}
                {is_first && <div style={{ marginBottom: 12 }} align='center'><span>{this.state.welcome}</span></div>}
                    <Spinner style={{ marginBottom: 12 }}/>
                    <Progress value={progress} />
                </FixedLayout>
             
         
     </Div>
     )
    }
}