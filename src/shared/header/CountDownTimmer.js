import React from "react";
import { useReactCountdown } from "use-react-countdown";

const CountDownTimmer = ({dateToEndCountdownAt}) => {

  const { days, hours, minutes, seconds } =  useReactCountdown(dateToEndCountdownAt);

  return (
    <>
      <p>Time left</p>
      <div>
        {days}D : {hours}H : {minutes}M : {seconds}S
      </div>
    </>
  );
};
export default CountDownTimmer;