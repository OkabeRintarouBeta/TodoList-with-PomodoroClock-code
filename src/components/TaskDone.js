import {Item,SubItem} from './TodoList'

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {toTomato} from "../utils";

const TaskDone=(props)=>{
    const {taskDone,dropTask}=props;
    return(

    <Item key={taskDone.name}>
        <div>{taskDone.name}</div>
        <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={3}
            sx={{display:"flex",justifyContent:"center"}}
        >

            <SubItem>{taskDone.category}</SubItem>
            <SubItem>{taskDone.time*25} min</SubItem>
            <SubItem>{taskDone.description}</SubItem>
        </Stack>

        <button onClick={dropTask} style={{marginRight:"20px"}} >Delete</button>

    </Item>
    )
}
export default TaskDone;