import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    onGetKline, onGetQuote, changeQuoteData, setAccount, onGetNewKline, changePeriod,
    changeFav, setAccountList, setCurrentAccountId, changeChartType, setCurrentPosition, updateTrustData
} from '../../actions'
import moment from 'moment'

import { KChart, splitData, splitDataMin, klineTestData, minTestData, MinChart } from '../../../../components/stockchart-react-h5'
import './index.scss'
import edit_icon from '../../images/bj.png'
import arrow_icon from '../../images/xl.png'
import search_icon from '../../../../asstes/images/ssuo.png'
import { ActionSheet, Dialog, Toast } from 'antd-mobile-v5'
import { wsHost, wsCtpHost } from '../../../../utils/index'
import {
    defaultAccount, getAccountFund, favorList, deleteFavor, addFavor, runStrategy, optimalStrategyList, backtestSignal,
    accountList, currentPositionList, backtestOptimalSignal, startegyDetail, followListFunc
} from '../../../../service/traderoom'

import { deleteFollow, strategyStop, strategyRun } from '../../../../service/strategy'

let tabIndex = 1
let pageWillNone = false
let isFirstCome = true

function Traderoom(props) {
    const navigate = useNavigate()

    const [periodList, setPeriodList] = useState([{ label: "分时", value: 1 }, { label: "日K", value: 6 }, { label: "周K", value: 7 },
    { label: "月K", value: 8 }])

    let defaultTabIndex = 1
    let defaultMoreText = '更多'

    if (props.period === 1) {
        if (props.isMinChart) {
            defaultTabIndex = 0
            tabIndex = 0
        } else {
            defaultTabIndex = 4
            tabIndex = 4
            defaultMoreText = '1分钟'
        }

    } else if (props.period === 6) {
        defaultTabIndex = 1
        tabIndex = 1
    } else if (props.period === 7) {
        defaultTabIndex = 2
        tabIndex = 2
    } else if (props.period === 8) {
        defaultTabIndex = 3
        tabIndex = 3
    } else if (props.period === 2) {
        defaultTabIndex = 4
        tabIndex = 4
        defaultMoreText = '5分钟'
    } else if (props.period === 3) {
        defaultTabIndex = 4
        tabIndex = 4
        defaultMoreText = '15分钟'
    } else if (props.period === 4) {
        defaultTabIndex = 4
        tabIndex = 4
        defaultMoreText = '30分钟'
    } else if (props.period === 5) {
        defaultTabIndex = 4
        tabIndex = 4
        defaultMoreText = '60分钟'
    }


    const [periodIndex, setPeriodIndex] = useState(defaultTabIndex)
    const [strategyTabs,] = useState(['最优', '运行', '跟单',])
    const [strategyTabIndex, setStrategyTabIndex] = useState(0)

    const [visibleMore, setVisibleMore] = useState(false)
    const [visiblePeriodList, setVisiblePeriodList] = useState(false)
    const [uuid, setUuid] = useState("")
    const [moreText, setMoreText] = useState(defaultMoreText)
    const [favorId, setFavorId] = useState("")
    const [isFavor, setIsFavor] = useState(false)
    const [strategyList, seStrategyList] = useState([])  //策略列表
    const [optimalList, setOptimalList] = useState([])
    const [followList, setFollowList] = useState([])
    const [backtestIndex, setBacktestIndex] = useState(0)

    window.socket = null

    const kchartRef = useRef(null)
    const minChartRef = useRef(null)

    const moreActions = [

        {
            text: '交易账户', key: 'account', onClick: (e) => {
                navigate('/accountList')
            }
        },
        {
            text: '托管', key: 'order', onClick: (e) => {
                console.log(e)
                navigate('/trade/trust')
                props.updateTrustData({ type: "trustName", value: "" })
            }
        },
    ]
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
    ]



    useEffect(() => {
        pageWillNone = false
        isFirstCome = true
        props.onGetQuote(props.stockCode)

        if (tabIndex === 0) {
            props.onGetNewKline(props.stockCode, props.period, (stockDate) => {
                let currentDate = moment(new Date()).format('YYYYMMDD')
                let dataIndex = 0
                stockDate.forEach((item, index) => {
                    if (item[0].toString().includes(currentDate + '0931')) {
                        dataIndex = index
                    }
                })
                if (dataIndex > 0) {
                    initMinLine(stockDate.slice(dataIndex))
                } else {
                    initMinLine([])
                }
            })
        } else {
            props.onGetNewKline(props.stockCode, props.period, (stockDate) => {
                initKline(stockDate, props.period)
            })
        }

        getFavorList()
        testWebSocket()

        getDefaultAccount((id, account) => {
            onTcpWebSocket(account)
            getAccountList(id)
        })

        onOptimalStrategyList(props.period, (result) => {
            if (result.length > 0) {
                onBacktestOptimal(result[0])
            }
        })
        return () => {
            pageWillNone = true
        }
    }, [])

    const onTcpWebSocket = (account) => {
        if (window.tcpSocket) {
            return
            window.tcpSocket.close()
            window.tcpSocket = null
        }
        window.tcpSocket = new WebSocket(`${wsCtpHost}/ctpwebsocket`);
        // Connection opened
        window.tcpSocket.addEventListener('open', (event) => {
            console.log('TCP链接成功')
        });

        // Listen for messages
        window.tcpSocket.addEventListener('message', (event) => {
            const data = event.data
            // console.log(data)
            if (data.indexOf("uuid") === 1) {
                const uuid = data.split(':')[1].replace(/"/g, '')
                const datas = {
                    msgType: 1,
                    uuid: uuid,
                    userId: account.tradeAccount,
                    brokerId: account.coding
                }
                window.tcpSocket.send(JSON.stringify(datas));

            } else {
                const ret = JSON.parse(data)
                if (ret.StatusMsg && ret.StatusMsg !== '未成交') {
                    Toast.show({
                        title: "系统提示",
                        icon: "success",
                        content: ret.StatusMsg,
                    })
                }

                if (ret.ErrorMsg) {
                    Toast.show({
                        title: "系统提示",
                        icon: 'fail',
                        content: ret.ErrorMsg,
                    })
                }
                if (ret.msgType === 'CThostFtdcTradeField') {
                    getCurrentPositionList(account)
                }
                // //期货 当前仓位 更新盈亏 数量
                // if (ret.msgType === 'StrategyPositionGather') {
                //     futCurrentPosition(ret.data)
                // }
                //期货 查询资金
                if (ret.msgType === 'CThostFtdcTradingAccountField') {
                    let account = ret.data
                    props.onSetAccount(account)
                }
            }
        });

        window.tcpSocket.addEventListener('close', (event) => {
            console.log('websock 连接断开')
            if (pageWillNone) {
                setTimeout(() => {
                    onTcpWebSocket(account)
                }, 5000)
            }
        })
    }
    //当前仓位
    const getCurrentPositionList = (accountInfo) => {
        const data = {
            'ctp.userId': accountInfo.tradeAccount,
            'ctp.brokerId': accountInfo.coding,
            instrumentId: props.stockCode
        }
        currentPositionList(data).then(res => {
            props.setCurrentPosition(res.strategyPositionList.filter(item => item.volume > 0))
        })
    }



    const testWebSocket = () => {
        if (window.newSocket) {
            window.newSocket.close()
            window.newSocket = null
        }
        window.newSocket = new WebSocket(`${wsHost}/market_push`);
        window.newSocket.addEventListener('open', (event) => {
            console.log('websocket链接成功')
            isFirstCome = false
            LoginWebsocket()
        });
        window.newSocket.addEventListener('message', (event) => {
            // console.log(event.data)
            let data = JSON.parse(event.data)

            //定制行情
            if (data.stateCode === 0 && data.module === 5 && data.cmd === 1) {
                console.log('websocket登录成功')
                subKlineWebsocket(props.period)
            }
            if (data instanceof Array && data.length > 0) {
                const quote = {
                    last_px: data[2],
                    px_change: data[7],
                    px_change_rate: data[6],
                    high_px: data[4],
                    low_px: data[3]
                }
                props.changeQuoteData(quote)
                data = [data[0], data[1], data[4], data[3], data[2], data[5]]
                data = splitData([data])
                if (tabIndex === 0) {
                    if (minChartRef.current) {
                        data.categoryData = data.categoryData.map(item => {
                            return Number(moment().format('YYYYMMDD') + item)
                        })
                        minChartRef.current.refreshChart(data)
                    }
                } else {
                    if (kchartRef.current) {
                        kchartRef.current.refreshKline(data)
                    }

                }
            }


        })

        window.newSocket.addEventListener('close', (event) => {
            console.log('websocket连接断开')
            if (!pageWillNone && !isFirstCome) {
                window.newSocket = null
                setTimeout(() => {
                    testWebSocket()
                }, 5000)
            }
        })

    }

    const LoginWebsocket = () => {
        let userId = 'test'
        let useInfo = localStorage.getItem('userInfo')
        if (useInfo) {
            userId = JSON.parse(useInfo).id
        }
        const login = {
            module: 5,
            cmd: 1,
            password: 123456,
            userId: userId,
        }
        window.newSocket.send(JSON.stringify(login))
    }

    const subKlineWebsocket = (period) => {
        let userId = props.randomString
        let useInfo = localStorage.getItem('userInfo')
        if (useInfo) {
            userId = JSON.parse(useInfo).id
        }
        const sub = {
            userId: userId,
            module: 5,
            cmd: 2,
            periods: [period],
            subscribeProdCodes: props.stockCode
        }
        window.newSocket.send(JSON.stringify(sub))
    }
    const cancelKlineWebsocket = (period) => {
        let userId = props.randomString
        let useInfo = localStorage.getItem('userInfo')
        if (useInfo) {
            userId = JSON.parse(useInfo).id
        }
        const sub = {
            userId: userId,
            module: 5,
            cmd: 3,
            periods: [period],
            subscribeProdCodes: props.stockCode
        }
        window.newSocket.send(JSON.stringify(sub))
    }


    const changePeriod = (item, index) => {
        if (index === tabIndex) {
            return
        }
        //取消定制行情
        cancelKlineWebsocket(props.period)
        tabIndex = index
        setPeriodIndex(index)
        props.changePeriod(item.value)
        onRunStrategy(item.value)
        setMoreText('更多')
        setTimeout(() => {
            if (index === 0) {
                props.changeChartType(true)
                props.onGetNewKline(props.stockCode, item.value, (stockDate) => {
                    let currentDate = moment(new Date()).format('YYYYMMDD')
                    let dataIndex = 0
                    stockDate.forEach((item, index) => {
                        if (item[0].toString().includes(currentDate + '0931')) {
                            dataIndex = index
                        }
                    })

                    if (dataIndex > 0) {
                        initMinLine(stockDate.slice(dataIndex))
                    } else {
                        initMinLine([])
                    }
                    //重新定制行情
                    subKlineWebsocket(item.value)

                })

            } else {
                props.changeChartType(false)
                props.onGetNewKline(props.stockCode, item.value, (stockDate) => {
                    initKline(stockDate, item.value)
                    subKlineWebsocket(item.value)
                })
            }
        }, 200)
    }
    const changeSmallPeriod = (period, text) => {
        cancelKlineWebsocket(props.period)
        tabIndex = 4
        setPeriodIndex(4)
        props.changePeriod(period)
        props.changeChartType(false)
        onRunStrategy(period)
        props.onGetNewKline(props.stockCode, period, (stockDate) => {
            initKline(stockDate, period)
            subKlineWebsocket(period)
        })
        setMoreText(text)
        setVisiblePeriodList(false)
    }

    const initKline = (data, period) => {
        let values = splitData(data)
        const option = {}
        if (kchartRef && !pageWillNone) {
            kchartRef.current.init(values, option, props.quote, period)
        }

    }

    const initMinLine = (data) => {
        let values = splitDataMin(data)
        let quote = props.quote
        minChartRef.current.init(values, quote)
    }

    //获取账号
    const getDefaultAccount = (callback) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const data = {
            userId: userInfo.id,
            accountType: props.marketType
        }
        defaultAccount(data).then(res => {
            const account = res.data
            const userId = account.tradeAccount
            const brokerId = account.coding
            const accountData = {
                'ctp.userId': userId,
                'ctp.brokerId': brokerId,
            }
            props.setCurrentAccountId(userId)
            if (callback) {
                callback(userId, account)
            }
            getAccountFund(accountData).then(res => {
                let data = Object.values(res).filter(item => typeof item === 'object')
                if (data.length > 0) {
                    let account = data[0]
                    props.onSetAccount(account)
                }
            })

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

            props.onSetAccountList(result)
        })
    }

    //获取自选股
    const getFavorList = (callback) => {
        let userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            userInfo = JSON.parse(userInfo)
            const data = {
                refId: userInfo.id,
                pageNum: 1,
                pageSize: 100
            }
            favorList(data).then(res => {
                if (!res.data) {
                    return
                }
                const list = res.data.list
                props.changeFav(list)
                list.forEach(item => {
                    if ((item.symbol === props.stockCode) && !pageWillNone) {
                        setIsFavor(true)
                    }
                })
                if (callback) {
                    callback(list)
                }
            })
        }
    }

    const cancelFavor = () => {
        let favId = ""
        props.favorList.forEach(item => {
            if (item.symbol === props.stockCode) {
                favId = item.id
            }
        })
        Dialog.confirm({
            content: '确定要取消自选吗？',
            onConfirm: () => {
                console.log(favId)
                deleteFavor({ id: favId }).then(res => {
                    if (res.retCode === 0) {
                        Toast.show({
                            icon: 'success',
                            content: "取消成功",
                        })
                        setIsFavor(false)
                        getFavorList()

                    }
                })
            },
        })
    }

    const onAddFavor = () => {
        let userInfo = localStorage.getItem("userInfo")
        if (!userInfo) {
            alert('请先登录')
        } else {
            Dialog.confirm({
                content: '确定要添加到自选吗？',
                onConfirm: () => {
                    userInfo = JSON.parse(userInfo)
                    const data = {
                        refId: userInfo.id,
                        symbol: props.stockCode,
                        remark: ""
                    }
                    addFavor(data).then(res => {
                        if (res.retCode === 0) {
                            Toast.show({
                                icon: 'success',
                                content: "添加自选成功",
                            })
                            getFavorList()
                        }
                    })
                }
            })
        }
    }

    //运行策略
    const onRunStrategy = (period, callback) => {
        let { stockCode, } = props
        if (stockCode) {
            let userInfo = localStorage.getItem('userInfo')
            userInfo = JSON.parse(userInfo)
            const data = {
                userId: userInfo.id,
                symbol: stockCode,
                period: period,
                // strategyType: 1,
                page: 1,
                size: 20
            }
            runStrategy(data).then(res => {
                if (res.code === 200) {
                    seStrategyList(res.data.page_date)
                    if (callback) {
                        callback(res.data.page_date)
                    }

                }
            })
        }


    }

    //回测
    const onBacktest = (item) => {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
            maskClickable: false,

        })
        backtestSignal({ strategyId: item.id }).then(res => {
            Toast.clear()
            let alert = []
            if (res.data && res.data.length > 0) {
                res.data.forEach(item => {
                    let obj = {}
                    if (props.period < 6) {
                        obj.time = moment(item.time, 'YYYY-MM-DD HH:mm:ss').format('YYYYMMDDHHmm')
                    } else {
                        obj.time = moment(item.time, 'YYYY-MM-DD HH:mm:ss').format('YYYYMMDD')
                    }
                    if (item.signal.buysell === 1 && item.signal.openclose === 1) {
                        obj.type = 1
                    } else if (item.signal.buysell === -1 && item.signal.openclose === -1) {
                        obj.type = 3
                    }
                    alert.push(obj)

                })
            }

            kchartRef.current.setPoint(alert)
        })
    }

    const onBacktestOptimal = (item) => {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
            maskClickable: false,
        })
        backtestOptimalSignal({
            id: item.id,
            reqSignal: 1
        }).then(res => {
            Toast.clear()
            let alert = []
            if (res.data && res.data.length > 0) {
                res.data.forEach(item => {
                    let obj = {}
                    if (props.period < 6) {
                        obj.time = moment(item.time, 'YYYY-MM-DD HH:mm:ss').format('YYYYMMDDHHmm')
                    } else {
                        obj.time = moment(item.time, 'YYYY-MM-DD HH:mm:ss').format('YYYYMMDD')
                    }
                    if (item.buysell === 1 && item.openclose === 1) {
                        obj.type = 1
                    } else if (item.buysell === -1 && item.openclose === -1) {
                        obj.type = 3
                    }
                    alert.push(obj)

                })
            }

            kchartRef.current.setPoint(alert)
        })
    }

    //最优策略列表
    const onOptimalStrategyList = (period, callback) => {
        let { stockCode } = props

        const data = {
            symbol: stockCode,
            period: period,
        }
        optimalStrategyList(data).then(res => {
            // this.setState({ list: res.data })
            if (res.retCode === 0) {
                setOptimalList(res.data)
                if (callback) {
                    callback(res.data)
                }
            }
        })
    }

    //跟单策略列表
    const onFollowStrategyList = (period, callback) => {
        let { stockCode } = props

        let userInfo = localStorage.getItem('userInfo')
        let userId = JSON.parse(userInfo).id
        let data = {
            hostingName: "",
            userId: userId,
            page: 1,
            size: 50
        }
        if (period) {
            data.period = period
        }

        followListFunc(data).then(res => {
            let result = res.data.page_date.filter((item) => item.symbol === stockCode)
            setFollowList(result)
            if (callback) {
                callback(result)
            }
        })
    }


    //切换 运行 跟单 最优
    const changeStrategyList = (index) => {
        setStrategyTabIndex(index)
        setBacktestIndex(0)
        if (index === 0) {
            onOptimalStrategyList(props.period, (result) => {
                if (result.length > 0) {
                    onBacktestOptimal(result[0])
                }
            })
        } else if (index === 2) {
            onFollowStrategyList(props.period,
                (result) => {
                    if (result.length > 0) {
                        onBacktest(result[0])
                    }
                })
        } else if (index === 1) {
            onRunStrategy(props.period,
                (result) => {
                    if (result.length > 0) {
                        onBacktest(result[0])
                    }
                })

        }
    }

    //跳转至最优策略详情
    const onNavOptimalDetail = (item) => {
        navigate('/strategyOptimalReport/' + item.id + "/" + item.releaseId)
    }


    //删除跟单
    const onFollowOrderDelete = (item) => {

        Dialog.confirm({
            title: "确定删除吗",
            onConfirm: () => {
                Toast.show({
                    icon: 'loading',
                    content: '加载中…',
                    duration: 0,
                    maskClickable: false,
                })
                deleteFollow({ id: item.id }).then(res => {
                    Toast.clear()
                    onFollowStrategyList(props.period)
                    Toast.show({
                        icon: 'success',
                        content: "删除成功"
                    })
                }).catch(err => {
                    Toast.clear()
                    Toast.show({
                        icon: 'fail',
                        content: "服务端出错"
                    })
                })
            }
        })


    }

    //策略的暂停 运行
    const onControlFollowStrategy = (item, index) => {

        let strategyFun
        if (item.strategyStatus === 'Running') {
            strategyFun = strategyStop
        } else {
            strategyFun = strategyRun
        }
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
            maskClickable: false,
        })
        strategyFun({ id: item.id }).then(res => {
            Toast.clear()
            if (res.code === 200) {
                onFollowStrategyList(props.period)
                Toast.show({
                    icon: 'success',
                    content: "操作成功"
                })
            } else {
                Toast.show({
                    icon: 'fail',
                    content: "服务端出错"
                })
            }
        }).catch(err => {
            Toast.clear()
            Toast.show({
                icon: 'fail',
                content: "服务端出错"
            })
        })
    }


    return (
        <div className="traderoom-wrapper">
            <div className="stock-info">
                {isFavor ? <span className="add-btn gray" onClick={() => cancelFavor()}>-</span> : <span className="add-btn" onClick={() => onAddFavor()}>+</span>}
                <div className="info-colums" style={{ marginRight: 10 }}>
                    <div className="stock-name">{props.quote.prod_name}</div>
                    <div className="stock-code">{props.quote.prod_code}</div>
                </div>
                <div className="info-colums" style={{ marginRight: 10 }}>
                    <div className={props.quote.px_change < 0 ? "current-price green" : "current-price"}>{props.quote.last_px}</div>
                    <div className="price-limit">
                        <span className={props.quote.px_change < 0 ? "green" : ""} style={{ marginRight: 10 }} >{props.quote.px_change}</span>
                        <span className={props.quote.px_change_rate < 0 ? "green" : ""}>{props.quote.px_change_rate}%</span>
                    </div>
                </div>
                <div className="info-colums">
                    <div className="high">
                        <span className="text">最高</span>
                        <span className="value">{props.quote.high_px}</span>
                    </div>
                    <div className="low">
                        <span className="text">最低</span>
                        <span className="value green">{props.quote.low_px}</span>
                    </div>
                </div>
                <div className="nav-btn" onClick={() => navigate('/trade/symbolPool')}>
                    {/* <img src={edit_icon} alt="" className="bj-icon" /> */}
                    {/* <img src={arrow_icon} alt="" className="arrow-icon" /> */}
                    自选
                </div>
                <div className="nav-btn" onClick={() => navigate('/trade/search')}>
                    {/* <img src={search_icon} alt="" className="search-icon" /> */}
                    搜索

                </div>
            </div>
            <div className="period-list">
                {periodList.map((item, index) => {
                    return (
                        <span className={periodIndex === index ? 'active' : ""} onClick={() => {
                            changePeriod(item, index)
                        }} key={index}>{item.label}</span>
                    )
                })}
                <span className={periodIndex === 4 ? 'active' : ""} onClick={() => {
                    setVisiblePeriodList(true)
                }}>{moreText}</span>
            </div>
            <ActionSheet
                extra='K线周期'
                cancelText='取消'
                visible={visiblePeriodList}
                actions={periodActions}
                onClose={() => setVisiblePeriodList(false)}
            />
            <div className="chart-wrapper">

                {periodIndex === 0 ?
                    <MinChart ref={minChartRef} /> :
                    <KChart ref={kchartRef} />
                }

            </div>

            <div className="stragegy-manage" style={props.isMinChart ? { "display": "none" } : {}}>
                <div className="strategy-tabs">
                    {strategyTabs.map((item, index) => {
                        return (
                            <span className={strategyTabIndex === index ? 'active' : ""}
                                onClick={() => {
                                    changeStrategyList(index)

                                }} key={index}
                            >{item}</span>
                        )
                    })}
                </div>
                {strategyTabIndex === 1 ?
                    <div className="strategy-list-wrapper">
                        <div className="strategy-head">
                            <div>托管策略</div>
                            <div>收益率</div>
                            <div>运行状态</div>
                            {/* <div style={{ textAlign: 'center', flex: 1.3 }}>操作</div> */}
                        </div>
                        <div className='strategy-list'>
                            {strategyList.map((item, index) => {
                                let period = ""
                                if (item.period === 6) {
                                    period = '日'
                                } else if (item.period === 1) {
                                    period = '1分钟'
                                } else if (item.period === 2) {
                                    period = '5分钟'
                                } else if (item.period === 3) {
                                    period = '15分钟'
                                } else if (item.period === 4) {
                                    period = '30分钟'
                                } else if (item.period === 5) {
                                    period = '60分钟'
                                } else if (item.period === 7) {
                                    period = '周'
                                } else if (item.period === 8) {
                                    period = '月'
                                }
                                return (
                                    <div className="strategy-item" key={item.id} onClick={() => {
                                        navigate('/trade/trust/' + item.id)
                                        localStorage.setItem("strategyStatus", JSON.stringify(item.strategyStatus))
                                    }}>
                                        <div className={backtestIndex === index ? "strategy-name active" : "strategy-name"}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onBacktest(item)
                                                setBacktestIndex(index)
                                            }} >{item.hostingName}</div>
                                        <div style={item.yieldRate >= 0 ? { "color": 'red' } : {}}>{item.yieldRate}%</div>
                                        <div>{item.strategyStatus === 'Running' ? '运行' : '暂停'}</div>
                                        {/* <div className="nav-btn" style={{ 'flex': 1.3 }}>
                                            <span className="backtest" >回测</span>
                                            <span className="follow" onClick={() => {
                                            }}>详情</span>
                                        </div> */}
                                    </div>
                                )
                            })}
                            {strategyList.length === 0 ? <div className='no-data'>暂无数据</div> : null}
                        </div>
                    </div> : null
                }
                {strategyTabIndex === 0 ?
                    <div className="strategy-list-wrapper">
                        <div className="strategy-head">
                            <div>托管策略</div>
                            <div>收益率</div>
                            <div>回测</div>
                            {/* <div style={{ textAlign: 'center', flex: 1.3 }}>操作</div> */}
                        </div>
                        <div className='strategy-list'>
                            {optimalList.map((item, index) => {
                                return (
                                    <div className="strategy-item" key={item.id} onClick={() => {
                                        onNavOptimalDetail(item)
                                    }}>
                                        <div className={backtestIndex === index ? "strategy-name active" : "strategy-name"} onClick={(e) => {
                                            e.stopPropagation()
                                            onBacktestOptimal(item)
                                            setBacktestIndex(index)
                                        }}>{item.strategyName}</div>
                                        <div style={item.returnRatio >= 0 ? { "color": 'red' } : { "color": "green" }}>{(item.returnRatio * 100).toFixed(2)}%</div>
                                        <div style={item.maxDD >= 0 ? { "color": 'red' } : { "color": "green" }}>{(Number(item.maxDD) * 100).toFixed(2)}%</div>
                                        {/* <div className="nav-btn" style={{ 'flex': 1.3 }}>
                                            <span className="backtest" onClick={() => onBacktestOptimal(item)} >回测</span>
                                            <span className="follow" onClick={() => {
                                               onNavOptimalDetail(item)
                                            }}>详情</span>
                                        </div> */}
                                    </div>
                                )
                            })}
                            {optimalList.length === 0 ? <div className='no-data'>暂无数据</div> : null}
                        </div>
                    </div> : null
                }

                {strategyTabIndex === 2 ?
                    <div className="strategy-list-wrapper">
                        <div className="strategy-head">
                            <div>托管策略</div>
                            <div>收益率</div>
                            {/* <div>运行状态</div> */}
                            <div style={{ textAlign: 'center', flex: 1.3 }}>操作</div>
                        </div>
                        <div className='strategy-list'>
                            {followList.map((item, index) => {
                                return (
                                    <div className="strategy-item" key={item.id}>
                                        <div className={backtestIndex === index ? "strategy-name active" : "strategy-name"} onClick={(e) => {
                                            e.stopPropagation()
                                            onBacktest(item)
                                            setBacktestIndex(index)
                                        }}>{item.hostingName}</div>
                                        <div style={Number(item.yieldRate) >= 0 ? { "color": 'red' } : { "color": "green" }}>{(Number(item.yieldRate) * 100).toFixed(2)}%</div>
                                        {/* <div>{item.strategyStatus === 'Running' ? '运行' : '暂停'}</div> */}
                                        <div className="nav-btn" style={{ 'flex': 1.3 }}>
                                            <span className="backtest" onClick={() => onControlFollowStrategy(item)} >{item.strategyStatus === 'Running' ? '暂停' : '运行'}</span>
                                            <span className="backtest follow" onClick={() => onFollowOrderDelete(item)} >删除</span>
                                        </div>
                                    </div>
                                )
                            })}
                            {followList.length === 0 ? <div className='no-data'>暂无数据</div> : null}
                        </div>
                    </div> : null
                }


            </div>

            <div className="btn-list">
                <div>
                    <div className="available">可用：{props.account.Available.toFixed(2)}</div>
                    <div className="capital">资产：{props.account.Balance.toFixed(2)}</div>
                </div>
                <div className="buy-btn" onClick={() => navigate('/trade/businessBuy')}>
                    买入
                </div>
                <div className="sell-btn" onClick={() => navigate('/trade/businessSell')}>
                    卖出
                </div>
                <div className="more-btn" onClick={() => {
                    setVisibleMore(true)
                }}>
                    更多
                </div>
            </div>
            <ActionSheet
                visible={visibleMore}
                actions={moreActions}
                onClose={() => setVisibleMore(false)}
            />

            {/* <StockChart/> */}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        stockCode: state.traderoom.code,
        quote: state.traderoom.quote,
        isFavor: state.traderoom.isFavor,
        stockDate: state.traderoom.stockDate,
        period: state.traderoom.period,
        account: state.traderoom.account,
        randomString: state.traderoom.randomString,
        favorList: state.traderoom.favList,
        marketType: state.traderoom.marketType,
        isMinChart: state.traderoom.isMinChart,
        currentPositionList: state.traderoom.currentPositionList,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGetKline: (code, period, callback, uuid) => {
            dispatch(onGetKline(code, period, callback, uuid))
        },
        onGetNewKline: (code, period, callback) => {
            dispatch(onGetNewKline(code, period, callback))
        },
        onGetQuote: (code, uuid) => {
            dispatch(onGetQuote(code, uuid))
        },
        changeQuoteData: (res) => {
            dispatch(changeQuoteData(res))
        },
        changePeriod: (res => {
            dispatch(changePeriod(res))
        }),
        onSetAccount: (data) => {
            dispatch(setAccount(data))
        },
        onSetAccountList: (data) => {
            dispatch(setAccountList(data))
        },
        changeFav: (data) => {
            dispatch(changeFav(data))
        },
        setCurrentAccountId: (data) => {
            dispatch(setCurrentAccountId(data))
        },
        changeChartType: (data) => {
            dispatch(changeChartType(data))
        },
        setCurrentPosition: (data) => {
            dispatch(setCurrentPosition(data))
        },
        updateTrustData: (data) => {
            dispatch(updateTrustData(data))
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Traderoom)