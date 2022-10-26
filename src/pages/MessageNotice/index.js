import React,{useEffect,useState} from 'react'
// import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile-v5'
import './index.scss'

import {messageCenter,messageAllRead} from '../../service/index'

import { InfiniteScroll } from 'antd-mobile-v5'

export default function MessageEarlyWarning(){
    const [dataList,setDataList] = useState([])
    const [pageSize, setPage] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    useEffect(()=>{
        getInit()
    },[])

    
    const getInit = () => {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"))
       
        messageCenter({ userId:userInfo.id, size:pageSize, page:pageNum }).then(res => {
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
            userId:userId, size:pageSize, page:pageNum
        }

        return messageCenter(data).then((res) => {
            if (res.code === 200) {
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

    const handleRead = () => {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"))
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration:0,
            maskClickable:false
          })
        messageAllRead({userId:userInfo.id}).then(res => {
            Toast.clear()
            if (res.code === 200) {
                Toast.show({
                    icon:"success",
                    content:"全部已读"
                })
            }
        })
    }

    return (
        <div className="early-warning-wrapper">
            {dataList.map((item,index)=>{
                return (
                    <div className="early-warning-item">
                    <div className="date">{item.time}</div>
                    <div className="early-warning-info">
                        <div className="early-warning-name">
                            <span>{item.title}</span>
                        </div>
                        <div className="content">
                            {item.message}
                        </div>
                    </div>
                </div>
                )
            })}
             {dataList.length === 0 ?
                <div className='no-data'>暂无数据</div> : null
            }
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={50} />
           
            <div className='bottom-btn' onClick={handleRead}>全部标记已读</div>
        </div>
    )
}