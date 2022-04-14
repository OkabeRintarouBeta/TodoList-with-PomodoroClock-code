
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    // padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const SubItem = styled(Paper)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    // padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const TodoList=(props)=>{
    const { name, description, category, timetodo,remove}=props;
    return(
        <Item key={name}>

            <div>
                <div>{name}</div>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={3}
                    sx={{display:"flex",justifyContent:"center"}}
                >
                    <SubItem>{timetodo}</SubItem>
                    <SubItem>{category}</SubItem>
                    <SubItem>{description}</SubItem>
                </Stack>
                <button onClick={remove}>Done</button>
            </div>

        </Item>
    )
}

export default TodoList;