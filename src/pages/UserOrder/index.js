import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'
import moment from 'moment'
import { PullToRefresh, InfiniteScroll ,Toast} from 'antd-mobile-v5'

import { queryPoint, orderList, } from '../../service/index'

export default function UserOrder() {
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [point, setPoint] = useState(0)
    const [dataList, setDataList] = useState([])
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        onQueryPoint()
        getOrderList()
    }, [])

    const onQueryPoint = () => {
        let userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            userInfo = JSON.parse(userInfo)
            queryPoint({ userId: userInfo.id }).then(res => {
                setPoint(res)
            }).catch(err=>{
                console.log(err)
            })
        }
    }

    const getOrderList = () => {
        orderList({ pageNum: pageNum, pageSize: pageSize }).then((res) => {
            if (res.retCode === 0) {
                setDataList(res.data.list)
                setPageNum(2)
                if (res.data.isLastPage) {
                    setHasMore(false)
                }
            }
        })
    }

    const loadMoreOrder = () => {
        return orderList({ pageNum: pageNum, pageSize: pageSize }).then((res) => {
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

    const refreshData = async () => {
        await orderList({ pageNum: 1, pageSize: pageSize }).then((res) => {
            if (res.retCode === 0) {
                setDataList(res.data.list)
                setPageNum(2)
                if (res.data.isLastPage) {
                    setHasMore(false)
                }
            }
        }).catch(err => {
            Toast.show({
                icon: 'fail',
                content: '????????????',
            })
        })
    }

    return (
        <div className="user-order-wrapper">
            <div className="title">
                <span>???????????????{point}</span>
                <Link to="/userBuyIntegrate" className="buy-integrate-btn">????????????</Link>
            </div>
            <PullToRefresh
                onRefresh={refreshData}
            >
                {dataList.map((item, index) => {
                    return (
                        <div className="order-item" key={index}>
                            <div className="order-into">
                                <div className="order-text">????????????</div>
                                <div> {moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')}</div>
                            </div>
                            <div className="order-into">
                                <div className="order-text">????????????</div>
                                <div>{item.orderNo}</div>
                            </div>
                            <div className="order-into">
                                <div className="order-text">??????</div>
                                <div>{item.type}</div>
                            </div>
                            <div className="order-into">
                                <div className="order-text">????????????</div>
                                <div>{item.money}???</div>
                            </div>
                            <div className="order-into">
                                <div className="order-text">????????????</div>
                                <div>{item.update}</div>
                            </div>
                        </div>
                    )
                })}

            </PullToRefresh>
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={50} />

        </div>
    )
}