import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { comboInfoSubscribeMine } from '../../../../service/compose'
import { InfiniteScroll } from 'antd-mobile-v5'

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
            userId: userId,
            page: pageNum,
            size: pageSize,
            comboName: "",
        }
        comboInfoSubscribeMine(data).then(res => {
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
            comboName: "",
            page: pageNum,
            size: pageSize,
            userId,
        }

        return comboInfoSubscribeMine(data).then((res) => {
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
        localStorage.setItem("composeItemDetail", JSON.stringify(item))
        navigate("/composeItemDetailSub/" + item.id)
    }

    return (
        <div className="data-list-wrapper">
            <div className="data-title-list">
                <div className="data-title">名称</div>
                <div className="data-title">总收益</div>
                <div className="data-title">到期日期</div>
            </div>

            {composeList.map((item, index) => {
                return (
                    <div className="data-item" key={index} onClick={()=>navDetail(item)}>
                        <div className="userinfo" to={"/combination/"+item.id} >
                            <div className="strategy">
                                <div className="strategy-name">{item.comboName}</div>
                            </div>
                            {/* <div className="user">
                                <img src={require('../../../../asstes/images/default.jpeg')} alt="" className="avatar" />
                                <span className="username">木头不呆</span>
                            </div> */}
                        </div>
                        <div className={item.totalYieldRate>=0?"year-rate red":"year-rate green"}>{item.totalYieldRate}%</div>
                        <div className="expire-date">
                            <div className="date">{item.gmtCreate.split(' ')[0]}</div>
                            <div className="date">{item.gmtCreate.split(' ')[1]}</div>
                            {/* <Link className="set" to={"/composeSubscribeSet/"+item.id}>设置</Link> */}
                        </div>
                    </div>
                )
            })}


            {/* <Link className="data-item" to="/combination/2">
                <div className="userinfo">
                    <div className="strategy">
                        <div className="strategy-name">明珠盛宴</div>
                    </div>
                    <div className="user">
                        <img src={require('../../../../asstes/images/default.jpeg')} alt="" className="avatar" />
                        <span className="username">木头不呆</span>
                    </div>
                </div>
                <div className="year-rate red">120.25%</div>
                <div className="expire-date">
                    <div className="date">2019年3月15日</div>
                    <Link className="set" to="/composeSubscribeSet/123">设置</Link>
                </div>
            </Link> */}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={50} />
        </div>
    )
}