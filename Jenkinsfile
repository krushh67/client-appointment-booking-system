pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'appointment-booking-api'
        DOCKER_TAG = "v${env.BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
    }
}
