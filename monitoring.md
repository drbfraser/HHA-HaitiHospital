# Guide to HHA Haiti's monitoring system

### Why we need monitoring in the first place?
Taking a look at our dashboard, looks like we're tracking... for...
### The different tools we use
1. Prometheus
	- Our main tool to pull metrics from different places
2. Grafana
	- queries metrics from our Prometheus server and visualizes it on its web UI
	-
### The high level diagram

### Starting local development
-   ping @dr. brian fraser for loki and prometheus host, user, and key needed to start the docker-compose field
-   put those env variables to the root folder of 415-HHA-HAITI
-   if you’re using macOS or windows, make sure docker desktop is running in the background
-   run `docker compose -f docker-compose.yml -f docker-compose.override.yml up`
	-   but what are we actually doing here? (refer to docker-compose.yml and docker-compose.override.yml files)
		-   we’re starting services that are defined in our docker-compose.yml and docker-compose.override.yml file, which are:
			-  A Node.js server (`server` service).
            -   A MongoDB instance (`mongodb` service).
            -   A Fluent Bit logger (`logger` service) configured to forward logs to Loki and Prometheus.
            -   A Node.js client (`client` service) for development.

- you will have to run the seeding script manually by doing `docker exec -it hhahaiti_server npm run seed` 
my ultimate goal right now:
- try and interact with local app and see corresponding logs shown in grafana
- after 30 minutes of searching, couldn't find any behaviour that is reflected by the logs
  - tried invoking postman endpoints to no avail
  - 

problem right now
- after running docker-compose, I'm assuming all the services we need to use the app locally is started. That means I can start using the app like usual
- If I were to use the app in my local, the logs will be pushed to grafana right?
- the server service is missing some dependencies which leads me to the dockerfile associated with it
- how are we installing dependencies in our docker container?
	- looks like we're copying source code and dependencies from our local machine to the container, meaning all the dependencies should match container-OS (linux)
	-

things I learned:
- when calling docker-compose: we're pulling node18 docker images from dockerhub to run our servers
- but when we're deploying, that's when we're uploading our own dockerfiles to dockerhub



questions
- If i were to make changes on the data source, will it reflect on both grafana and cloudwatch?
- testt44
