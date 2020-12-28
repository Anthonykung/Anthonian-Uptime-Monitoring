module.exports = function (size) {
  var result;
  var upperchar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var lowerchar = 'abcdefghijklmnopqrstuvwxyz';
  var num = '0123456789';
  var uppernum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = uppernum.length;
  for (let i = 0; i < size; i++) {
    result += uppernum.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}