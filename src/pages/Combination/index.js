import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listComboxListInfo } from '../../service/compose'
import { InfiniteScroll } from 'antd-mobile-v5'
import './index.scss'

export default function ComposeSub() {
    const navigate = useNavigate()
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [composeList, setComposeList] = useState([])
    const [hasMore, setHasMore] = useState(true)
    useEffect(() => {
        getInit()
    }, [])

    const getInit = () => {
        let userInfo = JSON.parse(localStorage.userInfo);
        let userId = userInfo.id
        const data = {
            page: pageNum,
            size: pageSize,
            style:"",
            sort:"year_yield_rate"
        }
        listComboxListInfo(data).then(res => {
            if (res.data) {
                setComposeList(res.data)
                if (res.total_page !== 0) {
                    if (res.current_page === res.total_page) {
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
            page: pageNum,
            size: pageSize,
            style:"",
            sort:"year_yield_rate"
        }

        return listComboxListInfo(data).then((res) => {
            if (res.retCode === 0) {
                setComposeList([...composeList, ...res.data])
                setPageNum(pageNum + 1)
                if (res.current_page === res.total_page) {
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
        navigate("/combination/" + item.id)
    }

    return (
        <div className="compose-rank-list-wrapper">
            <div className='title'>组合排行</div>
            <div className="data-title-list">
                <div className="data-title">名称</div>
                <div className="data-title">总收益</div>
                <div className="data-title">初始资金</div>
            </div>

            {composeList.map((item, index) => {
                return (
                    <div className="data-item" key={index} onClick={()=>navDetail(item)}>
                        <div className="userinfo" to={"/combination/"+item.id} >
                            <div className="strategy">
                                <div className="strategy-name">{item.comboName}</div>
                            </div>
                          
                        </div>
                        <div className={item.totalYieldRate>=0?"year-rate red":"year-rate green"}>{item.totalYieldRate}%</div>
                        <div className="expire-date">
                            {item.initFund/10000}万
                        </div>
                    </div>
                )
            })}


           
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={50} />
        </div>
    )
}