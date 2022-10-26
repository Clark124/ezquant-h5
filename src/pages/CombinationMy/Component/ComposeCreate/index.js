import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PickStrock from '../../../PickStock/Component/PickStockCreate'
import { listAllTypeById, listAllType, listSelectMarket, listAllIndustryType, listAllConceptType, listAllRegionalType } from '../../../../service/pickStock'
import { comboInfoDetailEdit } from '../../../../service/compose'
import { connect } from 'react-redux'
import { selectedIndicate, setIndicate, setIndicateArr, setMarketArr, setMarketObj } from '../../../PickStock/actions'
import { changeFirstEditStatus, changeTradeSetValue, updateTradeSetting, updateSelectTime, updateRiskSet, setComposeId } from '../../actions'
import { Toast } from 'antd-mobile-v5'
import './index.scss'

function ComposeStockCreate(props) {
    const params = useParams()
    const navigate = useNavigate()
    const [areaList, setAreaList] = useState([
        { value: '指定市场', key: 'market', tId: 7 },
        { value: '行业市场', key: 'industry', tId: 8 },
        { value: '概念市场', key: 'concept', tId: 10 },
        { value: '地区市场', key: 'area', tId: 9 },
    ])

    const navResult = () => {
        navigate('pickResult')
    }
    useEffect(async () => {
        if (params.id && props.isFirstEdit) {
            props.setComposeId(Number(params.id))
            Toast.show({
                icon: "loading",
                content: "加载中...",
                duration: 0,
                maskClickable: false
            })

            const indicates = await getIndicateList()
            const typeList = await getAllType()
            getMarket((areaData) => {
                getInit(indicates, typeList, areaData)
                props.changeFirstEditStatus(false)
            })

        }


    }, [])

    const getInit = (indicates, typeList, areaData) => {
        const id = params.id

        comboInfoDetailEdit({ id: id }).then(res => {
            const { selectStockParameter, strategySetting, tradeSetting, selectTimeSetting, selectStockComboxInfo, riskSetting } = res
            let selectCondition = JSON.parse(selectStockParameter.selectCondition)
            let technical = selectCondition.filter(item => item.tId < 7 || item.tId > 10)
            let selectMarket = selectCondition.filter(item => item.tId >= 7 && item.tId <= 10)

            let typeArr = {}

            technical.forEach((item, index) => {
                indicates.forEach(indicateItem => {
                    if (item.pId === indicateItem.pId) {
                        let parameter = ""
                        if (item.sp) {
                            let itemSp = item.sp.split(',')
                            parameter = JSON.parse(indicateItem.sp)
                            parameter.forEach((parameterItem, parameterIndex) => {
                                parameterItem.value = itemSp[parameterIndex]
                            })
                        }
                        let inputArr = item.value.split('~')
                        if (indicateItem.compareSign === '=') {
                            inputArr = [1, 1]
                        }

                        technical[index] = {
                            ...indicateItem,
                            sp: parameter ? JSON.stringify(parameter) : null,
                            operator: '~',
                            inputArr: inputArr,
                            selectOptions: item.selectOptions
                        }
                        if (item.selectOptions) {
                            let region = JSON.parse(indicateItem.region)
                            region.forEach((regionItem, regionIndex) => {
                                if (regionItem.value === item.selectOptions) {
                                    technical[index].regionIndex = regionIndex
                                }
                            })

                        }
                    }
                })


            })

            technical.forEach((item, index) => {
                typeList.forEach(marketItem => {
                    if (marketItem.tId === item.tId) {
                        if (typeArr[marketItem.value]) {
                            typeArr[marketItem.value].push(item.value)
                        } else {
                            typeArr[marketItem.value] = [item.value]
                        }
                    }
                })
            })

            let marketArr = []
            let marketObj = {}

            selectMarket.forEach((item) => {
                areaData.forEach(areaItem => {
                    if (item.tId === areaItem.tId) {
                        areaItem.data.forEach(dataItem => {
                            if (item.tId === 7) {
                                if (dataItem.pId === item.pId) {
                                    marketArr.push(dataItem)
                                    if (marketObj[areaItem.key]) {
                                        marketObj[areaItem.key].push(dataItem.name)
                                    } else {
                                        marketObj[areaItem.key] = [dataItem.name]
                                    }
                                }
                            } else {
                                if (dataItem.value === item.value) {
                                    marketArr.push(dataItem)
                                    if (marketObj[areaItem.key]) {
                                        marketObj[areaItem.key].push(dataItem.name)
                                    } else {
                                        marketObj[areaItem.key] = [dataItem.name]
                                    }
                                }
                            }

                        })
                    }
                })
            })

            props.setMarketArr(marketArr)
            props.setMarketObj(marketObj)

            props.setIndicateArr(typeArr)
            props.setIndicate(technical)

            props.updateTradeSetting({ ...tradeSetting, ...strategySetting })

            if (selectTimeSetting && selectTimeSetting.indicators) {
                let selectTimeIndicates = JSON.parse(selectTimeSetting.indicators)

                selectTimeIndicates.forEach((item, index) => {
                    indicates.forEach(indicateItem => {
                        if (item.pId === indicateItem.pId) {
                            let parameter = ""
                            if (item.sp) {
                                let itemSp = item.sp.split(',')
                                parameter = JSON.parse(indicateItem.sp)
                                parameter.forEach((parameterItem, parameterIndex) => {
                                    parameterItem.value = itemSp[parameterIndex]
                                })
                            }

                            let inputArr = item.value ? item.value.split('~') : ""
                            if (indicateItem.compareSign === '=') {
                                inputArr = [1, 1]
                            }

                            selectTimeIndicates[index] = {
                                ...indicateItem,
                                sp: parameter ? JSON.stringify(parameter) : null,
                                operator: '~',
                                inputArr: inputArr,
                                selectOptions: item.selectOptions
                            }
                            if (item.selectOptions) {
                                let region = JSON.parse(indicateItem.region)
                                region.forEach((regionItem, regionIndex) => {
                                    if (regionItem.value === item.selectOptions) {
                                        selectTimeIndicates[index].regionIndex = regionIndex
                                    }
                                })

                            }
                        }
                    })

                })
                selectTimeSetting.indicators = selectTimeIndicates
                props.updateSelectTime(selectTimeSetting)
            }


            props.updateRiskSet({ ...selectStockComboxInfo, ...riskSetting })

            Toast.clear()
        })

    }

    const getAllType = () => {
        return new Promise((resolve, reject) => {
            listAllType().then(res => {
                resolve(res)
            })
        })
    }

    const getIndicateList = () => {
        return new Promise((resolve, reject) => {

            listAllTypeById({ id: 0 }).then(res => {
                resolve(res)
            })
        })

    }

    const getMarket = (callback) => {
        Promise.all([
            listSelectMarket(),
            listAllIndustryType(),
            listAllConceptType(),
            listAllRegionalType(),
        ]).then(result => {
            let tabs = JSON.parse(JSON.stringify(areaList))
            tabs.forEach((item, index) => {
                item.data = result[index]

                item.data.forEach((data, i) => {
                    switch (item.key) {
                        case 'market':
                            data.tId = 7
                            data.name = data.value
                            break
                        case "industry":
                            data.tId = 8
                            break
                        case 'concept':
                            data.tId = 10
                            break
                        default:
                            data.tId = 9
                            break
                    }
                })
            })

            setAreaList(tabs)
            if (callback) {
                callback(tabs)
            }

        }).catch(error => {
            console.log(error)
        })
    }

    return (
        <div className="compose-stock-create">
            <div className="main-title">1.选择股票池</div>
            <PickStrock isCompose={true} />
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        indicates: state.pickStock.indicates,
        quote: state.traderoom.quote,
        stockCode: state.traderoom.code,
        isFirstEdit: state.compose.isFirstEdit
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectedIndicate: (data) => {
            dispatch(selectedIndicate(data))
        },
        setIndicate: (data) => {
            dispatch(setIndicate(data))
        },
        changeFirstEditStatus: (data) => {
            dispatch(changeFirstEditStatus(data))
        },
        setIndicateArr: (data) => {
            dispatch(setIndicateArr(data))
        },
        setMarketArr: (data) => {
            dispatch(setMarketArr(data))
        },
        setMarketObj: (data) => {
            dispatch(setMarketObj(data))
        },
        changeTradeSetValue: (data) => {
            dispatch(changeTradeSetValue(data))
        },
        updateTradeSetting: (data) => {
            dispatch(updateTradeSetting(data))
        },
        updateSelectTime: (data) => {
            dispatch(updateSelectTime(data))
        },
        updateRiskSet: (data) => {
            dispatch(updateRiskSet(data))
        },
        setComposeId: (data) => {
            dispatch(setComposeId(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ComposeStockCreate)