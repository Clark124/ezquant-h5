
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './index.scss'
import arrow_icon from '../../../../asstes/images/grarrow.png'
import { onePriorityCondition, twoPriorityCondition, listUserStrategy, tradeSettingNext } from '../../../../service/compose'
import { ActionSheet, Dialog, Radio, Toast } from 'antd-mobile-v5'
import { connect } from 'react-redux';
import { changeTradeSetValue } from '../../actions'

function ComposeTradeSet(props) {
    let navigate = useNavigate();
    const [oneBuyList, setOneBuyList] = useState([])
    // const [firstConditionValue, setFirstConditionValue] = useState({})
    const [visibleOneBuyList, setVisibleOneBuyList] = useState(false)

    const [twoBuyList, setTwoBuyList] = useState([])
    // const [secondConditionValue, setSecondConditionValue] = useState({})
    const [visibleTwoBuyList, setVisibleTwoBuyList] = useState(false)


    const [selectedStrategyId, setSelectedStrategyId] = useState("")
    const [strategyLists, setStrategyLists] = useState([])
    // const [confirmId, setConfirmId] = useState("")
    // const [express, setExpress] = useState("")
    // const [strategyName, setStrategyName] = useState("请选择")
    // const [params, setParams] = useState("")

    // const [maxStockNum, setMaxStockNum] = useState(100)
    // const [singlStockBuyRatio, setSinglStockBuyRatio] = useState(100)
    // const [singlStockMaxPositionRatio, setSinglStockMaxPositionRatio] = useState(100)
    // const [singlCountBuyRatio, setSinglCountBuyRatio] = useState(100)
    // const [singlCountSellRatio, setSinglCountSellRatio] = useState(100)

    const [showDialog, setshowDialog] = useState(false)

    const [visiblePeriodList, setVisiblePeriodList] = useState(false)
    // const [period, setPeriod] = useState(720)
    const [periodText, setPeriodText] = useState('1天')

    const [visibleTimeList, setVisibleTimeList] = useState(false)
    // const [timeValue, setTimeValue] = useState('15:00')
    // const [timeText, setTimeText] = useState('15:00')


    const periodActions = [
        {
            text: '15分钟', key: 15, onClick: (e) => {
                changeSmallPeriod(15, '15分钟')
            }
        },
        {
            text: '30分钟', key: 30, onClick: (e) => {
                changeSmallPeriod(30, '30分钟')
            }
        },
        {
            text: '60分钟', key: 60, onClick: (e) => {
                changeSmallPeriod(60, '60分钟')
            }
        },
        {
            text: '1天', key: 720, onClick: (e) => {
                changeSmallPeriod(720, '1天')
            }
        },
    ]

    const periodList = {
        15:"15分钟",
        30:"30分钟",
        60:"60分钟",
        720:"1天",
    }
    const changeSmallPeriod = (period, periodText) => {
        props.changeTradeSetValue({ type: 'period', value: period })
        props.changeTradeSetValue({ type: 'periodText', value: periodText })
        setVisiblePeriodList(false)
    }

    const executionTime = [
        { label: '9:30', value: '9:30' },
        { label: '9:45', value: '9:45' },
        { label: '10:00', value: '10:00' },
        { label: '10:30', value: '10:30' },
        { label: '11:00', value: '11:00' },
        { label: '13:30', value: '13:30' },
        { label: '14:00', value: '14:00' },
        { label: '14:30', value: '14:30' },
        { label: '14:45', value: '14:45' },
        { label: '15:00', value: '15:00' }
    ]
    const timeActions = executionTime.map((item) => {
        return {
            text: item.value, key: item.value, onClick: (e) => {
                changeSmallTime(item.value, item.value)
            }
        }
    })

    const changeSmallTime = (value) => {
        props.changeTradeSetValue({ type: 'timeValue', value: value })
        setVisibleTimeList(false)
    }


    useEffect(() => {
        getInit()
    }, [])

    const getInit = async () => {
        // let { step2Params } = this.state;
        let userInfo = JSON.parse(localStorage.userInfo);
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0,
            maskClickable: false
        })
        let res = await onePriorityCondition();
        let res2 = await twoPriorityCondition();
        let res3 = await listUserStrategy({ id: userInfo.id, pageSize: 50, pageNum: 1, strategyType: 0 });
        if (res && res.length > 0) {
            let arr = res.map((item) => {
                return {
                    text: item.value, key: item.id, onClick: (e) => {
                        props.changeTradeSetValue({ type: 'firstConditionValue', value: item })
                        setVisibleOneBuyList(false)
                    }
                }
            })

            setOneBuyList(arr)
        }
        if (res2 && res2.length > 0) {
            let arr = res2.map((item) => {
                return {
                    text: item.value, key: item.id, onClick: (e) => {
                        props.changeTradeSetValue({ type: 'secondConditionValue', value: item })
                        setVisibleTwoBuyList(false)
                    }
                }
            })
            setTwoBuyList(arr)
        }
        if (res3) {
            setStrategyLists(res3.data.list)
        }
        //复原
        if (props.tradeSet.firstConditionValue.id) {
            res.forEach(item => {
                if (item.id === props.tradeSet.firstConditionValue.id) {
                    props.changeTradeSetValue({ type: 'firstConditionValue', value: item })
                }
            })
        } else {
            props.changeTradeSetValue({ type: 'firstConditionValue', value: res[0] })
        }

        if (props.tradeSet.secondConditionValue.id) {
            res2.forEach(item => {
                if (item.id === props.tradeSet.secondConditionValue.id) {
                    props.changeTradeSetValue({ type: 'secondConditionValue', value: item })
                }
            })
        } else {
            props.changeTradeSetValue({ type: 'secondConditionValue', value: res2[0] })
        }
        if (props.tradeSet.strategy.strategyName !== '请选择') {
            res3.data.list.forEach(item => {
                if (item.name === props.tradeSet.strategy.strategyName) {
                    props.changeTradeSetValue({
                        type: 'strategy', value: {
                            strategyName: item.name,
                            confirmId: item.id,
                            express: item.express,
                            params: item.params
                        }
                    })
                }
            })
        }
        props.changeTradeSetValue({ type: 'periodText', value: periodList[props.tradeSet.period] })

        Toast.clear()

    }

    const onConfrimStrategy = () => {
        strategyLists.forEach(item => {
            if (item.id === selectedStrategyId) {
                props.changeTradeSetValue({
                    type: 'strategy', value: {
                        strategyName: item.name,
                        confirmId: item.id,
                        express: item.express,
                        params: item.params
                    }
                })
                // setStrategyName(item.name)
                // setConfirmId(item.id)
                // setExpress(item.express)
                // setParams(item.params)
            }
        })
    }

    const goNext = () => {
        if (
            Number(props.tradeSet.singlStockBuyRatio) > 100 ||
            Number(props.tradeSet.singlStockBuyRatio) <= 0 ||
            Number(props.tradeSet.singlStockMaxPositionRatio) > 100 ||
            Number(props.tradeSet.singlStockMaxPositionRatio) <= 0 ||
            Number(props.tradeSet.singlCountBuyRatio) > 100 ||
            Number(props.tradeSet.singlCountBuyRatio) <= 0 ||
            Number(props.tradeSet.singlCountSellRatio) > 100 ||
            Number(props.tradeSet.singlCountSellRatio) <= 0
        ) {
            Toast.show({
                icon: "fail",
                content: "比例需在0到100之间"
            })
            return
        }

        if (Number(props.tradeSet.maxStockNum) <= 0 && Number(props.tradeSet.maxStockNum) % 1 !== 0) {
            Toast.show({
                icon: "fail",
                content: "持股数量必须为正整数"
            })
            return
        }

        if (!props.tradeSet.strategy.confirmId) {
            Toast.show({
                icon: "fail",
                content: "请先选择一个策略"
            })
            return
        }

        let userInfo = JSON.parse(localStorage.userInfo);
        let userId = userInfo.id

        const data = {
            userId,
            onePriorityCondition: props.tradeSet.firstConditionValue.id,
            twoPriorityCondition: props.tradeSet.secondConditionValue.id,
            maxStockNum: Number(props.tradeSet.maxStockNum),
            singlCountBuyRatio: Number(props.tradeSet.singlCountBuyRatio),
            singlCountSellRatio: Number(props.tradeSet.singlCountSellRatio),
            singlStockBuyRatio: Number(props.tradeSet.singlStockBuyRatio),
            singlStockMaxPositionRatio: Number(props.tradeSet.singlStockMaxPositionRatio),
            strategyName: props.tradeSet.strategy.strategyName,
            scripting: props.tradeSet.strategy.express,
            parameter: props.tradeSet.strategy.params,
            execFrequency: props.tradeSet.period,
            execTime: props.tradeSet.timeValue
        }
        console.log(data)
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0,
            maskClickable: false
        })
        tradeSettingNext(data).then(res => {
            Toast.clear()
            if (res === 'second_step_tradeSetting finish') {
                navigate('/composeCreate/selectTime')
            }
        }).catch(err => {
            Toast.clear()
        })


    }


    return (
        <div className="compose-trade-set-wrapper">
            <div className="main-title">2.交易设置</div>
            <div className="trade-set-wrapper">
                <div className="set-item" onClick={() => setVisibleOneBuyList(true)}>
                    <div>一级优先买入条件：</div>
                    <div className="set-item-right">
                        <span>{props.tradeSet.firstConditionValue.value}</span>
                        <img src={arrow_icon} alt="" />
                    </div>
                </div>
                <ActionSheet
                    extra='一级优先买入条件：'
                    cancelText='取消'
                    visible={visibleOneBuyList}
                    actions={oneBuyList}
                    onClose={() => setVisibleOneBuyList(false)}
                />
                <div className="set-item" onClick={() => setVisibleTwoBuyList(true)}>
                    <div>二级优先买入条件：</div>
                    <div className="set-item-right">
                        <span>{props.tradeSet.secondConditionValue.value}</span>
                        <img src={arrow_icon} alt="" />
                    </div>
                </div>
                <ActionSheet
                    extra='二级优先买入条件：'
                    cancelText='取消'
                    visible={visibleTwoBuyList}
                    actions={twoBuyList}
                    onClose={() => setVisibleTwoBuyList(false)}
                />
                <div className="set-item">
                    <div>最大持股数量：</div>
                    <input type="number" value={props.tradeSet.maxStockNum}
                        onChange={(e) => { props.changeTradeSetValue({ type: 'maxStockNum', value: e.target.value }) }} className="input-value" style={{ marginRight: 18 }} />
                </div>

                <div className="set-item">
                    <div>个股默认买入比例：</div>
                    <div>
                        <input type="number" value={props.tradeSet.singlStockBuyRatio}
                            onChange={(e) => { props.changeTradeSetValue({ type: 'singlStockBuyRatio', value: e.target.value }) }} className="input-value" /><span style={{ marginLeft: 5 }}>%</span>
                    </div>

                </div>

                <div className="set-item">
                    <div>个股最大持仓比例：</div>
                    <div>
                        <input type="number" value={props.tradeSet.singlStockMaxPositionRatio}
                            onChange={(e) => { props.changeTradeSetValue({ type: 'singlStockMaxPositionRatio', value: e.target.value }) }} className="input-value" /><span style={{ marginLeft: 5 }}>%</span>
                    </div>
                </div>
                <div className="set-item">
                    <div>单次买入比例不超过：</div>
                    <div>
                        <input type="number" value={props.tradeSet.singlCountBuyRatio}
                            onChange={(e) => { props.changeTradeSetValue({ type: 'singlCountBuyRatio', value: e.target.value }) }} className="input-value" /><span style={{ marginLeft: 5 }}>%</span>
                    </div>

                </div>
                <div className="set-item">
                    <div>单次卖出比例不超过：</div>
                    <div>
                        <input type="number" value={props.tradeSet.singlCountSellRatio}
                            onChange={(e) => { props.changeTradeSetValue({ type: 'singlCountSellRatio', value: e.target.value }) }} className="input-value" /><span style={{ marginLeft: 5 }}>%</span>
                    </div>
                </div>
            </div>

            <div className='trade-set-wrapper'>
                <div className="set-item" onClick={() => setshowDialog(true)} style={{ "paddingBottom": 0 }}>
                    <div>选择策略：</div>
                    <div className="set-item-right">
                        <span style={props.tradeSet.strategy.strategyName==='请选择'?{color:"gray"}:{}}>{props.tradeSet.strategy.strategyName}</span>
                        <img src={arrow_icon} alt="" />
                    </div>
                </div>
            </div>




            <div className="trade-set-wrapper">
                <div className="set-item" onClick={() => setVisiblePeriodList(true)}>
                    <div>策略执行频率：</div>
                    <div className="set-item-right">
                        <span>{props.tradeSet.periodText}</span>
                        <img src={arrow_icon} alt="" />
                    </div>
                </div>
                <div className="set-item" onClick={() => setVisibleTimeList(true)}>
                    <div>执行时间：</div>
                    <div className="set-item-right">
                        <span>{props.tradeSet.timeValue}</span>
                        <img src={arrow_icon} alt="" />
                    </div>
                </div>
            </div>

            <ActionSheet
                extra='策略执行频率'
                cancelText='取消'
                visible={visiblePeriodList}
                actions={periodActions}
                onClose={() => setVisiblePeriodList(false)}
            />

            <ActionSheet
                extra='执行时间'
                cancelText='取消'
                visible={visibleTimeList}
                actions={timeActions}
                onClose={() => setVisibleTimeList(false)}
            />


            <div className="trade-set-btn">
                <div onClick={() => {
                    navigate(-1)
                }}>上一步</div>
                <div onClick={goNext}>下一步</div>
            </div>

            <Dialog
                visible={showDialog}
                title={'我的策略'}
                content={(
                    <div className="strategy-modal">

                        <div className="strategy-list">
                            <Radio.Group
                                value={selectedStrategyId}
                                onChange={val => {
                                    setSelectedStrategyId(val)
                                }}
                            >
                                {strategyLists.map((item, index) => {
                                    return (
                                        <div className="strategy-item" key={item.id}>
                                            <div>{item.name}</div>
                                            <Radio value={item.id}></Radio>
                                        </div>
                                    )
                                })}
                            </Radio.Group>
                        </div>
                    </div>
                )}
                closeOnMaskClick={true}
                closeOnAction
                onClose={() => {
                    setshowDialog(false)
                }}
                actions={[
                    {
                        key: 'confirm',
                        text: '确定',
                        primary: true,
                        onClick: () => {
                            onConfrimStrategy()
                        }
                    },
                    {
                        key: 'cancel',
                        text: '取消',
                    },
                ]}
            />

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        tradeSet: state.compose.tradeSet,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeTradeSetValue: (data) => {
            dispatch(changeTradeSetValue(data))
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ComposeTradeSet)