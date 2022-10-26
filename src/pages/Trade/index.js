import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './index.scss'
import Order from './Component/Order'
import Position from './Component/Position'
import History from './Component/History'
import Entrust from './Component/Entrust'
import Traderoom from './Component/Traderoom'

function Trade() {
    const params = useParams()
    const navigate = useNavigate()
    const [tabIndex, setTabIndex] = useState(-1)
    const [tabList] = useState(['交易室', '订单', '持仓', '历史记录', '委托明细'])

    const changeTab = (index) => {
        setTabIndex(index)
        navigate('/trade/' + index)
    }

    useEffect(() => {
        const id = Number(params.id)
        setTabIndex(id)
    }, [])

    return (
        <div className="trade-wrapper">
            <div className="head-tab-list">
                {tabList.map((item, index) => {
                    return (
                        <span className={tabIndex === index ? 'active' : ""} key={item} onClick={() => changeTab(index)}>{item}</span>
                    )
                })}
            </div>


            <div className="trade-content">
                {tabIndex === 1 ? <Order /> : null}
                {tabIndex === 2 ? <Position /> : null}
                {tabIndex === 3 ? <History /> : null}
                {tabIndex === 4 ? <Entrust /> : null}
            </div>

            {tabIndex === 0 ? <Traderoom /> : null}

        </div>
    )
}

export default Trade