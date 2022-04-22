import { useContext } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import './TodoList.css'
import { SetupPomodoroContext } from "../context/SetupPomodoroContext";


import {toTomato} from "../utils";

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    // padding: theme.spacing(1),
    justifyContent:"center",
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minWidth:"470px",
    marginBottom: "15px"
}));
export const SubItem = styled("div")(({ theme }) => ({
    color: 'darkslategray',
    backgroundColor: 'aliceblue',
    padding: 6,
    borderRadius: 4,
    // width:"100%",
    width:"100px",
    wordWrap: "break-word",
    maxHeight:"40px",
    // overflow:"scroll",
}));
export const Label = styled("div")(({ theme }) => ({
    color: 'darkslategray',
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 4,
    width:"100px",
    wordWrap: "break-word",
    maxHeight:"40px"
    // overflow:"scroll",
}));


const TodoList=(props)=>{
    const { name, description, category, timetodo, totalTime, remove,index}=props;
    const { executing } = useContext(SetupPomodoroContext)
    return(
        <div>
            <Item key={index}>
                <div className="task-title">{name}</div>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={3}
                    sx={{display:"flex",justifyContent:"center", fontWeight:"bold"}}
                >
                    <Label>Category</Label>
                    <Label>Description</Label>
                    <Label>Tomatos</Label>
                    <Label>Time to do</Label>
                </Stack>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem/>}
                    spacing={3}
                    sx={{display:"flex",justifyContent:"center", padding:"10px"}}
                >
                    <SubItem className="subitem-category">{category}</SubItem>
                    <SubItem>{description}</SubItem>
                    <SubItem>{toTomato(timetodo)}</SubItem>
                    <SubItem>{totalTime} min</SubItem>
                </Stack>

                <button className="button-under-text" onClick={remove}>Done</button>
            </Item>
        </div>

    )
}

export default TodoList;