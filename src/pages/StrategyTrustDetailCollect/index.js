import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import './index.scss'
import { userDeleteCollect } from '../../service/strategy'
import { Dialog, Toast } from 'antd-mobile-v5'

const periodList = {
    1: "1分钟",
    2: "5分钟",
    3: "15分钟",
    4: "30分钟",
    5: "1小时",
    6: '1日',
}

export default function StrategyDetail() {
    const params = useParams()
    const navigate = useNavigate()
    const [detail, setDetail] = useState({
        name: "",
        updateDate: "",
        description: "",
        id: "",
        type: "",
    })

    useEffect(() => {
        let detail = localStorage.getItem('strategyTrustDetailCollect')
        if (detail) {
            detail = JSON.parse(detail)
            setDetail(detail)
        }
    }, [])

    const navFollow = () => {
        navigate('/strategyRealReport/follow/' + detail.id)

        localStorage.setItem("followParams", JSON.stringify(detail))
    }

    const onDelete = () => {
        Dialog.confirm({
            content: "确定要删除吗？",
            onConfirm: () => {
                const id = detail.id
                let userId = JSON.parse(localStorage.getItem("userInfo")).id
                userDeleteCollect({ strategyId: id, userId }).then(res => {
                    if (res.code === 200) {
                        Toast.show({
                            icon: "success",
                            content: "删除成功",
                            afterClose: () => {
                                navigate(-1)
                            }
                        })

                    } else {
                        Toast.show({
                            icon: "fail",
                            content: res.message,
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        })
    }

    return (
        <div className="my-strategy-detail-collect-wrapper">
            <div className="strategy-content">
                <div className="strategy-name">{detail.hostingName}</div>

                <div className="strategy-type">
                    <span>创建人</span>
                    <span>{detail.author}</span>
                </div>
                <div className="strategy-type">
                    <span>股票</span>
                    <span>{detail.symbol}</span>
                </div>
                <div className="strategy-type">
                    <span>收益率</span>
                    <span>{detail.yieldRate}%</span>
                </div>
                <div className="strategy-type">
                    <span>频率</span>
                    <span>{periodList[detail.period]}</span>
                </div>

                <div className="strategy-type">
                    <span>开始日期</span>
                    <span>{detail.startDate}</span>
                </div>



            </div>
            <div className="my-strategy-detail-btn-wrapper">
                <div style={{ background: "#BBBBBB" }} onClick={onDelete}>删除策略</div>
                {detail.subscriberState === '1' ?
                    <div style={{ background: "#BBBBBB" }}>已跟单</div> :
                    <div onClick={navFollow}>跟单</div>
                }
            </div>
        </div>
    )
}