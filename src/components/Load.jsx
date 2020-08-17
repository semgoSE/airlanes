import React, { Component } from 'react'
import { Panel, Avatar, Div, Progress, Spinner, FixedLayout, InfoRow } from '@vkontakte/vkui';

function getStatus(n) {
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

const Load =  ({ progress, is_first,state, user}) => (
    
     <Div>
         <Div align='center'>
             {is_first ? <img weidth={120} style={{ marginTop: 60}} height={120} src='https://sun1-47.userapi.com/STWgmf99R15LB3jdzw_QDpKYXCLXWDc36tB9BA/uhBNnRmAblc.jpg' /> : <Avatar size={120} src='https://sun9-9.userapi.com/cBhXydLqUUQkHDWZkxYtVMivVmuxM1IRo5JWkQ/yvpKLp5qKus.jpg'/>}
         </Div>

                <FixedLayout vertical='bottom'>
                {!is_first && <div style={{ marginBottom: 12 }} align='center'><span>{state.user.first_name + " " + state.user.last_name}</span><br />{getStatus(state.my_groups.length + state.countDB)}</div>}
                    <Spinner style={{ marginBottom: 12 }}/>
                    <Progress value={progress} />
                </FixedLayout>
             
         
     </Div>

)

export default Load;