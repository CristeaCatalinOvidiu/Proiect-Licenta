import { Deposit } from "../models/depositModel.js";

export const getDeposits = async (req, res) => {
	const { filter, uid } = req.query;


	console.log('mamy')

	console.log(req.query)

	try {
		if (filter === "false") {
			await Deposit.find().then((deposits) => {
				res.status(200).json({
					status: "All deposits retrieved successfully!",
					body: deposits,
				});
			});
		} else {
			await Deposit.find({
				vendorid: uid,
			}).then((deposits) => {
				res.status(200).json({
					status: "Current vendor's deposits retrieved successfully!",
					body: deposits,
				});
			});
		}
	} catch (err) {
		res.status(500).json({
			status: "Error occured when retrieving deposits!",
			err: err.message,
		});
	}
};

export const createDeposit = async (req, res) => {
	const myX = req.body.x;
	const myY = req.body.y;

	const oldDeposit = await Deposit.findOne({
		x: myX,
		y: myY,
	}).catch((err) => {
		res.status(500).json({
			status: "Error occured during creating deposit",
			err,
		});
	});

	if (oldDeposit) {
		res.status(200).json({
			status: "Deposit already exists!",
		});
	} else {
		const newDep = req.body;
		await Deposit.create(newDep)
			.then((deposit) => {
				res.status(200).json({
					status: "Deposit created!",
					data: deposit,
				});
			})
			.catch((err) => {
				res.status(500).json({
					status: "Error occured during creating new deposit!",
					err: err.message,
				});
			});
	}
};

export const deleteDeposit = async (req, res) => {
	let myX, myY;
	const body = req.body;
	myX = body.x;
	myY = body.y;
	console.log("myX: ", myX);
	console.log("myY: ", myY);

	await Deposit.findOneAndDelete(
		{
			x: myX,
			y: myY,
		},
		(err, doc) => {
			if (err)
				res.status(500).json({
					status: "Error deleting deposit!",
					data: err,
				});
			else
				res.status(200).json({
					status: "Deposit deleted successfully!",
					data: doc,
				});
		}
	).catch((err) => console.log("Error at deletion", err));
};
