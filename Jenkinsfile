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
        stage('Install Dependencies') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'pytest test_main.py -v'
            }
        }
    }
}
