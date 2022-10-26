import { useState, useEffect } from 'react'
import { Switch, Radio, Dialog, ActionSheet, Button, DatePicker, Checkbox, Toast } from 'antd-mobile-v5'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { strategyList } from '../../../../service/strategy'
import { listMyLocalSelectStock, getPoolCodeList, getPoolList, marketScanNew, marketScanDeploy } from '../../../../service/pickStock'
import { searchCode } from '../../../../service/index'
import arrow_icon from '../../../../asstes/images/grarrow.png'
import moment from 'moment'
import './index.scss'
import { debounce } from '../../../../utils/index'

const checkboxStyle = { '--icon-size': '18px', '--font-size': '15px', "marginRight": "10px", "marginBottom": "6px" }


function ScanCreate(props) {
    const navigate = useNavigate()
    const [tabIndex, setTabIndex] = useState(0)
    const [showDialog, setshowDialog] = useState(false)
    const [selectedStrategyId, setSelectedStrategyId] = useState("")
    const [strategyLists, setStrategyLists] = useState([])
    const [confirmId, setConfirmId] = useState("")
    const [express, setExpress] = useState("")
    const [strategyName, setStrategyName] = useState("请选择")

    const [conditionList, setConditionList] = useState([])
    const [showDialog1, setshowDialog1] = useState(false)
    const [selectedConditionId, setSelectedConditionId] = useState("")
    const [confirmConditionId, setConfirmConditionId] = useState("")
    const [conditionParams, setConditionParams] = useState("")
    const [conditionName, setConditionName] = useState("请选择")

    const [visiblePeriodList, setVisiblePeriodList] = useState(false)
    const [period, setPeriod] = useState(6)
    const [periodText, setPeriodText] = useState('1日')

    const [scanName, setScanName] = useState('')
    const [visibleDate, setVisibleDate] = useState(false)
    const [dateValue, setDateValue] = useState(moment().format('YYYY-MM-DD'))

    const [marketIndex, setMarketIndex] = useState(0)
    const [selectMarket, setSelectMarket] = useState([])
    const [futuresOptions, setfuturesOptions] = useState(1)

    const [showDialog2, setshowDialog2] = useState(false)
    const [codeList, setCodeList] = useState([])
    const [selectCode, setSelectCode] = useState([])
    const [selectPoolValue, setselectPoolValue] = useState([])
    const [stkPoolList, setStkPoolList] = useState([])
    const [futPoolList, setFutPoolList] = useState([])

    const [userId, setUserId] = useState("")

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



    const handleSearchStock = value => {

        searchCode({ prodCode: value, findType: props.marketType === 1 ? 2 : 1 }).then(res => {
            if (res.code === 200) {
                let list = res.data.map(item => {
                    return {
                        label: `${item.prodCode} ${item.prodName}`,
                        code: item.prodCode,
                        name: item.prodName,
                        symbol: item.prodCode,
                    }
                })
                setCodeList(list)
            }
        })

    }

    const debounceBtn = debounce(handleSearchStock, 1000)

    const changeSmallPeriod = (period, periodText) => {
        setPeriod(period)
        setPeriodText(periodText)
        setVisiblePeriodList(false)
    }

    useEffect(() => {
        getMyStrategy()
        getConditionList()
        onGetPoolList()
        const id = JSON.parse(localStorage.getItem('userInfo')).id
        setUserId(id)
    }, [])

    //股票池列表
    const onGetPoolList = () => {
        getPoolList({ pageSize: 200, pageNum: 1 }).then(res => {
            let stkPoolList = res.data.list.filter(item => item.type === 'stk')
            let futPoolList = res.data.list.filter(item => item.type === 'fut')
            setStkPoolList(stkPoolList)
            setFutPoolList(futPoolList)
        })
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

            }
        })
    }

    const getConditionList = () => {
        let id = localStorage.userInfo ? JSON.parse(localStorage.userInfo).id : ''
        listMyLocalSelectStock({ id }).then(res => {
            setConditionList(res)
        })
    }


    const onConfrimStrategy = () => {
        strategyLists.forEach(item => {
            if (item.id === selectedStrategyId) {
                setStrategyName(item.name)
                setConfirmId(item.id)
                setExpress(item.express)
            }
        })
    }

    const onConfirmCondition = () => {
        conditionList.forEach(item => {
            if (item.id === selectedConditionId) {
                setConditionName(item.selectName)
                setConfirmConditionId(item.id)
                setConditionParams(item.selectCondition)
            }
        })
    }

    const handeCancelCode = (index) => {
        let arr = JSON.parse(JSON.stringify(selectCode))
        arr.splice(index, 1);
        setSelectCode(arr)
    }

    const selectPool = (e) => {
        const data = {
            pageSize: 1000,
            pageNum: 1,
            refId: e.join(',')
        }
        getPoolCodeList(data).then(res => {
            let list = res.data.list
            if (props.marketType === 0) {
                list = list.filter(item => item.type === 'stk')
            } else {
                list = list.filter(item => item.type === 'fut')
            }
            setSelectCode([...list])
        })

        setselectPoolValue(e)
    }

    const handleConfirm = (type) => {

        if (!confirmId && tabIndex === 0) {
            Dialog.confirm({
                title: "提示",
                content: "请选择一个策略"
            })
            return

        }
        if (!confirmConditionId && tabIndex === 1) {

            Dialog.confirm({
                title: "提示",
                content: "请选择选股条件"
            })
            return
        }

        let target = ""
        if (props.marketType === 0) {
            target = marketIndex === 0 ? selectMarket.toString() : selectCode.map(item => item.symbol).toString();
        } else {
            target = marketIndex === 0 ? futuresOptions.toString() : selectCode.map(item => item.symbol).toString();
        }

        if (target === '' || selectMarket === '') {
            Dialog.confirm({
                title: "提示",
                content: "请先选择扫描范围"
            })
            return
        }


        let data = {
            scanName: scanName,
            scanType: props.marketType === 0 ? 1 : 2,
            period,
            strategyScanDate: moment(dateValue, 'YYYY-MM-DD').format('YYYYMMDD'),
            userId: userId,
        }

        //扫描条件
        if (tabIndex === 0) {
            //策略
            data.scanconditionStrategy = express ? express : ''
        } else {
            data.scanconditionSelectstock = conditionParams
        }


        if (marketIndex === 0) {
            if (props.marketType === 0) {
                data.marketType = selectMarket.toString()
            } else {
                data.futuresSeleteType = futuresOptions.toString()
            }
        } else {
            data.mySelectstock = selectCode.map(item => item.symbol + " " + item.name).toString();
        }


        //扫描 或者 托管
        let fun
        if (type === 'marketscan') {
            fun = marketScanNew
        } else {
            fun = marketScanDeploy
        }

        Toast.show({
            icon: "loading",
            content: type === 'marketscan' ? '扫描中,请耐心等待' : '托管中...',
            duration: 0
        })


        fun(data).then(res => {
            Toast.clear()
            if (res.code === 200) {
                if (type === 'marketscan') {
                    localStorage.setItem('scanResult', JSON.stringify(res.data))
                    // localStorage.setItem('selectStockParam', JSON.stringify({ params: [], date: moment(date, 'YYYY-MM-DD').format('YYYYMMDD') }))
                    navigate('/scanResult/123')
                } else {
                    Toast.show({
                        icon: "success",
                        content: '托管成功',
                        afterClose:()=>{
                            navigate('/stockpick/1')
                        }
                    })
                }
            } else {
                Toast.show({
                    icon: "fail",
                    content: res.message
                })
            }
        }).catch(err => {
            Toast.clear()
        })

    }

    // const handleConfirm = () => {
    //     navigate('/scanResult/123')
    // }


    return (
        <div className="scan-create-wrapper">
            <div className="title">选择扫描条件</div>
            <div className="market-list">
                <div className={tabIndex === 0 ? 'active' : ''} onClick={() => setTabIndex(0)}>策略</div>
                <div className={tabIndex === 1 ? 'active' : ''} onClick={() => setTabIndex(1)}>选股条件</div>
            </div>

            {tabIndex === 0 ?
                <>
                    <div className="title">选择策略</div>
                    <div className="set-item" onClick={() => setshowDialog(true)}>
                        <div>
                            <span>{strategyName}</span>
                        </div>
                        <img src={arrow_icon} alt="" className="arrow-icon" />
                    </div>

                </> :
                <>

                    <div className="title">选择选股条件</div>
                    <div className="set-item" onClick={() => setshowDialog1(true)}>
                        <div>
                            <span>{conditionName}</span>
                        </div>
                        <img src={arrow_icon} alt="" className="arrow-icon" />
                    </div>
                </>
            }


            <div className="title">扫描K线频率</div>
            <div className="set-item" onClick={() => setVisiblePeriodList(true)}>
                <div>
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


            <div className="title">扫描范围</div>
            <div className="market-radio">
                <Radio.Group
                    value={marketIndex}
                    onChange={val => {
                        setMarketIndex(val)
                    }}
                >
                    <div className='market-item'>
                        <Radio value={0} style={{ '--font-size': '16px' }}>指定市场</Radio>
                        <div style={{ "marginTop": "10px" }}>
                            <Checkbox.Group
                                value={selectMarket}
                                onChange={val => {
                                    setSelectMarket(val)
                                }}
                                disabled={marketIndex === 0 ? false : true}
                            >
                                <Checkbox value={58} style={checkboxStyle}>全市场</Checkbox>
                                <Checkbox value={54} style={checkboxStyle}>上海A股</Checkbox>
                                <Checkbox value={55} style={checkboxStyle}>深圳A股</Checkbox>
                                <Checkbox value={57} style={checkboxStyle}>中小板</Checkbox>
                                <Checkbox value={56} style={checkboxStyle}>创业板</Checkbox>
                            </Checkbox.Group>
                        </div>
                    </div>
                    <div className='market-item'>
                        <Radio value={1} style={{ '--font-size': '16px' }}>指定个股</Radio>
                        <div style={{ "marginTop": "10px" }}>
                            <div className='search-btn' onClick={() => setshowDialog2(true)}>搜索标的</div>
                        </div>

                        <div className='has-selected-code-title'>股票池:</div>
                        <div style={{ "marginTop": "10px" }}>
                            <Checkbox.Group onChange={selectPool} value={selectPoolValue} disabled={marketIndex === 1 ? false : true}>
                                <Checkbox value={userId} style={checkboxStyle}>自选</Checkbox>
                                {props.marketType === 0 && stkPoolList.map((item => {
                                    return <Checkbox value={item.id} style={checkboxStyle} key={item.id}>{item.name}</Checkbox>
                                }))}
                                {props.marketType === 1 && futPoolList.map((item => {
                                    return <Checkbox value={item.id} style={checkboxStyle} key={item.id}>{item.name}</Checkbox>
                                }))}
                            </Checkbox.Group>
                        </div>


                        <div className='has-selected-code-title'>已选标的:</div>
                        <div className='has-selected-code' style={selectCode.length === 0 ? { "display": "none" } : null}>
                            {selectCode.map((item, index) => {
                                return (
                                    <div key={index} className="selected-code">
                                        <span >{item.name}</span>
                                        <span className='cancel-code-btn' onClick={() => handeCancelCode(index)}>X</span>
                                    </div>

                                )
                            })}

                        </div>
                    </div>

                </Radio.Group>


            </div>

            <div className='scan-name'>
                <span className='text'>扫描名称:</span>
                <input type="text" placeholder='请输入扫描名称' onChange={(e) => setScanName(e.target.value)} value={scanName} />
            </div>

            <div className='scan-name'>
                <span className='text'>选择日期:</span>
                <Button
                    onClick={() => {
                        setVisibleDate(true)
                    }}
                    style={{ 'marginLeft': "20px" }}
                >
                    {dateValue}
                </Button>
                <DatePicker
                    visible={visibleDate}
                    onClose={() => {
                        setVisibleDate(false)
                    }}
                    defaultValue={moment().toDate()}
                    precision='day'
                    onConfirm={val => {
                        setDateValue(moment(val).format('YYYY-MM-DD'))
                    }}
                />

            </div>
            <div className='footer'>
                <div className="scan-create-confirm-btn" onClick={() => handleConfirm('marketscan')}>确定</div>
                <div className="scan-create-confirm-btn deploy" onClick={() => handleConfirm('deploy')}>托管</div>
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

            <Dialog
                visible={showDialog1}
                title={'选股条件'}
                content={(
                    <div className="strategy-modal">
                        <div className="strategy-list">
                            <Radio.Group
                                value={selectedConditionId}
                                onChange={val => {
                                    setSelectedConditionId(val)
                                }}
                            >
                                {conditionList.map((item, index) => {
                                    return (
                                        <div className="strategy-item" key={item.id}>
                                            <div>{item.selectName}</div>
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
                    setshowDialog1(false)
                }}
                actions={[
                    {
                        key: 'confirm',
                        text: '确定',
                        primary: true,
                        onClick: () => {
                            onConfirmCondition()
                        }
                    },
                    {
                        key: 'cancel',
                        text: '取消',
                    },
                ]}
            />

            <Dialog
                visible={showDialog2}
                title={'搜索'}
                content={(
                    <div className="strategy-modal">
                        <input type="text" className='search-input' placeholder='请输入标的代码' onChange={(e) => debounceBtn(e.target.value)} />
                        <div className='code-list'>
                            {codeList.map((item, index) => {
                                return (
                                    <div className='code-item' key={index} onClick={() => {

                                        if (selectCode.filter(selecteditem => selecteditem.symbol === item.symbol).length > 0) return;

                                        setSelectCode([...selectCode, item])
                                        setshowDialog2(false)

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
                    setshowDialog2(false)
                }}
                actions={[
                    {
                        key: 'confirm',
                        text: '确定',
                        primary: true,
                    },
                ]}
            />


        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        marketType: state.traderoom.marketType,
    };
}
export default connect(mapStateToProps, null)(ScanCreate)