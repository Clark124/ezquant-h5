
import React, { Component } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux'


import Bundle from './bundle';



// const History = require('history')

// const history = History.createBrowserHistory()
// const location = history.location.pathname
// console.log(location)

// let isLogin = localStorage.getItem('userinfo');
// let userInfo = ""
// if (isLogin) {
//     userInfo = JSON.parse(isLogin)
// }
//判断是否是登录状态
// const nextRoute = ['/', '/home','/postcard','/searchcode','/information','/recentchat','/contractuser','/goldreward','/myAnswer','/redpackage']
// if (nextRoute.indexOf(location) >= 0 || location.includes('chatRoom') || location.includes('questionDetail')|| location.includes('userdetail') ) {
//     if (!isLogin) {
//         history.push('/')
//     } else {
//         if (location === '/') {
//             history.push('/home')
//         } else {
//             history.push(location)
//         }

//     }
// } else {
//     history.push('/')
// }


//登录
const Login = (props) => (
    <Bundle load={() => import('../pages/UserLogin')}>
        {(Login) => <Login {...props} />}
    </Bundle>
);

//注册
const Register = (props) => (
    <Bundle load={() => import('../pages/UserResister')}>
        {(Register) => <Register {...props} />}
    </Bundle>
);

const ResetPassword = (props) => (
    <Bundle load={() => import('../pages/UserResetPassword')}>
        {(ResetPassword) => <ResetPassword {...props} />}
    </Bundle>
);

const BindPhone = (props) => (
    <Bundle load={() => import('../pages/UserBindPhone')}>
        {(BindPhone) => <BindPhone {...props} />}
    </Bundle>
);

const ChangeAccount = (props) => (
    <Bundle load={() => import('../pages/UserChangeAccount')}>
        {(ChangeAccount) => <ChangeAccount {...props} />}
    </Bundle>
);

//授权登录
const Index = (props) => (
    <Bundle load={() => import('../pages/Index/index')}>
        {(Index) => <Index {...props} />}
    </Bundle>
);


//消息中心
const Message = (props) => (
    <Bundle load={() => import('../pages/Message/index')}>
        {(Message) => <Message {...props} />}
    </Bundle>
);

const MessageEarlyWarning = (props) => (
    <Bundle load={() => import('../pages/MessageEarlyWarning/index')}>
        {(MessageEarlyWarning) => <MessageEarlyWarning {...props} />}
    </Bundle>
);

const MessageNotice = (props) => (
    <Bundle load={() => import('../pages/MessageNotice')}>
        {(MessageNotice) => <MessageNotice {...props} />}
    </Bundle>
);

//编辑个人信息
const UserEdit = (props) => (
    <Bundle load={() => import('../pages/UserEdit/index')}>
        {(UserEdit) => <UserEdit {...props} />}
    </Bundle>
);

const UserInfo = (props) => (
    <Bundle load={() => import('../pages/UserInfo')}>
        {(UserInfo) => <UserInfo {...props} />}
    </Bundle>
);

//修改密码
const UpdatePassword = (props) => (
    <Bundle load={() => import('../pages/UserUpdatePassword')}>
        {(UpdatePassword) => <UpdatePassword {...props} />}
    </Bundle>
);

//交易账户
const UserAccount = (props) => (
    <Bundle load={() => import('../pages/UserAccount/index')}>
        {(UserAccount) => <UserAccount {...props} />}
    </Bundle>
);
//我的订单
const UserOrder = (props) => (
    <Bundle load={() => import('../pages/UserOrder/index')}>
        {(UserOrder) => <UserOrder {...props} />}
    </Bundle>
);

//购买积分
const UserBuyIntegrate = (props) => (
    <Bundle load={() => import('../pages/UserBuyIntegrate/index')}>
        {(UserBuyIntegrate) => <UserBuyIntegrate {...props} />}
    </Bundle>
);

//组合排行
const Combination = (props) => (
    <Bundle load={() => import('../pages/Combination/index')}>
        {(Combination) => <Combination {...props} />}
    </Bundle>
);
//组合详情
const CombinationDetail = (props) => (
    <Bundle load={() => import('../pages/CombinationDetail/index')}>
        {(CombinationDetail) => <CombinationDetail {...props} />}
    </Bundle>
);
//组合调仓记录
const AdjustPosition = (props) => (
    <Bundle load={() => import('../pages/CombinationAdjustPosition/index')}>
        {(AdjustPosition) => <AdjustPosition {...props} />}
    </Bundle>
);

