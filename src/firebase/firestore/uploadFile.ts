import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytes,
} from 'firebase/storage';

export const uploadImage = async (
	imageFile: File | null,
	name: string,
	folderName: string,
) => {
	try {
		const storage = getStorage();
		const imageRef = ref(
			storage,
			`${folderName}/${name}'s-Image`,
		);
		const snapShot = await uploadBytes(imageRef, imageFile!);

		const imageURL = await getDownloadURL(snapShot.ref);

		return imageURL;
	} catch (e: any) {
		throw new Error(
			'Something went wrong, please try again later',
		);
	}
};
