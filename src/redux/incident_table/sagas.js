/* eslint-disable array-callback-return */
import { put, select, takeLatest } from "redux-saga/effects";

import {
  TOGGLE_INCIDENT_TABLE_SETTINGS_REQUESTED,
  TOGGLE_INCIDENT_TABLE_SETTINGS_COMPLETED,
  SAVE_INCIDENT_TABLE_SETTINGS_REQUESTED,
  SAVE_INCIDENT_TABLE_SETTINGS_COMPLETED,
  SAVE_INCIDENT_TABLE_SETTINGS_ERROR,
  UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED,
  UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED,
  SELECT_INCIDENT_TABLE_ROWS_REQUESTED,
  SELECT_INCIDENT_TABLE_ROWS_COMPLETED,
} from "./actions";

import { selectIncidentTableSettings } from "./selectors";

import { getIncidentTableColumns } from "util/incident-table-columns";

export function* toggleIncidentTableSettings() {
  yield takeLatest(TOGGLE_INCIDENT_TABLE_SETTINGS_REQUESTED, toggleIncidentTableSettingsImpl);
};

export function* toggleIncidentTableSettingsImpl() {
  let { displayIncidentTableSettings } = yield select(selectIncidentTableSettings);
  yield put({ type: TOGGLE_INCIDENT_TABLE_SETTINGS_COMPLETED, displayIncidentTableSettings: !displayIncidentTableSettings });
};

export function* saveIncidentTableSettings() {
  yield takeLatest(SAVE_INCIDENT_TABLE_SETTINGS_REQUESTED, saveIncidentTableSettingsImpl);
};

export function* saveIncidentTableSettingsImpl(action) {
  // Attempt saving each setting down by dispatching the relevant actions
  try {
    let { updatedIncidentTableColumns } = action;

    // Update incident table columns
    let updatedIncidentTableColumnNames = updatedIncidentTableColumns.map(col => col.value)
    let incidentTableColumns = getIncidentTableColumns(updatedIncidentTableColumnNames);
    yield put({ type: UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED, incidentTableColumns });

    // TODO: Other table settings can be dispatched here...

    // Indicate that changes were saved and close down settings modal.
    yield put({ type: SAVE_INCIDENT_TABLE_SETTINGS_COMPLETED });
    yield put({ type: TOGGLE_INCIDENT_TABLE_SETTINGS_COMPLETED, displayIncidentTableSettings: false });

  } catch (e) {
    console.log(e)
    yield put({ type: SAVE_INCIDENT_TABLE_SETTINGS_ERROR, message: e.message });
  }
};


export function* updateIncidentTableColumns() {
  yield takeLatest(UPDATE_INCIDENT_TABLE_COLUMNS_REQUESTED, updateIncidentTableColumnsImpl);
};

export function* updateIncidentTableColumnsImpl(action) {
  let { incidentTableColumns } = action;
  yield put({ type: UPDATE_INCIDENT_TABLE_COLUMNS_COMPLETED, incidentTableColumns });
};

export function* selectIncidentTableRows() {
  yield takeLatest(SELECT_INCIDENT_TABLE_ROWS_REQUESTED, selectIncidentTableRowsImpl);
};

export function* selectIncidentTableRowsImpl(action) {
  let { allSelected, selectedCount, selectedRows } = action;
  yield put({ type: SELECT_INCIDENT_TABLE_ROWS_COMPLETED, allSelected, selectedCount, selectedRows });
};