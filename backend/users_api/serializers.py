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
