from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model


TEST_USER = {"email": "test@test.com", "username": "test", "password": "Testpassword2"}


class TestUserRegister(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse("register")

    def test_register_success(self):
        response = self.client.post(self.register_url, TEST_USER)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_bad_email(self):
        response = self.client.post(
            self.register_url,
            {
                "email": "test.com",
                "username": TEST_USER["username"],
                "password": TEST_USER["password"],
            },
        )
        self.assertEqual(response.data["error_msg"]["email"][0], "Enter a valid email address.")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_existing_email(self):
        get_user_model().objects.create_user(
            email=TEST_USER["email"],
            username=TEST_USER["username"],
            password=TEST_USER["password"],
        )
        response = self.client.post(self.register_url, TEST_USER)
        self.assertEqual(
            response.data["error_msg"]["email"][0],
            "app user with this email already exists.",
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
            response.data["error_msg"]["username"][0], "This field may not be blank."
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
            response.data["error_msg"]["username"][0],
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
            response.data["error_msg"]["password"][0],
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

    def test_no_login_infos(self):
        response = self.client.post(self.login_url, {"email": "", "password": ""})
        self.assertEqual(
            response.data["error_msg"]["login_infos"][0], "Email and password are required"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bad_email(self):
        response = self.client.post(
            self.login_url, {"email": "test.com", "password": TEST_USER["password"]}
        )
        self.assertEqual(response.data["error_msg"]["invalid_login"][0], "Invalid email or password")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bad_password(self):
        response = self.client.post(
            self.login_url, {"email": TEST_USER["email"], "password": "wrongpassword"}
        )
        self.assertEqual(response.data["error_msg"]["invalid_login"][0], "Invalid email or password")
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
        self.assertEqual(response.data["error_msg"]["logout_error"][0], "User is not logged in")
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


class TestUserUpdateView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email=TEST_USER["email"],
            username=TEST_USER["username"],
            password=TEST_USER["password"],
        )
        self.login_url = reverse("login")
        self.update_url = reverse("update")

    def test_update_success(self):
        self.client.post(
            self.login_url,
            {"email": TEST_USER["email"], "password": TEST_USER["password"]},
        )
        response = self.client.put(
            self.update_url,
            {"email": "newemail@gmail.com", "username": "newusername"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "newemail@gmail.com")
        self.assertEqual(response.data["username"], "newusername")

    def test_not_logged_in(self):
        response = self.client.put(
            self.update_url,
            {"email": "newemail@gmail.com", "username": "newusername"},
        )
        self.assertEqual(
            response.data["detail"], "Authentication credentials were not provided."
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_bad_email(self):
        self.client.post(
            self.login_url,
            {"email": TEST_USER["email"], "password": TEST_USER["password"]},
        )
        response = self.client.put(
            self.update_url,
            {"email": "bademail", "username": "newusername"},
        )
        self.assertEqual(response.data["error_msg"]["email"][0], "Enter a valid email address.")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestChangePasswordView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email=TEST_USER["email"],
            username=TEST_USER["username"],
            password=TEST_USER["password"],
        )
        self.login_url = reverse("login")
        self.change_password_url = reverse("change_password")

    def test_change_password_success(self):
        self.client.post(
            self.login_url,
            {"email": TEST_USER["email"], "password": TEST_USER["password"]},
        )
        response = self.client.post(
            self.change_password_url,
            {"old_password": TEST_USER["password"], "new_password": "Newpassword2"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["success_msg"], "Password updated successfully")

    def test_not_logged_in(self):
        response = self.client.put(
            self.change_password_url,
            {"old_password": TEST_USER["password"], "new_password": "Newpassword2"},
        )
        self.assertEqual(
            response.data["detail"], "Authentication credentials were not provided."
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_bad_old_password(self):
        self.client.post(
            self.login_url,
            {"email": TEST_USER["email"], "password": TEST_USER["password"]},
        )
        response = self.client.post(
            self.change_password_url,
            {"old_password": "wrongpassword", "new_password": "Newpassword2"},
        )
        self.assertEqual(response.data["error_msg"]["password"][0], "Invalid old password")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bad_new_password(self):
        self.client.post(
            self.login_url,
            {"email": TEST_USER["email"], "password": TEST_USER["password"]},
        )
        response = self.client.post(
            self.change_password_url,
            {"old_password": TEST_USER["password"], "new_password": "2short"},
        )
        self.assertEqual(
            response.data["error_msg"]["password"][0], "Please choose another password, min 8 characters"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestPasswordResetView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email=TEST_USER["email"],
            username=TEST_USER["username"],
            password=TEST_USER["password"],
        )
        self.reset_password_url = reverse("reset_password")

    def test_reset_password_success(self):
        response = self.client.post(self.reset_password_url, {"email": TEST_USER["email"]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["success_msg"], "Password reset email sent successfully")

    def test_bad_email(self):
        response = self.client.post(self.reset_password_url, {"email": "bademail@gmail.com"})
        self.assertEqual(response.data["error_msg"]["email"][0], "This email is not registered")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)