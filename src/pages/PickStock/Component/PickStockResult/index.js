
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'
import { favorList, addFavor, deleteFavor } from '../../../../service/traderoom'
import { chineseToTng } from '../../../../utils/index'
import { Dialog, Toast } from 'antd-mobile-v5'

export default function PickStockResult() {
    const [resultList, setResultList] = useState([])
    const [favList, setFavList] = useState([])
    const [colums, setColums] = useState(['股票'])

    useEffect(() => {
        const result = JSON.parse(localStorage.getItem('pickStockResult'))
        if (result.length > 0) {
            const keys = Object.keys(result[0])
            let arr = []
            keys.forEach(item => {
                if (chineseToTng[item]) {
                    arr.push(chineseToTng[item])


                }
            })
            setColums([...colums, ...arr])

            setResultList(result)
            getFavList()
        }

    }, [])

    const getFavList = () => {
        const id = JSON.parse(localStorage.getItem('userInfo')).id
        const data = {
            refId: id,
            pageNum: 1,
            pageSize: 100,
        }
        favorList(data).then(res => {
            if (res.retCode === 0) {
                setFavList(res.data.list)
            }
        })

    }

    const renderColum = (value) => {
        const values = Object.values(value)

        return values.map((item, index) => {
            if (index > 1) {
                return (<div className="profit" key={index}>{item}</div>)
            } else {
                return null
            }

        })
    }
    const renderHead = (colums) => {
        const result = colums.map((item, index) => {
            return <span key={index}>{item}</span>
        })
        return result
    }

    const addFav = (item) => {
        Dialog.confirm({
            content: '确定要添加到自选吗？',
            onConfirm: () => {
                let userInfo = localStorage.getItem('userInfo')
                userInfo = JSON.parse(userInfo)
                const data = {
                    refId: userInfo.id,
                    symbol: item.prodCode,
                    remark: ""
                }
                addFavor(data).then(res => {
                    if (res.retCode === 0) {
                        Toast.show({
                            icon: 'success',
                            content: "添加自选成功",
                        })
                        getFavList()
                    }
                })
            }
        })
    }

    const deleteFav = (item) => {
        
        Dialog.confirm({
            content: '确定要删除自选吗？',
            onConfirm: () => {
                let id = ""
                favList.forEach(favitem => {
                    if (favitem.symbol === item.prodCode) {
                        id = favitem.id
                    }
                })
                const data = {
                    id: id
                }
                deleteFavor(data).then(res => {
                    if (res.retCode === 0) {
                        Toast.show({
                            icon: 'success',
                            content: "删除自选成功",
                        })
                        getFavList()
                    }
                })
            }
        })
    }

    return (
        <div className="pick-stock-result-wrapper">
            <div className="title">选股结果（共{resultList.length}只股票）</div>


            <div className="result-list">
                <div className="result-head">
                    {renderHead(colums)}
                    <div style={{ "width": "55px" }}></div>
                </div>

                {resultList.map((item, index) => {
                    let isFav = false
                    favList.forEach(favItem => {
                        if (favItem.symbol === item.prodCode) {
                            isFav = true
                        }
                    })
                    // console.log(isFav)
                    return (
                        <div className="result-item" key={index}>
                            <div>
                                <div className="stock-name">{item.prodName}</div>
                                <div className="stock-code">{item.prodCode}</div>
                            </div>
                            {renderColum(item)}

                            {isFav ? <span className="add-fav gray" onClick={() => deleteFav(item)}>已添加</span> : <span className="add-fav" onClick={() => addFav(item)}>+自选</span>}

                        </div>
                    )
                })}

            </div>

            <div className="pick-stock-result-btn-wrapper" style={resultList.length === 0 ? { 'display': 'none' } : null}>
                <Link className="pick-stock-result-btn" to="saveCondition">
                    保存选股条件
                </Link>
                <Link className="pick-stock-result-btn" to="savePool" style={{ "background": "#E84345" }}>
                    保存至股票池
                </Link>
                {/* <Link className="pick-stock-result-btn"  to="selectSymbol">
                    策略回撤
                </Link> */}

            </div>

        </div>
    )
}
