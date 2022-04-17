import { useContext } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { SetupPomodoroContext } from "../context/SetupPomodoroContext";

{/**Props:
    key: props from "react-countdown-circle-timer". used to decide whether it is a new timer
    timer: amount of the time needs to run
    animate: true / false
    children: text content in the center
*/}

const CountdownTimerAnimation = ({ keys, timerDuration, startAnimate, children}) => {
    const { resetTimer } = useContext(SetupPomodoroContext) //import the stopTimer in SettingContext
    console.log("keys: " + keys)
    console.log("timerDuration" + timerDuration)
    return (
        <CountdownCircleTimer
            key={keys}
            isPlaying={startAnimate}
            duration={ timerDuration * 60 } // sec * 60 => minutes
            colors={"#A30000"}
            strokeWidth={15}
            size={220}
            trailColor="#D3D3D3" //the gray color after the color is disappearing
            onComplete={ () => {
                resetTimer();
            }}
        >   
            {children}
        </CountdownCircleTimer>
        
    )
}

export default CountdownTimerAnimation;