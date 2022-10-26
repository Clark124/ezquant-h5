import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Carousel } from 'antd-mobile';
import banner from './images/banner01.png'
import banner2 from './images/banner02.png'
import banner3 from './images/banner06.png'
import './index.scss'
import time_icon from './images/time.png'


import { strategyRankList, chosenCondition, listComboxListInfo, runStrategy, scanList, listMyComboInfo, tradeRecord, marketScan } from '../../service/index'

export default class Home extends Component {
    constructor() {
        super()
        this.state = {
            carouselList: [
                { image: banner3, key: "banner3", },
                { image: banner2, key: "banner2", },
                { image: banner, key: "banner", },
            ],
            imgHeight: 176,
            strategyList: [],
            conditionList: [],
            scanList: [],
            recommendCombination: [],
            runStrategyList: [], //托管的策略
            runScanList: [],//托管的扫描
            composeList: [],//托管的组合
            tradeRecordList: [],//交易日志
            isLogin: false
        }
    }

    componentDidMount() {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {
            this.setState({ isLogin: true }, () => {
                // this.getRunStrategy()
                this.getTradeRecord()
                // this.getScanList()
                // this.getListMyComboInfo()
            })

        }
        //推荐策略
        this.getStrategyRankList()
        //推荐组合
        // this.getListComboxListInfo()
        //推荐选股
        // chosenCondition().then(res => {
        //     this.setState({ conditionList: res })
        // })
        //推荐的扫描
        marketScan().then(res => {
            this.setState({ scanList: res })
        })

    }

    //推荐策略
    getStrategyRankList() {
        strategyRankList({
            sortType: 0,
            page: 1,
            size: 3,
            strategyType: 1
        }).then(res => {
            if (res.code === 200) {
                let list = res.data.page_date
                this.setState({ strategyList: list })
            }
        })
    }
    //组合排行
    getListComboxListInfo() {
        const data = {
            page: 1, size: 3, style: "", sort: 'year_yield_rate'
        }
        listComboxListInfo(data).then(res => {
            this.setState({ recommendCombination: res.data })
        })
    }

    //托管的策略
    getRunStrategy() {
        const userId = JSON.parse(localStorage.getItem("userInfo")).id
        const data = {
            hostingName: "",
            userId: userId,
            page: 1,
            size: 2,
            isNotice: true,
            strategyType: 1,
        }
        runStrategy(data).then(res => {
            if (res.code === 200) {
                const list = res.data.page_date
                this.setState({ runStrategyList: list })
            }
        })
    }

    //托管的扫描
    getScanList() {
        const userId = JSON.parse(localStorage.getItem("userInfo")).id
        const data = {
            scanType: "12"
        }
        scanList(userId, data).then(res => {


            const list = res.slice(0, 2)
            this.setState({ runScanList: list })


        })
    }

    //托管的组合
    getListMyComboInfo() {
        const userId = JSON.parse(localStorage.getItem("userInfo")).id
        const data = {
            userId: userId,
            page: 1,
            size: 10,
            comboName: "",
        }
        listMyComboInfo(data).then(res => {
            const list = res.data.slice(0, 2)
            this.setState({ composeList: list })
        })
    }
    //交易日志
    getTradeRecord() {
        const userId = JSON.parse(localStorage.getItem("userInfo")).id
        const data = {
            userId: userId,
            page: 1,
            size: 2,
        }
        tradeRecord(data).then(res => {
            this.setState({ tradeRecordList: res.data.page_date })
        })
    }

    componentWillUnmount() {
        this.setState = (state) => {
            return
        }
    }

    navSelectionResult(item) {
        localStorage.setItem("selectionResult", JSON.stringify(item))
    }

    navScanResult(item) {
        localStorage.setItem("recommendScanResult", JSON.stringify(item))
    }


