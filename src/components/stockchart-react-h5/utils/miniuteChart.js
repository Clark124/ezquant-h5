export default class MiniuteChart {
    constructor(canvas, data, ctx, quote) {
        this.canvas = canvas
        this.ctx = ctx
        this.cMargin = 16 //canvas内边距
        this.originX = this.cMargin //坐标轴原点
        this.originY = canvas.height
        this.cWidth = canvas.width - this.cMargin * 2 //canvas中部的宽/高  
        this.cHeight = canvas.height

        const allBarsNum = data.values.length
     
        let value = data.values.map(item => {
            return item[3]
        })
     
        this.averageValueList = []
        for (let i = 0; i < value.length; i++) {
            let averageValue = value.slice(0, i + 1).reduce((pre, current) => {
                return pre + current
            })
            this.averageValueList.push(parseFloat(averageValue / (i + 1)).toFixed(2))
        }

        //当前均价
        this.currentAveragePrice = ""
        this.currentAverageValue = this.averageValueList[this.averageValueList.length - 1] ? this.averageValueList[this.averageValueList.length - 1] : '--'

        this.openValue = value[0] ? value[0] : '--'
        this.maxValue = value.length>0?Math.max(...value):'--'
        this.minValue = value.length>0?Math.min(...value):'--'
        let maxRatio = value.length>0?this.maxValue / this.openValue - 1:'--'
        let minRatio = value.length>0?(1 - this.minValue / this.openValue):'--'
        this.ratio = value.length>0?Math.max(maxRatio, minRatio, 0.01):0
        this.maxValue = value.length>0?parseFloat(this.openValue * (1 + this.ratio)).toFixed(2):'--'
        this.minValue = value.length>0?parseFloat(this.openValue * (1 - this.ratio)).toFixed(2):'--'
        this.quote = quote  //行情数据

        this.currentPrice = value[value.length - 1] ? value[value.length - 1] : '--'
        this.currentPrice_cross = ""
        //当前涨跌幅率
        this.currentRatio = value.length>0?parseFloat((this.currentPrice / this.openValue - 1) * 100).toFixed(2) + '%':'--%'
       
        //当前涨跌值
        this.riseFallValue = value.length>0?parseFloat(this.currentPrice - this.openValue).toFixed(2):'--'
        this.data = data
        this.currentData = {
            ...data,
            values: value,
            valueList: data.values,
            categoryData: data.categoryData,
            vol: data.vol
        }
    }

    initChart() {
        const ctx = this.ctx
        this._drawLineLabelMarkers(ctx)
        this._drawLastPrice()
        this.drawMinLine()
    }
    refreshChart(data) {

        const currentDate = data.categoryData[0]
        const currentDataLen = this.currentData.categoryData.length
        const lastDate = this.currentData.categoryData[currentDataLen - 1]

        let value = this.currentData.values

        if (currentDate === lastDate) {
            value[currentDataLen - 1] = data.values[0][3]
            const dataLen = this.data.values.length
            this.data.values[dataLen - 1] = data.values[0]
            this.data.vol[dataLen - 1] = data.vol[0]
        } else {
            value.push(data.values[0][3])
            this.data.values.push(data.values[0])
            this.data.categoryData.push(data.categoryData[0])
            this.data.vol.push(data.vol[0])
        }

        this.averageValueList = []
        
        for (let i = 0; i < value.length; i++) {
            let averageValue = value.slice(0, i + 1).reduce((pre, current) => {
                return pre + current
            })
            this.averageValueList.push(parseFloat(averageValue / (i + 1)).toFixed(2))
        }
        //当前均价
        this.currentAveragePrice = ""
        this.currentAverageValue = this.averageValueList[this.averageValueList.length - 1]

        this.openValue = value[0]
        this.maxValue = Math.max(...value)
        this.minValue = Math.min(...value)
        let maxRatio = this.maxValue / this.openValue - 1
        let minRatio = 1 - this.minValue / this.openValue
        this.ratio = Math.max(maxRatio, minRatio, 0.01)
        this.maxValue = parseFloat(this.openValue * (1 + this.ratio)).toFixed(2)
        this.minValue = parseFloat(this.openValue * (1 - this.ratio)).toFixed(2)
       
        this.currentPrice = value[value.length - 1]
        this.currentPrice_cross = ""
        //当前涨跌幅率
        this.currentRatio = parseFloat((this.currentPrice / this.openValue - 1) * 100).toFixed(2) + '%'
        //当前涨跌值
        this.riseFallValue = parseFloat(this.currentPrice - this.openValue).toFixed(2)


        this.currentData = {
            ...this.data,
            values: value,
            valueList: this.data.values,
        }
        const ctx = this.ctx
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.initChart()
    }

    refreshQuote(quote) {
        this.quote = quote
    }


    // 绘制图表轴、标签和标记
    _drawLineLabelMarkers(ctx) {
        ctx.lineWidth = 1
        ctx.strokeStyle = "#eaeaea"
        //画标记
        ctx.strokeRect(this.originX, 0, this.cWidth, this.originY)
        ctx.fillStyle = '#eee'
        ctx.fillRect(this.originX, 0, this.cWidth, 25)
        this._drawMarkers();

    }
    //画分割线及文字
    _drawMarkers() {
        const ctx = this.ctx
        let oneValue = (this.cHeight - 25) / 4
        let oneWidth = this.cWidth / 4
        for (var i = 1; i < 4; i++) {
            if (i === 2) {
                this._drawLine(this.originX, oneValue * i + 25, this.originX + this.cWidth, oneValue * i + 25)
                this._drawLine(this.originX + oneWidth * i, 25, this.originX + oneWidth * i, this.originY)
            } else {
                ctx.setLineDash([3, 2], 5)
                this._drawLine(this.originX, oneValue * i + 25, this.originX + this.cWidth, oneValue * i + 25);
                this._drawLine(this.originX + oneWidth * i, 25, this.originX + oneWidth * i, this.originY)
                ctx.setLineDash([])
            }
        }
    }
    //画最新价
    _drawLastPrice() {
        const ctx = this.ctx
        ctx.font = '12px Arial'
        ctx.fillStyle = '#333'
        ctx.fillText('均价', this.originX + 5, 16);
        ctx.fillText('最新', this.originX + 120, 16);
        let averagePrice = this.currentAveragePrice ? this.currentAveragePrice : this.currentAverageValue
        let newPrice = this.currentPrice_cross ? this.currentPrice_cross : this.currentPrice

        ctx.fillStyle = '#ff6339'
        ctx.fillText(averagePrice, this.originX + 35, 16);
        if (this.quote.px_change >= 0) {
            ctx.fillStyle = '#ff6339'
        } else {
            ctx.fillStyle = '#3EEFA5'
        }
        ctx.fillText(newPrice, this.originX + 150, 16);
    }
    //画分时图
    drawMinLine() {
        const ctx = this.ctx
        const valueList = this.currentData.values
        const dateList = this.currentData.categoryData
        const volList = this.currentData.vol
        const { height: chartHeight } = this.canvas
        this.pointWith = this.cWidth / 240
        //计算每个点的坐标
        this.pointsList = []
        this.averagePpointsList = []
        // console.log(valueList)
        for (let i = 0; i < valueList.length; i++) {
            let x = (i + 1) * this.pointWith + this.originX
            let y = chartHeight - (chartHeight - 25) * (valueList[i] - this.minValue) / (this.maxValue - this.minValue)
            let aY = chartHeight - (chartHeight - 25) * (this.averageValueList[i] - this.minValue) / (this.maxValue - this.minValue)
            this.pointsList.push({ x: parseFloat(x), y: parseFloat(y), currentPrice: valueList[i], date: dateList[i], vol: volList[i] })
            this.averagePpointsList.push({ x: parseFloat(x), y: parseFloat(aY), currentAveragePrice: this.averageValueList[i] })
        }

        // console.log(this.pointsList)


        //分时线
        if(this.pointsList.length===0){
            return
        }
        for (let i = 0; i < this.pointsList.length; i++) {
            if (i === 0) {
                ctx.beginPath();
                ctx.moveTo(this.pointsList[i].x, this.pointsList[i].y);
            } else {
                ctx.lineTo(this.pointsList[i].x, this.pointsList[i].y)
            }
        }
        ctx.strokeStyle = '#ff6339'
        ctx.stroke()


        //时间范围
        // for (let i = 0; i < this.pointsList.length; i++) {
        //     if (i === 0) {
        //         ctx.beginPath();
        //         ctx.moveTo(this.pointsList[i].x, this.pointsList[i].y);
        //     } else {
        //         ctx.lineTo(this.pointsList[i].x, this.pointsList[i].y)
        //         if (i === this.pointsList.length - 1) {
        //             ctx.lineTo(this.pointsList[i].x, chartHeight)
        //             ctx.lineTo(this.pointsList[0].x, chartHeight)
        //         }
        //     }
        // }

        // ctx.closePath()
        // const gradient = ctx.createLinearGradient(0, 0, 0, 300);

        // gradient.addColorStop(0, "#ff6339")
        // gradient.addColorStop(1, "#fff")
        // // ctx.globalAlpha = 0.2;
        // ctx.fillStyle = gradient;
        // ctx.fill();
        // ctx.globalAlpha = 0.1;

        //分时均线
        
        for (let i = 0; i < this.pointsList.length; i++) {
            if (i === 0) {
                ctx.beginPath();
                ctx.moveTo(this.originX, this.averagePpointsList[i].y);
            } else {
                ctx.lineTo(this.averagePpointsList[i].x, this.averagePpointsList[i].y)
            }
        }
        ctx.strokeStyle = '#ffce09'
        ctx.stroke()


        //数值信息
        ctx.font = '12px Arial'
        //最大值
        ctx.fillStyle = '#ff6339'
        ctx.fillText(this.maxValue, this.originX + 3, 35);
        ctx.fillText((parseFloat(this.ratio * 100).toFixed(2) ? parseFloat(this.ratio * 100).toFixed(2) : 0) + '%', this.cWidth - 20, 35);
        //最小值
        ctx.fillStyle = '#53b900'
        ctx.fillText(this.minValue, this.originX + 3, this.originY - 3);
        ctx.fillText('-' + (parseFloat(this.ratio * 100).toFixed(2) ? parseFloat(this.ratio * 100).toFixed(2) : 0) + '%', this.cWidth - 25, this.originY - 3);
        //昨日收盘价
        ctx.fillStyle = '#333'
        ctx.fillText(this.openValue, this.originX + 3, this.cHeight / 2 + 15);

    }

    //划线
    _drawLine(x, y, X, Y, color) {
        const ctx = this.ctx
        if (color) {
            ctx.strokeStyle = color
        } else {
            ctx.strokeStyle = '#eaeaea'
        }
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(X, Y);
        ctx.stroke();
    }
    //画十字线
    drawCrossLine(x, y) {
        const ctx = this.ctx
        // console.log(this.pointsList)
        for (var i = 0; i < this.pointsList.length; i++) {
            if (x >= parseFloat(this.pointsList[i].x - this.pointWith) && x <= parseFloat(this.pointsList[i].x)) {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.clickPoint = [{ x: x + this.pointWith / 2, y: this.pointsList[i].y }]
                this.currentPrice_cross = this.pointsList[i].currentPrice
                this.currentAveragePrice = this.averagePpointsList[i].currentAveragePrice
                this.initChart()
                this.showCrollLine()
                // this.setState({
                //     clickPoint: [{ x: x + this.pointWith / 2, y: this.pointsList[i].y }],
                //     currentPrice: this.pointsList[i].currentPrice,
                //     riseFallValue: parseFloat(this.pointsList[i].currentPrice - this.openValue).toFixed(2),
                //     currentAveragePrice: this.averagePpointsList[i].currentAveragePrice,
                //     currentRatio: parseFloat((this.pointsList[i].currentPrice / this.openValue - 1) * 100).toFixed(2) + '%',
                //     currentTime: this.pointsList[i].date,
                //     currentVol: this.pointsList[i].vol,
                // })
                break
            }
        }
    }
    showCrollLine() {
        const x = this.clickPoint[0].x
        const y = parseFloat(this.clickPoint[0].y)
        this._drawLine(this.originX, y, this.originX + this.cWidth, y, '#aaa')
        this._drawLine(x, this.originY, x, 25, '#aaa')
    }
    //重绘
    clearLine(x, y) {
        const ctx = this.ctx
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.clickPoint = []
        this.currentPrice_cross = ""
        this.currentAveragePrice = ""
        this.initChart()

    }
}