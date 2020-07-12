export const snapshotToArray = snapshot => {
  let returnArr = [];
  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;

    returnArr.push(item);
  });
  return returnArr;
};

export const mapSnapshotToArray = (snapshot, child) => {
  let returnArr = [];
  snapshot.forEach(childSnapshot => {
    let item = {};
    item[childSnapshot.key] = childSnapshot.val()[child];

    returnArr.push(item);
  });
  return returnArr;
};
