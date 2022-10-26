
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import { favorList ,addFavor} from '../../../../service/traderoom'
import { Toast } from 'antd-mobile-v5'


export default function ScanResult() {
    const navigate = useNavigate()
    const [dataList, setDataList] = useState([])
    const [favor, setFavor] = useState([])

    useEffect(() => {
        const result = JSON.parse(localStorage.getItem('scanResult'))
        setDataList(result)
        getFavorList()
    }, [])

    const getFavorList = () => {
        let userInfo = localStorage.getItem('userInfo')
        userInfo = JSON.parse(userInfo)
        const data = {
            refId: userInfo.id,
            pageNum: 1,
            pageSize: 100
        }
        favorList(data).then(res => {
            setFavor(res.data.list)
        })
    }

    const onAddFavor = (item, index) => {
        let userInfo = localStorage.getItem('userInfo')
        userInfo = JSON.parse(userInfo)
        Toast.show({
            icon:"loading",
            content:"加载中...",
            duration:0
        })
        addFavor({ refId: userInfo.id, symbol: item.prodCode }).then((res) => {
            Toast.clear()
            if (res.retCode === 0) {

                getFavorList()
                Toast.show({
                    icon: "success",
                    content: "添加成功"
                })
            } else {
                Toast.show({
                    icon: "success",
                    content: res.message
                })
            }
        })
    }


    return (
        <div className="scan-result-wrapper">
            <div className='title'>扫描结果</div>
            <div className="content">
                <div className="head-title">
                    <span>股票名称</span>
                    <span>股票代码</span>
                    <span>自选</span>
                </div>
                {dataList.map((item, index) => {

                    let hasAdd = false
                    favor.forEach(favoritem => {
                        if (favoritem.symbol === item.prodCode) {
                            hasAdd = true
                        }
                    })
                    return (
                        <div className="result-item" key={index}>
                            <div>
                                {item.prodName}
                            </div>
                            <div>
                                {item.prodCode}
                            </div>
                            {hasAdd ? <div className="add-btn gray">已添加</div> : <div className="add-btn" onClick={() => onAddFavor(item, index)}>加自选</div>}

                        </div>
                    )
                })}


            </div>
            <div className='footer'>
                <div className='total'>合计选出{dataList.length}条结果</div>
                <div className='confirm' onClick={()=>navigate(-1)}>确定</div>
            </div>
        </div>
    )
}