import { all, put } from 'redux-saga/effects';

import {
  TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED,
  UPDATE_ACTION_ALERTS_MODAL_REQUESTED,
} from 'redux/action_alerts/actions';

import {
  toggleDisplayQuerySettings,
  updateQuerySettingsSinceDate,
  updateQuerySettingsIncidentStatus,
  updateQuerySettingsIncidentUrgency,
  updateQuerySettingsIncidentPriority,
  updateQuerySettingsTeams,
  updateQuerySettingsServices,
  updateSearchQuery,
} from './query_settings/sagas';

import {
  getIncidentsAsync,
  getIncidentNotesAsync,
  getAllIncidentNotesAsync,
  updateIncidentsListAsync,
  filterIncidentsByPriority,
  filterIncidentsByStatus,
  filterIncidentsByUrgency,
  filterIncidentsByTeam,
  filterIncidentsByService,
  filterIncidentsByQuery,
} from './incidents/sagas';

import {
  getLogEntriesAsync,
  updateRecentLogEntriesAsync,
  cleanRecentLogEntriesAsync,
} from './log_entries/sagas';

import {
  toggleIncidentTableSettings,
  saveIncidentTableSettings,
  updateIncidentTableColumns,
  selectIncidentTableRows,
} from './incident_table/sagas';

import {
  acknowledgeAsync,
  escalateAsync,
  reassignAsync,
  toggleDisplayReassignModal,
  addResponderAsync,
  toggleDisplayAddResponderModal,
  snoozeAsync,
  toggleDisplayCustomSnoozeModal,
  toggleDisplayMergeModal,
  mergeAsync,
  resolveAsync,
  updatePriorityAsync,
  addNoteAsync,
  toggleDisplayAddNoteModal,
  runCustomIncidentActionAsync,
  syncWithExternalSystemAsync,
} from './incident_actions/sagas';

import { toggleActionAlertsModal, updateActionAlertsModal } from './action_alerts/sagas';

import { getUsersAsync, getCurrentUserAsync } from './users/sagas';

import { getExtensionsAsync, mapServicesToExtensions } from './extensions/sagas';

import { getResponsePlaysAsync, runResponsePlayAsync } from './response_plays/sagas';

import { getServicesAsync } from './services/sagas';
import { getTeamsAsync } from './teams/sagas';
import { getPrioritiesAsync } from './priorities/sagas';
import { getEscalationPoliciesAsync } from './escalation_policies/sagas';

export default function* rootSaga() {
  yield all([
    // Query Settings
    toggleDisplayQuerySettings(),
    updateQuerySettingsSinceDate(),
    updateQuerySettingsIncidentStatus(),
    updateQuerySettingsIncidentUrgency(),
    updateQuerySettingsIncidentPriority(),
    updateQuerySettingsTeams(),
    updateQuerySettingsServices(),
    updateSearchQuery(),

    // Incidents
    getIncidentsAsync(),
    getIncidentNotesAsync(),
    getAllIncidentNotesAsync(),
    updateIncidentsListAsync(),
    filterIncidentsByPriority(),
    filterIncidentsByStatus(),
    filterIncidentsByUrgency(),
    filterIncidentsByTeam(),
    filterIncidentsByService(),
    filterIncidentsByQuery(),

    // Log Entries
    getLogEntriesAsync(),
    updateRecentLogEntriesAsync(),
    cleanRecentLogEntriesAsync(),

    // Incident Table
    toggleIncidentTableSettings(),
    saveIncidentTableSettings(),
    updateIncidentTableColumns(),
    selectIncidentTableRows(),

    // Incident Actions
    acknowledgeAsync(),
    escalateAsync(),
    reassignAsync(),
    toggleDisplayReassignModal(),
    addResponderAsync(),
    toggleDisplayAddResponderModal(),
    snoozeAsync(),
    toggleDisplayCustomSnoozeModal(),
    toggleDisplayMergeModal(),
    mergeAsync(),
    resolveAsync(),
    updatePriorityAsync(),
    addNoteAsync(),
    toggleDisplayAddNoteModal(),
    runCustomIncidentActionAsync(),
    syncWithExternalSystemAsync(),

    // Action Alerts Modal
    toggleActionAlertsModal(),
    updateActionAlertsModal(),

    // Users
    getUsersAsync(),
    getCurrentUserAsync(),

    // Services
    getServicesAsync(),

    // Teams
    getTeamsAsync(),

    // Priorities
    getPrioritiesAsync(),

    // Escalation Policies
    getEscalationPoliciesAsync(),

    // Extensions
    getExtensionsAsync(),
    mapServicesToExtensions(),

    // Response Plays
    getResponsePlaysAsync(),
    runResponsePlayAsync(),
  ]);
}

// Helper function to handle errors while processing saga
export function* handleSagaError(action, exception) {
  yield displayActionModal('danger', exception.message);
  yield put({ type: action, message: exception.message });
}

// Helper functions to handle API errors in response
export const handleSingleAPIErrorResponse = (response) => {
  if (response.data.error) {
    throw Error(response.data.error.message);
  } else {
    throw Error('Unknown error while using PD API');
  }
};

export const handleMultipleAPIErrorResponses = (responses) => {
  const errors = responses
    .filter((response) => response.data.error)
    .map((response) => response.data.error.message);
  if (errors.length) {
    throw Error(errors);
  } else {
    throw Error('Unknown error while using PD API');
  }
};

// Helper function to display modal with API result
export function* displayActionModal(actionAlertsModalType, actionAlertsModalMessage) {
  yield put({
    type: UPDATE_ACTION_ALERTS_MODAL_REQUESTED,
    actionAlertsModalType,
    actionAlertsModalMessage,
  });
  yield put({ type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED });
}
