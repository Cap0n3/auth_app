from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
import unittest

TEST_USER = {"email": "test@test.com", "username": "test", "password": "testpassword"}


class TestUserRegister(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse("register")

    def test_register_success(self):
        response = self.client.post(self.register_url, TEST_USER)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], TEST_USER["email"])
        self.assertEqual(response.data["username"], TEST_USER["username"])

    def test_bad_email(self):
        response = self.client.post(
            self.register_url,
            {
                "email": "test.com",
                "username": TEST_USER["username"],
                "password": TEST_USER["password"],
            },
        )
        self.assertEqual(response.data["error_msg"][0], "Enter a valid email address.")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_existing_email(self):
        get_user_model().objects.create_user(
            email=TEST_USER["email"],
            username=TEST_USER["username"],
            password=TEST_USER["password"],
        )
        response = self.client.post(self.register_url, TEST_USER)
        self.assertEqual(
            response.data["error_msg"][0],
            "Please choose another email, this one is already taken",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_username(self):
        response = self.client.post(
            self.register_url,
            {
                "email": TEST_USER["email"],
                "username": "",
                "password": TEST_USER["password"],
            },
        )
        self.assertEqual(
            response.data["error_msg"][0], "Please, you must choose a username"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bad_username(self):
        response = self.client.post(
            self.register_url,
            {
                "email": TEST_USER["email"],
                "username": "#@Bad!<i>$",
                "password": TEST_USER["password"],
            },
        )
        self.assertEqual(
            response.data["error_msg"][0],
            "Please choose another username, only letters, numbers, and ._- are allowed",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bad_password(self):
        response = self.client.post(
            self.register_url,
            {
                "email": TEST_USER["email"],
                "username": TEST_USER["username"],
                "password": "2short",
            },
        )
        self.assertEqual(
            response.data["error_msg"][0],
            "Please choose another password, min 8 characters",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestUserLogin(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email=TEST_USER["email"],
            username=TEST_USER["username"],
            password=TEST_USER["password"],
        )
        self.login_url = reverse("login")

    def test_login_success(self):
        response = self.client.post(
            self.login_url,
            {"email": TEST_USER["email"], "password": TEST_USER["password"]},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)

    def test_bad_email(self):
        response = self.client.post(
            self.login_url, {"email": "test.com", "password": TEST_USER["password"]}
        )
        self.assertEqual(response.data["error_msg"], "Invalid email or password")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bad_password(self):
        response = self.client.post(
            self.login_url, {"email": TEST_USER["email"], "password": "wrongpassword"}
        )
        self.assertEqual(response.data["error_msg"], "Invalid email or password")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestUserLogout(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email=TEST_USER["email"],
            username=TEST_USER["username"],
            password=TEST_USER["password"],
        )
        self.login_url = reverse("login")
        self.logout_url = reverse("logout")

    def test_logout_success(self):
        self.client.post(
            self.login_url,
            {"email": TEST_USER["email"], "password": TEST_USER["password"]},
        )
        response = self.client.post(self.logout_url)
        self.assertEqual(response.data["success_msg"], "User logged out successfully")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_not_logged_in(self):
        response = self.client.post(self.logout_url)
        self.assertEqual(response.data["error_msg"], "User is not logged in")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestUserRetrieveView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email=TEST_USER["email"],
            username=TEST_USER["username"],
            password=TEST_USER["password"],
        )
        self.login_url = reverse("login")
        self.retrieve_url = reverse("user")

    def test_retrieve_success(self):
        self.client.post(
            self.login_url,
            {"email": TEST_USER["email"], "password": TEST_USER["password"]},
        )
        response = self.client.get(self.retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["username"], self.user.username)

    def test_not_logged_in(self):
        response = self.client.get(self.retrieve_url)
        self.assertEqual(
            response.data["detail"], "Authentication credentials were not provided."
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
