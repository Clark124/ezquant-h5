import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import './index.scss'

import MyBuild from './Component/MyBuild'
import TrustList from './Component/TrustList'
import PublicList from './Component/PublicList'
import SubscribList from './Component/SubscribList'
import CollectedList from './Component/CollectedList'

function SelectTime() {
    const params = useParams()
    const navigate = useNavigate()
    const [tabIndex, setTabIndex] = useState("")
    const [tabList] = useState(['我的', '托管', '发布', '跟单', '收藏'])

    const changeTab = (index) => {
        setTabIndex(index)
        navigate('/selectTime/' + index)

    }

    useEffect(() => {
        const id = Number(params.id)
        setTabIndex(id)

    }, [])

    return (
        <div className="select-time-list-wrapper">
            <div className="head-tab-list">
                {tabList.map((item, index) => {
                    return (
                        <span className={tabIndex === index ? 'active' : ""} key={item} onClick={() => changeTab(index)}>{item}</span>
                    )
                })}

            </div>
            {tabIndex === 0 ? <MyBuild /> : null}
            {tabIndex === 1 ? <TrustList /> : null}
            {/* 发布 */}
            {tabIndex === 2 ? <PublicList /> : null}

            {/* 订阅 */}
            {tabIndex === 3 ?
            
                <SubscribList />
                : null
            }

            {tabIndex === 4 ? <CollectedList /> : null}
        </div>
    )
}

export default SelectTime