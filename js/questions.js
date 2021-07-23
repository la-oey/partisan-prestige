var demographicClient = {
	politicalParty: "",
	followers: {
		"instagram": 0,
		"twitter": 0,
		"tiktok": 0,
		"linkedin": 0,
		"facebook": 0
	}
}

function submitDemo(){
	demographicClient.politicalParty = $('input[name = "party"]:checked').val();
	demographicClient.followers.instagram = $('#insta').val();
	demographicClient.followers.twitter = $('#twitter').val();
	demographicClient.followers.tiktok = $('#tiktok').val();
	demographicClient.followers.linkedin = $('#linkedin').val();
	demographicClient.followers.facebook = $('#fb').val();

	client.demographic = demographicClient;
	saveData();
}