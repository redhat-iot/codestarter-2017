package com.redhat.iot.codestarter.rest;

import java.io.Serializable;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;

import com.redhat.iot.codestarter.service.SensorService;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

@ApplicationScoped
@Path("/iot")
public class SensorEndpoint implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = -7227732980791688773L;

    @Inject
    private SensorService ss;


    @POST
    @Path("/publish")
    public String publish(@FormParam("topic") String topic, @FormParam("message") String message) throws MqttException {

        System.out.println("Publishing to topic [" + topic + "] message: " + message);
        MqttMessage msg = new MqttMessage();
        msg.setPayload(message.getBytes());
        ss.publishMessage(topic, msg);
        return "published";
    }

}
