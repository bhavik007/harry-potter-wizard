import React from "react";
import "./Dropdown.css";

type DropdownProps<T> = {
  items: any[]; // List of items to display in the dropdown
  onSelect: (selectedItem: T) => void; // Callback function to return the selected item
  labelKey?: string; // Optional key to display as the label (default is the item itself)
  placeholder?: string; // Placeholder text for the dropdown
};

const Dropdown = <T,>({
  items,
  onSelect,
  labelKey,
  placeholder = "Select an option",
}: DropdownProps<T>) => {
  // Filter unique items based on the labelKey or the item itself
  const uniqueItems = React.useMemo(() => {
    if (labelKey) {
      const seen = new Set();
      return items.filter((item) => {
        const label = (item as any)[labelKey];
        if (seen.has(label)) {
          return false;
        }
        seen.add(label);
        return true;
      });
    }
    return Array.from(new Set(items));
  }, [items, labelKey]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.value;
    if (selectedIndex !== "") {
      onSelect(uniqueItems[parseInt(selectedIndex, 10)]);
    }
  };

  return (
    <div className="dropdown-container">
      <select className="dropdown" onChange={handleChange} defaultValue="">
        <option value="" disabled>
          {placeholder}
        </option>
        {uniqueItems.map((item, index) => (
          <option key={index} value={index}>
            {labelKey ? (item as any)[labelKey] : String(item)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
