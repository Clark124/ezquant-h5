import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import { Dialog } from 'antd-mobile-v5'

export default function UserEdit() {
    const navigate = useNavigate()

    const logout = () => {
        Dialog.confirm({
            content: "确定要退出登录吗？",
            onConfirm: () => {
                localStorage.removeItem('userInfo')
                navigate(-1)
            }
        })

    }
    return (
        <div className="user-edit-wrapper">
            {/* <div className="avatar-wrapper">
                <span>头像</span>
                <div className="avatar-right">
                    <img src={require('../../asstes/images/default.jpeg')} alt="" className="avatar"/>
                    <img src={require('../../asstes/images/grarrow.png')} alt="" className="arrow-icon"/>
                </div>
            </div>
            <div className="nickname-wrapper">
                <span className="title">昵称</span>
                <span className="nickname">宝宝大人</span>
            </div>
            <div className="nickname-wrapper">
                <span className="title">个人简介</span>
                <span className="nickname">未填写</span>
            </div> */}
            <div className="nav-password" onClick={() => navigate('/bindPhone')}>
                绑定手机号
            </div>
            <div className="nav-password" onClick={() => navigate('/userInfo')}>
                修改个人资料
            </div>
            <div className="nav-password" onClick={() => navigate('/updatePassword')}>
                修改密码
            </div>
            {/* <div className="nav-password" onClick={() => navigate('/changeAccount')}>
                切换账号
            </div> */}
            <div className="nav-password" onClick={() => logout()}>
                退出
            </div>
        </div>
    )
}