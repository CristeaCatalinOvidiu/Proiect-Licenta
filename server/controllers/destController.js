import { Destination } from "../models/destinationModel.js";

export const patchDestination = async (req, res) => {
	const newDest = req.body;
	const myX = newDest.x;
	const myY = newDest.y;

	await Destination.findOneAndUpdate({ x: myX, y: myY }, newDest)
		.then((updatedDest) => {
			res.status(200).json({
				status: "Destination updated!",
				data: updatedDest,
			});
		})
		.catch((err) => {
			res.status(400).json({
				status: "Error updating old destination!",
				data: err,
			});
		});
};

export const createDestination = async (req, res) => {
	const newDest = req.body;
	const myX = newDest.x;
	const myY = newDest.y;
	const oldDest = await Destination.findOne({
		x: myX,
		y: myY,
	});

	if (oldDest) {
		res.status(200).json({
			status: "Destination already exists!",
		});
	} else {
		await Destination.create(newDest)
			.then((destination) => {
				res.status(200).json({
					status: "Destination created!",
					data: destination,
				});
			})
			.catch((error) => {
				res.status(500).json({
					status: "Error occured during creating new destination!",
					error: error.message,
				});
			});
	}
};

export const deleteDestination = async (req, res) => {
	let myX, myY;
	const body = req.body;
	myX = body.x;
	myY = body.y;

	await Destination.findOneAndDelete(
		{
			x: myX,
			y: myY,
		},
		(err, doc) => {
			if (err)
				res.status(500).json({
					status: "Error deleting destination!",
					data: err,
				});
			else
				res.status(200).json({
					status: "Destination deleted successfully!",
					data: doc,
				});
		}
	).catch((err) => console.log(err));
};

export const deleteDestinations = async (_, res) => {
	await Destination.deleteMany()
		.then((value) => {
			res.status(200).json({
				status: "Successfully deleted destinations!",
				data: value,
			});
		})
		.catch((error) => {
			res.status(500).json({
				status: "Error occured during deleting destinations!",
				error: error.message,
			});
		});
};

export const getDestinations = async (_, res) => {
	const destinations = await Destination.find();

	if (destinations) {
		res.status(200).json({
			status: "Destinations retrieved successfully!",
			body: destinations,
		});
	} else {
		res.status(404).json({
			status: "Destinations not found",
		});
	}
};

export const getDestination = async (req, res) => {
	const destID = req.body.id;

	await Destination.findOne({
		_id: destID,
	})
		.then((dest) => {
			res.status(200).json({
				status: "Destination retrieved successfully!",
				data: dest,
			});
		})
		.catch((err) => {
			res.status(404).json({
				status: "Destination not found",
				err: err,
			});
		});
};
