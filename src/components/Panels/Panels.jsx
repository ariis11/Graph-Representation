import { useState } from "react";
import SearchField from "../GraphRepresentation/SearchField";
import FunctionPanel from "./FunctionPanel";
import OptionPanel from "./OptionPanel";
import PathPanel from "./PathPanel";

export default function Panels({ filters, setFilters, pathData, setPrimaryNodeAttributes }) {
    const [searchedNode, setSearchedNode] = useState(null);

    return (
        <div className="panels">
            <SearchField filters={filters} onSelected={setSearchedNode} />
            <FunctionPanel
                setFilters={setFilters}
                filters={filters}
                pathData={pathData}
                searchedNode={searchedNode}
            />
            <PathPanel
                filters={filters}
                setFilters={setFilters}
                pathData={pathData}
                setPrimaryNodeAttributes={setPrimaryNodeAttributes}
            />
            <OptionPanel
                filters={filters}
                setFilters={setFilters}
            />
        </div>
    );
}