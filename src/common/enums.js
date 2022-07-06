export const SLOT_SIZE = {
  1: 'S',
  2: 'M',
  3: 'L',
};

export const entryDist = (entry, slot, code, distance) => {
  let dist = distance[slot];
  switch (entry) {
    case "NW":
    case "W":
    case "SW":
      dist += code / 10;
      break;
    case "NE":
    case "E":
    case "SE":
      if (code === '1') dist += 6 / 10;
      else if (code === '2') dist += 5 / 10;
      else if (code === '3') dist += 4 / 10;
      else if (code === '4') dist += 3 / 10;
      else if (code === '5') dist += 2 / 10;
      else dist += 1 / 10;
      break;
    case "M":
      if (slot === "B" || slot === "D") {
        dist += code / 10;
      } else {
        if (code === '1') dist += 6 / 10;
        else if (code === '2') dist += 5 / 10;
        else if (code === '3') dist += 4 / 10;
        else if (code === '4') dist += 3 / 10;
        else if (code === '5') dist += 2 / 10;
        else dist += 1 / 10;
        break;
      }
      break;
    default:
      dist = 1;
  }
  return dist;
};
