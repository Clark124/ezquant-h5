import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'

import wx from "weixin-js-sdk"
import { getWxPayOrder, getWxConfig, getWxPayData } from '../../service/index'
import { Toast } from 'antd-mobile-v5'


export default function UserBuyIntegrate() {
    const navigate = useNavigate()
    useEffect(() => {
        getSdkConfig()
    }, [])

    const getSdkConfig = () => {
        let url = window.location.href.split("#")[0];
        console.log(url)
        // url = 'http://m.ezquant.cn/'
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const openid = userInfo.weixinOpenid
        getWxConfig({ url, openid}).then(res => {
            const data = res.data;
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: Number(data.timeStamp),
                nonceStr: data.nonceStr,
                signature: data.paySign,
                jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
            });
            wx.error(function (err) {
                Toast.show({
                    icon: 'fail',
                    content: err,
                })
            });

            wx.ready(function () {
               

            })
        })
    }


    const buyIntegrate = (money) => {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
            maskClickable: false
        })
        getWxPayOrder({ money, type: 'wxpay' }).then(res => {
            const orderId = res.data
            getWxPayData({
                orderId: orderId,
                type: 'wxpay',
                way: 'wap'
            }).then(res => {
                Toast.clear()
                if (res.retCode === 0) {
                    let data = res.data
                    wx.chooseWXPay({
                        appId: data.appId,
                        timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                        package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                        signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: data.paySign, // 支付签名
                        success: function (res) {
                            // 支付成功后的回调函数
                            Toast.show({
                                icon: 'success',
                                content: '支付成功',
                                afterClose: () => {
                                    navigate(-1)
                                }
                            })
                        },
                        fail: function (res) {
                            Toast.show({
                                icon: 'fail',
                                content: res.errMsg,
                            })
                        },
                        cancel: (res) => {
                            Toast.show({
                                icon: 'fail',
                                content: '取消支付',
                            })
                        },
                    });
                }else{
                    Toast.show({
                        icon: 'fail',
                        content: res.message,
                    })
                }

            }).catch(err => {
                Toast.clear()
                Toast.show({
                    icon: 'fail',
                    content: '服务端出错',
                })
            })
        }).catch(err => {
            Toast.clear()
            Toast.show({
                icon: 'fail',
                content: '服务端出错',
            })
        })

    }


    return (
        <div className="buy-integrate-wrapper">
            <div className="title">
                <span>选择想购买的数量</span>
            </div>
            <div className="integrate-item">
                <span>100积分（1元）</span>
                <span className="btn" onClick={() => buyIntegrate(1)}>购买</span>
            </div>
            <div className="integrate-item">
                <span>300积分（3元）</span>
                <span className="btn" onClick={() => buyIntegrate(3)}>购买</span>
            </div>
            <div className="integrate-item">
                <span>500积分（5元）</span>
                <span className="btn" onClick={() => buyIntegrate(5)}>购买</span>
            </div>

        </div>
    )
}