import { useContext } from 'react';
import {Item,SubItem,Label} from './TodoList'
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {toTomato} from "../utils";
import { SetupPomodoroContext } from "../context/SetupPomodoroContext";

const TaskDone=(props)=>{

    const {taskDone,dropTask,usedTime}=props;
    return(

    <Item key={taskDone.name}>
        <div
            className="task-title">{taskDone.name}</div>
        <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={3}
                sx={{display:"flex",justifyContent:"center",fontWeight:"bold"}}
            >
                <Label>Category</Label>
                <Label>Description</Label>
                <Label>Used Time</Label>
        </Stack>
        <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={3}
            sx={{display:"flex",justifyContent:"center",  padding:"10px"}}
        >

            <SubItem>{taskDone.category}</SubItem>
            <SubItem>{taskDone.description}</SubItem>
            <SubItem>{taskDone.totalTime? taskDone.totalTime+" min" : "Finished"} </SubItem>
        </Stack>

        <button className="button-under-text" onClick={dropTask} >Delete</button>

    </Item>
    )
}
export default TaskDone;