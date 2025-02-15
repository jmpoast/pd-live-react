// Define Action Types
export const TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED =
  'TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED';
export const TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_COMPLETED =
  'TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_COMPLETED';

export const UPDATE_ACTION_ALERTS_MODAL_REQUESTED = 'UPDATE_ACTION_ALERTS_MODAL_REQUESTED';
export const UPDATE_ACTION_ALERTS_MODAL_COMPLETED = 'UPDATE_ACTION_ALERTS_MODAL_COMPLETED';

// Define Actions
export const toggleDisplayActionAlertsModal = () => ({
  type: TOGGLE_DISPLAY_ACTION_ALERTS_MODAL_REQUESTED,
});

export const updateActionAlertsModal = (actionAlertsModalType, actionAlertsModalMessage) => ({
  type: UPDATE_ACTION_ALERTS_MODAL_REQUESTED,
  actionAlertsModalType,
  actionAlertsModalMessage,
});
