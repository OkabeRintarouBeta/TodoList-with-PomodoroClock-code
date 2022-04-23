import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DraggableList from 'react-draggable-lists';

import InputList from "./components/InputList";
import TodoList, { Item } from "./components/TodoList";
import {groupBy} from "./utils";
import TaskNow from "./components/TaskNow";
import TaskDone from "./components/TaskDone"

//pomodoro related
import Settings from "./components_timer/Settings"
import { SetupPomodoroContext } from "./context/SetupPomodoroContext"
import PomodoroButton from './components_timer/PomodoroButton';
import CountdownTimerAnimation from './components_timer/CountdownTimerAnimation';


import {useContext, useEffect, useState} from "react";

const drawerWidth = 300;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);



function App() {
    let defaultTasks=[]
    const storedTasks = localStorage.getItem('task-list');
    if (storedTasks) {
        defaultTasks = JSON.parse(storedTasks);
    }
    let defaultFinishedTasks=[]
    const storedCompletedTasks = localStorage.getItem('finished-task-list');
    if (storedCompletedTasks){defaultFinishedTasks=JSON.parse(storedCompletedTasks);}
    let defaultCurrentTask='';
    const storedCurrentTask=localStorage.getItem('current-task')
    if(defaultCurrentTask!==''){defaultCurrentTask=JSON.parse(storedCurrentTask);}

    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [taskList,setTaskList]=useState(defaultTasks);
    const [sortList,setSortList]=useState('');
    const [nextTask,setNextTask]=useState(defaultCurrentTask);
    const [timeLeft,setTimeLeft]=useState(0);
    const [taskDone,setTaskDone]=useState(defaultFinishedTasks);

    const [ startFromClock, setStartFromClock ] = useState(false);
    const [ showTimeRemain, setShowTimeRemain ] = useState(0);
    const [ doingTask, setDoingTask ] = useState(false);
    const [ disabled, setDisabled ] = useState(false);
    const [ disabledNoTask, setDisabledNoTask ] = useState(false);
    const [ pauseFlag, setPauseFlag ] = useState(false)
    const [ pauseFlagNotTask, setPauseFlagNotTask ] = useState(false)


    //------------Pomodoro Context-----------------------
    const {
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
        usedTime, //secounds
        finishCycle, // finish one clock flag
        setFinishCycle,
        startTimerTodoList,
        setTaskNowTimer
    } = useContext(SetupPomodoroContext)

    useEffect(()=>{updateTimer(executing)}, [executing, startAnimation])
    //----------------------------------------------------

    //---------Update left time when a task start---------
    const handleUsedTime = () => {
        // console.log("usedTime: " + usedTime); //seconds
        // console.log("timeLeft tomato num : " + timeLeft);
        // console.log("finishCycle in App.js: " + finishCycle)
        if(doingTask){
            const remainingTimeTodo = Math.floor(timeLeft*executing.work - usedTime / 60)
            setShowTimeRemain(remainingTimeTodo)
        }
    }
    useEffect(()=>{handleUsedTime()}, [usedTime])

    useEffect(()=>{
        if(finishCycle){
            setFinishCycle(false)
            setTimeLeft(timeLeft - 1)
            setDisabled(false)
        }
    },[finishCycle])

    useEffect(()=> {
        if(finishCycle && timeLeft === 1 && nextTask){
            // console.log("useEffect -- finishCycle 2: " + finishCycle)
            // console.log("useEffect -- timeLeft 2: " + timeLeft)
            setDoingTask(false);
            setFinishCycle(false)
            setNextTask('');
            setTaskDone((previousList)=>{
                const updatedList= [nextTask,...previousList];
                localStorage.setItem('finished-task-list',JSON.stringify(updatedList))
                localStorage.setItem('current-task','')
                return updatedList;
            })
        }
    },[finishCycle])
    //----------------------------------------------------

    //----Disable Pomodoro Settings when a task is running----
    const Disabled = ({ disabled, children }) => {
        // console.log("disabled: " + disabled)
        if (disabled) {
            return (
                <div style={{ opacity: 0.3, pointerEvents: "none" }} disabled>
                    {children}
                </div>
            );
        } else{
            return (
                <div style={{ opacity:1 }} disabled>
                    {children}
                </div>
            );
        }
    }

    //--------------------------------------------------------


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    /*
    Adapted from SI579 Todo List
    @ see https://github.com/UMSI579/todo/blob/step19/src/TodoList.js
    */

    const displayTaskList = (items ,order) => {
        if (items.length===0){
            return (
                <div className="empty">Nothing done</div>
            )
        }
        // console.log(items)
        if (order==='asc'){
            groupBy(items,'totalTime',"asc");

        }
        else if (order==='desc'){
            groupBy(items,'totalTime',"desc");
        }


        return items.map((item,idx) =>
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",width:"600px"}}>
                <TodoList
                    name={item.name}
                    description={item.description}
                    category={item.category}
                    timetodo={item.time}
                    totalTime={item.totalTime}
                    remove={() => removeTask(item.name, 2)}
                    index={idx}
                />
                <button
                    className="setting-button"
                    style={{marginLeft:"5px"}}
                    onClick={()=>{
                        if(nextTask===''){
                            setNextTask(item);
                            setTimeLeft(item.time);
                            removeTask(item.name,3);
                        }else{
                            // uncompleteAlert=true;
                            alert('Current Task Not finished!')
                            console.log("there are still unfinished task")
                        }
                        setShowTimeRemain(item.totalTime)
                        setTaskNowTimer(item.totalTime / item.time)
                    }}>Do Next</button>
            </div>
        )}

    const displayTaskDone=(items,order)=>{
        if (items.length===0){
            return (
                <div className="empty">Nothing done</div>
            )
        }
        if (order==='asc'){
            groupBy(items,'totalTime',"asc");

        }
        else if (order==='desc'){
            groupBy(items,'totalTime',"desc");
        }
        // console.log(items);
        return items.map((item,idx) =>
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",width:"500px"}}>
                <TaskDone
                    taskDone={item}
                    dropTask={()=>dropTask(item.name)}
                    usedTime={timeLeft * item.totalTime/item.time}
                />
            </div>
        )
    }

    // 1. move the task to finished-task-list
    // 2. If the button is `done`, then move the task to finished-task-list
    // 3. If the button is `do next`, then NOT move the task to finished-task-list

    const removeTask=(itemName, option)=>{
        const selected=[itemName]
        const task1=taskList.filter(({name}) => selected.includes(name));
        // console.log("task1",task1)
        if (option===2){
            //save the completed task to storage and taskDone list
            setTaskDone((previousList)=>{
                const updatedList=[
                    task1[0], ...previousList
                ]
                localStorage.setItem('finished-task-list',JSON.stringify(updatedList))
                return updatedList;
            })
            // console.log("item Time " + itemTime)
            // console.log("item Time2 " + task1.time)
        }
        else if (option===3){
            // save the current todo task to local storage
            localStorage.setItem('current-task',JSON.stringify(task1))

        }
        //Delete the original task in the todo list and storage
        setTaskList((previousList)=>{
            const withItemRemoved = previousList.filter((item) => {
                return item.name !== itemName
            });
            localStorage.setItem('task-list', JSON.stringify(withItemRemoved));
            return withItemRemoved;
        })

    }

    const dropTask=(itemName)=>{
        //Delete the original task in the todo list
        setTaskList((previousList)=>{
            const withItemRemoved = previousList.filter((item) => {
                return item.name !== itemName
            });
            localStorage.setItem('task-list', JSON.stringify(withItemRemoved));
            return withItemRemoved;
        })
        setTaskDone((previousList)=>{
            const withItemRemoved = previousList.filter((item) => {
                return item.name !== itemName
            });
            localStorage.setItem('finished-task-list', JSON.stringify(withItemRemoved));
            return withItemRemoved;
        })
    }


    return (
        <div className="App">
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <AddCircleOutlineIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{fontFamily:"impact",fontSize:"30px"}}>
                            Todo List with Pomodoro Clock
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <InputList isOpen={open} setTodoItems={setTaskList}/>
                </Drawer>
                <Stack
                    className="todoList-container"
                    component="main"
                    sx={{flexGrow: 1, bgcolor: 'background.default', p: 3 }}
                >
                    <Toolbar />
                    <Box sx={{ width: '800px'}}>
                        <h3>Task Now</h3>
                        <div style={{display:"flex",justifyContent:"space-between",minWidth:"500px"}}>
                            <TaskNow
                                task={nextTask}
                                timeRemain={timeLeft}
                                showTimeRemain={showTimeRemain}
                                isDoingTask={doingTask} //boolean
                            />
                            {/*/------------------Pomodoro start------------------*/}
                            <button className="setting-button primary"
                                    style={{
                                        visibility:nextTask===''?"hidden":"visible",
                                        opacity: disabled ? 0.3 : 1,
                                        pointerEvents: disabled ? "none" : "auto"
                                    }}
                                    onClick={()=>{
                                        if(!doingTask){ //default: false
                                            setTimeLeft(timeLeft)
                                            setDoingTask(true);
                                        }
                                        setTaskNowTimer(nextTask.totalTime / nextTask.time)
                                        startTimerTodoList();
                                        handleUsedTime();
                                        setDisabled(true); //when start a task, disable settings
                                        setStartFromClock(false);
                                    }}
                            >Start</button>

                            {/*/-------------------------------------------------*/}

                            {/*/------------------Pomodoro Pause Task------------------*/}
                            <button className="setting-button primary"
                                    style={{
                                        width:"80px",
                                        visibility:nextTask===''?"hidden":"visible",
                                        opacity: disabled ? 1 : 0.3,
                                        pointerEvents: disabled ? "auto" : "none"
                                    }}
                                    onClick={()=>{
                                        // console.log("pauseflag: " + pauseFlag)
                                        if(pauseFlag){
                                            startTimer()
                                            setPauseFlag(false)
                                        } else {
                                            pauseTimer();
                                            setPauseFlag(true)
                                        }
                                    }}
                            > {pauseFlag ? "Continue" : "Pause"}</button>
                            {/*/-------------------------------------------------------*/}

                            <button className="setting-button secondary" style={{width:"60px",visibility:nextTask===''?"hidden":"visible"}}
                                    onClick={()=>{
                                        setDoingTask(false);
                                        resetTimer(doingTask, startFromClock);
                                        setTaskDone((previousList)=>{
                                            const updatedList= [nextTask,...previousList];
                                            localStorage.setItem('finished-task-list',JSON.stringify(updatedList))
                                            localStorage.setItem('current-task','')
                                            return updatedList;
                                        })

                                        setNextTask('');
                                        setDisabled(false);
                                        setPauseFlag(false);
                                    }}
                            >Finish Ahead</button>
                        </div>
                    </Box>
                    <Divider sx={{margin:"30px"}}/>
                    <Box sx={{ width: '800px'}}>
                        <Stack sx={{display:'flex',flexDirection:'row',flexWrap:"wrap", gap:"10px",alignItems:"center"}}>
                            <h3>Task To Do</h3>
                            <div style={{paddingLeft:"170px",visibility:taskList.length===0?"hidden":"visible"}}>Sort tasks by:</div>
                            <ButtonGroup disableElevation variant="contained" sx={{width:"100px",height:"30px",justifySelf:"center"}}>
                                <Button onClick={()=>{setSortList('asc')} } sx={{visibility:taskList.length===0?"hidden":"visible"}}>Asc</Button>
                                <Button onClick={()=>{setSortList('desc')}} sx={{visibility:taskList.length===0?"hidden":"visible"}}>Desc</Button>
                            </ButtonGroup>
                            <div style={{visibility:taskList.length===0?"hidden":"visible"}}>total time</div>

                        </Stack>

                        <div>
                            {displayTaskList(taskList,sortList)}
                        </div>
                    </Box>
                    <Divider sx={{margin:"30px"}}/>
                    <Box sx={{ width: '70%'}}>
                        <div>
                            <h3>Task Done</h3>
                            {displayTaskDone(taskDone,'')}
                            {/*A button that clears all finished task in local storage*/}
                            <Button variant="outlined" startIcon={<DeleteIcon />}
                                    sx={{visibility:taskDone.length===0?"hidden":"visible", margin:'10px 0 10px 90px'}}
                                    onClick={()=>{
                                        localStorage.setItem('finished-task-list',[]);
                                        setTaskDone([])
                                    }}>Clear all done</Button>
                        </div>
                    </Box>

                </Stack>


                <Divider orientation='vertical' flexItem={true}/>
                <Box
                    component="main"
                    className='pomodoro' sx={{display:'flex',width:'70%', margin:'64px 64px'}}>
                    {/* 64px is the same height as the tool bar */}
                    <div className='pomodoro-container'>
                        <h3>Pomodoro</h3>
                        <>
                            <Disabled disabled={disabled}>
                                <div className="pomodoro-button" >
                                    <div className={executing.active === "work" ? "pomodoro-button-item-acitve" : "pomodoro-button-item"}>
                                        <PomodoroButton
                                            title="Work"
                                            _callback={(e) => {
                                                setCurrentTimer("work")
                                                setDisabledNoTask(false)
                                                setPauseFlagNotTask(false)
                                                setStartFromClock(true)
                                            }}
                                        />
                                    </div>
                                    <div className={executing.active === "short" ? "pomodoro-button-item-acitve" : "pomodoro-button-item"}>
                                        <PomodoroButton
                                            title="Short Break"
                                            _callback={() => {
                                                setCurrentTimer("short")
                                                setDisabledNoTask(false)
                                                setPauseFlagNotTask(false)
                                                setStartFromClock(true)
                                            }}
                                        />
                                    </div>
                                    <div className={executing.active === "long" ? "pomodoro-button-item-acitve" : "pomodoro-button-item"}>
                                        <PomodoroButton
                                            title="Long Break"
                                            _callback={() => {
                                                setCurrentTimer("long")
                                                setDisabledNoTask(false)
                                                setPauseFlagNotTask(false)
                                                setStartFromClock(true)
                                            }}
                                        />
                                    </div>
                                </div>
                            </Disabled>


                            <div className='pomodoro-timer-container'>
                                <CountdownTimerAnimation
                                    keys={newTimerKey}
                                    timerDuration={pomodoro}
                                    startAnimate={startAnimation}
                                    isDoingTask={doingTask}
                                    setDisabledNoTask = {setDisabledNoTask}
                                    setPauseFlagNotTask = {setPauseFlagNotTask}
                                    setStartFromClock = { setStartFromClock}
                                >
                                    {children}
                                </CountdownTimerAnimation>
                            </div>
                            <Disabled disabled={disabled}>

                                <div className='buttons-wrapper'>
                                    <button className="setting-button primary"
                                            style={{
                                                opacity: pauseFlagNotTask ? 0.3 : 1,
                                                pointerEvents: pauseFlagNotTask ? "none" : "auto",
                                                // disabled ? "none" : "auto"
                                            }}
                                            onClick={() => {
                                                startTimer()
                                                setDisabledNoTask(true)
                                                setPauseFlagNotTask(true)
                                                setStartFromClock(true)
                                            }
                                            }
                                    > Start </button>

                                    <PomodoroButton
                                        title="Pause"
                                        _callback={()=>{
                                            pauseTimer()
                                            setPauseFlagNotTask(false)
                                        }}
                                    />
                                    <PomodoroButton
                                        title="Reset"
                                        _callback={() => {
                                            if(disabledNoTask){ //useing the clock when not doing a task
                                                // console.log('setDisabledNoTask: ' + disabledNoTask)
                                                resetTimer(doingTask, startFromClock)
                                                setDisabledNoTask(false)
                                                setPauseFlagNotTask(false)
                                            }
                                            else{
                                                resetTimer(doingTask, startFromClock)
                                                setDisabledNoTask(false)
                                            }
                                        }}
                                    />
                                </div>

                            </Disabled>
                            <Settings disabled={disabled} disableNoTask={disabledNoTask}/>

                        </>


                    </div>

                </Box>

            </Box>

        </div>
    );
}

export default App;