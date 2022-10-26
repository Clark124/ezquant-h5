import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Toast } from 'antd-mobile-v5'
import { createContractPool } from '../../../../service'

import './index.scss'

export default function SavePool() {
    const navigate = useNavigate()
    const [name, setName] = useState("")

    const onSave = () => {
        if (name.trim() === "") {
            Toast.show({
                icon: "fail",
                content: "请输入股票池名称"
            })
            return
        }
        const result = JSON.parse(localStorage.getItem('pickStockResult'))
        const data = {
            type: 0,
            name: name,
            codes: result.map(item => item.prodCode).join(',')
        }
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0
        })
        createContractPool(data).then(res => {
            Toast.clear()
            if (res.retCode === 0) {
                Toast.show({
                    icon: 'success',
                    content: '保存成功',
                    afterClose:()=>{
                        navigate(-1)
                    }
                })
            } else {
                Toast.show({
                    content: res.message,
                })
            }
        }).catch(err => {
            Toast.clear()
            Toast.show({
                icon: "fail",
                content: "保存失败",
            })
        })
    }

    return (
        <div className="save-pool-wrapper">
            <div className="title">新建股票池</div>
            <div className="content">
                <div className="pool-item">
                    <div className="input-wrapper">
                        <input type="text" placeholder="请输入股票池名称" className="add-input" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="save-pool-btn-wrapper">
                <div style={{ background: "#BBBBBB" }} onClick={() => {
                    navigate(-1)
                }}>取消</div>
                <div style={{ marginLeft: 20 }} onClick={onSave}>保存</div>
            </div>

        </div>
    )
}