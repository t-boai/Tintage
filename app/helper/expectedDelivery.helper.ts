export const getExpectedDelivery = () => {
  const today = new Date();
  const fromDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  const toDate = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
  const formatOpts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
  };
  return `${fromDate.toLocaleDateString("vi-VN", formatOpts)} - ${toDate.toLocaleDateString("vi-VN", formatOpts)}`;
};
