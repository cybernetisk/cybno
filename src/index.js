import "./app.scss"

import domready from 'domready'
import React from 'react'
import ReactDOM from 'react-dom'

import Carousel from './Carousel'

import moment from 'moment-timezone'
moment.locale('nb')
moment.tz.setDefault('Europe/Oslo')

let upcomingEventsPromise
function getUpcomingEvents() {
  if (!upcomingEventsPromise) {
    upcomingEventsPromise = fetch('https://internt.cyb.no/api/cal/upcoming')
      .then(response => {
        if (!response.ok) {
          return Promise.reject(new Error(response.statusText))
        } else {
          return response.json()
        }
      })
  }
  return upcomingEventsPromise
}

class EventList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: []
    }
    getUpcomingEvents().then(data => {
      console.log(data)
      this.setState({
        'events': data[props.eventGroup].slice(0, 10)
      })
    })
  }

  render() {
    if (!this.state.events.length) {
      return null
    } else {
      let i = 0
      let kafe = null
      if (this.props.eventGroup === 'public') {
        kafe = <li>Kaféen er åpen hver ukedag kl 10-15.15. Hos oss får du en kopp kaffe for kun kr 5!</li>
      }

      return (
        <ul>
          {kafe}
          {this.state.events.map(event => {
            let when = moment(event.start).format('ddd D. MMM')
            if (moment(event.start).format('HH:mm') != '00:00') {
              when += ' kl. ' + moment(event.start).format('HH:mm')
            }
            let what = event.summary
            if (event.url && (this.props.eventGroup === 'intern' || !/^https:\/\/confluence./.test(event.url))) {
              what = <a href={event.url}>{what}</a>
            }
            return (
              <li key={i++}>
                <span className="event-when">{when}:</span> {what}
              </li>
            )
          })}
        </ul>
      )
    }
  }
}

domready(() => {
  let elm;

  if (elm = document.getElementById("page-carousel")) {
    ReactDOM.render(<Carousel />, elm)
  }

  if (elm = document.getElementById("next-events-intern")) {
    ReactDOM.render(<EventList eventGroup={'intern'} />, elm)
  }

  if (elm = document.getElementById("next-events-public")) {
    ReactDOM.render(<EventList eventGroup={'public'} />, elm)
  }
})
