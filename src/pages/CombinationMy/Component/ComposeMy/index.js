import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { listMyComboInfo } from '../../../../service/compose'
import { initPickStock } from '../../../PickStock/actions'
import { changeTradeSetValue, changeRiskSetValue } from '../../actions'
import { connect } from 'react-redux'
import { InfiniteScroll } from 'antd-mobile-v5'

function ComposeMy(props) {
    const navigate = useNavigate()
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [composeList, setComposeList] = useState([])
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        let userInfo = JSON.parse(localStorage.userInfo);
        let userId = userInfo.id
        const data = {
            userId: userId,
            page: pageNum,
            size: pageSize,
            comboName: "",
        }
        listMyComboInfo(data).then(res => {
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
    }, [])

    const initPickStock = () => {
        props.initPickStock()
        props.changeRiskSetValue({type:"composeName",value:""})
        props.changeTradeSetValue({
            type: 'strategy', value: {
                strategyName: "请选择",
                confirmId: "",
                express: "",
                params: ""
            }
        })

    }

    const navDetail = (item) => {
        localStorage.setItem("composeItemDetail", JSON.stringify(item))
        navigate("/composeItemDetail/" + item.id)
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

        return listMyComboInfo(data).then((res) => {
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


    return (
        <>
            <Link className="create-btn" to="/composeCreate" onClick={initPickStock}>+ 创建组合</Link>
            <div className="data-list-wrapper">
                <div className="data-title-list">
                    <div className="data-title">名称</div>
                    <div className="data-title">状态</div>
                    <div className="data-title">总收益</div>
                </div>
                {composeList.map((item, index) => {
                    return (
                        <div className="data-item" onClick={() => navDetail(item)} key={index}>
                            <div className="userinfo">
                                <div className="strategy">
                                    <div className="strategy-name">{item.comboName}</div>
                                </div>
                            </div>
                            <div className={item.comboStatus === 1 ? "status" : "status red"}>{item.comboStatus === 1 ? '运行' : '暂停'}</div>
                            <div className="total-rate">
                                <span className={item.totalYieldRate >= 0 ? "number red" : "number green"}>{item.totalYieldRate}%</span>
                            </div>
                        </div>
                    )
                })}


            </div>
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={50} />

        </>
    )
}

const mapStateToProps = (state) => {
    return {
        marketType: state.traderoom.marketType,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        initPickStock: () => {
            dispatch(initPickStock())
        },
        changeTradeSetValue: (data) => {
            dispatch(changeTradeSetValue(data))
        },
        changeRiskSetValue:(data)=>{
            dispatch(changeRiskSetValue(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(ComposeMy)

