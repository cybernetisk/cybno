import React from "react"

const days = "Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag".split("_")
const months =
  "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split(
    "_",
  )

interface UpcomingEvent {
  all_day: boolean
  start: string
  end: string
  summary: string
  url: string | null
}

interface UpcomingEvents {
  public: UpcomingEvent[]
  intern: UpcomingEvent[]
}

let upcomingEventsPromise: Promise<UpcomingEvents>

function getUpcomingEvents() {
  if (!upcomingEventsPromise) {
    let headers = new Headers()
    headers.append("Accept", "application/json")
    let request = new Request("https://in.cyb.no/api/cal/upcoming", {
      headers,
    })
    upcomingEventsPromise = fetch(request).then((response) => {
      if (!response.ok) {
        return Promise.reject(new Error(response.statusText))
      } else {
        return response.json()
      }
    })
  }
  return upcomingEventsPromise
}

interface EventListProps {
  eventGroup: "public" | "intern"
}

interface EventListState {
  events: UpcomingEvent[]
  isLoading: boolean
  error: boolean | null
  eventsToShow: number
}

export class EventList extends React.Component<EventListProps, EventListState> {
  constructor(props: EventListProps) {
    super(props)
    this.state = {
      events: [],
      isLoading: true,
      error: null,
      eventsToShow: 0,
    }
    getUpcomingEvents().then(
      (data) => {
        this.setState({
          events: data[props.eventGroup].slice(0, 10),
          isLoading: false,
          eventsToShow: props.eventGroup === "intern" ? 2 : 4,
        })
      },
      () => {
        this.setState({
          isLoading: false,
          error: true,
        })
      },
    )
    this.showMore = this.showMore.bind(this)
  }

  getDay(d: Date) {
    if (this.props.eventGroup === "intern") {
      return days[d.getDay()].toLowerCase()
    }
    return days[d.getDay()]
  }

  getMonth(d: Date) {
    return months[d.getMonth()]
  }

  getTime(d: Date) {
    return (
      ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
    )
  }

  renderWhen(event: UpcomingEvent) {
    const start = new Date(event.start)
    const end = new Date(event.end)

    // it is a all-day-event if it only have date and no time
    const isAllDay = event.start.length === 10
    const isRange = isAllDay && event.start != event.end
    const isRangeSameMonth = isRange && start.getMonth() == end.getMonth()

    let when =
      this.getDay(start) +
      " " +
      start.getDate() +
      "." +
      (isRangeSameMonth ? "" : " " + this.getMonth(start))

    if (!isAllDay) {
      when += " kl. " + this.getTime(start)
    }

    if (isRange) {
      when +=
        "-" + this.getDay(end) + " " + end.getDate() + ". " + this.getMonth(end)
    }

    return when
  }

  renderWhat(event: UpcomingEvent) {
    let what: React.ReactNode | string = event.summary

    if (
      event.url &&
      (this.props.eventGroup === "intern" ||
        !/^https:\/\/confluence./.test(event.url))
    ) {
      what = <a href={event.url}>{what}</a>
    }

    return what
  }

  showMore(e: React.MouseEvent) {
    e.preventDefault()
    this.setState((prevState) => ({
      eventsToShow: prevState.eventsToShow + 4,
    }))
  }

  render() {
    if (this.state.isLoading) {
      return <p>Henter liste...</p>
    }

    if (this.state.error) {
      return <p>Feil: Klarte ikke å hente liste.</p>
    }

    if (!this.state.events.length) {
      return <p>Ingen hendelser ble funnet.</p>
    }

    let eventsToShow = this.state.eventsToShow
    const events = this.state.events.filter((event) => {
      if (this.props.eventGroup === "intern") {
        return this.renderWhat(event) !== "Kosetirsdag" && eventsToShow-- > 0
      } else {
        return eventsToShow-- > 0
      }
    })

    return (
      <div>
        {events.map((event, i) => {
          const when = this.renderWhen(event)
          const what = this.renderWhat(event)
          return (
            <ul key={i}>
              <li className="name">{when}</li>
              <li className="desc">{what}</li>
            </ul>
          )
        })}

        {this.state.eventsToShow === 4 && (
          <p className="more-entries">
            <a onClick={this.showMore} href="#">
              Se flere arrangement
            </a>
          </p>
        )}
      </div>
    )
  }
}
