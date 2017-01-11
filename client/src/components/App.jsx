/*    App structure

                                                    +-------+
                                                    |  App  |
                                                    +---+---+
                                                        |
                +------------------------------+--------+-----------+-----------------------+-----------------------+-----------------------
                |                              |                    |                       |                       |                      |
        +-------+-----------------+  +---------+-----------+  +-----+-------+  +------------+-------------+   +-----+-------+   +----------+------+
        |    DashboardView        |  |     AudienceView    |  |PresenterView|  |       SummaryView        |   |ProjectorView|   |  GuestView      |
        +-------------------------+  +---------------------+  +-------------+  +--------------------------+   +-------------+   +-----------------+
        | +NewPresButton          |  | +Slides             |  |  +Slides    |  |                          |   | +Slides     |   | +JoinPresBox    |
        |                         |  | +LogoutButton       |  |             |  | +----------------------+ |   |             |   | +LogoutButton   |
        | +Searchbar              |  | +-----------------+ |  |  +PulseBox  |  | |   SummaryLeftPane    | |   +-------------+   +-----------------+
        |                         |  | |   FeedbackBox   | |  |             |  | +----------------------+ |
        | +LogoutButton           |  | +-----------------+ |  |  +Sidebar   |  | |  +TotalClicksTable   | |
        |                         |  | | +FeedbackButton | |  |             |  | |                      | |
        | +UserInfo               |  | |                 | |  |  +Questions |  | |     .....OR.....     | |
        |                         |  | +-----------------+ |  |             |  | |                      | |
        | +JoinPresBox            |  | +-----------------+ |  |  +Timer     |  | |  +UserClicksTimeline | |
        |                         |  | | QuestionBox     | |  |             |  | +----------------------+ |
        | +---------------------+ |  | +-----------------+ |  |  +TitleBar  |  |                          |
        | |   DashMainContent   | |  | | |Question       | |  +-------------+  | +----------------------+ |
        | +---------------------+ |  | +-----------------+ |                   | |   SummaryRightPane   | |
        | |                     | |  |                     |                   | +----------------------+ |
        | | +-----------------+ | |  | +AudThumbs          |                   | |     SummaryMainPane  | |
        | | |  PresPreviews   | | |  +---------------------+                   | |     SummaryComment   | |
        | | +-----------------+ | |                                            | +----------------------+ |
        | | |                 | | |                                            +--------------------------+
        | | | +RecentPresMenu | | |
        | | |                 | | |
        | | | +PresThumbnail  | | |
        | | |    (many)       | | |
        | | +-----------------+ | |
        | |                     | |
        | |   ......OR......    | |
        | |                     | |
        | | +-----------------+ | |
        | | |SearchResults    | | |
        | | +-----------------+ | |
        | | ++PresThumbnail   | | |
        | | |    (many)       | | |
        | | +-----------------+ | |
        | |                     | |
        | +---------------------+ |
        +-------------------------+
*/

import React, { Component } from 'react';
import $ from 'jquery';
import DashboardView from './DashboardView';
import getUserData from '../util/getUserData';
import { connect } from 'react-redux';
import GuestView from './GuestView';
import '../css/Button.css';
import '../css/Auth.css';
import '../css/body.css';

// Primary App component.
class App extends Component {
  componentWillMount () {
    // store user data when App loads.
    getUserData((user) => {
      this.props.dispatch({
        type: 'STORE_USER',
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        id: user.id
      });
    });
  }

  render () {
    if (this.props.user.name === 'guest') {
      return (
        <GuestView/>
      );
    } else {
      return (
        <DashboardView/>
      );
    }
  };
};

const mapStateToProps = (state) => {
  return { dispatch: state.dispatch, user: state.user };
};

export default connect(mapStateToProps)(App);
