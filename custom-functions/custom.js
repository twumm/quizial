const _ = require('underscore')

exports.containsObject = (object, list) => {
  let result = _.find(list, value => { return _.isEqual(object, value)})
  console.log(_.isObject(result))
  return (_.isObject(result)) ? true:false
}
