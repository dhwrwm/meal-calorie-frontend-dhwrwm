"use client";

import { useCallback, useState } from "react";

import AutocompleteItems from "./AutocompleteItems";
import Input from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AutocompleteOption = { label: string; value: string };

type Props = {
  value?: string;
  options?: AutocompleteOption[];
  onSelect?: (_option: AutocompleteOption) => void;
  className?: string;
  placeholder?: string;
  wrapperclassName?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

const Autocomplete = ({
  options = [],
  onSelect,
  value = "",
  className = "",
  placeholder = "",
  wrapperclassName,
  onChange,
  onKeyDown,
}: Props) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const onClickOutside = useCallback(() => {
    setShowPopup(false);
  }, []);

  return (
    <>
      <div className={cn("relative w-full", wrapperclassName)}>
        <Input
          className={`px-2.5 py-3.5 w-full text-sm ${className}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => {
            if (value.length === 0) {
              setShowPopup(true);
            }
          }}
          onKeyDown={onKeyDown}
        />
        {showPopup && options.length > 0 && (
          <AutocompleteItems
            options={options}
            onSelect={onSelect}
            onClosePopup={() => setShowPopup(false)}
          />
        )}
      </div>
      {showPopup && (
        <div
          className="drawer-overlay absolute inset-0"
          onClick={onClickOutside}
        />
      )}
    </>
  );
};

export default Autocomplete;
