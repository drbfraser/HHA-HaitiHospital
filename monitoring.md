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
-   go to datasources, locate the server URL, username and password
-   put those env variables to the root folder
-   if you’re using macOS or windows, make sure docker desktop is
-   run `docker compose -f docker-compose.yml -f docker-compose.override.yml up`
    -   getting an error because you haven’t started docker desktop
        
        > Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
        
    -   but what are we actually doing here?
        
        -   we’re starting services that are defined in our docker-compose.yml and docker-compose.override.yml file
       - what happens after this?
	       -  A Node.js server (`server` service).
			-   A MongoDB instance (`mongodb` service).
			-   A Fluent Bit logger (`logger` service) configured to forward logs to Loki and Prometheus.
			-   A Node.js client (`client` service) for development.
- what in the world is going on??????
