import React from "react";
import "./Park.css";
import moment from "moment";
import { Row, Col, Button, Container } from "react-bootstrap";
import motorcycle from "../../images/motorcycle.png";
import car from "../../images/car.png";
import truck from "../../images/truck.png";
import { useOnClickOutside } from "../../hooks/useOnClickOutsideModal";

const Park = (props) => {
  const { park, closeModal } = props;
  const parkInfo = {
    area: park[1],
    code: park[2],
    plateNo: park[3],
    carSize: park[4],
    fee: park[8]
  };
  const ref = React.useRef();
  useOnClickOutside(ref, () => {
    closeModal();
  });
  const close = () => {
    closeModal();
  };
  const [carReparked, setCarReparked] = React.useState(false)
  const [carUnPark, setCarUnPark] = React.useState(false);
  const parkDate = moment(park[5]);
  const currentDate = moment().toISOString();
  const diffMin = parkDate.diff(currentDate, "minutes");
  const dayCount = Math.trunc(diffMin / -1440);
  const overMinCount = Math.ceil((dayCount * 1440 + diffMin) / -60);
  const inDayCount = diffMin <= -180 ? Math.ceil(diffMin / -60 - 3) : 0;
  const computeFee = () => {
    let fee = parkInfo.fee;
    if(fee >= 40)
    if (dayCount !== 0) {
      fee +=
        dayCount * 5000 +
        overMinCount *
          (parkInfo.carSize === 3 ? 100 : parkInfo.carSize === 2 ? 60 : 20);
    } else if (dayCount === 0 && inDayCount !== 0) {
      fee += (carReparked ? 0 : 40) +
        inDayCount *
          (parkInfo.carSize === 3 ? 100 : parkInfo.carSize === 2 ? 60 : 20);
    } else {
      fee += (carReparked ? 0 : 40);
    }
    return fee;
  };
  const newUnPark = {
    plateNo: parkInfo.plateNo,
    carSize: parkInfo.carSize,
    isoDate: moment().toISOString(),
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("LTS"),
    fee: computeFee(),
  };
  const unPark = () => {
    fetch(`http://localhost:3500/slot/${park[0]}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        isParked: false,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then(() => {
        console.log(`SLOT UPDATED!`);
      });
    console.log(newUnPark)
    fetch(`http://localhost:3500/reserved`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newUnPark),
    }).then(() => {
      window.location.reload(false)
      console.log("OK");
    });
    setCarUnPark(true);
  };
  React.useEffect(() => {
    if(parkInfo.fee >=40){
      setCarReparked(true)
    }
  },[parkInfo.fee])
  return (
    <div ref={ref} className="parkModal">
      <Container>
        <Row>
          <Col
            xs={12}
            className="d-flex flex-column justify-content-center align-items-center gap-2"
          >
            {!carUnPark ? (
              <>
                <img
                  src={
                    parkInfo.carSize === 3
                      ? truck
                      : parkInfo.carSize === 2
                      ? car
                      : motorcycle
                  }
                  className="img"
                  alt="Parking Car"
                />
                <p>
                  <b>Park Slot:</b> {parkInfo.area}
                  {parkInfo.code}
                </p>
                <p>
                  <b>Plate Number:</b> {parkInfo.plateNo} {carReparked ? '(REPARK)': ''}
                </p>
                <p>
                  <b>Parked at:</b> {park[6]} {park[7]}
                </p>
                <p>
                  <b>Please Pay:</b> P{computeFee()}
                </p>
                <div className="d-flex justify-content-evenly w-100">
                  <Button className="gap-2" onClick={unPark}>
                    UNPARK
                  </Button>
                  <Button onClick={close}>CANCEL</Button>
                </div>
              </>
            ) : (
              <>
              CAR UNPARKED
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Park;
