
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import { saveMyConditon } from '../../../../service/pickStock'
import { Toast } from 'antd-mobile-v5'

export default function SaveCondition() {
    const navigate = useNavigate()
    const [name, setName] = useState("")

    const onSave = () => {
        const params = JSON.parse(localStorage.getItem("pickStockParams"))
        const result = JSON.parse(localStorage.getItem('pickStockResult'))
        
        if (name === '') {
            Toast.show({
                icon: "fail",
                content: "请输入选股条件名称"
            })
            return
        }
        let userInfo = localStorage.getItem("userInfo")
        userInfo = JSON.parse(userInfo)

        const data = {
            userId: userInfo.id,
            selectName: name,
            selectCondition: params.selectStockCondition,
            startDate: params.startDate,
            express:params.express,
            selectStockResult:JSON.stringify(result),
            period:params.period
        }
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0
        })
        saveMyConditon(data).then((res) => {
            Toast.clear()
            if (res === 'sucess') {
                Toast.show({
                    icon: "success",
                    content: "保存成功",
                    afterClose: () => {
                        navigate(-3)
                    }
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
        <div className="save-condition-wrapper">
            <div className="title">设置选股条件名称</div>
            <textarea placeholder="市场深圳A股，市盈率25~50，MACD大于0" value={name} onChange={(e)=>setName(e.target.value)}></textarea>
            {/* <div className="title">简单介绍下该选股条件</div>
            <textarea placeholder="请输入不超过200个字符"></textarea> */}
            <div className="save-condition-btn-wrapper">
                <div style={{ background: "#BBBBBB" }} onClick={() => { navigate(-1) }}>取消</div>
                <div style={{ marginLeft: 20 }} onClick={onSave}>保存</div>
            </div>
        </div>
    )
}