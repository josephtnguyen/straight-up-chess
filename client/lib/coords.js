
export default function Coords() {
  Object.setPrototypeOf(this, Array.prototype);
  for (let i = 10; i < 90; i += 10) {
    for (let j = 1; j < 9; j++) {
      this.push(i + j);
    }
  }
  this.isCoord = function (number) {
    for (const coord of this) {
      if (number === coord) {
        return true;
      }
    }
    return false;
  };
}
