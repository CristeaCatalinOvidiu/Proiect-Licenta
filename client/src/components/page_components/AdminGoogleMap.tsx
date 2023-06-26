import { GoogleMap, Marker, DirectionsRenderer, Circle, MarkerClusterer } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import { Fragment } from "react";
import { useEffect } from "react";

import Distance from "./Distance";
import Places from "./Places";
import DestinationForm from "./DestinationForm";
import { Destination, Deposit, DirectionsResult, LatLngLiteral, MapOptions, MyDivProps } from "./utils/TypeDefinitions";
import destIcon from "../utils/img/home_icon_orange.png";
import depositIcon from "../utils/img/home_icon_purple.png";
import truckIcon from "../utils/img/truck_marker_black.png";
import { addDestinationNotHiddenStyle, defaultDeposit, defaultDest, initialAddDestinationStyle, initialHeaderOneStyle } from "./utils/DefaultObjects";
import { delDestinationFromDB, getCountryName, getDestinationsFromDB, getDepositsFromDB } from "./utils/Functions";
import { useGlobalContext } from "../context/Context";
import { useSelector } from "react-redux";
import axios from "axios";

export function AdminGoogleMap(id: any) {
	const [source, setSource] = useState<LatLngLiteral>();
	const [directions, setDirections] = useState<DirectionsResult>();
	const [destinations, setDestinations] = useState<Destination[]>([defaultDest]);
	const [deposits, setDeposits] = useState<Deposit[]>([]);
	const [currdest, setCurrdest] = useState<string[]>([])

	const [confirmPatchDest, setConfirmPatchDest] = useState(false);
	const [confirmDelDest, setConfirmDelDest] = useState(false);
	const [selectedDestXY, setSelectedDestXY] = useState<{
		x: number;
		y: number;
	}>();


		const auth = useSelector((state: any) => state.auth);
		const token = useSelector((state: any) => state.token);

	
	console.log(id)

	const {truck}  = useGlobalContext()
	console.log('here')
	
	
const getdelivery = async() =>
 {
	for (let [key, value] of truck) {
		if(key.startsWith(id.id.tid)) {
			let newArr = key.split("%")
			const deposit =  await axios.get(`/user/getdepositfromid/${newArr[1]}`)
            console.log('comand2')
			console.log(deposit.data)
		}
	}
}

useEffect(() => {
getdelivery()
}, [])

	

	

	const mapRef = useRef<google.maps.Map>();
	const center = useMemo<LatLngLiteral>(() => {
		return { lat: 48.5, lng: 31 };
	}, [mapRef]);
	const DFConfirmPatchDest = useRef<() => Promise<void> | undefined>();

	const mapOptions = useMemo<MapOptions>(
		() => ({
			mapId: "4a966fcc54321bbd",
			disableDefaultUI: true,
			// clickableIcons: false
		}),
		[]
	);

	const onLoad = useCallback((map: google.maps.Map) => {
		return new Promise<void>(() => {
			mapRef.current = map;
		});
	}, []);

	useEffect(() => {
		try {
			getDestinationsFromDB(setDestinations);
			getDepositsFromDB(setDeposits, false, 0);
		} catch (err) {
			console.log(err);
		}
	}, []);

	const fetchDirections = (dirDestination: google.maps.LatLngLiteral | google.maps.LatLng) => {



		if (!source) return;

		

		const service = new google.maps.DirectionsService();
		
		service.route(
			{
				origin: source,
				destination: dirDestination,
				travelMode: google.maps.TravelMode.DRIVING,
			},
			(result, status) => {
				//`console.log('caca1')
				console.log(result)
				if (status === "OK" && result) {
					setDirections(result);
				}
			}
		);
	};

	const fetchDirectionslive = (dirSource: google.maps.LatLngLiteral | google.maps.LatLng, dirDestination: google.maps.LatLngLiteral | google.maps.LatLng) => {



		

		const service = new google.maps.DirectionsService();
		
		service.route(
			{
				origin: dirSource,
				destination: dirDestination,
				travelMode: google.maps.TravelMode.DRIVING,
			},
			(result, status) => {

				//console.log('caca')
				console.log(result)
				if (status === "OK" && result) {
					setDirections(result);
				}
			}
		);
	};


	const dirSource = new google.maps.LatLng(45.69647450000001, 27.184043);


    const dirDestination = new google.maps.LatLng(50.4501, 30.5234);

	fetchDirectionslive(dirSource, dirDestination)




	return (
		
		<div>
			{confirmPatchDest && <PatchDestConfirmBox />}
			{confirmDelDest && <DelDestConfirmBox />}
			<div className="container">
				<div className="controls">
					<h2>Where from?</h2>
					<Places
						setSource={(position) => {
							setSource(position);
							mapRef.current?.panTo(position);
						}}
					/>
					{!source && <p className="hint-enter-address">Enter your address.</p>}
					{directions && <Distance leg={directions.routes[0].legs[0]} />}
				</div>
				<div className="map">
					<MyDiv DFConfirmPatchDest={DFConfirmPatchDest} setConfirmPatchDest={setConfirmPatchDest} mapRef={mapRef} setDestinations={setDestinations} destinations={destinations} />
					<GoogleMap zoom={6} center={center} mapContainerClassName="map-container" options={mapOptions} onLoad={onLoad}>
						{directions && <DirectionsRenderer directions={directions} options={dirRendererOptions} />}

						<MarkerClusterer>
							{(clusterer) => (
								<Fragment>
									{deposits && (
										<Fragment>
											{deposits.map((deposit) => {
												let posConverted: google.maps.LatLng | google.maps.LatLngLiteral = { lat: 0, lng: 0 };
												posConverted.lat = deposit.x;
												posConverted.lng = deposit.y;
												return <Marker key={deposit.x.toString() + deposit.y.toString()} position={posConverted} clusterer={clusterer} icon={depositIcon} onClick={() => {}} />;
											})}
										</Fragment>
									)}
									{destinations && (
										<Fragment>
											{destinations.map((dest) => {
												let posConverted: google.maps.LatLng | google.maps.LatLngLiteral = { lat: 0, lng: 0 };
												posConverted.lat = dest.x;
												posConverted.lng = dest.y;
												return (
													<Marker
														key={dest.x.toString() + dest.y.toString()}
														position={posConverted}
														clusterer={clusterer}
														icon={destIcon}
														onClick={() => {
															getCountryName(posConverted);
															fetchDirections(posConverted);
															setSelectedDestXY({ x: dest.x, y: dest.y });
															setConfirmDelDest(true);
														}}
													/>
												);
											})}
											{source && <Marker position={source} />}
										</Fragment>
									)}
									{directions && (
										<Fragment>
											{directions.routes[0].overview_path.map((point) => {
												return <Marker key={point.toString()} position={point} clusterer={clusterer} />;
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

	function DelDestConfirmBox() {
		let destinationLocation: String = "";
		let destinationReceiverName: String = "";

		if (selectedDestXY && destinations) {
			const destAux = destinations.find((dest) => dest.x === selectedDestXY.x && dest.y === selectedDestXY.y);
			if (destAux) {
				destinationLocation = destAux.receiver_location;
				destinationReceiverName = destAux.receiver_name;
			}
		}

		return (
			<div className="confirmBoxWrapper">
				<div>
					<h3 id="third">
						Selected deposit location: {destinationLocation}
						<br />
						Receiver name: {destinationReceiverName}
					</h3>
					<h3 id="first">Do you want to delete this destination?</h3>
					<div className="buttons">
						<button
							onClick={async () => {
								if (selectedDestXY) {
									try {
										await delDestinationFromDB({
											x: selectedDestXY.x,
											y: selectedDestXY.y,
										}).then((_) => {
											setDestinations(destinations.filter((dest) => dest.x !== selectedDestXY.x && dest.y !== selectedDestXY.y));
										});
									} catch (err) {
										console.log(err);
									}
								}
								setConfirmDelDest(false);
							}}
						>
							OK
						</button>
						<button onClick={() => setConfirmDelDest(false)}>Cancel</button>
					</div>
				</div>
			</div>
		);
	}

	function PatchDestConfirmBox() {
		return (
			<div className="confirmBoxWrapper">
				<div>
					<h3 id="first">There is already a deposit with same coordinates..</h3>
					<h3 id="second">Do you want to update the existing one?</h3>
					<div className="buttons">
						<button
							onClick={() => {
								if (DFConfirmPatchDest.current) {
									DFConfirmPatchDest.current()?.then((_) => {
										setConfirmPatchDest(false);
									});
								}
							}}
						>
							OK
						</button>
						<button onClick={() => setConfirmPatchDest(false)}>Cancel</button>
					</div>
				</div>
			</div>
		);
	}
}

function MyDiv(props: MyDivProps) {
	const { DFConfirmPatchDest, mapRef, setDestinations, destinations } = props;
	const [hiddenDiv, setHiddenDiv] = useState(true);
	let addDestinationStyle: any = initialAddDestinationStyle;
	let headerOneStyle: any = initialHeaderOneStyle;

	useMemo(() => {
		if (hiddenDiv) {
			headerOneStyle = {
				fontSize: "1rem",
			};
			addDestinationStyle = initialAddDestinationStyle;
		} else {
			headerOneStyle = {
				display: "none",
			};
			addDestinationStyle = addDestinationNotHiddenStyle;
		}
	}, [hiddenDiv]);

	function handleMouseEnter() {
		if (hiddenDiv) {
			setHiddenDiv(false);
		}
	}

	function handleMouseLeave() {
		if (!hiddenDiv) {
			setHiddenDiv(true);
		}
	}

	return (
		<div style={addDestinationStyle} onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
			<h1 style={headerOneStyle}>
				Add destination
				<br />
				(Ukraine)
			</h1>
			<div>
				<DestinationForm
					DFConfirmPatchDest={DFConfirmPatchDest}
					setConfirmPatchDest={props.setConfirmPatchDest}
					setDest={(newPos) => {
						mapRef.current?.panTo(newPos);
					}}
					setDestinations={setDestinations}
					destinations={destinations}
					recenterMap={(pos) => {
						mapRef.current?.panTo(pos);
					}}
					hiddenDiv={hiddenDiv}
				/>
			</div>
		</div>
	);
}

const dirRendererOptions: google.maps.DirectionsRendererOptions = {
	polylineOptions: {
		zIndex: 50,
		strokeColor: "#1976D2",
		strokeWeight: 5,
	},
};
