import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'

import { Radio } from 'antd-mobile-v5'
import {setStrategyIndex} from '../../actions'

function StrategyList(props) {
    const navigate = useNavigate()
    return (
        <div className="strategy-list-wrapper">
            <div className='title'>我的策略</div>
            <div className='strategy-list'>
                <Radio.Group onChange={(e) => {
                    props.myStrategyList.forEach((item,index)=>{
                        if(e===item.id){
                            props.setStrategyIndex(index)
                        }
                    })
                }} value={props.myStrategyList[props.strategyIndex].id}>
                    {props.myStrategyList.map((item, index) => {
                        return (
                            <div className='strategy-item' key={item.id}>
                                {item.name}
                                <Radio value={item.id}/>
                            </div>
                        )
                    })}
                </Radio.Group>

            </div>
            <div className='footer-btn' onClick={()=>navigate(-1)}>确定</div>
        </div>
    )
}



const mapStateToProps = (state) => {
    return {
        myStrategyList: state.traderoom.myStrategyList,
        strategyIndex: state.traderoom.strategyIndex
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setStrategyIndex: (data) => {
            dispatch(setStrategyIndex(data))
        },
       
    }
} 


export default connect(mapStateToProps, mapDispatchToProps)(StrategyList)

