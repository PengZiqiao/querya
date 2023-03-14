# base image
FROM python:3.10.0b4-alpine3.14

# Set working directory
RUN mkdir /app
WORKDIR /app
COPY . /app

# Installing requirements
ADD requirements.txt /app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# EXPOSEport
EXPOSE 5000

# Run
CMD ["gunicorn","--bind", "0.0.0.0:5000", "wsgi:application"]