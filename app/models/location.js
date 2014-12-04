module.exports.location = {
  veto: function(foodOrRest, value) {
    if (foodOrRestaurant === 'food') {
      console.log('vetoing food: ', value);
    } else if (foodOrRestaurant === 'rest') {
      console.log('vetoing restaurant: ', value)
    } else {
      console.error('error: invalid argument')
    }
  }
};
