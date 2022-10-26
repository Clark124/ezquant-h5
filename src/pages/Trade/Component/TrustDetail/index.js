import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Radio, Stepper, Checkbox, Switch, ActionSheet, Dialog, Modal, Toast } from 'antd-mobile-v5'
import { connect } from 'react-redux'
import { strategyList, deployStrategy, deployStrategyDetail, strategyStop, strategyRun, deleteDeploy, deployStrategyUpdate } from '../../../../service/traderoom'


import './index.scss'
import arrow_icon from '../../../../asstes/images/grarrow.png'

import { changePeriod, setMyStrategyList } from '../../actions'
import { isSubGZH } from '../../../../utils'

const positionObj = {
    'isFull': '全仓',
    'isHalfFull': '半仓',
    'isFixedRate': '固定仓位',
    'isFixedCount': '固定股数',
    'isDynamicKelly': '动态凯丽',
    'isMartin': '马丁加仓',
    'isAntiMartin': '反马丁加仓',
}

const positionIndex = {
    'isFull': 1,
    'isHalfFull': 2,
    'isFixedRate': 3,
    'isFixedCount': 4,
    'isDynamicKelly': 5,
    'isMartin': 6,
    'isAntiMartin': 7,
}


function StrategyTrust(props) {
    const navigate = useNavigate()
    const params = useParams()
    const [defaultAccount, setDefaultAccount] = useState("")
    const [visiblePeriodList, setVisiblePeriodList] = useState(false)
    const [period, setPeriod] = useState(6)
    const [periodText, setPeriodText] = useState('1日')
    const [capital, setCapital] = useState(100000)
    const [riskIndex, setRiskIndex] = useState(0)
    const [visibleRiskList, setVisibleRiskList] = useState(false)
    const [trustName, setTrustName] = useState("")
    const [discribe, setDiscribe] = useState("")
    const [positionValue, setPositionValue] = useState('isFull')
    let [positionData, setPositionData] = useState({
        fullPositonMulPercent: 100,
        fixedPositonMulPercent: 10, //固定资金比例
        fixedPostionCount: 100, //固定股数
        initObvPositionMulPercent: 0,
        observationPeriod: 10,
        martinFirstPositonMulPercent: 10,
        antiMartinFirstPositonMulPercent: 10,
    })

    const [profitRatio, setprofitRatio] = useState(20)
    const [lossRatio, setlossRatio] = useState(20)
    const [profitTick, setprofitTick] = useState(1)
    const [lossTick, setlossTick] = useState(1)
    const [weixinNotice, setweixinNotice] = useState(false)
    const [systemNotice, setsystemNotice] = useState(false)
    const [isOrder, setisOrder] = useState(0)
    const [isPublish, setisPublish] = useState(false)
    const [strategyName, setstrategyName] = useState("")
    const [symbol, setsymbol] = useState("")
    const [status, setstatus] = useState(true)

    const periodActions = [
        {
            text: '1分钟', key: 1, onClick: (e) => {
                changeSmallPeriod(1, '1分钟')
            }
        },
        {
            text: '5分钟', key: 2, onClick: (e) => {
                changeSmallPeriod(2, '5分钟')
            }
        },
        {
            text: '15分钟', key: 3, onClick: (e) => {
                changeSmallPeriod(3, '15分钟')
            }
        },
        {
            text: '30分钟', key: 4, onClick: (e) => {
                changeSmallPeriod(4, '30分钟')
            }
        },
        {
            text: '60分钟', key: 5, onClick: (e) => {
                changeSmallPeriod(5, '60分钟')
            }
        },
        {
            text: '1日', key: 6, onClick: (e) => {
                changeSmallPeriod(6, '1日')
            }
        },
        {
            text: '1周', key: 7, onClick: (e) => {
                changeSmallPeriod(7, '1周')
            }
        },
        {
            text: '1月', key: 8, onClick: (e) => {
                changeSmallPeriod(8, '1月')
            }
        },
    ]

    const riskList = [
        {
            text: '按百分比止盈止损', key: 0, onClick: (e) => {
                setRiskIndex(0)
                setVisibleRiskList(false)
            }
        },
        {
            text: '固定tick止盈止损', key: 1, onClick: (e) => {
                setRiskIndex(1)
                setVisibleRiskList(false)
            }
        },
    ]

    const periodList = {
        1: "1分钟",
        2: "5分钟",
        3: "15分钟",
        4: "30分钟",
        5: "1小时",
        6: '1日',
        7: '1周',
        8: '1月'
    }

    useEffect(() => {

        // const hasLocalData = localStorage.getItem('positionData')
        // if (hasLocalData) {
        //     getLocalPositionData()
        // } else {
        //     setLocalPositionData()
        // }

        let strategyStatus = JSON.parse(localStorage.getItem("strategyStatus"))
        if (strategyStatus === 'Running') {
            setstatus(true)
        } else {
            setstatus(false)
        }



        deployStrategyDetail({ strategyId: params.id }).then(res => {
            if (res.code === 200) {
                const { accountId, description, hostingName, initCapital, isOrder, isPublish, isSystemNotice, isWeixinNotice, period, position,
                    risk, strategyName, symbol
                } = res.data
                setDefaultAccount(accountId)
                setDiscribe(description)
                setTrustName(hostingName)
                setCapital(initCapital)
                setisOrder(isOrder === 1 ? 0 : 1)
                setisPublish(isPublish ? true : false)
                setsystemNotice(isSystemNotice ? true : false)
                setweixinNotice(isWeixinNotice ? true : false)
                setPeriod(period)
                setstrategyName(strategyName)
                setsymbol(symbol)
                //风控
                const { riskWay, profit, loss } = risk
                setRiskIndex(riskWay - 1)
                if (riskWay === 1) {
                    setprofitRatio(profit)
                    setlossRatio(loss)
                } else {
                    setprofitTick(profit)
                    setlossTick(loss)
                }
                //仓位
                const { positionType, positionTypeNum, positionTypeRatio } = position
                for (let key in positionIndex) {
                    if (positionIndex[key] === positionType) {
                        setPositionValue(key)
                    }
                }
                if (positionType === 3) {
                    positionData.fixedPositonMulPercent = positionTypeRatio
                } else if (positionType === 4) {
                    positionData.fixedVolume = positionTypeNum
                } else if (positionType === 5) {
                    positionData.initObvPositionMulPercent = positionTypeRatio
                    positionData.observationPeriod = positionTypeNum
                } else if (positionType === 6) {
                    positionData.martinFirstPositonMulPercent = positionTypeRatio
                } else if (positionType === 7) {
                    positionData.antiMartinFirstPositonMulPercent = positionTypeRatio
                }
                setPositionData(positionData)
                localStorage.setItem('positionData_detail', JSON.stringify(positionData))
                localStorage.setItem('positionValue_detail', JSON.stringify(positionValue))
            }
        })
    }, [])

    const setLocalPositionData = () => {
        const positionData = {
            fixedPositonMulPercent: 10, //固定资金比例
            fixedPostionCount: 100, //固定股数
            initObvPositionMulPercent: 0,
            observationPeriod: 10,
            martinFirstPositonMulPercent: 10,
            antiMartinFirstPositonMulPercent: 10,
        }
        const positionValue = 'isFull'
        localStorage.setItem('positionData_detail', JSON.stringify(positionData))
        localStorage.setItem('positionValue_detail', JSON.stringify(positionValue))
    }

    const getLocalPositionData = () => {
        const positionData = JSON.parse(localStorage.getItem('positionData_detail'))
        const positionValue = JSON.parse(localStorage.getItem('positionValue_detail'))
        setPositionData(positionData)
        setPositionValue(positionValue)
    }



    const changeSmallPeriod = (period, periodText) => {
        setPeriod(period)
        setPeriodText(periodText)
        setVisiblePeriodList(false)
    }

    //策略列表
    const getStrategyList = () => {
        const data = {
            name: "",
            pageNum: 1,
            pageSize: 200,
            strategyType: props.marketType === 0 ? '0' : '1'

        }
        strategyList(data).then(res => {
            if (res.data && res.data.list.length > 0) {
                let list = res.data.list.filter(item => item.express)
                props.setMyStrategyList(list)
            }

        })
    }

    const handleOk = () => {

        if (riskIndex === 0) {
            if (!profitRatio) {
                Toast.show({
                    icon: 'fail',
                    content: '清输入止盈百分比',
                })
                return
            }
            if (!lossRatio) {
                Toast.show({
                    icon: 'fail',
                    content: '清输入止损百分比',
                })
                return
            }
        }
        if (riskIndex === 1) {
            if (!profitTick) {
                Toast.show({
                    icon: 'fail',
                    content: '清输入止盈tick数',
                })
                return
            }
            if (!lossTick) {
                Toast.show({
                    icon: 'fail',
                    content: '清输入止损tick数',
                })
                return
            }
        }

        Dialog.confirm({
            content: '确定要修改吗？',
            onConfirm: () => {
                const data = {
                    strategyId: params.id,
                    description: discribe,
                    riskWay: riskIndex + 1,
                    profit: riskIndex === 0 ? Number(profitRatio) : Number(profitTick),
                    loss: riskIndex === 0 ? Number(lossRatio) : Number(lossTick),
                    isWeixinNotice: weixinNotice ? 1 : 0,
                    isSystemNotice: systemNotice ? 1 : 0,
                    isOrder: isOrder === 0 ? 1 : 0,
                    isPublish: isPublish ? 1 : 0,
                }

                Toast.show({
                    icon: 'loading',
                    content: '修改中…',
                    duration: 0,
                    maskClickable: false

                })
                deployStrategyUpdate(data).then(res => {
                    Toast.clear()
                    if (res.code === 200) {
                        Toast.show({
                            icon: 'success',
                            content: '修改成功',
                            duration: 2000,
                        })
                        // setTimeout(() => {
                        //     navigate(-1)
                        // }, 2000)

                    } else {
                        Toast.show({
                            icon: 'fail',
                            content: res.message,
                        })
                    }

                }).catch(err => {
                    Toast.clear()
                })



            },
        })
    }

    const onChangeStatus = () => {
        Dialog.confirm({
            content: status ? '确定要暂停该策略吗？' : '确定要运行该策略吗？',
            onConfirm: () => {
                Toast.show({
                    icon: 'loading',
                    content: '加载中…',
                    duration: 0,
                    maskClickable: false
                })
                if (status) {
                    strategyStop({ id: params.id }).then(res => {
                        Toast.clear()
                        if (res.code === 200) {
                            setstatus(false)
                            localStorage.setItem("strategyStatus", JSON.stringify('Stop'))
                        } else {
                            Toast.show({
                                icon: 'fail',
                                content: res.message,
                            })
                        }

                    }).catch(err => {
                        console.log(err)
                        Toast.clear()
                    })
                } else {
                    strategyRun({ id: params.id }).then(res => {
                        Toast.clear()
                        if (res.code === 200) {
                            setstatus(true)
                            localStorage.setItem("strategyStatus", JSON.stringify('Running'))
                        } else {
                            Toast.show({
                                icon: 'fail',
                                content: res.message,
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                        Toast.clear()
                    })
                }
            }
        })

    }

    const onDelete = () => {
        Dialog.confirm({
            content: "确定要删除该托管的策略吗？",
            onConfirm: () => {
                deleteDeploy({ id: params.id }).then(res => {
                    if (res.code === 200) {
                        Toast.show({
                            icon: 'success',
                            content: '删除成功',
                            duration: 1000,
                        })
                        setTimeout(() => {
                            navigate(-1)
                        }, 1000)
                    } else {
                        Toast.show({
                            icon: 'fail',
                            content: '删除失败',
                        })
                    }
                })
            }
        })
    }

    return (
        <div className="strategy-trust-wrapper">
            <div className="trust-item" >
                <div>交易账户</div>
                <div className="trust-item-value">
                    <span>{defaultAccount}</span>
                    {/* <img src={arrow_icon} className="arrow-icon" alt="" /> */}
                </div>
            </div>
            <div className="trust-item" >
                <div>托管策略</div>
                <div className="trust-item-value">
                    <span>{strategyName}</span>

                </div>
            </div>
            <div className="trust-item" >
                <div>策略频率</div>
                <div className="trust-item-value">
                    <span>{periodList[period]}</span>
                </div>
            </div>
            <ActionSheet
                extra='K线周期'
                cancelText='取消'
                visible={visiblePeriodList}
                actions={periodActions}
                onClose={() => setVisiblePeriodList(false)}
            />

            <div className="trust-item">
                <div>交易标的</div>
                <div className="trust-item-value">
                    <span>{symbol}</span>
                </div>
            </div>
            <div className="trust-item">
                <div>策略资金</div>
                <input type="number" style={{ 'textAlign': 'center' }}
                    value={capital} placeholder="请输入托管资金" onChange={(e) => { setCapital(e.target.value) }} disabled />
            </div>
            <div className="trust-item">
                <div>托管名称</div>
                <input type="text" placeholder="请输入托管名称" value={trustName} onChange={(e) => setTrustName(e.target.value)} disabled />
            </div>

            <ActionSheet
                extra='风控方式'
                cancelText='取消'
                visible={visibleRiskList}
                actions={riskList}
                onClose={() => setVisibleRiskList(false)}
            />

            <div className="trust-item" onClick={() => setVisibleRiskList(true)}>
                <div>风控方式</div>
                <div className="trust-item-value">
                    <span>{riskList[riskIndex].text}</span>
                    <img src={arrow_icon} className="arrow-icon" alt="" />
                </div>
            </div>

            {riskIndex === 0 ?
                <div>
                    <div className="trust-item">
                        <div>止盈百分比</div>
                        <div>
                            <input type="number" value={profitRatio} placeholder="请输入止盈百分比" style={{ 'textAlign': 'right' }}
                                onChange={(e) => setprofitRatio(e.target.value)} />
                            <span style={{ 'marginLeft': 10 }}>%</span>
                        </div>

                    </div>
                    <div className="trust-item">
                        <div>止损百分比</div>
                        <div>
                            <input type="number" value={lossRatio} placeholder="请输入止损百分比" style={{ 'textAlign': 'right' }}
                                onChange={(e) => setlossRatio(e.target.value)} />
                            <span style={{ 'marginLeft': 10 }}>%</span>
                        </div>

                    </div>
                </div> :
                <div>
                    <div className="trust-item">
                        <div>止盈tick数</div>
                        <div>
                            <input type="number" value={profitTick} placeholder="请输入止盈tick数" style={{ 'textAlign': 'center' }}
                                onChange={(e) => setprofitTick(e.target.value)} />

                        </div>

                    </div>
                    <div className="trust-item">
                        <div>止损tick数</div>
                        <div>
                            <input type="text" value={lossTick} placeholder="请输入止损tick数" style={{ 'textAlign': 'center' }}
                                onChange={(e) => setlossTick(e.target.value)} />

                        </div>

                    </div>
                </div>
            }




            <div className="trust-item" onClick={() => navigate('/trade/positionSetDetail')}>
                <div>仓位设置</div>
                <div className="trust-item-value">
                    <span>{positionObj[positionValue]}</span>
                    <img src={arrow_icon} className="arrow-icon" alt="" />
                </div>
            </div>


            <div className="title">托管条件描述</div>
            <textarea className="discribe" placeholder="请输入不超过200个字符" value={discribe} onChange={(e) => setDiscribe(e.target.value)}>

            </textarea>


            <div className="methods" style={{ 'marginTop': 15 }}>
                <div className="method-name">交易方式</div>
                <div className="method-value">
                    <Radio.Group value={isOrder} onChange={(e) => setisOrder(e)}>
                        <Radio style={{ '--font-size': '14px' }} value={0}>跟随下单</Radio>
                        <Radio style={{ '--font-size': '14px' }} value={1}>仅提示交易信号</Radio>
                    </Radio.Group>
                </div>
            </div>

            <div className="methods">
                <div className="method-name">通知方式</div>
                <div className="method-value" style={{ marginBottom: 15 }}>
                    <span>系统通知（免费）</span>
                    <Switch
                        checked={systemNotice}
                        onChange={(e) => setsystemNotice(e)}
                        style={{
                            '--height': '20px',
                            '--width': '40px',
                        }}
                    />
                </div>
                <div className="method-value">
                    <span>微信通知</span>
                    <Switch
                        checked={weixinNotice}
                        onChange={async (e) => {
                            if (e) {
                                const hasSub = await isSubGZH(navigate)
                                if (!hasSub) {
                                    return
                                }
                            }
                            setweixinNotice(e)
                        }}
                        style={{

                            '--height': '20px',
                            '--width': '40px',
                        }}
                    />
                </div>
            </div>

            <div className="methods" style={{ 'marginTop': 15 }}>
                <div className="method-name">发布策略</div>
                <div style={{ marginTop: 10 }}>
                    <Checkbox style={{
                        '--icon-size': '18px',
                        '--font-size': '14px',
                        '--gap': '6px',
                    }}
                        checked={isPublish} onChange={(e) => setisPublish(e)}
                    >将该策略发布到策略排行榜，并允许其他用户进行跟单。允许他人跟单，系统会进行审核，请留意审核通知。</Checkbox>

                </div>
            </div>


            <div className="tips">
                提示：若发布策略，点确定即代表同意<span className="explain">《策略发布说明条款》</span>。策略发布后，将在策略超市中展示。
            </div>

            <div className='btn-list'>
                <div className="edit" onClick={() => handleOk()}>
                    修改
                </div>
                <div className={!status ? "status" : "status stop"} onClick={() => onChangeStatus()}>
                    {!status ? '运行' : '暂停'}
                </div>
                <div className="delete" onClick={() => onDelete()}>
                    删除
                </div>
            </div>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        account: state.traderoom.account,
        accountList: state.traderoom.accountList,
        marketType: state.traderoom.marketType,
        myStrategyList: state.traderoom.myStrategyList,
        strategyIndex: state.traderoom.strategyIndex,
        quote: state.traderoom.quote
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setMyStrategyList: (data) => {
            dispatch(setMyStrategyList(data))
        },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StrategyTrust)