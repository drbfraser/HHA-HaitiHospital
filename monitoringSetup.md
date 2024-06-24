# Guide to HHA Haiti's monitoring system

### Starting local monitoring
-   ping @dr.brian for loki and prometheus host, user, and key needed to start the docker-compose field
-   put those env variables to the root folder of 415-HHA-HAITI
-   if you’re using macOS or windows, make sure docker desktop is running in the background
-   run `docker compose -f docker-compose.yml -f docker-compose.override.yml up`
	-   but what are we actually doing here? (refer to docker-compose.yml and docker-compose.override.yml files)
		-   we’re starting services that are defined in our docker-compose.yml and docker-compose.override.yml file, which are:
			-   A Node.js server (`server` service).
            -   A MongoDB instance (`mongodb` service).
            -   A Fluent Bit logger (`logger` service) configured to forward logs to Loki and Prometheus.
            -   A Node.js client (`client` service) for development.

- if you encounter dependency error logs in server, check if your local node_modules is deleted when running the docker-compose command
- if mongodb data is empty, you will have to run the seeding script manually by doing `docker exec -it hhahaiti_server npm run seed`
- get credentials to grafana from @fma42 (filipo) or @dr.brian and login to https://cmpt415bfraser.grafana.net/
- observe logs from Dashboards > Haiti HHA > Haiti Dev Logs

### Behaviour that's being logged
- Failed login attempt
- All incoming API requests
- Failed API responses
- Node metrics