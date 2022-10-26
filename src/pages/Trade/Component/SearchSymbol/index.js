import { useState ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'

import { searchCode } from '../../../../service/index'
import { debounce } from '../../../../utils/index'
import { onGetQuote, changeCode } from '../../actions'
import { favorList, addFavor, deleteFavor } from '../../../../service/traderoom'
import { Dialog, Toast } from 'antd-mobile-v5'

function SearchSymbol(props) {
    const navigate = useNavigate()
    const [codeList, setCodeList] = useState([])
    const [favList, setFavList] = useState([])

    useEffect(()=>{
        getFavorList()
    },[])

    const handleSearchStock = value => {

        searchCode({ prodCode: value, findType: props.marketType === 1 ? 2 : 1 }).then(res => {
            if (res.code === 200) {
                let list = res.data.map(item => {
                    return {
                        label: `${item.prodCode} ${item.prodName}`,
                        code: item.prodCode,
                        name: item.prodName
                    }
                })
                setCodeList(list)
            }else{
                setCodeList([])
            }
        })

    }

    const debounceBtn = debounce(handleSearchStock, 1000)

    const handleSelectStock = (item) => {
        cancelKlineWebsocket(props.stockCode)
        props.onGetQuote(item.code)
        props.changeCode(item.code)
        subKlineWebsocket(item.code)
        navigate(-1)
    }

    const subKlineWebsocket = (code) => {
        let userId = props.randomString
        let useInfo = localStorage.getItem('userInfo')
        if (useInfo) {
            userId = JSON.parse(useInfo).id
        }
        const sub = {
            userId: userId,
            module: 5,
            cmd: 2,
            periods: [props.period],
            subscribeProdCodes: code
        }
        window.newSocket.send(JSON.stringify(sub))
    }
    const cancelKlineWebsocket = (code) => {
        let userId = props.randomString
        let useInfo = localStorage.getItem('userInfo')
        if (useInfo) {
            userId = JSON.parse(useInfo).id
        }
        const sub = {
            userId: userId,
            module: 5,
            cmd: 3,
            periods: [props.period],
            subscribeProdCodes: code
        }
        window.newSocket.send(JSON.stringify(sub))
    }

    const getFavorList = () => {
        let userInfo = localStorage.getItem('userInfo')
        userInfo = JSON.parse(userInfo)
        const data = {
            refId: userInfo.id,
            pageNum: 1,
            pageSize: 100
        }
        favorList(data).then(res => {
            setFavList(res.data.list)
        })
    }

    const addFav = (item) => {
        Dialog.confirm({
            content: '确定要添加到自选吗？',
            onConfirm: () => {
                let userInfo = localStorage.getItem('userInfo')
                userInfo = JSON.parse(userInfo)
                const data = {
                    refId: userInfo.id,
                    symbol: item.code,
                    remark: ""
                }
                Toast.show({
                    icon: "loading",
                    content: "加载中...",
                    duration: 0,
                    maskClickable: false
                })
                addFavor(data).then(res => {
                    Toast.clear()
                    if (res.retCode === 0) {
                        Toast.show({
                            icon: 'success',
                            content: "添加自选成功",
                        })
                        getFavorList()
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
                    if (favitem.symbol === item.code) {
                        id = favitem.id
                    }
                })
                const data = {
                    id: id
                }
                Toast.show({
                    icon: "loading",
                    content: "加载中...",
                    duration: 0,
                    maskClickable: false
                })
                deleteFavor(data).then(res => {
                    Toast.clear()
                    if (res.retCode === 0) {
                        Toast.show({
                            icon: 'success',
                            content: "删除自选成功",
                        })
                        getFavorList()
                    }
                })
            }
        })
    }

    return (
        <div className="search-symbol-wrapper">
            <div className="search-input-wrapper">
                <input type="text" placeholder="请输入股票号" onChange={(e) => debounceBtn(e.target.value)} />
            </div>
            <div className="symbol-list">
                {codeList.map((item, index) => {
                    let isFav = false
                    favList.forEach(favItem => {
                        if (favItem.symbol === item.code) {
                            isFav = true
                        }
                    })
                    return (
                        <div className="symbol-item"  key={item.code}>
                            <div onClick={() => { handleSelectStock(item) }}><span className="symbol-name">{item.name}</span><br /><span className="symbol-code">{item.code}</span></div>
                            {isFav ? <div className="add-fav-btn delete" onClick={() => deleteFav(item)}>-</div> :
                                <div className="add-fav-btn" onClick={() => addFav(item)}>+</div>}

                        </div>
                    )
                })}
                {codeList.length === 0 ?
                    <div>请搜索</div> : null
                }


            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        stockCode: state.traderoom.code,
        period: state.traderoom.period,
        marketType: state.traderoom.marketType,
        randomString: state.traderoom.randomString
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGetQuote: (code, uuid) => {
            dispatch(onGetQuote(code, uuid))
        },
        changeCode: (code) => {
            dispatch(changeCode(code))
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSymbol)



