from django.contrib.auth import login, logout
from backend.logging_config import logger
from backend.settings import DEBUG
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import permissions, status, generics
from .models import AppUser
from django.contrib.auth import update_session_auth_hash


class UserRetrieveView(generics.RetrieveAPIView):
    """
    Retrieve the user's information
    """

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    serializer_class = UserSerializer

    def get_object(self):
        if DEBUG:
            logger.debug(f"User logged: {self.request.user}")
        return self.request.user


class UserCreateView(generics.CreateAPIView):
    """
    Create a new user
    """

    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = UserSerializer

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.create(request.data)
            if user:
                logger.info(f"New user created: {user}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"error_msg": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )


class UserUpdateView(generics.UpdateAPIView):
    """
    Update the user's information
    """

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def put(self, request):
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={
                "request": request
            },  # Must provide context to get the full URL of the avatar
        )
        if serializer.is_valid():
            logger.info(f"User updated: {request.user}")
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error_msg": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )


class ChangePasswordView(generics.UpdateAPIView):
    """
    Change the user's password
    """

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not user.check_password(old_password):
            if DEBUG:
                logger.debug(f"Invalid old password: {old_password}")
            return Response(
                {"error_msg": "Invalid old password"}, status=status.HTTP_400_BAD_REQUEST
            )
        # Validate the new password with my custom validation
        UserSerializer().validate_password(new_password)
        user.set_password(new_password)
        user.save()
        logger.info(f"Password updated: {user}")
        # Update session to prevent logging out the user after changing the password
        update_session_auth_hash(request, user)
        return Response(
            {"success_msg": "Password updated successfully"}, status=status.HTTP_200_OK
        )
        


class UserDeleteView(generics.DestroyAPIView):
    """
    Delete the user's account
    """

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def delete(self, request):
        user = self.get_object()
        user.delete()
        logger.info(f"User account deleted: {user}")
        return Response(
            {"message": "User account deleted successfully"}, status=status.HTTP_200_OK
        )


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        # Check if the user exists and the password is correct
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response(
                {"error_msg": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = AppUser.objects.filter(email=email).first()
        if not user or not user.check_password(password):
            return Response(
                {"error_msg": "Invalid email or password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Log the user in
        login(request, user)
        serializer = UserSerializer(
            user, context={"request": request}
        )  # Must provide context to get the full URL of the avatar
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
            if DEBUG:
                logger.debug(f"User logged out: {request.user}")
            return Response(
                {"success_msg": "User logged out successfully"},
                status=status.HTTP_200_OK,
            )

        if DEBUG:
            logger.debug(f"User is not logged in")
        return Response(
            {"error_msg": "User is not logged in"}, status=status.HTTP_400_BAD_REQUEST
        )
