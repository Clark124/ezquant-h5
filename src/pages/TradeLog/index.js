import { useEffect, useState } from 'react'
import './index.scss'
import { tradeRecord } from '../../service/index'
import { InfiniteScroll } from 'antd-mobile-v5'


export default function TradeLog() {
    const [page, setPage] = useState(1)
    const [size] = useState(10)
    const [list, setList] = useState([])
    const [hasMore, setHasMore] = useState(true)


    useEffect(() => {
        getTradeRecord()
    }, [])

    //交易日志
    const getTradeRecord = () => {
        const userId = JSON.parse(localStorage.getItem("userInfo")).id
        const data = {
            userId: userId,
            page: page,
            size: size,
        }
        tradeRecord(data).then(res => {
            setList(res.data.page_date)
            if (res.data.total_page !== 0) {
                if (res.data.current_page === res.data.total_page) {
                    setHasMore(false)
                } else {
                    setPage(2)
                }
            } else {
                setHasMore(false)
            }
        })
    }

    const loadMoreOrder = () => {
        const userId = JSON.parse(localStorage.getItem("userInfo")).id
        const data = {
            userId: userId,
            page: page,
            size: size,
        }

        return tradeRecord(data).then((res) => {
            if (res.code === 200) {
                setList([...list, ...res.data.page_date])
                setPage(page + 1)
                if (res.data.current_page === res.data.total_page) {
                    setHasMore(false)
                }
            }
        })
    }

    const loadMore = async () => {
        if (page > 1) {
            await loadMoreOrder()
        }
    }
    return (
        <div className="trade-log-wrapper">
            <div className="title">交易日志</div>
            {
                list.map((item, index) => {
                    return (
                        <div className='log-item' key={index}>
                            <div className='message'>{item.message}</div>
                            <div className='time'>
                                <span>时间：{item.time}</span>
                            </div>
                        </div>
                    )
                })
            }
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={50} />
        </div>
    )
}