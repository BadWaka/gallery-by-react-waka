require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

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
 * 图片组件
 */
class ImageFigure extends React.Component {
  render() {
    return (
      <figure className="img-figure">
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
    this.state = {
      imgsArrangeArr: [
        /*{
         pos: {
         left: 0,
         top: 0
         }
         }*/
      ]
    };
  }

  /**
   * 组件渲染完毕的回调，为每张图片计算其位置范围
   */
  componentDidMount() {

    //首先拿到舞台的大小
    let stageDOM = React.findDOMNode(this.refs.stage),  //拿到舞台DOM节点
      stageW = stageDOM.scrollWidth,  //拿到舞台的宽
      stageH = stageDOM.scrollHeight, //拿到舞台的高
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //拿到imageFigure的大小
    let imageFigureDOM = React.findDOMNode(this.refs.imageFigure0),
      imgW = imageFigureDOM.scrollWidth,
      imgH = imageFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

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

  }

  /**
   * 渲染
   * @return {XML}
   */
  render() {
    let controllerUnits = [],//控制单元数组
      imageFigures = [];//图片数组

    imagesData.forEach(function (imageData, index) {
      imageFigures.push(<ImageFigure data={imageData} ref={'imageFigure' + index}/>);
    });

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

AppComponent.defaultProps = {};

export default AppComponent;
