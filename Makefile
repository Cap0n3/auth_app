api_app_path = /Users/kim0n0/myDev/1_PROJECTS/2_Portfolio/Session_Auth_App/dj_react/backend

.PHONY: run
run:
	poetry run python $(api_app_path)/manage.py runserver

.PHONY: migrations
migrations:
	poetry run python $(api_app_path)/manage.py makemigrations

.PHONY: migrations-dry-run
migrations-dry-run:
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

.PHONY: test-all
test-all:
	poetry run python $(api_app_path)/manage.py test users_api

# Launch a specific test case by passing the test case name as an argument
# Example: make test-case case=test_user_api
.PHONY: test-case
test-case:
	poetry run python $(api_app_path)/manage.py test users_api.tests.$(case)