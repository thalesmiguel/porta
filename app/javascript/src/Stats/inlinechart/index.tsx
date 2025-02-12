import { Component, createRef } from 'react'
import c3 from 'c3'
import { fetchData } from 'utilities/fetchData'
import moment from 'moment'
import numeral from 'numeral'

type Props = {
  endPoint: string,
  metricName: string,
  title: string,
  unitPluralized: string
}

type State = {
  loading: boolean,
  title: string,
  total: string,
  values: Array<number>,
  unit: string,
  unitPluralized: string
}

type RefObject = {
  current: null | HTMLDivElement
}

type DataMetric = {
  unit: string
}

type Data = {
  metric: DataMetric,
  total: number,
  values: Array<number>
}

class InlineChart extends Component<Props, State> {
  c3ChartContainer: RefObject;

  constructor (props: Props) {
    super(props)
    this.c3ChartContainer = createRef()
    this.state = {
      loading: true,
      title: this.props.title,
      total: '',
      values: [],
      unit: '',
      unitPluralized: this.props.unitPluralized
    }
  }

  generateC3Chart () {
    const nodeElem = this.c3ChartContainer.current
    c3.generate({
      bindto: nodeElem,
      axis: {
        x: { show: false },
        y: { show: false }
      },
      legend: { show: false },
      point: { show: false },
      data: {
        columns: [
          [...this.state.values] as any // FIXME: number not assignable to string
        ]
      },
      tooltip: {
        contents: function (d) {
          return `<span><i class='tooltip-dot'></i> ${d[0].value}</span>`
        }
      },
      onresize: function () {
        if (nodeElem !== null) {
          nodeElem.style.maxHeight = 'none'
        }
      }
    })
  }

  getTotalAsString (total: number, unit: string): string {
    return `${numeral(total).format('0,0')} ${unit.substring(0, 10)}`
  }

  pluralizeUnit (unit: string, total: number): string {
    if (unit.slice(-1) !== 's' && total !== 1) {
      return this.state.unitPluralized
    }
    return unit
  }

  updateState (data: Data) {
    const unit = this.pluralizeUnit(data.metric.unit, data.total)
    const total = this.getTotalAsString(data.total, unit)

    this.setState({
      loading: false,
      total,
      unit,
      values: data.values
    }, () => this.generateC3Chart())
  }

  getURL (): URL {
    const { endPoint, metricName } = this.props
    const today = moment(new Date())
    const until = today.format('YYYY-MM-DD')
    const since = today.subtract(30, 'day').format('YYYY-MM-DD')
    const granularity = 'day'
    const url = new URL(endPoint, window.location.origin)
    url.searchParams.append('metric_name', metricName)
    url.searchParams.append('since', since)
    url.searchParams.append('until', until)
    url.searchParams.append('granularity', granularity)
    return url
  }

  async componentDidMount () {
    const url = this.getURL().toString()
    const response = await fetchData<Data>(url)
    this.updateState(response)
  }

  render () {
    const { loading, title, total } = this.state
    return (
      <div>
        <div className={ `loading ${loading ? '' : 'hide'}` }>
          <i className="fa fa-spinner fa-spin"></i>
        </div>
        <div title={title} className="metric-name">{title}</div>
        <div className="total">{total}</div>
        <div className="inline-chart-graph" ref={this.c3ChartContainer}></div>
      </div>
    )
  }
}

export { InlineChart as default, Props, State }
