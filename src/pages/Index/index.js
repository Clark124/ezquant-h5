import React, { Component } from 'react'
import './index.css'
import { Route, Routes, useNavigate, useParams ,useLocation} from 'react-router-dom';
// import { StockChart } from '../../components/stockchart-react-h5'
import { connect } from 'react-redux'
import { Dialog, Toast } from 'antd-mobile-v5'
import { changeIndex } from './actions'
import { getToken } from '../../service/index'

import Home from '../Home/index'
import User from '../User/index'
import SelectTime from '../SelectTime/index'
import PickStock from '../PickStock/index'
import Trade from '../Trade/index'
import Compose from '../CombinationMy/index'

export const withNavigation = (Component) => {
    return (props) => <Component {...props} navigate={useNavigate()} 
        location={useLocation()}
    params={useParams()} />;
};

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hidden: false,
            selectedTab: 'home',
            tabIndex: 0,
        }

    }
    componentDidMount() {
        const url = this.props.params['*']
        if (url.includes('selectTime')) {
            this.setState({ tabIndex: 1 })
            return
        }
        if (url.includes('stockpick')) {
            this.setState({ tabIndex: 2 })
            return
        }
        if (url.includes('compose')) {
            this.setState({ tabIndex: 3 })
            return
        }
        if (url.includes('trade')) {
            this.setState({ tabIndex: 4 })
            return
        }
        switch (url) {
            case "":
                this.setState({ tabIndex: 0 })
                break
            case 'selectTime':
                this.setState({ tabIndex: 1 })
                break
            case 'stockpick':
                this.setState({ tabIndex: 2 })
                break
            case 'compose':
                this.setState({ tabIndex: 3 })
                break
            case 'trade':
                this.setState({ tabIndex: 4 })
                break
            case 'user':
                this.setState({ tabIndex: 5 })
                break
            default:
                this.setState({ tabIndex: 0 })
        }
        // const { selectedTab } = this.props
        // this.setState({ selectedTab })
    }
    componentWillReceiveProps (nextProps, nextState) {
        const url = nextProps.location.pathname
    
        if (url.includes('/selectTime')) {
            this.setState({ tabIndex: 1 })
            return
        }
        if (url.includes('/stockpick')) {
            this.setState({ tabIndex: 2 })
            return
        }
        if (url.includes('/compose')) {
            this.setState({ tabIndex: 3 })
            return
        }
        if (url.includes('/trade')) {
            this.setState({ tabIndex: 4 })
            return
        }
        if (url.includes('/user')) {
            this.setState({ tabIndex: 5 })
            return
        }
        if(url==='/'){
            this.setState({ tabIndex: 0 })
            return
        }
        

    }

    navTab(index, url) {
        if (index === 1 || index === 2 || index === 3 || index === 4) {
            let userInfo = localStorage.getItem('userInfo')
            if (!userInfo) {
                Dialog.alert({
                    content: '请先登录',
                    closeOnMaskClick: true,
                    afterClose:()=>{
                        this.props.navigate('/user')
                    }
                })
                return
            }
        }
        this.setState({ tabIndex: index }, () => {
            this.props.navigate(url)
            if (index !== 4) {
                if (window.newSocket) {
                    window.newSocket.close()
                }
            }

        })
    }

    render() {
        const { tabIndex } = this.state
        return (
            <div className="index-wrapper">

                <Routes>
                    <Route path={'/'} element={<Home />} />
                    <Route path={'/trade/:id'} element={<Trade />} />
                    <Route path={'/selectTime/:id'} element={<SelectTime />} />
                    <Route path={'/stockpick/:id'} element={<PickStock />} />
                    <Route path={'/compose/:id'} element={<Compose />} />
                    <Route path={'/user'} element={<User />} />
                </Routes>


                <div className="tabbar-wrapper">
                    <div className="tabbar-item" onClick={this.navTab.bind(this, 0, '')}>
                        <div className={tabIndex === 0 ? "home-icon-selected" : "home-icon"} />
                        <div className={tabIndex === 0 ? "tabbar-item-text active" : "tabbar-item-text"}>首页</div>
                    </div>
                  
                    <div className="tabbar-item" onClick={this.navTab.bind(this, 2, 'stockpick/0')}>
                        <div className={tabIndex === 2 ? "stock-pick-icon-selected" : "stock-pick-icon"} />
                        <div className={tabIndex === 2 ? "tabbar-item-text active" : "tabbar-item-text"}>选股</div>
                    </div>
                    <div className="tabbar-item" onClick={this.navTab.bind(this, 1, 'selectTime/0')}>
                        <div className={tabIndex === 1 ? "select-time-icon-selected" : "select-time-icon"} />
                        <div className={tabIndex === 1 ? "tabbar-item-text active" : "tabbar-item-text"}>择时</div>
                    </div>
                    {/* <div className="tabbar-item" onClick={this.navTab.bind(this, 3, 'compose/0')}>
                        <div className={tabIndex === 3 ? "compose-icon-selected" : "compose-icon"} />
                        <div className={tabIndex === 3 ? "tabbar-item-text active" : "tabbar-item-text"}>组合</div>
                    </div> */}
                    <div className="tabbar-item" onClick={this.navTab.bind(this, 4, '/trade/0')}>
                        <div className={tabIndex === 4 ? "trade-icon-selected" : "trade-icon"} />
                        <div className={tabIndex === 4 ? "tabbar-item-text active" : "tabbar-item-text"}>交易</div>
                    </div>
                    <div className="tabbar-item" onClick={this.navTab.bind(this, 5, '/user')}>
                        <div className={tabIndex === 5 ? "user-icon-selected" : "user-icon"} />
                        <div className={tabIndex === 5 ? "tabbar-item-text active" : "tabbar-item-text"}>我的</div>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateTopProps = (state) => {
    return {
        selectedTab: state.index.selectedTab
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeIndex: (value) => {
            dispatch(changeIndex(value))
        }
    };
};

export default withNavigation(connect(mapStateTopProps, mapDispatchToProps)(Index))