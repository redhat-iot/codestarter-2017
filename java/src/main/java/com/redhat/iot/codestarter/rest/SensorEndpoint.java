package com.redhat.iot.codestarter.rest;

import java.io.Serializable;
import java.net.URI;
import java.net.URLEncoder;
import java.util.Date;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;

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
    public Response publish(@FormParam("topic") String topic, @FormParam("message") String message) throws Exception {

        System.out.println("Publishing to topic [" + topic + "] message: " + message);
        MqttMessage msg = new MqttMessage(message.getBytes());
        msg.setQos(0);
        ss.publishMessage(topic, msg);
        URI location = new URI("../index.jsp?status=" + URLEncoder.encode("Published at " + new Date()));
        return Response.temporaryRedirect(location).build();
    }

}
