export default function formatTime(dayTime = '') {
  const getDayTime = new Date(dayTime);
  const tsDayTime = getDayTime.getTime();
  const getDayNow = new Date();
  const tsDayNow = getDayNow.getTime();

  let diff = tsDayTime - tsDayNow;
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  let hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  let mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);

  //   let seconds = Math.floor(diff / 1000);
  //   diff -= seconds * 1000;
  return {
    days,
    hours,
    mins,
    // seconds,
  };
}
