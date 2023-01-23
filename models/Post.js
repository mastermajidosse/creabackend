import mongoose from 'mongoose';

const updateSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
	images: [
		{
			type: String,
			required: true,
		},
	],
});
const commentSchema = mongoose.Schema({
	comment: {
		type: String,
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
});
const reportSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
	reporter: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	images: [
		{
			type: String,
		},
	],
});
const socialMediaSchema = mongoose.Schema({
	Facebook: {
		type: String,
	},
	Instagram: {
		type: String,
	},
	Twitter: {
		type: String,
	},
});

const postSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		lang: {
			type: Boolean,
			default: 1,
		},
		link: {
			type: String,
			default: '',
		},
		title: {
			en: {
				type: String,
			},
			ar: {
				type: String,
				default: '',
			},
		},
		desc: {
			en: {
				type: String,
			},
			ar: {
				type: String,
				default: '',
			},
		},
		status: {
			type: String,
			default: 'false',
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		images: [
			{
				type: String,
				required: true,
			},
		],
		// collected: {
		// 	type: Number,
		// 	default: false,
		// },
		// deadline: {
		// 	type: Date,
		// 	required: true,
		// },
		updates: [updateSchema],
		likes: {
			type: [String],
			default: [],
		},
		reports: [reportSchema],
		comments: [commentSchema],
		socialMediaLinks: socialMediaSchema,
	},
	{
		timestamps: true,
	},
);

const Post = mongoose.model('posts', postSchema);

export default Post;
