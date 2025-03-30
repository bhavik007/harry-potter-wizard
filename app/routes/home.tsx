import React, { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import Table from "~/component/Table/Table";
import Dropdown from "~/component/Dropdown/Dropdown";
import Textbox from "~/component/Textbox/Textbox";
import "./home.css";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Harry Potter Wizard" }];
}

type Elixir = {
  id: string;
  name: string;
  effect: string;
  difficulty: string;
  manufacturer: string;
  ingredients: { id: string; name: string }[];
  inventors?: { firstName: string; lastName: string }[];
};

export default function Home() {
  const [data, setData] = useState<Elixir[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({
    Name: "",
    Ingredient: "",
    InventorFullName: "",
    Manufacturer: "",
  });
  const [debouncedFilter, setDebouncedFilter] = useState<any>(filter); // Debounced filter state

  const difficulties = [
    { key: "Unknown" },
    { key: "Advanced" },
    { key: "Moderate" },
    { key: "Beginner" },
    { key: "OrdinaryWizardingLevel" },
    { key: "OneOfAKind" },
  ];

  const columns: {
    header: string;
    accessor: keyof Elixir;
    customRow?: (data: Elixir) => React.ReactNode;
  }[] = [
    { header: "Name", accessor: "name" },
    { header: "Difficulty", accessor: "difficulty" },
    {
      header: "Ingredients",
      accessor: "ingredients",
      customRow: (value, row) =>
        Array.isArray(value) && value.length
          ? value.map((ingredient) => ingredient.name).join(", ") || ""
          : "-",
    },
    {
      header: "Inventor Full Name",
      accessor: "inventors",
      customRow: (value, row) =>
        Array.isArray(value) && value.length
          ? value.map((name, index) => (
              <React.Fragment key={index}>
                {`${name.firstName} ${name.lastName}`}
                <br />
              </React.Fragment>
            ))
          : "-",
    },
    { header: "Manufacturer", accessor: "manufacturer" },
  ];

  const fetchElixirs = async (qs = "") => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://wizard-world-api.herokuapp.com/Elixirs?" + qs
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const elixirs: Elixir[] = await response.json();
      setData(elixirs);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElixirs();
  }, []);

  // Debounce logic for the filter object
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter); // Update the debounced filter after a delay
    }, 1000);

    return () => {
      clearTimeout(handler); // Clear timeout if filter changes before delay ends
    };
  }, [filter]);

  // Trigger API call when the debounced filter changes
  useEffect(() => {
    const filterQuery = Object.entries(debouncedFilter)
      .filter(([_, value]) => value) // Remove empty filters
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    fetchElixirs(filterQuery);
  }, [debouncedFilter]);

  const handleDropdownSelect = (selectedItem: any) => {
    setFilter({ Name: "", Ingredient: "", InventorFullName: "", Manufacturer: "" });
    fetchElixirs(`difficulty=${selectedItem.key}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilter((prevFilter: any) => ({
      ...prevFilter,
      [key]: value,
    }));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Hogwarts Elixirs</h1>
      </div>
      
      <div className="filter-dropdown-container">
        <div className="filter-container">
          {Object.keys(filter).map((key) => (
            <Textbox
              key={key}
              value={filter[key]}
              onChange={(value) => handleFilterChange(key, value)}
              placeholder={`Search by ${key}`}
            />
          ))}
        </div>

        <div className="dropdown-container">
          <Dropdown
            items={difficulties}
            onSelect={handleDropdownSelect}
            labelKey="key"
            placeholder="Select Difficulty"
          />
        </div>
      </div>
      
      <div className="table-container">
        <Table data={data} columns={columns} rowsPerPage={5} loading={loading} />
      </div>
    </div>
  );
}
