from django.urls import path
from . import views

urlpatterns = [
    # path("register", views.UserRegister.as_view(), name="register"),
    # path("login", views.UserLogin.as_view(), name="login"),
    # path("logout", views.UserLogout.as_view(), name="logout"),
    path("user", views.UserRetrieveView.as_view(), name="user"),
    path("login", views.UserLogin.as_view(), name="login"),
    path("logout", views.UserLogout.as_view(), name="logout"),
    path("register", views.UserCreateView.as_view(), name="register"),
    #path("update", views.UserUpdateView.as_view(), name="update"),
    path("change_password", views.ChangePasswordView.as_view(), name="change_password"),
    path("delete", views.UserDeleteView.as_view(), name="delete"),
]
