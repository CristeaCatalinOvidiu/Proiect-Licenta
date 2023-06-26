import axios from "axios";
import { addDestinationToDbProps, Deposit, Destination, DestinationInput } from "./TypeDefinitions";

export const createPromise = (DFConfirmPatchDest: React.MutableRefObject<(() => Promise<void> | undefined) | undefined>, newDestination: DestinationInput) => {
	let addDestToLocal = false;

	DFConfirmPatchDest.current = () =>
		new Promise<void>(async (resolve, reject) => {
			await axios
				.patch("/user/destination", {
					x: newDestination.x,
					y: newDestination.y,
					receiver_name: newDestination.receiver_name,
					receiver_email: newDestination.receiver_email,
					receiver_location: newDestination.receiver_location,
					receiver_company_name: newDestination.receiver_company_name,
				})
				.then((res) => {
					addDestToLocal = true;
					resolve(res.data);
				})
				.catch((err) => {
					reject(err);
				});
		});
	return addDestToLocal;
};

export const addDestinationToDb = async (props: addDestinationToDbProps) => {
	const { auxNewDest, DFConfirmPatchDest, newDestination, setConfirmPatchDest } = props;

	let addDestLocally = false;
	try {
		await axios
			.post("/user/destination", {
				x: auxNewDest.x,
				y: auxNewDest.y,
				receiver_name: auxNewDest.receiver_name,
				receiver_email: auxNewDest.receiver_email,
				receiver_location: auxNewDest.receiver_location,
				receiver_company_name: auxNewDest.receiver_company_name,
			})
			.then((response) => {
				if (response.data.status === "Destination already exists!") {
					addDestLocally = createPromise(DFConfirmPatchDest, newDestination);
					setConfirmPatchDest(true);
				} else addDestLocally = true;
			});
	} catch (e) {
		console.log(e);
	}
	return addDestLocally;
};

export const addDepositToDB = async (setDeposits: React.Dispatch<React.SetStateAction<Deposit[]>>, newDep: Deposit) => {
	const result = await axios
		.post("/user/deposit", newDep)
		.then((res) => {
			if (res.data.status === "Deposit already exists!") {
				return 1;
			}
			return 0;
		})
		.catch((e) => {
			console.log(e);
		});
	return result;
};

export const delDestinationFromDB = async ({ x, y }: { x: number; y: number }) => {
	try {
		await axios.delete("/user/destination", {
			data: {
				x: x,
				y: y,
			},
		});
	} catch (err) {
		console.log(err);
	}
};

export const delDepositFromDB = async ({ x, y }: { x: number; y: number }) => {
	try {
		await axios
			.delete("/user/deposit", {
				data: {
					x: x,
					y: y,
				},
			})
			.then((res) => console.log("my res is: ", res));
	} catch (e) {
		console.log(e);
	}
};

export const getDestinationsFromDB = async (setDestinations: (value: React.SetStateAction<Destination[]>) => void) => {
	try {
		await axios.get("/user/destinations").then((response) => {
			setDestinations(response.data.body);
		});
	} catch (e) {
		console.log(e);
	}
};

export const getDepositsFromDB = async (setDeposits: React.Dispatch<React.SetStateAction<Deposit[]>>, filter: boolean, uid: number) => {
	try {
		await axios
			.get(`/user/deposits`, {
				params: {
					filter: filter,
					uid: uid,
				},
			})
			.then((response) => {
				if (response) {
					console.log('huhu')
					console.log(response.data.body)
					setDeposits(response.data.body);
				}
			});
	} catch (e) {
		console.log(e);
	}
};

export const getCountryName = (pos: google.maps.LatLng | google.maps.LatLngLiteral) => {
	var countryCode: string | null = null;

	new google.maps.Geocoder().geocode({ location: pos }, (results, status) => {
		if (status === google.maps.GeocoderStatus.OK) {
			if (results && results[1]) {
				for (var r = 0; r < results.length; r++) {
					var result = results[r];

					if (result.types[0] === "country") {
						countryCode = result.address_components[0].short_name;
						break;
					}
				}
			}
		}
	});
	return countryCode;
};
