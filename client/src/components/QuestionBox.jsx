import React, { Component } from 'react';
import { connect } from 'react-redux';
import Question from './Question';
import $ from 'jquery';
import uuid from 'uuid/v1';
import store from '../store.jsx';
import '../css/QuestionBox.css';

class QuestionBox extends Component {
// This component lets users enter questions; it also displays each individual question component
  constructor (props) {
    super();
    let dispatch = props.dispatch;
    let render = this.forceUpdate.bind(this);
    this.socket = props.activeLecture.socket;
    let role = props.role;
    this.socket.on('upvoteQuestion', function (upvote, userId) {
      dispatch({
        type: 'UPVOTE',
        questionId: upvote.questionId
      });
      render();
    });
    this.socket.on('downvoteQuestion', function (downvote, userId) {
      dispatch({
        type: 'DOWNVOTE',
        questionId: downvote.questionId
      });
      render();
    });
    this.socket.on('submitQuestion', function (question) {
      dispatch({
        type: 'CREATE_QUESTION',
        questionText: question.questionText,
        questionId: question.questionId
      });
      render();
    });
  };

  componentDidMount () {
    let gottenPresentationInformation = true;
    let dispatch = this.props.dispatch;
    let clearQuestions = false;
    this.socket.on('questionToggle', function () {
      $('#QuestionBox, #QuestionBoxAudience').fadeToggle('slow');
      dispatch({
        type: 'TOGGLE_ENABLED'
      });
      if (clearQuestions) {
        $('.upvoteDownvote, questionText').detach();
        dispatch({type: 'CLEAR_QUESTIONS'});
      }
      clearQuestions = !clearQuestions;
    });

    $('#questionInput').keypress(function (e) {
      if (e.which === 13) {
        $('#submitQuestion').click();
        return false;
      }
    });
  }

  submitQuestion () {
    // dispatch, submission to the db, socket to the presenter
    let socket = this.props.activeLecture.socket;
    let dispatch = this.props.dispatch;
    let questionText = $('#questionInput').val();
    let lectureId = this.props.activeLecture.lectureId;
    let userId = this.props.user.id;
    let questionId = uuid();
    let question = {
      questionId: questionId,
      lectureId: lectureId,
      userId: userId,
      questionText: questionText
    };
    if (questionText.length > 0) {
      socket.emit('submitQuestion', question);
      $('#questionInput').val('');
    } else {
      console.log('Please enter a question.');
    }
  }

  render () {
    let questions = store.getState().questions;
    let questionsObj = {};
    let displayQuestions = questions.enabled ? 'block' : 'none';
    Object.keys(questions).forEach((questionKey) => {
      if (questionKey !== 'enabled') questionsObj[questionKey] = questions[questionKey];
    });
    if (this.props.role === 'presenter') {
      return (
        <div id='QuestionBox' style={{display: displayQuestions}}>
          <div id="QuestionBoxTitle"></div>
          <h2>Questions</h2>
          <hr/>
          <input className='form-control presenter-input' key={1} type="text" id="questionInput"></input>
          <button className='btn submit-btn' key={2} id="submitQuestion" onClick={this.submitQuestion.bind(this)}>Submit</button>
          {Object.keys(questionsObj).sort(function (a, b) {
            if (questionsObj[a].votes < questionsObj[b].votes) return 1;
            return -1;
          }).map((questionId, i) =>
            <Question key={questionId} id={questionId} display={'block'} votes={questionsObj[questionId].votes} text={questionsObj[questionId].questionText}/>
          )}
        </div>
      );
    } else {
      return (
        <div id="QuestionBoxAudience" style={{display: displayQuestions}}>
          <span className="sidebar-header"><h2>QUESTIONS</h2></span>
          <div><input key={1} type="text" id="questionInput" className="form-control"/>
            <button key={2} id="submitQuestion" className='btn submit-btn' onClick={this.submitQuestion.bind(this)}>Ask</button>
          </div>
          {Object.keys(questionsObj).map((questionId, i) =>
            <Question key={i + 3} id={questionId} votes={questionsObj[questionId].votes} display='none' text={questionsObj[questionId].questionText}/>
          )}
          <hr/>
        </div>
      );
    }
  };
};

const mapStateToProps = (state) => {
  return {
    activeLecture: state.activeLecture,
    user: state.user,
    questions: state.questions
  };
};

export default connect(mapStateToProps)(QuestionBox);
