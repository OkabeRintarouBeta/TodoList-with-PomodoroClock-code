{/* General Button setting for the pomodoro */}
const PomodoroButton = ({ title, activeClass, _callback }) => {
    return(
        <button className={activeClass} onClick={_callback}>{title}</button>
    )
}

export default PomodoroButton;