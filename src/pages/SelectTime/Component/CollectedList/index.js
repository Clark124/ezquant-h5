
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { shareList, strategyList } from '../../../../service/traderoom'
import { connect } from 'react-redux'
import { InfiniteScroll } from 'antd-mobile-v5'
import { setStrategyIndex } from '../../../Trade/actions'

function TrustList(props) {
    const navigate = useNavigate()
    const [dataList, setDataList] = useState([])  //策略列表
    const [pageSize, setPage] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [strategys, setStrategys] = useState([])
    useEffect(() => {
        onRunStrategy()
        // getStrategyList()
    }, [])

    //运行策略
    const onRunStrategy = () => {
        let userInfo = localStorage.getItem('userInfo')
        userInfo = JSON.parse(userInfo)
        const data = {
            userId: userInfo.id,
            hostingName: "",
            page: pageNum,
            size: pageSize,
            strategyType: props.marketType === 0 ? 1 : 2,
        }
        shareList(data).then(res => {
            if (res.code === 200) {
                setDataList(res.data.page_date)
                if (res.data.total_page !== 0) {
                    if (res.data.current_page === res.data.total_page) {
                        setHasMore(false)
                    } else {
                        setPageNum(2)
                    }
                } else {
                    setHasMore(false)
                }

            }
        })


    }

    const loadMoreOrder = () => {
        let userInfo = localStorage.getItem("userInfo")
        const userId = JSON.parse(userInfo).id
        const data = {
            hostingName: "",
            size: pageSize,
            page: pageNum,
            userId,
            strategyType: props.marketType === 0 ? 1 : 2,
        }

        return shareList(data).then((res) => {
            if (res.retCode === 0) {
                setDataList([...dataList, ...res.data.page_date])
                setPageNum(pageNum + 1)
                if (res.data.current_page === res.data.total_page) {
                    setHasMore(false)
                }
            }
        })
    }

    const loadMore = async () => {
        if (pageNum > 1) {
            await loadMoreOrder()
        }
    }

    const navDetail = (item) => {
        localStorage.setItem("strategyTrustDetailCollect", JSON.stringify(item))
        navigate('/strategyTrustDetailCollect/' + item.id)
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
                setStrategys(list)
            }
        })
    }

    const navFollow = (data) => {
        navigate('/strategyRealReport/follow/' + data.id)

        localStorage.setItem("followParams", JSON.stringify(data))

    }


    return (
        <div className="select-time-list">
            {dataList.map((item, index) => {
                return (
                    <div className="select-time-item" key={item.id}>
                        <div className="strategy-name" onClick={() => navDetail(item)}>{item.hostingName}</div>
                        <div className="info-wrapper" onClick={() => navDetail(item)}>
                            <div className="info-list">
                                <div className="info-item">
                                    <span className="info-name">交易标的：</span>
                                    <span className="info-value">{item.symbol}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-name">收益率：</span>
                                    <span className={item.yieldRate >= 0 ? "info-value red" : "info-value"}>{item.yieldRate}%</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-name">作者：</span>
                                    <span className="info-value">{item.author}</span>
                                </div>
                            </div>
                            {item.subscriberState === '0' ? <div className="signal-btn" onClick={() => navFollow(item)}>跟单</div> :  <div className="signal-btn" >已跟单</div>}

                        </div>
                    </div>
                )
            })}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={50} />
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        marketType: state.traderoom.marketType,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setStrategyIndex: (data) => {
            dispatch(setStrategyIndex(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TrustList)