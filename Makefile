api_app_path = /Users/kim0n0/myDev/3_TESTS/react-dummy/dj_react/backend

.PHONY: run
run:
	poetry run python $(api_app_path)/manage.py runserver

.PHONY: makemigrations
makemigrations:
	poetry run python $(api_app_path)/manage.py makemigrations

.PHONY: makemigrations-dry-run
makemigrations-dry-run:
	poetry run python $(api_app_path)/manage.py makemigrations --dry-run

.PHONY: migrate
migrate:
	poetry run python $(api_app_path)/manage.py migrate

.PHONY: migrate-all
migrate-all:
	poetry run python $(api_app_path)/manage.py makemigrations
	poetry run python $(api_app_path)/manage.py migrate

.PHONY: shell
shell:
	poetry run python $(api_app_path)/manage.py shell

.PHONY: createsuperuser
createsuperuser:
	poetry run python $(api_app_path)/manage.py createsuperuser