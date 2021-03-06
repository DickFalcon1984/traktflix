import React from 'react';

import ActivityActionCreators from '../actions/activity-action-creators';
import TraktURLForm from './trakt-url-form';
import TraktWebAPIUtils from '../utils/trakt-web-api-utils';
import TmdbImage from '../../tmdb-image';

export default class ActivityListItem extends React.Component {
  constructor() {
    super();
    this.state = { showTraktURLForm: false };
  }

  componentDidMount() {
    this.props.componentHandler.upgradeDom();
  }

  _onChange(event) {
    ActivityActionCreators.toggleActivity(this.props.activity, event.target.checked);
  }

  _onShowTraktURLForm(event) {
    this.setState({ showTraktURLForm: true });
  }

  _onSubmitTraktURL(activity, url) {
    TraktWebAPIUtils.getActivityFromURL(activity, url);
  }

  render() {
    let activity = this.props.activity;
    let netflix = activity.netflix;
    let netflixTitle = netflix.epTitle ? `${netflix.title}: ${netflix.epTitle}` : netflix.title;
    let netflixUrl = `https://www.netflix.com/watch/${netflix.id}`;
    let trakt = activity.trakt;
    let traktDate, traktImage, traktUrl, traktTitle;

    if (trakt) {
      traktDate = trakt.date ? trakt.date.format('MMMM Do YYYY, h:mm:ss a') : '-';
      traktImage = trakt.images.poster ? trakt.images.poster : trakt.images.screenshot;
      traktUrl = trakt.season ? `https://trakt.tv/shows/${trakt.show.ids.slug}/seasons/${trakt.season}/episodes/${trakt.number}` : `https://trakt.tv/movies/${trakt.ids.slug}`;
      traktTitle = trakt.show ? `${trakt.show.title}: ${trakt.title}` : trakt.title;
    }

    let formId = `${netflix.id}--add`;

    return(
      <li className='mdl-list__item mdl-list__item--three-line'>
        <span className='mdl-list__item-primary-content'>
          <TmdbImage
            className='mdl-list__item-avatar'
            item={trakt}
            imageHost={this.props.imageHost}
            imageWidth={this.props.imageWidth}
          />
          <span><a href={netflixUrl} target='_blank'>Netflix title: {netflixTitle}</a></span>
          <span> / </span>
          <span><a href={traktUrl} target='_blank'>Trakt.tv title: {traktTitle}</a></span>
          <span className='mdl-list__item-text-body'>
            Netflix date: {netflix.date.format('MMMM Do YYYY, h:mm:ss a')} / Trakt.tv date: {traktDate}
            <br />
            Is this wrong or incomplete? <a className='paste-trakt-url' onClick={this._onShowTraktURLForm.bind(this)}>Paste Trakt.tv URL</a>
            <TraktURLForm activity={activity} show={this.state.showTraktURLForm} onSubmit={this._onSubmitTraktURL} />
          </span>
        </span>
        <span className='mdl-list__item-secondary-action'>
          <label className='mdl-switch mdl-js-switch mdl-js-ripple-effect' htmlFor={formId}>
            <input type='checkbox' id={formId} className='mdl-switch__input activity-item-switch' checked={activity.add} onChange={this._onChange.bind(this)} />
          </label>
        </span>
      </li>
    );
  }
}
