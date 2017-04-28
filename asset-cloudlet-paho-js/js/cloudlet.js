var require = function(obj, prop) {
  if (typeof(obj) == 'undefined' || !obj) {
    throw 'configuration cannot be null'
  }
  if (prop && typeof(obj[prop]) == 'undefined' || !obj[prop]) {
    throw 'missing required property: ' + prop
  }
}

var Cloudlet = function(config) {
  require(config, 'hostname')
  require(config, 'username')
  require(config, 'password')
  require(config, 'clientId')
  require(config, 'namespace')
  config.port = config.port || 80
  config.timeout = config.timeout || 10*1000

  this.config = config
  this.clientId = 'paho-cloudlet-client-' + Math.floor(Math.random() * 90000000)

  this.messageCallbacks = {}
  var self = this
  this.client = new Paho.MQTT.Client(config.hostname, config.port, '/broker/', this.clientId)
  this.client.onMessageDelivered = function (message) {
    if (typeof (message.callback) !== 'undefined') {
      message.callback()
    }
  }
  this.client.onMessageArrived = function (message) {
    var requestId = message.destinationName.split('/')
    requestId = requestId[requestId.length-1]
    var callbacks = self.messageCallbacks[requestId]
    if (!callbacks) {
      console.log('no callbacks for: ' + requestId)
      return
    }
    try {
      clearInterval(callbacks.timeout)
      self.messageCallbacks[requestId] = undefined
      var bytes = message.payloadBytes
      if (bytes[0] == 31 && bytes[1] == 139 && bytes[2] == 8 && bytes[3] == 0) {
        bytes = pako.inflate(bytes)
      }
      var decoded = KuraPayload.decode(bytes)
      callbacks.resolve(decoded)
    } catch (err) {
      callbacks.reject(err)
    }
  }
}

Cloudlet.prototype.connect = function () {
  var self = this
  return new Promise(function(resolve, reject) {
    self.client.connect({
      timeout: 30,
      userName: self.config.username,
      password: self.config.password,
      useSSL: false,
      onSuccess: function () {
        resolve()
      },
      onFailure: function (context, errorCode, errorMessage) {
        reject(errorMessage)
      }
    })
  }).then(function () {
    return new Promise(function (resolve, reject) {
      var subscriptionTopic = '$EDC/' + self.config.username + '/' + self.clientId + '/' + self.config.namespace + '/REPLY/#'
      self.client.subscribe(subscriptionTopic, {
        qos: 1,
        onSuccess: function () {
          resolve()
        },
        onFailure: function (context, errorCode, errorMessage) {
          reject(errorMessage)
        }
      })
    })
  })
}

Cloudlet.prototype.runRequest = function(path, payload) {
  var self = this
  return new Promise(function(resolve, reject) {
    var requestId = self.clientId + '-' + new Date().getTime()
    var protobufPayload = KuraPayload.encode({
      metric: [
        {
          name: 'requester.client.id',
          type: payloadType.KuraMetric.ValueType.STRING,
          stringValue: self.clientId
        },
        {
          name: 'request.id',
          type: payloadType.KuraMetric.ValueType.STRING,
          stringValue: requestId
        }
      ],
      body: payload
         ? new TextEncoder('utf-8').encode(JSON.stringify(payload))
         : undefined
       })
    var message = new Paho.MQTT.Message(protobufPayload)
    message.destinationName = '$EDC/' + self.config.username + '/' + self.config.clientId + '/' + self.config.namespace + '/' + path
    self.messageCallbacks[requestId] = {
      resolve: resolve,
      reject: reject,
      timeout: setTimeout(function () {
        reject('timed out')
        delete self.messageCallbacks[requestId]
      }, self.config.timeout)
    }
    self.client.send(message)
  })
}
