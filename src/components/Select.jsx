import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { selectStyles } from "./designTokens";

export default function Select({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option"
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div className={selectStyles.wrapper} ref={ref}>
      {label && (
        <p className="text-sm font-medium text-gray-600 mb-1">
          {label}
        </p>
      )}

      {/* INPUT */}
      <button
        onClick={() => setOpen(!open)}
        className={`${selectStyles.input} flex justify-between items-center`}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={18} className="text-gray-400" />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className={selectStyles.dropdown}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`${selectStyles.option} ${
                value === opt.value && selectStyles.optionActive
              }`}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


