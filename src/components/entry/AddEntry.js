import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const AddEntry = (props) => {
  const { setCancelAdd } = props;
  const [newEntry, setNewEntry] = React.useState({
    entry: "",
    distance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    isOpen: true,
  });
  const cancelAdd = () => {
    setCancelAdd();
  };
  const updateEntry = (event) => {
    setNewEntry({ ...newEntry, entry: event.target.value });
  };
  const updateDist = (event) => {
    const updating = (array, newValue) =>
      (array[event.target.id] = parseInt(newValue));
    const dist = newEntry.distance;
    updating(dist, event.target.value);
    console.log(dist);
    setNewEntry({ ...newEntry, distance: dist });
  };
  const addNewEntry = () => {
    fetch(`http://localhost:3500/entry`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newEntry),
    }).then(() => {
      window.location.reload(false);
      console.log("OK");
    });
  };
  const addWarning = () => {
    alert("Distance for Slot Required!");
  };
  return (
    <div className="entryModal">
      <Row>
        <Col xs={12}>
          <h1>Add Entry</h1>
        </Col>
        <Col>
          <form className="parking-form">
            <input
              className="form-field"
              placeholder="Entry Name"
              name="entryName"
              onChange={updateEntry}
            />
            <Row>
              <input
                className="form-field col-2"
                placeholder="A1"
                name="a1"
                id="0"
                type="number"
                onChange={updateDist}
              />
              <input
                className="form-field col-2"
                placeholder="A2"
                name="a2"
                id="1"
                type="number"
                onChange={updateDist}
              />
              <input
                className="form-field col-2"
                placeholder="A3"
                name="a3"
                id="2"
                type="number"
                onChange={updateDist}
              />
              <input
                className="form-field col-2"
                placeholder="B1"
                name="b1"
                id="3"
                type="number"
                onChange={updateDist}
              />
              <input
                className="form-field col-2"
                placeholder="B2"
                name="b2"
                id="4"
                type="number"
                onChange={updateDist}
              />
              <input
                className="form-field col-2"
                placeholder="B3"
                name="b3"
                id="5"
                type="number"
                onChange={updateDist}
              />
              <input
                className="form-field col-2"
                placeholder="C1"
                name="c1"
                id="6"
                type="number"
                onChange={updateDist}
              />
              <input
                className="form-field col-2"
                placeholder="C2"
                name="c2"
                id="7"
                type="number"
                onChange={updateDist}
              />
              <input
                className="form-field col-2"
                placeholder="C3"
                name="c3"
                id="8"
                type="number"
                onChange={updateDist}
              />
              <input
                className="form-field col-2"
                placeholder="D1"
                name="d1"
                id="9"
                type="number"
                onChange={updateDist}
              />
              <input
                className="form-field col-2"
                placeholder="D2"
                name="d2"
                id="10"
                type="number"
                onChange={updateDist}
              />
              <input
                className="form-field col-2"
                placeholder="D3"
                name="d3"
                id="11"
                type="number"
                onChange={updateDist}
              />
            </Row>
          </form>
          <div className="d-flex justify-content-evenly w-100">
            <Button
              className="gap-2"
              onClick={
                newEntry.entry !== "" &&
                newEntry.distance !== [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                  ? addNewEntry
                  : addWarning
              }
            >
              ADD ENTRY
            </Button>
            <Button onClick={cancelAdd}>CANCEL</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AddEntry;
