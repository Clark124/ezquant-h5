import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'

import { searchCode, getPoolCodeList ,addCodeToPool} from '../../../../service/index'
import { debounce } from '../../../../utils/index'
import { onGetQuote, changeCode } from '../../actions'
import { Dialog, Toast } from 'antd-mobile-v5'

function SearchSymbol(props) {
    const params = useParams()
    const navigate = useNavigate()
    const [codeList, setCodeList] = useState([])
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        console.log(params.id)
        getCodeList(params.id)
    }, [])

    //根据Id获取股票池列表
    const getCodeList = (id) => {
        const data = {
            pageSize: 1000,
            pageNum: 1,
            refId: id
        }
        getPoolCodeList(data).then(res => {
            const stkList = res.data.list.filter(item => item.type === 'stk')
            const futList = res.data.list.filter(item => item.type === 'fut')
            setDataList(stkList)
        })
    }

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
        
        Dialog.confirm({
            content: `确定将(${item.name})添加到股票池吗？`,
            onConfirm: () => {
                addCodeToPool({ remark: "", refId:params.id,symbol:item.code }).then(res => {
                    navigate(-1)
                })
            }
        })
        // 
    }


    return (
        <div className="search-symbol-wrapper">
            <div className="search-input-wrapper">
                <input type="text" placeholder="请输入股票号" onChange={(e) => debounceBtn(e.target.value)} />
            </div>
            <div className="symbol-list">
                {codeList.map((item, index) => {
                    let isAdd = false
                    dataList.forEach(code=>{
                        console.log(code.symbol)
                        console.log(item.prodCode)
                        if(code.symbol===item.code){
                            isAdd = true
                        }
                    })
                    return (
                        <div className="symbol-item"  key={item.code}>
                            <div><span className="symbol-name">{item.name}</span><br /><span className="symbol-code">{item.code}</span></div>
                            {!isAdd ? <div className="add-fav-btn" onClick={()=>handleSelectStock(item)}>+</div> : null}

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



