import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './index.scss'
import { Input, List, Button, Toast } from 'antd-mobile-v5'
import { login } from '../../service/index'

export default function Login() {
    let navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const validate = () => {
        if (!/^[1][3-9][0-9]{9}$/.test(username)) {
            Toast.show({
                // icon: 'fail',
                content: "必须为一个手机号码",
                duration: 1000,
                position: 'top'
            })
            return
        }
        if (password.length < 6) {
            Toast.show({
                content: "密码不能小于6位",
                duration: 1000,
                position: 'top'
            })
            return
        }

        return true
    }

    const onLogin = () => {
        const isValidate = validate()
        if (!isValidate) {
            return
        }
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
            maskClickable:false
        })
        login({ username, password }).then(res => {
            Toast.clear()
            if (res.retCode === 0) {
                Toast.show({
                    icon: "success",
                    content: "登录成功",
                    duration: 1000,
                    position: 'top',
                    afterClose: () => {
                        navigate('/user', { replace: true })
                    }
                })
                localStorage.setItem('userInfo', JSON.stringify(res.data))


            } else {
                Toast.show({
                    // icon: "fail",
                    content: "用户名或者密码错误",
                    duration: 1000,
                    position: 'top'
                })
            }
        }).catch(err => {
            Toast.clear()
            console.log(err)
        })



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
        <div className="login-wrapper">
            <div className="login-block">
                {/* <div className="title">登录</div> */}
                
                <div className='other-login-method'>
                    <span className='text'>微信登录</span>
                </div>
                <div className='login-btn'>
                    <div onClick={wxLogin}>
                        <img src="https://gw.alicdn.com/tfs/TB1A8GcBAP2gK0jSZPxXXacQpXa-72-72.png" alt="" className='login-icon' />
                    </div>
                </div>

                <div className='spearate-line'></div>

                <div className='other-login-method'>
                    <span className='text'>手机登录</span>
                </div>

                <List>
                    <List.Item prefix='用户名'>
                        <Input placeholder='请输入用户名' clearable value={username} onChange={(e) => setUsername(e)} />
                    </List.Item>
                    <List.Item prefix='密码'>
                        <Input placeholder='请输入密码' clearable type='password' value={password} onChange={(e) => setPassword(e)} />
                    </List.Item>
                </List>

                <Button block color='primary' size='normal' onClick={onLogin} style={{ marginTop: 20 }}>
                    登录
                </Button>
                <div className="login-footer">
                    <div className="forget-password" onClick={() => navigate('/resetPassword')}>忘记密码?</div>
                    <div>
                        <span>没有账号？</span>
                        <span className="forget-password" onClick={() => navigate('/register')}>注册</span>
                    </div>
                </div>

                
              


            </div>
        </div>
    )
}


