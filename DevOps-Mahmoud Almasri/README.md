This is a sample project regarding to the DevOps assigment, I'll suppose that we have kubrentese cluster up and running. 

##Create a [installation instructions For Knative Serving](https://knative.dev/docs/serving/samples/hello-world/helloworld-python/) service:
This app needs Kubernetes with knative serving , and Docker intsalled.
[installation instructions For Knative Serving](https://knative.dev/docs/install/any-kubernetes-cluster/#installing-the-serving-component)

To Test the app you can use:
`kubectl get ksvc` to see the URL of the service
`curl -H "Host: ServiceURL"  http://localhost`






