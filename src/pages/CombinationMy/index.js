import { useState ,useEffect} from 'react'
import { Link ,useNavigate ,useParams} from 'react-router-dom'

import './index.scss'

import ComposeMy from './Component/ComposeMy'
// import ComposeDeploy from './Component/ComposeDeploy'
import ComposeSub from './Component/ComposeSub'
import ComposeRank from './Component/ComposeRank'

export default function CombinationMy() {
    const navigate = useNavigate()
    const params = useParams()
    const [tab, setTab] = useState(['我的组合', '订阅的组合','组合排行'])
    const [tabIndex, setTabIndex] = useState(-1)

    const changeTab = (index) => {
        setTabIndex(index)
        navigate('/compose/' + index)
    }

    useEffect(() => {
        const id = Number(params.id)
        setTabIndex(id)

    }, [])

    return (
        <div className="component-my-wrapper">
            <div className="tab-list">
                {tab.map((item, index) => {
                    return (
                        <div className={tabIndex === index ? 'active' : ""} key={item} onClick={() => changeTab(index)}>{item}</div>
                    )
                })}
            </div>
            <div className="component-list">
                {tabIndex === 0 ? <ComposeMy /> : null}
                {tabIndex === 1 ? <ComposeSub /> : null}
                {tabIndex === 2 ? <ComposeRank /> : null}
            </div>
        </div>
    )
}