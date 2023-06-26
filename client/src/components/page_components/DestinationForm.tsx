import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { Destination, DestinationInput, DFProps } from "./utils/TypeDefinitions";
import { defaultDestinationInput, initialComboboxStyle } from "./utils/DefaultObjects";
import { addDestinationToDb } from "./utils/Functions";

function DestinationForm({ DFConfirmPatchDest, setConfirmPatchDest, setDest, setDestinations, destinations, recenterMap, hiddenDiv }: DFProps) {
	const {
		ready,
		value,
		setValue,
		suggestions: { status, data },
		clearSuggestions,
	} = usePlacesAutocomplete();
	const [newDestination, setNewDestination] = useState<DestinationInput>(defaultDestinationInput);
	const inputElements = useRef<HTMLInputElement[] | null[]>(new Array<HTMLInputElement>(4));
	const [inputElementIndex, setInputElementIndex] = useState(-1);
	const [caretPosIndex, setCaretPosIndex] = useState(0);

	useEffect(() => {
		if (inputElementIndex === -1) return;
		inputElements.current[inputElementIndex]?.focus();
		inputElements.current[inputElementIndex]?.setSelectionRange(caretPosIndex, caretPosIndex);
	});

	const handleSelect = async (val: string) => {
		setValue(val, false);
		clearSuggestions();

		try {
			await getGeocode({ address: val }).then(async (val) => {
				const results = val;
				await getLatLng(results[0]).then((result) => {
					const { lat, lng } = result;
					setDest({ lat, lng });
				});
			});
		} catch (e) {
			console.log(e);
		}
	};

	const handleGoTo = async (val: string) => {
		const results = await getGeocode({ address: val });
		if (results) {
			const { lat, lng } = await getLatLng(results[0]);
			recenterMap({ lat, lng });
		}
	};

	const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>, val: string) => {
		await getGeocode({ address: val })
			.then(async (value) => {
				const results = value;
				if (results && e.key === "Enter") {
					return await getLatLng(results[0]);
				}
			})
			.then((value) => {
				if (value) {
					const { lat, lng } = value;
					recenterMap({ lat, lng });
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	let ComboboxStyle: any;
	if (hiddenDiv) ComboboxStyle = initialComboboxStyle;

	useMemo(() => {
		if (hiddenDiv) {
			ComboboxStyle = initialComboboxStyle;
		} else {
			ComboboxStyle = {};
		}
	}, [hiddenDiv]);

	const Inputs = function Inputs() {
		return (
			<div>
				<label htmlFor="receiverName">
					<h2>Receiver name:</h2>
				</label>
				<input
					type="text"
					ref={(el) => (inputElements.current[0] = el)}
					value={newDestination.receiver_name}
					onChange={(val) => {
						setNewDestination({ ...newDestination, receiver_name: val.target.value });
						if (inputElementIndex != 0) setInputElementIndex(0);
						setCaretPosIndex(val.target.selectionStart || 0);
					}}
					maxLength={100}
					name="receiverName"
					id="receiverName"
					required
				/>

				<label htmlFor="receiverEmail">
					<h2>Receiver email:</h2>
				</label>
				<input
					type="text"
					ref={(el) => (inputElements.current[1] = el)}
					value={newDestination.receiver_email}
					onChange={(val) => {
						setNewDestination({ ...newDestination, receiver_email: val.target.value });
						if (inputElementIndex != 1) setInputElementIndex(1);
						setCaretPosIndex(val.target.selectionStart || 0);
					}}
					maxLength={100}
					name="receiverEmail"
					id="receiverEmail"
					required
				/>

				<label htmlFor="receiverLocation">
					<h2>Receiver location:</h2>
				</label>
				<input
					type="text"
					ref={(el) => (inputElements.current[2] = el)}
					value={newDestination.receiver_location}
					onChange={(val) => {
						setNewDestination({ ...newDestination, receiver_location: val.target.value });
						if (inputElementIndex != 2) setInputElementIndex(2);
						setCaretPosIndex(val.target.selectionStart || 0);
					}}
					maxLength={100}
					name="receiverLocation"
					id="receiverLocation"
					required
				/>

				<label htmlFor="receiverCompany">
					<h2>Receiver company:</h2>
				</label>
				<input
					type="text"
					ref={(el) => (inputElements.current[3] = el)}
					value={newDestination.receiver_company_name}
					onChange={(val) => {
						setNewDestination({ ...newDestination, receiver_company_name: val.target.value });
						if (inputElementIndex != 3) setInputElementIndex(3);
						setCaretPosIndex(val.target.selectionStart || 0);
					}}
					maxLength={100}
					name="receiverCompany"
					id="receiverCompany"
				/>
			</div>
		);
	};

	return (
		<div className="destination-form" style={ComboboxStyle}>
			<Combobox className="destination-form-combobox" onSelect={handleSelect}>
				<ComboboxInput
					value={value}
					onKeyDown={(e) => handleEnter(e, value)}
					onChange={(e) => {
						setValue(e.target.value);
						e.target.focus();
						setInputElementIndex(-1);
					}}
					className="combobox-input"
					placeholder="Search address for destination.."
				/>
				<ComboboxPopover>
					<ComboboxList className="combobox-list">
						{status === "OK" && data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} className="combobox-option" />)}
					</ComboboxList>
				</ComboboxPopover>
			</Combobox>
			<DestinationData />
			<button className="btn-dest" id="btn-goto" onClick={() => handleGoTo(value)}>
				Go to..
			</button>
		</div>
	);

	function DestinationData() {
		return (
			<form onSubmit={(e) => handleDestinationSubmit(e, value)}>
				<fieldset className="receiverData">
					<legend>
						<h1>Receiver data</h1>
					</legend>
					<Inputs />
					<button type="submit" className="btn-dest" id="btn-save-dest">
						Save destination..
					</button>
				</fieldset>
			</form>
		);
	}

	async function handleDestinationSubmit(e: React.FormEvent<HTMLFormElement>, val: string) {
		e.preventDefault();

		if (!val) return;
		const results = await getGeocode({ address: val });
		if (!results) return;
		const { lat, lng } = await getLatLng(results[0]);
		if (!{ lat, lng }) return;

		try {
			let auxNewDest: Destination = { x: 0, y: 0, receiver_name: "", receiver_company_name: "", receiver_email: "", receiver_location: "" };
			auxNewDest.x = lat;
			auxNewDest.y = lng;
			if (newDestination.receiver_name) auxNewDest.receiver_name = newDestination.receiver_name.toString();
			if (newDestination.receiver_email) auxNewDest.receiver_email = newDestination.receiver_email.toString();
			if (newDestination.receiver_location) auxNewDest.receiver_location = newDestination.receiver_location.toString();
			if (newDestination.receiver_company_name) auxNewDest.receiver_company_name = newDestination.receiver_company_name.toString();

			newDestination.x = lat;
			newDestination.y = lng;

			let addDestToLocal = await addDestinationToDb({ auxNewDest, DFConfirmPatchDest, newDestination, setConfirmPatchDest });

			if (addDestToLocal) {
				if (destinations.length > 0) setDestinations([...destinations, auxNewDest]);
				else setDestinations([auxNewDest]);
				addDestToLocal = false;
			}
		} catch (e) {
			console.log("Error caught: ", e);
		}
	}
}

export default React.memo(DestinationForm, (prev, next) => {
	if (prev.hiddenDiv !== next.hiddenDiv) return false;
	return true;
});
