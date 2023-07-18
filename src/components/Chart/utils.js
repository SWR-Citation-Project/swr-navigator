import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from "react"
import ResizeObserver from "resize-observer-polyfill"

export const accessorPropsType = (
  PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
  ])
)

export const callAccessor = (accessor, d, i) => (
  typeof accessor === "function" ? accessor(d, i) : accessor
)

export const dimensionsPropsType = (
  PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    marginTop: PropTypes.number,
    marginRight: PropTypes.number,
    marginBottom: PropTypes.number,
    marginLeft: PropTypes.number,
  })
)

export const combineChartDimensions = dimensions => {
  let parsedDimensions = {
    marginTop: 40,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 75,
    ...dimensions,
  }

  return {
    ...parsedDimensions,
    boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
    boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
  }
}

export const useChartDimensions = passedSettings => {
  const ref = useRef()
  const dimensions = combineChartDimensions(passedSettings)

  const [width, changeWidth] = useState(0)
  const [height, changeHeight] = useState(0)

  useEffect(() => {
    if (dimensions.width && dimensions.height) return [ref, dimensions]

    const element = ref.current
    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return
      if (!entries.length) return

      const entry = entries[0]

      if (width !== entry.contentRect.width) changeWidth(entry.contentRect.width)
      if (height !== entry.contentRect.height) changeHeight(entry.contentRect.height)
    })

    resizeObserver.observe(element)

    return () => resizeObserver.unobserve(element)
  }, [passedSettings, height, width, dimensions])

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  })

  return [ref, newSettings]
}

let lastId = 0
export const useUniqueId = (prefix="") => {
  lastId++
  return [prefix, lastId].join("-")
}

export const summaryHubsStats = (state, value) => {
  console.log(state, value)
  let hubStats = {
    segmentOptionList: [
        {
            value: 'FBT',
            label: '#FamiliesBelongTogether',
            selected: true
        },
    ],
    nModulesOptionList: [
        {
            value: 5,
            label: '5',
            selected: true
        },
        {
            value: 10,
            label: '10',
            selected: false
        },
    ],

    notifyParentOfAspectRatio: function(graphType) {
        var aspectRatio = document.body.clientHeight / document.body.clientWidth
        var message = ['aspectRatio', graphType, String(aspectRatio)].join(':')
        window.parent.postMessage(message, '*')
    },

    dataSourceFilename: function(state, opts) {

      if (opts === undefined) opts = {}
      var base = ''
      var filepath = []
      if (opts.hubs !== undefined) {
          base = '../data/hubs'
          filepath = [
              base,
              state.segment,
              'top' + String(state.nModules),
          ].join('_')
      }

      /**
       * 
       * TO-DO: Remove slice option
       * 
       **/
      // LV == Likely Voters, so change filename
      if (state.onlyLikelyVoters) filepath += '_LV'
      return filepath + '.csv'
    },

    dataSourceRemoteURL: function(state, opts) {
      var filename = hubStats.dataSourceFilename(state, opts)
      var remoteURL = 'http://127.0.0.1:5501/' //Change to root host
      return filename.replace('../', remoteURL)
    },

    renderDataStats(state, currentPeriodDataChosen) {
        let stats
        console.log('here')

        // First init
        if (currentPeriodDataChosen === 0) {

          if (state.segment === "FBT") {
            stats = state.moduleMetaData[currentPeriodDataChosen+2]
          }
          else {
            stats = state.moduleMetaData[currentPeriodDataChosen+1]
          }
        }
        // Other even changes (slider, etc.)
        else if (currentPeriodDataChosen !== 0) {
          stats = state.moduleMetaData
        }

        function toPercentage(n, sign) {
          return (n * 100).toFixed(0) + sign
        }
        
        if (stats.periodNumber !== undefined) {
          document.querySelector('#periodNumber').innerText = stats.periodNumber
          document.querySelector('#avgTotalComms').innerText = stats.avgTotalComms
          document.querySelector('#avgCodeLength').innerText = stats.avgCodeLength
          document.querySelector('#avgPerplexity').innerText = stats.avgPerplexity
          document.querySelector('#totalNodes').innerText = stats.totalNodes
          document.querySelector('#totalLinks').innerText = stats.totalLinks
          document.querySelector('#totalWeight').innerText = stats.totalWeight
          document.querySelector('#danglingNodes').innerText = stats.danglingNodes
        }
    },
  }
}

export const makeOptions = (selectElem, data) => {

  const previouslyInitialized = selectElem.children.length

  if (previouslyInitialized) return
  data.forEach(function(datum, index) {

    if (datum === '1-5') {
      let option = new Option()
      option.value = 1
      option.label = '1-5'
      option.text = '1-5'

      selectElem.appendChild(option)

      if (datum.selected) {
        selectElem.selectedIndex = index
      }
    } else if (datum === '6-10') {
      let option = new Option()
      option.value = 6
      option.label = '6-10'
      option.text = '6-10'

      selectElem.appendChild(option)

      if (datum.selected) {
        selectElem.selectedIndex = index
      }
    } else if (datum === '11-15') {
      let option = new Option()
      option.value = 11
      option.label = '11-15'
      option.text = '11-15'

      selectElem.appendChild(option)

      if (datum.selected) {
        selectElem.selectedIndex = index
      }
    } else if (datum === '16-20') {
      let option = new Option()
      option.value = 16
      option.label = '16-20'
      option.text = '16-20'

      selectElem.appendChild(option)

      if (datum.selected) {
        selectElem.selectedIndex = index
      }
    }

  })
}