    render() {
        const { strategyList, conditionList, scanList, recommendCombination, runStrategyList, runScanList, composeList, tradeRecordList, isLogin } = this.state
        return (
            <div className='home-wrapper'>
                <div className='carousel-wrapper'>
                    <Carousel autoplay={false}>
                        {this.state.carouselList.map(item => (
                            <div className="banner" key={item.key}>
                                <img src={item.image} alt=""
                                    style={{ width: '100%', verticalAlign: 'top' }}
                                    onLoad={() => {
                                        // fire window resize event to change height
                                        window.dispatchEvent(new Event('resize'));
                                        this.setState({ imgHeight: 'auto' });
                                    }}
                                />
                            </div>

                        ))}
                    </Carousel>
                </div>

                <div className='home-block'>
                    {/* 推荐扫描 */}
                    <div className="block-title-wrap">
                        <span className="block-title">选股排行</span>
                        <Link className="show-more" to="/recommendSelection">更多></Link>
                    </div>
                    <div className="block-list">
                        {scanList.map((item, index) => {
                            return (
                                <Link to={`/recommendScanResult/${item.id}`} onClick={() => this.navScanResult(item)}
                                    className={item.pxAvgChangeRate >= 0 ? "info-item red" : "info-item"} key={item.id}>
                                    <div className="rate">{item.pxAvgChangeRate}%</div>
                                    <div className="rate-name">平均涨幅</div>
                                    <div className="strategy-name">{item.scanName}</div>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="split-line"></div>

                    {/* 推荐策略 */}
                    <div className="block-title-wrap">
                        <span className="block-title">择时排行</span>
                        <Link className="show-more" to="/strategyRank">更多></Link>
                    </div>
                    <div className="block-list">
                        {strategyList.map((item, index) => {
                            return (
                                <Link className={item.totalYieldRate >= 0 ? "info-item red" : "info-item"} to={'/strategyRealReport/' + item.id} key={item.id} >
                                    <div className="rate">{item.totalYieldRate}%</div>
                                    <div className="rate-name">年化收益</div>
                                    <div className="strategy-name">{item.hostingName}</div>
                                </Link>
                            )
                        })}
                    </div>



                    {/* 推荐组合 */}
                    {/* <div className="block-title-wrap">
                        <span className="block-title">推荐组合</span>
                        <Link className="show-more" to="/combination">更多></Link>
                    </div>
                    <div className="block-list">
                        {recommendCombination.map((item, index) => {
                            return (
                                <Link className="info-item" to={'/combination/' + item.id}
                                    className={item.yearYieldRate >= 0 ? "info-item red" : "info-item"} key={item.id}>
                                    <div className="rate">{item.yearYieldRate}%</div>
                                    <div className="rate-name">年化收益</div>
                                    <div className="strategy-name">{item.comboName}</div>
                                </Link>
                            )
                        })}
                    </div> */}


                    {/* 推荐选股/扫描条件 */}
                    {/* <div className="block-title-wrap">
                        <span className="block-title">选股条件</span>
                        <Link className="show-more" to="/recommendSelection">更多></Link>
                    </div>
                    <div className="block-list">
                        {conditionList.map((item, index) => {
                            return (
                                <Link to={`/selectionResult/${item.id}`} onClick={() => this.navSelectionResult(item)}
                                    className={item.pxAvgChangeRate >= 0 ? "info-item red" : "info-item"} key={item.id}>
                                    <div className="rate">{item.pxAvgChangeRate}%</div>
                                    <div className="rate-name">平均涨幅</div>
                                    <div className="strategy-name">{item.selectStockConditionName}</div>
                                </Link>
                            )
                        })}
                    </div>
                    <div className="split-line"></div> */}


                </div>
                {/* 我的托管 */}
                <div className='home-block' style={ { display: 'none' }}>
                    {/* <div className="block-title-wrap">
                        <span className="block-title">我的盯盘</span>
                    </div> */}
                    {/* 托管的扫描 */}
                    {/* <div className="trust-item">
                        <div className="trust-item-title-wrap">
                            <span className="trust-item-title">选股条件</span>
                            <Link className="show-more" to="/stockpick/1">+更多</Link>
                        </div>
                        <div className="trust-data">
                            <div className="trust-title">
                                <div style={{ flex: 0.5 }}>扫描名称</div>
                                <div style={{ flex: 0.25 }}>市场</div>
                                <div style={{ flex: 0.25 }}>周期</div>
                            </div>
                            {runScanList.map((item) => {
                                let period = ""
                                if (item.period === 6) {
                                    period = '1天'
                                } else if (item.period === 1) {
                                    period = '1分钟'
                                } else if (item.period === 2) {
                                    period = '5分钟'
                                } else if (item.period === 3) {
                                    period = '15分钟'
                                } else if (item.period === 4) {
                                    period = '30分钟'
                                } else if (item.period === 5) {
                                    period = '1小时'
                                }

                                return (
                                    <div className="trust-info" key={item.id}>
                                        <div className="trust-info-item" style={{ flex: 0.5 }}>{item.scanName}</div>
                                        <div className="trust-info-item" style={{ flex: 0.25 }}>{item.marketType}</div>
                                        <div className="trust-info-item" style={{ flex: 0.25 }}>{period}</div>
                                    </div>
                                )
                            })}
                            {runScanList.length === 0 ?
                                <div className='no-data'>暂无数据</div> : null
                            }


                        </div>
                    </div> */}
                    {/* 托管的策略 */}
                    {/* <div className="trust-item">
                        <div className="trust-item-title-wrap">
                            <span className="trust-item-title">择时策略</span>
                            <Link className="show-more" to="/selectTime/1">+更多</Link>
                        </div>
                        <div className="trust-data">
                            <div className="trust-title">
                                <div style={{ flex: 0.5 }}>策略名称</div>
                                <div style={{ flex: 0.3 }}>股票</div>
                                <div style={{ flex: 0.2 }}>收益率</div>
                            </div>
                            {runStrategyList.map(item => {
                                return (
                                    <div className="trust-info" key={item.id}>
                                        <div className="trust-info-item" style={{ flex: 0.5 }}>{item.hostingName}</div>
                                        <div className="trust-info-item" style={{ flex: 0.3 }}>{item.symbol}</div>
                                        <div className={item.yieldRate >= 0 ? "trust-info-item red" : "trust-info-item green"} style={{ flex: 0.2 }}>{item.yieldRate}%</div>
                                    </div>
                                )
                            })}
                            {runStrategyList.length === 0 ?
                                <div className='no-data'>暂无数据</div> : null
                            }
                        </div>
                    </div> */}

                    {/* 托管的组合 */}
                    {/* <div className="trust-item">
                        <div className="trust-item-title-wrap">
                            <span className="trust-item-title">我的组合</span>
                            <Link className="show-more" to="/compose/0">+更多</Link>
                        </div>
                        <div className="trust-data">
                            <div className="trust-title">
                                <div style={{ flex: 0.5 }}>组合名称</div>
                                <div style={{ flex: 0.25 }}>收益率</div>
                                <div style={{ flex: 0.25 }}>净值</div>
                            </div>
                            {composeList.map(item => {
                                return (
                                    <div className="trust-info" key={item.id}>
                                        <div className="trust-info-item" style={{ flex: 0.5 }}>{item.comboName}</div>
                                        <div className={item.totalYieldRate >= 0 ? "trust-info-item red" : "trust-info-item green"} style={{ flex: 0.25 }}>{item.totalYieldRate}%</div>
                                        <div className="trust-info-item" style={{ flex: 0.25 }}>{item.netValue}</div>
                                    </div>
                                )
                            })}

                            {composeList.length === 0 ?
                                <div className='no-data'>暂无数据</div> : null
                            }


                        </div>
                    </div> */}
                </div>
                {/* 交易日志 */}
                <div className="home-block" style={isLogin ? null : { display: 'none' }}>
                    <div className="block-title-wrap">
                        <span className="block-title">我的订阅</span>
                        <Link className="show-more" to='/tradeLog'>更多></Link>
                    </div>
                    <div className="trade-log-list">
                        {tradeRecordList.map((item, index) => {
                            return (
                                <div className="trade-log-item" key={index}>
                                    <div className="trade-log-info">
                                        {item.message}
                                    </div>
                                    <div className="trade-log-date">
                                        <img src={time_icon} alt="" className="time-icon" />
                                        <div className='time'>{item.time}</div>
                                    </div>
                                </div>
                            )
                        })}
                        {tradeRecordList.length === 0 ?
                            <div className='no-data'>暂无数据</div> : null
                        }
                    </div>
                </div>

            </div>
        )
    }
}