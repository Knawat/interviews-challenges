Follow below commands to create infrastucture for Node+mongo application

All these file considers under directory "myapp" as below :


#Create User and role
1) kubectl apply -f admin-user.yml
2) kubectl apply -f admin-user-role.yml
#Output for the user we created
 kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep admin-user | awk '{print $1}')

#Create secret base64 string using below command to set Mongo DB secret variable
$ echo -n mongodb://mongo:27017 | base64
(Similarlly, we can set other secrets also i.e. DB user, DB PWD etc)

#Replace this output encoded value in to the secret.yml file with SECERT_VALUE string

#Create a secret
kubectl apply -f secret.yml 
(We can create this within our user defined namesaoce also, currently I am following default )

#Create all require deployment & it's services to run below commands
kubectl apply -f mongo.yml
kubectl apply -f kubernetes.yml 
kubectl apply -f cron.yml


Summary : 
- MongoDb will run on 27017 port with internal access only
- Node application will run on port 80 with outside of the docker network
- Node application run with 3 replicas
- Persistance volume for Mongo path is /data/db
- Ping every 2 minute by Cron deployment on port 80 http://localhost

---------------------------------------------------------------------------

Note: Not set the HTTPS for cron as if require then I need some DNS to register a free certificate. 
Yes but we can do it (Reference steps website 
https://dev.to/martinpham/secure-your-kubernetes-application-with-https-ng7 )

