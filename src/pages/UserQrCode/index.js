import React, { useState, useEffect } from 'react'

import './index.scss'

import {host} from '../../utils/index'

export default function QrCode() {
    let id=JSON.parse(localStorage.userInfo).id
    return (
        <div className='qr-code-wrapper'>
            <img
                alt=""
                src={`${host}/singalpush/qrcode/stockCreate?userId=${id}`}
                style={{ width: '100%' }}
            />
            <p style={{ fontSize: 14, marginTop: 10, textAlign: 'center' }}>
                关注公众号，可实时收取调仓信息(长按二维码)
            </p>
        </div>
    )
}