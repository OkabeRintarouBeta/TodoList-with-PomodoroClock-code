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
import DraggableList from 'react-draggable-lists';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import InputList from "./components/InputList";
import TodoList from "./components/TodoList";
import {groupBy} from "./utils";
import TaskNow from "./components/TaskNow";
import TaskDone from "./components/TaskDone"


import {useState} from "react";

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
                <div>Nothing done</div>
            )
        }
        // console.log(items)
        if (order==='asc'){
            groupBy(items,'time',"asc");

        }
        else if (order==='desc'){
            groupBy(items,'time',"desc");
        }
        return items.map((item,idx) =>
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",width:"500px"}}>
                <TodoList
                    name={item.name}
                    description={item.description}
                    category={item.category}
                    timetodo={item.time}
                    remove={() => removeTask(item.name,2)}
                    index={idx}
                />
                <button
                    style={{marginLeft:"20px"}}
                    onClick={()=>{
                    if(nextTask===''){
                        setNextTask(item);
                        setTimeLeft(item.time);
                        removeTask(item.name,3);
                    }else{
                        console.log("there are still unfinished task")
                    }
                }}>Do next</button>
            </div>
        )}

    const displayTaskDone=(items,order)=>{
        if (items.length===0){
            return (
                <div>Nothing done</div>
            )
        }
        if (order==='asc'){
            groupBy(items,'time',"asc");

        }
        else if (order==='desc'){
            groupBy(items,'time',"desc");
        }
        return items.map((item,idx) =>
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",width:"500px"}}>
                <TaskDone
                    taskDone={item}
                    dropTask={()=>dropTask(item.name)}
                />
            </div>
        )
    }

    // 1. move the task to finished-task-list
    // 2. If the button is `done`, then move the task to finished-task-list
    // 3. If the button is `do next`, then NOT move the task to finished-task-list

    const removeTask=(itemName,option)=>{
        const selected=[itemName]
        const task1=taskList.filter(({name}) => selected.includes(name));
        // console.log("task1",task1)
        if (option===2){
            //save the completed task to storage and taskDone list
            setTaskDone((previousList)=>{
                const updatedList=[
                    task1, ...previousList
                ]
                localStorage.setItem('finished-task-list',JSON.stringify(updatedList))
                return updatedList;
            })
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
                    <Typography variant="h6" noWrap component="div">
                        Todo List
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
                component="main"
                sx={{flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />
                <Box sx={{ width: '50%'}}>
                    <h3>Task Now</h3>
                    <div style={{display:"flex",justifyContent:"space-between",minWidth:"500px"}}>
                        <TaskNow
                            task={nextTask}
                            timeRemain={timeLeft}
                        />
                        <button style={{width:"50px",visibility:nextTask==''?"hidden":"visible"}}
                            onClick={()=>{
                                setTaskDone((previousList)=>{
                                    const updatedList= [nextTask,...previousList];
                                    localStorage.setItem('finished-task-list',JSON.stringify(updatedList))
                                    localStorage.setItem('current-task','')
                                    return updatedList;
                                })

                                setNextTask('');
                            }}
                        >Finish Ahead</button>
                    </div>
                </Box>
                <Divider sx={{margin:"30px"}}/>
                <Box sx={{ width: '50%'}}>
                    <Stack sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:"center"}}>
                        <h3>Task To Do</h3>
                        <ButtonGroup disableElevation variant="contained" sx={{width:"80px",height:"30px",justifySelf:"flex-end"}}>
                            <Button onClick={()=>{setSortList('asc')} } sx={{visibility:taskList.length===0?"hidden":"visible"}}>Asc</Button>
                            <Button onClick={()=>{setSortList('desc')}} sx={{visibility:taskList.length===0?"hidden":"visible"}}>Desc</Button>
                        </ButtonGroup>
                    </Stack>


                    <div>
                        {displayTaskList(taskList,sortList)}
                    </div>
                </Box>
                <Divider sx={{margin:"30px"}}/>
                <Box sx={{ width: '50%'}}>
                    <div>
                        <h3>Task Done</h3>
                        {displayTaskDone(taskDone,'')}
                        {/*A button that clears all finished task in local storage*/}
                        <Button variant="outlined" startIcon={<DeleteIcon />}
                                sx={{visibility:taskDone.length===0?"hidden":"visible", margin:'10px auto'}}
                                onClick={()=>{
                                    localStorage.setItem('finished-task-list',[]);
                                    setTaskDone([])
                                }}>Clear all done</Button>
                    </div>
                </Box>

            </Stack>

        </Box>
    </div>
  );
}

export default App;
