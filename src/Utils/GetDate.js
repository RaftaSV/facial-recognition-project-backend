export const getDate = () => {
  const date = new Date();
  date.setDate(date.getDate());
  const newDate = date.toISOString().substring(0, 10);
  return {
    newDate
  };
};

export const getTime = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}:${seconds}`;
  return {
    currentTime
  };
};
