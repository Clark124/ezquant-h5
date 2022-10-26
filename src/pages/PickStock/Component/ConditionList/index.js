
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    listMyLocalSelectStock, listAllTypeById, listAllType, listSelectMarket, listAllIndustryType, listAllConceptType, listAllRegionalType,
    delteMySelectPick

} from '../../../../service/pickStock'
import { setIndicate, setIndicateArr, setMarketArr, setMarketObj, initPickStock, setStartDateValue, setEndDateValue, } from '../../actions'
import { changeCode } from '../../../Trade/actions'
import { chosenCondition } from '../../../../service/index'
import { Toast, Dialog } from 'antd-mobile-v5'
import moment from 'moment'

function ConditionList(props) {
    const navigate = useNavigate()
    const [conditionList, setConditionList] = useState([])
    const [areaList, setAreaList] = useState([
        { value: '指定市场', key: 'market', tId: 7 },
        { value: '行业市场', key: 'industry', tId: 8 },
        { value: '概念市场', key: 'concept', tId: 10 },
        { value: '地区市场', key: 'area', tId: 9 },
    ])
    const [hotCondition, setHotCondition] = useState([])

    useEffect(() => {
        getList()
        // chosenCondition().then(res => {
        //     setHotCondition(res)
        // })
    }, [])

    const getList = () => {
        let id = localStorage.userInfo ? JSON.parse(localStorage.userInfo).id : ''
        listMyLocalSelectStock({ id }).then(res => {
            setConditionList(res)
        })
    }

    const navDetail = async (item) => {
        console.log(item)
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0,
            maskClickable: false
        })

        const indicates = await getIndicateList()
        const typeList = await getAllType()
        getMarket((areaData) => {
            localStorage.setItem("pickStockItem", JSON.stringify(item))
            getInit(indicates, typeList, areaData, JSON.parse(item.selectCondition), item.id,)

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

    const getInit = (indicates, typeList, areaData, selectCondition, id) => {

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
                    let inputArr = item.value ? item.value.split('~') : ""
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

        technical.forEach(item => {
            if (item.value === '相似k线') {
                let spArr = JSON.parse(item.sp)
                console.log(spArr)
                spArr.forEach(item => {
                    if (item.name === 'prod_code') {
                        props.changeCode(item.value)
                    }
                    if (item.name === 'start_date') {
                        props.setStartDateValue(moment(item.value, 'YYYYMMDD').format('YYYY-MM-DD'))
                    }
                    if (item.name === 'end_date') {
                        props.setEndDateValue(moment(item.value, 'YYYYMMDD').format('YYYY-MM-DD'))
                    }
                })
            }
        })


        navigate('/pickStockCreate/' + id)

        Toast.clear()

    }

    const onDelete = (e, item) => {
        e.stopPropagation()
        Dialog.confirm({
            content: "确定要删除该选股条件吗？",
            onConfirm: () => {
                Toast.show({
                    icon: "loading",
                    content: "加载中...",
                    duration: 0,
                    maskClickable: false
                })
                delteMySelectPick({ id: item.id }).then(res => {
                    Toast.clear()
                    if (res && res === 1) {
                        Toast.show({
                            icon: 'success',
                            content: "删除成功"
                        })
                        getList()
                    } else {
                        Toast.show({
                            icon: 'fail',
                            content: "删除失败"
                        })
                    }

                }).catch(err => {
                    Toast.clear()
                    Toast.show({
                        icon: 'fail',
                        content: "服务端出错"
                    })

                })
            }
        })
    }

    const onSubscribe = ()=>{

    }

    return (
        <div className="select-time-list">
            <Link className="create-btn" to="/pickStockCreate" onClick={() => {
                props.initPickStock()
            }}>+ 创建选股</Link>

            {conditionList.map((item, index) => {
                return (
                    <div className="select-time-item" key={index} onClick={() => {
                        navDetail(item)
                    }}>
                        <div className="strategy-name" >
                            <div>{item.selectName}</div>
                            <div className='discribe'>描述：</div>
                        </div>
                        <div className='btn-list'>
                            <div className="subscribe-btn" onClick={(e) => onSubscribe(e, item)}>订阅</div>
                            <div className="delete-btn" onClick={(e) => onDelete(e, item)}>删除</div>
                        </div>

                        {/* <div className="info-wrapper">
                            <div className="info-list" >
                                <div className="info-item">
                                    <span className="info-name">介绍：</span>
                                    <span className="info-value">用每天的收盘价减去最高价...</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-name">更新时间：</span>
                                    <span className="info-value">2017-03-05 09：23</span>
                                </div>
                            </div>
                            <div className="signal-btn">实时选股</div>
                        </div> */}
                    </div>
                )
            })}
            {
                hotCondition.map((item, index) => {
                    return (
                        <div className="select-time-item" key={index} onClick={() => {
                            // navDetail(item)
                        }}>
                            <div className="strategy-name" >{item.selectStockConditionName}</div>


                        </div>
                    )
                })
            }

            {conditionList.length === 0 ?
                <div className='no-data'>暂无数据</div> : null
            }



        </div>
    )
}



const mapDispatchToProps = (dispatch) => {
    return {
        setIndicate: (data) => {
            dispatch(setIndicate(data))
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
        initPickStock: () => {
            dispatch(initPickStock())
        },
        changeCode: (code) => {
            dispatch(changeCode(code))
        },
        setStartDateValue: (value) => {
            dispatch(setStartDateValue(value))
        },
        setEndDateValue: (value) => {
            dispatch(setEndDateValue(value))
        },

    }
}
export default connect(null, mapDispatchToProps)(ConditionList)