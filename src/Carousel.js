import React from 'react'
import Slider from 'react-slick'

import './Carousel.scss'

export default class Carousel extends React.Component {
  render() {
    const settings = {
      autoplay: true,
      autoplaySpeed: 6000,
      arrows: false,
      dots: true,
      infinite: true,
      lazyLoad: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    const images = [
      // image ratio: 1.85:1, preferred with: 1170px (height: 632px)
      //['KAFEBILDE', 'Kafé i Escape hver ukedag kl 10 til kl 15.15! Kom innom for en billig studentkaffe!'],
      ['http://cyb.no/2016-assets/vannspeil.jpg', 'Studentkafeen og -baren Escape ligger i kjelleren på Ole-Johan Dahls hus ved Forskningsparken.'],
      ['http://cyb.no/2016-assets/pub.jpg', 'Escape tilbyr en romslig og hyggelig samlingsplass for studenter.'],
      ['http://cyb.no/2016-assets/kilofest.jpg', 'Fadderuka 2014 ble avsluttet med KiloFEST i Escape.'],
      ['http://cyb.no/2016-assets/faglig-escape.jpg', 'Vi arrangerer både sosiale og faglige eventer.'],
      ['http://cyb.no/2016-assets/styrekurs.jpg', 'Som frivillig får man oppleve ting også utenfor instituttet, som her fra teambuilding på styrekurs for hoved- og kjellerstyret på farmasihytta.'],
      ['http://cyb.no/2016-assets/baal_fikset.jpg', 'Hyttetur for interne er noe vi også tilbyr.'],
      ['http://cyb.no/2016-assets/pub.jpg', 'Som regel god stemning og masse folk på fredagspub.'],
      ['http://cyb.no/2016-assets/chill.jpg', 'Escape i kafetid.'],
      ['http://cyb.no/2016-assets/foredrag_fikset.jpg', 'Vi arrangerer også foredrag med faglig innhold.'],
      ['http://cyb.no/2016-assets/kafe_fikset.png', 'Ønsker du å være en barista? Vi trenger alltid folk.'],
      ['http://cyb.no/2016-assets/konsert_fikset.png', 'Jubileumskonser.'],
    ]

    return (
      <Slider {...settings}>
        {images.map(image => (
          <div key={image[0]}>
            <div className="carousel-item">
              <img src={image[0]} />
              <figcaption>{image[1]}</figcaption>
            </div>
          </div>
        ))}
      </Slider>
    )
  }
}
