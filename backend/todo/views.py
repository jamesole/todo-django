from django.shortcuts import render
from rest_framework import viewsets
from .models import Todo
from .serializer import TodoSerializer



#The viewsets base class provides the implementation for CRUD operations by default. This code specifies the serializer_class and the queryset.

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()
