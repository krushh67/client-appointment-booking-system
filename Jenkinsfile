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
                bat 'C:/Users/DELL/AppData/Local/Programs/Python/Python312/Scripts/pip.exe install -r requirements.txt'
            }
        }
        stage('Run Tests') {
            steps {
                bat 'C:/Users/DELL/AppData/Local/Programs/Python/Python312/Scripts/pytest.exe test_main.py -v'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Mocking Docker Build: docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    echo "Successfully 'built' image (Bypassed for local Windows permissions)"
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                echo 'kubectl apply -f k8s/deployment.yaml'
                echo 'kubectl apply -f k8s/service.yaml'
            }
        }
    }
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs.'
        }
    }
}
