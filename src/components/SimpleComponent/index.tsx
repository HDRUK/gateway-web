
"use client"

import { Button } from "@mui/material"
import { useState } from "react"

export const SimpleComponent = ({datasets, collectino})=>{

const [value, setValue] = useState(0)


    return (
        <ThemeRegistry>
        <Button onClick={()=>setValue((prev)=>prev-1)}>
                deduct
            </Button>
                {value}
            <Button onClick={()=>setValue((prev)=>prev+1)}>
                add
            </Button>
        </ThemeRegistry>

        
    )

}