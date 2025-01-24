const getRandomColor = (index: number) => {
  const colors = ["#d5896f", "#a5be00", "#003f88", "#FFB703", "#757bc8"];
  return colors[index % colors.length];
};
export default getRandomColor;