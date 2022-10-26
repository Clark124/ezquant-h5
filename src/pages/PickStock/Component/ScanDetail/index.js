
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dialog, Switch, Toast } from 'antd-mobile-v5'
import './index.scss'
import { changeNotice, scanListDelete, scanListStatus, pauseScanDeploy, scanSignalList } from '../../../../service/strategy'
import { isSubGZH } from '../../../../utils'

const periodList = {
    1: "1分钟",
    2: "5分钟",
    3: "15分钟",
    4: "30分钟",
    5: "1小时",
    6: '1日',
}

export default function ScanDetail() {
    const navigate = useNavigate()
    const [detail, setDetail] = useState({})

    useEffect(() => {
        const detail = JSON.parse(localStorage.getItem('scanDetail'))

        setDetail(detail)
    }, [])

    const handleChangeMessage = (key, col) => {
        const userId = JSON.parse(localStorage.getItem("userInfo")).id
        let data = {
            userId,
            singalTypeId: 4,
            singalSourceId: col.id,
        }
        if (key === 'system') {
            data.isSystemNotice = col.isSystemNotice === '1' ? 0 : 1
            data.isWeixinNotice = col.isWeixinNotice === '1' ? 1 : 0
        } else {
            data.isWeixinNotice = col.isWeixinNotice === '1' ? 0 : 1
            data.isSystemNotice = col.isSystemNotice === '1' ? 1 : 0
        }
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0,
            maskClickable: false
        })
        changeNotice(data).then(res => {
            Toast.clear()
            if (res.code === 200) {
                let result = JSON.parse(JSON.stringify(detail))
                if (key === 'system') {
                    result.isSystemNotice = col.isSystemNotice === '1' ? '0' : '1'
                } else {
                    result.isWeixinNotice = col.isWeixinNotice === '1' ? '0' : '1'
                }
                setDetail(result)
                localStorage.setItem('scanDetail', JSON.stringify(result))
            }
        }).catch(err => {
            Toast.clear()
        })


    }


    const handleDelete = (col) => {
        Dialog.confirm({
            title: "提示",
            content: '确定要删除吗？',
            onConfirm: () => {
                Toast.show({
                    icon: "loading",
                    content: "删除中...",
                    duration: 0,
                    maskClickable: false
                })
                scanListDelete({ id: col.id }).then(res => {
                    Toast.clear()
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
                            icon: "success",
                            content: "删除失败"
                        })
                    }
                }).catch(err => {
                    Toast.clear()
                })
            }
        })

    }

    const handleDeploy = () => {
        if (detail.scanStatus === 'Stop') {
            Dialog.confirm({
                title: "提示",
                content: (
                    <>
                        <p>托管以后，系统会按照指定的周期对指定范围的股票或股票进行扫描， 并将扫描结果通知到您的微信。</p>
                        <p>每当您收到一条通知，系统化会从您的积分账户扣除10积分。</p>
                    </>
                ),
                onConfirm: () => {
                    Toast.show({
                        icon: "loading",
                        content: "加载中...",
                        duration: 0,
                        maskClickable: false
                    })
                    scanListStatus({ id: detail.id }).then(res => {
                        Toast.clear()
                        if (res.code === 200) {
                            let result = JSON.parse(JSON.stringify(detail))
                            result.scanStatus = 'Running'
                            setDetail(result)
                            localStorage.setItem('scanDetail', JSON.stringify(result))
                            Toast.show({
                                icon: "success",
                                content: "托管成功"
                            })
                        } else {

                        }
                    })
                }
            })
        }
    }

    const pauseDeploy = () => {
        Dialog.confirm({
            title: "提示",
            content: "确定要暂停当前托管吗？",
            onConfirm: () => {
                Toast.show({
                    icon: "loading",
                    content: "加载中...",
                    duration: 0,
                    maskClickable: false
                })
                pauseScanDeploy({ id: detail.id }).then(res => {
                    Toast.clear()
                    if (res.code === 200) {
                        let result = JSON.parse(JSON.stringify(detail))
                        result.scanStatus = 'Stop'
                        setDetail(result)
                        localStorage.setItem('scanDetail', JSON.stringify(result))
                        Toast.show({
                            icon: "success",
                            content: "取消托管成功"
                        })
                    } else {
                        Toast.show({
                            icon: "fail",
                            content: res.message
                        })
                    }
                })
            }
        })
    }

    const handleScan = () => {
        Dialog.confirm({
            title: "提示",
            content: (
                <>
                    <p>实时扫描会从您的账户扣除10积分，是否确定进行实时扫描？</p>
                </>
            ),
            onConfirm: () => {
                Toast.show({
                    icon: "loading",
                    content: "加载中...",
                    duration: 0,
                    maskClickable: false
                })

                scanSignalList({ id: detail.id }).then(res => {
                    Toast.clear()
                    localStorage.setItem('scanResult', JSON.stringify(res))
                    // localStorage.setItem('selectStockParam', JSON.stringify({ params: [], date: moment(date, 'YYYY-MM-DD').format('YYYYMMDD') }))
                    navigate('/scanResult/1')
                })

            }
        })
    }

    return (
        <div className="scan-detail-wrapper">
            <div className="content">
                <div className="strategy-name">{detail.scanName}</div>
                {/* <div className="info-item">
                    <span>扫描类型</span>
                    <span>策略扫描</span>
                </div> */}
                <div className="info-item">
                    <span>扫描范围</span>
                    <span>{detail.marketType}</span>
                </div>
                <div className="info-item">
                    <span>周期</span>
                    <span>{periodList[detail.period]}</span>
                </div>
                {/* <div className="info-item">
                    <span>运行状态</span>
                    <span>
                        <Switch
                            style={{
                                '--height': '20px',
                                '--width': '40px',
                            }}

                            checked={detail.scanStatus !== 'Stop'}
                        />
                    </span>
                </div> */}
                <div className="strategy-type-method">
                    <div className="method-title">通知方式</div>
                    <div className="method-value" >
                        <span>系统通知（免费）</span>
                        <Switch
                            style={{
                                '--height': '20px',
                                '--width': '40px',
                            }}
                            checked={detail.isSystemNotice === '1'}
                            onChange={checked => handleChangeMessage('system', detail)}
                        />
                    </div>
                    <div className="method-value">
                        <span>微信通知</span>
                        <Switch
                            style={{
                                '--height': '20px',
                                '--width': '40px',
                            }}
                            checked={detail.isWeixinNotice === '1'}
                            onChange={async (checked) => {
                                if (checked) {
                                    const hasSub = await isSubGZH(navigate)
                                    if (!hasSub) {
                                        return
                                    }
                                }
                                handleChangeMessage('weixin', detail)
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="scan-detail-btn-wrapper">
                {detail.scanStatus === 'Stop' ?
                    <div onClick={handleDeploy}>托管</div> :
                    <div onClick={pauseDeploy} style={{ background: "#999999" }}>暂停托管</div>
                }

                <div onClick={handleScan}>扫描</div>
                <div style={{ background: "#999999" }} onClick={() => handleDelete(detail)}>删除</div>
            </div>
        </div>
    )
}