import * as firebase from 'firebase';

// upload a given photo with uri to firebase
export function uploadPhoto(uri, uploadUri) {
    return new Promise(async (res, rej) => {
        blob = new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onerror = reject;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(xhr.response);
                }
            };
            xhr.responseType = 'blob'; // convert type
            xhr.open('GET', uri);
            xhr.send();
        });

        // dereference blob and upload
        blob.then(blob_val => {
            console.log(blob_val)
            const ref = firebase.storage().ref(uploadUri);
            const unsubscribe = ref.put(blob_val).on(
                    'state_changed',
                    state => {},
                    err => {
                    unsubscribe();
                    rej(err);
                    console.log("put blob in storage")
                },
                async () => {
                    unsubscribe();
                    const url = await ref.getDownloadURL();
                    res(url);
                },
            );
        });
    });
}

// Create a new tag document for each tag in the uploaded image.
// (or upload the corresponding existing tag document if the document is Already
// in the database)
export function uploadTags(labels, postID) {
    labels.forEach(function(currTag) {
     firebase.firestore().collection("Tags").doc(currTag).get().then(function(doc){
         console.log(currTag)
         postIDList = []
         if (doc.exists) {
             postIDList = doc.data().posts;
             console.log(doc.data())
         }
         postIDList.push(postID)

         firebase.firestore().collection("Tags").doc(currTag).set({
             posts: postIDList,
             tag: currTag,
         })
     })

  })

};
