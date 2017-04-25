package com.redhat.iot.codestarter.service;

import org.eclipse.kura.core.message.protobuf.KuraPayloadProto;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;

@ApplicationScoped
public class SensorService implements MqttCallback {

    private final String BROKER_URL = "tcp://" + System.getenv("BROKER_HOSTNAME") + ":" + System.getenv("BROKER_PORT");
    private final String BROKER_USERNAME = System.getenv("BROKER_USERNAME");
    private final String BROKER_PASSWORD = System.getenv("BROKER_PASSWORD");
    private final String BROKER_TOPIC_PREFIX = System.getenv("BROKER_TOPIC_PREFIX");
    private final String CLIENT_ID = "demo-client-" + Math.floor(Math.random() * 100000);
    private final MemoryPersistence PERSISTENCE = new MemoryPersistence();
    private MqttClient mqttClient;

    public SensorService() {

    }

    public void init(@Observes @Initialized(ApplicationScoped.class) Object init) {

        connectToBroker();

    }


    private void connectToBroker() {

        try {

            mqttClient = new MqttClient(BROKER_URL, CLIENT_ID, PERSISTENCE);

            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setUserName(BROKER_USERNAME);
            connOpts.setPassword(BROKER_PASSWORD.toCharArray());
            connOpts.setCleanSession(true);
            mqttClient.connect(connOpts);
            System.out.println("Connected");
            mqttClient.setCallback(this);
            mqttClient.subscribe(BROKER_TOPIC_PREFIX + "/+/+");
            System.out.println("Subscribed");
        } catch (Exception me) {
            System.out.println("Could not connect to " + BROKER_URL);
            System.out.println("msg " + me.getMessage());
            System.out.println("loc " + me.getLocalizedMessage());
            System.out.println("cause " + me.getCause());
            System.out.println("excep " + me);
            me.printStackTrace();
        }
    }

    @Override
    public void connectionLost(Throwable throwable) {
        System.out.println("CONNECTION LOST");
        throwable.printStackTrace();
        // attempt to reconnect?
    }

    public void publishMessage(String topic, MqttMessage message) throws MqttException {
        mqttClient.publish(topic, message);
    }

    @Override
    public void messageArrived(String topic, MqttMessage mqttMessage) throws Exception {

        String payload = mqttMessage.toString();

        System.out.println("MESSAGE ARRIVED FOR TOPIC " + topic + " raw payload: " + payload);

        //
        // Decoding Kura payloads using Google protobuf
        //
        KuraPayloadProto.KuraPayload kuraPayload = KuraPayloadProto.KuraPayload.parseFrom(mqttMessage.getPayload());
        for (KuraPayloadProto.KuraPayload.KuraMetric metric : kuraPayload.getMetricList()) {
            System.out.println("Kura metric: name: " + metric.getName() + " double value: " + metric.getDoubleValue());
        }
        //
        // Decoding JSON payloads
        //
        //        JSONObject j = new JSONObject(payload);
        //        for (String k : j.keySet()) {
        //            System.out.println("Key: " + k + " Value: " + j.get(k));
        //        }

    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
        // NOT IMPLEMENTED
    }
}
