var products = [1,2,3,4,5,6,32,34,4,5,55,6,6];
var productChunks= [];
var chunkSize = 3;
for(var  i = 0; i<products.length; i += chunkSize){
  var final= productChunks.push(products.slice(i, i+chunkSize));

    console.log(final);

}
