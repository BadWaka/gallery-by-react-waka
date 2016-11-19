require('../styles/app.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片数据
let imagesData = require('../data/imagesData.json');

// 利用自执行函数，将图片名转换为URL
imagesData = (function generateImageURL(imagesDataArr) {
    for (let i = 0; i < imagesDataArr.length; i++) {
        let imageData = imagesDataArr[i];
        imageData.imageURL = require('../images/' + imageData.fileName);
        imagesDataArr[i] = imageData;
    }
    return imagesDataArr;
})(imagesData);

/**
 * 获取区间内的一个随机值
 * @param min
 * @param max
 */
function getRangeRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 获取 0-30° 之间的一个任意正负值
 */
function get30DegRandom() {
    let symbol = Math.random() > 0.5 ? '' : '-';
    return symbol + Math.ceil(Math.random() * 30);
}

/**
 * 图片组件
 */
class ImageFigure extends React.Component {
    render() {

        //样式对象
        let styleObj = {};

        //如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        //如果图片的旋转角度有值并且不为0，添加旋转角度
        if (this.props.arrange.rotate) {
            // //TODO 兼容各种浏览器
            // let preArr = ['-webkit-', '-moz-', '-ms-', '-o-', ''];//厂商前缀
            // preArr.forEach(function (value) {
            //     styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            // }.bind(this));
            styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        }

        console.log("styleObj = " + JSON.stringify(styleObj));

        return (
            <figure className="img-figure" style={styleObj}>
                <img className="img-photo" src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
        );
    }
}

class AppComponent extends React.Component {

    /**
     * 构造方法
     * @param props
     */
    constructor(props) {
        super(props);

        //常量，全部初始化为0
        this.constant = {
            centerPos: { //中心图片的位置点
                left: 0,
                right: 0
            },
            hPosRange: { //水平方向的取值范围
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: { //垂直方向的取值范围
                topSecY: [0, 0],
                x: [0, 0]
            }
        };

        //状态
        this.state = {
            //图片状态数组
            imgsArrangeArr: [
                // {
                //     pos: {
                //         left: 0,
                //         top: 0
                //     },
                //     rotate: 0
                // }
            ]
        };
    }

    /**
     * 组件渲染完毕的回调，为每张图片计算其位置范围
     */
    componentDidMount() {

        //首先拿到舞台的大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),  //拿到舞台DOM节点
            stageW = stageDOM.scrollWidth,  //拿到舞台的宽
            stageH = stageDOM.scrollHeight, //拿到舞台的高
            halfStageW = Math.floor(stageW / 2),
            halfStageH = Math.floor(stageH / 2);

        //拿到imageFigure的大小
        let imageFigureDOM = ReactDOM.findDOMNode(this.refs.imageFigure0),
            imgW = imageFigureDOM.scrollWidth,
            imgH = imageFigureDOM.scrollHeight,
            halfImgW = Math.floor(imgW / 2),
            halfImgH = Math.floor(imgH / 2);

        //计算中心图片的位置
        this.constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        //左右区域取值范围
        this.constant.hPosRange.leftSecX[0] = 0 - halfImgW;
        this.constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.constant.hPosRange.y[0] = 0 - halfImgH;
        this.constant.hPosRange.y[1] = stageH - halfImgH;

        //上侧区域取值范围
        this.constant.vPosRange.topSecY[0] = 0 - halfImgH;
        this.constant.vPosRange.topSecY[1] = halfStageH - halfImgH * 3;
        this.constant.vPosRange.x[0] = halfStageW - imgW;
        this.constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);

    }

    /**
     * 重新布局所有图片
     * @param centerIndex 指定居中排布哪个图片
     */
    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr,
            constant = this.constant,
            centerPos = constant.centerPos,
            hPosRange = constant.hPosRange,
            vPosRange = constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopSecY = vPosRange.topSecY,
            vPosRangeX = vPosRange.x,
            imgsArrangeTopArr = [],//上侧布局图片数组
            topImgNum = Math.ceil(Math.random() * 2),//上侧布局图片的数量,取一个或者不取
            topImgSpliceIndex = 0,//用来标记上面的图片是从数组对象的哪个位置拿出来的
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);//中心图片，拿到中心图片的状态

        //布局位于中间的图片
        imgsArrangeCenterArr[0].pos = centerPos;
        imgsArrangeCenterArr[0].rotate = 0;//居中的图片不需要旋转

        //布局位于上侧的图片
        console.log("上侧布局图片的数量 topImgNum = " + topImgNum);
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopSecY[0], vPosRangeTopSecY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom()
            }
        });

        //布局左右两侧的图片
        for (let i = 0; i < imgsArrangeArr.length; i++) {
            let halfLength = imgsArrangeArr.length / 2;//数组的一半
            let hPosRangeLeftOrRightX = null;

            //前半部分布局在左边，右半部分布局在右边
            if (i < halfLength) {
                hPosRangeLeftOrRightX = hPosRangeLeftSecX;
            } else {
                hPosRangeLeftOrRightX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLeftOrRightX[0], hPosRangeLeftOrRightX[1])
                },
                rotate: get30DegRandom()
            }
        }

        //把上方图片塞回原数组中
        console.log("上方图片数组 imgsArrangeTopArr = " + JSON.stringify(imgsArrangeTopArr));
        imgsArrangeTopArr.forEach(function (imgsArrange) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrange);//添加回原数组的原位置中
        });

        //把中心图片也塞回原数组中
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        //重新设置state，让React重新渲染UI
        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });

    }

    /**
     * 渲染
     * @return {XML}
     */
    render() {
        let controllerUnits = [],//控制单元数组
            imageFigures = [];//图片数组

        imagesData.forEach(function (imageData, index) {

            //容错处理，如果没有状态，则初始化一个值
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        right: 0
                    },
                    rotate: 0
                }
            }

            imageFigures.push(<ImageFigure key={index} data={imageData} ref={'imageFigure' + index}
                                           arrange={this.state.imgsArrangeArr[index]}/>);
        }.bind(this));//把React Component绑定到React中，这样既可在forEach中直接引用

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imageFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

export default AppComponent;