//组合个股收益分析
const SingleAnalysis = (props) => (
    <Bundle load={() => import('../pages/ComboSingleAnalysis/index')}>
        {(SingleAnalysis) => <SingleAnalysis {...props} />}
    </Bundle>
)

//
const TotalAnalysis = (props) => (
    <Bundle load={() => import('../pages/ComboTotalAnalysis/index')}>
        {(TotalAnalysis) => <TotalAnalysis {...props} />}
    </Bundle>
)

//推荐选股条件列表
const RecommendSelection = (props) => (
    <Bundle load={() => import('../pages/RecommendSelection/index')}>
        {(RecommendSelection) => <RecommendSelection {...props} />}
    </Bundle>
)

//推荐扫描条件结果
const RecommendScanResult = (props) => (
    <Bundle load={() => import('../pages/RecommendScanResult')}>
        {(RecommendScanResult) => <RecommendScanResult {...props} />}
    </Bundle>
)

//选股结果
const SelectionResult = (props) => (
    <Bundle load={() => import('../pages/SelectionResult/index')}>
        {(SelectionResult) => <SelectionResult {...props} />}
    </Bundle>
)

//选股历史记录
const SelectionHistory = (props) => (
    <Bundle load={() => import('../pages/SelectionResult/SelectionHistory/index')}>
        {(SelectionHistory) => <SelectionHistory {...props} />}
    </Bundle>
)
//选股历史详情
const SelectionHistoryDetail = (props) => (
    <Bundle load={() => import('../pages/SelectionResult/SelectionHistoryDetail/index')}>
        {(SelectionHistoryDetail) => <SelectionHistoryDetail {...props} />}
    </Bundle>
)

const StrategyCreate = (props) => (
    <Bundle load={() => import('../pages/StrategtyCreate/index')}>
        {(StrategyCreate) => <StrategyCreate {...props} />}
    </Bundle>
)

const StrategyEdit = (props) => (
    <Bundle load={() => import('../pages/StrategyEdit/index')}>
        {(StrategyEdit) => <StrategyEdit {...props} />}
    </Bundle>
)

//策略排行
const StrategyList = (props) => (
    <Bundle load={() => import('../pages/StrategyList/index')}>
        {(StrategyList) => <StrategyList {...props} />}
    </Bundle>
)

//策略托管详情
const StrategyTrustDetail = (props) => (
    <Bundle load={() => import('../pages/StrategyTrustDetail/index')}>
        {(StrategyTrustDetail) => <StrategyTrustDetail {...props} />}
    </Bundle>
)

//策略托管发布

const StrategyTrustPublic = (props) => (
    <Bundle load={() => import('../pages/StrategyTrustPublic/index')}>
        {(StrategyTrustPublic) => <StrategyTrustPublic {...props} />}
    </Bundle>
)


const StrategyTrustDetailPublic = (props) => (
    <Bundle load={() => import('../pages/StrategyTrustDetailPublic/index')}>
        {(StrategyTrustDetailPublic) => <StrategyTrustDetailPublic {...props} />}
    </Bundle>
)

const StrategyTrustDetailFollow = (props) => (
    <Bundle load={() => import('../pages/StrategyTrustDetailFollow/index')}>
        {(StrategyTrustDetailFollow) => <StrategyTrustDetailFollow {...props} />}
    </Bundle>
)

const StrategyTrustDetailCollect = (props) => (
    <Bundle load={() => import('../pages/StrategyTrustDetailCollect/index')}>
        {(StrategyTrustDetailCollect) => <StrategyTrustDetailCollect {...props} />}
    </Bundle>
)

const FollowList = (props) => (
    <Bundle load={() => import('../pages/StrategyTrustDetailPublic/Component/FollowList/index')}>
        {(FollowList) => <FollowList {...props} />}
    </Bundle>
)

//策略托管报告
const StrategyTrustReport = (props) => (
    <Bundle load={() => import('../pages/StrategyTrustReport/index')}>
        {(StrategyTrustReport) => <StrategyTrustReport {...props} />}
    </Bundle>
)

