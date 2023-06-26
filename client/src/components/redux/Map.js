import { useLoadScript } from "@react-google-maps/api";
import { AdminGoogleMap } from "../page_components/AdminGoogleMap.tsx";
import { useSelector } from "react-redux";
import { VendorGoogleMap } from "../page_components/VendorGoogleMap.tsx";
import { useParams } from "react-router-dom";

function Map() {
	// state.auth.user._id -> vendor id when logged in as a vendor
	const auth = useSelector((state) => state.auth);
	const {tid, destid} = useParams()

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
		libraries: ["places"],
	});

	if (!isLoaded) return <div>Loading...</div>;

	if (auth.isAdmin) return <AdminGoogleMap id={{tid, destid}}/>;
	return <VendorGoogleMap />;
}

export default Map;
