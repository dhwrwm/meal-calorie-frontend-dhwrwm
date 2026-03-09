import { AutocompleteOption } from ".";

type Props = {
  options?: AutocompleteOption[];
  onSelect?: (_o: AutocompleteOption) => void;
  onClosePopup: () => void;
};

const AutocompleteItems = ({ options = [], onSelect, onClosePopup }: Props) => {
  return (
    <ul
      className="absolute z-99999 top-12.5 left-0 right-0 border rounded bg-background text-foreground max-h-50 overflow-y-auto"
      tabIndex={0}
    >
      {options.map((_option, index) => (
        <li
          className="px-3 py-1 cursor-pointer activeIndex hover:bg-accent"
          onClick={() => {
            onSelect?.(_option);
            onClosePopup();
          }}
          key={index}
        >
          {_option.label}
        </li>
      ))}
    </ul>
  );
};

export default AutocompleteItems;
