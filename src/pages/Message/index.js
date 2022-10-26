import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from 'antd-mobile-v5'
import './index.scss'
import {messageCenter} from '../../service/index'

export default function Message() {
    const [dataList,setDataList] = useState([])
    useEffect(()=>{
        getInit()
    },[])

    
    const getInit = () => {
        // let { pageNum, pageSize } = this.state;
        let userInfo = JSON.parse(localStorage.getItem("userInfo"))
       
        messageCenter({ userId:userInfo.id, size:10, page:1 }).then(res => {
            if (res.code === 200) {
                setDataList(res.data.page_date)
                // this.setState({
                //     questionList: res.data.page_date,
                //     total: res.data.total_size,
                //     loading: false
                // })
            }

        })
    }
    
    return (
        <div className="message-wrapper">
            {/* <NavBar onBack={back}>标题</NavBar> */}
            <Link className="message-item" to="/messageEarlyWarning">
                <img src={require('./images/yjtz.png')} alt="" className="message-icon" />
                <div className="massage-content">
                    <div className="message-title">
                        <div className="message-name">
                            <div>预警通知</div>
                            <div className="count">10</div>
                        </div>
                        <div className="date">2020-01-21</div>

                    </div>
                    <div className="message-info">
                        华润万东(600055)上涨5.11%,现价27.3%
                    </div>
                </div>
            </Link>
            <Link className="message-item" to="/">
                <img src={require('./images/clxhtz.png')} alt="" className="message-icon" />
                <div className="massage-content">
                    <div className="message-title">
                        <div className="message-name">
                            <div>策略信号通知</div>
                            <div className="count">10</div>
                        </div>
                        <div className="date">2020-01-21</div>
                    </div>

                    <div className="message-info">
                        华润万东(600055)上涨5.11%,现价27.3%
                    </div>
                </div>
            </Link>
            <Link className="message-item" to="/">
                <img src={require('./images/clxdtz.png')} alt="" className="message-icon" />
                <div className="massage-content">
                    <div className="message-title">
                        <div className="message-name">
                            <div>策略下单通知</div>
                            <div className="count">10</div>
                        </div>
                        <div className="date">2020-01-21</div>
                    </div>

                    <div className="message-info">
                        华润万东(600055)上涨5.11%,现价27.3%
                    </div>
                </div>
            </Link>
            <Link className="message-item" to="/">
                <img src={require('./images/clgdtz.png')} alt="" className="message-icon" />
                <div className="massage-content">
                    <div className="message-title">
                        <div className="message-name">
                            <div>策略跟单通知</div>
                            <div className="count">10</div>
                        </div>
                        <div className="date">2020-01-21</div>
                    </div>

                    <div className="message-info">
                        华润万东(600055)上涨5.11%,现价27.3%
                    </div>
                </div>
            </Link>
            <Link className="message-item" to="/">
                <img src={require('./images/xtxx.png')} alt="" className="message-icon" />
                <div className="massage-content">
                    <div className="message-title">
                        <div className="message-name">
                            <div>系统消息</div>
                            <div className="count">10</div>
                        </div>
                        <div className="date">2020-01-21</div>
                    </div>
                    <div className="message-info">
                        华润万东(600055)上涨5.11%,现价27.3%
                    </div>
                </div>
            </Link>
            <Link className="message-item" to="/">
                <img src={require('./images/stsmtz.png')} alt="" className="message-icon" />
                <div className="massage-content">
                    <div className="message-title">
                        <div className="message-name">
                            <div>市场扫描通知</div>
                            <div className="count">10</div>
                        </div>
                        <div className="date">2020-01-21</div>
                    </div>

                    <div className="message-info">
                        华润万东(600055)上涨5.11%,现价27.3%
                    </div>
                </div>
            </Link>
        </div>
    )

}