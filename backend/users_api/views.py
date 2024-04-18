from django.contrib.auth import login, logout
from backend.logging_config import logger
from backend.settings import (
    DEBUG,
    OWNER_EMAIL,
    TEST_EMAIL_SENDER,
    TEST_EMAIL_RECEIVER,
    WEBSITE_URL,
)
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import permissions, status, generics
from .models import AppUser
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
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
            logger.debug(f"UserRetrieveView -> User logged: {self.request.user}")
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
                logger.info(f"UserCreateView -> New user created : {user}")
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
            logger.info(f"UserUpdateView -> User updated : {request.user}")
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

    def get_object(self):
        return self.request.user

    def post(self, request, *args, **kwargs):
        user = self.get_object()
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not user.check_password(old_password):
            if DEBUG:
                logger.debug(f"ChangePasswordView -> Invalid old password : {old_password}")
            logger.error(f"ChangePasswordView -> Invalid old password")
            return Response(
                {"error_msg": {"password": ["Invalid old password"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Validate the new password with my custom validation
        serializer = UserSerializer()
        try:
            serializer.validate_password(new_password)
        except Exception as e:
            if DEBUG:
                logger.debug(f"ChangePasswordView -> Invalid new password : {new_password}")
            logger.error(f"ChangePasswordView -> Invalid new password")
            error_msg = e.args  # Get the error message (the exception is a tuple)
            return Response(
                {"error_msg": {"password": [error_msg[0]]}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(new_password)
        user.save()
        logger.info(f"ChangePasswordView -> Password updated : {user}")
        # Update session to prevent logging out the user after changing the password
        update_session_auth_hash(request, user)
        return Response(
            {"success_msg": "Password updated successfully"}, status=status.HTTP_200_OK
        )


class SendPasswordResetView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get_user_by_email(self, email):
        try:
            return AppUser.objects.get(email=email)
        except AppUser.DoesNotExist:
            logger.error("No user found with email: {}".format(email))
            return None

    def post(self, request):
        email = request.data.get("email")
        if not email:
            logger.error("SendPasswordResetView -> Email is required")
            return Response(
                {"error_msg": {"email": ["Email is required"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = self.get_user_by_email(email)
        if not user:
            logger.error(f"SendPasswordResetView -> This email is not registered : {email}")
            return Response(
                {"error_msg": {"email": ["This email is not registered"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Prepare the email
        sender = TEST_EMAIL_SENDER if DEBUG else OWNER_EMAIL
        user_email = TEST_EMAIL_RECEIVER if DEBUG else user.email
        # Generate a token for the password reset link
        token = default_token_generator.make_token(user)
        # Send the password reset email
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{WEBSITE_URL}/reset-password?token={token}&uid={uid}"
        try:
            logger.info(f"SendPasswordResetView -> Password reset email sent to : {user_email}")
            send_mail(
                "Password Reset Request",
                f"Please click on the link to reset your password: {reset_link}",
                sender,
                [user_email],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"SendPasswordResetView -> Failed to send password reset email : {e}")
            return Response(
                {"error_msg": {"email": ["Failed to send the password reset email"]}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if DEBUG:
            logger.debug(f"SendPasswordResetView -> Password reset email sent to : {user_email}")
            logger.debug(f"SendPasswordResetView -> Reset link : {reset_link}")
        return Response(
            {"success_msg": "Password reset email sent successfully"},
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get_user_by_uid(self, uid):
        try:
            uid = urlsafe_base64_decode(uid)
            return AppUser.objects.get(pk=uid)
        except Exception as e:
            logger.error(f"ResetPasswordView -> Invalid UID : {uid}")
            return None

    def post(self, request):
        token = request.data.get("token")
        uid = request.data.get("uid")
        new_password = request.data.get("new_password")
        if not token or not uid or not new_password:
            logger.error("ResetPasswordView -> Token, UID and new password are required")
            return Response(
                {
                    "error_msg": {
                        "reset_infos": ["Token, UID and new password are required"]
                    }
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Decode the UID
        user = self.get_user_by_uid(uid)
        
        if not user:
            logger.error(f"ResetPasswordView -> User not found with this UID : {uid}")
            return Response(
                {"error_msg": {"uid": ["User not found with this UID"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if not default_token_generator.check_token(user, token):
            logger.error(f"ResetPasswordView -> Invalid token '{token}'")
            return Response(
                {"error_msg": {"token": ["Invalid token"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Validate the new password
        serializer = UserSerializer()
        try:
            serializer.validate_password(new_password)
        except Exception as e:
            logger.error(f"ResetPasswordView -> Invalid new password")
            error_msg = e.args
            return Response(
                {"error_msg": {"password": [error_msg[0]]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        logger.info(f"ResetPasswordView -> Password successfully reset for {user}")
        return Response(
            {"success_msg": "Password reset successfully"}, status=status.HTTP_200_OK
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
        logger.info(f"UserDeleteView -> User account deleted : {user}")
        return Response(
            {"message": "User account deleted successfully"}, status=status.HTTP_200_OK
        )


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        # Check if the user exists and the password is correct
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            logger.error("UserLogin -> Email and password are required")
            return Response(
                {"error_msg": {"login_infos": ["Email and password are required"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = AppUser.objects.filter(email=email).first()
        if not user or not user.check_password(password):
            if DEBUG:
                logger.debug(f"UserLogin -> Invalid email or password : {email}")
            logger.error("UserLogin -> Invalid email or password")
            return Response(
                {"error_msg": {"invalid_login": ["Invalid email or password"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Log the user in
        login(request, user)
        logger.info(f"UserLogin -> User logged in : {user}")

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
                logger.debug(f"UserLogout -> User logged out : {request.user}")
            return Response(
                {"success_msg": "User logged out successfully"},
                status=status.HTTP_200_OK,
            )

        if DEBUG:
            logger.debug(f"UserLogout -> User is not logged in")
        return Response(
            {"error_msg": {"logout_error": ["User is not logged in"]}},
            status=status.HTTP_400_BAD_REQUEST,
        )
