import { Dialog, Toast, DatePicker, Button } from "antd-mobile-v5"
import { useState, useRef, useEffect } from "react"
import { KChart, splitData, } from '../../../components/stockchart-react-h5'
import { connect } from 'react-redux'
import { onGetNewKline, onGetQuote, changeCode } from '../../Trade/actions'
import { searchCode } from "../../../service"
import { debounce } from '../../../utils'
import moment from 'moment'

import SelectedItem from "./SelectedItem"

function Step2(props) {
    const kchartRef = useRef(null)
    const [showKilne, setshowKilne] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [codeList, setCodeList] = useState([])
    const [visibleStartDate, setVisibleStartDate] = useState(false)
    const [visibleEndDate, setVisibleEndDate] = useState(false)

    const showSimilarKline = () => {
        props.onGetNewKline(props.stockCode, props.period, (stockDate) => {
            initKline(stockDate, props.period)
        })
        props.onGetQuote(props.stockCode)
    }

    useEffect(() => {
        props.selectedList.forEach(item => {
            if (item.value === '相似k线') {
                setshowKilne(true)
                showSimilarKline()
            }
        })

    }, [props.selectedList])

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

    const selectCondition = (item) => {
       
        let hasSelected = false
        props.selectedList.forEach(listItem => {
            if (listItem.pId === item.pId) {
                hasSelected = true
            }
        })
        if (hasSelected) {
            if (item.value === '相似k线') {
                setshowKilne(false)
            }
            let arr = props.selectedList.filter(dataItem => dataItem.pId !== item.pId)
            props.setSelectedList(arr)
        } else {
            if (props.selectedList.length > 10) {
                Toast.show({
                    content: "已选指标不能超过10个"
                })
                return
            }

            if (item.value === '相似k线') {
                let sp = JSON.parse(item.sp)
                sp.forEach(item=>{
                    if(item.name==="prod_code"){
                        item.value = props.stockCode
                    }
                    if(item.name==='period'){
                        item.value = props.period
                    }
                    if(item.name==='start_date'){
                        item.value = moment(props.startDateValue).format('YYYYMMDD')
                    }
                    if(item.name==='end_date'){
                        item.value = moment(props.endDateValue).format('YYYYMMDD')
                    }
                })
                item.sp = JSON.stringify(sp)
                setshowKilne(true)
                showSimilarKline()

            }
            item.regionIndex = -1
            item.inputArr = ""
            props.setSelectedList([...props.selectedList, item])
        }
    }



    const handleSelectStock = (item) => {
        props.onGetQuote(item.code)
        props.changeCode(item.code)
        props.onGetNewKline(item.code, props.period, (stockDate) => {
            initKline(stockDate, props.period)
        })
        let selectedList = JSON.parse(JSON.stringify(props.selectedList))
        selectedList.forEach(data=>{
            if(data.value==='相似k线'){
                let sp = JSON.parse(data.sp)
                sp.forEach(spitem=>{
                  if(spitem.name==='prod_code'){
                      console.log(item.code)
                    spitem.value = item.code
                  }
                })
                data.sp = JSON.stringify(sp)
              }
        })
        props.setSelectedList(selectedList)
        setShowDialog(false)
    }

    const initKline = (data, period, range = [props.startDateValue, props.endDateValue]) => {
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
            startDate = moment(startDate,'YYYYMMDD').add(2, 'days').format('YYYY-MM-DD')
            endDate = moment(endDate,'YYYYMMDD').format('YYYY-MM-DD')
            range = [startDate,endDate]
            props.setStartDateValue(startDate)
        }

        if (!areaRegion[1]) {
            startDate = moment(startDate,'YYYYMMDD').format('YYYY-MM-DD')
            endDate = moment(endDate,'YYYYMMDD').subtract(2, 'days').format('YYYY-MM-DD')
            range = [startDate,endDate]
            props.setStartDateValue(endDate)
        }

        const option = {
            range: range
        }

        if (kchartRef) {
            kchartRef.current.init(values, option, props.quote, period)
        }
    }

    const toNext = () => {
        if (props.selectedList.length === 0) {
            Toast.show({
                icon: "fail",
                content: "请选择指标"
            })
            return
        }

        props.setStepIndex(2)
    }

    const changeSelectItem = (value, index) => {
        props.updateSelectItem(value, index)
    }

    return (
        <>
            <div className="title">
                技术指标
            </div>
            <div className="strategy-indicate-list">
                {props.indicateList.map((item, index) => {
                    let isSelected = false
                    props.selectedList.forEach(list => {
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
                                {props.startDateValue}
                            </Button>
                            <DatePicker
                                visible={visibleStartDate}
                                onClose={() => {
                                    setVisibleStartDate(false)
                                }}
                                defaultValue={moment().subtract(1, 'months').toDate()}
                                precision='day'
                                onConfirm={val => {
                                    props.setStartDateValue(moment(val).format('YYYY-MM-DD'))

                                    let selectedList = JSON.parse(JSON.stringify(props.selectedList))
                                    selectedList.forEach(data=>{
                                        if(data.value==='相似k线'){
                                            let sp = JSON.parse(data.sp)
                                            sp.forEach(spitem=>{
                                              if(spitem.name==='start_date'){
                                                spitem.value = moment(val).format('YYYYMMDD')
                                              }
                                            })
                                            data.sp = JSON.stringify(sp)
                                          }
                                    })
                                    props.setSelectedList(selectedList)

                                    props.onGetNewKline(props.stockCode, props.period, (stockDate) => {
                                        initKline(stockDate, props.period, [moment(val).format('YYYY-MM-DD'), props.endDateValue])
                                    })
                                }}
                            />
                            <span style={{ "margin": '0px 5px' }}>~</span>
                            <Button
                                onClick={() => {
                                    setVisibleEndDate(true)
                                }}
                            >
                                {props.endDateValue}
                            </Button>
                            <DatePicker
                                visible={visibleEndDate}
                                onClose={() => {
                                    setVisibleEndDate(false)
                                }}
                                defaultValue={moment().toDate()}
                                precision='day'
                                onConfirm={val => {
                                    props.setEndDateValue(moment(val).format('YYYY-MM-DD'))

                                    let selectedList = JSON.parse(JSON.stringify(props.selectedList))
                                    selectedList.forEach(data=>{
                                        if(data.value==='相似k线'){
                                            let sp = JSON.parse(data.sp)
                                            sp.forEach(spitem=>{
                                              if(spitem.name==='end_date'){
                                                spitem.value = moment(val).format('YYYYMMDD')
                                              }
                                            })
                                            data.sp = JSON.stringify(sp)
                                          }
                                    })
                                    props.setSelectedList(selectedList)

                                    props.onGetNewKline(props.stockCode, props.period, (stockDate) => {
                                        initKline(stockDate, props.period, [props.startDateValue, moment(val).format('YYYY-MM-DD')])
                                    })
                                }}
                            />
                        </div>
                    </div> : null
            }


            <div className="title" style={{ "marginTop": 20 }}>
                已选指标
            </div>
            <div className="indicate-title">
                <span>指标</span>
                <span className="range">区间</span>
                <span className="custom">自定义</span>
            </div>
            <div className="select-list-wrapper">
                {
                    props.selectedList.map((item, index) => {
                        return (
                            <SelectedItem data={item} key={item.pId}
                                changeSelectItem={(value) => changeSelectItem(value, index)}
                            />
                        )
                    })
                }
            </div>

            <div className="strategy-create-btn-wrapper">
                <div className="next-btn" onClick={() => props.setStepIndex(0)}>
                    上一步
                </div>
                <div className="next-btn" onClick={() => toNext()}>
                    下一步
                </div>
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

        </>
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
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Step2)


