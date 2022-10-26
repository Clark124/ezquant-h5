import { useState ,useEffect} from 'react'
import { Link, useNavigate ,useParams} from 'react-router-dom'
import './index.scss'
import ConditionList from './Component/ConditionList'
import ScanList from './Component/ScanList'
import ClassicList from './Component/ClassicList'
import SubscibeList from './Component/SubscribeList'

function PickStock() {
    const navigate = useNavigate()
    const params = useParams()
    const [tabIndex, setTabIndex] = useState(0)
    const [tabList] = useState(['经典','我的', '订阅'])

    const changeTab = (index) => {
        setTabIndex(index)
        navigate('/stockpick/' + index)
    }

    useEffect(() => {
        const id = Number(params.id)
        setTabIndex(id)

    }, [])


    const navScanDetail = () => {
        navigate('/scanDetail/123')
    }
    return (
        <div className="pick-stock-list-wrapper">
            <div className="head-tab-list">
                {tabList.map((item, index) => {
                    return (
                        <span className={tabIndex === index ? 'active' : ""} key={item} onClick={() => changeTab(index)}>{item}</span>
                    )
                })}
            </div>
            {tabIndex === 0 ? <ClassicList /> : null}
            {/* {tabIndex === 0 ? <ConditionList /> : null} */}

            {tabIndex === 1 ? <ConditionList /> : null}
            {tabIndex === 2 ? <SubscibeList /> : null}



        </div>
    )
}

export default PickStock