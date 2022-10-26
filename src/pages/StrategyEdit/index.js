import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import './index.scss'
import { connect } from 'react-redux'

import { listAllTypeById, strategyBuilderSave, strategyBuildDetail } from '../../service/strategy'
import Step1 from './Component/Step1'
import Step2 from './Component/Step2'
import Step3 from './Component/Step3'
import { Toast } from 'antd-mobile-v5'
import { useNavigate } from 'react-router-dom'



function StrategyCreate(props) {
    const params = useParams()
    const navigate = useNavigate()
    const [strategyId, setStrategyId] = useState("")
    const [stepIndex, setStepIndex] = useState(0)
    const [stepList1, setStepList1] = useState([])
    const [stepList2, setStepList2] = useState([])
    const [indicateList, setIndicateList] = useState([])
    const [startDateValue1, setStartDateValue1] = useState(moment().subtract(1, 'months').format('YYYY-MM-DD'))
    const [endDateValue1, setEndDateValue1] = useState(moment().format('YYYY-MM-DD'))
    const [startDateValue2, setStartDateValue2] = useState(moment().subtract(1, 'months').format('YYYY-MM-DD'))
    const [endDateValue2, setEndDateValue2] = useState(moment().format('YYYY-MM-DD'))
    const [riskParams, setRiskParams] = useState({})

    useEffect(async () => {
        const indicates = await getIndicateList()
        getInit(indicates)

    }, [])

    const getInit = (indicates) => {
        const id = params.id
        strategyBuildDetail({ id }).then(res => {

            let riskParams = res.data.params ? JSON.parse(res.data.params) : {}
            console.log(riskParams)
            riskParams.strategyName = res.data.name
            riskParams.discribe = res.data.description
            setRiskParams(riskParams)


            let technicalBuy = res.data.technicalBuy
            let technicalSell = res.data.technicalSell

            technicalBuy.forEach((item, index) => {
                indicates.forEach(indicateItem => {
                    if (item.pId === indicateItem.pId) {
                        let itemSp = item.sp.split(',')
                        let parameter = JSON.parse(indicateItem.sp)
                        let inputArr = item.value.split('~')
                        if(indicateItem.compareSign==='='){
                            inputArr = [1,1]
                        }
                        parameter.forEach((parameterItem, parameterIndex) => {
                            parameterItem.value = itemSp[parameterIndex]
                        })

                        technicalBuy[index] = {
                            ...indicateItem,
                            sp: parameter ? JSON.stringify(parameter) : '',
                            operator: '~',
                            inputArr: inputArr,
                            selectOptions:item.selectOptions
                        }
                        if (item.selectOptions) {
                            let region = JSON.parse(indicateItem.region)
                            region.forEach((regionItem, regionIndex) => {
                                if (regionItem.value === item.selectOptions) {
                                    technicalBuy[index].regionIndex = regionIndex
                                }
                            })

                        }
                    }
                })
            })
            technicalSell.forEach((item, index) => {
                indicates.forEach(indicateItem => {
                    if (item.pId === indicateItem.pId) {
                        let itemSp = item.sp.split(',')
                        let parameter = JSON.parse(indicateItem.sp)
                        let inputArr = item.value.split('~')
                        if(indicateItem.compareSign==='='){
                            inputArr = [1,1]
                        }
                        parameter.forEach((parameterItem, parameterIndex) => {
                            parameterItem.value = itemSp[parameterIndex]
                        })
                        technicalSell[index] = {
                            ...indicateItem,
                            sp: parameter ? JSON.stringify(parameter) : '',
                            operator: '~',
                            inputArr: inputArr,
                            selectOptions:item.selectOptions
                        }
                        if (item.selectOptions) {
                            let region = JSON.parse(indicateItem.region)
                            region.forEach((regionItem, regionIndex) => {
                                if (regionItem.value === item.selectOptions) {
                                    technicalSell[index].regionIndex = regionIndex
                                }
                            })

                        }

                    }
                })
            })
            setStepList1(technicalBuy)
            setStepList2(technicalSell)
        })
    }

    const getIndicateList = () => {
        return new Promise((resolve, reject) => {
            listAllTypeById({ id: 0 }).then(res => {
                let dataList = res.filter(item => item.tId === 6)
                setIndicateList(dataList)
                resolve(dataList)
            })
        })

    }

    const updateSelectItem1 = (value, index) => {
        let arr = JSON.parse(JSON.stringify(stepList1))
        arr[index] = value
        setStepList1(arr)
    }

    const updateSelectItem2 = (value, index) => {
        let arr = JSON.parse(JSON.stringify(stepList2))
        arr[index] = value
        setStepList2(arr)
    }

    const onConfrim = (riskValue) => {
       
        const strategyName = riskValue.strategyName
        const description = riskValue.discribe
        delete riskValue.strategyName
        delete riskValue.discribe

        let technicalBuyArr = []
        let technicalSellArr = []

        technicalBuyArr = stepList1.map((item, index) => {
            let parameter = '', value = item.inputArr.join('~');
            if (item.sp) {
                parameter = JSON.parse(item.sp).map(item => item.value).join(',')
            }

            if (item.region && JSON.parse(item.region).length === 1 && JSON.parse(item.region)[0].value === '~') {
                //disbable的值
                value = ''
            }

            if (item.compareSign === '=') {
                value = item.defalutValue
            }

            let result = {
                tId: item.tId,
                pId: item.pId,
                value: value,
                sp: parameter,
                operator: '~',
                type: 1
            }

            if (item.regionIndex>-1) {
                result.selectOptions = JSON.parse(item.region)[item.regionIndex].value
            }

            return result
        })

        technicalSellArr = stepList2.map((item, index) => {
            let parameter = '', value = item.inputArr.join('~');
            if (item.sp) {
                parameter = JSON.parse(item.sp).map(item => item.value).join(',')
            }

            if (item.region && JSON.parse(item.region).length === 1 && JSON.parse(item.region)[0].value === '~') {
                //disbable的值
                value = ''
            }

            if (item.compareSign === '=') {
                value = item.defalutValue
            }

            let result = {
                tId: item.tId,
                pId: item.pId,
                value: value,
                sp: parameter,
                operator: '~',
                type: 1
            }

            if (item.regionIndex>-1) {
                result.selectOptions = JSON.parse(item.region)[item.regionIndex].value
            }

            return result
        })

        let paramsValue = {
            name: strategyName,
            description: description,
            express: "",
            params: JSON.stringify(riskValue),
            strategyParams: JSON.stringify(riskValue),
            strategyType: props.marketType === 0 ? 'stk' : 'fut', //策略类型： stk：股票,fut：期货,cash：外汇
            technicalBuy: technicalBuyArr,
            technicalSell: technicalSellArr,
            type: 'build', //创建类型：build：搭建 write：自编
            id: params.id,
        }

        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0
        })
        strategyBuilderSave(paramsValue).then(res => {
            Toast.clear()
            if (res.retCode === 0) {
                Toast.show({
                    icon: "success",
                    content: "保存成功",
                    afterClose: () => {
                        navigate('/selectTime/0')
                    }
                })
            } else {
                Toast.show({
                    icon: "fail",
                    content: res.message
                })
            }
        })
    }


    return (
        <div className="strategy-create-wrapper">
            <div className="create-tab">
                <span className={stepIndex === 0 ? "active" : ""}>开仓规则</span>
                <span className={stepIndex === 1 ? "active" : ""}>平仓规则</span>
                <span className={stepIndex === 2 ? "active" : ""}>风险管理</span>
            </div>
            <div className="strategy-create-content" style={stepIndex === 2 ? { padding: 0 } : null}>
                {stepIndex === 0 ?
                    <Step1 indicateList={indicateList} setStepIndex={(value) => setStepIndex(value)}
                        setSelectedList={(list) => setStepList1(list)} selectedList={stepList1}
                        startDateValue={startDateValue1} setStartDateValue={setStartDateValue1}
                        endDateValue={endDateValue1} setEndDateValue={setEndDateValue1}
                        updateSelectItem={(value, index) => updateSelectItem1(value, index)}
                    /> : null
                }
                {stepIndex === 1 ?
                    <Step2 indicateList={indicateList} setStepIndex={(value) => setStepIndex(value)}
                        setSelectedList={(list) => setStepList2(list)} selectedList={stepList2}
                        startDateValue={startDateValue2} setStartDateValue={setStartDateValue2}
                        endDateValue={endDateValue2} setEndDateValue={setEndDateValue2}
                        updateSelectItem={(value, index) => updateSelectItem2(value, index)}
                    /> : null
                }

            </div>
            {stepIndex === 2 ?
                <Step3 setStepIndex={(value) => setStepIndex(value)} onConfrim={onConfrim} riskParams={riskParams} /> : null
            }



        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        marketType: state.traderoom.marketType,
    };
}
export default connect(mapStateToProps, null)(StrategyCreate)