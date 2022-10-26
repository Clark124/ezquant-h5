
import {SpinLoading} from 'antd-mobile-v5'
import './index.scss'

export default function Loading(props){
    return (
        <div className="loading-wrapper">
            <div className="loading-content">
                <div className="loading-text">{props.text?props.text:''}</div>
                <SpinLoading color='primary' />
            </div>
            
        </div>
    )
}