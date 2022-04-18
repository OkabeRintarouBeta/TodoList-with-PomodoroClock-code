import {Item,SubItem} from './TodoList'
import {toTomato} from "../utils";
import * as React from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useContext } from "react";
import { SetupPomodoroContext } from "../context/SetupPomodoroContext";


const TaskNow=(props)=>{
    const {task,timeRemain,showTimeRemain, isDoingTask}=props;
    const { executing } = useContext(SetupPomodoroContext)

    // const totalTime=task.time;
    // console.log(timeRemain)
    // console.log(task)

    if (!task){
        return (
            <div>
                Nothing to do now
            </div>
        )
    }
    else return (
        <div>
            <Item>
                <div>{task.name}</div>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={3}
                    sx={{display:"flex",justifyContent:"center"}}
                >
                    <SubItem>{task.category}</SubItem>
                    <SubItem>{toTomato(timeRemain)}</SubItem>
                    <SubItem>{task.description}</SubItem>
                    <div>Time Left: {
                        isDoingTask ? showTimeRemain : timeRemain*executing.work 
                    } minutes</div>
                </Stack>
            </Item>

        </div>

    )

}

export default TaskNow;
