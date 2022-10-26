
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { deployList } from '../../../../service/traderoom'
import { connect } from 'react-redux'
import { InfiniteScroll } from 'antd-mobile-v5'


function TrustList(props) {
    const [strategyList, seStrategyList] = useState([])  //策略列表
    const [pageSize, setPage] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    useEffect(() => {
        onRunStrategy()
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
            // strategyType: props.marketType === 0 ? 1 : 2,
        }
        deployList(data).then(res => {
            if (res.code === 200) {
                seStrategyList(res.data.page_date)
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
            // strategyType: props.marketType === 0 ? 1 : 2,
        }

        return deployList(data).then((res) => {
            if (res.retCode === 0) {
                seStrategyList([...strategyList, ...res.data.page_date])
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


    return (
        <div className="select-time-list">
            {strategyList.map((item, index) => {
                return (
                    <div className="select-time-item" key={item.id}>
                        <Link className="strategy-name" to='/strategyTrustDetailPublic/123'>{item.hostingName}</Link>
                        <div className="info-wrapper">
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
                                    <span className="info-name">发布时间：</span>
                                    <span className="info-value">{item.publishDate}</span>
                                </div>
                            </div>
                            <Link className="signal-btn" to={'/backtestReport/' + item.id}>策略报告</Link>
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
export default connect(mapStateToProps, null)(TrustList)