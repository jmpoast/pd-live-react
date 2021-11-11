import { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { Modal, Form, Button } from 'react-bootstrap';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { toggleDisplayMergeModal, merge } from 'redux/incident_actions/actions';

import {
  TRIGGERED,
  ACKNOWLEDGED,
  filterIncidentsByField,
} from 'util/incidents';

import './MergeModalComponent.scss';

const animatedComponents = makeAnimated();

const MergeModalComponent = ({
  incidents,
  incidentActions,
  incidentTable,
  toggleDisplayMergeModal,
  merge,
}) => {
  const { displayMergeModal } = incidentActions;
  const { selectedRows } = incidentTable;
  const openIncidents = filterIncidentsByField(incidents, 'status', [
    TRIGGERED,
    ACKNOWLEDGED,
  ]);

  const [targetIncident, setTargetIncident] = useState(null);
  useEffect(() => {
    setTargetIncident(null);
  }, [displayMergeModal]);

  const [mergedIncidents, setMergedIncidents] = useState([]);
  useEffect(() => {
    if (targetIncident !== null) {
      const tempMergedIncidents = selectedRows.filter(
        (incident) => incident.id !== targetIncident.id,
      );
      setMergedIncidents(tempMergedIncidents);
    } else {
      setMergedIncidents([]);
    }
  }, [targetIncident]);

  const selectListIncidents = openIncidents.map((incident) => ({
    label: incident.summary,
    value: incident.id,
    id: incident.id,
    incident_number: incident.incident_number,
  }));

  return (
    <div className="merge-modal-ctr">
      <Modal show={displayMergeModal} onHide={toggleDisplayMergeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Merge Incidents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Text className="text-muted">
                The alerts of the selected incidents will be merged into a single incident.
              </Form.Text>
              <br />
              <Form.Label>
                <b>Select an open incident to merge into:</b>
              </Form.Label>
              <Select
                onChange={(selectedIncident) => {
                  if (selectedIncident) {
                    setTargetIncident(selectedIncident);
                  } else {
                    setTargetIncident(null);
                  }
                }}
                components={animatedComponents}
                options={selectListIncidents}
                isClearable
              />
            </Form.Group>
            <Form.Group>
              <Form.Text className="text-muted">
                The remaining selected incidents will be resolved after the merge is complete.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => merge(targetIncident, mergedIncidents)}
            disabled={targetIncident === null}
          >
            Merge Incidents
          </Button>
          <Button variant="light" onClick={toggleDisplayMergeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  incidents: state.incidents.incidents,
  incidentActions: state.incidentActions,
  incidentTable: state.incidentTable,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDisplayMergeModal: () => dispatch(toggleDisplayMergeModal()),
  merge: (targetIncident, incidents) => dispatch(merge(targetIncident, incidents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MergeModalComponent);
