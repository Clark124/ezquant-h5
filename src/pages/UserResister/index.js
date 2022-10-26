import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './index.scss'
import { Input, List, Button, Toast } from 'antd-mobile-v5'
import { sendCode ,userRegist} from '../../service/index'

export default function Register() {
    let navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confrimPassword, setConfrimPassword] = useState("")
    const [code, setCode] = useState("")
    const [registerCode, setregisterCode] = useState("获取验证码")

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
        if (code.trim() === "") {
            Toast.show({
                content: "请输入验证码",
                duration: 1000,
                position: 'top'
            })
            return
        }
        if (password !== confrimPassword) {
            Toast.show({
                content: "两次密码不一致",
                duration: 1000,
                position: 'top'
            })
            return
        }
        return true
    }

    const validateUsername = () => {
        if (!/^[1][3-9][0-9]{9}$/.test(username)) {
            Toast.show({
                // icon: 'fail',
                content: "必须为一个手机号码",
                duration: 1000,
                position: 'top'
            })
            return
        }
        return true
    }

    const onRegister = () => {
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
        userRegist({
            phone: username,
            captcha: code,
            password: password,
            confirmPassword: confrimPassword,
            isForget: 0 //isForget=1忘记密码，isForget=0注册
        }).then(res => {
            Toast.clear()
            if (res.retCode === 0) {
                Toast.show({
                    icon: 'success',
                    content: '注册成功',
                    afterClose:()=>{
                        navigate('/login')
                    }
                })
            } else {
                Toast.show({
                    icon: 'fail',
                    content: res.message,
                })
                if(res.message==='验证码不正确'){
                    setCode("")
                }
            
            }
        }).catch(err => {
            Toast.clear()
            Toast.show({
                icon: 'fail',
                content: '服务报错',
            })
        })
    }

    const onSendCode = () => {
        if (!validateUsername()) {
            return
        }
        if (registerCode !== '获取验证码') {
            return
        }
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
            maskClickable:false
        })

        sendCode({ phone: username }).then(res => {
            Toast.clear()
            if (res.retCode === 0) {
                let time = 60
                let interval = setInterval(() => {
                    time--
                    setregisterCode(`剩余${time}s`)
                    if (!time) {
                        setregisterCode(`获取验证码`)
                        clearInterval(interval)
                    }
                }, 1000)
            } else {

            }
        }).catch(err => {
            console.log(err)
            Toast.clear()
        })
    }

    return (
        <div className="login-wrapper">
            <div className="login-block">
                <div className="title">注册</div>
                <List>
                    <List.Item prefix='用户名'>
                        <Input placeholder='请输入用户名' clearable value={username} onChange={(e) => setUsername(e)} />
                    </List.Item>
                    <List.Item prefix='验证码'>
                        <Input placeholder='请输入验证码' clearable value={code} onChange={(e) => setCode(e)} />
                        <span className={registerCode === '获取验证码' ? 'get-code-btn' : 'get-code-btn gray'} onClick={() => onSendCode()}>{registerCode}</span>
                    </List.Item>
                    <List.Item prefix='密码'>
                        <Input placeholder='请输入密码' clearable type='password' value={password} onChange={(e) => setPassword(e)} />
                    </List.Item>
                    <List.Item prefix='确认密码'>
                        <Input placeholder='请再次入密码' clearable type='password' value={confrimPassword} onChange={(e) => setConfrimPassword(e)} />
                    </List.Item>
                </List>

                <Button block color='primary' size='normal' onClick={onRegister} style={{ marginTop: 20 }}>
                    注册
                </Button>
                <div className="login-footer">
                    <div className="forget-password"></div>
                    <div>
                        <span>已有账号？</span>
                        <span className="forget-password" onClick={() => navigate('/login')}>登录</span>
                    </div>
                </div>


            </div>
        </div>
    )
}


