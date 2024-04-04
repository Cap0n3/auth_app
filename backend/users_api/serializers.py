from rest_framework import serializers
#from django.contrib.auth import get_user_model, authenticate
from rest_framework.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .models import AppUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('user_id', 'email', 'username', 'avatar', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = AppUser.objects.create(
            email=validated_data['email'],
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        if instance.avatar:
            instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance



#UserModel = get_user_model()


# class UserRegisterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserModel
#         fields = "__all__"

#     def create(self, clean_data):
#         user_obj = UserModel.objects.create_user(
#             email=clean_data["email"], 
#             username=clean_data["username"],
#             password=clean_data["password"]
#         )
#         #user_obj.username = clean_data["username"]
#         user_obj.save()
#         return user_obj


# class UserLoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField()

#     def user_exists(self, data):
#         # Check if the user exists and the password is correct
#         user = authenticate(username=data.get('email'), password=data.get('password'))

#         if not user:
#             raise serializers.ValidationError("Unable to log in with provided credentials.")

#         return user


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserModel
#         fields = ("email", "username", "avatar")


# class PasswordUpdateSerializer(serializers.Serializer):
#     current_password = serializers.CharField(required=True)
#     new_password = serializers.CharField(required=True)

#     def validate_new_password(self, value):
#         print("Validating password")
#         validate_password(value)
#         return value

#     def update(self, instance, validated_data):
#         instance.set_password(validated_data['new_password'])
#         instance.save()
#         return instance

#     def validate(self, attrs):
#         if not self.instance.check_password(attrs.get('current_password')):
#             raise serializers.ValidationError({"current_password": "Wrong password"})
#         return attrs