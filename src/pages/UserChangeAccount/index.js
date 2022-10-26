import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import { getOtherUserByPhone } from '../../service/index'
import { Radio } from 'antd-mobile-v5'

export default function ChangeAccount() {
    const navigate = useNavigate()
    const [accountList, seAccountList] = useState([])
    const [userId, setUserId] = useState('')
    useEffect(() => {
        let useInfo = JSON.parse(localStorage.getItem("userInfo"))
        if (useInfo.phone) {
            getOtherUserByPhone({ phone: useInfo.phone }).then(res => {
                if (res.retCode === 0) {
                    if (res.data && res.data.length > 0) {
                        seAccountList(res.data)
                        setUserId(useInfo.id)
                    } else {
                        seAccountList([useInfo])
                        setUserId(useInfo.id)
                    }
                }
            })
        } else {
            seAccountList([useInfo])
            setUserId(useInfo.id)
        }
    }, [])

    const changeAccount = ()=>{
        accountList.forEach(item=>{
            if(item.id===userId){
                localStorage.setItem('userInfo',JSON.stringify(item))
                navigate('/user')
            }
        })
    }
    return (
        <div className='change-account-wrapper'>
            <div className='title'>切换账号</div>
            <Radio.Group
                value={userId}
                onChange={val => {
                    setUserId(val)
                }}
            >
                {accountList.map((item, index) => {
                    return (
                        <div className="account-item" key={item.id}>
                            <div className='avatar-username'>
                                <img src={item.portrait} alt="" className='avatar'/>
                                <div>{item.nickname ? item.nickname : item.username}</div>
                            </div>

                            <Radio value={item.id}></Radio>
                        </div>
                    )
                })}
            </Radio.Group>

            <div className='confim-btn' onClick={changeAccount}>确定</div>

        </div>
    )
}