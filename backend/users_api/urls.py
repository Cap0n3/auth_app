from django.urls import path
from . import views

urlpatterns = [
    # path("register", views.UserRegister.as_view(), name="register"),
    # path("login", views.UserLogin.as_view(), name="login"),
    # path("logout", views.UserLogout.as_view(), name="logout"),
    path("user", views.UserRetrieveView.as_view(), name="user"),
    path("register", views.UserCreateView.as_view(), name="register"),
    path("login", views.UserLogin.as_view(), name="login"),
    path("logout", views.UserLogout.as_view(), name="logout"),
    path("update", views.UserUpdateView.as_view(), name="update"),
]
