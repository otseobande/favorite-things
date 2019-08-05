function getNumberWithOrdinal(number) {
  const ordinals = ["th","st","nd","rd"]
  const remainderFromDivisionBy100 = number % 100;

  const ordinal = ordinals[(remainderFromDivisionBy100 - 20) % 10] ||
    ordinals[remainderFromDivisionBy100] ||
    ordinals[0];

  return `${number}${ordinal}`;
}

export default getNumberWithOrdinal;
