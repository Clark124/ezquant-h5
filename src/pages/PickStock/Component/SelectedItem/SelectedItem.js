import { useState, useEffect } from 'react'
import { Modal, ActionSheet, Toast } from 'antd-mobile-v5'
import { useNavigate } from "react-router-dom";
import './index.scss'

export default function SelectedItem(props) {
    // let navigate = useNavigate()

    const [showModal, setShowModal] = useState(false)
    // const [showRegionModal, setShowRegionModal] = useState(false)
    const [actionVisible, setActionVisible] = useState(false)
    // const [actions, setActions] = useState([])
    const [data, setData] = useState({})
    let [parameter, setParameter] = useState([])
    let [paramsList, setParamsList] = useState([])
    const [region, setRegion] = useState(props.data.region?JSON.parse(props.data.region):[])
    const [regionIndex, setRegionIndex] = useState(props.data.regionIndex)

    const [inputValue, setInputValue] = useState(["", ""])
    const [compareSign, setcompareSign] = useState("")

    let actions = []
    if (data.region) {
        const regionList = JSON.parse(data.region)
        // setRegion(regionList)
        let arr = regionList.map((item, index) => {
            return {
                text: item.name,
                key: item.value,
                onClick: () => {
                    setRegionIndex(index)
                    setActionVisible(false)
                    changeOptions(item.value,index)
                }
            }
        })
        actions = arr
    }


    useEffect(() => {
        const { data } = props
        const { minValue, maxValue, defalutValue, compareSign } = data
        setData(data)
        setParameter(JSON.parse(data.sp))
        setParamsList(JSON.parse(data.sp))
        setcompareSign(compareSign)
        // if (data.region) {
        //     const regionList = JSON.parse(data.region)
        //     setRegion(regionList)
        //     let arr = regionList.map((item, index) => {
        //         return {
        //             text: item.name,
        //             key: item.value,
        //             onClick: () => {
        //                 setRegionIndex(index)
        //                 setActionVisible(false)
        //                 changeOptions(item.value,index)
        //             }
        //         }
        //     })
        //     setActions(arr)
        // }
        let inputArr = []
        if (data.inputArr) {
            inputArr = data.inputArr
        } else {
            inputArr = [minValue ? Number(minValue).toFixed(2) : (defalutValue ? defalutValue : ''), maxValue ? Number(maxValue).toFixed(2) : (defalutValue ? defalutValue : '')]
            let value = JSON.parse(JSON.stringify(data))
            value.inputArr = inputArr
            props.changeSelectItem(value)
        }


        setInputValue(inputArr)


    }, [])

    //选择区间
    const changeOptions = (value,index) => {
        const { data } = props
        const { minValue, maxValue } = data
        let valueArr = []
        if (value.indexOf('~') > -1) {
            valueArr = value.split('~')
        } else if (value.indexOf('>') > -1) {
            valueArr = value.split('>')
            valueArr[0] = maxValue ? Number(maxValue).toFixed(2) : 100
            valueArr = [valueArr[1], valueArr[0]]
        } else if (value.indexOf('<') > -1) {
            valueArr = value.split('<')
            valueArr[0] = minValue ? Number(minValue).toFixed(2) : 0
        }

        setInputValue(valueArr)
        let valueList = JSON.parse(JSON.stringify(data))
        valueList.inputArr = valueArr
        valueList.regionIndex = index
       
        props.changeSelectItem(valueList)

    }

    const handleChangeVlaue = (e, i) => {
        let arr = JSON.parse(JSON.stringify(paramsList))
        arr[i].value = e.target.value
        setParamsList(arr)
    }

    const confirmParams = () => {
        setParameter(paramsList)
        let value = JSON.parse(JSON.stringify(data))
        value.sp = JSON.stringify(paramsList)
        setData(value)
        setShowModal(false)
        props.changeSelectItem(value)
    }


    const changeInput1 = (e) => {
        const { data } = props
        const { minValue, maxValue, value: name } = data
        let value = JSON.parse(JSON.stringify(inputValue))
        value[0] = e.target.value
        if (minValue) {
            if (Number(value[0]) < Number(minValue)) {
                return Toast.show({
                    content: `${name}的区间值应该在${minValue}~${maxValue}的范围`,
                })
            }
        }
        setInputValue(value)
        let valueList = JSON.parse(JSON.stringify(data))
        valueList.inputArr = value
        console.log(data)
        props.changeSelectItem(valueList)
    }

    const changeInput2 = (e) => {
        const { data } = props
        const { minValue, maxValue, value: name } = data
        let value = JSON.parse(JSON.stringify(inputValue))
        value[1] = e.target.value
        if (maxValue) {
            if (Number(value[1]) > Number(maxValue)) {
                return Toast.show({
                    content: `${name}的区间值应该在${minValue}~${maxValue}的范围`,
                })
            }
        }
        setInputValue(value)
        let valueList = JSON.parse(JSON.stringify(data))
        valueList.inputArr = value
        props.changeSelectItem(valueList)
    }



    return (
        <div className="select-item" >
            <span className="select-name" onClick={() => {
                if (data.value === '相似k线') {
                    return
                }
                setShowModal(true)
            }}>
                {data.value}
                {data.value !== '相似k线' && parameter && `(${parameter.map(i => i.value).join(',')})`}
            </span>


            {region.length > 0 ?
                <span className='region-select' onClick={() => setActionVisible(true)}>{region[regionIndex] ? region[regionIndex].name : "请选择"}</span> : null
            }
            <ActionSheet
                visible={actionVisible}
                actions={actions}
                onClose={() => setActionVisible(false)}
            />

            <div className="region-modal-input">
                <input type="text" className="region-item-input"
                    value={inputValue[0]} onChange={changeInput1}
                    disabled={(region.length === 1 && region[0].value === '') || (region.length === 1 && region[0].value === '1~1') || compareSign === '='}
                />
                <span style={{ "marginLeft": 5, "marginRight": 5 }}>~</span>
                <input type="text" className="region-item-input"
                    value={inputValue[1]} onChange={changeInput2}
                    disabled={(region.length === 1 && region[0].value === '') || (region.length === 1 && region[0].value === '1~1') || compareSign === '='}
                />
            </div>

            <Modal
                visible={showModal}
                title={data.value}
                content={(
                    <div className="save-modal">
                        {paramsList && paramsList.map((v, i) => {
                            return (
                                <div key={v.name} className="model-item">
                                    <span>{v.label}:</span>
                                    <input className="model-item-input"
                                        onChange={e => {
                                            handleChangeVlaue(e, i);
                                        }}
                                        value={v.value}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
                closeOnMaskClick={true}
                closeOnAction
                onClose={() => {
                    setShowModal(false)
                }}
                actions={[
                    {
                        key: 'confirm',
                        text: '保存',
                        primary: true,
                        onClick: () => {
                            confirmParams()
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