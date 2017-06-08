function forEach(arr, callback) {
  console.log("YO");
  for (var i = 0; i < arr.length; i++) {
    callback(arr[i]);
  } 
}