
import { useState, useEffect, useRef } from 'react';
import { Radio, Toast, ActionSheet, DatePicker, Button, Dialog } from 'antd-mobile-v5'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import arrow_icon from '../../../../asstes/images/grarrow.png'

import { selectTimeNext } from '../../../../service/compose'
import { listAllTypeById } from '../../../../service/pickStock'
import { searchCode } from '../../../../service'
import moment from 'moment'
import SelectedItem from '../../../StrategtyCreate/Component/SelectedItem'

import { onGetNewKline, onGetQuote, changeCode } from '../../../Trade/actions'
import { KChart, splitData, } from '../../../../components/stockchart-react-h5'
import { debounce } from '../../../../utils/index'
import { changeSelectTimeValue } from '../../actions'

import './index.scss'
function SelectTime(props) {
    let navigate = useNavigate();
    const kchartRef = useRef(null)

    const [visible1, setVisible1] = useState(false)
    const [visible2, setVisible2] = useState(false)

    const [indicateList, setIndicateList] = useState([])

    const [startDateValue, setStartDateValue] = useState(moment().subtract(1, 'months').format('YYYY-MM-DD'))
    const [endDateValue, setEndDateValue] = useState(moment().format('YYYY-MM-DD'))
    const [showKilne, setshowKilne] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [codeList, setCodeList] = useState([])
    const [visibleStartDate, setVisibleStartDate] = useState(false)
    const [visibleEndDate, setVisibleEndDate] = useState(false)


    const actions1 = [
        {
            text: '任一', key: 1, onClick: (e) => {
                props.changeSelectTimeValue({ type: 'actionOneValue', value: { text: '任一', value: 1 } })
                setVisible1(false)
            },
        },
        {
            text: '全部', key: -1, onClick: (e) => {
                props.changeSelectTimeValue({ type: 'actionOneValue', value: { text: '全部', value: -1 } })
                setVisible1(false)
            },
        }
    ]

    const actions2 = [
        {
            text: '空仓', key: 0, onClick: (e) => {
                props.changeSelectTimeValue({ type: 'actioTwoValue', value: { text: '空仓', value: 0 } })
                setVisible2(false)
            },
        },
        {
            text: '30%', key: 30, onClick: (e) => {
                props.changeSelectTimeValue({ type: 'actioTwoValue', value: { text: '30%', value: 30 } })
                setVisible2(false)
            },
        },
        {
            text: '50%', key: 50, onClick: (e) => {
                props.changeSelectTimeValue({ type: 'actioTwoValue', value: { text: '50%', value: 50 } })
                setVisible2(false)
            },
        },
    ]



    useEffect(() => {
        getIndicateList()
    }, [])

    const getIndicateList = () => {
        listAllTypeById({ id: 0 }).then(res => {
            let dataList = res.filter(item => item.tId === 6)
            dataList = dataList.filter(item => item.value !== '相似k线')
            setIndicateList(dataList)
        })
    }

    const selectCondition = (item) => {
        // console.log(item)
        let hasSelected = false
        props.selectTime.selectedList.forEach(listItem => {
            if (listItem.pId === item.pId) {
                hasSelected = true
            }
        })
        if (hasSelected) {
            if (item.value === '相似k线') {
                setshowKilne(false)
            }
            let arr = props.selectTime.selectedList.filter(dataItem => dataItem.pId !== item.pId)
            props.changeSelectTimeValue({ type: 'selectedList', value: arr })

        } else {
            if (props.selectTime.selectedList.length > 10) {
                Toast.show({
                    content: "已选指标不能超过10个"
                })
                return
            }

            if (item.value === '相似k线') {
                let sp = JSON.parse(item.sp)
                sp.forEach(item => {
                    if (item.name === "prod_code") {
                        item.value = props.stockCode
                    }
                    if (item.name === 'period') {
                        item.value = props.period
                    }
                    if (item.name === 'start_date') {
                        item.value = moment(startDateValue).format('YYYYMMDD')
                    }
                    if (item.name === 'end_date') {
                        item.value = moment(endDateValue).format('YYYYMMDD')
                    }
                })
                item.sp = JSON.stringify(sp)
                setshowKilne(true)
                showSimilarKline()

            }
            item.regionIndex = -1
            item.inputArr = ""
            props.changeSelectTimeValue({ type: 'selectedList', value: [...props.selectTime.selectedList, item] })
        }
    }

    const showSimilarKline = () => {
        props.onGetNewKline(props.stockCode, props.period, (stockDate) => {
            initKline(stockDate, props.period)
        })
        props.onGetQuote(props.stockCode)
    }

    const changeSelectItem = (value, index) => {

        let arr = JSON.parse(JSON.stringify(props.selectTime.selectedList))
        arr[index] = value
        props.changeSelectTimeValue({ type: 'selectedList', value: arr })
    }


    const goNext = () => {

        let userInfo = JSON.parse(localStorage.userInfo);
        let userId = userInfo.id



        let params = {}
        if (props.selectTime.isEnable === 0) {
            params = { isEnable: 0, userId }
        } else {
            let technical = props.selectTime.selectedList
            console.log(technical)
            if(technical.length<1){
                Toast.show({
                    icon: "fail",
                    content: "请选择择时指标",
                })
                return
            }
            technical = technical.map(item => {
                let parameter = '', value = item.inputArr.join('~');
                if (item.sp) {
                    parameter = JSON.parse(item.sp).map(item => item.value).join(',')
                }

                if (item.region && JSON.parse(item.region).length === 1 && JSON.parse(item.region)[0].value === '~') {
                    //disbable的值
                    value = ''
                }

                if (item.compareSign === '=') {
                    value = item.defalutValue
                }

                let result = {
                    tId: item.tId,
                    pId: item.pId,
                    value: value,
                    sp: parameter,
                    operator: '~',
                    type: 1
                }
                if (item.regionIndex > -1) {
                    result.selectOptions = JSON.parse(item.region)[item.regionIndex].value
                }

                return result
            })

            params = {
                closePostionRatio: props.selectTime.actioTwoValue.value,
                isEnable: 1,
                userId,
                count: props.selectTime.actionOneValue.value === -1 ? technical.length : props.selectTime.actionOneValue.value,
                indicators: JSON.stringify(technical),
            }
        }

        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0,
            maskClickable: false
        })
        selectTimeNext({
            ...params,
        }).then(res => {
            Toast.clear()
            if (res === 'third_step_selecttimesetting finish') {
                navigate('/composeCreate/riskControl')
            }

        }).catch(err => {
            Toast.clear()
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
            } else {
                setCodeList([])
            }
        })
    }

    const debounceBtn = debounce(handleSearchStock, 1000)

    const handleSelectStock = (item) => {
        props.onGetQuote(item.code)
        props.changeCode(item.code)
        props.onGetNewKline(item.code, props.period, (stockDate) => {
            initKline(stockDate, props.period)
        })
        let selectedLists = JSON.parse(JSON.stringify(props.selectTime.selectedList))

        selectedLists.forEach(data => {
            if (data.value === '相似k线') {
                let sp = JSON.parse(data.sp)
                sp.forEach(spitem => {
                    if (spitem.name === 'prod_code') {
                        console.log(item.code)
                        spitem.value = item.code
                    }
                })
                data.sp = JSON.stringify(sp)
            }
        })
        props.changeSelectTimeValue({ type: 'selectedList', value: selectedLists })
        setShowDialog(false)
    }

    const initKline = (data, period, range = [startDateValue, endDateValue]) => {
        let values = splitData(data)
        let areaRegion = []
        let startDate = Number(moment(range[0], 'YYYY-MM-DD').format('YYYYMMDD'))
        let endDate = Number(moment(range[1], 'YYYY-MM-DD').format('YYYYMMDD'))
        values.categoryData.forEach((item, index) => {
            if (item === startDate) {
                areaRegion[0] = index
            }
            if (item === endDate) {
                areaRegion[1] = index
            }
        })

        if (!areaRegion[0]) {
            startDate = moment(startDate, 'YYYYMMDD').add(2, 'days').format('YYYY-MM-DD')
            endDate = moment(endDate, 'YYYYMMDD').format('YYYY-MM-DD')
            range = [startDate, endDate]
            setStartDateValue(startDate)
        }

        if (!areaRegion[1]) {
            startDate = moment(startDate, 'YYYYMMDD').format('YYYY-MM-DD')
            endDate = moment(endDate, 'YYYYMMDD').subtract(2, 'days').format('YYYY-MM-DD')
            range = [startDate, endDate]
            setEndDateValue(endDate)
        }

        const option = {
            range: range
        }

        if (kchartRef) {
            kchartRef.current.init(values, option, props.quote, period)
        }
    }


    return (
        <div className="select-time-wrapper">
            <div className="main-title">3.大盘择时</div>
            <div className="content">
                <Radio.Group onChange={(e) => {
                    props.changeSelectTimeValue({ type: 'isEnable', value: e })
                }} value={props.selectTime.isEnable}>
                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                        <Radio value={0} style={{ '--font-size': '14px' }}>不择时</Radio>
                        <Radio value={1} style={{ '--font-size': '14px' }}>使用指标择时</Radio>
                    </div>

                </Radio.Group>
            </div>

            {props.selectTime.isEnable === 1 ?
                <div className="select-time-indicate">
                    <div className="set-item" onClick={() => setVisible1(true)}>
                        <div>同时满足：</div>
                        <div className="set-item-right">
                            <span style={{ marginRight: 10, color: "#083AEF" }}>{props.selectTime.actionOneValue.text}</span>

                            <span>条件时由牛变熊</span>
                            <img src={arrow_icon} alt="" />
                        </div>
                    </div>
                    <ActionSheet
                        extra='同时满足：'
                        cancelText='取消'
                        visible={visible1}
                        actions={actions1}
                        onClose={() => setVisible1(false)}
                    />


                    <div className="set-item" onClick={() => setVisible2(true)}>
                        <div>熊市仓位：</div>
                        <div className="set-item-right">
                            <span>{props.selectTime.actioTwoValue.text}</span>
                            <img src={arrow_icon} alt="" />
                        </div>
                    </div>
                    <ActionSheet
                        extra='熊市仓位'
                        cancelText='取消'
                        visible={visible2}
                        actions={actions2}
                        onClose={() => setVisible2(false)}
                    />
                </div> : null
            }
            {props.selectTime.isEnable === 1 ?
                <div className="">
                    <div style={{ marginBottom: 10, fontSize: 15, }}>择时指标</div>
                    <div className="strategy-indicate-list">
                        {indicateList.map((item, index) => {
                            let isSelected = false
                            props.selectTime.selectedList.forEach(list => {
                                if (list.pId === item.pId) {
                                    isSelected = true
                                }
                            })
                            return (
                                <span key={item.pId} onClick={() => selectCondition(item)}
                                    className={isSelected ? "active" : ""}
                                >{item.value}</span>
                            )
                        })}

                    </div>
                    {
                        showKilne ?
                            <div className="similar-kline">
                                <div className="quote-wrapper">
                                    <span className="code-name">{props.quote.prod_name}({props.quote.prod_code})</span>
                                    <span className={props.quote.px_change_rate >= 0 ? "last-price" : "last-price green"}>{props.quote.last_px}</span>
                                    <span className={props.quote.px_change_rate >= 0 ? "change-rate" : "change-rate green"}>{props.quote.px_change_rate}%</span>
                                    <span className="show-dialog" onClick={() => setShowDialog(true)}>更换股票</span>
                                </div>
                                <KChart ref={kchartRef} />

                                <div className="select-date">
                                    <span>K线日期：</span>
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
                                        defaultValue={moment().subtract(1, 'months').toDate()}
                                        precision='day'
                                        onConfirm={val => {
                                            setStartDateValue(moment(val).format('YYYY-MM-DD'))

                                            let selectedLists = JSON.parse(JSON.stringify(props.selectTime.selectedList))
                                            selectedLists.forEach(data => {
                                                if (data.value === '相似k线') {
                                                    let sp = JSON.parse(data.sp)
                                                    sp.forEach(spitem => {
                                                        if (spitem.name === 'start_date') {
                                                            spitem.value = moment(val).format('YYYYMMDD')
                                                        }
                                                    })
                                                    data.sp = JSON.stringify(sp)
                                                }
                                            })
                                            props.changeSelectTimeValue({ type: 'selectedList', value: selectedLists })


                                            props.onGetNewKline(props.stockCode, props.period, (stockDate) => {
                                                initKline(stockDate, props.period, [moment(val).format('YYYY-MM-DD'), endDateValue])
                                            })
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

                                            let selectedLists = JSON.parse(JSON.stringify(props.selectTime.selectedList))
                                            selectedLists.forEach(data => {
                                                if (data.value === '相似k线') {
                                                    let sp = JSON.parse(data.sp)
                                                    sp.forEach(spitem => {
                                                        if (spitem.name === 'end_date') {
                                                            spitem.value = moment(val).format('YYYYMMDD')
                                                        }
                                                    })
                                                    data.sp = JSON.stringify(sp)
                                                }
                                            })

                                            props.changeSelectTimeValue({ type: 'selectedList', value: selectedLists })

                                            props.onGetNewKline(props.stockCode, props.period, (stockDate) => {
                                                initKline(stockDate, props.period, [startDateValue, moment(val).format('YYYY-MM-DD')])
                                            })
                                        }}
                                    />
                                </div>
                            </div> : null
                    }


                    <div style={{ marginBottom: 10, fontSize: 15, }}>已选指标</div>
                    <div className="indicate-title">
                        <span>指标</span>
                        <span className="range">区间</span>
                        <span className="custom">自定义</span>
                    </div>
                    <div className="select-list-wrapper">
                        {
                            props.selectTime.selectedList.map((item, index) => {
                                return (
                                    <SelectedItem data={item} key={item.pId}
                                        changeSelectItem={(value) => changeSelectItem(value, index)}
                                    />
                                )
                            })
                        }
                    </div>

                </div> : null
            }

            <div className="footer-btn">
                <div onClick={() => {
                    navigate(-1)
                }}>上一步</div>
                <div onClick={() => {
                    goNext()

                }}>下一步</div>
            </div>

            <Dialog
                visible={showDialog}
                title={'搜索股票'}
                content={(
                    <div className="search-modal">
                        <input type="text" placeholder="请输入股票号" onChange={(e) => debounceBtn(e.target.value)} />
                        <div className="code-list">
                            {codeList.map((item, index) => {
                                return (
                                    <div className="symbol-item" onClick={() => { handleSelectStock(item) }} key={item.code}>
                                        <div><span className="symbol-name">{item.name}</span><span className="symbol-code">{item.code}</span></div>

                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                closeOnMaskClick={true}
                closeOnAction
                onClose={() => {
                    setShowDialog(false)
                }}
            />

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        stockCode: state.traderoom.code,
        quote: state.traderoom.quote,
        stockDate: state.traderoom.stockDate,
        period: state.traderoom.period,
        randomString: state.traderoom.randomString,
        favorList: state.traderoom.favList,
        marketType: state.traderoom.marketType,
        selectTime: state.compose.selectTime
    };
}

const mapDispatchToProps = (dispatch) => {
    return {

        onGetNewKline: (code, period, callback) => {
            dispatch(onGetNewKline(code, period, callback))
        },
        onGetQuote: (code, uuid) => {
            dispatch(onGetQuote(code, uuid))
        },
        changeCode: (code) => {
            dispatch(changeCode(code))
        },
        changeSelectTimeValue: (data) => {
            dispatch(changeSelectTimeValue(data))
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(SelectTime)