//策略托管信号
const StrategyTrustSignal = (props) => (
    <Bundle load={() => import('../pages/StrategyTrustSignal/index')}>
        {(StrategyTrustSignal) => <StrategyTrustSignal {...props} />}
    </Bundle>
)
//策略详情
const StrategyDetail = (props) => (
    <Bundle load={() => import('../pages/StrategyDetail/index')}>
        {(StrategyDetail) => <StrategyDetail {...props} />}
    </Bundle>
)

//回测报告
const BacktestReport = (props) => (
    <Bundle load={() => import('../pages/StrategyBacktestReport/index')}>
        {(BacktestReport) => <BacktestReport {...props} />}
    </Bundle>
)

//最优详情报告
const OptimalReport  = (props) => (
    <Bundle load={() => import('../pages/StrategyOptimalReport')}>
        {(OptimalReport) => <OptimalReport {...props} />}
    </Bundle>
)

//回测报告托管
const BacktestTrust = (props) => (
    <Bundle load={() => import('../pages/StrategyBacktestTrust/index')}>
        {(BacktestTrust) => <BacktestTrust {...props} />}
    </Bundle>
)

//跟单
const StrategyFollow = (props) => (
    <Bundle load={() => import('../pages/SelectTime/Component/StrategyFollow')}>
        {(StrategyFollow) => <StrategyFollow {...props} />}
    </Bundle>
)

//回测设置
const BacktestSet = (props) => (
    <Bundle load={() => import('../pages/StrategyBacktestSet/index')}>
        {(BacktestSet) => <BacktestSet {...props} />}
    </Bundle>
)

//回测列表
const BacktestList = (props) => (
    <Bundle load={() => import('../pages/StrategyBacktestList')}>
        {(BacktestList) => <BacktestList {...props} />}
    </Bundle>
)

//策略托管
const StrategyTrust = (props) => (
    <Bundle load={() => import('../pages/StrategyTrust')}>
        {(StrategyTrust) => <StrategyTrust {...props} />}
    </Bundle>
)


//创建选股
const PickStockCreate = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/PickStockCreate')}>
        {(PickStockCreate) => <PickStockCreate {...props} />}
    </Bundle>
)

//区域列表
const AreaKist = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/AreaList')}>
        {(AreaKist) => <AreaKist {...props} />}
    </Bundle>
)

const PickStockIndicates = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/IndicateList')}>
        {(PickStockIndicates) => <PickStockIndicates {...props} />}
    </Bundle>
)

const PickStockIndicatesStrategy = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/IndicateStrategy')}>
        {(PickStockIndicatesStrategy) => <PickStockIndicatesStrategy {...props} />}
    </Bundle>
)

const PickStockPoolList = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/PoolList')}>
        {(PickStockPoolList) => <PickStockPoolList {...props} />}
    </Bundle>
)

//选股结果
const PickStockResult = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/PickStockResult')}>
        {(PickStockResult) => <PickStockResult {...props} />}
    </Bundle>
)

//保存选股条件
const PickStockResultSaveCondition = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/SaveCondition')}>
        {(SaveCondition) => <SaveCondition {...props} />}
    </Bundle>
)

//保存至股票池
const PickStockResultSavePool = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/SavePool')}>
        {(SavePool) => <SavePool {...props} />}
    </Bundle>
)

//选择股票
const SelectSymbol = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/SelectSymbol')}>
        {(SelectSymbol) => <SelectSymbol {...props} />}
    </Bundle>
)

//创建扫描
const ScanCreate = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/ScanCreate')}>
        {(ScanCreate) => <ScanCreate {...props} />}
    </Bundle>
)

//扫描结果
const ScanResult = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/ScanResult')}>
        {(ScanResult) => <ScanResult {...props} />}
    </Bundle>
)

//扫描详情
const ScanDetail = (props) => (
    <Bundle load={() => import('../pages/PickStock/Component/ScanDetail')}>
        {(ScanDetail) => <ScanDetail {...props} />}
    </Bundle>
)

const ComposeCreate = (props) => (
    <Bundle load={() => import('../pages/CombinationMy/Component/ComposeCreate')}>
        {(ComposeCreate) => <ComposeCreate {...props} />}
    </Bundle>
)

