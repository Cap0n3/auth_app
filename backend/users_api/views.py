from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import permissions, status, generics
from django.core.exceptions import ValidationError
from .validations import custom_validation, validate_email
from django.contrib.auth.password_validation import validate_password
from .models import AppUser
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


class UserRetrieveView(generics.RetrieveAPIView):
    """
    Retrieve the user's information
    """
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserCreateView(generics.CreateAPIView):
    """
    Create a new user
    """
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = UserSerializer

    def post(self, request):
        try:
            clean_data = custom_validation(request.data)
            serializer = UserSerializer(data=clean_data)
            
            if serializer.is_valid(raise_exception=True):
                user = serializer.create(clean_data)
                if user:
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        except ValidationError as e:
            return Response({"error_msg": e.message}, status=status.HTTP_400_BAD_REQUEST)


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
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        # Check if the user exists and the password is correct
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response({"error_msg": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = AppUser.objects.filter(email=email).first()
        if not user or not user.check_password(password):
            return Response({"error_msg": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Log the user in
        login(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


# class UserRegister(APIView):
#     permission_classes = (permissions.AllowAny,)

#     def post(self, request):
#         try:
#             clean_data = custom_validation(request.data)
#             serializer = UserRegisterSerializer(data=clean_data)
            
#             if serializer.is_valid(raise_exception=True):
#                 user = serializer.create(clean_data)
#                 if user:
#                     return Response(serializer.data, status=status.HTTP_201_CREATED)
            
#             return Response(status=status.HTTP_400_BAD_REQUEST)
        
#         except ValidationError as e:
#             return Response({"error_msg": e.message}, status=status.HTTP_400_BAD_REQUEST)


# class UserLogin(APIView):
#     permission_classes = (permissions.AllowAny,)
#     authentication_classes = (SessionAuthentication,)

#     def post(self, request):
#         serializer = UserLoginSerializer(data=request.data)

#         # This will raise a ValidationError if inputs are invalid
#         serializer.is_valid(raise_exception=True)

#         # Custom method to check if the user exists and the password is correct
#         user = serializer.user_exists(serializer.validated_data)

#         # Log the user in
#         login(request, user)

#         return Response({
#             'username': user.username,
#             'email': user.email,
#             'avatar': user.avatar.url,
#             'message': 'User logged in successfully'
#         }, status=status.HTTP_200_OK)


# class UserLogout(APIView):
#     permission_classes = (permissions.AllowAny,)
#     authentication_classes = ()

#     def post(self, request):
#         logout(request)
#         return Response(status=status.HTTP_200_OK)


# class UserView(APIView):
#     permission_classes = (permissions.IsAuthenticated,)
#     authentication_classes = (SessionAuthentication,)

#     def get(self, request):
#         serializer = UserSerializer(request.user)
#         return Response({"user": serializer.data}, status=status.HTTP_200_OK)
    
#     def put(self, request):
#         print(request.data)
#         serializer = UserSerializer(request.user, data=request.data, partial=True)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(status=status.HTTP_400_BAD_REQUEST)
    

# class UserChangePassword(APIView):
#     permission_classes = (permissions.IsAuthenticated,)
#     authentication_classes = (SessionAuthentication,)

#     def put(self, request):
#         serializer = PasswordUpdateSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             print("Valid data")
#             user = serializer.check_current_password(request.user, serializer.validated_data)
#             #serializer.update(user, serializer.validated_data)
#             return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
    
    # def put(self, request):
    #     # Check if the old password is correct
    #     current_password = request.data.get("current_password")
    #     if not request.user.check_password(current_password):
    #         return Response({"error_msg": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

    #     # Validate the new password
    #     new_password = request.data.get("password")
    #     try:
    #         validated_password = validate_password(new_password)
    #         request.user.set_password(validated_password)
    #         request.user.save()
    #         return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
    #     except ValidationError as e:
    #         return Response({"error_msg": e.messages}, status=status.HTTP_400_BAD_REQUEST)
