import React from "react";

import { FaWineBottle } from "react-icons/fa"

export default function Loading() {
    return <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 'x-large',
        marginTop: '5%'
    }}>
        <FaWineBottle className="fa fa-spinner fa-spin fa-3x fa-fw" size={150} width="100%"/>
            <div style={{fontSize: 'xxx-large', marginLeft: '50px'}}>
                Loading... Gozzby store
            </div>
    </div>
}
