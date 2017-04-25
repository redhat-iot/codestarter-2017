NodeJS Quickstart for Red Hat / Eurotech IoT Codestarter
--------------------------------------------------------

To get started, first clone this repo:

```
cd $HOME
git clone https://github.com/redhat-iot/codestarter-2017
```

* To test locally:

```
cd $HOME/codestarter-2017/js
npm install
npm start
```
Access app using `http://localhost:8080`

* To build and deploy on OpenShift:

```
cd $HOME/codestarter-2017/js
oc login
oc new-project iotdemo
oc new-build --name dashboard --image nodejs:4 --strategy source --binary
oc start-build dashboard --from-dir=. --follow
oc new-app dashboard
oc expose service dashboard
```

* To re-build and re-deploy after making changes:

```
cd $HOME/codestarter-2017/js
oc start-build dashboard --from-dir=. --follow
```
