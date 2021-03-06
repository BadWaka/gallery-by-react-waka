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

    /**
     * imgFigure的点击处理函数
     * @param e
     */
    handleClick(e) {

        //如果是居中的，则翻转
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        }
        //否则，调用居中方法
        else {
            this.props.center();
        }

        e.stopPropagation();//不在派发事件
        e.preventDefault();//取消事件的默认动作
    }

    render() {

        //样式对象
        let styleObj = {};

        //如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        //如果图片的旋转角度有值并且不为0，添加旋转角度
        if (this.props.arrange.rotate) {
            let preArr = ['-webkit-', '-moz-', '-ms-', '-o-', ''];//厂商前缀,兼容各种浏览器
            preArr.forEach(function (value) {
                styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        if (this.props.arrange.isCenter) {
            styleObj.zIndex = 11;//给中心点设置z-index属性，防止其被其他图片覆盖
        }
        let imgFigureClassName = 'img-figure';//img-figure的类名
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';//如果isInverse为true，则给imgFigure添加类名'is-inverse'

        // console.log("styleObj = " + JSON.stringify(styleObj));

        return (
            //<figure>标签用作文档中插图的图像
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
                {/*图片*/}
                <img className="img-photo" src={this.props.data.imageURL} alt={this.props.data.title}/>
                {/*<figcaption>用来定义figure元素的标题、说明等等*/}
                <figcaption>
                    {/*图片标题*/}
                    <h2 className="img-title">{this.props.data.title}</h2>
                    {/*图片背后的内容*/}
                    <div className="img-back" onClick={this.handleClick.bind(this)}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

/**
 * 控制组件
 */
class ControllerUnit extends React.Component {
    handleClick(e) {

        //如果点击的是当前正在选中态的按钮，则翻转图片；否则将对应的图片居中
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        let controllerUnitClassName = 'controller-unit';

        //如果对应的是居中的图片，显示控制按钮的居中态
        if (this.props.arrange.isCenter) {
            controllerUnitClassName += ' is-center';

            //如果同时对应的是翻转图片，显示控制按钮的翻转态
            if (this.props.arrange.isInverse) {
                controllerUnitClassName += ' is-inverse';
            }
        }

        return (
            <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}/>
        );
    }
}

/**
 * 整个App
 */
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
                //     rotate: 0,  //旋转角度
                //     isInverse: false,  //图片是否是反面，false为正面，true为反面
                //     isCenter: false //图片是否居中
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
     * 翻转图片
     * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
     * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
     */
    inverse(index) {
        return function () {
            let imgsArrangeArr = this.state.imgsArrangeArr;
            console.log("index = " + index + " isInverse = " + imgsArrangeArr[index].isInverse);
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;//进行一个取反操作
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
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

        // console.log("imgsArrangeArr = " + JSON.stringify(imgsArrangeArr));

        //布局位于中间的图片
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0, //居中的图片不需要旋转
            isCenter: true
        };

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
                rotate: get30DegRandom(),
                isCenter: false
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
                rotate: get30DegRandom(),
                isCenter: false
            }
        }

        debugger;

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
     * 利用rearrange函数，居中对应index的图片
     * @param index 需要被居中的图片对应的图片信息数组的index值
     * @return {Function}
     */
    center(index) {
        return function () {
            this.rearrange(index);
        }.bind(this);
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
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                };
                // console.log("初始化赋值 index = " + index + " obj = " + JSON.stringify(this.state.imgsArrangeArr[index]));
            }

            //填充图片数组
            imageFigures.push(<ImageFigure key={index} data={imageData} ref={'imageFigure' + index}
                                           arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                           center={this.center(index)}/>);

            //填充控制单元数组
            controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]}
                                                 inverse={this.inverse(index)} center={this.center(index)}/>);

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