
import { useState, useEffect } from "react"
import { connect } from 'react-redux'
import { useParams ,useNavigate} from "react-router-dom"
import { Checkbox } from "antd-mobile-v5"
import { changeMarket ,chooseMarket} from "../../actions"

import './index.scss'

function IndicateList(props) {
    const params = useParams()
    const navigate = useNavigate()
    const [list, setList] = useState([])
    const [name, SetName] = useState("")

    useEffect(() => {
        let market = JSON.parse(localStorage.getItem('market'))
        console.log(market)
        const id = params.id
        market.forEach(item => {
            if (item.key === id) {
                SetName(item.value)
                setList(item.data)
            }
        })

    }, [])

    const onSelect = (value)=>{
        props.changeMarket({
            type:params.id,
            data:value
        })
        
    }

    const onSelectItem=(checked,item)=>{
        props.chooseMarket({ checked: checked, value: item })
    }

    return (
        <div className="area-list-wrapper">
            <div className="area-name">{name}</div>
            <Checkbox.Group
                value={props[params.id]}
                onChange={val => {
                    onSelect(val)
                }}
            >
                {list.map((item, index) => {
                    return (
                        <div key={index} className="area-item">
                            <span>{item.name}</span>
                            <Checkbox value={item.name} onChange={(checked)=>onSelectItem(checked,item)}></Checkbox>
                        </div>
                    )
                })}
            </Checkbox.Group>

            <div className="footer-btn" onClick={()=>navigate(-1)}>确定</div>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        market: state.pickStock.market,
        industry: state.pickStock.industry,
        concept: state.pickStock.concept,
        area: state.pickStock.area,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeMarket:(data)=>{
            dispatch(changeMarket(data))
        },
        chooseMarket:(data)=>{
            dispatch(chooseMarket(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(IndicateList)