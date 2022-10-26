import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Radio, Stepper, Checkbox, Switch, ActionSheet, Dialog, Modal, Toast } from 'antd-mobile-v5'
import { connect } from 'react-redux'
import { strategyList, defaultAccount as defaultAccountFuc, accountList } from '../../service/traderoom'
import { queryStrategyReport, subscribeStrategy } from '../../service/strategy'
import { isSubGZH } from '../../utils'

import './index.scss'
import arrow_icon from '../../asstes/images/grarrow.png'

import { changePeriod, setMyStrategyList, setStrategyIndex, setCurrentAccountId, setAccountList, updateTrustData } from '../Trade/actions'

const positionObj = {
    'isFull': '全仓',
    'isHalfFull': '半仓',
    'isFixedRate': '固定仓位',
    'isFixedCount': '固定手数',
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
    const params = useParams()
    const navigate = useNavigate()
    const [defaultAccount, setDefaultAccount] = useState({ tradeAccount: "", describe: "" })
    const [visiblePeriodList, setVisiblePeriodList] = useState(false)

    const [visibleRiskList, setVisibleRiskList] = useState(false)

    const [positionValue, setPositionValue] = useState('isFull')
    const [positionData, setPositionData] = useState({
        isFull: true, //是否全仓
        fullPositonMulPercent: 100,
        isFixedRate: false,
        fixedPositonMulPercent: 10, //固定资金比例
        fixedPostionCount: 100, //固定股数
        isDynamicKelly: false,
        initObvPositionMulPercent: 0,
        observationPeriod: 10,
        isMartin: false,
        martinFirstPositonMulPercent: 10,
        isAntiMartin: false,
        antiMartinFirstPositonMulPercent: 10,
    })


    const [reportData, setReportData] = useState({})


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
                props.updateTrustData({ type: "riskIndex", value: 0 })
                setVisibleRiskList(false)
            }
        },
        {
            text: '固定tick止盈止损', key: 1, onClick: (e) => {
                props.updateTrustData({ type: "riskIndex", value: 1 })
                setVisibleRiskList(false)
            }
        },
    ]

    useEffect(async () => {

        getDefaultAccount((id) => {
            getAccountList(id)
        })
        // await getStrategyList()
        getInit()
        const hasLocalData = localStorage.getItem('positionData')
        if (hasLocalData) {
            getLocalPositionData()
        } else {
            setLocalPositionData()
        }
    }, [])

    const getInit = () => {
        let strategyReport = localStorage.getItem("followParams")
        strategyReport = JSON.parse(strategyReport)
        let period = ""
        if (strategyReport.period === 1) {
            period = '分时'
        } else if (strategyReport.period === 2) {
            period = '5分钟'
        } else if (strategyReport.period === 3) {
            period = '15分钟'
        } else if (strategyReport.period === 4) {
            period = '30分钟'
        } else if (strategyReport.period === 5) {
            period = '60分钟'
        } else if (strategyReport.period === 6) {
            period = '1日'
        } else if (strategyReport.period === 7) {
            period = '1周'
        } else if (strategyReport.period === 8) {
            period = '1月'
        }
        props.updateTrustData({ type: 'period', value: strategyReport.period })
        props.updateTrustData({ type: 'periodText', value: period })
        // props.updateTrustData({ type: 'capital', value: strategyReport.initCapital })
        setReportData(strategyReport)
    }
    //获取账号
    const getDefaultAccount = (callback) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const data = {
            userId: userInfo.id,
            accountType: props.marketType
        }
        defaultAccountFuc(data).then(res => {
            const account = res.data
            const userId = account.tradeAccount
            const brokerId = account.coding
            const accountData = {
                'ctp.userId': userId,
                'ctp.brokerId': brokerId,
            }
            props.setCurrentAccountId(userId)
            if (callback) {
                callback(userId)
            }

        })
    }

    //获取账户列表
    const getAccountList = (defaultId) => {
        accountList().then(res => {
            let result = res.data
            const { marketType } = props
            if (marketType === 0) {
                result = result.filter(item => item.accountType === 0)
            } else {
                result = result.filter(item => item.accountType === 1)
            }

            result.forEach((item => {
                if (item.tradeAccount === defaultId) {
                    setDefaultAccount(item)
                }
            }))
        })
    }

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
        localStorage.setItem('positionData', JSON.stringify(positionData))
        localStorage.setItem('positionValue', JSON.stringify(positionValue))
    }

    const getLocalPositionData = () => {
        const positionData = JSON.parse(localStorage.getItem('positionData'))
        const positionValue = JSON.parse(localStorage.getItem('positionValue'))
        setPositionData(positionData)
        setPositionValue(positionValue)
    }

    const changeSmallPeriod = (period, periodText) => {
        props.updateTrustData({ type: 'period', value: period })
        props.updateTrustData({ type: 'periodText', value: periodText })
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
        return new Promise((resolve, reject) => {
            strategyList(data).then(res => {
                if (res.data && res.data.list.length > 0) {
                    let list = res.data.list.filter(item => item.express)
                    props.setMyStrategyList(list)
                    resolve()
                }
            })
        })

    }

    const handleOk = () => {

        if (!props.trustData.trustName.trim()) {
            Modal.alert({
                content: '请输入托管名称',
                closeOnMaskClick: true,
            })
            return
        }

        Dialog.confirm({
            title: '确定要跟单吗？',
            content: "每当您收到一条交易通知，系统化会从您的积分账户扣除10积分",
            onConfirm: () => {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'))
                const { trustName, discribe, capital, period, riskIndex, profitRatio, profitTick, lossRatio, lossTick,
                    weixinNotice, systemNotice, isOrder, isPublish
                } = props.trustData
                const data = {
                    userId: userInfo.id,
                    accountId: defaultAccount.tradeAccount,
                    symbol: reportData.symbol,
                    hostingName: trustName,
                    description: discribe,
                    initCapital: Number(capital),
                    period: period,
                    positionType: positionIndex[positionValue],
                    riskWay: riskIndex + 1,
                    profit: riskIndex === 0 ? Number(profitRatio) : Number(profitTick),
                    loss: riskIndex === 0 ? Number(lossRatio) : Number(lossTick),
                    isWeixinNotice: weixinNotice ? 1 : 0,
                    isSystemNotice: systemNotice ? 1 : 0,
                    isOrder: isOrder,
                    isPublish: isPublish ? 1 : 0,
                    earlyNotice: 5,
                    otherStrategyId: params.id
                }

                if (positionIndex[positionValue] === 3) {
                    data.positionTypeRatio = Number(positionData.fixedPositonMulPercent)
                } else if (positionIndex[positionValue] === 6) {
                    data.positionTypeRatio = Number(positionData.martinFirstPositonMulPercent)
                } else if (positionIndex[positionValue] === 7) {
                    data.positionTypeRatio = Number(positionData.antiMartinFirstPositonMulPercent)
                } else if (positionIndex[positionValue] === 4) {
                    if (Number(positionData.fixedPostionCount) % 100 !== 0 && props.marketType === 0) {
                        Modal.alert({
                            content: '固定仓位股数必须为100的整数倍',
                            closeOnMaskClick: true,
                        })
                        return
                    }
                    data.positionTypeNum = Number(positionData.fixedPostionCount)
                } else if (positionIndex[positionValue] === 5) {
                    data.positionTypeRatio = Number(positionData.initObvPositionMulPercent)
                    data.positionTypeNum = Number(positionData.observationPeriod)
                }

                console.log(data)

                Toast.show({
                    icon: 'loading',
                    content: '跟单中…',
                    duration: 0,
                    maskClickable: false,
                })
                subscribeStrategy(data,).then(res => {
                    Toast.clear()
                    if (res.code === 200) {
                        Toast.show({
                            icon: 'success',
                            content: '跟单成功',
                            afterClose: () => {
                                navigate(-1)
                            }
                        })
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

    return (
        <div className="strategy-trust-wrapper">
            <div className="trust-item" >
                <div>交易账户</div>
                <div className="trust-item-value">
                    <span>{defaultAccount.tradeAccount}({defaultAccount.describe})</span>
                    <img src={arrow_icon} className="arrow-icon" alt="" />
                </div>
            </div>
            <div className="trust-item" >
                <div>跟单策略</div>
                <div className="trust-item-value">
                    <span>{reportData.hostingName}</span>
                    {/* <img src={arrow_icon} className="arrow-icon" alt="" /> */}
                </div>
            </div>
            <div className="trust-item" onClick={() => setVisiblePeriodList(true)}>
                <div>策略频率</div>
                <div className="trust-item-value">
                    <span>{props.trustData.periodText}</span>
                    <img src={arrow_icon} className="arrow-icon" alt="" />
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
                    <span>{reportData.symbol}</span>
                </div>
            </div>
            <div className="trust-item">
                <div>策略资金</div>
                <input type="number" style={{ 'textAlign': 'center' }}
                    value={props.trustData.capital} placeholder="请输入托管资金" onChange={(e) => { props.updateTrustData({ type: 'capital', value: e.target.value }) }} />
            </div>
            <div className="trust-item">
                <div>托管名称</div>
                <input type="text" placeholder="请输入托管名称" value={props.trustData.trustName} onChange={(e) => props.updateTrustData({ type: 'trustName', value: e.target.value })} />
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
                    <span>{riskList[props.trustData.riskIndex].text}</span>
                    <img src={arrow_icon} className="arrow-icon" alt="" />
                </div>
            </div>

            {props.trustData.riskIndex === 0 ?
                <div>
                    <div className="trust-item">
                        <div>止盈百分比</div>
                        <div>
                            <input type="number" value={props.trustData.profitRatio} placeholder="请输入止盈百分比" style={{ 'textAlign': 'right' }}
                                onChange={(e) => props.updateTrustData({ type: 'profitRatio', value: e.target.value })} />
                            <span style={{ 'marginLeft': 10 }}>%</span>
                        </div>

                    </div>
                    <div className="trust-item">
                        <div>止损百分比</div>
                        <div>
                            <input type="number" value={props.trustData.lossRatio} placeholder="请输入止损百分比" style={{ 'textAlign': 'right' }}
                                onChange={(e) => props.updateTrustData({ type: 'lossRatio', value: e.target.value })} />
                            <span style={{ 'marginLeft': 10 }}>%</span>
                        </div>

                    </div>
                </div> :
                <div>
                    <div className="trust-item">
                        <div>止盈tick数</div>
                        <div>
                            <input type="number" value={props.trustData.profitTick} placeholder="请输入止盈tick数" style={{ 'textAlign': 'center' }}
                                onChange={(e) => props.updateTrustData({ type: 'profitTick', value: e.target.value })} />

                        </div>

                    </div>
                    <div className="trust-item">
                        <div>止损tick数</div>
                        <div>
                            <input type="text" value={props.trustData.lossTick} placeholder="请输入止损tick数" style={{ 'textAlign': 'center' }}
                                onChange={(e) => props.updateTrustData({ type: 'lossTick', value: e.target.value })} />

                        </div>

                    </div>
                </div>
            }




            <div className="trust-item" onClick={() => navigate('/trade/positionSet')}>
                <div>仓位设置</div>
                <div className="trust-item-value">
                    <span>{positionObj[positionValue]}</span>
                    <img src={arrow_icon} className="arrow-icon" alt="" />
                </div>
            </div>


            <div className="title">托管条件描述</div>
            <textarea className="discribe" placeholder="请输入不超过200个字符" value={props.trustData.discribe} onChange={(e) => props.updateTrustData({ type: 'discribe', value: e.target.value })}>

            </textarea>


            <div className="methods" style={{ 'marginTop': 15 }}>
                <div className="method-name">交易方式</div>
                <div className="method-value">
                    <Radio.Group value={props.trustData.isOrder} onChange={(e) => props.updateTrustData({ type: 'isOrder', value: e })}>
                        <Radio style={{ '--font-size': '14px' }} value={0}>仅提示交易信号</Radio>
                        <Radio style={{ '--font-size': '14px' }} value={1}>跟随下单</Radio>
                    </Radio.Group>
                </div>
            </div>

            <div className="methods">
                <div className="method-name">通知方式</div>
                <div className="method-value" style={{ marginBottom: 15 }}>
                    <span>系统通知（免费）</span>
                    <Switch
                        checked={props.trustData.systemNotice}
                        onChange={(e) => props.updateTrustData({ type: 'systemNotice', value: e })}
                        style={{
                            '--height': '20px',
                            '--width': '40px',
                        }}
                    />
                </div>
                <div className="method-value">
                    <span>微信通知</span>
                    <Switch
                        checked={props.trustData.weixinNotice}
                        onChange={async (e) => {
                            if (e) {
                                const hasSub = await isSubGZH(navigate)
                                if (!hasSub) {
                                    return
                                }
                            }
                            props.updateTrustData({ type: 'weixinNotice', value: e })
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
                <div style={{ marginTop: 10, alignItems: "flex-start" }}>
                    <Checkbox style={{
                        '--icon-size': '18px',
                        '--font-size': '14px',
                        '--gap': '6px',
                    }}
                        checked={props.trustData.isPublish} onChange={(e) => props.updateTrustData({ type: 'isPublish', value: e })}
                    >将该策略发布到策略排行榜，并允许其他用户进行跟单。允许他人跟单，系统会进行审核，请留意审核通知。</Checkbox>

                </div>
            </div>


            <div className="tips">
                提示：若发布策略，点确定即代表同意<span className="explain">《策略发布说明条款》</span>。策略发布后，将在策略超市中展示。
            </div>

            <div className="confirm-btn" onClick={() => handleOk()}>
                跟单
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
        quote: state.traderoom.quote,
        trustData: state.traderoom.trustData
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setMyStrategyList: (data) => {
            dispatch(setMyStrategyList(data))
        },
        setStrategyIndex: (data) => {
            dispatch(setStrategyIndex(data))
        },
        setCurrentAccountId: (data) => {
            dispatch(setCurrentAccountId(data))
        },

        onSetAccountList: (data) => {
            dispatch(setAccountList(data))
        },
        updateTrustData: (data) => {
            dispatch(updateTrustData(data))
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StrategyTrust)