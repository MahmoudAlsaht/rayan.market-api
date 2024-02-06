import { getStorage, ref, deleteObject } from 'firebase/storage';

export const deleteImage = async (filename: string) => {
	try {
		const storage = getStorage();

		// Create a reference to the file to delete
		const desertRef = ref(storage, filename);

		// Delete the file
		await deleteObject(desertRef);
	} catch (e: any) {
		console.log(e.message);
		throw new Error(
			'Something went wrong, please try again later',
		);
	}
};
