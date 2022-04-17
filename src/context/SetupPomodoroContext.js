import { createContext,useContext,useEffect,useState } from "react";

export const SetupPomodoroContext = createContext()

const SetupContextProvider = (props) => {

    // const [ pomodoro, setPomodoro ] = useState(0); 
    // const [ executing, setExecuting ] = useState({});
    // const [ startAnimation, setStartAnimation ] = useState(false);
    // const [ newTimerKey, setNewTimerKey ] =useState(0);

    //default
    
    const initState = {
        work: 25, //set initial time of work - 25min
        short: 5, //set initial time of short break - 5min
        long: 30, //set initial time of long break - 30min
        active: 'work' //set 
    }
    const [ pomodoro, setPomodoro ] = useState(0); 
    const [ executing, setExecuting ] = useState(initState);
    const [ startAnimation, setStartAnimation ] = useState(false);
    const [ newTimerKey, setNewTimerKey ] =useState(0);
    

    const startTimer = () => {
        setStartAnimation(true)
    }

    const pauseTimer = () => {
        setStartAnimation(false)
    }

    const resetTimer = () => {
        setNewTimerKey(newTimerKey + 1)
        pauseTimer() //pause the animation when the clock is refreshed
    }


    const updateTimer = (newTimer) => {
        setExecuting(newTimer) //object, "newTimer" from SetPomodoro
        setTime(newTimer)
    }

    function setCurrentTimer(activeType){ //either "work", "short" or "long"
        updateTimer({
            ...executing,
            active: activeType
        })
        setTime(executing) //reset the promodoro value depending on the active state
        console.log("executing: " + executing.active)
        pauseTimer()
    }

    const setTime = (data) => { //also used for resetting the timer
        switch (data.active) { //active: from SetPomodoro
            case "work":
                setPomodoro(data.work)
                break;

            case "short":
                setPomodoro(data.short)
                break;

            case "long":
                setPomodoro(data.long)
                break;

            default:
                setPomodoro(0)
                break;
        }
    }

    const children = ({ remainingTime }) => {
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60

        return `${minutes} : ${seconds}`
    }

    return(
        <SetupPomodoroContext.Provider 
            value={{
                startTimer,
                pauseTimer,
                resetTimer,
                updateTimer,
                setCurrentTimer,
                children,
                startAnimation,
                pomodoro,
                executing,
                newTimerKey,

                // setTime,
                // setCurrentTimer,
                // setExecuting,
                // setPomodoro
            }}
        >
            {props.children}
            {/* <Content /> */}
        </SetupPomodoroContext.Provider>
    )
}

export default SetupContextProvider