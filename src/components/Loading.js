import React from "react";

import { FaWineBottle } from "react-icons/fa"

export default function Loading() {
    return <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }}>
        <FaWineBottle class="fa fa-spinner fa-spin fa-3x fa-fw" size={50} width="100%"/>    loading... Gozzby store
    </div>
}
