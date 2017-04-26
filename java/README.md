Java Quickstart for Red Hat / Eurotech IoT Codestarter
------------------------------------------------------

To get started, first clone this repo:

```
cd $HOME
git clone https://github.com/redhat-iot/codestarter-2017
```

* To build and deploy on OpenShift:

```
cd $HOME/codestarter-2017/java
oc login
oc new-project iotdemo
oc new-build --name dashboard --image wildfly:10.1 --strategy source --binary
oc start-build dashboard --from-dir=. --follow
oc new-app dashboard -e BROKER_HOSTNAME=<broker_host> -e BROKER_PORT=1883 -e BROKER_USERNAME=<username> -e BROKER_PASSWORD=<password -e BROKER_TOPIC_PREFIX=<topic_prefix>
oc expose service dashboard
```

To re-build and re-deploy:

```
cd $HOME/codestarter-2017/java
oc start-build dashboard --from-dir=. --follow
```
