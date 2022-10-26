import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './index.scss'
import { Switch, Radio, Dialog, Toast } from 'antd-mobile-v5'
import { Link } from 'react-router-dom'
import { strategyStop, strategyRun, pushlishStrategy, deleteDeploy, changeNotice } from '../../service/strategy'
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
        let detail = localStorage.getItem('strategyTrustDetail')
        if (detail) {
            detail = JSON.parse(detail)
            setDetail(detail)
        }
    }, [])

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
                let dataDetail = JSON.parse(localStorage.getItem('strategyTrustDetail'))
                dataDetail.isSystemNotice = data.isSystemNotice
                dataDetail.isWeixinNotice = data.isWeixinNotice
                localStorage.setItem("strategyTrustDetail", JSON.stringify(dataDetail))
            }
        })
    }


    const changeStatus = () => {
        console.log(detail)
        if (detail.strategyStatus === 'Running') {
            strategyStop({ id: detail.id }).then(res => {
                setDetail({ ...detail, strategyStatus: "Stop" })
                let data = JSON.parse(localStorage.getItem('strategyTrustDetail'))
                data.strategyStatus = 'Stop'
                localStorage.setItem("strategyTrustDetail", JSON.stringify(data))

            })
        } else {
            strategyRun({ id: detail.id }).then(res => {
                setDetail({ ...detail, strategyStatus: "Running" })
                let data = JSON.parse(localStorage.getItem('strategyTrustDetail'))
                data.strategyStatus = 'Running'
                localStorage.setItem("strategyTrustDetail", JSON.stringify(data))
            })
        }
    }

    const onPublic = () => {
        Dialog.confirm({
            title: "发布策略",
            content: "将该策略发布到策略排行榜，并允许其他用户进行跟单。 允许他人跟单，系统会进行审核，请留意审核通知。",
            onConfirm: () => {
                pushlishStrategy({ strategyId: detail.id }).then(res => {
                    if (res.code === 200) {
                        setDetail({ ...detail, isPublish: '2' })
                        Toast.show({
                            icon: "success",
                            content: "发布成功"
                        })

                    } else {
                        Toast.show({
                            icon: "success",
                            content: res.message
                        })
                    }

                })

            }
        })
    }

    const onDelete = () => {
        Dialog.confirm({
            content: "确定要删除吗？",
            onConfirm: () => {
                const id = detail.id
                deleteDeploy({ id: id }).then(res => {
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
        <div className="trust-detail-wrapper">
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
                {/* <div className="strategy-type">
                    <span>运行状态</span>
                    <Switch
                        checked={detail.strategyStatus === 'Running'}
                        disabled
                        style={{

                            '--height': '20px',
                            '--width': '40px',
                        }}
                    />
                </div> */}
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
                            checked={detail.isSystemNotice === '1'}
                            onChange={checked => {
                                onChangeNotice('system', checked)
                            }}
                            style={{
                                '--height': '20px',
                                '--width': '40px',
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
                <div onClick={changeStatus} style={detail.strategyStatus === 'Running' ? { background: 'gray' } : null}>{detail.strategyStatus === 'Running' ? '停止' : '运行'}</div>
                <Link to={"/strategyRealReport/" + detail.id}>实盘报告</Link>
                {detail.isPublish === '0' && detail.strategyStatus === 'Running' ?
                    <div onClick={onPublic}>发布策略</div> : null
                }
                {detail.isPublish === '2' ?
                    <div  >待审核</div> : null
                }
                {detail.isPublish === '1' ?
                    <div  >已发布</div> : null
                }

                <div style={{ background: "red" }} onClick={onDelete}>删除</div>
            </div>

        </div>
    )
}