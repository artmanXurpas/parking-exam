import React from "react";
// eslint-disable-next-line
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Slot.css";
import Park from "../../modal/Park";
import motorcycle from "../../../images/motorcycle.png";
import car from "../../../images/car.png";
import truck from "../../../images/truck.png";
import { SLOT_SIZE } from "../../../common/enums";

const Slot = (props) => {
  const { slot } = props;
  const [checkSlots, setCheckSlots] = React.useState([]);
  const [viewPark, setViewPark] = React.useState([]);
  const [parkParams, setParkParams] = React.useState({});
  const [checkPark, setCheckPark] = React.useState(false);
  const selectPark = (a, b, c, d, e, f, g, h, i) => {
    setCheckPark(true);
    setParkParams([a, b, c, d, e, f, g, h, i]);
  };
  const closeModal = () => {
    setCheckPark(false);
  };
  React.useEffect(() => {
    fetch("http://localhost:8000/park")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setViewPark(data);
      });
    fetch("http://localhost:8000/slot")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCheckSlots(data);
      });
  }, []);
  return (
    <Container fluid className="bg-slot">
      <Row>
        {checkSlots.map((slots, i) => {
          let jsx = "";
          const findSlot =
            viewPark
              .reverse()
              .find((o) => slots.code === o.code && slots.area === o.area) ||
            [];
          if (slots.area === slot.slot) {
            jsx = (
              <Col
                xs={slots.size}
                className="d-flex justify-content-center align-items-center side-height px-1"
                key={i}
              >
                {slots.isParked ? (
                  <Button
                    className="slot-button d-flex justify-content-center align-items-center flex-column"
                    onClick={() =>
                      selectPark(
                        slots.id,
                        findSlot.area,
                        findSlot.code,
                        findSlot.plateNo,
                        findSlot.carSize,
                        findSlot.isoDate,
                        findSlot.date,
                        findSlot.time,
                        findSlot.fee
                      )
                    }
                  >
                    <img
                      src={
                        findSlot.carSize === 3
                          ? truck
                          : findSlot.carSize === 2
                          ? car
                          : motorcycle
                      }
                      className={
                        slots.size === 3
                          ? "l-size"
                          : slots.size === 2
                          ? "m-size"
                          : "s-size"
                      }
                      alt="Parked-Car"
                    />
                    {slots.size !== 1 ? findSlot.plateNo : ""}
                  </Button>
                ) : (
                  <div>
                    <div className="w-100 text-center">{slots.area}{slots.code}</div>
                    <div className="w-100 text-center">({SLOT_SIZE[slots.size]})</div>
                  </div>
                )}
              </Col>
            );
          }
          return jsx;
        })}
      </Row>
      {checkPark && <Park park={parkParams} closeModal={closeModal} />}
    </Container>
  );
};

export default Slot;
