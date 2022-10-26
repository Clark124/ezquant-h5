import { useState } from 'react'
import { connect } from 'react-redux'
import './index.scss'
import { Checkbox } from "antd-mobile-v5"
import { useNavigate } from "react-router-dom"
import { getPoolCodeList } from '../../../../service/pickStock'
import { setPoolId, setPoolSelectedCode } from '../../actions'

function PoolList(props) {
    const navigate = useNavigate()

    const [selectedPool, setSelectedPool] = useState([])

    const [codeList, setCodeList] = useState([])


    const selectPool = (e) => {
        const id = e.id
        let list = []
        if (props.selectedPoolId.includes(id)) {
            list = props.selectedPoolId.filter(item => item !== id)

        } else {
            list = [...props.selectedPoolId, id]

        }

        props.setPoolId(list)



        const data = {
            pageSize: 1000,
            pageNum: 1,
            refId: list.join(',')
        }
        getPoolCodeList(data).then(res => {
            let list = res.data.list
            list = list.filter(item => item.type === 'stk')
            props.setPoolSelectedCode(list)
            // this.setState({ stkPoolSelectCode: [...list] })
        })
    }

    const handleDelCode = (index) => {
        // let { stkPoolSelectCode } = this.state;
        // stkPoolSelectCode.splice(index, 1);
        // this.setState({ stkPoolSelectCode })
    }

    return (
        <div className='pool-list-wrapper'>
            <div className='area-name'>股票池</div>
            <div className='list-wrapper'>
                {props.poolList.map((item, index) => {
                    return (
                        <div className={props.selectedPoolId.includes(item.id) ? "area-item active" : "area-item"} key={index} onClick={() => selectPool(item)}>
                            <span>{item.name}</span>
                        </div>
                    )
                })}
            </div>
            {
                props.poolSelectCode.length > 0 ?
                    <div className='selected-market'>
                        {props.poolSelectCode.map((item, index) => {
                            return (
                                <div className='market-item' key={index}>
                                    {item.name}
                                </div>
                            )
                        })}

                    </div> : null

            }



            <div className="footer-btn" onClick={() => navigate(-1)}>确定</div>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        poolList: state.pickStock.poolList,
        selectedPoolId: state.pickStock.selectedPoolId,
        poolSelectCode: state.pickStock.poolSelectCode,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPoolId: (data) => {
            dispatch(setPoolId(data))
        },
        setPoolSelectedCode: (data) => {
            dispatch(setPoolSelectedCode(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PoolList)