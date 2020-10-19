#DevOps Assignment 
This is a sample project regarding the DevOps assignment, I'll suppose that we have the Kubernetes cluster up and running. 

##Create a [installation instructions For Knative Serving](https://knative.dev/docs/serving/samples/hello-world/helloworld-python/) service:
This app needs Kubernetes with knative serving, and Docker installed.
[installation instructions For Knative Serving](https://knative.dev/docs/install/any-kubernetes-cluster/#installing-the-serving-component)

To Test the app you can use:
`kubectl get ksvc` to see the URL of the service
`curl -H "Host: ServiceURL"  http://localhost`



##Create a persistent volume, I am using a local path /tmp/db
Use `kubectl apply -f mongo-pv.yaml`

##Obtain the persistent volume
Use `kubectl apply -f mongo-pvc.yaml`

##Create Secret
convert the strings(username:my-app, password:123123) to base64 as follows:
`echo -n 'mya-app' | base64`
The output is:
bXktYXBw

`echo -n '123123' | base64`
The output is:
MTIzMTIz

create the Secret using `kubectl apply -f ./secret.yaml`

Create the mongo deployment using:
`kubectl apply -f mongo.yaml`

Create the mongo service deployment using:
`kubectl apply -f mongo-svc.yaml`

I used the MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD variables to initialize the admin DB with a username and password in mongo.yaml, and get its values from the secret.

##Re-create the service using:
`kubectl apply -f service.yaml`

You can see the image used in the service from Dockerfile and app.py.

To test the app use:
`kubectl get svc`
will show the service URL.

Use curl to test the app:
`curl -H "Host: helloworld-python.default.example.com"  http://localhost`

##Create the CronJob
`kubectl apply -f cronjob.yaml`






