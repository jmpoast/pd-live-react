/* eslint-disable array-callback-return */
import {
  put, call, select, takeLatest, all,
} from 'redux-saga/effects';

import {
  handleSagaError,
  handleMultipleAPIErrorResponses,
  displayActionModal,
} from 'redux/rootSaga';

import { pd } from 'util/pd-api-wrapper';
import {
  FETCH_RESPONSE_PLAYS_REQUESTED,
  FETCH_RESPONSE_PLAYS_COMPLETED,
  FETCH_RESPONSE_PLAYS_ERROR,
  RUN_RESPONSE_PLAY_REQUESTED,
  RUN_RESPONSE_PLAY_COMPLETED,
  RUN_RESPONSE_PLAY_ERROR,
} from './actions';

import { selectResponsePlays } from './selectors';

export function* getResponsePlaysAsync() {
  yield takeLatest(FETCH_RESPONSE_PLAYS_REQUESTED, getResponsePlays);
}

export function* getResponsePlays() {
  try {
    //  Create params and call pd lib
    const response = yield call(pd.all, 'response_plays', {
      data: {
        // Return response plays that only can be run manually
        filter_for_manual_run: true,
      },
    });

    yield put({
      type: FETCH_RESPONSE_PLAYS_COMPLETED,
      responsePlays: response.resource,
    });
  } catch (e) {
    yield put({ type: FETCH_RESPONSE_PLAYS_ERROR, message: e.message });
  }
}

export function* runResponsePlayAsync() {
  yield takeLatest(RUN_RESPONSE_PLAY_REQUESTED, runResponsePlay);
}

export function* runResponsePlay(action) {
  try {
    const { incidents: selectedIncidents, responsePlay, displayModal } = action;

    // Build individual requests as the endpoint supports singular POST
    const responsePlayRequests = selectedIncidents.map((incident) => call(pd, {
      method: 'post',
      endpoint: `response_plays/${responsePlay.id}/run`,
      data: {
        incident: {
          id: incident.id,
          type: 'incident_reference',
        },
      },
    }));

    // Invoke parallel calls for optimal performance
    const responses = yield all(responsePlayRequests);
    if (responses.every((response) => response.ok)) {
      yield put({
        type: RUN_RESPONSE_PLAY_COMPLETED,
        responsePlayRequests: responses,
      });
      if (displayModal) {
        const actionAlertsModalType = 'success';
        const actionAlertsModalMessage = `Ran "${
          responsePlay.summary
        }" response play for incident(s) ${selectedIncidents
          .map((i) => i.incident_number)
          .join(', ')}.`;
        yield displayActionModal(actionAlertsModalType, actionAlertsModalMessage);
      }
    } else {
      handleMultipleAPIErrorResponses(responses);
    }
  } catch (e) {
    handleSagaError(RUN_RESPONSE_PLAY_ERROR, e);
  }
}
