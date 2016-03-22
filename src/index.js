//window.jQuery = require("jquery")
//require("foundation-sites")

import "./app.scss"

//jQuery(document).foundation()

import React from 'react'
import ReactDOM from 'react-dom'

import Carousel from './Carousel'

class NextEventsIntern extends React.Component {
  render() {
    return (
      <ul>
        <li>22. mars: Kosetirsdag</li>
        <li>29. mars: Kosetirsdag</li>
        <li>31. mars: Filmkveld</li>
        <li>5. april: Kosetirsdag</li>
        <li>9. april: Internfest v/HS</li>
        <li>14. april: Filmkveld</li>
        <li>15-18. april: Hyttetur</li>
        <li>23. april: Internfest v/arr</li>
        <li>30. april-2. mai: Danskebåttur</li>
      </ul>
    )
  }
}

class NextEventsPublic extends React.Component {
  render() {
    return (
      <ul>
        <li>Kaféen er åpen hver ukedag kl 10-15.15. Hos oss får du en kopp kaffe for kun kr 5!</li>
        <li>1. april kl 18: <a href="https://www.facebook.com/events/227212980961773/">Escape: The Prison Fest</a></li>
        <li>4. april: Hverdagsinformatikk</li>
        <li>7. april kl 12.15: Lunsj-foredrag - Studieteknikk</li>
        <li>8. april kl 18: Fredagspub</li>
        <li>13. april kl 16.30: Booster draft: SOI</li>
      </ul>
    )
  }
}

ReactDOM.render(<Carousel />, document.getElementById("page-carousel"))
ReactDOM.render(<NextEventsIntern />, document.getElementById("next-events-intern"))
ReactDOM.render(<NextEventsPublic />, document.getElementById("next-events-public"))
