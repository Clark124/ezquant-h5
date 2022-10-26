import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import './index.scss'
import { Switch, Radio, Dialog, Toast } from 'antd-mobile-v5'
import { Link } from 'react-router-dom'

import { strategyStop, strategyRun, changeNotice, deleteFollow } from '../../service/strategy'
import { isSubGZH } from '../../utils'


const periodList = {
    1: "1分钟",
    2: "5分钟",
    3: "15分钟",
    4: "30分钟",
    5: "1小时",
    6: '1日',
}

export default function TrustDetail() {

    const params = useParams()
    const navigate = useNavigate()
    const [detail, setDetail] = useState({

    })

    useEffect(() => {
        let detail = localStorage.getItem('strategyTrustDetailFollow')
        if (detail) {
            detail = JSON.parse(detail)
            setDetail(detail)
        }
    }, [])

    const changeStatus = () => {

        if (detail.strategyStatus === 'Running') {
            strategyStop({ id: detail.id }).then(res => {
                setDetail({ ...detail, strategyStatus: "Stop" })
                let data = JSON.parse(localStorage.getItem('strategyTrustDetailFollow'))
                data.strategyStatus = 'Stop'
                localStorage.setItem("strategyTrustDetailFollow", JSON.stringify(data))

            })
        } else {
            strategyRun({ id: detail.id }).then(res => {
                setDetail({ ...detail, strategyStatus: "Running" })
                let data = JSON.parse(localStorage.getItem('strategyTrustDetailFollow'))
                data.strategyStatus = 'Running'
                localStorage.setItem("strategyTrustDetailFollow", JSON.stringify(data))
            })
        }
    }

    const onChangeNotice = (type, checked) => {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"))
        let data = {
            userId: userInfo.id,
            singalTypeId: 1,
            singalSourceId: detail.id,
            isWeixinNotice: detail.isWeixinNotice,
            isSystemNotice: detail.isSystemNotice,
        }
        if (type === 'system') {
            data.isSystemNotice = checked ? '1' : '0'
        } else if (type === 'weixin') {
            data.isWeixinNotice = checked ? '1' : '0'
        }
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0
        })
        changeNotice(data).then(res => {
            Toast.clear()
            if (res.code === 200) {
                setDetail({ ...detail, isWeixinNotice: data.isWeixinNotice, isSystemNotice: data.isSystemNotice })
                let dataDetail = JSON.parse(localStorage.getItem('strategyTrustDetailFollow'))
                dataDetail.isSystemNotice = data.isSystemNotice
                dataDetail.isWeixinNotice = data.isWeixinNotice
                localStorage.setItem("strategyTrustDetailFollow", JSON.stringify(dataDetail))
            }
        })
    }

    const onDelete = () => {
        Dialog.confirm({
            content: "确定要删除吗？",
            onConfirm: () => {
                const id = detail.id
                deleteFollow({ id: id }).then(res => {
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
        <div className="trust-detail-follow-wrapper">
            <div className="strategy-content">
                <div className="strategy-name">
                    {detail.hostingName}
                </div>
                <div className="strategy-type">
                    <span>交易标的</span>
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
                    <span>运行状态</span>
                    <Switch
                        style={{
                            '--height': '20px',
                            '--width': '40px',
                        }}
                        checked={detail.strategyStatus === 'Running'}
                        onChange={changeStatus}

                    />
                </div>
                {/* <div className="strategy-type-method">
                    <span>交易方式</span>
                    <div className="method-value">
                        <Radio.Group >
                            <Radio style={{ '--font-size': '14px', marginRight: 30 }}>自动模拟交易</Radio>
                            <Radio style={{ '--font-size': '14px' }}>仅提示交易信号</Radio>
                        </Radio.Group>
                    </div>
                </div> */}
                <div className="strategy-type-method">
                    <span>通知方式</span>
                    <div className="method-value" >
                        <span>系统通知（免费）</span>
                        <Switch
                            style={{
                                '--height': '20px',
                                '--width': '40px',
                            }}
                            checked={detail.isSystemNotice === '1'}
                            onChange={checked => {
                                onChangeNotice('system', checked)
                            }}
                        />
                    </div>
                    <div className="method-value">
                        <span>微信通知</span>
                        <Switch
                            checked={detail.isWeixinNotice === '1'}
                            onChange={async (checked) => {
                                if (checked) {
                                    const hasSub = await isSubGZH(navigate)
                                    if (!hasSub) {
                                        return
                                    }
                                }
                                onChangeNotice('weixin', checked)
                            }}
                            style={{
                                '--height': '20px',
                                '--width': '40px',
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="my-strategy-detail-btn-wrapper">
                <Link to={"/strategyRealReport/" + detail.id}>实盘报告</Link>
                <div style={{ background: "#BBBBBB" }} onClick={onDelete}>删除策略</div>
            </div>

        </div>
    )
}