import { GoogleMap, MarkerClusterer, Marker } from "@react-google-maps/api";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Places from "./Places";
import { Deposit, LatLngLiteral, MapOptions } from "./utils/TypeDefinitions";
import depositIcon from "../utils/img/home_icon_purple.png";
import { addDepositToDB, delDepositFromDB, getDepositsFromDB } from "./utils/Functions";
import { useSelector } from "react-redux";
import axios from "axios";

export function VendorGoogleMap() {
	const [source, setSource] = useState<LatLngLiteral>();
	const [deposits, setDeposits] = useState<Deposit[]>([]);
	const [depositConfirmDelBox, setDepositConfirmDelBox] = useState<boolean>(false);
	const [depositNameBox, setDepositNameBox] = useState<boolean>(false);

	const [selectedDepositName, setSelectedDepositName] = useState<string>();
	const [saveDepNameAs, setSaveDepNameAs] = useState<string>("");
	const [depAlreadyExistsStyle, setDepAlreadyExistsStyle] = useState("none");
	const [caretPosIndex, setCaretPosIndex] = useState(0);

	const inputElement = useRef<HTMLInputElement | null>();

	const [selectedDepXY, setSelectedDepXY] = useState<{
		x: number;
		y: number;
	}>();

	const mapRef = useRef<google.maps.Map>();
	const center = useMemo<LatLngLiteral>(() => {
		return { lat: 48.5, lng: 31 };
	}, [mapRef]);

	const auth = useSelector((state: any) => state.auth);
	const uid = auth.user._id;

	const onLoad = useCallback((map: google.maps.Map) => {
		return new Promise<void>(() => {
			mapRef.current = map;
		});
	}, []);

	const mapOptions = useMemo<MapOptions>(
		() => ({
			mapId: "4a966fcc54321bbd",
			disableDefaultUI: true,
		}),
		[]
	);

	useEffect(() => {
		try {
			getDepositsFromDB(setDeposits, true, uid);
		} catch (err) {
			console.log(err);
		}
	}, []);

	useEffect(() => {
		if (depositNameBox) {
			inputElement.current?.focus();
			inputElement.current?.setSelectionRange(caretPosIndex, caretPosIndex);
		}
	});

	function NameDepositBox() {
		return (
			<div className="confirmBoxWrapper">
				<div style={{ height: "14rem" }}>
					<h3>Selected deposit location: {selectedDepositName} </h3>
					<h3 style={{ fontStyle: "italic", color: "blue" }}>Save deposit location name as:</h3>
					<div id="depositLocName">
						<input
							ref={(el) => (inputElement.current = el)}
							minLength={1}
							maxLength={100}
							value={saveDepNameAs}
							onChange={(val) => {
								setCaretPosIndex(val.target.selectionStart || 0);
								setSaveDepNameAs(val.target.value);
							}}
							alt="Deposit location name.."
						></input>
					</div>
					<h5 id="depAlreadyExists" style={{ display: depAlreadyExistsStyle }}>
						Destination already exists!
					</h5>
					<div className="buttons">
						<button
							onClick={async () => {
								if (source) {
									const newDep: Deposit = {
										x: source.lat,
										y: source.lng,
										vendorid: uid,
										address: saveDepNameAs,
									};
									await addDepositToDB(setDeposits, newDep)
										.then((status) => {
											if (status === 0) {
												if (deposits.length > 0) setDeposits([...deposits, newDep]);
												else setDeposits([newDep]);
											} else if (status === 1) {
												setDepAlreadyExistsStyle("block");
												setTimeout(() => {}, 3000);
											}
										})
										.catch((err) => console.log(err))
										.finally(() => {
											setDepositNameBox(false);
											setSaveDepNameAs("");
										});
								}
							}}
						>
							OK
						</button>
						<button
							onClick={() => {
								setDepositNameBox(false);
								setSaveDepNameAs("");
							}}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		);
	}

	function DelDepConfirmBox() {
		let depositLocation: String = "";

		if (selectedDepXY && deposits) {
			const depAux = deposits.find((dep) => dep.x === selectedDepXY.x && dep.y === selectedDepXY.y);
			if (depAux) depositLocation = depAux.address;
		}

		return (
			<div className="confirmBoxWrapper">
				<div>
					<h3 id="third">Selected deposit location: {depositLocation}</h3>
					<h3 id="first">Do you want to delete this deposit?</h3>
					<div className="buttons">
						<button
							onClick={async () => {
								if (selectedDepXY) {
									await delDepositFromDB({ x: selectedDepXY.x, y: selectedDepXY.y }).then(() => {
										setDeposits(deposits.filter((dep) => dep.x !== selectedDepXY.x && dep.y !== selectedDepXY.y));
										setDepositConfirmDelBox(false);
									});
								}
							}}
						>
							OK
						</button>
						<button
							onClick={() => {
								setDepositConfirmDelBox(false);
							}}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			{depositConfirmDelBox && <DelDepConfirmBox />}
			{depositNameBox && <NameDepositBox />}
			<div className="container">
				<div className="controls">
					<h2>Where to?</h2>
					<Places
						setSource={(position) => {
							setSource(position);
							mapRef.current?.panTo(position);
						}}
					/>

					{!source && <p className="hint-enter-address">Enter your address.</p>}
					{source && (
						<div className="addDeposit">
							<button
								onClick={async () => {
									await getSelectedDepositName(source, setSelectedDepositName)
										.then((_) => {
											setDepositNameBox(true);
										})
										.catch((err) => console.log(err));
								}}
							>
								<h3>Add Deposit</h3>
							</button>
						</div>
					)}
				</div>
				<div className="map">
					<GoogleMap zoom={6} center={center} mapContainerClassName="map-container" options={mapOptions} onLoad={onLoad}>
						{source && <Marker position={source} />}
						<MarkerClusterer>
							{(clusterer) => (
								<Fragment>
									{deposits && (
										<Fragment>
											{deposits.map((deposit) => {
												let posConverted: google.maps.LatLng | google.maps.LatLngLiteral = { lat: 0, lng: 0 };
												posConverted.lat = deposit.x;
												posConverted.lng = deposit.y;
												return (
													<Marker
														key={deposit.x.toString() + deposit.y.toString()}
														position={posConverted}
														clusterer={clusterer}
														icon={depositIcon}
														onClick={() => {
															setSelectedDepXY({
																x: deposit.x,
																y: deposit.y,
															});
															setDepositConfirmDelBox(true);
														}}
													/>
												);
											})}
										</Fragment>
									)}
								</Fragment>
							)}
						</MarkerClusterer>
					</GoogleMap>
				</div>
				<div className="map-padding" />
			</div>
			<div className="map-footer" />
		</div>
	);
}

async function getSelectedDepositName(source: google.maps.LatLngLiteral, setSelectedDepositName: React.Dispatch<React.SetStateAction<string | undefined>>) {
	var latlng,
		depositName: string = "";

	if (!source) return "";
	latlng = new google.maps.LatLng({ lat: source.lat, lng: source.lng });

	var geocoder = new google.maps.Geocoder();

	return await geocoder.geocode({ location: latlng }, (results, status) => {
		if (status === google.maps.GeocoderStatus.OK) {
			if (status == google.maps.GeocoderStatus.OK && results) {
				depositName = results[0].formatted_address;
				setSelectedDepositName(depositName);
			}
		}
	});
}
