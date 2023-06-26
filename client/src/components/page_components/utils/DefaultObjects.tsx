import { Deposit, Destination } from "./TypeDefinitions";

export const defaultDest: Destination = {
	x: 0,
	y: 0,
	receiver_name: "",
	receiver_company_name: "",
	receiver_email: "",
	receiver_location: "",
};

export const defaultDeposit: Deposit = {
	x: 0,
	y: 0,
	vendorid: "",
	address: "",
};

export const defaultDestinationInput = {
	x: 0,
	y: 0,
	receiver_name: "",
	receiver_location: "",
	receiver_email: "",
	receiver_company_name: "",
};

export const initialComboboxStyle = {
	display: "none",
};

export const initialHeaderOneStyle = {
	fontSize: "1rem",
};
export const initialAddDestinationStyle = {
	position: "absolute",
	height: "3rem",
	width: "12rem",
	backgroundColor: "white",
	color: "black",
	textAlign: "center",
	left: "0.3rem",
	top: "0.3rem",
	borderRadius: "0.3rem",
	opacity: "0.75",
	zIndex: "2",

	borderStyle: "solid",
	borderColor: "rgb(10, 10, 165)",
	borderWidth: "0.1rem",

	transition: "all 0.5s",
	transitionDelay: "0.2s",
};
export const addDestinationNotHiddenStyle = {
	height: "30rem",
	width: "20rem",
	left: "0.3rem",
	top: "0.3rem",
	transition: "all 0.5s",
	transitionDelay: "0.2s",
	backgroundColor: "white",
	borderStyle: "solid",
	borderColor: "rgb(10, 10, 165)",
	borderWidth: "0.1rem",
	position: "absolute",
	zIndex: "3",
};
