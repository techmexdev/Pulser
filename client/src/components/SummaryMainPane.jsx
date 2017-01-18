import React, { Component } from 'react';
import SummaryInfoBox from './SummaryInfoBox';
import { connect } from 'react-redux';

class SummaryMainPane extends Component {

  render () {
    if (this.props.summary.users) {
      // store id of the selected user
      let clickedUser = this.props.userId || '';
      // --------------- will move to other files after this pull request----------- //
      // store all the users
      let users = this.props.summary.users;
      let lecture = this.props.summary.lecture[0];

      // compute total number of clicks
      let userClicks = this.props.summary.clicks.filter(click => click.user_id === clickedUser);
      let totalClicks = !clickedUser ? this.props.summary.clicks.length : userClicks.length;

      // compute the average click per user, remove the presenter from the users
      // round to 1 decimal place
      let avgClickPerUser = Math.round((totalClicks / (users.length - 1) * 10)) / 10;

      // total number of questions asked about the lecture
      let questions = !clickedUser ? this.props.summary.questions
        : this.props.summary.questions.filter(question => question.user_id === clickedUser);

      let formattedQuestions = questions.sort((a, b) => b.votes - a.votes)
        .map(data => `${data.question}: ${data.votes}`);
      let noOfQuestions = questions.length;

      // store count of clicks per minute
      let clickPerTime = {};
      let clicks = !this.props.userId ? this.props.summary.clicks : userClicks;

      clicks.forEach(click => {
        let time = hourMinutes(new Date(click.date), true);
        clickPerTime[time] = clickPerTime[time] ? clickPerTime[time] += 1 : 1;
      });
      // copy time of click to an array
      let time = Object.keys(clickPerTime);
      // compute the average click per minute then round to 1 decimal place
      let avgClickPerMinute = Math.round((totalClicks / time.length) * 10) / 10;
      // sort by the highest number of clicks then get the first element
      let maxPeak = time.sort((a, b) => clickPerTime[b] - clickPerTime[a])[0];
      let maxPeakDetail = maxPeak ? `${clickPerTime[maxPeak]} at ${maxPeak}` : 0;

      // convert time to minutes
      let minutes = time.map(convertToMinutes);

      // compute the longest time the users didn't click the feedback button
      let startMinutes = convertToMinutes(hourMinutes(new Date(lecture.date)));
      let endMinutes = convertToMinutes(hourMinutes(new Date(lecture.end_time), true));

      let longestMinutesWithOutClicks = 0;
      [startMinutes, ...minutes, endMinutes].sort().forEach((minute, i, totalMinutes) => {
        let difference = Math.abs(totalMinutes[i] - totalMinutes[i + 1]);
        if (difference > longestMinutesWithOutClicks) longestMinutesWithOutClicks = difference;
      });

      let userUpvotes = this.props.summary.upvotes.filter(vote => vote.user_id === clickedUser)
        .map(upvote => upvote.question);

      let noOfUpvotes = userUpvotes.length;

      let thumbs = this.props.summary.thumbs.filter(thumb => thumb.user_id === clickedUser);
      let thumbsCount = {
        1: 0,
        2: 0,
        3: 0
      };
      thumbs.forEach(thumb => {
        thumbsCount[thumb.type]++;
      });
      let formattedThumbs = thumbs.map(thumb => `${thumb.topic}: ${thumb.type}`);

      let topicsSummary = {};
      let topics = this.props.summary.thumbs;
      topics.forEach(topic => {
        if (!topicsSummary.hasOwnProperty(topic.topic)) {
          topicsSummary[topic.topic] = { 1: 0, 2: 0, 3: 0 };
        }
      });

      topics.forEach(topic => {
        topicsSummary[topic.topic][topic.type]++;
      });

      let noOfTopics = Object.keys(topicsSummary);

      let formattedTopics = noOfTopics.map(topic => {
        let topicSummary = topicsSummary[topic];
        return `${topic}: thumbs up: ${topicSummary[1]}, thumbs side: ${topicSummary[2]}, thumbs down: ${topicSummary[3]}`;
      });
      // ------------------------------------------------------------------------------- //
      return (
        <div id='mainPane' className='summary container-fluid'>
          <div className='row'>
            <div className='col-md-6'>
            <SummaryInfoBox title={'Average click per minute'} value={avgClickPerMinute}/>
            {
              !clickedUser
              ? <div>
                <SummaryInfoBox title={'Average click per user'} value={avgClickPerUser}/>
                <SummaryInfoBox title={'Topics'} value={noOfTopics.length} viewDetails={formattedTopics} />
              </div>
              : <div>
                  <SummaryInfoBox title={'Upvotes'} value={noOfUpvotes} viewDetails={userUpvotes}/>
                  <SummaryInfoBox title={'Thumbs'} value={thumbs.length} thumbs = {thumbsCount} viewDetails={formattedThumbs}/>
                </div>
            }
            </div>
            <div className='col-md-6'>
              <SummaryInfoBox title={'Max click peak'} value={maxPeakDetail}/>
              <SummaryInfoBox title={'Longest time w/o clicks'} value={`${longestMinutesWithOutClicks} minutes`}/>
              <SummaryInfoBox title={'Questions'} value={noOfQuestions} viewDetails={formattedQuestions}/>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
};

const mapStatetoProps = (state) => {
  return {
    summary: state.summary
  };
};
// function to format hours and minutes
const hourMinutes = (time, increment) => {
  return increment ? `${time.getHours()}:${time.getMinutes() + 1}`
    : `${time.getHours()}:${time.getMinutes()}`;
};
// function for converting minutes, needs to move to a separate file
const convertToMinutes = (t) => {
  let time = t.split(':');
  return Number(time[0]) * 60 + Number(time[1]);
};
export default connect(mapStatetoProps)(SummaryMainPane);
