const dbHelper = { 
    writeLocationData : async (name, country, region, settlement, street, house, images, latitude, longtitude, site, description) => {
        var locationsRef = firebase.database().ref('locations/');
        var newLocationRef = locationsRef.push();
        var storageRef = firebase.storage().ref();
        for (let i=0; i < images.length; i++) {
            await storageRef.child(`images/${newLocationRef.key}/${images[i].name}`).put(images[i]).then(function(snapshot) {
              console.log('Added a file!');
            });
        }
        
        newLocationRef.set({
          name: name,
          country: country,
          region : region,
          settlement : settlement,
          street : street,
          house : house,
          latitude : latitude,
          longtitude : longtitude,
          site : site,
          description : description,
          rating : 2.5,
          views : 0,
          votes : 1,
          user: firebase.auth().currentUser.uid
        });
        return newLocationRef;
      }
    , updateLocationData : (name, country, region, settlement, street, house, images, latitude, longtitude, site, description, key) => {
      var storageRef = firebase.storage().ref();
      for (let i=0; i < images.length; i++) {
          storageRef.child(`images/${key}/${images[i].name}`).put(images[i]).then(function(snapshot) {
            console.log('Added a file!');
          });
      }
      var locationsRef = firebase.database().ref('locations/'+ key);
      locationsRef.update({
        name: name,
        country: country,
        region : region,
        settlement : settlement,
        street : street,
        house : house,
        latitude : latitude,
        longtitude : longtitude,
        site : site,
        description : description
      });
    }
    , writeUserRated : async (location, rating) => {
      const uid = firebase.auth().currentUser.uid;
      var wasLocationRatedByCurrentUser = false;
      var locationSnapshot = null;
      await firebase.database().ref('rated_by_user/' + uid + '/' + location).once('value', function(snapshot) {
        locationSnapshot = snapshot.val();
        if (locationSnapshot) 
          wasLocationRatedByCurrentUser = true;
      });
      
      const userRef = firebase.database().ref('rated_by_user/'+ uid + '/' + location);
      if (wasLocationRatedByCurrentUser == false)
      {  
        userRef.set({
          user: uid,
          location: location,
          rating: rating
        });
        const locationRef = firebase.database().ref('locations/'+ location + '/');
        var old_rating = 0, votes = 0;
        await locationRef.once('value', function(snapshot) {
          votes = snapshot.val().votes;
          old_rating = snapshot.val().rating * votes;
        });
        locationRef.update({
          rating: (old_rating + rating) / (votes + 1),
          votes : votes + 1
        })
      }
      else
        return undefined;
      return uid;
    }
    , getRatingById : async (id) => {
      var rating = 0;
      await firebase.database().ref('locations/'+ id + '/').once('value', function(snapshot) {
        snapshot = snapshot.val();
        rating = snapshot.rating;
      });
      return rating.toString();
    }
    , getVotesById : async (id) => {
      var votes = 0;
      await firebase.database().ref('locations/'+ id + '/').once('value', function(snapshot) {
        votes = snapshot.val().votes;
      });
      return votes.toString();
    }
    , getObjectById : async (id) => {
      var locationObj = null;
      const locationRef = firebase.database().ref('locations/' + id);
      await locationRef.once('value', function(snapshot) {
          locationObj = snapshot.val();
        });
      return locationObj;
    }
    , removeById :  async (id) => {
      firebase.database().ref('locations/' + id).remove();
      var storageRef = firebase.storage().ref();
      var listRef = storageRef.child(`images/${id}`);
      await listRef.listAll().then(function(res) {
        res.items.forEach(function(itemRef) {
          itemRef.delete();
        });
      }).catch(function(error) {
        console.log(error.message);
      });
    }
    , getTopRated : async (number) => {
      var topList = new Array();
      const topUserPostsRef = firebase.database().ref('locations/').orderByChild('rating').limitToFirst(number);
      await topUserPostsRef.once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            topList.push(childSnapshot.val());
            topList[topList.length-1].key = childSnapshot.key;
          });
        });
      return topList;
    }
    , getClosest : async (number, lat, lng) => {
      var topList = new Array();
      const topUserPostsRef = firebase.database().ref('locations/').orderByChild('rating');
      await topUserPostsRef.once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            topList.push(childSnapshot.val());
            topList[topList.length-1].key = childSnapshot.key;
          });
        });
      topList.sort((a,b) => {
        return Math.sqrt((Number(a.latitude) - lat) * (Number(a.latitude) - lat) + (Number(a.longtitude) - lng) * (Number(a.longtitude) - lng))
        - Math.sqrt((Number(b.latitude) - lat) * (Number(b.latitude) - lat) + (Number(b.longtitude) - lng) * (Number(b.longtitude) - lng));
      });
      return topList.slice(0, number);
    }
    , getImageByLocationId: async (id) => {
      var storageRef = firebase.storage().ref();
      var listRef = storageRef.child(`images/${id}`);
      var fileList = Array();
      await listRef.listAll().then(function(res) {
        res.items.forEach(function(itemRef) {
          fileList.push(itemRef);
        });
      }).catch(function(error) {
        console.log(error.message);
      });
      return fileList;
    }
    , getTheDownloadURL: async (path) => {
      var storageRef = firebase.storage().ref();
      var output_url;
      await storageRef.child(path).getDownloadURL().then(function(url) {
        output_url = url;
      }).catch(function(error) {
        console.log(error.message);
      });
      return output_url;
    }
}

export default dbHelper;