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

class ImageFigure extends React.Component {
  render() {
    return (
      <figure>
        <img/>
        <figcaption>
          <h2></h2>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  render() {

    let controllerUnits = [],//控制单元数组
      imageFigures = [];//图片数组

    imagesData.forEach(function (imageData) {
      imageFigures.push(<ImageFigure data={imageData}/>);
    });

    return (
      <section className="stage">
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
