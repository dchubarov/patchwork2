import React from "react";
import {AspectRatio, useColorScheme} from "@mui/joy";

const AppLogo: React.FC = () => {
    const {mode} = useColorScheme();
    const logoUrl = process.env.PUBLIC_URL + "/logo192" +
        ((mode === "light") ? "" : "-dark") + ".png";

    return (
        <AspectRatio ratio="1" variant="plain" sx={(/*theme*/) => ({
            minWidth: 32, // TODO compute from variables
            transition: "transform .3s ease-in-out",
            ":hover": {
                // /* TODO rotation causes visible clipping of logo corners */
                // /* TODO hover position at sides causes dribbling sometimes */
                transform: "rotate(-90deg)"
            }
        })}>
            <img src={logoUrl} alt="Logo"/>
        </AspectRatio>
    );
}

export default AppLogo;
