from django.contrib.auth import login, logout
from backend.logging_config import logger
from backend.settings import DEBUG, DEV_EMAIL, WEBSITE_URL
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import permissions, status, generics
from .models import AppUser
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from django.utils.encoding import force_bytes


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
                return Response(status=status.HTTP_201_CREATED)
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
                {"error_msg": {"password" : ["Invalid old password"]}}, status=status.HTTP_400_BAD_REQUEST
            )
        # Validate the new password with my custom validation
        serializer = UserSerializer()
        try:
            serializer.validate_password(new_password)
        except Exception as e:
            if DEBUG:
                logger.debug(f"Invalid new password: {new_password}")
            error_msg = e.args # Get the error message (the exception is a tuple)
            return Response(
                {"error_msg": {"password": [error_msg[0]]}}, status=status.HTTP_400_BAD_REQUEST
            )
        user.set_password(new_password)
        user.save()
        logger.info(f"Password updated: {user}")
        # Update session to prevent logging out the user after changing the password
        update_session_auth_hash(request, user)
        return Response(
            {"success_msg": "Password updated successfully"}, status=status.HTTP_200_OK
        )
        

class PasswordResetView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error_msg": {"email": ["Email is required"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = AppUser.objects.filter(email=email).first()
        if not user:
            return Response(
                {"error_msg": {"email": ["This email is not registered"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Generate a token for the password reset link
        user_email = DEV_EMAIL if DEBUG else user.email
        token = default_token_generator.make_token(user)
        # Send the password reset email
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f'{WEBSITE_URL}/reset-password?token={token}&uid={uid}'
        try:
            send_mail(
                'Password Reset Request',
                f'Please click on the link to reset your password: {reset_link}',
                WEBSITE_URL,
                [user_email],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Failed to send password reset email: {e}")
            return Response(
                {"error_msg": {"email": ["Failed to send the password reset email"]}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if DEBUG:
            logger.debug(f"Password reset email sent to: {user_email}")
            logger.debug(f"Reset link: {reset_link}")
        return Response(
            {"success_msg": "Password reset email sent successfully"},
            status=status.HTTP_200_OK,
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
                {"error_msg": {"login_infos": ["Email and password are required"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = AppUser.objects.filter(email=email).first()
        if not user or not user.check_password(password):
            return Response(
                {"error_msg": {"invalid_login": ["Invalid email or password"]}},
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
            {"error_msg": {"logout_error" : ["User is not logged in"]}}, status=status.HTTP_400_BAD_REQUEST
        )
