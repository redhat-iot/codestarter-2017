var getStatus = function (msg) {
  var metrics = msg.metric
  if (!metrics) {
    throw 'no metrics in response'
  }
  var result = 500
  metrics.forEach(function (metric) {
    if (metric.name = 'response.code') {
      result = metric.intValue
    }
  })
  return result
}

var processResponse = function (msg) {
  try {
    var status = getStatus(msg)
    if (status !== 200) {
      return Promise.reject('got status: ' + status)
    }
    if (!msg.body) {
      return Promise.reject('response body is null')
    }
    var jsonString = new TextDecoder('utf-8').decode(msg.body)
    return Promise.resolve(JSON.parse(jsonString))
  } catch (err) {
    return Promise.reject(err)
  }
}

var AssetCloudlet = function(config) {
  config.namespace = 'ASSET-V1'
  this.cloudlet = new Cloudlet(config)
}

AssetCloudlet.prototype.connect = function () {
  return this.cloudlet.connect()
}

AssetCloudlet.prototype.getAssetMetadata = function (body) {
  return this.cloudlet.runRequest('GET/assets', body)
  .then(function (msg) {
    return processResponse(msg)
  })
}

AssetCloudlet.prototype.write = function (body) {
  return this.cloudlet.runRequest('EXEC/write', body)
  .then(function (msg) {
    return processResponse(msg)
  })
}

AssetCloudlet.prototype.read = function (body) {
  return this.cloudlet.runRequest('EXEC/read', body)
  .then(function (msg) {
    return processResponse(msg)
  })
}
