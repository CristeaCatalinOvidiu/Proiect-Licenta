import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";

type PlacesProps = {
	setSource: (position: google.maps.LatLngLiteral) => void;
};

export default function Places({ setSource }: PlacesProps) {
	const {
		ready,
		value,
		setValue,
		suggestions: { status, data },
		clearSuggestions,
	} = usePlacesAutocomplete();

	const handleSelect = async (val: string) => {
		setValue(val, false);
		clearSuggestions();

		const results = await getGeocode({ address: val });
		const { lat, lng } = await getLatLng(results[0]);
		setSource({ lat, lng });
	};

	return (
		<Combobox onSelect={handleSelect}>
			<ComboboxInput value={value} onChange={(e) => setValue(e.target.value)} className="combobox-input" placeholder="Search an address" />
			<ComboboxPopover>
				<ComboboxList className="combobox-list">
					{status === "OK" && data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} className="combobox-option" />)}
				</ComboboxList>
			</ComboboxPopover>
		</Combobox>
	);
}
