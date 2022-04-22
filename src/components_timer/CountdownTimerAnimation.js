import { useContext } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { SetupPomodoroContext } from "../context/SetupPomodoroContext";

{/**Props:
    key: props from "react-countdown-circle-timer". used to decide whether it is a new timer
    timer: amount of the time needs to run
    animate: true / false
    children: text content in the center
*/}

const CountdownTimerAnimation = ({ keys, timerDuration, startAnimate, isDoingTask, children}) => {
    const { resetTimer } = useContext(SetupPomodoroContext) //import the stopTimer in SettingContext
    // console.log("keys: " + keys)
    // console.log("timerDuration" + timerDuration)
    return (
        <CountdownCircleTimer
            key={keys}
            isPlaying={startAnimate}
            duration={ timerDuration * 60 } // sec * 60 => minutes
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[0.7*timerDuration * 60, 0.5*timerDuration * 60, 0.2*timerDuration * 60, 0]}
            strokeWidth={20}
            size={220}
            trailColor="#D3D3D3" //the gray color after the color is disappearing
            onComplete={ () => {
                // finishCycleHandler();
                resetTimer(isDoingTask);
            }}
        >   
            {children}
        </CountdownCircleTimer>
        
    )
}

export default CountdownTimerAnimation;