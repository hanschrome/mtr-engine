all:
	@echo "up: Run docker compose";
	@echo "down: Stop docker compose";
	@echo "install: Force build docker, up the container and gives permission to volume /data";
	@echo "bash: access bash from docker node container";
	@echo "unit: Run unit tests";
	@echo "repo=http://... add: Install the requested trading algorithm from a git repo";
up:
	docker-compose up -d | docker compose up -d;
down:
	docker-compose down | docker compose down;
install:
	@echo "Running docker compose...";
	@docker compose up -d --build;

	@echo "Checking permissions for data directory";
	@docker exec -it mtr-engine chmod 777 -R data/;
bash:
	docker exec -it mtr-engine bash;
unit:
	@docker exec -it mtr-engine npm run test:unit;
add:
	cd mtr-engine/domain/robot/engines/trading-algorithms && \
	git clone $(repo);

