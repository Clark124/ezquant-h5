
import { useState, useEffect } from "react"
import { connect } from 'react-redux'
import { useParams, useNavigate } from "react-router-dom"
import { Checkbox } from "antd-mobile-v5"
import { selectedIndicate, chooseIndicate } from "../../actions"
import moment from "moment"

import './index.scss'

function IndicateList(props) {
    const params = useParams()
    const navigate = useNavigate()
    const [list, setList] = useState([])
    const [name, SetName] = useState("")

    useEffect(() => {
        let market = JSON.parse(localStorage.getItem('pickStockIndicates'))
        const id = Number(params.id)
        market.forEach(item => {
            if (item.tId === id) {
                SetName(item.value)
                setList(item.data)
            }
        })

    }, [])

    const onSelect = (value) => {
        const arr = value.map(item => {
            let result = {}
            list.forEach(indicate => {
                if (indicate.value === item) {
                    result = indicate
                }
            })
            return result
        })

        props.selectedIndicate({ type: name, data: value, arr })

    }

    const onSelectItem = (value, data) => {
        if (value&&data.value === '相似k线') {
            let sp = JSON.parse(data.sp)
            sp.forEach(item => {
                if (item.name === 'prod_code') {
                    item.value = props.stockCode
                }
                if (item.name === 'start_date') {
                    item.value = moment().subtract(1, 'months').format('YYYYMMDD')
                }
                if (item.name === 'end_date') {
                    item.value = moment().format('YYYYMMDD')
                }
            })
            data.sp = JSON.stringify(sp)
        }
        props.chooseIndicate({ checked: value, value: data })
    }

    return (
        <div className="area-list-wrapper">
            <div className="area-name">{name}</div>
            <Checkbox.Group
                value={props.indicates[name]}
                onChange={val => {
                    onSelect(val)
                }}
            >
                {list.map((item, index) => {
                    return (
                        <div key={index} className="area-item">
                            <span>{item.value}</span>
                            <Checkbox value={item.value} onChange={(value) => onSelectItem(value, item)}></Checkbox>
                        </div>
                    )
                })}
            </Checkbox.Group>

            <div className="footer-btn" onClick={() => navigate(-1)}>确定</div>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        indicates: state.pickStock.indicates,
        quote: state.traderoom.quote,
        stockCode: state.traderoom.code,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectedIndicate: (data) => {
            dispatch(selectedIndicate(data))
        },
        chooseIndicate: (data) => {
            dispatch(chooseIndicate(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(IndicateList)