const ComposeItemDetail = (props) => (
    <Bundle load={() => import('../pages/CombinationMy/Component/ComposeItemDetail')}>
        {(ComposeItemDetail) => <ComposeItemDetail {...props} />}
    </Bundle>
)
const ComposeItemDetailSub = (props) => (
    <Bundle load={() => import('../pages/CombinationMy/Component/ComposeItemDetailSub')}>
        {(ComposeItemDetailSub) => <ComposeItemDetailSub {...props} />}
    </Bundle>
)

const ComposePickResult = (props) => (
    <Bundle load={() => import('../pages/CombinationMy/Component/ComposePickResult')}>
        {(ComposePickResult) => <ComposePickResult {...props} />}
    </Bundle>
)

const ComposeTradeSet = (props) => (
    <Bundle load={() => import('../pages/CombinationMy/Component/ComposeTradeSet')}>
        {(ComposeTradeSet) => <ComposeTradeSet {...props} />}
    </Bundle>
)

const ComposeSelectTime = (props) => (
    <Bundle load={() => import('../pages/CombinationMy/Component/ComposeSelectTime')}>
        {(ComposeSelectTime) => <ComposeSelectTime {...props} />}
    </Bundle>
)

const ComposeRiskControl = (props) => (
    <Bundle load={() => import('../pages/CombinationMy/Component/ComposeRiskControl')}>
        {(ComposeRiskControl) => <ComposeRiskControl {...props} />}
    </Bundle>
)

const ComposeSubscribeSet = (props) => (
    <Bundle load={() => import('../pages/CombinationMy/Component/ComposeSubscribeSet')}>
        {(ComposeSubscribeSet) => <ComposeSubscribeSet {...props} />}
    </Bundle>
)

//交易室
//模拟交易
const TradeBusinessBuy = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/BusinessBuy')}>
        {(TradeBusinessBuy) => <TradeBusinessBuy {...props} />}
    </Bundle>
)
const TradeBusinessSell = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/BusinessSell')}>
        {(TradeBusinessSell) => <TradeBusinessSell {...props} />}
    </Bundle>
)

const TradeSearch = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/SearchSymbol')}>
        {(TradeSearch) => <TradeSearch {...props} />}
    </Bundle>
)

const TradeSymbolPool = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/SymbolPool')}>
        {(TradeSymbolPool) => <TradeSymbolPool {...props} />}
    </Bundle>
)

const TradeSymbolPoolManage = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/SymbolPoolManage')}>
        {(TradeSymbolPoolManage) => <TradeSymbolPoolManage {...props} />}
    </Bundle>
)

const TradeCopyToPool = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/CopyToPool')}>
        {(TradeCopyToPool) => <TradeCopyToPool {...props} />}
    </Bundle>
)

const TradeAddSymbolToPool = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/AddSymbolToPool')}>
        {(TradeAddSymbolToPool) => <TradeAddSymbolToPool {...props} />}
    </Bundle>
)

//交易室 托管
const TradeTrust = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/Trust')}>
        {(TradeTrust) => <TradeTrust {...props} />}
    </Bundle>
)
//托管详情
const TradeTrustDetail = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/TrustDetail')}>
        {(TradeTrustDetail) => <TradeTrustDetail {...props} />}
    </Bundle>
)

//账户列表
const AccountList = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/AccountList')}>
        {(AccountList) => <AccountList {...props} />}
    </Bundle>
)

const MyStrategyList = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/StrategyList')}>
        {(MyStrategyList) => <MyStrategyList {...props} />}
    </Bundle>
)
const PositionSet = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/PositionSet')}>
        {(PositionSet) => <PositionSet {...props} />}
    </Bundle>
)

const PositionSetDetail = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/PositionSet_detail')}>
        {(PositionSetDetail) => <PositionSetDetail {...props} />}
    </Bundle>
)

const UserQrCode = (props) => (
    <Bundle load={() => import('../pages/UserQrCode')}>
        {(UserQrCode) => <UserQrCode {...props} />}
    </Bundle>
)

const LoginCallback = (props) => (
    <Bundle load={() => import('../pages/UserLoginCallback')}>
        {(LoginCallback) => <LoginCallback {...props} />}
    </Bundle>
)


const ParamDetail = (props) => (
    <Bundle load={() => import('../pages/StrategtyCreate/Component/paramDetail')}>
        {(ParamDetail) => <ParamDetail {...props} />}
    </Bundle>
)

