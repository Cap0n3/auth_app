from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, UserChangePasswordSerializer
from rest_framework import permissions, status
from django.core.exceptions import ValidationError
from .validations import custom_validation, validate_email, validate_password


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            clean_data = custom_validation(request.data)
            serializer = UserRegisterSerializer(data=clean_data)
            
            if serializer.is_valid(raise_exception=True):
                user = serializer.create(clean_data)
                if user:
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        except ValidationError as e:
            return Response({"error_msg": e.message}, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        # This will raise a ValidationError if inputs are invalid
        serializer.is_valid(raise_exception=True)

        # Custom method to check if the user exists and the password is correct
        user = serializer.user_exists(serializer.validated_data)

        # Log the user in
        login(request, user)

        return Response({
            'username': user.username,
            'email': user.email,
            'avatar': user.avatar.url,
            'message': 'User logged in successfully'
        }, status=status.HTTP_200_OK)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)
    
    def put(self, request):
        print(request.data)
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

class UserChangePassword(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def put(self, request):
        try:
            print(request.data)
            # current_password = request.data.get("current_password")
            # new_password = request.data.get("new_password")
            # # Check if the current password is correct
            # serializer = UserChangePasswordSerializer(data=request.data, context={"request": request})
            # serializer.is_valid(raise_exception=True)
            # user = request.user
            # user.set_password(new_password)
            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error_msg": e.message}, status=status.HTTP_400_BAD_REQUEST)
