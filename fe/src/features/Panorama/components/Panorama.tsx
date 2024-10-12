import React, {useEffect} from "react";
import {Box, Sheet} from "@mui/joy";

import {useActiveView} from "../../../providers/ActiveViewProvider";

const PanoramaRow: React.FC<{header?: boolean}> = ({header}) => {
    return (
        <Box className="gridRow" sx={{display: "contents"}}>
            <Box sx={{gridColumn: "auto", gridRow: "auto"}}>
                <Sheet sx={{
                    backgroundColor: "background.level2",
                    typography: "body-sm",
                    height: "100%"
                }}>{header ? "." : "x"}</Sheet>
            </Box>
            {Array(31).fill(0).map((_, index) => (
                <Box key={`day-${index + 1}`} sx={{
                    gridColumn: "auto",
                    gridRow: "auto"
                }}>
                    <Sheet sx={{
                        backgroundColor: header ? "background.level2" : "surface",
                        typography: header ? "title-sm" : "body-sm",
                        height: "100%"
                    }}>{header ? index + 1 : "."}</Sheet>
                </Box>
            ))}
        </Box>
    );
}

const Panorama: React.FC = () => {
    const {configureView, ejectView} = useActiveView();
    useEffect(() => {
        configureView({title: "Panorama"});
        return () => ejectView();
    }, [configureView, ejectView]);

    return (
        <Box sx={{p: 2}}>
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "2fr repeat(31, minmax(28px, 1fr))",
                gridTemplateRows: "repeat(13, minmax(36px, 1fr))",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "sm",
                boxShadow: "sm",
                typography: "body-sm"
            }}>
                <PanoramaRow header/>
                {Array(12).fill(0).map((_, index) => (
                    <PanoramaRow key={`row-${index + 1}`}/>
                ))}
            </Box>
        </Box>
    );
}

Panorama.displayName = "Panorama";

export default Panorama;
