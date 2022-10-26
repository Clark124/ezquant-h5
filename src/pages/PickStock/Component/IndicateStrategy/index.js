
import { useState, useEffect } from "react"
import { connect } from 'react-redux'
import { useParams, useNavigate } from "react-router-dom"
import { Radio } from "antd-mobile-v5"
import { selectedIndicate, chooseIndicate,selectedStrategy } from "../../actions"
import moment from "moment"
import { quantHotStrategy, strategyList } from '../../../../service/strategy'

import './index.scss'

function IndicateList(props) {
    const params = useParams()
    const navigate = useNavigate()
    const [tabIndex, setTabIndex] = useState(0)
    const [myStrategy, setMyStrategy] = useState([])
    const [hotStrategy, setHotStrategy] = useState([])


    useEffect(() => {
        getMyStrategy()

    }, [])

    const getHotStrategy = () => {
        quantHotStrategy({
            page_no: 1,
            page_count: 50,
        }).then(res => {
            if (res.retCode === 0) {
                setHotStrategy(res.data.list)
            }
        })
    }

    const getMyStrategy = () => {
        strategyList().then(res => {
            if (res.retCode === 0) {
                setMyStrategy(res.data.list)
            }
        })
    }



    const onSelectItem = (value, data) => {

    }

    const onChangeTab = (index) => {
        setTabIndex(index)
        if (index === 0 && myStrategy.length === 0) {
            getMyStrategy()
        }
        if (index === 1 && hotStrategy.length === 0) {
            getHotStrategy()
        }
    }

    const onChangeRadio = (e) => {
        console.log(e)
    }

    const onChangeRadioItem = (e)=>{
        props.selectedStrategy({id:e.id,strategy:e})
    }

    const onCancel = ()=>{
        props.selectedStrategy({id:"",strategy:{}})
        navigate(-1)

    }

    return (
        <div className="area-list-wrapper">
            <div className="area-name">策略选股</div>
            <div className="tab-wrapper">
                <span className={tabIndex === 0 ? 'active' : ''} onClick={() => onChangeTab(0)}>我的策略</span>
                <span className={tabIndex === 1 ? 'active' : ''} onClick={() => onChangeTab(1)}>热门策略排行榜</span>
            </div>
            {tabIndex === 0 ?
                <div className="my-strategy-wrap">
                    <div className="head">
                        <span>策略名字</span>
                        <span>选择</span>
                    </div>
                    <div className="strategy-list">
                        <Radio.Group onChange={onChangeRadio} value={props.selectedStrategyId}>
                            {myStrategy.map((item, index) => {
                                return (
                                    <div className="strategy-item" key={index}>
                                        <span>{item.name}</span>
                                        <Radio value={item.id} onChange={()=>onChangeRadioItem(item)}></Radio>
                                    </div>
                                )
                            })}
                        </Radio.Group>
                    </div>

                </div> :
                <div className="hot-strategy-wrap">
                    <div className="head">
                        <span>策略名字(作者)</span>
                        <span>选择</span>
                    </div>
                    <div className="strategy-list">
                        <Radio.Group onChange={onChangeRadio}  value={props.selectedStrategyId}>
                            {hotStrategy.map((item, index) => {
                                return (
                                    <div className="strategy-item" key={index}>
                                        <span>{item.name} ({item.nickname})</span>
                                        <Radio value={item.id} onChange={()=>onChangeRadioItem(item)}></Radio>
                                    </div>
                                )
                            })}
                        </Radio.Group>
                    </div>
                </div>
            }

            <div className="footer-btn" >
                <div className="cancel-btn" onClick={() => onCancel()}>取消</div>
                <div className="confirm-btn" onClick={() => navigate(-1)}>确定</div>
            </div>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        indicates: state.pickStock.indicates,
        quote: state.traderoom.quote,
        stockCode: state.traderoom.code,
        selectedStrategyId:state.pickStock.selectedStrategyId,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectedIndicate: (data) => {
            dispatch(selectedIndicate(data))
        },
        chooseIndicate: (data) => {
            dispatch(chooseIndicate(data))
        },
        selectedStrategy:(data)=>{
            dispatch(selectedStrategy(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(IndicateList)