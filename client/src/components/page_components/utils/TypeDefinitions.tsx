export type LatLngLiteral = google.maps.LatLngLiteral;
export type DirectionsResult = google.maps.DirectionsResult;
export type MapOptions = google.maps.MapOptions;

export type Destination = {
	x: number;
	y: number;
	receiver_name: String;
	receiver_company_name: String;
	receiver_email: String;
	receiver_location: String;
};
export type DestinationInput = {
	x: number;
	y: number;
	receiver_name: string | number | readonly string[] | undefined;
	receiver_location: string | number | readonly string[] | undefined;
	receiver_email: string | number | readonly string[] | undefined;
	receiver_company_name: string | number | readonly string[] | undefined;
};

export type Deposit = {
	x: number;
	y: number;
	vendorid: String;
	address: String;
};
export type DFProps = {
	DFConfirmPatchDest: React.MutableRefObject<(() => Promise<void> | undefined) | undefined>;
	setConfirmPatchDest: React.Dispatch<React.SetStateAction<boolean>>;
	setDest: (position: google.maps.LatLngLiteral) => void;
	setDestinations: React.Dispatch<React.SetStateAction<Destination[]>>;
	destinations: Destination[];
	recenterMap: (pos: google.maps.LatLngLiteral) => void;
	hiddenDiv: boolean;
};

export type MyDivProps = {
	DFConfirmPatchDest: React.MutableRefObject<(() => Promise<void> | undefined) | undefined>;
	setConfirmPatchDest: React.Dispatch<React.SetStateAction<boolean>>;
	mapRef: React.MutableRefObject<google.maps.Map | undefined>;
	setDestinations: React.Dispatch<React.SetStateAction<Destination[]>>;
	destinations: Destination[];
};

export type addDestinationToDbProps = {
	auxNewDest: Destination;
	DFConfirmPatchDest: React.MutableRefObject<(() => Promise<void> | undefined) | undefined>;
	newDestination: DestinationInput;
	setConfirmPatchDest: React.Dispatch<React.SetStateAction<boolean>>;
};
