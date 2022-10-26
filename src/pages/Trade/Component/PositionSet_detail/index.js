import { useState ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { Radio } from 'antd-mobile-v5'

import './index.scss'

function PositionSet() {
    const navigate = useNavigate()
    const [positionValue, setPositionValue] = useState('isFull')
    const [positionData, setPositionData] = useState({
        isFull: true, //是否全仓
        fullPositonMulPercent: 100,
        isFixedRate: false,
        fixedPositonMulPercent: 10, //固定资金比例
        fixedPostionCount: 100, //固定股数
        isDynamicKelly: false,
        initObvPositionMulPercent: 0,
        observationPeriod: 10,
        isMartin: false,
        martinFirstPositonMulPercent: 10,
        isAntiMartin: false,
        antiMartinFirstPositonMulPercent: 10,
    })

    useEffect(()=>{
        getLocalPositionData()
    },[])

    const getLocalPositionData = ()=>{
        const data = JSON.parse(localStorage.getItem('positionData_detail'))
        const value = JSON.parse(localStorage.getItem('positionValue_detail'))
        setPositionData(data)
        setPositionValue(value)
    }

    const onChangeInput = (value, type) => {
        setPositionData({ ...positionData, [type]: value })
    }

    const onConfirm = ()=>{
        navigate(-1)
    }

    return (
        <div className='position-set-wrapper'>
            <div className='title'>仓位设置</div>

            <div className='position-set-list'>
                <Radio.Group value={positionValue} onChange={(e) => {
                    setPositionValue(e)
                }} disabled>
                    <div className='position-set-item'>
                        <span>全仓</span>
                        <Radio value={'isFull'} />
                    </div>
                    <div className='position-set-item'>
                        <span>半仓</span>
                        <Radio value={'isHalfFull'} />
                    </div>
                    <div className='position-set-item'>
                        <div>
                            <span>资金比例(%)：</span>
                            <input type="number" value={positionData.fixedPositonMulPercent} onChange={(e) => { onChangeInput(e.target.value, 'fixedPositonMulPercent') }}
                                placeholder="请输入资金比例" className='position-input' disabled/>

                        </div>

                        <Radio value={'isFixedRate'} />
                    </div>
                    <div className='position-set-item'>
                        <div>
                            <span>固定股数：</span>
                            <input type="number" value={positionData.fixedPostionCount} onChange={(e) => { onChangeInput(e.target.value, 'fixedPostionCount') }}
                                placeholder="请输入固定股数" className='position-input' disabled/>

                        </div>
                        <Radio value={'isFixedCount'} />
                    </div>

                    <div className='position-set-item'>
                        <div>
                            <div style={{ 'marginBottom': 7 }}>动态凯利：</div>
                            <div style={{ 'marginBottom': 7 }}>
                                <span>观察期下单比例(%)：</span>
                                <input type="number" value={positionData.initObvPositionMulPercent} onChange={(e) => { onChangeInput(e.target.value, 'initObvPositionMulPercent') }}
                                    placeholder="请输入观察期下单比例" className='position-input' disabled/>
                            </div>
                            <div>
                                <span>最小观察周期(正整数)：</span>
                                <input type="number" value={positionData.observationPeriod} onChange={(e) => { onChangeInput(e.target.value, 'observationPeriod') }}
                                    placeholder="请输入最小观察周期" className='position-input' disabled/>
                            </div>
                        </div>

                        <Radio value={'isDynamicKelly'} />
                    </div>

                    <div className='position-set-item'>
                        <div>
                            <span>马丁加仓 初始仓位(%)：</span>
                            <input type="number" value={positionData.martinFirstPositonMulPercent} onChange={(e) => { onChangeInput(e.target.value, 'martinFirstPositonMulPercent') }}
                                placeholder="请输入初始仓位比例" className='position-input' disabled/>
                        </div>
                        <Radio value={'isMartin'} />
                    </div>

                    <div className='position-set-item'>
                        <div style={{ "display": 'flex' }}>
                            <span>反马丁加仓 初始仓位(%)：</span>
                            <input type="number" value={positionData.antiMartinFirstPositonMulPercent} onChange={(e) => { onChangeInput(e.target.value, 'antiMartinFirstPositonMulPercent') }}
                                placeholder="请输入初始仓位比例" className='position-input' disabled/>
                        </div>
                        <Radio value={'isAntiMartin'} />
                    </div>

                </Radio.Group>

            </div>

            <div className='footer-btn' onClick={() => onConfirm()}>确定</div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        account: state.traderoom.account,
        accountList: state.traderoom.accountList,
        marketType: state.traderoom.marketType,
        myStrategyList: state.traderoom.myStrategyList,
        strategyIndex: state.traderoom.strategyIndex,
        quote: state.traderoom.quote
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        // setMyStrategyList: (data) => {
        //     dispatch(setMyStrategyList(data))
        // },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionSet)