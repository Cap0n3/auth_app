from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model

print("Hello, World!")

class TestUserRegister(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')

    def test_register_success(self):
        response = self.client.post(self.register_url, {'email': 'test@test.com', 'username': 'test', 'password': 'testpassword'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], 'test@test.com')
        self.assertEqual(response.data['username'], 'test')

class TestUserLogin(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(email='test@test.com', username='test', password='testpassword')
        self.login_url = reverse('login')

    def test_login_success(self):
        response = self.client.post(self.login_url, {'email': 'test@test.com', 'password': 'testpassword'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)


