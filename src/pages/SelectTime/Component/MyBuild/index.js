import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link ,useNavigate} from 'react-router-dom'
import { strategyList ,hotStrategyList} from '../../../../service/strategy'
import moment from 'moment'
import { InfiniteScroll } from 'antd-mobile-v5'

function MyBuild(props) {
    const navigate = useNavigate()
    const [pageSize, setPage] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [dataList, setDataList] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [hotStrategy,setHotStrategy] = useState([])

    useEffect(() => {
        getMyStrategy()
        // getHotStrategy()
    }, [])

    const getMyStrategy = () => {
        let userInfo = localStorage.getItem("userInfo")
        const userId = JSON.parse(userInfo).id
        const data = {
            name: "",
            pageSize: pageSize,
            pageNum: pageNum,
            userId,
            strategyType: props.marketType
        }
        strategyList(data).then(res => {
            if (res.retCode === 0) {
                setDataList(res.data.list)
                setPageNum(2)
                if (res.data.isLastPage) {
                    setHasMore(false)
                }
            }
        })
    }

    const getHotStrategy = ()=>{
        hotStrategyList({
            page_no:1,
            page_count:5,
            strategyType:props.marketType
        }).then(res=>{

        })
    }

    const loadMoreOrder = () => {
        let userInfo = localStorage.getItem("userInfo")
        const userId = JSON.parse(userInfo).id
        const data = {
            name: "",
            pageSize: pageSize,
            pageNum: pageNum,
            userId,
            strategyType: props.marketType
        }

        return strategyList(data).then((res) => {
            if (res.retCode === 0) {
                setDataList([...dataList, ...res.data.list])
                setPageNum(pageNum + 1)
                if (res.data.isLastPage) {
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

    const navDetail = (item)=>{
        localStorage.setItem("strategyDetail",JSON.stringify(item))
        navigate('/strategyDetail/'+item.id)
    }

    return (
        <div>
            <Link className="create-btn" to="/strategyCreate">+ 搭建策略</Link>
            <div className="select-time-list">
                {dataList.map((item, index) => {
                    return (
                        <div className="select-time-item" key={item.id}>
                            <div className="strategy-name"  onClick={()=>navDetail(item)}>{item.name}</div>
                            <div className="info-wrapper">
                                <div className="info-list">
                                    <div className="info-item">
                                        <span className="info-name">介绍：</span>
                                        <span className="info-value">{item.description}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-name">更新时间：</span>
                                        <span className="info-value">{moment(item.updateDate).format('YYYY-MM-DD HH:mm:ss')}</span>
                                    </div>
                                </div>
                                <Link className="signal-btn" to={'/backtestSet/' + item.id}>回测</Link>
                            </div>
                        </div>
                    )
                })}
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
export default connect(mapStateToProps, null)(MyBuild)