import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './index.scss'
import { Input, List, Button, Toast } from 'antd-mobile-v5'
import { updatePassword } from '../../service/index'

export default function Register() {
    let navigate = useNavigate()
    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    const validate = () => {

        if (password.length < 6) {
            Toast.show({
                content: "密码不能小于6位",
                duration: 1000,
                position: 'top'
            })
            return
        }

        if (password !== confirmPassword) {
            Toast.show({
                content: "两次密码不一致",
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
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))

        const data = {
            id: userInfo.id,
            oldPassword,
            password,
            confirmPassword

        }

        updatePassword(data).then(res => {
            Toast.clear()
            if (res.retCode === 0 && res.data.message === 'success') {
                Toast.show({
                    content: "修改成功",
                    icon: 'success',
                    position: 'top'
                })
                setOldPassword("")
                setPassword("")
                setConfirmPassword("")


            } else {
                Toast.show({
                    content: res.message,
                    icon: 'fail',
                    position: 'top'
                })
            }
        })

    }



    return (
        <div className="login-wrapper">
            <div className="login-block">
                <div className="title">修改密码</div>
                <List>
                    <List.Item prefix='原始密码'>
                        <Input placeholder='请输入用户名' type='password' clearable value={oldPassword} onChange={(e) => setOldPassword(e)} />
                    </List.Item>

                    <List.Item prefix='最新密码'>
                        <Input placeholder='请输入密码' clearable type='password' value={password} onChange={(e) => setPassword(e)} />
                    </List.Item>
                    <List.Item prefix='确认最新密码'>
                        <Input placeholder='请再次入密码' clearable type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e)} />
                    </List.Item>
                </List>

                <Button block color='primary' size='normal' onClick={onRegister} style={{ marginTop: 20 }}>
                    修改
                </Button>



            </div>
        </div>
    )
}


