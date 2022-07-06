import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import Slot from "./slot/Slot";
// eslint-disable-next-line
import "bootstrap/dist/css/bootstrap.min.css";
import "./Section.css";
import Entry from "../entry/Entry";
import { sectionRows } from "../../common/const";
const Section = () => {
  const [park, setPark] = React.useState(false);
  const [entryP, setentryP] = React.useState({
    entry: "",
    distance: [],
    isOpen: true,
    id: null,
  });
  const [openEntry, setOpenEntry] = React.useState([]);
  const [entryCount, setEntryCount] = React.useState(0);
  const parkCar = (x) => {
    setPark(true);
    setentryP(x);
  };
  const cancelPark = () => {
    setPark(false);
  };
  React.useEffect(() => {
    fetch("http://localhost:8000/entry")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setOpenEntry(data);
      });
    const openEntryCount = openEntry.filter(entry => entry.isOpen)
    setEntryCount(openEntryCount.length)
  }, [openEntry]);
  return (
    <Row>
      {sectionRows.map((slot, i) => {
        const currentEntry = openEntry.find(
          (o) => slot.slot === o.entry && slot.isEntry
        ) || [];
        return (
          <>
            {slot.isEntry ? (
              <Col
                xs={slot.slot === "M" ? 8 : 2}
                className={`entry d-flex justify-content-center align-items-center px-0 ${
                  i < 4 ? "m-entry-top" : i > 6 ? "m-entry-bottom" : ""
                }`}
                key={i}
              >
                <Button
                  className={`${
                    currentEntry.isOpen ? "entry-button" : "closed-button"
                  } d-flex justify-content-center align-items-center ${
                    slot.slot === "M" ? "mid-entry" : "w-100"
                  } h-100`}
                  variant={currentEntry.isOpen ? "success" : "secondary"}
                  onClick={(event) => parkCar(currentEntry)}
                >
                  {currentEntry.isOpen ? "ENTRY" : "OPEN ENTRY?"}
                </Button>
              </Col>
            ) : (
              <Col
                xs={4}
                className={`d-flex ${
                  i > 7 ? "align-items-end" : "align-items-start"
                }`}
              >
                <Slot slot={slot} />
              </Col>
            )}
          </>
        );
      })}
      {park && <Entry entry={entryP} openEntryCount={entryCount} setCancelPark={cancelPark} />}
    </Row>
  );
};

export default Section;
