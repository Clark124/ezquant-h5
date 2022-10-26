import { useRef, useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'
import { strategyRankList } from '../../service/strategy'
import { connect } from 'react-redux';
import { InfiniteScroll ,Toast} from 'antd-mobile-v5'
import StrategyItem from './components/StrategyItem'


function Combination(props) {
    const lineRef = useRef(null)
    const [tabIndex, setTab] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [startegtyList, setStartegtyList] = useState([])
    const [hasMore, setHasMore] = useState(true)


    useEffect(() => {
        getStrategyList(0,1)
    }, [])

    const onTab = (index) => {
        setTab(index)
        setPageNum(1)
        getStrategyList(index,1)

    }

    const getStrategyList = (index,page) => {
        const data = {
            sortType: index,
            page: page,
            size: pageSize,
            strategyType: props.marketType === 0 ? 1 : 2,
        }
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0,
            maskClickable: false
        })
        setStartegtyList([])
        strategyRankList(data).then(res => {
            Toast.clear()
            if (res.code === 200) {
                setStartegtyList(res.data.page_date)
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
        }).catch(err=>{
            Toast.clear()
        })
    }

    const loadMoreOrder = () => {
        const data = {
            sortType: tabIndex,
            page: pageNum,
            size: pageSize,
            strategyType: props.marketType === 0 ? 1 : 2,
        }

        return strategyRankList(data).then((res) => {
            if (res.code === 200) {
                setStartegtyList([...startegtyList, ...res.data.page_date])
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
        <div className="strategy-list-wrapper">
            <div className="tab-list">
                <div className={tabIndex === 0 ? "tab-item active" : "tab-item"} onClick={() => onTab(0)}>
                    收益率
                </div>
                <div className={tabIndex === 1 ? "tab-item active" : "tab-item"} onClick={() => onTab(1)}>
                    最新上架
                </div>
            </div>
            <div className="combination-list">
                {startegtyList.map((item, index) => {
                    return (
                        <StrategyItem key={index} item={item}/>
                        // <div className="data-item"  key={index}>
                        //     <div className="name-chart">
                        //         <Link className="name-discribe" to={"/strategyRealReport/"+item.id}>
                        //             <div className="strategy-name">{item.hostingName}</div>
                                  
                        //             <div className="create">作者：{item.author}</div>
                        //             <div className="create">策略介绍：{item.description?item.description:"暂无介绍"}</div>
                        //             <div className="create">上线时间：{item.publishDate}</div>
                        //         </Link>
                        //         <div className="line-chart" ref={lineRef}>

                        //         </div>
                        //     </div>
                        //     <div className="message-list">
                        //         <div className="message-item">
                        //             <div className="message">{item.maxDD}%</div>
                        //             <div className="message-name">最大回测</div>
                        //         </div>
                        //         <div className="message-item">
                        //             <div className="message red">{item.monthYieldRate}</div>
                        //             <div className="message-name">月收益</div>
                        //         </div>
                        //         <div className="message-item">
                        //             <div className="message red">{item.totalYieldRate}%</div>
                        //             <div className="message-name">年化收益</div>
                        //         </div>
                        //     </div>
                        // </div>
                    )
                })}


                {/* <div className="data-item" to="2">
                    <div className="name-chart">
                        <Link className="name-discribe" to="/strategyTrustReport/123">
                            <div className="strategy-name">长期均线突破</div>
                            <div className="price">￥200元/月</div>
                            <div className="create">创建 : 明日小股神<br />关注 : 2873</div>
                        </Link>
                        <div className="line-chart" ref={lineRef}>

                        </div>
                    </div>
                    <div className="message-list">
                        <div className="message-item">
                            <div className="message">7.25%</div>
                            <div className="message-name">最大回测</div>
                        </div>
                        <div className="message-item">
                            <div className="message red">71.25</div>
                            <div className="message-name">月收益</div>
                        </div>
                        <div className="message-item">
                            <div className="message red">67.22%</div>
                            <div className="message-name">年化收益</div>
                        </div>
                    </div>
                </div> */}


            </div>
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={50} />

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        marketType: state.traderoom.marketType,
    };
}
export default connect(mapStateToProps, null)(Combination)

