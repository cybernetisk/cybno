import React from 'react'
import Slider from 'react-slick'

import './Carousel.scss'

export default class Carousel extends React.Component {
  render() {
    const settings = {
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: false,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    const images = [
      ['img/kafe.jpg', 'Kafé i Escape hver ukedag kl 10 til kl 15.15! Kom innom for en billig studentkaffe!'],
      ['img/fest.jpg', 'Fest'],
      ['img/kilofest.jpg', 'Kilofest'],
      ['img/fredagspub.jpg', 'Fredagspub'],
      ['img/av.jpg', 'AV-utstyr']
    ]

    return (
      <Slider {...settings}>
        {images.map(image => (
          <div>
            <div className="carousel-item">
              <img key={image[0]} src={image[0]} />
              <figcaption>{image[1]}</figcaption>
            </div>
          </div>
        ))}
      </Slider>
    )
  }
}