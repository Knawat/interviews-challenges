This is a sample project regarding to the DevOps assigment, I'll suppose that we have kubrentese cluster up and running. 

##Create a [installation instructions For Knative Serving](https://knative.dev/docs/serving/samples/hello-world/helloworld-python/) service:
This app needs Kubernetes with knative serving , and Docker intsalled.
[installation instructions For Knative Serving](https://knative.dev/docs/install/any-kubernetes-cluster/#installing-the-serving-component)

To Test the app you can use:
`kubectl get ksvc` to see the URL of the service
`curl -H "Host: ServiceURL"  http://localhost`



##Create a persistent volume, I am using a local path /tmp/db
Use `kubectl create -f mongo-pv.yaml`

##Obtain the persistent volume
Use `kubectl create -f mongo-pvc.yaml`

##Create Secret
convert the strings(username:my-app, password:123123) to base64 as follows:
`echo -n 'mya-app' | base64`
The output is:
bXktYXBw

`echo -n '123123' | base64`
The output is:
MTIzMTIz

create the Secret using `kubectl apply -f ./secret.yaml`







