import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v1';
import $ from 'jquery';
import '../css/PresThumbs.css';

class PresThumbs extends Component {

  componentDidMount () {
    // retain 'this' context
    let dispatch = this.props.dispatch;
    let render = this.forceUpdate.bind(this);
    // socket listener for when an audience member clicks on a thumb
    this.props.socket.on('thumb clicked', function (thumbChoice) {
      // increment the total tally in the store for the thumb chosen
      dispatch({type: 'THUMB_CLICKED', thumbChoice: thumbChoice});
      // trigger a re-render
      render();
    });

    // handles enter key being pressed while topic input field is selected
    $('#topic').keypress(function (e) {
      if (e.which === 13) {
        $('#setTopic').click();
        return false;
      }
    });
  }

  submitTopic () {
    let socket = this.props.socket;
    let topicId = uuid();
    let topic = $('#topic').val();
    let lectureId = this.props.lectureId;
    socket.emit('submit thumbTopic', topicId, topic, lectureId);
    this.props.dispatch({type: 'SET_TOPIC', topicId: topicId, topicName: topic});
    // add thumb title, remove thumb form
    $('#topicTitle:first-child').append($('#topic').val());
    $('#topic, #setTopic').fadeOut();
  }

  render () {
    return (
      <div id='PresThumbs' style={{display: 'none'}}>
        <h2 id='topicTitle'>Topic: </h2>
        <input className='form-control presenter-input' id='topic' type='text' name='topic' />
        <button className='btn submit-btn' id='setTopic' onClick={this.submitTopic.bind(this)}>Set Topic</button>
        <hr />
        <div className='thumbs-list'>
          <ul>
            <li>
              <p>{this.props.thumbs.up}</p>
              <img src='../img/1-thumb.png' alt='thumbs-up'/>
            </li>
            <li>
              <p>{this.props.thumbs.side}</p>
              <img src='../img/2-thumb.png' alt='thumbs-side'/>
            </li>
            <li>
              <p>{this.props.thumbs.down}</p>
              <img src='../img/3-thumb.png' alt='thumbs-down'/>
            </li>
          </ul>
        </div>
      </div>
    );
  };

};

const mapStateToProps = (state) => {
  return {
    thumbs: state.thumbs,
    socket: state.activeLecture.socket,
    lectureId: state.activeLecture.lectureId,
    dispatch: state.dispatch
  };
};

export default connect(mapStateToProps)(PresThumbs);
