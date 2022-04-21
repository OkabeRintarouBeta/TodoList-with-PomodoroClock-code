
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import './TodoList.css'

import {toTomato} from "../utils";

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    // padding: theme.spacing(1),
    justifyContent:"center",
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minWidth:"470px"
}));
export const SubItem = styled("div")(({ theme }) => ({
    color: 'darkslategray',
    backgroundColor: 'aliceblue',
    padding: 8,
    borderRadius: 4,
    // width:"100%",
    width:"90px",
    wordWrap: "break-word",
    maxHeight:"60px",
    overflow:"scroll",
    marginLeft:"15px",

}));


const TodoList=(props)=>{
    const { name, description, category, timetodo,remove,index}=props;
    return(

            <Item key={index}>
                <div className="task-title">{name}</div>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem/>}
                    spacing={2}
                    sx={{display:"flex",justifyContent:"center"}}
                >

                    <SubItem className="subitem-category">{category}</SubItem>
                    <SubItem>{toTomato(timetodo)}</SubItem>
                    <SubItem>{description}</SubItem>
                </Stack>

                <button onClick={remove} style={{marginRight:"20px"}} >Done</button>

            </Item>


    )
}

export default TodoList;