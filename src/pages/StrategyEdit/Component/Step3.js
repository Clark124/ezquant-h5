import { useEffect, useState } from "react"

import { Radio, Modal, ActionSheet, Toast } from 'antd-mobile-v5'



export default function Step3(props) {
    const [repeatIndex, setRepeatIndex] = useState(0)
    const [countSetIndex, setCountIndex] = useState(0)
    const [saveModalVisible, setSaveModalVisible] = useState(false)
    const [actionVisible, setActionVisible] = useState(false)
    const [riskValue, setRiskValue] = useState('百分比止盈止损')
    const [riskManage, setRiskManage] = useState({
        capital_ratio: 100,
        lots: '',
        max_position_time: '',
        min_position_time: '',
        profit_ratio: '',
        loss_ratio: '',
        profit_tick: '',
        loss_tick: '',
        move_loss_ratio: '',
        strategyName: "",
        discribe: ""
    })

    const action = [
        {
            text: "百分比止盈止损",
            key: 'rate',
            onClick: () => {
                setRiskValue('百分比止盈止损')
                setActionVisible(false)
            }
        },
        {
            text: "固定tick止盈止损",
            key: "tick",
            onClick: () => {
                setRiskValue('固定tick止盈止损')
                setActionVisible(false)
            }
        }

    ]

    useEffect(() => {
        if (props.riskParams.strategyName) {
            setRiskManage({...props.riskParams})
            setRepeatIndex(props.riskParams.is_repeat)
            setCountIndex(props.riskParams.buy_count)
            if(props.riskParams.risk_type===0){
                setRiskValue("百分比止盈止损")
            }else{
                setRiskValue("固定tick止盈止损")
            }
        }
    }, [])

    const onConfirm = () => {
        if (riskManage.strategyName.trim() === '') {
            Toast.show({
                icon: "fail",
                content: "请输入策略名称"
            })
            return
        }
        const { strategyName, discribe, } = riskManage
      
        const data = {
            ...riskManage,
            buy_count: countSetIndex,
            is_repeat: repeatIndex,
            risk_type: riskValue === '百分比止盈止损' ? 0 : 1,
        }
    
        props.onConfrim(data)

    }

    const onChangeValue = (value, type) => {
        let riskData = riskManage
        riskData[type] = value
        setRiskManage({ ...riskData })
    }

    return (
        <div className="risk-wrapper">
            <div className="title">
                风险管理指标<span className="tip">(不填表示不做限制)</span>
            </div>
            <div className="is-repeat">
                <span className="text">是否可重复买入</span>
                <Radio.Group
                    value={repeatIndex}
                    onChange={val => {
                        setRepeatIndex(val)
                    }}
                >
                    <Radio value={0} style={{ marginRight: 30, '--font-size': '15px' }}>否</Radio>
                    <Radio value={1} style={{ '--font-size': '15px' }}>是</Radio>
                </Radio.Group>
            </div>
            <div className="set-count-title">买入数量设置</div>
            <div className="radio-group">
                <Radio.Group
                    value={countSetIndex}
                    onChange={val => {
                        setCountIndex(val)
                    }}
                >
                    <div>
                        <Radio value={0} style={{ '--font-size': '15px', }}>按资金比例买入</Radio>
                        <input type="number" className="input" value={riskManage.capital_ratio} onChange={(e) => onChangeValue(e.target.value, 'capital_ratio')} />%

                    </div>
                    <div style={{ marginTop: 15 }}>
                        <Radio value={1} style={{ '--font-size': '15px', }}>按固定手数买入</Radio>
                        <input type="number" className="input" value={riskManage.lots} onChange={(e) => onChangeValue(e.target.value, 'lots')} />
                    </div>
                </Radio.Group>
            </div>

            <div className="input-item">
                <span className="input-text">最短持仓时间</span>
                <input type="number" className="input" value={riskManage.min_position_time} onChange={(e) => onChangeValue(e.target.value, 'min_position_time')} />天
            </div>
            <div className="input-item">
                <span className="input-text">最长持仓时间</span>
                <input type="number" className="input" value={riskManage.max_position_time} onChange={(e) => onChangeValue(e.target.value, 'max_position_time')} />天
            </div>
            <div className="input-item">
                <span className="input-text">风控方式</span>
                <span className="risk-value" onClick={() => setActionVisible(true)}>{riskValue}</span>
                <ActionSheet
                    visible={actionVisible}
                    actions={action}
                    onClose={() => setActionVisible(false)}
                />

            </div>
            {riskValue === '百分比止盈止损' ?
                <>
                    <div className="input-item">
                        <span className="input-text">止盈比例</span>
                        <input type="number" className="input" value={riskManage.profit_ratio} onChange={(e) => onChangeValue(e.target.value, 'profit_ratio')} />%
                    </div>
                    <div className="input-item">
                        <span className="input-text">止损比例</span>
                        <input type="number" className="input" value={riskManage.loss_ratio} onChange={(e) => onChangeValue(e.target.value, 'loss_ratio')} />%
                    </div>
                </> :
                <>
                    <div className="input-item">
                        <span className="input-text">止盈tick数</span>
                        <input type="number" className="input" value={riskManage.profit_tick} onChange={(e) => onChangeValue(e.target.value, 'profit_tick')} />
                    </div>
                    <div className="input-item">
                        <span className="input-text">止损tick数</span>
                        <input type="number" className="input" value={riskManage.loss_tick} onChange={(e) => onChangeValue(e.target.value, 'loss_tick')} />
                    </div>
                </>
            }

            <div className="input-item">
                <span className="input-text">移动止损</span>
                <input type="number" className="input" value={riskManage.move_loss_ratio} onChange={(e) => onChangeValue(e.target.value, 'move_loss_ratio')} />%
            </div>

            {/* <div className="strategy-name-discirbe">
               
            </div>
            <div className="input-item">
                <span className="strategy-name-text" style={{"marginRight":"30px"}}>名称</span>
                <input type="text" className="input" />
            </div>
            <div className="area-item">
                <span className="input-text">描述</span>
                <textarea type="text" className="text-area" />
            </div> */}


            <div className="strategy-create-btn-wrapper">
                <div className="next-btn" onClick={() => props.setStepIndex(1)}>
                    上一步
                </div>
                <div className="next-btn" onClick={() => setSaveModalVisible(true)}>
                    保存
                </div>
            </div>

            <Modal
                visible={saveModalVisible}
                content={(
                    <div className="save-modal">
                        <div className="save-modal-title">
                            给策略取个名字吧
                        </div>
                        <textarea placeholder="请输入不超过20个字符" className="area-input" value={riskManage.strategyName} onChange={(e) => onChangeValue(e.target.value, "strategyName")}></textarea>
                        <div className="save-modal-title" style={{ marginTop: 20 }}>
                            简单介绍下该策略吧
                        </div>
                        <textarea placeholder="请输入不超过200个字符" className="area-input" value={riskManage.discribe} onChange={(e) => onChangeValue(e.target.value, "discribe")}></textarea>
                    </div>
                )}
                closeOnMaskClick={true}
                closeOnAction
                onClose={() => {
                    setSaveModalVisible(false)
                }}
                actions={[
                    {
                        key: 'confirm',
                        text: '保存',
                        primary: true,
                        onClick: () => {
                            onConfirm()
                        }
                    },
                    {
                        key: 'cancel',
                        text: '取消',
                    },

                ]}
            />

        </div>
    )
}