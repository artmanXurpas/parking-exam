import React from "react";
import "./Entry.css";
import { Row, Col, Button } from "react-bootstrap";
import { entryDist } from "../../common/enums";
import moment from "moment";

const Entry = (props) => {
  const { entry, openEntryCount, setCancelPark } = props;
  const [carPark, setCarPark] = React.useState({
    plateNo: "",
    size: null,
    fee: 0,
  });
  const [slots, setSlots] = React.useState([]);
  const [repark, setRepark] = React.useState([]);
  const [sizeCheck, setSizeCheck] = React.useState(false);
  const handlePlateNo = (event) => {
    const plate = repark.find((o) => o.plateNo === event.target.value) || [];
    const parkDate = moment(plate.isoDate);
    const currentDate = moment().toISOString();
    const diffMin = parkDate.diff(currentDate, "minutes");
    if (diffMin > -60 && diffMin !== 0) {
      setCarPark({
        ...carPark,
        plateNo: plate.plateNo,
        size: plate.carSize,
        fee: plate.fee,
      });
      setSizeCheck(true);
    } else {
      setCarPark({ ...carPark, plateNo: event.target.value });
      setSizeCheck(false);
    }
    console.log(plate, diffMin);
  };
  const handleSize = (event) => {
    if (event.target.value !== 0)
      setCarPark({ ...carPark, size: event.target.value });
  };
  React.useEffect(() => {
    const fetchSlot = async () => {
      const data = await fetch("http://localhost:8000/slot").then((res) => {
        return res.json();
      });
      const reEnterPark = await fetch("http://localhost:8000/reserved").then(
        (res) => {
          return res.json();
        }
      );
      setSlots(data);
      setRepark(reEnterPark);
    };
    fetchSlot();
    console.log(carPark);
  }, [carPark]);
  const closeEntry = () => {
    if (openEntryCount <= 3 && entry.isOpen) alert("Cannot close Entry!");
    else if (!entry.isOpen) {
      fetch(`http://localhost:8000/entry/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          isOpen: true,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then(() => {
          console.log(`ENTRY OPENED!`);
        });
    } else {
      fetch(`http://localhost:8000/entry/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          isOpen: false,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then(() => {
          console.log(`ENTRY CLOSED!`);
        });
    }
    window.location.reload(false);
  };
  const cancelPark = () => {
    setCancelPark();
  };
  const park = () => {
    const checkDist = slots.map((slot, i) => {
      const dist = entryDist(entry.entry, slot.area, slot.code, entry.distance);
      return { ...slot, dist: dist };
    });
    const sortDist = checkDist.sort((a, b) => a.dist - b.dist);
    let findSlot = sortDist.find(
      (o) => !o.isParked && carPark.size <= o.size && o.dist >= 1.1
    );
    if (findSlot === undefined) {
      alert("No more slots available");
    } else {
      fetch(`http://localhost:8000/slot/${findSlot.id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          isParked: true,
          id: findSlot.id,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then(() => {
          console.log(`SLOT UPDATED!`);
        });
      const newPark = {
        entry: entry.entry,
        plateNo: carPark.plateNo,
        area: findSlot.area,
        code: findSlot.code,
        // distance: findSlot.dist,
        size: findSlot.size,
        carSize: parseInt(carPark.size),
        isoDate: moment().toISOString(),
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("LTS"),
        fee: carPark.fee,
      };
      fetch(`http://localhost:8000/park`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newPark),
      }).then(() => {
        window.location.reload(false);
        console.log("OK");
      });
    }
  };

  return (
    <div className="parkModal">
      <Row>
        <Col xs={8}>
          <h1>Entry {entry.entry}</h1>
        </Col>
        <Col xs={4}>
          <Button
            variant={entry.isOpen ? "danger" : "warning"}
            onClick={closeEntry}
          >
            {entry.isOpen ? "CLOSE ENTRY" : "OPEN ENTRY"}
          </Button>
        </Col>
        <Col className="d-flex justify-content-center align-items-center flex-column">
          <div>
            {entry.isOpen ? (
              <>
                <form className="parking-form">
                  <input
                    className="form-field"
                    placeholder="Plate No."
                    name="plateNumber"
                    onChange={handlePlateNo}
                  />
                  <select
                    className="form-field"
                    onChange={handleSize}
                    disabled={sizeCheck}
                  >
                    {" "}
                    <option value={0}>Please select Vehicle Size</option>
                    <option value={1}>Small</option>
                    <option value={2}>Medium</option>
                    <option value={3}>Large</option>
                  </select>
                </form>
                <div className="d-flex justify-content-evenly w-100">
                  <Button
                    className="gap-2"
                    onClick={
                      carPark.plateNo !== "" && carPark.size !== 0 ? park : null
                    }
                  >
                    PARK
                  </Button>
                  <Button onClick={cancelPark}>CANCEL</Button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Entry;