const StrategyRealReport = (props) => (
    <Bundle load={() => import('../pages/StrategyRealReport')}>
        {(StrategyRealReport) => <StrategyRealReport {...props} />}
    </Bundle>
)
const StrategyRealReportFollow = (props) => (
    <Bundle load={() => import('../pages/StrategyRealReportFollow')}>
        {(StrategyRealReportFollow) => <StrategyRealReportFollow {...props} />}
    </Bundle>
)

const TradeLog = (props) => (
    <Bundle load={() => import('../pages/TradeLog')}>
        {(TradeLog) => <TradeLog {...props} />}
    </Bundle>
)
const TradeTimeOrderEdit = (props) => (
    <Bundle load={() => import('../pages/Trade/Component/EditTimeOrder')}>
        {(TimeOrderEdit) => <TimeOrderEdit {...props} />}
    </Bundle>
)

const routerMap = [
    { path: '/*', element: <Index />, exact: true },
    { path: '/login', element: <Login />, exact: true },
    { path: '/wxCallback', element: <LoginCallback />, exact: true },
    { path: '/register', element: <Register />, exact: true },
    { path: '/resetPassword', element: <ResetPassword />, exact: true },
    { path: '/bindPhone', element: <BindPhone />, exact: true },
    { path: '/changeAccount', element: <ChangeAccount />, exact: true },
    { path: '/message', element: <Message />, exact: true },
    { path: '/message/notice', element: <MessageNotice />, exact: true },
    { path: '/messageEarlyWarning', element: <MessageEarlyWarning />, exact: true },
    { path: '/userEdit', element: <UserEdit />, exact: true },
    { path: '/userInfo', element: <UserInfo />, exact: true },
    { path: '/updatePassword', element: <UpdatePassword />, exact: true },
    { path: '/userAccount', element: <UserAccount />, exact: true },
    { path: '/userOrder', element: <UserOrder />, exact: true },
    { path: '/userBuyIntegrate', element: <UserBuyIntegrate />, exact: true },
    { path: '/qrCode', element: <UserQrCode />, exact: true },
    { path: '/combination', element: <Combination />, exact: true },
    { path: '/combination/:id', element: <CombinationDetail />, exact: true },
    { path: '/combination/adjustPosition', element: <AdjustPosition />, exact: true },
    { path: '/combination/singleAnalysis', element: <SingleAnalysis />, exact: true },
    { path: '/combination/totalAnalysis/:id', element: <TotalAnalysis />, exact: true },
    { path: '/combination/totalAnalysis/:id', element: <SingleAnalysis />, exact: true },
    { path: '/recommendSelection', element: <RecommendSelection />, exact: true },
    { path: '/RecommendScanResult/:id', element: <RecommendScanResult />, exact: true },
    { path: '/selectionResult/:id', element: <SelectionResult />, exact: true },
    { path: '/selectionHistory/:id', element: <SelectionHistory />, exact: true },
    { path: '/selectionHistoryDetail/:id', element: <SelectionHistoryDetail />, exact: true },
    { path: '/strategyRank', element: <StrategyList />, exact: true },
    { path: '/strategyTrustDetail/:id', element: <StrategyTrustDetail />, exact: true },
    { path: '/strategyTrustDetailFollow/:id', element: <StrategyTrustDetailFollow />, exact: true },
    { path: '/strategyTrustDetailPublic/:id', element: <StrategyTrustDetailPublic />, exact: true },
    { path: '/strategyTrustDetailCollect/:id', element: <StrategyTrustDetailCollect />, exact: true },
    { path: '/strategyTrustDetailPublic/followList/:id', element: <FollowList />, exact: true },
    { path: '/strategyTrustReport/:id', element: <StrategyTrustReport />, exact: true },
    { path: '/strategyTrustPublic/:id', element: <StrategyTrustPublic />, exact: true },
    { path: '/strategyTrustSignal/:id', element: <StrategyTrustSignal />, exact: true },
    { path: '/strategyRealReport/:id', element: <StrategyRealReport />, exact: true },
    { path: '/strategyRealReport/follow/:id', element: <StrategyRealReportFollow />, exact: true },


    { path: '/strategyDetail/:id', element: <StrategyDetail />, exact: true },
    { path: '/strategyCreate', element: <StrategyCreate />, exact: true },
    { path: '/strategyEdit/:id', element: <StrategyEdit />, exact: true },
    { path: '/strategyCreate/paramsDetail', element: <ParamDetail />, exact: true },
    { path: '/backtestReport/:id', element: <BacktestReport />, exact: true },
    { path: '/backtestReport/trust/:id', element: <BacktestTrust />, exact: true },
    { path: '/strategyOptimalReport/:id/:releaseId', element: <OptimalReport />, exact: true },
    

    { path: '/strategyTrust', element: <StrategyTrust />, exact: true },
    { path: '/strategyFollow/:id', element: <StrategyFollow />, exact: true },
    { path: '/backtestSet/:id', element: <BacktestSet />, exact: true },
    { path: '/backtestList/:id', element: <BacktestList />, exact: true },
    { path: '/pickStockCreate', element: <PickStockCreate />, exact: true },
    { path: '/pickStockCreate/:id', element: <PickStockCreate />, exact: true },
    { path: '/pickStockCreate/areaList/:id', element: <AreaKist />, exact: true },
    { path: '/pickStockCreate/indicateList/:id', element: <PickStockIndicates />, exact: true },
    { path: '/pickStockCreate/strategyList', element: <PickStockIndicatesStrategy />, exact: true },
    { path: '/pickStockCreate/poolList', element: <PickStockPoolList />, exact: true },
    { path: '/pickStockResult', element: <PickStockResult />, exact: true },
    { path: '/pickStockResult/saveCondition', element: <PickStockResultSaveCondition />, exact: true },
    { path: '/pickStockResult/savePool', element: <PickStockResultSavePool />, exact: true },
    { path: '/pickStockResult/selectSymbol', element: <SelectSymbol />, exact: true },
    { path: '/scanCreate', element: <ScanCreate />, exact: true },
    { path: '/scanResult/:id', element: <ScanResult />, exact: true },
    { path: '/scanDetail/:id', element: <ScanDetail />, exact: true },

    { path: '/composeCreate', element: <ComposeCreate />, exact: true },
    { path: '/composeEdit/:id', element: <ComposeCreate />, exact: true },
    { path: '/composeItemDetail/:id', element: <ComposeItemDetail />, exact: true },
    { path: '/composeItemDetailSub/:id', element: <ComposeItemDetailSub />, exact: true },

    { path: '/composeCreate/pickResult', element: <ComposePickResult />, exact: true },
    { path: '/composeCreate/tradeSet', element: <ComposeTradeSet />, exact: true },
    { path: '/composeCreate/selectTime', element: <ComposeSelectTime />, exact: true },
    { path: '/composeCreate/riskControl', element: <ComposeRiskControl />, exact: true },
    { path: '/composeSubscribeSet/:id', element: <ComposeSubscribeSet />, exact: true },

    { path: '/trade/businessBuy', element: <TradeBusinessBuy />, exact: true },
    { path: '/trade/businessSell', element: <TradeBusinessSell />, exact: true },
    { path: '/trade/search', element: <TradeSearch />, exact: true },
    { path: '/trade/symbolPool', element: <TradeSymbolPool />, exact: true },
    { path: '/trade/manageSymbolPool/:id', element: <TradeSymbolPoolManage />, exact: true },
    { path: '/trade/copyToPool/:id', element: <TradeCopyToPool />, exact: true },
    { path: '/trade/addSymbolToPool/:id', element: <TradeAddSymbolToPool />, exact: true },
    { path: '/trade/trust', element: <TradeTrust />, exact: true },
    { path: '/trade/trust/:id', element: <TradeTrustDetail />, exact: true },
    { path: '/trade/myStrategyList', element: <MyStrategyList />, exact: true },
    { path: '/accountList', element: <AccountList />, exact: true },
    { path: '/trade/positionSet', element: <PositionSet />, exact: true },
    { path: '/trade/positionSetDetail', element: <PositionSetDetail />, exact: true },
    { path: '/tradeLog', element: <TradeLog />, exact: true },
    { path: '/trade/timeOrderEdit', element: <TradeTimeOrderEdit />, exact: true },


]


class App extends Component {
    componentDidMount() {

    }
    render() {
        return (
            <Router>
                <Routes>

                    {routerMap.map((router) =>
                        <Route key={router.path} exact={router.exact} path={router.path} element={router.element} />
                    )}
                </Routes>
            </Router>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(null, mapDispatchToProps)(App);

