// exports.getUserPrefs = (request, response) => {
//     prefs = {
//         "console-user-settings": {
//             "topology.preferredView":"latest",
//             "test.checkboxId":"false"
//         }
//     }
//     return response.json(prefs);
// }

const { db } = require('../util/admin');

exports.getUserPrefs = (request, response) => {
	db
		.collection('prefs')
		// .orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let prefs = {
                'console-user-settings': {}
            };
			data.forEach((doc) => {
                console.log(doc.id);
                console.log(doc.data());
                prefs['console-user-settings'][doc.id] = doc.data().value;
			});
			return response.json(prefs);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.getUserPref = (request, response) => {
    const document = db.doc(`/prefs/${request.params.key}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Pref not found' })
            }
            return response.json(doc.data());
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.editUserPref = (request, response) => {
	if (request.body.key.trim() === '') {
		return response.status(400).json({ key: 'Must not be empty' });
    }
    
    if(request.body.value.trim() === '') {
        return response.status(400).json({ value: 'Must not be empty' });
    }

    let document = db.collection('prefs').doc(`${request.body.key}`);

    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ 
                error: err.code 
        });
    });
};