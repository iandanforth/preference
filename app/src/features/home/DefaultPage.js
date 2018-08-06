import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Plot from 'react-plotly.js';
import * as actions from './redux/actions';
import Tooltip from 'rc-tooltip';
import Slider, { Handle } from 'rc-slider';
import { sum, min, mean } from 'lodash';
import 'rc-slider/assets/index.css';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export class DefaultPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const actionValues = [22.1, 150.0, -33.5, 0.01, 19.2];
    const preference = 10;
    const trace = this.getTrace(
      actionValues,
      preference
    );

    const initialRev = 1;
    const layout = this.getLayout(initialRev);

    this.state = {
      data: [trace],
      layout: layout,
      frames: [],
      config: {},
      revision: initialRev,
      actionValues: actionValues,
      preference
    };


    this.updateTooltip = this.updateTooltip.bind(this);
    this.handleYSliderChange = this.handleYSliderChange.bind(this);
    this.handlePSliderChange = this.handlePSliderChange.bind(this);
    this.getLayout = this.getLayout.bind(this);
  }

  makePositive(vals) {
    const minVal = min(vals);
    if (minVal >= 0) {
      return vals
    }
    const offset = Math.abs(minVal);
    let newVals = [];
    for (let i=0; i<vals.length; i++){
      const val = vals[i];
      newVals.push(val + offset);
    }
    return newVals;
  }

  getTrace(actionValues, preference) {
    let xVals = []
    let yVals = []

    let tempYVals = [];
    const minOffset = Math.abs(min(actionValues));
    for (let i=0; i<actionValues.length; i++){
      const val = actionValues[i];
      tempYVals.push(val + minOffset);
      xVals.push(ALPHABET[i] + ': ' + val);
    }

    const tempMean = mean(tempYVals);
    for (let i=0; i<tempYVals.length; i++){
      const tempVal = tempYVals[i];
      console.log('Temp Val', tempVal);
      console.log('Temp Mean', tempMean);
      const delta = tempVal - tempMean;
      console.log('Delta', delta);
      console.log('Preference', preference);
      const weightedVal = tempMean + (delta * (preference / 100));
      console.log('Weighted val', weightedVal);
      yVals.push(weightedVal);
    }

    // Convert to percentages
    const total = sum(yVals);
    for (let i=0; i<yVals.length; i++){
      yVals[i] /= total;
      console.log(yVals[i]);
    }

    return { 
      x: xVals, 
      y: yVals,
      type: 'bar', 
      marker: { 
        color: 'orange' },
      }
  }

  getLayout(rev) {
    const layout = { 
      width: 640, 
      height: 480, 
      title: 'Preference Action Selection Probabilities',
      datarevision: rev,
      xaxis: {
        categoryorder: "category ascending",
        type: "category",
        title: "Action name and estimated value in an example state."
      },
      yaxis: {
        title: "Probability"
      }
    }
    return layout;
  }

  updateTooltip(sliderProps) {
    const { value, dragging, index, ...restProps } = sliderProps;
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  };

  handlePSliderChange(newPreference) {
    let { actionValues, revision } = this.state;
    const newRev = revision + 1
    const trace = this.getTrace(actionValues, newPreference);
    const layout = this.getLayout(newRev)
    this.setState({
      data: [trace],
      layout: layout,
      revision: newRev,
      preference: newPreference
    });
  }

  handleYSliderChange(val) {
    let { actionValues, preference, revision } = this.state;
    actionValues[0] = val;
    const newRev = revision + 1
    const trace = this.getTrace(actionValues, preference);
    const layout = this.getLayout(newRev)
    this.setState({
      data: [trace],
      layout: layout,
      revision: newRev,
      actionValues
    });
  }

  render() {
    const wrapperStyle = { width: 600, margin: "auto" };
    return (
      <div className="home-default-page">
        <div className="app-intro">
          <Plot
            data={this.state.data}
            layout={this.state.layout}
            frames={this.state.frames}
            config={this.state.config}
            revision={this.state.revision}
            onInitialized={figure => this.setState(figure)}
            onUpdate={figure => this.setState(figure)}
          />
          <div style={wrapperStyle}>
            <p>Change the preference value</p>
            <Slider 
              min={0} 
              max={100}
              step={1}
              defaultValue={10}
              handle={this.updateTooltip} 
              onChange={this.handlePSliderChange}
            />
            <p>Change the value of State-Action pair 'a'</p>
            <Slider 
              min={0} 
              max={200}
              step={1}
              defaultValue={100}
              handle={this.updateTooltip} 
              onChange={this.handleYSliderChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DefaultPage);
