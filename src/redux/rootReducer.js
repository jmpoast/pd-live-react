import { combineReducers } from "redux";

import actionAlertsModalData from "./action_alerts/reducers";
import incidents from "./incidents/reducers";
import logEntries from "./log_entries/reducers";
import querySettings from "./query_settings/reducers";
import incidentTableSettings from "./incident_table/reducers";
import services from "./services/reducers";
import teams from "./teams/reducers";
import priorities from "./priorities/reducers";

export default combineReducers({
  actionAlertsModalData,
  incidents,
  logEntries,
  querySettings,
  incidentTableSettings,
  services,
  teams,
  priorities
});