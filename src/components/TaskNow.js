import {Item,SubItem} from './TodoList'
import {toTomato} from "../utils";
import * as React from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useContext } from "react";
import { SetupPomodoroContext } from "../context/SetupPomodoroContext";


const TaskNow=(props)=>{
    const { task, timeRemain, showTimeRemain, isDoingTask}=props;
    //total tomato is the number of the initial setting given by the user
    //if the user choose 5 tomatos when adding a task, then totalTomato = 5;
    const { executing,finishCycle } = useContext(SetupPomodoroContext)

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
                        // timeRemain*executing.work
                        isDoingTask && !finishCycle ? showTimeRemain : timeRemain*executing.work

                    } minutes</div>
                </Stack>
            </Item>

        </div>

    )

}

export default TaskNow;
