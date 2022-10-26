import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { messageNotRead ,isSubscribeQrCode} from '../../service/index'

import './index.scss'
import vip_icon from './images/vip.png'
import arrow_icon from './images/grarrow.png'
import xxzx_icon from './images/xxzx.png'
import jyzh_icon from './images/jyzh.png'
import wddd_icon from './images/wddd.png'
import sz_icon from './images/sz.png'

import { mainUrl } from '../../utils/index'
import { Toast } from 'antd-mobile-v5'


export default function User() {
    const navigate = useNavigate()
    const [Login, setLogin] = useState(false)
    const [vip, setVip] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const [unReadCount, setUnReadCount] = useState(0)
    const [isSubscribe, setIsSubscribe] = useState(false)

    useEffect(() => {
        let userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            userInfo = JSON.parse(userInfo)
            setUserInfo(userInfo)
            setLogin(true)
            notRead(userInfo)
            isSubGZH()
        }
    }, [])

    const navTo = (url) => {
        let userInfo = localStorage.getItem('userInfo')
        if (!userInfo) {
            Toast.show({
                icon:"fail",
                content:"请登录"
            })
            // navigate('/login')
            return
        }
        navigate(url)
    }
    const isSubGZH = () => {
        let userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            userInfo = JSON.parse(userInfo)
            isSubscribeQrCode({ userId: userInfo.id }).then(res => {
                if (res === 'unsubscribe') {
                    setIsSubscribe(false)
                }
                if (res === 'subscribe') {
                    setIsSubscribe(true)
                }
            })
        }

    }

    const navToQrCode = (url) => {
        if(isSubscribe){
            return
        }
        let userInfo = localStorage.getItem('userInfo')
        if (!userInfo) {
            Toast.show({
                icon:"fail",
                content:"请登录"
            })
            // navigate('/login')
            return
        }
        navigate(url)
    }

    const notRead = (userInfo) => {
        messageNotRead({ userId: userInfo.id }).then(res => {
            if (res.code === 200) {
                setUnReadCount(res.data)
            }
        })
    }

    const onLogin = () => {
        // navigate('/login')
        wxLogin()
       
    }
    const wxLogin = () => {
        const appid = "wx601ea0faf2275228";
        let REDIRECT_URI = 'http://m.ezquant.cn/#/wxCallback';
        REDIRECT_URI = encodeURIComponent(REDIRECT_URI)
        // let REDIRECT_URI = 'http://m.ezquant.cn';
        const SCOPE = "snsapi_userinfo";
        let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=STATE#wechat_redirect`;
        window.location.href = url;
    }

    return (
        <div className="user-wrapper">
            <div className="banner">
                {Login ?
                    <div className="userinfo">
                        <img src={userInfo.portrait} alt="" className="avatar" />
                        {/* <img src={vip_icon} alt="" className="vip-icon" /> */}
                        <div className="brief">简介：{userInfo.brief}</div>
                    </div> :
                    <div className="userinfo" onClick={onLogin}>
                        <img src={require('./images/default.jpeg')} alt="" className="avatar" />
                        <div className="login-text">请登录</div>
                    </div>
                }

            </div>
            <div className="user-nav-list">
                <div className="nav-item" onClick={navTo.bind(this, '/message/notice')}>
                    <div className="nav-name">
                        <img src={xxzx_icon} alt="" className="nav-icon" />
                        <span>消息中心</span>
                        <span className="number">({unReadCount})</span>
                    </div>
                    <img src={arrow_icon} alt="" className="arrow-icon" />
                </div>
                <div className="nav-item" onClick={navTo.bind(this, '/userAccount')}>
                    <div className="nav-name">
                        <img src={jyzh_icon} alt="" className="nav-icon" />
                        <span>交易账户</span>
                    </div>
                    <img src={arrow_icon} alt="" className="arrow-icon" />
                </div>
                <div className="nav-item" onClick={navTo.bind(this, '/userOrder')}>
                    <div className="nav-name">
                        <img src={wddd_icon} alt="" className="nav-icon" />
                        <span>我的订单</span>
                    </div>
                    <img src={arrow_icon} alt="" className="arrow-icon" />
                </div>
                <div className="nav-item" onClick={navTo.bind(this, '/userEdit')}>
                    <div className="nav-name">
                        <img src={sz_icon} alt="" className="nav-icon" />
                        <span>设置</span>
                    </div>
                    <img src={arrow_icon} alt="" className="arrow-icon" />
                </div>
                <div className="nav-item" onClick={navToQrCode.bind(this, '/qrCode')}>
                    <div style={{ "textAlign": "center", 'flex': 1 }}>
                        {isSubscribe?'已关注微信公众号':'关注微信公众号'}
                    </div>
                </div>
            </div>
        </div>
    )
}