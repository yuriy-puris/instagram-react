const handleImageUpload = async (image, uploadPreset='instagram') => {
	const data = new FormData();
	data.append('file', image);
	data.append('upload_preset', uploadPreset);
	data.append('cloud_name', 'dj6hdoxkh');
	const response = await fetch('https://api.cloudinary.com/v1_1/dj6hdoxkh/image/upload', {
		method: 'POST',
		accept: 'application/json',
		body: data
	});
	const responseJSON = await response.json();
	return responseJSON.url;
};	

export default handleImageUpload;