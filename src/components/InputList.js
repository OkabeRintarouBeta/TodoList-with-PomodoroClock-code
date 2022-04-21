import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import TextField from '@mui/material/TextField';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

import { useContext } from "react";
import { SetupPomodoroContext } from "../context/SetupPomodoroContext";

import {useState} from "react";


const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});




const InputList=(props)=>{
    const {isOpen,setTodoItems}=props;
    const [taskName,setTaskName]=useState('');
    const [taskDescription,setTaskDescription]=useState('');
    const [taskTime,setTaskTime]=useState(0);
    const [taskCategory, setTaskCategory]=useState('');

    const { executing } = useContext(SetupPomodoroContext)
    /*
     @ see https://github.com/UMSI579/todo/blob/step19/src/components/InputGroup.js
     */
    const AddTask=()=>{
        console.log(taskName,taskTime,taskDescription,taskCategory)
        if(taskName && taskTime){
            setTodoItems((previousList)=>{
                const updatedList=[
                    {
                        name:taskName,
                        description:taskDescription,
                        time:taskTime,
                        category:taskCategory
                    },
                    ...previousList
                ]
                localStorage.setItem('task-list',JSON.stringify(updatedList))
                return updatedList;
            })
        }

        setTaskName('');
        setTaskDescription('')
        setTaskCategory('');
        setTaskTime(0)
    }
    const keyDownHandler = (e) => {
        if (e.key === 'Enter') {
            AddTask()
        }
    }

    return (

            <div>
                <Divider />
                <List>
                    <ListItem>
                        <TextField id="standard-basic" label="Name" variant="standard" sx={{opacity: isOpen ? 1 : 0,m: 3 }}
                                   value={taskName}
                                   onChange={(e)=>setTaskName(e.target.value)}
                        />
                    </ListItem>

                    <ListItem>
                        <TextField
                            id="standard-multiline-flexible"
                            label="Description"
                            multiline
                            maxRows={4}
                            variant="standard"
                            sx={{opacity: isOpen ? 1 : 0 ,m: 3}}
                            value={taskDescription}
                            onChange={(e)=>setTaskDescription(e.target.value)}
                            onKeyDown={keyDownHandler}
                        />
                    </ListItem>
                    <ListItem>
                        {/*select category*/}
                        <FormControl variant="filled" sx={{ m: 3, minWidth: 180,opacity: isOpen ? 1 : 0 }}>
                            <InputLabel id="demo-simple-select-filled-label">Task Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-filled-label"
                                id="demo-simple-select-filled"
                                value={taskCategory}
                                onChange={(e)=>setTaskCategory(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="study">Study </MenuItem>
                                <MenuItem value="work">Work</MenuItem>
                                <MenuItem value="sports">Sports</MenuItem>
                                <MenuItem value="others">Others</MenuItem>
                            </Select>
                        </FormControl>
                    </ListItem>

                    {/*Set Time*/}
                    <ListItem>
                        <Box
                            sx={{
                                '& > legend': { mt: 2 },
                                m: 3, minWidth: 180,opacity: isOpen ? 1 : 0

                            }}

                        >
                            <Typography component="legend">Set Time({executing.work} per clock)</Typography>
                            <StyledRating
                                name="customized-color"
                                defaultValue={1}
                                max={6}
                                value={taskTime}
                                onChange={(event, newTaskTime) => {
                                    setTaskTime(newTaskTime);
                                }}
                                getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                icon={<WatchLaterIcon fontSize="inherit" />}
                                emptyIcon={<WatchLaterOutlinedIcon fontSize="inherit" />
                                }
                            />

                            <span>  {taskTime*executing.work} minutes</span>
                        </Box>

                    </ListItem>
                    <ListItem>
                        <Button sx={{m: 3, minWidth: 180,opacity: isOpen ? 1 : 0}}
                                variant="contained"
                                onClick={AddTask}
                        >Add Task</Button>
                    </ListItem>
                </List>
            </div>

    );
}

export default InputList;
