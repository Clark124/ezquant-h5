
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import { Dialog, Radio, ActionSheet, Modal, Button, DatePicker, Toast } from 'antd-mobile-v5'
import arrow_icon from '../../asstes/images/grarrow.png'
import { useEffect, useState } from 'react'
import { strategyList, backTestEdit } from '../../service/strategy'
import { searchCode } from '../../service/index'
import { debounce } from '../../utils/index'
import moment from 'moment'


function StrategyBacktestSet(props) {
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [strategyId, setStrategyId] = useState("")
    const [selectedStrategyId, setSelectedStrategyId] = useState("")
    const [express, setExpress] = useState("")
    const [strategyLists, setStrategyLists] = useState([])
    const [strategyName, setStrategyName] = useState("")
    const [confirmId, setConfirmId] = useState("")
    const [showDialog, setshowDialog] = useState(false)
    const [showDialog1, setshowDialog1] = useState(false)
    const [showDialog2, setshowDialog2] = useState(false)

    const [visiblePeriodList, setVisiblePeriodList] = useState(false)
    const [period, setPeriod] = useState(6)
    const [periodText, setPeriodText] = useState('1日')

    const [codeList, setCodeList] = useState([])
    const [selectedCode, setSelectedCode] = useState({})

    const [startDateValue, setStartDateValue] = useState(moment().subtract(6, 'months').format('YYYY-MM-DD'))
    const [endDateValue, setEndDateValue] = useState(moment().format('YYYY-MM-DD'))
    const [visibleStartDate, setVisibleStartDate] = useState(false)
    const [visibleEndDate, setVisibleEndDate] = useState(false)
    const [capital, setCapital] = useState(100000)


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

    const changeSmallPeriod = (period, periodText) => {
        setPeriod(period)
        setPeriodText(periodText)
        setVisiblePeriodList(false)
    }


    const getMyStrategy = () => {
        let userInfo = localStorage.getItem("userInfo")
        const userId = JSON.parse(userInfo).id
        const data = {
            name: "",
            pageSize: 100,
            pageNum: 1,
            userId,
            strategyType: props.marketType
        }
        strategyList(data).then(res => {
            if (res.retCode === 0) {
                setStrategyLists(res.data.list)
                if (params && params.id) {
                    res.data.list.forEach(item => {
                        if (item.id === Number(params.id)) {
                            setStrategyName(item.name)
                            setSelectedStrategyId(item.id)
                            setConfirmId(item.id)
                            setExpress(item.express)
                        }
                    })
                }
            }
        })
    }

    useEffect(() => {
        if (params && params.id) {
            setStrategyId(params.id)
        }
        getMyStrategy()

    }, [])

    const onConfrimStrategy = () => {

        strategyLists.forEach(item => {
            if (item.id === selectedStrategyId) {
                setStrategyName(item.name)
                setConfirmId(item.id)
                setExpress(item.express)
            }
        })
    }

    const handleSearchStock = value => {

        searchCode({ prodCode: value, findType: props.marketType === 1 ? 2 : 1 }).then(res => {
            if (res.code === 200) {
                let list = res.data.map(item => {
                    return {
                        label: `${item.prodCode} ${item.prodName}`,
                        code: item.prodCode,
                        name: item.prodName
                    }
                })
                setCodeList(list)
            }
        })

    }

    const debounceBtn = debounce(handleSearchStock, 1000)

    const onChangeInput = (value, type) => {
        setPositionData({ ...positionData, [type]: value })
    }

    const onConfirmPosition = () => {

    }
    const onBacktest = () => {
        let search = location.search
        if (!selectedCode.label) {
            Toast.show({
                icon: "fail",
                content: "请选择标的"
            })
            return
        }
        if (!confirmId) {
            Toast.show({
                icon: "fail",
                content: "请选择策略"
            })
            return
        }
        if (!capital) {
            Toast.show({
                icon: "fail",
                content: "请输入初始资金"
            })
            return
        }

        let data = {
            strategyId: confirmId,
            initCapital: Number(capital),
            symbol: selectedCode.code,
            period,
            startDateStr: startDateValue,
            endDateStr: endDateValue,
            express: express,
            backtestType: 1,
            positionType: positionIndex[positionValue],
        }

        if (positionIndex[positionValue] === 3) {
            data.positionTypeRatio = Number(positionData.fixedPositonMulPercent)
        } else if (positionIndex[positionValue] === 6) {
            data.positionTypeRatio = Number(positionData.martinFirstPositonMulPercent)
        } else if (positionIndex[positionValue] === 7) {
            data.positionTypeRatio = Number(positionData.antiMartinFirstPositonMulPercent)
        } else if (positionIndex[positionValue] === 4) {
            data.positionTypeNum = Number(positionData.fixedPostionCount)
        } else if (positionIndex[positionValue] === 5) {
            data.positionTypeRatio = Number(positionData.initObvPositionMulPercent)
            data.positionTypeNum = Number(positionData.observationPeriod)
        }

        console.log(data)
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0
        })
        backTestEdit(data).then((res) => {
            Toast.clear()
            if (res.retCode === 0) {
                if (res.data.backtestList.length > 0) {
                    const id = res.data.backtestList[0].fundKLineName
                    if (search && search.includes('multiple')) {
                        navigate('/backtestList/' + id)
                    } else {
                        localStorage.setItem('positionData',JSON.stringify(positionData))
                        localStorage.setItem('positionValue',JSON.stringify(positionValue))
                        navigate('/backtestReport/' + id)
                    }
                }
            } else {
                Toast.show({
                    icon: "fail",
                    content: res.message,
                })
            }
        }).catch((err) => {
            Toast.clear()
        })
    }




    return (
        <div className="backtest-set-wrapper">
            <div className="title">
                选择策略系统
            </div>
            <div className="set-item" onClick={() => setshowDialog(true)}>
                <div>
                    <span className="set-item-name">策略名称</span>
                    <span>{strategyName}</span>
                </div>
                <img src={arrow_icon} alt="" className="arrow-icon" />
            </div>


            <div className="set-item" onClick={() => setVisiblePeriodList(true)}>
                <div>
                    <span className="set-item-name">K线频率</span>
                    <span>{periodText}</span>
                </div>
                <img src={arrow_icon} alt="" className="arrow-icon" />

            </div>
            <ActionSheet
                extra='K线周期'
                cancelText='取消'
                visible={visiblePeriodList}
                actions={periodActions}
                onClose={() => setVisiblePeriodList(false)}
            />

            <div className="set-item" onClick={() => setshowDialog1(true)}>
                <div>
                    <span className="set-item-name">交易标的</span>
                    <span>{selectedCode.label}</span>
                </div>
                <img src={arrow_icon} alt="" className="arrow-icon" />

            </div>
            <div className="set-item">
                <div>
                    <span className="set-item-name">回测时间</span>
                    <Button
                        onClick={() => {
                            setVisibleStartDate(true)
                        }}
                    >
                        {startDateValue}
                    </Button>
                    <DatePicker
                        visible={visibleStartDate}
                        onClose={() => {
                            setVisibleStartDate(false)
                        }}
                        defaultValue={moment().subtract(6, 'months').toDate()}
                        precision='day'
                        onConfirm={val => {
                            setStartDateValue(moment(val).format('YYYY-MM-DD'))
                        }}
                    />
                    <span style={{ "margin": '0px 5px' }}>~</span>
                    <Button
                        onClick={() => {
                            setVisibleEndDate(true)
                        }}
                    >
                        {endDateValue}
                    </Button>
                    <DatePicker
                        visible={visibleEndDate}
                        onClose={() => {
                            setVisibleEndDate(false)
                        }}
                        defaultValue={moment().toDate()}
                        precision='day'
                        onConfirm={val => {
                            setEndDateValue(moment(val).format('YYYY-MM-DD'))
                        }}
                    />
                </div>
            </div>
            <div className="set-item">
                <div>
                    <span className="set-item-name">初始资金</span>
                    <input type="number" placeholder='请输入初始资金' value={capital} onChange={(e) => setCapital(e.target.value)} className="capital-input" />
                </div>

            </div>

            <div className="set-item" onClick={() => setshowDialog2(true)}>
                <div>
                    <span className="set-item-name">仓位设置</span>
                    <span>{positionObj[positionValue]}</span>
                </div>

                <img src={arrow_icon} className="arrow-icon" alt="" />
            </div>

            <div className="backtext-btn" onClick={onBacktest}>开始回测</div>

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

            <Dialog
                visible={showDialog1}
                title={'搜索'}
                content={(
                    <div className="strategy-modal">
                        <input type="text" placeholder='请输入标的代码' onChange={(e) => debounceBtn(e.target.value)} />
                        <div className='code-list'>
                            {codeList.map((item, index) => {
                                return (
                                    <div className='code-item' key={index} onClick={() => {
                                        setSelectedCode(item)
                                        setshowDialog1(false)
                                    }}>
                                        <span>{item.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                closeOnMaskClick={true}
                closeOnAction
                onClose={() => {
                    setshowDialog1(false)
                }}
                actions={[
                    {
                        key: 'cancel',
                        text: '取消',
                    },
                ]}
            />

            <Modal
                visible={showDialog2}
                title={'仓位设置'}
                content={(
                    <div className='position-set-wrapper'>

                        <div className='position-set-list'>
                            <Radio.Group value={positionValue} onChange={(e) => {
                                setPositionValue(e)
                            }}>
                                <div className='position-set-item'>
                                    <span>全仓</span>
                                    <Radio value={'isFull'} />
                                </div>
                                <div className='position-set-item'>
                                    <span>半仓</span>
                                    <Radio value={'isHalfFull'} />
                                </div>
                                <div className='position-set-item'>
                                    <div>
                                        <span>资金比例(%)：</span>
                                        <input type="number" value={positionData.fixedPositonMulPercent} onChange={(e) => { onChangeInput(e.target.value, 'fixedPositonMulPercent') }}
                                            placeholder="请输入资金比例" className='position-input' />

                                    </div>

                                    <Radio value={'isFixedRate'} />
                                </div>
                                <div className='position-set-item'>
                                    <div>
                                        <span>固定股数：</span>
                                        <input type="number" value={positionData.fixedPostionCount} onChange={(e) => { onChangeInput(e.target.value, 'fixedPostionCount') }}
                                            placeholder="请输入固定股数" className='position-input' />

                                    </div>
                                    <Radio value={'isFixedCount'} />
                                </div>

                                <div className='position-set-item'>
                                    <div>
                                        <div style={{ 'marginBottom': 7 }}>动态凯利：</div>
                                        <div style={{ 'marginBottom': 7 }}>
                                            <span>观察期下单比例(%)：</span>
                                            <input type="number" value={positionData.initObvPositionMulPercent} onChange={(e) => { onChangeInput(e.target.value, 'initObvPositionMulPercent') }}
                                                placeholder="请输入观察期下单比例" className='position-input' />
                                        </div>
                                        <div>
                                            <span>最小观察周期(正整数)：</span>
                                            <input type="number" value={positionData.observationPeriod} onChange={(e) => { onChangeInput(e.target.value, 'observationPeriod') }}
                                                placeholder="请输入最小观察周期" className='position-input' />
                                        </div>
                                    </div>

                                    <Radio value={'isDynamicKelly'} />
                                </div>

                                <div className='position-set-item'>
                                    <div>
                                        <span>马丁加仓 初始仓位(%)：</span>
                                        <input type="number" value={positionData.martinFirstPositonMulPercent} onChange={(e) => { onChangeInput(e.target.value, 'martinFirstPositonMulPercent') }}
                                            placeholder="请输入初始仓位比例" className='position-input' />
                                    </div>
                                    <Radio value={'isMartin'} />
                                </div>

                                <div className='position-set-item'>
                                    <div style={{ "display": 'flex' }}>
                                        <span>反马丁加仓 初始仓位(%)：</span>
                                        <input type="number" value={positionData.antiMartinFirstPositonMulPercent} onChange={(e) => { onChangeInput(e.target.value, 'antiMartinFirstPositonMulPercent') }}
                                            placeholder="请输入初始仓位比例" className='position-input' />
                                    </div>
                                    <Radio value={'isAntiMartin'} />
                                </div>
                            </Radio.Group>
                        </div>
                    </div>
                )}
                closeOnMaskClick={true}
                closeOnAction
                onClose={() => {
                    setshowDialog2(false)
                }}
                actions={[
                    {
                        key: 'confirm',
                        text: '确定',
                        primary: true,
                        onClick: () => {
                            onConfirmPosition()
                        }
                    },

                ]}
                bodyStyle={{
                    width: '100%'
                }}
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        marketType: state.traderoom.marketType,
    };
}
export default connect(mapStateToProps, null)(StrategyBacktestSet)