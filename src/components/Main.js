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

class AppComponent extends React.Component {
  render() {
    return (
      //舞台
      <section className="stage">
        {/*图片区域*/}
        <section className="img-sec">

        </section>
        {/*控制条*/}
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
