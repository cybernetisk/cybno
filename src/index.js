import './app.scss'

import domready from 'domready'
import React from 'react'
import { AppContainer } from 'react-hot-loader'
import ReactDOM from 'react-dom'

const days = 'sø._ma._ti._on._to._fr._lø.'.split('_')
const months = 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'.split('_')

let upcomingEventsPromise
function getUpcomingEvents() {
  if (!upcomingEventsPromise) {
    let headers = new Headers()
    headers.append('Accept', 'application/json')
    let request = new Request('https://in.cyb.no/api/cal/upcoming', {headers})
    upcomingEventsPromise = fetch(request)
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

  getDay(d) {
    return days[d.getDay()]
  }

  getMonth(d) {
    return months[d.getMonth()]
  }

  getTime(d) {
    return ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2)
  }

  renderWhen(event) {
    const start = new Date(event.start)
    const end = new Date(event.end)

    // it is a all-day-event if it only have date and no time
    const isAllDay = event.start.length === 10
    const isRange = isAllDay && event.start != event.end
    const isRangeSameMonth = isRange && start.getMonth() == end.getMonth()

    let when = this.getDay(start) + ' ' + start.getDate() + '.' + (isRangeSameMonth ? '' : ' ' + this.getMonth(start))

    if (!isAllDay) {
      when += ' kl. ' + this.getTime(start)
    }

    if (isRange) {
      when += '-' + this.getDay(end) + ' ' + end.getDate() + '. ' + this.getMonth(end)
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
      //kafe = <li>Kaféen holder stengt fra 15. Mai grunnet eksamensperiode og sommerperiode. Velkommen tilbake til kaféen under fadderukene til høsten!</li>
      //kafe = <li>Kaféen holder stengt grunnet eksamensperiode og jul. Velkommen tilbake til kaféen når den åpner 16. januar!</li>
      kafe = <p>Kaféen er åpen hver ukedag kl 10-15.15. Hos oss får du en kopp kaffe for kun kr 5!</p>
    }

    return (
        {kafe},
        <ul>
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
    ReactDOM.render(<AppContainer><Carousel /></AppContainer>, elm)
  }

  if (elm = document.getElementById("next-events-intern")) {
    ReactDOM.render(<AppContainer><EventList eventGroup={'intern'} /></AppContainer>, elm)
  }

  if (elm = document.getElementById("next-events-public")) {
    ReactDOM.render(<AppContainer><EventList eventGroup={'public'} /></AppContainer>, elm)
  }
})
