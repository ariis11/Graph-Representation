import React, { useEffect, useState } from "react";

import { useSigma } from "@react-sigma/core";
import { BsSearch } from "react-icons/bs";

const SearchField = ({ filters, onSelected }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  const [search, setSearch] = useState("");
  const [values, setValues] = useState([]);
  const [selected, setSelected] = useState(null);

  const refreshValues = () => {
    const newValues = [];
    const lcSearch = search.toLowerCase();
    if (!selected && search.length > 1) {
      graph.forEachNode((key, attributes) => {
        if (attributes.label && attributes.label.toLowerCase().indexOf(lcSearch) === 0)
          newValues.push({ id: key, label: attributes.label });
      });
    }
    setValues(newValues);
  };

  // Refresh values when search is updated:
  useEffect(() => refreshValues(), [search]);

  // Refresh values when filters are updated (but wait a frame first):
  useEffect(() => {
    requestAnimationFrame(refreshValues);
  }, [filters]);

  useEffect(() => {
    if (!selected) return;
    
    const selectedHidden = graph.getNodeAttribute(selected, "hidden");
    const selectedColor = graph.getNodeAttribute(selected, "color");
    const selectedNode = filters.nodes[selected];

    graph.setNodeAttribute(selected, "highlighted", true);
    graph.setNodeAttribute(selected, "hidden", false);
    graph.setNodeAttribute(selected, "color", selectedNode.primaryColor);

    const nodeDisplayData = sigma.getNodeDisplayData(selected);

    if (nodeDisplayData)
      sigma.getCamera().animate(
        { ...nodeDisplayData, ratio: 0.05 },
        {
          duration: 600,
        },
      );

    return () => {
      graph.setNodeAttribute(selected, "highlighted", false);
      graph.setNodeAttribute(selected, "hidden", selectedHidden);
      graph.setNodeAttribute(selected, "color", selectedColor);
    };
  }, [selected]);

  const onInputChange = (event) => {
    const searchString = event.target.value;
    const valueItem = values.find((value) => value.label === searchString);
    if (valueItem) {
      setSearch(valueItem.label);
      setValues([]);
      setSelected(valueItem.id);
      onSelected(valueItem.id);
    } else {
      setSelected(null);
      onSelected(null);
      setSearch(searchString);
    }
  };

  const onKeyPress = (event) => {
    if (event.key === "Enter" && values.length) {
      setSearch(values[0].label);
      setSelected(values[0].id);
      onSelected(values[0].id);
    }
  };

  return (
    <div className="search-wrapper">
      <input
        type="search"
        placeholder="Search in nodes..."
        list="nodes"
        value={search}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
      />
      <BsSearch className="icon" />
      <datalist id="nodes">
        {values.map((value) => (
          <option key={value.id} value={value.label}>
            {value.label}
          </option>
        ))}
      </datalist>
    </div>
  );
};

export default SearchField;