import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import Slot from "./slot/Slot";
// eslint-disable-next-line
import "bootstrap/dist/css/bootstrap.min.css";
import "./Section.css";
import Entry from "../entry/Entry";
import AddEntry from "../entry/AddEntry";
import { sectionRows } from "../../common/const";
const Section = () => {
  const [park, setPark] = React.useState(false);
  const [addEntry, setAddEntry] = React.useState(false);
  const [openEntry, setOpenEntry] = React.useState([]);
  const [entryCount, setEntryCount] = React.useState(0);
  const addNewEntry = () => {
    setPark(false);
    setAddEntry(true)
  };
  const parkCar = () => {
    setPark(true);
    setAddEntry(false)
  };
  const cancelPark = () => {
    setPark(false);
  };
  const cancelAdd = () => {
    setAddEntry(false);
  };
  React.useEffect(() => {
    fetch("http://localhost:3500/entry")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setOpenEntry(data);
      });
    const openEntryCount = openEntry.filter((entry) => entry.isOpen);
    setEntryCount(openEntryCount.length);
  }, [openEntry]);
  return (
    <Row>
      {sectionRows.map((slot, i) => {
        // const currentEntry = openEntry.find(
        //   (o) => slot.slot === o.entry && slot.isEntry
        // ) || [];
        return (
          <>
            {slot.isSlot ? (
              <>
                <Col
                  xs={6}
                  className={`d-flex px-1 ${
                    i > 7 ? "align-items-end" : "align-items-start"
                  }`}
                >
                  <Slot slot={slot} />
                </Col>
              </>
            ) : (
              <Col xs={12} className="open-area"></Col>
            )}
            {/* // <Col>
              //   xs={slot.slot === "M" ? 8 : 2}
              //   className={`entry d-flex justify-content-center align-items-center px-0 ${
              //     i < 4 ? "m-entry-top" : i > 6 ? "m-entry-bottom" : ""
              //   }`}
              //   key={i}
              // >
              //   <Button
              //     className={`${
              //       currentEntry.isOpen ? "entry-button" : "closed-button"
              //     } d-flex justify-content-center align-items-center ${
              //       slot.slot === "M" ? "mid-entry" : "w-100"
              //     } h-100`}
              //     variant={currentEntry.isOpen ? "success" : "secondary"}
              //     onClick={(event) => parkCar(currentEntry)}
              //   >
              //     {currentEntry.isOpen ? "ENTRY" : "OPEN ENTRY?"}
              //   </Button>
              // </Col> */}
          </>
        );
      })}
      <Col className="d-flex justify-content-evenly my-3">
        <Button
          // className={`${
          //   currentEntry.isOpen ? "entry-button" : "closed-button"
          // } d-flex justify-content-center align-items-center ${
          //   slot.slot === "M" ? "mid-entry" : "w-100"
          // } h-100`}
          variant="success"
          onClick={parkCar}
        >
          PARK A CAR
        </Button>
        <Button
          // className={`${
          //   currentEntry.isOpen ? "entry-button" : "closed-button"
          // } d-flex justify-content-center align-items-center ${
          //   slot.slot === "M" ? "mid-entry" : "w-100"
          // } h-100`}
          variant="success"
          onClick={addNewEntry}
        >
          ADD ENTRY
        </Button>
      </Col>
      {park && (
        <Entry
          // entry={entryP}
          openEntryCount={entryCount}
          setCancelPark={cancelPark}
        />
      )}
      {addEntry && (
        <AddEntry
          setCancelAdd={cancelAdd}
        />
      )}
    </Row>
  );
};

export default Section;
