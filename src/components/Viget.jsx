import  React, { Component } from 'react';

export default class Viget extends Component {
    componentDidMount() { 
        const script = document.createElement('script') 
        console.log(this.props.url)
        script.src = this.props.url;
        script.charSet = 'utf-8' 
        script.async = true 
        this.scriptTag.appendChild(script) 
        }
        
        render() { 
        return ( 
        <div ref={ref => (this.scriptTag = ref)} /> 
        ) 
        } 
        
}