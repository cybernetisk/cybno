import "./app.scss"

import domready from 'domready'
import React from 'react'
import ReactDOM from 'react-dom'

import Carousel from './Carousel'

import moment from 'moment'
moment.locale('nb')
//moment.tz.setDefault('Europe/Oslo')

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
      events: [],
      isLoading: true,
      error: null
    }
    getUpcomingEvents().then(data => {
      console.log(data)
      this.setState({
        events: data[props.eventGroup].slice(0, 10),
        isLoading: false
      })
    }, test => {
      this.setState({
        isLoading: false,
        error: true
      })
    })
  }

  renderWhen(event) {
    const startObj = moment(event.start)
    const endObj = moment(event.end)

    // it is a all-day-event if it only have date and no time
    const isAllDay = event.start.length === 10
    const isRange = isAllDay && event.start != event.end
    const isRangeSameMonth = isRange && startObj.format('MM') == endObj.format('MM')

    const start = isRangeSameMonth ? startObj.format('ddd D.') : startObj.format('ddd D. MMM')

    let when = start
    if (!isAllDay) {
      when += ' kl. ' + startObj.format('HH:mm')
    }

    if (isRange) {
      when += '-' + endObj.format('ddd D. MMM')
    }

    return when
  }

  renderWhat(event) {
    let what = event.summary

    if (event.url && (this.props.eventGroup === 'intern' || !/^https:\/\/confluence./.test(event.url))) {
      what = <a href={event.url}>{what}</a>
    }

    return what
  }

  render() {
    if (this.state.isLoading) {
      return <p>Henter liste...</p>
    }

    if (this.state.error) {
      return <p>Feil: Klarte ikke å hente liste.</p>;
    }

    if (!this.state.events.length) {
      return <p>Ingen hendelser ble funnet.</p>
    }

    let kafe = null
    if (this.props.eventGroup === 'public') {
      kafe = <li>Kaféen er åpen hver ukedag kl 10-15.15. Hos oss får du en kopp kaffe for kun kr 5!</li>
    }

    return (
      <ul>
        {kafe}
        {this.state.events.map((event, i) => {
          const when = this.renderWhen(event)
          const what = this.renderWhat(event)
          return (
            <li key={i}>
              <span className="event-when">{when}:</span> {what}
            </li>
          )
        })}
      </ul>
    )
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
