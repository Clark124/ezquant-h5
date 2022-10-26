import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import './index.scss'
import { connect } from 'react-redux'
import { cancelMarket, updateIndicate, setSelectedList, setStartDateValue, setEndDateValue, setPoolList } from "../../actions"
import { Button, DatePicker, ActionSheet, Dialog, Toast } from 'antd-mobile-v5'

import {
    listAllType, listAllTypeById, listSelectMarket, listAllIndustryType, listAllConceptType, listAllRegionalType, listStartSelectStock,
    getPoolList, updatePickStock
} from '../../../../service/pickStock'
import SelectedItem from '../SelectedItem/SelectedItem'
import moment from 'moment'
import { KChart, splitData } from '../../../../components/stockchart-react-h5'
import { onGetNewKline, onGetQuote, changeCode } from '../../../Trade/actions'
import { searchCode } from "../../../../service"
import { listStartSelectStock1 } from '../../../../service/compose'
import { debounce } from '../../../../utils'




function PickStockCreate(props) {
    const getParams = useParams()
    const kchartRef = useRef(null)
    const navigate = useNavigate()
    const [visibleDate, setVisibleDate] = useState(false)
    const [dateValue, setDateValue] = useState(moment().format('YYYY-MM-DD'))
    const [period, setPeriod] = useState(6)
    const [periodText, setPeriodText] = useState('1日')
    const [visiblePeriodList, setVisiblePeriodList] = useState(false)

    const [showKilne, setshowKilne] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [codeList, setCodeList] = useState([])
    const [visibleStartDate, setVisibleStartDate] = useState(false)
    const [visibleEndDate, setVisibleEndDate] = useState(false)
    const [startDateValue, setStartDateValue] = useState(moment().subtract(1, 'months').format('YYYY-MM-DD'))
    const [endDateValue, setEndDateValue] = useState(moment().format('YYYY-MM-DD'))

    const [indicateList, setIndicateList] = useState([])
    const [areaList, setAreaList] = useState([
        { value: '指定市场', key: 'market' },
        { value: '行业市场', key: 'industry' },
        { value: '概念市场', key: 'concept' },
        { value: '地区市场', key: 'area' },
    ])

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


    const showSimilarKline = () => {
        props.onGetNewKline(props.stockCode, props.period, (stockDate) => {
            initKline(stockDate, props.period)
        })
        props.onGetQuote(props.stockCode)
    }


    useEffect(() => {
        let indicates = localStorage.getItem('pickStockIndicates')
        if (indicates) {
            setIndicateList(JSON.parse(indicates))
        } else {
            getInit()
        }
        onGetPoolList()

        let tabs = localStorage.getItem('market')
        if (tabs) {
            setAreaList(JSON.parse(tabs))
        } else {
            getMarket()
        }
        props.indicateArr.forEach(item => {
            if (item.value === '相似k线') {
                setshowKilne(true)
                showSimilarKline()
            }
        })


    }, [])


    const getInit = (callback) => {
        listAllType().then(res => {
            listAllTypeById({ id: 0 }).then(value => {
                let newData = []
                res.forEach(item => {
                    let data = []
                    value.forEach(itemData => {
                        if (item.tId === itemData.tId) {

                            data.push(itemData)
                        }
                    })
                    newData.push({
                        data: data,
                        tId: item.tId,
                        value: item.value
                    })
                })

                let indicates = newData.filter(item => item.tId !== 1)
                setIndicateList(indicates)

                localStorage.setItem('pickStockIndicates', JSON.stringify(indicates))
                if (callback) {
                    callback()
                }
            })
        })
    }

    const getMarket = (callback) => {
        Promise.all([
            listSelectMarket(),
            listAllIndustryType(),
            listAllConceptType(),
            listAllRegionalType(),
        ]).then(result => {
            let tabs = JSON.parse(JSON.stringify(areaList))
            tabs.forEach((item, index) => {
                item.data = result[index]
                item.data.forEach((data, i) => {
                    switch (item.key) {
                        case 'market':
                            data.tId = 7
                            data.name = data.value
                            break
                        case "industry":
                            data.tId = 8
                            break
                        case 'concept':
                            data.tId = 10
                            break
                        default:
                            data.tId = 9
                            break
                    }
                })
            })
            localStorage.setItem('market', JSON.stringify(tabs))
            setAreaList(tabs)

        }).catch(error => {
            console.log(error)
        })
    }

    const navList = (item) => {
        navigate('/pickStockCreate/areaList/' + item.key)
    }

    const onNavIndicateList = (item) => {
        console.log(item)
        if (item.tId === 16) {
            navigate('/pickStockCreate/strategyList')
        } else {
            navigate('/pickStockCreate/indicateList/' + item.tId)
        }

    }

    const cancelMarket = (type, value) => {
        props.cancelMarket({
            type,
            data: value
        })
    }

    const changeSelectItem = (value, index) => {

        props.updateIndicate({ index, value })
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
        let selectedList = JSON.parse(JSON.stringify(props.indicateArr))

        selectedList.forEach(data => {
            if (data.value === '相似k线') {
                let sp = JSON.parse(data.sp)
                sp.forEach(spitem => {
                    if (spitem.name === 'prod_code') {
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
            startDate = moment(startDate, 'YYYYMMDD').add(2, 'days').format('YYYY-MM-DD')
            endDate = moment(endDate, 'YYYYMMDD').format('YYYY-MM-DD')
            range = [startDate, endDate]
            props.setStartDateValue(startDate)
        }

        if (!areaRegion[1]) {
            startDate = moment(startDate, 'YYYYMMDD').format('YYYY-MM-DD')
            endDate = moment(endDate, 'YYYYMMDD').subtract(2, 'days').format('YYYY-MM-DD')
            range = [startDate, endDate]
            props.setEndDateValue(endDate)
        }

        const option = {
            range: range
        }

        if (kchartRef) {
            kchartRef.current.init(values, option, props.quote, period)
        }
    }

    const navPool = () => {
        navigate('/pickStockCreate/poolList')
    }

    //股票池
    const onGetPoolList = () => {
        getPoolList({ pageSize: 100, pageNum: 1 }).then(res => {
            let stkPoolList = res.data.list.filter(item => item.type === 'stk')
            let userInfo = localStorage.getItem('userInfo')
            userInfo = JSON.parse(userInfo)
            stkPoolList.unshift({ id: userInfo.id, name: "自选" })
            props.setPoolList(stkPoolList)
        })
    }

    //点击查看结果
    const navResult = () => {
        const { marketArr, indicateArr, selectedStrategy } = props

        let dataFilter = marketArr.map(item => {
            return {
                tId: item.tId,
                pId: item.pId,
                value: item.tId === 7 ? 1 : item.value,
                isPercent: 0,
            }
        })

        if (indicateArr.length === 0 && !selectedStrategy.express) {
            Dialog.confirm({
                content: '请选择选股条件',
            })
            return
        }
        let arr = indicateArr.map(item => {
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

        dataFilter = [...dataFilter, ...arr]
        console.log(dataFilter)

        let userInfo = localStorage.getItem('userInfo')
        userInfo = JSON.parse(userInfo)

        //组合选股
        if (props.isCompose) {
            let params = {
                mySelectstock: props.poolSelectCode.map(item => item.symbol + " " + item.name).toString(),
                selectCondition: JSON.stringify(dataFilter),
                userId: userInfo.id,
                express: selectedStrategy && selectedStrategy.express ? selectedStrategy.express : "",
                selectType: 1
            }
            Toast.show({
                icon: "loading",
                content: "选股中...",
                duration: 0,
                maskClickable: false
            })
            listStartSelectStock1(params).then(res => {
                localStorage.setItem("composePickStockResult", JSON.stringify(res))
                Toast.clear()

                navigate('/composeCreate/pickResult')
            }).catch(err => {
                Toast.clear()
            })

        } else {//智能选股
            let params = {
                selectStockCondition: JSON.stringify(dataFilter),
                mySelectstock: props.poolSelectCode.map(item => item.symbol + " " + item.name).toString(),
                express: selectedStrategy && selectedStrategy.express ? selectedStrategy.express : "",
                startDate: dateValue.split('-').join(''),
                period: period
            }

            Toast.show({
                icon: "loading",
                content: "加载中...",
                duration: 0,
            })
            listStartSelectStock(params).then(res => {
                Toast.clear()
                if (res.code === 10000) {
                    Toast.show({
                        content: res.msg
                    })
                    return
                }
                localStorage.setItem("pickStockResult", JSON.stringify(res))
                localStorage.setItem("pickStockParams", JSON.stringify(params))
                navigate('/pickStockResult')
            }).catch(err => {
                Toast.clear()
            })
        }



    }

    const onUpdate = () => {
        const { marketArr, indicateArr, selectedStrategy } = props
        let dataFilter = marketArr.map(item => {
            return {
                tId: item.tId,
                pId: item.pId,
                value: item.tId === 7 ? 1 : item.value,
                isPercent: 0,
            }
        })

        if (indicateArr.length === 0 && !selectedStrategy.express) {
            Dialog.confirm({
                content: '请选择选股条件',
            })
            return
        }
        let arr = indicateArr.map(item => {
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

        dataFilter = [...dataFilter, ...arr]
        const pickStockItem = JSON.parse(localStorage.getItem("pickStockItem"))
        let params = {
            id:getParams.id,
            selectName:pickStockItem.selectName,
            selectCondition: JSON.stringify(dataFilter),
            express: selectedStrategy && selectedStrategy.express ? selectedStrategy.express : "",
            period: period
        }

        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0,
        })
        updatePickStock(params).then(res => {
            Toast.clear()
           
            if(res==='sucess'){
                Toast.show({
                    icon:"success",
                    content: '更新成功',
                    afterClose:()=>{
                        navigate(-1)
                    }
                })
            }else{
                Toast.show({
                    icon:"fail",
                    content: '服务端出错'
                })
            }

        }).catch(err => {
            Toast.clear()
            Toast.show({
                icon:"fail",
                content: '服务端出错'
            })
        })

    }

    return (
        <div className="pick-stock-create">
            <div className="title">选股范围</div>
            <div className="market-list">
                {areaList.map((item, index) => {
                    return (
                        <div key={index}
                            className={props[item.key].length > 0 ? 'active' : ''}
                            onClick={() => navList(item)}>{item.value}</div>
                    )
                })}
                <div onClick={() => navPool()} className={props.selectedPoolId.length > 0 ? 'active' : ''}>股票池</div>
            </div>

            <div className='selected-title'>已选范围：(未选择默认未全市场)</div>
            {props.market.length > 0 || props.industry.length > 0 || props.concept.length > 0 || props.area.length > 0 ?
                <div className='selected-market'>
                    {props.market.map((item, index) => {
                        return (
                            <div className='market-item' key={item}>
                                <span>{item}</span>
                                <span className='cancel-btn' onClick={() => cancelMarket('market', item)}>x</span>
                            </div>
                        )
                    })}
                    {props.industry.map((item, index) => {
                        return (
                            <div className='market-item' key={item}>
                                <span>{item}</span>
                                <span className='cancel-btn' onClick={() => cancelMarket('industry', item)}>x</span>
                            </div>
                        )
                    })}
                    {props.concept.map((item, index) => {
                        return (
                            <div className='market-item' key={item}>
                                <span>{item}</span>
                                <span className='cancel-btn' onClick={() => cancelMarket('concept', item)}>x</span>
                            </div>
                        )
                    })}
                    {props.area.map((item, index) => {
                        return (
                            <div className='market-item' key={item}>
                                <span>{item}</span>
                                <span className='cancel-btn' onClick={() => cancelMarket('area', item)}>x</span>
                            </div>
                        )
                    })}
                </div> : null
            }

            <div className="title" style={{ 'marginTop': 30 }}>选股指标</div>

            <div className="market-list">
                {indicateList.map((item, index) => {
                    return (
                        <div key={index}
                            className={(props.indicates[item.value] && props.indicates[item.value].length > 0) || (item.value === '策略选股' && props.selectedStrategyId) ? "active" : ""}
                            onClick={() => onNavIndicateList(item)}>{item.value}</div>
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
                                value={moment(props.startDateValue, 'YYYY-MM-DD').toDate()}
                                precision='day'
                                onConfirm={val => {
                                    props.setStartDateValue(moment(val).format('YYYY-MM-DD'))

                                    let selectedList = JSON.parse(JSON.stringify(props.indicateArr))
                                    selectedList.forEach(data => {
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
                                value={moment(props.endDateValue, 'YYYY-MM-DD').toDate()}
                                precision='day'
                                onConfirm={val => {
                                    props.setEndDateValue(moment(val).format('YYYY-MM-DD'))

                                    let selectedList = JSON.parse(JSON.stringify(props.indicateArr))
                                    selectedList.forEach(data => {
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
                                    props.setSelectedList(selectedList)

                                    props.onGetNewKline(props.stockCode, props.period, (stockDate) => {
                                        initKline(stockDate, props.period, [props.startDateValue, moment(val).format('YYYY-MM-DD')])
                                    })
                                }}
                            />
                        </div>
                    </div> : null
            }

            <div className='selected-title'>已选指标</div>
            <div className='selected-indicate-wrap'>
                <div className="indicate-title">
                    <span>指标</span>
                    <span className="range">区间</span>
                    <span className="custom">自定义</span>
                </div>

                <div className="select-list-wrapper">
                    {
                        props.indicateArr.map((item, index) => {
                            return (
                                <SelectedItem data={item} key={item.pId}
                                    changeSelectItem={(value) => changeSelectItem(value, index)}
                                />
                            )
                        })
                    }
                </div>
            </div>

            {props.isCompose ? null :
                <div className="select-date">
                    <span>选股日期</span>
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
            }

            {props.isCompose ? null :
                <div className="select-date">
                    <span>选股周期</span>
                    <span className="date-picker" onClick={() => setVisiblePeriodList(true)}>{periodText}</span>
                    <ActionSheet
                        extra='K线周期'
                        cancelText='取消'
                        visible={visiblePeriodList}
                        actions={periodActions}
                        onClose={() => setVisiblePeriodList(false)}
                    />
                </div>
            }






            <div className="footer">
                <div className="select-num">已选择{props.indicateArr.length}个条件</div>
                {getParams.id ? <div className='update-btn' onClick={onUpdate}>更新</div> : null}
                <div className="confirm-btn" onClick={() => navResult()}>查看结果</div>
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
        market: state.pickStock.market,
        industry: state.pickStock.industry,
        concept: state.pickStock.concept,
        area: state.pickStock.area,
        indicates: state.pickStock.indicates,
        indicateArr: state.pickStock.indicateArr,
        marketArr: state.pickStock.marketArr,
        selectedStrategy: state.pickStock.selectedStrategy,
        selectedStrategyId: state.pickStock.selectedStrategyId,
        stockCode: state.traderoom.code,
        quote: state.traderoom.quote,
        period: state.traderoom.period,
        startDateValue: state.pickStock.startDateValue,
        endDateValue: state.pickStock.endDateValue,
        selectedPoolId: state.pickStock.selectedPoolId,
        poolSelectCode: state.pickStock.poolSelectCode,

    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        cancelMarket: (data) => {
            dispatch(cancelMarket(data))
        },
        updateIndicate: (data) => {
            dispatch(updateIndicate(data))
        },

        setSelectedList: (data) => {
            dispatch(setSelectedList(data))
        },

        onGetNewKline: (code, period, callback) => {
            dispatch(onGetNewKline(code, period, callback))
        },
        onGetQuote: (code, uuid) => {
            dispatch(onGetQuote(code, uuid))
        },
        changeCode: (code) => {
            dispatch(changeCode(code))
        },
        setStartDateValue: (value) => {
            dispatch(setStartDateValue(value))
        },
        setEndDateValue: (value) => {
            dispatch(setEndDateValue(value))
        },
        setPoolList: (data) => {
            dispatch(setPoolList(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PickStockCreate)